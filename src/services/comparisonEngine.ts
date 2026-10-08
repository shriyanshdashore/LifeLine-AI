import { Medication, Prescription, PrescriptionDiff } from '../types';

/**
 * Normalizes medication names for matching
 */
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(' ')[0];
}

/**
 * Compares two prescriptions and classifies items into Continued, Added, Removed, and Changed
 */
export function comparePrescriptions(
  oldPrescription: Prescription,
  newPrescription: Prescription
): PrescriptionDiff {
  const oldItems = oldPrescription.items;
  const newItems = newPrescription.items;

  const continued: Medication[] = [];
  const added: Medication[] = [];
  const removed: Medication[] = [];
  const changed: { oldMed: Medication; newMed: Medication; changes: string[] }[] = [];

  const matchedOldIds = new Set<string>();

  for (const newMed of newItems) {
    const newNorm = normalizeName(newMed.name);
    const matchedOld = oldItems.find(
      (oldMed) => !matchedOldIds.has(oldMed.id) && normalizeName(oldMed.name) === newNorm
    );

    if (!matchedOld) {
      // Not in old prescription -> 🆕 Added
      added.push(newMed);
    } else {
      matchedOldIds.add(matchedOld.id);

      // Check if strength, frequency, or dosage changed
      const changes: string[] = [];
      if (matchedOld.strength.toLowerCase() !== newMed.strength.toLowerCase()) {
        changes.push(`Strength changed: ${matchedOld.strength} → ${newMed.strength}`);
      }
      if (matchedOld.frequency.toLowerCase() !== newMed.frequency.toLowerCase()) {
        changes.push(`Frequency changed: "${matchedOld.frequency}" → "${newMed.frequency}"`);
      }
      if (matchedOld.dosage.toLowerCase() !== newMed.dosage.toLowerCase()) {
        changes.push(`Dosage changed: ${matchedOld.dosage} → ${newMed.dosage}`);
      }

      if (changes.length > 0) {
        // ⚠️ Changed
        changed.push({
          oldMed: matchedOld,
          newMed,
          changes,
        });
      } else {
        // 🟢 Continued
        continued.push(newMed);
      }
    }
  }

  // Any old item not in new prescription -> 🔴 Removed
  for (const oldMed of oldItems) {
    if (!matchedOldIds.has(oldMed.id)) {
      removed.push(oldMed);
    }
  }

  return {
    continued,
    added,
    removed,
    changed,
  };
}
