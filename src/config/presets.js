// ─────────────────────────────────────────────────────────────
//  StayKit — Preset per tipologia di struttura
//
//  Un B&B non è un appartamento e un affittacamere non è un
//  agriturismo: cambiano il vocabolario ("camera" vs "unità"),
//  i campi utili (colazione? cucina? check-in autonomo?), le
//  sezioni proposte e il set di servizi di partenza.
//
//  Le etichette NON sono scritte qui: sono chiavi del dizionario
//  i18n (src/i18n/dictionary.js), così restano traducibili.
// ─────────────────────────────────────────────────────────────

export const PRESETS = {
  // ─────────────── Bed & Breakfast ───────────────
  bnb: {
    id: 'bnb',
    label: 'Bed & Breakfast',
    hint: 'Camere in casa del gestore, colazione inclusa, spazi comuni condivisi.',
    unit: { singular: 'unit.room.one', plural: 'unit.room.many', a: 'unit.room.a' },
    // Campi mostrati sulla scheda unità e nell'editor admin
    unitFields: ['guests', 'beds', 'bathroom', 'size', 'view', 'floor'],
    // Campi non pertinenti: nascosti anche nel pannello
    hiddenUnitFields: ['kitchen', 'washingMachine', 'selfCheckin', 'minStay'],
    sections: ['hero', 'story', 'rooms', 'breakfast', 'amenities', 'gallery', 'offers', 'reviews', 'blog', 'map', 'contact'],
    defaultAmenities: [
      'breakfast', 'wifi', 'ac', 'parking', 'garden', 'commonRoom',
      'cleaning', 'linen', 'towels', 'tv', 'petsAllowed', 'nonSmoking',
    ],
    highlights: ['breakfast', 'wifi', 'parking', 'ac'],
    copy: {
      roomsIntroKey: 'preset.bnb.roomsIntro',
      heroDefaultKey: 'preset.bnb.hero',
    },
    // Suggerimenti mostrati nel pannello, per aiutare il cliente a scrivere
    tips: [
      'Racconta la colazione: è il motivo per cui si sceglie un B&B invece di un hotel.',
      'Metti in evidenza la persona che accoglie: nei B&B si prenota anche l’ospitalità.',
    ],
  },

  // ─────────────── Affittacamere ───────────────
  affittacamere: {
    id: 'affittacamere',
    label: 'Affittacamere',
    hint: 'Camere con bagno, senza colazione e senza obbligo di presenza del gestore.',
    unit: { singular: 'unit.room.one', plural: 'unit.room.many', a: 'unit.room.a' },
    unitFields: ['guests', 'beds', 'bathroom', 'size', 'view', 'floor', 'selfCheckin'],
    hiddenUnitFields: ['kitchen', 'washingMachine'],
    sections: ['hero', 'story', 'rooms', 'amenities', 'checkin', 'gallery', 'offers', 'reviews', 'blog', 'map', 'contact'],
    defaultAmenities: [
      'wifi', 'ac', 'privateBathroom', 'parking', 'selfCheckin', 'kettle',
      'cleaning', 'linen', 'towels', 'tv', 'nonSmoking', 'luggageStorage',
    ],
    highlights: ['wifi', 'privateBathroom', 'selfCheckin', 'parking'],
    copy: {
      roomsIntroKey: 'preset.affittacamere.roomsIntro',
      heroDefaultKey: 'preset.affittacamere.hero',
    },
    tips: [
      'Spiega bene come si entra: il check-in autonomo è spesso il vero punto di forza.',
      'Indica cosa c’è nei dintorni per mangiare: non offrendo colazione, è la prima domanda.',
    ],
  },

  // ─────────────── Case e appartamenti vacanza ───────────────
  case_vacanza: {
    id: 'case_vacanza',
    label: 'Case e appartamenti',
    hint: 'Unità intere e indipendenti, con cucina, per soggiorni autonomi.',
    unit: { singular: 'unit.apartment.one', plural: 'unit.apartment.many', a: 'unit.apartment.a' },
    unitFields: ['guests', 'bedrooms', 'beds', 'bathroom', 'size', 'view', 'floor', 'kitchen', 'selfCheckin', 'minStay'],
    hiddenUnitFields: [],
    sections: ['hero', 'story', 'rooms', 'amenities', 'checkin', 'gallery', 'offers', 'reviews', 'blog', 'map', 'contact'],
    defaultAmenities: [
      'kitchen', 'wifi', 'ac', 'washingMachine', 'parking', 'terrace',
      'selfCheckin', 'linen', 'towels', 'tv', 'dishwasher', 'petsAllowed',
    ],
    highlights: ['kitchen', 'wifi', 'selfCheckin', 'parking'],
    copy: {
      roomsIntroKey: 'preset.case_vacanza.roomsIntro',
      heroDefaultKey: 'preset.case_vacanza.hero',
    },
    tips: [
      'Elenca la dotazione della cucina: chi cerca un appartamento vuole sapere se può cucinare davvero.',
      'Dichiara il soggiorno minimo: evita richieste che non puoi accettare.',
    ],
  },

  // ─────────────── Agriturismo ───────────────
  agriturismo: {
    id: 'agriturismo',
    label: 'Agriturismo',
    hint: 'Ospitalità in azienda agricola: camere o appartamenti, prodotti propri, natura.',
    unit: { singular: 'unit.unit.one', plural: 'unit.unit.many', a: 'unit.unit.a' },
    unitFields: ['guests', 'bedrooms', 'beds', 'bathroom', 'size', 'view', 'kitchen'],
    hiddenUnitFields: ['floor'],
    sections: ['hero', 'story', 'rooms', 'breakfast', 'amenities', 'gallery', 'offers', 'reviews', 'blog', 'map', 'contact'],
    defaultAmenities: [
      'breakfast', 'farmProducts', 'pool', 'garden', 'wifi', 'parking',
      'bbq', 'petsAllowed', 'bikes', 'linen', 'cleaning', 'nonSmoking',
    ],
    highlights: ['farmProducts', 'pool', 'garden', 'parking'],
    copy: {
      roomsIntroKey: 'preset.agriturismo.roomsIntro',
      heroDefaultKey: 'preset.agriturismo.hero',
    },
    tips: [
      'Racconta l’azienda agricola: cosa coltivate, cosa finisce in tavola.',
      'Le foto della natura e degli animali convertono più di quelle delle camere.',
    ],
  },
}

export const PRESET_IDS = Object.keys(PRESETS)
export const DEFAULT_PRESET = 'bnb'

export function presetFor(id) {
  return PRESETS[id] || PRESETS[DEFAULT_PRESET]
}

/** Il campo `field` ha senso per questa tipologia di struttura? */
export function unitFieldEnabled(presetId, field) {
  const p = presetFor(presetId)
  if (p.hiddenUnitFields.includes(field)) return false
  return p.unitFields.includes(field)
}
