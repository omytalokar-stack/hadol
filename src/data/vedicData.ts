import { PlanetKey, RashiKey, SattvikRemedy, BirthDetails } from "../types/jyotish";

export const RASHIS: {
  key: RashiKey;
  sanskrit: string;
  symbol: string;
  lord: PlanetKey;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Chara (Movable)" | "Sthira (Fixed)" | "Dwisvabhava (Dual)";
  bodyPart: string;
  qualities: string;
}[] = [
  { key: "Aries", sanskrit: "Mesha (मेष)", symbol: "♈", lord: "Mars", element: "Fire", modality: "Chara (Movable)", bodyPart: "Head & Brain", qualities: "Courageous, pioneering, ambitious, energetic" },
  { key: "Taurus", sanskrit: "Vrishabha (वृषभ)", symbol: "♉", lord: "Venus", element: "Earth", modality: "Sthira (Fixed)", bodyPart: "Face, Throat & Neck", qualities: "Steadfast, patient, resourceful, lover of beauty" },
  { key: "Gemini", sanskrit: "Mithuna (मिथुन)", symbol: "♊", lord: "Mercury", element: "Air", modality: "Dwisvabhava (Dual)", bodyPart: "Shoulders, Arms & Lungs", qualities: "Intellectual, communicative, versatile, curious" },
  { key: "Cancer", sanskrit: "Karka (कर्क)", symbol: "♋", lord: "Moon", element: "Water", modality: "Chara (Movable)", bodyPart: "Chest, Breast & Stomach", qualities: "Intuitive, nurturing, empathetic, memory-rich" },
  { key: "Leo", sanskrit: "Simha (सिंह)", symbol: "♌", lord: "Sun", element: "Fire", modality: "Sthira (Fixed)", bodyPart: "Heart & Upper Back", qualities: "Majestic, noble, self-reliant, generous, natural leader" },
  { key: "Virgo", sanskrit: "Kanya (कन्या)", symbol: "♍", lord: "Mercury", element: "Earth", modality: "Dwisvabhava (Dual)", bodyPart: "Abdomen & Digestive tract", qualities: "Analytical, methodical, service-oriented, discerning" },
  { key: "Libra", sanskrit: "Tula (तुला)", symbol: "♎", lord: "Venus", element: "Air", modality: "Chara (Movable)", bodyPart: "Lower back, Kidneys", qualities: "Harmonious, diplomatic, just, aesthetically refined" },
  { key: "Scorpio", sanskrit: "Vrishchika (वृश्चिक)", symbol: "♏", lord: "Mars", element: "Water", modality: "Sthira (Fixed)", bodyPart: "Excretory & Reproductive organs", qualities: "Transformative, profound, perceptive, determined" },
  { key: "Sagittarius", sanskrit: "Dhanu (धनु)", symbol: "♐", lord: "Jupiter", element: "Fire", modality: "Dwisvabhava (Dual)", bodyPart: "Thighs & Hips", qualities: "Philosophical, righteous, optimistic, truth-seeker" },
  { key: "Capricorn", sanskrit: "Makara (मकर)", symbol: "♑", lord: "Saturn", element: "Earth", modality: "Chara (Movable)", bodyPart: "Knees & Bones", qualities: "Disciplined, practical, persevering, structured" },
  { key: "Aquarius", sanskrit: "Kumbha (कुम्भ)", symbol: "♒", lord: "Saturn", element: "Air", modality: "Sthira (Fixed)", bodyPart: "Calves, Ankles & Circulatory", qualities: "Humanitarian, visionary, universal consciousness, original" },
  { key: "Pisces", sanskrit: "Meena (मीन)", symbol: "♓", lord: "Jupiter", element: "Water", modality: "Dwisvabhava (Dual)", bodyPart: "Feet & Lymphatic system", qualities: "Compassionate, mystical, spiritual, transcendent" },
];

