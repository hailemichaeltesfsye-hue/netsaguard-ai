/**
 * NetsaGuard AI: Multilingual African Campaign Mock Datasets
 * Pre-seeded scenarios for immediate hackathon & capstone judge demonstrations.
 */

export const CAMPAIGN_PRESETS = [
  {
    id: 'preset-amharic',
    language: 'amharic',
    title: 'የኢትዮጵያ ሰላማዊ ሰልፍ እና ዲጂታል ነፃነት (Ethiopia Civic Rights)',
    category: 'Freedom of Speech & Assembly',
    text: `አስቸኳይ ማሳሰቢያ ለአዲስ አበባ ነዋሪዎች: በመስቀል አደባባይ የሚደረገው ሰላማዊ ሰልፍ እና የኢንተርኔት እገታ ተቃውሞ ይቀጥላል። አስተባባሪ አበበ ቢቂላ በስልክ ቁጥር +251911234567 ወይም +251922334455 ያነጋግሩ። ድምፃችን ይሰማ! መንግስት ይውረድ!`,
    expectedFlags: ['መንግስት ይውረድ', 'እገታ'],
    expectedPII: ['አበበ ቢቂላ', '+251911234567', '+251922334455', 'መስቀል አደባባይ']
  },
  {
    id: 'preset-swahili',
    language: 'swahili',
    title: 'Kenya Gen-Z Digital Rights & Protest Protection',
    category: 'Anti-Tax & Internet Throttling Resistance',
    text: `Ilani muhimu kwa vijana wote wa Nairobi: Maandamano ya amani dhidi ya ushuru yatafanyika Uhuru Park kesho saa nne asubuhi. Piga ripoti ya ukiukaji kwa afisa Raila Simiyu kupitia +254712345678. Sauti yetu haitazimwa kamwe! Funga barabara!`,
    expectedFlags: ['maandamano', 'funga barabara'],
    expectedPII: ['Raila Simiyu', '+254712345678', 'Uhuru Park']
  },
  {
    id: 'preset-oromo',
    language: 'afaan_oromo',
    title: 'Oromia Freedom of Expression & Internet Access',
    category: 'Indigenous Rights & Digital Defense',
    text: `Beeksisa Hatattamaa: Hiriira nagaa mirga interneetii fi sagalee keenya dhageessisuuf Magaalaa Finfinneetti qophoofneerra. Qindeessaa Almaz Ayana bilbilaan +251933445566 qunnamaa. Mirgi keenya kabajamuu qaba!`,
    expectedFlags: ['hiriira', 'qabsoo'],
    expectedPII: ['Almaz Ayana', '+251933445566', 'Magaalaa Finfinneetti']
  },
  {
    id: 'preset-hausa',
    language: 'hausa',
    title: 'Northern Nigeria Civic Mobilization & Privacy Alert',
    category: 'Civic Freedom & Privacy Governance',
    text: `Sanarwa mai muhimmanci ga kungiyoyin kare hakki: Za a gudanar da zanga zanga ta lumana a Eagle Square Abuja. Tuntubi jagora Abubakar Sani a +2348031234567 ko imel contact@hausa-rights.ng. Yancin fadin albarkacin baki hakkinmu ne!`,
    expectedFlags: ['zanga zanga', 'kifarar gwamnati'],
    expectedPII: ['Abubakar Sani', '+2348031234567', 'Eagle Square Abuja']
  },
  {
    id: 'preset-french',
    language: 'french',
    title: 'Sahel Digital Rights & Electoral Transparency',
    category: 'Electoral Defense & Information Integrity',
    text: `Alerte urgente Société Civile au Sahel: Manifestation interdite mais pacifique pour la transparence électorale. Contactez le coordinateur Ibrahim Traore au +221771234567 ou à Dakar Plateau. Défendons nos libertés numériques!`,
    expectedFlags: ['manifestation interdite', "coup d'etat"],
    expectedPII: ['Ibrahim Traore', '+221771234567', 'Dakar Plateau']
  }
];
