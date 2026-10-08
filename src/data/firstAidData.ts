export interface FirstAidTopic {
  id: string;
  title: string;
  iconName: string;
  urgency: 'critical' | 'high' | 'urgent';
  immediateAction: string;
  steps: string[];
  doNots: string[];
  cprReminder?: boolean;
}

export const FIRST_AID_TOPICS: FirstAidTopic[] = [
  {
    id: 'unconscious',
    title: 'Person Unconscious / Unresponsive',
    iconName: 'Activity',
    urgency: 'critical',
    immediateAction: 'Immediately call 112 or local emergency dispatchers. Check if the person is breathing normally.',
    steps: [
      'Call emergency services (112) immediately and set your phone on speaker.',
      'Gently tap their shoulders and shout: "Are you okay?"',
      'Check breathing: Look at chest movement for no more than 10 seconds.',
      'If NOT breathing normally: Begin CPR immediately. Place hands in center of chest and push hard and fast (100–120 beats per minute).',
      'If breathing normally: Place in Recovery Position (roll gently onto their side) to keep the airway open.',
      'Stay on the line with the emergency dispatcher and follow their spoken directions.'
    ],
    doNots: [
      'Do NOT put anything in the person’s mouth.',
      'Do NOT give water, food, or medication while unconscious.',
      'Do NOT leave the person unattended.'
    ],
    cprReminder: true,
  },
  {
    id: 'chest-pain',
    title: 'Severe Chest Pain / Possible Heart Attack',
    iconName: 'HeartPulse',
    urgency: 'critical',
    immediateAction: 'Call 112 immediately. Every minute counts.',
    steps: [
      'Call 112 without delay. State: "Suspected heart attack/severe chest pain".',
      'Keep the person sitting down in a comfortable position (half-sitting with knees bent and back supported).',
      'Loosen tight clothing around the neck and waist.',
      'Ask if they have prescribed heart medicine (e.g., Nitroglycerin spray/tablets) and help them take it as prescribed.',
      'Keep the person calm; do not allow them to walk or exert themselves.'
    ],
    doNots: [
      'Do NOT attempt to drive the patient yourself if an ambulance is en route.',
      'Do NOT give food, heavy liquids, or unprescribed pain relievers.',
      'Do NOT ignore chest pressure radiating to jaw, left arm, or back.'
    ],
  },
  {
    id: 'difficulty-breathing',
    title: 'Severe Difficulty Breathing',
    iconName: 'Wind',
    urgency: 'critical',
    immediateAction: 'Call 112 immediately. Assist into an upright seated position.',
    steps: [
      'Call 112. Inform the dispatcher of labored breathing or blueish lips.',
      'Help the person sit upright leaning slightly forward (tripod position) to ease lung expansion.',
      'If they have a prescribed inhaler (e.g. Salbutamol/Asthma inhaler), assist them with 2-4 puffs using a spacer if available.',
      'Ensure plenty of fresh air. Loosen collars, ties, and restrictive belts.',
      'Speak in calm, short reassuring sentences.'
    ],
    doNots: [
      'Do NOT force the person to lie flat on their back.',
      'Do NOT crowd the person.',
      'Do NOT offer food or liquids while struggling to breathe.'
    ],
  },
  {
    id: 'severe-bleeding',
    title: 'Severe Bleeding',
    iconName: 'Droplet',
    urgency: 'urgent',
    immediateAction: 'Apply direct, firm pressure on the wound with a clean cloth.',
    steps: [
      'Call 112 if blood is spurting or does not stop within 5 minutes.',
      'Use a clean cloth, towel, or sterile gauze and press firmly directly on the wound.',
      'Maintain continuous firm pressure. If blood soaks through, add another cloth on top without removing the first one.',
      'If possible, keep the injured limb elevated above heart level.',
      'Keep the person warm and lying down to prevent shock.'
    ],
    doNots: [
      'Do NOT remove the first cloth or lift to "check" if bleeding stopped.',
      'Do NOT remove any embedded objects (e.g., glass shards) — pack cloth around it instead.',
      'Do NOT apply an improvised tourniquet unless specifically instructed by dispatch.'
    ],
  },
  {
    id: 'choking',
    title: 'Choking (Cannot Speak or Breathe)',
    iconName: 'AlertCircle',
    urgency: 'critical',
    immediateAction: 'If they cannot cough or speak, perform 5 back blows followed by 5 abdominal thrusts (Heimlich).',
    steps: [
      'Ask: "Are you choking?" If they nod and cannot speak, act immediately.',
      'Call 112 or direct someone nearby to call 112 immediately.',
      'Give 5 sharp back blows between shoulder blades with the heel of your hand.',
      'If still blocked, perform 5 abdominal thrusts: Stand behind, place fist just above navel, pull inward and upward firmly.',
      'Alternate 5 back blows and 5 thrusts until the object clears or emergency help arrives.'
    ],
    doNots: [
      'Do NOT perform abdominal thrusts on infants under 1 year (use back slaps & chest thrusts).',
      'Do NOT perform blind finger sweeps in the mouth unless the object is clearly visible.',
      'Do NOT interfere if the person is coughing forcefully on their own.'
    ],
  },
  {
    id: 'seizure',
    title: 'Possible Seizure / Convulsion',
    iconName: 'Zap',
    urgency: 'high',
    immediateAction: 'Protect the head, move hard objects away, and track the duration.',
    steps: [
      'Time the seizure. If it lasts longer than 5 minutes or repeats, call 112 immediately.',
      'Clear the area of sharp or hard furniture to prevent injury.',
      'Place something soft (folded jacket, pillow) under their head.',
      'Loosen any tight clothing around their neck.',
      'Once jerking stops, gently turn the person onto their side into the recovery position.'
    ],
    doNots: [
      'Do NOT restrain the person or hold them down.',
      'Do NOT put ANY object or spoon in their mouth — they will not swallow their tongue.',
      'Do NOT give food, water, or pills until fully conscious and alert.'
    ],
  },
];