export const NAKSHATRAS: {
  index: number;
  name: string;
  sanskrit: string;
  lord: PlanetKey;
  deity: string;
  gana: "Deva" | "Manushya" | "Rakshasa";
  yoni: string;
  nadi: "Aadi" | "Madhya" | "Antya";
  varna: "Brahmin" | "Kshatriya" | "Vaishya" | "Shudra";
  vashya: "Chatushpada" | "Manava" | "Jalachara" | "Vanachara" | "Keeta";
  symbol: string;
}[] = [
  { index: 0, name: "Ashwini", sanskrit: "अश्विनी", lord: "Ketu", deity: "Ashwini Kumaras", gana: "Deva", yoni: "Horse (Male)", nadi: "Aadi", varna: "Vaishya", vashya: "Chatushpada", symbol: "Horse head" },
  { index: 1, name: "Bharani", sanskrit: "भरणी", lord: "Venus", deity: "Yama", gana: "Manushya", yoni: "Elephant (Male)", nadi: "Madhya", varna: "Shudra", vashya: "Manava", symbol: "Yoni / Boat" },
  { index: 2, name: "Krittika", sanskrit: "कृत्तिका", lord: "Sun", deity: "Agni", gana: "Rakshasa", yoni: "Sheep (Female)", nadi: "Antya", varna: "Brahmin", vashya: "Chatushpada", symbol: "Razor / Flame" },
  { index: 3, name: "Rohini", sanskrit: "रोहिणी", lord: "Moon", deity: "Brahma / Prajapati", gana: "Manushya", yoni: "Serpent (Male)", nadi: "Antya", varna: "Shudra", vashya: "Chatushpada", symbol: "Ox Cart / Temple" },
  { index: 4, name: "Mrigashira", sanskrit: "मृगशिरा", lord: "Mars", deity: "Soma", gana: "Deva", yoni: "Serpent (Female)", nadi: "Madhya", varna: "Vaishya", vashya: "Chatushpada", symbol: "Deer head" },
  { index: 5, name: "Ardra", sanskrit: "आर्द्रा", lord: "Rahu", deity: "Rudra", gana: "Manushya", yoni: "Dog (Female)", nadi: "Aadi", varna: "Shudra", vashya: "Manava", symbol: "Teardrop / Diamond" },
  { index: 6, name: "Punarvasu", sanskrit: "पुनर्वसु", lord: "Jupiter", deity: "Aditi", gana: "Deva", yoni: "Cat (Female)", nadi: "Aadi", varna: "Vaishya", vashya: "Manava", symbol: "Bow & Quiver" },
  { index: 7, name: "Pushya", sanskrit: "पुष्य", lord: "Saturn", deity: "Brihaspati", gana: "Deva", yoni: "Sheep (Male)", nadi: "Madhya", varna: "Kshatriya", vashya: "Jalachara", symbol: "Cow udder / Lotus" },
  { index: 8, name: "Ashlesha", sanskrit: "आश्लेषा", lord: "Mercury", deity: "Nagas (Serpents)", gana: "Rakshasa", yoni: "Cat (Male)", nadi: "Antya", varna: "Shudra", vashya: "Keeta", symbol: "Coiled serpent" },
  { index: 9, name: "Magha", sanskrit: "मघा", lord: "Ketu", deity: "Pitris (Ancestors)", gana: "Rakshasa", yoni: "Rat (Male)", nadi: "Antya", varna: "Shudra", vashya: "Chatushpada", symbol: "Royal Throne" },
  { index: 10, name: "Purva Phalguni", sanskrit: "पूर्वा फाल्गुनी", lord: "Venus", deity: "Bhaga", gana: "Manushya", yoni: "Rat (Female)", nadi: "Madhya", varna: "Brahmin", vashya: "Chatushpada", symbol: "Front legs of couch" },
  { index: 11, name: "Uttara Phalguni", sanskrit: "उत्तरा फाल्गुनी", lord: "Sun", deity: "Aryaman", gana: "Manushya", yoni: "Cow (Male)", nadi: "Aadi", varna: "Kshatriya", vashya: "Chatushpada", symbol: "Back legs of couch" },
  { index: 12, name: "Hasta", sanskrit: "हस्त", lord: "Moon", deity: "Savitur (Sun God)", gana: "Deva", yoni: "Buffalo (Female)", nadi: "Aadi", varna: "Vaishya", vashya: "Manava", symbol: "Open Palm / Hand" },
  { index: 13, name: "Chitra", sanskrit: "चित्रा", lord: "Mars", deity: "Vishwakarma", gana: "Rakshasa", yoni: "Tiger (Female)", nadi: "Madhya", varna: "Shudra", vashya: "Manava", symbol: "Bright jewel / Pearl" },
  { index: 14, name: "Swati", sanskrit: "स्वाती", lord: "Rahu", deity: "Vayu (Wind)", gana: "Deva", yoni: "Buffalo (Male)", nadi: "Antya", varna: "Shudra", vashya: "Manava", symbol: "Young shoot of plant" },
  { index: 15, name: "Vishakha", sanskrit: "विशाखा", lord: "Jupiter", deity: "Indra & Agni", gana: "Rakshasa", yoni: "Tiger (Male)", nadi: "Antya", varna: "Brahmin", vashya: "Manava", symbol: "Triumphal Archway" },
  { index: 16, name: "Anuradha", sanskrit: "अनुराधा", lord: "Saturn", deity: "Mitra", gana: "Deva", yoni: "Deer (Female)", nadi: "Madhya", varna: "Vaishya", vashya: "Keeta", symbol: "Lotus / Triumphant Staff" },
  { index: 17, name: "Jyeshtha", sanskrit: "ज्येष्ठा", lord: "Mercury", deity: "Indra", gana: "Rakshasa", yoni: "Deer (Male)", nadi: "Aadi", varna: "Shudra", vashya: "Keeta", symbol: "Circular Talisman / Umbrella" },
  { index: 18, name: "Mula", sanskrit: "मूल", lord: "Ketu", deity: "Nirriti", gana: "Rakshasa", yoni: "Dog (Male)", nadi: "Aadi", varna: "Kshatriya", vashya: "Chatushpada", symbol: "Tied bunch of roots" },
  { index: 19, name: "Purva Ashadha", sanskrit: "पूर्वाषाढ़ा", lord: "Venus", deity: "Apas (Cosmic Waters)", gana: "Manushya", yoni: "Monkey (Male)", nadi: "Madhya", varna: "Brahmin", vashya: "Manava", symbol: "Elephant tusk / Fan" },
  { index: 20, name: "Uttara Ashadha", sanskrit: "उत्तराषाढ़ा", lord: "Sun", deity: "Vishwadevas", gana: "Manushya", yoni: "Mongoose (Male)", nadi: "Antya", varna: "Kshatriya", vashya: "Chatushpada", symbol: "Small cot / Planks" },
  { index: 21, name: "Shravana", sanskrit: "श्रवण", lord: "Moon", deity: "Vishnu", gana: "Deva", yoni: "Monkey (Female)", nadi: "Antya", varna: "Shudra", vashya: "Chatushpada", symbol: "Three footprints / Ear" },
  { index: 22, name: "Dhanishta", sanskrit: "धनिष्ठा", lord: "Mars", deity: "Eight Vasus", gana: "Rakshasa", yoni: "Lion (Female)", nadi: "Madhya", varna: "Vaishya", vashya: "Chatushpada", symbol: "Mridanga / Flute" },
  { index: 23, name: "Shatabhisha", sanskrit: "शतभिषा", lord: "Rahu", deity: "Varuna", gana: "Rakshasa", yoni: "Horse (Female)", nadi: "Aadi", varna: "Shudra", vashya: "Manava", symbol: "Empty circle / 100 physicians" },
  { index: 24, name: "Purva Bhadrapada", sanskrit: "पूर्वभाद्रपदा", lord: "Jupiter", deity: "Aja Ekapada", gana: "Manushya", yoni: "Lion (Male)", nadi: "Aadi", varna: "Brahmin", vashya: "Manava", symbol: "Two-faced man / Sword" },
  { index: 25, name: "Uttara Bhadrapada", sanskrit: "उत्तरभाद्रपदा", lord: "Saturn", deity: "Ahirbudhnya", gana: "Manushya", yoni: "Cow (Female)", nadi: "Madhya", varna: "Kshatriya", vashya: "Jalachara", symbol: "Twins / Water snake" },
  { index: 26, name: "Revati", sanskrit: "रेवती", lord: "Mercury", deity: "Pushan", gana: "Deva", yoni: "Elephant (Female)", nadi: "Antya", varna: "Shudra", vashya: "Jalachara", symbol: "Fish pair / Drum" },
];

