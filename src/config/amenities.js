// ─────────────────────────────────────────────────────────────
//  StayKit — Catalogo servizi e dotazioni
//
//  Elenco chiuso e riutilizzabile: il cliente spunta le voci dal
//  pannello invece di scriverle a mano. Vantaggi: traduzioni
//  automatiche in tutte le lingue, icone coerenti e nessun refuso.
//  Restano possibili voci libere (custom) per i casi particolari.
// ─────────────────────────────────────────────────────────────

export const AMENITY_CATEGORIES = {
  essentials: { label: 'Essenziali', order: 1 },
  comfort: { label: 'Comfort', order: 2 },
  kitchen: { label: 'Cucina', order: 3 },
  outdoor: { label: 'Esterni', order: 4 },
  services: { label: 'Servizi', order: 5 },
  access: { label: 'Accesso e accessibilità', order: 6 },
  rules: { label: 'Regole', order: 7 },
}

/** key → { cat, icon, label: {it,en,de,fr} } */
export const AMENITIES = {
  wifi: { cat: 'essentials', icon: 'wifi', label: { it: 'Wi-Fi gratuito', en: 'Free Wi-Fi', de: 'Kostenloses WLAN', fr: 'Wi-Fi gratuit' } },
  ac: { cat: 'essentials', icon: 'ac', label: { it: 'Aria condizionata', en: 'Air conditioning', de: 'Klimaanlage', fr: 'Climatisation' } },
  heating: { cat: 'essentials', icon: 'heat', label: { it: 'Riscaldamento', en: 'Heating', de: 'Heizung', fr: 'Chauffage' } },
  privateBathroom: { cat: 'essentials', icon: 'bath', label: { it: 'Bagno privato', en: 'Private bathroom', de: 'Eigenes Bad', fr: 'Salle de bain privée' } },
  hotWater: { cat: 'essentials', icon: 'drop', label: { it: 'Acqua calda', en: 'Hot water', de: 'Warmwasser', fr: 'Eau chaude' } },
  linen: { cat: 'essentials', icon: 'bed', label: { it: 'Biancheria da letto', en: 'Bed linen', de: 'Bettwäsche', fr: 'Linge de lit' } },
  towels: { cat: 'essentials', icon: 'towel', label: { it: 'Asciugamani', en: 'Towels', de: 'Handtücher', fr: 'Serviettes' } },

  tv: { cat: 'comfort', icon: 'tv', label: { it: 'TV', en: 'TV', de: 'TV', fr: 'TV' } },
  safe: { cat: 'comfort', icon: 'lock', label: { it: 'Cassaforte', en: 'Safe', de: 'Safe', fr: 'Coffre-fort' } },
  hairdryer: { cat: 'comfort', icon: 'wind', label: { it: 'Asciugacapelli', en: 'Hairdryer', de: 'Föhn', fr: 'Sèche-cheveux' } },
  desk: { cat: 'comfort', icon: 'desk', label: { it: 'Scrivania', en: 'Desk', de: 'Schreibtisch', fr: 'Bureau' } },
  wardrobe: { cat: 'comfort', icon: 'wardrobe', label: { it: 'Armadio', en: 'Wardrobe', de: 'Kleiderschrank', fr: 'Armoire' } },
  soundproof: { cat: 'comfort', icon: 'sound', label: { it: 'Camera insonorizzata', en: 'Soundproof room', de: 'Schallgedämmt', fr: 'Chambre insonorisée' } },
  crib: { cat: 'comfort', icon: 'baby', label: { it: 'Culla su richiesta', en: 'Crib on request', de: 'Babybett auf Anfrage', fr: 'Lit bébé sur demande' } },
  commonRoom: { cat: 'comfort', icon: 'sofa', label: { it: 'Sala comune', en: 'Common lounge', de: 'Gemeinschaftsraum', fr: 'Salon commun' } },

  breakfast: { cat: 'kitchen', icon: 'coffee', label: { it: 'Colazione inclusa', en: 'Breakfast included', de: 'Frühstück inklusive', fr: 'Petit-déjeuner inclus' } },
  kitchen: { cat: 'kitchen', icon: 'kitchen', label: { it: 'Cucina attrezzata', en: 'Equipped kitchen', de: 'Küche', fr: 'Cuisine équipée' } },
  kitchenette: { cat: 'kitchen', icon: 'kitchen', label: { it: 'Angolo cottura', en: 'Kitchenette', de: 'Küchenzeile', fr: 'Kitchenette' } },
  fridge: { cat: 'kitchen', icon: 'fridge', label: { it: 'Frigorifero', en: 'Fridge', de: 'Kühlschrank', fr: 'Réfrigérateur' } },
  dishwasher: { cat: 'kitchen', icon: 'dish', label: { it: 'Lavastoviglie', en: 'Dishwasher', de: 'Geschirrspüler', fr: 'Lave-vaisselle' } },
  kettle: { cat: 'kitchen', icon: 'coffee', label: { it: 'Bollitore / macchina caffè', en: 'Kettle / coffee machine', de: 'Wasserkocher / Kaffeemaschine', fr: 'Bouilloire / machine à café' } },
  farmProducts: { cat: 'kitchen', icon: 'leaf', label: { it: 'Prodotti dell’azienda', en: 'Farm produce', de: 'Hofprodukte', fr: 'Produits de la ferme' } },

  terrace: { cat: 'outdoor', icon: 'terrace', label: { it: 'Terrazza', en: 'Terrace', de: 'Terrasse', fr: 'Terrasse' } },
  balcony: { cat: 'outdoor', icon: 'terrace', label: { it: 'Balcone', en: 'Balcony', de: 'Balkon', fr: 'Balcon' } },
  garden: { cat: 'outdoor', icon: 'tree', label: { it: 'Giardino', en: 'Garden', de: 'Garten', fr: 'Jardin' } },
  pool: { cat: 'outdoor', icon: 'pool', label: { it: 'Piscina', en: 'Swimming pool', de: 'Pool', fr: 'Piscine' } },
  seaView: { cat: 'outdoor', icon: 'wave', label: { it: 'Vista mare', en: 'Sea view', de: 'Meerblick', fr: 'Vue mer' } },
  bbq: { cat: 'outdoor', icon: 'fire', label: { it: 'Barbecue', en: 'Barbecue', de: 'Grill', fr: 'Barbecue' } },
  outdoorFurniture: { cat: 'outdoor', icon: 'chair', label: { it: 'Arredi da esterno', en: 'Outdoor furniture', de: 'Gartenmöbel', fr: 'Mobilier d’extérieur' } },

  parking: { cat: 'services', icon: 'parking', label: { it: 'Parcheggio gratuito', en: 'Free parking', de: 'Kostenlose Parkplätze', fr: 'Parking gratuit' } },
  cleaning: { cat: 'services', icon: 'sparkle', label: { it: 'Pulizia finale inclusa', en: 'Final cleaning included', de: 'Endreinigung inklusive', fr: 'Ménage final inclus' } },
  washingMachine: { cat: 'services', icon: 'washer', label: { it: 'Lavatrice', en: 'Washing machine', de: 'Waschmaschine', fr: 'Lave-linge' } },
  luggageStorage: { cat: 'services', icon: 'luggage', label: { it: 'Deposito bagagli', en: 'Luggage storage', de: 'Gepäckaufbewahrung', fr: 'Consigne à bagages' } },
  bikes: { cat: 'services', icon: 'bike', label: { it: 'Biciclette a disposizione', en: 'Bikes available', de: 'Fahrräder verfügbar', fr: 'Vélos à disposition' } },
  transfer: { cat: 'services', icon: 'car', label: { it: 'Transfer su richiesta', en: 'Transfer on request', de: 'Transfer auf Anfrage', fr: 'Transfert sur demande' } },
  tourDesk: { cat: 'services', icon: 'map', label: { it: 'Consigli e itinerari', en: 'Local tips & itineraries', de: 'Tipps & Routen', fr: 'Conseils et itinéraires' } },

  selfCheckin: { cat: 'access', icon: 'key', label: { it: 'Check-in autonomo', en: 'Self check-in', de: 'Self-Check-in', fr: 'Arrivée autonome' } },
  lift: { cat: 'access', icon: 'lift', label: { it: 'Ascensore', en: 'Lift', de: 'Aufzug', fr: 'Ascenseur' } },
  groundFloor: { cat: 'access', icon: 'stairs', label: { it: 'Accesso senza scale', en: 'Step-free access', de: 'Stufenloser Zugang', fr: 'Accès sans escalier' } },
  lateCheckin: { cat: 'access', icon: 'clock', label: { it: 'Check-in serale', en: 'Late check-in', de: 'Später Check-in', fr: 'Arrivée tardive' } },

  petsAllowed: { cat: 'rules', icon: 'paw', label: { it: 'Animali ammessi', en: 'Pets allowed', de: 'Haustiere erlaubt', fr: 'Animaux acceptés' } },
  nonSmoking: { cat: 'rules', icon: 'nosmoke', label: { it: 'Non fumatori', en: 'Non-smoking', de: 'Nichtraucher', fr: 'Non-fumeur' } },
  familyFriendly: { cat: 'rules', icon: 'family', label: { it: 'Adatto alle famiglie', en: 'Family friendly', de: 'Familienfreundlich', fr: 'Adapté aux familles' } },
}

export const AMENITY_KEYS = Object.keys(AMENITIES)

/** Etichetta tradotta con fallback su italiano. */
export function amenityLabel(key, lang = 'it') {
  const a = AMENITIES[key]
  if (!a) return key
  return a.label[lang] || a.label.it || key
}

/** Raggruppa una lista di chiavi per categoria, ordinata. */
export function groupAmenities(keys = []) {
  const groups = {}
  for (const key of keys) {
    const a = AMENITIES[key]
    const cat = a?.cat || 'services'
    ;(groups[cat] ||= []).push(key)
  }
  return Object.entries(groups)
    .sort((a, b) => (AMENITY_CATEGORIES[a[0]]?.order || 99) - (AMENITY_CATEGORIES[b[0]]?.order || 99))
    .map(([cat, items]) => ({ cat, label: AMENITY_CATEGORIES[cat]?.label || cat, items }))
}
