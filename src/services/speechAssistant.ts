import { Language, ScheduleSlot, SafetyAlert } from '../types';

export interface VoiceQueryResult {
  transcript: string;
  response: string;
  actionTaken?: 'marked_taken' | 'opened_emergency' | 'showed_safety' | 'none';
  affectedSlotId?: string;
}

/**
 * Generates natural audio beep or chime using Web Audio API
 */
export function playAlertChime(type: 'reminder' | 'panic' | 'success') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'panic') {
      // Urgent authentic emergency two-tone ambulance wail (960Hz / 770Hz alternating)
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      
      // Tone 1: High wail
      osc.frequency.setValueAtTime(960, now);
      osc.frequency.setValueAtTime(770, now + 0.25);
      osc.frequency.setValueAtTime(960, now + 0.5);
      osc.frequency.setValueAtTime(770, now + 0.75);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.setValueAtTime(0.35, now + 0.9);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.1);
    } else if (type === 'reminder') {
      // Gentle two-tone chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.45);
    } else {
      // Success pleasant chord
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    console.warn('AudioContext playback error', e);
  }
}

/**
 * Text-to-speech using browser Web Speech API
 */
export function speakText(text: string, lang: Language = 'en') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower, elder-friendly pacing
  utterance.pitch = 1.0;

  if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Natural language parser for LifeLine Voice Assistant
 */
export function processVoiceCommand(
  rawQuery: string,
  schedule: ScheduleSlot[],
  alerts: SafetyAlert[],
  patientName: string = 'Raj'
): VoiceQueryResult {
  const query = rawQuery.toLowerCase().trim();

  // Next medicine query
  if (
    query.includes('next') ||
    query.includes('kab') ||
    query.includes('upcoming') ||
    query.includes('agli') ||
    query.includes('baki')
  ) {
    const upcoming = schedule.find((s) => s.status === 'upcoming' || s.status === 'pending');
    if (upcoming) {
      const resp = `Aapki next scheduled medicine ${upcoming.medicationName} (${upcoming.strength}) ${upcoming.scheduledTime} par hai.`;
      speakText(resp);
      return {
        transcript: rawQuery,
        response: resp,
        actionTaken: 'none',
      };
    } else {
      const resp = `Great news ${patientName} ji! Aaj ki sabhi scheduled medicines complete ho chuki hain.`;
      speakText(resp);
      return {
        transcript: rawQuery,
        response: resp,
        actionTaken: 'none',
      };
    }
  }

  // Mark medicine as taken
  if (
    query.includes('le li') ||
    query.includes('taken') ||
    query.includes('kha li') ||
    query.includes('done') ||
    query.includes('pi li')
  ) {
    const targetSlot = schedule.find((s) => s.status === 'upcoming' || s.status === 'pending') || schedule[0];
    if (targetSlot) {
      playAlertChime('success');
      const resp = `Shabash ${patientName} ji! Maine aapki ${targetSlot.medicationName} ko 'Taken' mark kar diya hai.`;
      speakText(resp);
      return {
        transcript: rawQuery,
        response: resp,
        actionTaken: 'marked_taken',
        affectedSlotId: targetSlot.id,
      };
    }
  }

  // Safety alerts query
  if (
    query.includes('safety') ||
    query.includes('alert') ||
    query.includes('khatra') ||
    query.includes('warning') ||
    query.includes('side effect')
  ) {
    if (alerts.length > 0) {
      const alert = alerts[0];
      const resp = `Aapke pass ${alerts.length} safety alert hai: ${alert.title}. Kripya regular meal timings rakhiye aur doctor se verify karein.`;
      speakText(resp);
      return {
        transcript: rawQuery,
        response: resp,
        actionTaken: 'showed_safety',
      };
    } else {
      const resp = `Aapki current medicines mein koi major warning detected nahi hai.`;
      speakText(resp);
      return {
        transcript: rawQuery,
        response: resp,
        actionTaken: 'showed_safety',
      };
    }
  }

  // Emergency panic query
  if (
    query.includes('emergency') ||
    query.includes('madad') ||
    query.includes('help') ||
    query.includes('pain') ||
    query.includes('dard') ||
    query.includes('ambulance') ||
    query.includes('doctor')
  ) {
    playAlertChime('panic');
    const resp = `Emergency mode activate kar diya gaya hai. Kripya 112 ya emergency contact ko call karein.`;
    speakText(resp);
    return {
      transcript: rawQuery,
      response: resp,
      actionTaken: 'opened_emergency',
    };
  }

  // Default fallback
  const defaultResp = `Namaste ${patientName} ji. Main LifeLine Assistant hoon. Aap pooch sakte hain: "Meri next medicine kab hai?", "Medicine le li", ya "Safety alerts kya hain?"`;
  speakText(defaultResp);
  return {
    transcript: rawQuery,
    response: defaultResp,
    actionTaken: 'none',
  };
}