export const BHAVA_CONFIG: {
  houseNumber: number;
  sanskritName: string;
  meaning: string;
  karakas: PlanetKey[];
  significations: string[];
  scriptureReference: string;
}[] = [
  {
    houseNumber: 1,
    sanskritName: "Tanu Bhava (तनु भाव)",
    meaning: "House of Self, Vitality & Character",
    karakas: ["Sun"],
    significations: ["Physical constitution", "Vital energy", "Appearance & Head", "Core personality", "Longevity foundation", "Self-respect"],
    scriptureReference: "BPHS Ch. 11 - Deha, Rupa, Jnana, Ayus",
  },
  {
    houseNumber: 2,
    sanskritName: "Dhana Bhava (धन भाव)",
    meaning: "House of Wealth, Speech & Family",
    karakas: ["Jupiter", "Mercury"],
    significations: ["Accumulated wealth", "Family lineage", "Speech & Voice", "Food habits", "Right eye & Face", "Values & Assets"],
    scriptureReference: "BPHS Ch. 11 - Kosa, Vidya, Vani, Kutumba",
  },
  {
    houseNumber: 3,
    sanskritName: "Sahaja Bhava (सहज भाव)",
    meaning: "House of Courage, Siblings & Initiative",
    karakas: ["Mars"],
    significations: ["Younger siblings", "Valour & Courage", "Hands & Arms", "Short travels", "Writing & Communication skills", "Hobbies"],
    scriptureReference: "BPHS Ch. 11 - Bhratri, Parakrama, Karna",
  },
  {
    houseNumber: 4,
    sanskritName: "Sukha Bhava (सुख भाव)",
    meaning: "House of Happiness, Mother & Fixed Assets",
    karakas: ["Moon", "Venus"],
    significations: ["Mother", "Inner peace & Emotional happiness", "Home & Real estate", "Vehicles (Vahana)", "Education foundations", "Chest & Heart"],
    scriptureReference: "BPHS Ch. 11 - Matru, Vahana, Bandhu, Sukha",
  },
  {
    houseNumber: 5,
    sanskritName: "Putra Bhava (पुत्र भाव)",
    meaning: "House of Intellect, Progeny & Purva Punya",
    karakas: ["Jupiter"],
    significations: ["Past life merits (Purva Punya)", "Children & Progeny", "Higher intellect & Buddhi", "Mantra siddhi", "Speculation & Creativity", "Stomach"],
    scriptureReference: "BPHS Ch. 11 - Buddhi, Putra, Mantra, Raja Anugraha",
  },
  {
    houseNumber: 6,
    sanskritName: "Ari / Shatru Bhava (अरि भाव)",
    meaning: "House of Health, Obstacles & Service",
    karakas: ["Mars", "Saturn"],
    significations: ["Overcoming adversaries", "Diseases & Immunity", "Debts & Financial discipline", "Daily service & Work environment", "Litigation", "Digestive fire"],
    scriptureReference: "BPHS Ch. 11 - Rina, Roga, Shatru, Sevaka",
  },
  {
    houseNumber: 7,
    sanskritName: "Yuvati / Kalatra Bhava (युवति भाव)",
    meaning: "House of Partnership, Marriage & Public Relations",
    karakas: ["Venus", "Jupiter"],
    significations: ["Spouse & Marital bliss", "Business partnerships", "Public standing", "Foreign travels", "Contracts & Negotiations", "Lower abdomen"],
    scriptureReference: "BPHS Ch. 11 - Kalatra, Madana, Gamana, Vyapara",
  },
  {
    houseNumber: 8,
    sanskritName: "Randhra Bhava (रन्ध्र भाव)",
    meaning: "House of Transformation, Longevity & Occult",
    karakas: ["Saturn"],
    significations: ["Longevity (Ayus)", "Sudden transformations & Windfalls", "Occult knowledge & Astrology", "Unearned wealth / Inheritance", "Deep research", "Secret matters"],
    scriptureReference: "BPHS Ch. 11 - Ayus, Randhra, Guda, Parabhava",
  },
  {
    houseNumber: 9,
    sanskritName: "Dharma Bhava (धर्म भाव)",
    meaning: "House of Fortune, Father & Higher Wisdom",
    karakas: ["Jupiter", "Sun"],
    significations: ["Bhagya (Fortune & Luck)", "Guru & Father", "Higher spiritual wisdom & Vedas", "Long pilgrimages", "Righteous actions (Dharma)", "Thighs"],
    scriptureReference: "BPHS Ch. 11 - Dharma, Guru, Bhagya, Tirtha",
  },
  {
    houseNumber: 10,
    sanskritName: "Karma Bhava (कर्म भाव)",
    meaning: "House of Career, Status & Actions",
    karakas: ["Sun", "Mercury", "Jupiter", "Saturn"],
    significations: ["Profession & Career apex", "Fame, Honor & Government favor", "Karma in society", "Leadership & Authority", "Knees & Joints", "Public impact"],
    scriptureReference: "BPHS Ch. 11 - Rajya, Karma, Mana, Agnya",
  },
  {
    houseNumber: 11,
    sanskritName: "Labha Bhava (लाभ भाव)",
    meaning: "House of Gains, Aspirations & Elder Siblings",
    karakas: ["Jupiter"],
    significations: ["Incomes & Profits (Labha)", "Fulfilment of desires", "Elder siblings & Friends circle", "Social network & Community", "Calves & Shins"],
    scriptureReference: "BPHS Ch. 11 - Labha, Siddhi, Jyeshtha Bhrata",
  },
  {
    houseNumber: 12,
    sanskritName: "Vyaya Bhava (व्यय भाव)",
    meaning: "House of Liberation, Subconscious & Expenditure",
    karakas: ["Saturn", "Ketu"],
    significations: ["Moksha & Spiritual liberation", "Foreign residency & Travels", "Sleep & Subconscious dreaming", "Charitable spending", "Ashrams & Isolation", "Feet"],
    scriptureReference: "BPHS Ch. 11 - Moksha, Vyaya, Sayana, Daurbhagya",
  },
];

export const SATTVIK_REMEDIES_DATA: Record<PlanetKey, SattvikRemedy> = {
  Sun: {
    planet: "Sun",
    sanskritName: "Surya Deva (सूर्य देव)",
    beejMantra: {
      sanskrit: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः ॥",
      transliteration: "Om Hraam Hreem Hroum Sah Suryaaya Namah",
      meaning: "Salutations to the Radiant Sun, the cosmic illuminator of soul, health, and supreme vitality.",
      prescribedCount: 108,
      bestTime: "Sunrise (Brahma Muhurta or early morning during Shukla Paksha Sunday)",
    },
    vedicMantra: {
      sanskrit: "ॐ आदित्याय विद्महे मार्तण्डाय धीमहि तन्नः सूर्यः प्रचोदयात् ॥",
      transliteration: "Om Aadityaaya Vidmahe Maartandaaya Dheemahi Tannah Sooryah Prachodayaat",
    },
    daan: {
      items: ["Wheat grains (Gehun)", "Jaggery (Gud)", "Copper vessels", "Ruby-colored red flowers", "Red sandalwood"],
      auspiciousDay: "Sunday morning during sunrise",
      recipient: "Deserving temple priest, father-figure, or charitable educational institution",
      guideline: "Offer with reverence without pride or expectation of praise.",
    },
    pujaAndVrata: {
      deity: "Lord Shiva & Surya Narayana",
      vratDay: "Ravivar (Sunday) with saltless sattvik meal or milk/fruits",
      pujaPractice: "Offer Arghya (clean water in copper lota with red flowers and unbroken rice) facing East to the rising Sun.",
      meditationFocus: "Aditya Hridaya Stotra chanting and Gayatri Mantra contemplation for pure vitality.",
    },
    lifestyleAndKarma: [
      "Wake up before sunrise and walk in early morning sunlight.",
      "Respect and serve your father, mentors, and elders with filial devotion.",
      "Cultivate unwavering honesty, punctuality, and self-confidence without ego.",
      "Perform 12 rounds of Surya Namaskar with synchronized breathing.",
    ],
    gemstone: {
      name: "Natural Ruby (Manikya)",
      sanskritName: "माणिक्य (Manikya)",
      metal: "Pure Gold or Copper",
      finger: "Ring Finger (Anamika) of right hand",
      auspiciousDayTime: "Sunday morning during Shukla Paksha",
      caution: "NEVER wear Ruby if Sun is lord of 6th, 8th, or 12th houses (unless in specific Vipreet Raja Yoga). NEVER combine Ruby with Blue Sapphire, Hessonite, or Cat's Eye. Physical chart verification is essential.",
      contraindicatedGemstones: ["Blue Sapphire (Shani)", "Hessonite (Rahu)", "Cat's Eye (Ketu)", "Diamond (Shukra)"],
      safeAlternative: "1 Mukhi or 12 Mukhi Authentic Rudraksha / Belmool (Aegle Marmelos root)",
    },
  },
  Moon: {
    planet: "Moon",
    sanskritName: "Chandra Deva (चन्द्र देव)",
    beejMantra: {
      sanskrit: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः ॥",
      transliteration: "Om Shraam Shreem Shroum Sah Chandraaya Namah",
      meaning: "Salutations to the Divine Moon, ruler of the mind, emotional balance, motherly grace, and inner calm.",
      prescribedCount: 108,
      bestTime: "Evening / Moonrise or Monday evening",
    },
    vedicMantra: {
      sanskrit: "ॐ क्षीरपुत्राय विद्महे अमृतत्त्वाय धीमहि तन्नो चन्द्रः प्रचोदयात् ॥",
      transliteration: "Om Ksheeraputraaya Vidmahe Amritattvaaya Dheemahi Tanno Chandrah Prachodayaat",
    },
    daan: {
      items: ["White unbroken Rice (Akshata)", "Fresh Milk", "Pure Silver coin/vessel", "White clothes", "Curd / Camphor (Karpura)"],
      auspiciousDay: "Monday evening or Purnima (Full Moon night)",
      recipient: "Motherly women, orphanages, or spiritual seekers",
      guideline: "Offer silently to calm anxiety and soothe the mental faculties.",
    },
    pujaAndVrata: {
      deity: "Lord Shiva (Chandrashekhara) & Goddess Parvati",
      vratDay: "Somwar (Monday) and Purnima",
      pujaPractice: "Shiva Linga Jalabhisheka with pure raw milk, water, and Bilva leaves.",
      meditationFocus: "Trataka on moonlight or silent breath meditation (Anapanasati) to pacify fluctuations of the mind.",
    },
    lifestyleAndKarma: [
      "Respect, serve, and seek blessings from your mother and maternal figures.",
      "Drink water stored in silver vessels to regulate mental cooling.",
      "Avoid negative late-night screen time; practice grounding evening routines.",
      "Practice gratitude and loving-kindness (Metta) meditation daily.",
    ],
    gemstone: {
      name: "Natural Pearl (Mukta / Moti)",
      sanskritName: "मुक्ता / मोती (Mukta)",
      metal: "Pure Silver",
      finger: "Little Finger (Kanishtha) or Ring Finger of right hand",
      auspiciousDayTime: "Monday morning/evening during Shukla Paksha",
      caution: "Do not wear Pearl if Moon is an afflicted functional malefic (e.g. Capricorn/Aquarius Lagna where Moon rules Dusthana). Gemstones should be checked personally.",
      contraindicatedGemstones: ["Hessonite (Gomed)", "Cat's Eye (Lehsuniya)", "Blue Sapphire"],
      safeAlternative: "2 Mukhi Authentic Rudraksha / Khirni root (Manilkara Hexandra)",
    },
  },
  Mars: {
    planet: "Mars",
    sanskritName: "Mangala Deva (मंगल देव / कुज)",
    beejMantra: {
      sanskrit: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥",
      transliteration: "Om Kraam Kreem Kroum Sah Bhoumaaya Namah",
      meaning: "Salutations to Mars, the cosmic commander of righteous courage, stamina, willpower, and protection.",
      prescribedCount: 108,
      bestTime: "Tuesday morning during sunrise or Shukla Paksha",
    },
    vedicMantra: {
      sanskrit: "ॐ अङ्गारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात् ॥",
      transliteration: "Om Angaarakaaya Vidmahe Shakti-Hastaaya Dheemahi Tanno Bhoumah Prachodayaat",
    },
    daan: {
      items: ["Red Lentils (Masoor Dal)", "Jaggery (Gud)", "Copper coins", "Red flowers", "Blood donation to emergency patients"],
      auspiciousDay: "Tuesday afternoon",
      recipient: "Young athletes, soldiers/police support funds, or laborers",
      guideline: "Perform Daan to temper aggression into disciplined, constructive willpower.",
    },
    pujaAndVrata: {
      deity: "Lord Hanuman & Lord Kartikeya (Skanda)",
      vratDay: "Mangalwar (Tuesday)",
      pujaPractice: "Chanting Hanuman Chalisa or Sundarkand with sincere surrender; lighting a mustard oil or jasmine oil lamp.",
      meditationFocus: "Focus on Muladhara (root chakra) and disciplined physical yoga.",
    },
    lifestyleAndKarma: [
      "Channel excess energy through vigorous daily physical exercise, martial arts, or sports.",
      "Avoid harsh speech, impulsive confrontations, and reckless driving.",
      "Support and protect younger siblings and brothers.",
      "Donate blood once or twice a year if medically permissible (most effective Sattvik remedy).",
    ],
    gemstone: {
      name: "Natural Red Coral (Moonga)",
      sanskritName: "प्रवाल / मूंगा (Pravala)",
      metal: "Copper, Gold or Panchdhatu",
      finger: "Ring Finger (Anamika) of right hand",
      auspiciousDayTime: "Tuesday morning",
      caution: "Red Coral should NOT be worn by Gemini or Virgo ascendants where Mars is a prime malefic, nor with Emerald or Diamond. Always verify chart first.",
      contraindicatedGemstones: ["Emerald (Panna)", "Diamond (Heera)", "Blue Sapphire (Neelam)"],
      safeAlternative: "3 Mukhi Authentic Rudraksha / Anantmool root (Hemidesmus Indicus)",
    },
  },
  Mercury: {
    planet: "Mercury",
    sanskritName: "Budha Deva (बुध देव)",
    beejMantra: {
      sanskrit: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः ॥",
      transliteration: "Om Braam Breem Broum Sah Budhaaya Namah",
      meaning: "Salutations to Mercury, the prince of intellect, analytical acumen, eloquent speech, and commercial success.",
      prescribedCount: 108,
      bestTime: "Wednesday morning during sunrise or bright half",
    },
    vedicMantra: {
      sanskrit: "ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि तन्नो बुधः प्रचोदयात् ॥",
      transliteration: "Om Soumyaroopaaya Vidmahe Vaaneshaaya Dheemahi Tanno Budhah Prachodayaat",
    },
    daan: {
      items: ["Whole Green Gram (Moong Dal)", "Green clothes", "Books & Notebooks to poor students", "Spinach / green grass to Gomata (cows)"],
      auspiciousDay: "Wednesday morning",
      recipient: "Students, orphans, green goshalas (cow shelters)",
      guideline: "Offering green fodder to cows on Wednesdays is profoundly meritorious in Parashara Jyotish.",
    },
    pujaAndVrata: {
      deity: "Lord Vishnu & Lord Ganesha (Vighnaharta)",
      vratDay: "Budhwar (Wednesday)",
      pujaPractice: "Chanting Vishnu Sahasranama Stotram or offering 21 fresh Durva grass blades to Lord Ganesha.",
      meditationFocus: "Mindful reading, pranayama (Anulom-Vilom), and cultivating clarity in communication.",
    },
    lifestyleAndKarma: [
      "Keep your promises and practice transparent, truthful business conduct.",
      "Plant and nurture green trees and Tulsi plants at home.",
      "Support the education and stationary needs of underprivileged children.",
      "Respect maternal aunts, sisters, and daughters with affectionate gifts.",
    ],
    gemstone: {
      name: "Natural Emerald (Panna)",
      sanskritName: "मरकत / पन्ना (Marakata)",
      metal: "Pure Gold, Bronze, or Silver",
      finger: "Little Finger (Kanishtha) of right hand",
      auspiciousDayTime: "Wednesday morning during Shukla Paksha",
      caution: "Do not wear Emerald if Mercury rules 6th/8th/12th houses with strong malefic afflicting aspects. Never combine Emerald with Red Coral or Pearl without expert guidance.",
      contraindicatedGemstones: ["Red Coral (Moonga)", "Yellow Sapphire (in certain ascendants)"],
      safeAlternative: "4 Mukhi Authentic Rudraksha / Vidhara root (Argyreia Speciosa)",
    },
  },
  Jupiter: {
    planet: "Jupiter",
    sanskritName: "Guru / Brihaspati Deva (बृहस्पति देव)",
    beejMantra: {
      sanskrit: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥",
      transliteration: "Om Graam Greem Groum Sah Gurave Namah",
      meaning: "Salutations to Brihaspati, supreme preceptor of gods, beacon of divine wisdom, righteousness, and spiritual expansion.",
      prescribedCount: 108,
      bestTime: "Thursday morning during Brahma Muhurta",
    },
    vedicMantra: {
      sanskrit: "ॐ देवानाम च ऋषीणाम च गुरुं कांचन सन्निभम् । बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम् ॥",
      transliteration: "Om Devaanaam Cha Risheenaam Cha Gurum Kaanchana Sannibham | Buddhibhootam Trilokesham Tam Namaami Brihaspatim ||",
    },
    daan: {
      items: ["Yellow Gram (Chana Dal)", "Turmeric (Haldi sticks)", "Yellow clothes", "Pure Cow Ghee", "Sanskrit or spiritual scriptures"],
      auspiciousDay: "Thursday morning",
      recipient: "Teachers, temple priests, scholars, spiritual organizations",
      guideline: "Offer with deep humility to cultivate sattva and noble character.",
    },
    pujaAndVrata: {
      deity: "Lord Vishnu / Sri Dakshinamurthy / Guru Dattatreya",
      vratDay: "Guruwar (Thursday)",
      pujaPractice: "Worship of the Banana tree / Peepal tree with turmeric water, chanting Guru Stotram or Brihaspati Kavacham.",
      meditationFocus: "Contemplation on non-dual Vedantic wisdom and gratitude towards all teachers in life.",
    },
    lifestyleAndKarma: [
      "Always respect your spiritual preceptors, parents, teachers, and elders.",
      "Study philosophical and uplifting spiritual scriptures regularly.",
      "Never speak ill of righteous people or mock spiritual traditions.",
      "Apply pure sandalwood or saffron (Kesar) tilak on the forehead and throat.",
    ],
    gemstone: {
      name: "Natural Yellow Sapphire (Pukhraj)",
      sanskritName: "पुखराज (Pushparaga)",
      metal: "Pure 22K Gold or Panchdhatu",
      finger: "Index Finger (Tarjani) of right hand",
      auspiciousDayTime: "Thursday morning during Shukla Paksha",
      caution: "Yellow Sapphire is highly potent and must not be worn by Libra/Taurus or Taurus/Capricorn without specific chart analysis. Never wear with Diamond, Emerald, or Blue Sapphire without expert consultation.",
      contraindicatedGemstones: ["Diamond (Heera)", "Blue Sapphire (Neelam)", "Emerald (Panna)"],
      safeAlternative: "5 Mukhi Authentic Rudraksha / Banana root / Turmeric root",
    },
  },
  Venus: {
    planet: "Venus",
    sanskritName: "Shukra Deva (शुक्र देव)",
    beejMantra: {
      sanskrit: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः ॥",
      transliteration: "Om Draam Dreem Droum Sah Shukraaya Namah",
      meaning: "Salutations to Shukracharya, cosmic custodian of refined aesthetics, unconditional love, harmony, and creative arts.",
      prescribedCount: 108,
      bestTime: "Friday sunrise or evening",
    },
    vedicMantra: {
      sanskrit: "ॐ भृगुपुत्राय विद्महे दिव्यदेहाय धीमहि तन्नः शुक्रः प्रचोदयात् ॥",
      transliteration: "Om Bhriguputraaya Vidmahe Divyadehaaya Dheemahi Tannah Shukrah Prachodayaat",
    },
    daan: {
      items: ["White Sugar / Mishri", "Pure Cow Ghee", "Silk clothes", "White fragrant flowers", "Cosmetics/rations to impoverished brides"],
      auspiciousDay: "Friday morning",
      recipient: "Women in need, widows support homes, artistic foundations",
      guideline: "Perform with utmost respect for the feminine divine principle.",
    },
    pujaAndVrata: {
      deity: "Goddess Lakshmi / Sri Lalita Tripurasundari",
      vratDay: "Shukrawar (Friday)",
      pujaPractice: "Chanting Sri Suktam or Kanakadhara Stotram; offering fragrant white lotus or jasmine flowers to Mahalakshmi.",
      meditationFocus: "Appreciation of beauty in creation and cultivating unconditional forgiveness.",
    },
    lifestyleAndKarma: [
      "Maintain personal cleanliness, wear clean washed clothes, and use mild natural fragrances.",
      "Treat your spouse, women, and artists with genuine dignity and reverence.",
      "Engage in creative pursuits like classical music, art, poetry, or gardening.",
      "Avoid vulgarity, greed, and toxic sensory overindulgence.",
    ],
    gemstone: {
      name: "Natural Diamond (Heera) or White Zircon",
      sanskritName: "वज्र / हीरा (Heera)",
      metal: "Platinum, White Gold, or Silver",
      finger: "Middle Finger (Madhyama) or Little Finger of right hand",
      auspiciousDayTime: "Friday morning during Shukla Paksha",
      caution: "Never wear Diamond for Aries, Scorpio, or Sagittarius ascendants where Venus is a functional malefic or Maraka. Never pair with Ruby or Yellow Sapphire.",
      contraindicatedGemstones: ["Ruby (Manikya)", "Yellow Sapphire (Pukhraj)", "Red Coral (Moonga)"],
      safeAlternative: "6 Mukhi Authentic Rudraksha / Arani root (Premna Serratifolia)",
    },
  },
  Saturn: {
    planet: "Saturn",
    sanskritName: "Shani Deva (शनि देव)",
    beejMantra: {
      sanskrit: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः ॥",
      transliteration: "Om Praam Preem Proum Sah Shanaishcharaaya Namah",
      meaning: "Salutations to Lord Shani, righteous arbiter of cosmic Karma, discipline, endurance, patience, and profound humility.",
      prescribedCount: 108,
      bestTime: "Saturday evening after sunset or during Twilight",
    },
    vedicMantra: {
      sanskrit: "ॐ नीलांजन समाभासं रविपुत्रं यमाग्रजम् । छायामार्तण्ड संभूतं तं नमामि शनैश्चरम् ॥",
      transliteration: "Om Neelaanjana Samaabhaasam Raviputram Yamaagrajam | Chhaayaamaartanda Sambhootam Tam Namaami Shanaishcharam ||",
    },
    daan: {
      items: ["Black Sesame seeds (Til)", "Mustard Oil (Sarson ka Tel)", "Iron utensils", "Warm black/dark blankets", "Footwear to barefoot workers"],
      auspiciousDay: "Saturday evening",
      recipient: "Manual laborers, sanitation workers, destitute and disabled individuals",
      guideline: "Give quietly and with great reverence directly into the hands of the needy.",
    },
    pujaAndVrata: {
      deity: "Lord Shiva, Lord Hanuman, & Shani Deva",
      vratDay: "Shaniwar (Saturday)",
      pujaPractice: "Lighting a Mustard Oil Diya under a Peepal tree on Saturday evening; reciting Hanuman Chalisa & Dasharatha Shani Stotram.",
      meditationFocus: "Self-reflection on duty (Swadharma), patience, and accepting life's lessons without bitterness.",
    },
    lifestyleAndKarma: [
      "Always be kind, fair, and generous to domestic help, workers, and physical laborers.",
      "Cultivate strict discipline, routine, simplicity, and unpretentious living.",
      "Feed crows, black dogs, and birds with soaked grains and bread on Saturdays.",
      "Avoid alcohol, gambling, and deceitful conduct.",
    ],
    gemstone: {
      name: "Natural Blue Sapphire (Neelam)",
      sanskritName: "नीलम (Neelamani)",
      metal: "Panchdhatu, White Gold, or Silver",
      finger: "Middle Finger (Madhyama) of right hand",
      auspiciousDayTime: "Saturday evening during Shukla Paksha",
      caution: "CRITICAL WARNING: Blue Sapphire is the fastest-acting and most severe gemstone in Vedic Astrology. It MUST NOT be worn without a minimum 3-day trial period under your pillow and physical chart verification. Never wear if Saturn is ill-placed.",
      contraindicatedGemstones: ["Ruby (Manikya)", "Pearl (Moti)", "Red Coral (Moonga)", "Yellow Sapphire"],
      safeAlternative: "7 Mukhi or 14 Mukhi Authentic Rudraksha / Bichu root / Black Sesame charity",
    },
  },
  Rahu: {
    planet: "Rahu",
    sanskritName: "Rahu Deva (राहु देव)",
    beejMantra: {
      sanskrit: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः ॥",
      transliteration: "Om Bhraam Bhreem Bhroum Sah Raahave Namah",
      meaning: "Salutations to Rahu, master of innovation, foreign explorations, and catalyst of psychological transformation.",
      prescribedCount: 108,
      bestTime: "Night / Sunset or during Rahu Kaal on Saturdays/Wednesdays",
    },
    vedicMantra: {
      sanskrit: "ॐ अर्धकायं महावीर्यं चन्द्रादित्य विमर्दनम् । सिंहिकागर्भ संभूतं तं राहुं प्रणमाम्यहम् ॥",
      transliteration: "Om Ardhakaayam Mahaaveeryam Chandraaditya Vimardanam | Simhikaagarbha Sambhootam Tam Raahum Pranamaamyaham ||",
    },
    daan: {
      items: ["Black/Blue blankets", "Seven grains (Satnaja - 7 mixed grains)", "Coconut with water", "Mustard seeds", "Lead metal"],
      auspiciousDay: "Saturday evening or Amavasya (New Moon night)",
      recipient: "Lepers, sanitation workers, stray animals, or flow coconuts in running river",
      guideline: "Offer Satnaja to birds daily to pacify intense Rahu transits.",
    },
    pujaAndVrata: {
      deity: "Goddess Durga & Lord Shiva (Bhairava)",
      vratDay: "Saturday / Ashtami Tithi",
      pujaPractice: "Reciting Durga Saptashati / Argala Stotram or chanting 'Om Dum Durgayei Namaha'. Flowing dry coconut in river.",
      meditationFocus: "Grounding breathwork (Box Breathing) to eliminate obsessive illusions and anxiety.",
    },
    lifestyleAndKarma: [
      "Keep the Northwest corner and entrance of your home completely clutter-free.",
      "Never consume stale food, excessive intoxicants, or engage in compulsive gambling.",
      "Honor and assist your paternal grandfather and ancestors (Pitru Tarpan).",
      "Feed street dogs and birds daily with whole grains.",
    ],
    gemstone: {
      name: "Natural Hessonite Garnet (Gomed)",
      sanskritName: "गोमेद (Gomeda)",
      metal: "Silver or Ashtadhatu",
      finger: "Middle Finger (Madhyama) or Little Finger of right hand",
      auspiciousDayTime: "Saturday night",
      caution: "Gomed must ONLY be worn if Rahu is well-disposed in 3rd, 6th, 10th, or 11th houses in friendly signs. In all other placements, charity and mantras are safer.",
      contraindicatedGemstones: ["Ruby", "Pearl", "Red Coral", "Yellow Sapphire"],
      safeAlternative: "8 Mukhi Authentic Rudraksha / Nagarmotha root (Cyperus Scariosus)",
    },
  },
  Ketu: {
    planet: "Ketu",
    sanskritName: "Ketu Deva (केतु देव)",
    beejMantra: {
      sanskrit: "ॐ स्रां स्रीं स्रौं सः केतवे नमः ॥",
      transliteration: "Om Sraam Sreem Sroum Sah Ketave Namah",
      meaning: "Salutations to Ketu, cosmic karaka of Moksha, detachment, psychic intuition, and supreme spiritual liberation.",
      prescribedCount: 108,
      bestTime: "Early morning or night on Tuesdays",
    },
    vedicMantra: {
      sanskrit: "ॐ पलाशपुष्पसंकाशं तारकाग्रह मस्तकम् । रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम् ॥",
      transliteration: "Om Palaashapushpa Sankaasham Taarakaagraha Mastakam | Roudram Roudraatmakam Ghoram Tam Ketum Pranamaamyaham ||",
    },
    daan: {
      items: ["Two-colored black & white blankets (Kambal)", "Sesame sweets (Til-gur)", "Yellow flags to temple top", "Warm socks/clothes to elderly monks"],
      auspiciousDay: "Tuesday morning / evening",
      recipient: "Ascetics, sadhus, stray stray dogs, ashrams",
      guideline: "Feeding stray dogs (especially two-colored dogs) is the supreme Parashara remedy for Ketu.",
    },
    pujaAndVrata: {
      deity: "Lord Ganesha & Lord Matsya Avatara",
      vratDay: "Tuesday / Chaturthi Tithi",
      pujaPractice: "Reciting Ganesha Atharvashirsha or Sankata Nashana Ganesha Stotram.",
      meditationFocus: "Vipassana, silent inward contemplation, and shedding material attachments.",
    },
    lifestyleAndKarma: [
      "Feed and care for street dogs and animals with compassionate affection.",
      "Support spiritual retreats, pilgrimage places, and monks.",
      "Honor your maternal grandfather with respectful care.",
      "Maintain a daily silent meditation practice to harness Ketu's intuitive gift.",
    ],
    gemstone: {
      name: "Natural Chrysoberyl Cat's Eye (Lehsuniya / Vaidurya)",
      sanskritName: "वैदूर्य / लहसुनिया (Vaidurya)",
      metal: "Silver or Panchdhatu",
      finger: "Middle Finger or Ring Finger of right hand",
      auspiciousDayTime: "Tuesday midnight or early morning",
      caution: "Cat's Eye carries intense kinetic energy. It must be test-worn before permanent use. Never wear alongside Ruby, Pearl, or Coral without strict chart alignment.",
      contraindicatedGemstones: ["Ruby", "Pearl", "Emerald", "Diamond"],
      safeAlternative: "9 Mukhi Authentic Rudraksha / Ashwagandha root (Withania Somnifera)",
    },
  },
  Ascendant: {
    planet: "Ascendant",
    sanskritName: "Lagna Deva (लग्न भाव)",
    beejMantra: {
      sanskrit: "ॐ गं गणपतये नमः ॥",
      transliteration: "Om Gam Ganapataye Namah",
      meaning: "Salutations to Lord Ganesha, lord of auspicious beginnings, grounding the physical vessel and life path.",
      prescribedCount: 108,
      bestTime: "Morning at sunrise",
    },
    vedicMantra: {
      sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
      transliteration: "Om Bhur Bhuvah Svah Tat Savitur Varenyam Bhargo Devasya Dheemahi Dhiyo Yo Nah Prachodayaat",
    },
    daan: {
      items: ["Pure drinking water to thirsty travelers", "Food grains to birds", "Planting fruit-bearing trees"],
      auspiciousDay: "Every morning",
      recipient: "Nature, travelers, seekers",
      guideline: "Strengthening the Lagna elevates the entire Kundali resilience.",
    },
    pujaAndVrata: {
      deity: "Ishta Devata & Kula Devata",
      vratDay: "Based on Lagna Lord",
      pujaPractice: "Daily morning prayer, lighting a pure cow ghee lamp, and offering gratitude for life.",
      meditationFocus: "Self-awareness, posture alignment, and centering the breath in the heart center.",
    },
    lifestyleAndKarma: [
      "Maintain physical hygiene and a disciplined daily dinacharya (routine).",
      "Honor your true purpose and act in harmony with moral conscience.",
      "Exercise regularly to fortify the physical body (Tanu).",
    ],
    gemstone: {
      name: "Lagna Lord Gemstone",
      sanskritName: "लग्न रत्न (Lagna Ratna)",
      metal: "According to Lagna Lord",
      finger: "According to Lagna Lord",
      auspiciousDayTime: "Auspicious day of Lagna Lord",
      caution: "Lagna Lord gemstone is the most universally protective gemstone, provided the lord is not in 6th, 8th, or 12th houses.",
      contraindicatedGemstones: ["Gemstones of functional Dusthana lords"],
      safeAlternative: "Authentic Rudraksha corresponding to Lagna Lord",
    },
  },
};

export const MAJOR_CITIES: { name: string; country: string; lat: number; lng: number; tz: number }[] = [
  { name: "New Delhi", country: "India", lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { name: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { name: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { name: "Hyderabad", country: "India", lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { name: "Varanasi (Kashi)", country: "India", lat: 25.3176, lng: 82.9739, tz: 5.5 },
  { name: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { name: "Pune", country: "India", lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { name: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873, tz: 5.5 },
  { name: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462, tz: 5.5 },
  { name: "Patna", country: "India", lat: 25.5941, lng: 85.1376, tz: 5.5 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, tz: 0 },
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.0060, tz: -5 },
  { name: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, tz: -8 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, tz: -5 },
  { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708, tz: 4 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, tz: 8 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, tz: 10 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, tz: 9 },
  { name: "Kathmandu", country: "Nepal", lat: 27.7172, lng: 85.3240, tz: 5.75 },
];

export const PRESET_CHARTS: {
  title: string;
  subtitle: string;
  tag: string;
  details: BirthDetails;
}[] = [
  {
    title: "Gajakesari & Raja Yoga Master Chart",
    subtitle: "Aries Ascendant with Jupiter & Moon in mutual Kendra in Cancer/Capricorn, strong 1st and 9th houses",
    tag: "Auspicious Archetype",
    details: {
      name: "Siddhartha (Gajakesari Archetype)",
      gender: "Male",
      dateOfBirth: "1994-07-28",
      timeOfBirth: "06:45",
      city: "New Delhi",
      country: "India",
      latitude: 28.6139,
      longitude: 77.2090,
      timezoneOffset: 5.5,
    },
  },
  {
    title: "Budhaditya & Simha Lagna Leader",
    subtitle: "Leo Ascendant with Sun & Mercury in 1st house, exalted Mars in 6th house (Ruchaka Yoga foundation)",
    tag: "Leadership & Power",
    details: {
      name: "Vikramaditya (Leo Leader)",
      gender: "Male",
      dateOfBirth: "1990-08-20",
      timeOfBirth: "06:15",
      city: "Varanasi (Kashi)",
      country: "India",
      latitude: 25.3176,
      longitude: 82.9739,
      timezoneOffset: 5.5,
    },
  },
  {
    title: "Malavya & Saraswati Creative Chart",
    subtitle: "Libra Ascendant with Venus in own sign in 1st house, exalted Mercury in 12th/1st house boundary",
    tag: "Creative & Arts",
    details: {
      name: "Ananya (Malavya Yoga)",
      gender: "Female",
      dateOfBirth: "1998-10-14",
      timeOfBirth: "07:30",
      city: "Mumbai",
      country: "India",
      latitude: 19.0760,
      longitude: 72.8777,
      timezoneOffset: 5.5,
    },
  },
  {
    title: "Moksha & Spiritual Seeker Chart",
    subtitle: "Pisces Ascendant with Jupiter in 9th house, Ketu in 12th house (Classic Parashari Moksha yoga)",
    tag: "Spiritual Wisdom",
    details: {
      name: "Devavrata (Moksha Path)",
      gender: "Male",
      dateOfBirth: "1988-12-05",
      timeOfBirth: "14:10",
      city: "Bengaluru",
      country: "India",
      latitude: 12.9716,
      longitude: 77.5946,
      timezoneOffset: 5.5,
    },
  },
];

// Authentic Choghadiya cycles for days of week
export const CHOGHADIYA_ORDER_DAY: Record<string, string[]> = {
  Sunday: ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],
  Monday: ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"],
  Tuesday: ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
  Wednesday: ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"],
  Thursday: ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"],
  Friday: ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"],
  Saturday: ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"],
};

export const CHOGHADIYA_NATURE: Record<string, "Best" | "Good" | "Gain" | "Bad" | "Loss" | "Neutral"> = {
  Amrit: "Best",
  Shubh: "Good",
  Labh: "Gain",
  Char: "Neutral",
  Rog: "Bad",
  Kaal: "Loss",
  Udveg: "Bad",
};

