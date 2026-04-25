
export interface PhraseItem {
  original: string;
  translated: string;
  pronunciation: string;
}

export interface PhraseCategory {
  category: string;
  items: PhraseItem[];
}

export interface EtiquetteItem {
  title: string;
  desc: string;
}

export interface CultureData {
  name: string;
  flag: string;
  etiquette: {
    dos: EtiquetteItem[];
    donts: EtiquetteItem[];
    essentials: { icon: string; title: string; desc: string }[];
  };
  phrases: PhraseCategory[];
}

export const CULTURE_DATA: Record<string, CultureData> = {
  Thai: {
    name: 'Thailand',
    flag: '🇹🇭',
    etiquette: {
      dos: [
        { title: 'The Wai', desc: 'Greet with a slight bow and palms pressed together.' },
        { title: 'Respect the Monarchy', desc: 'Always show deep respect for the Royal Family.' },
        { title: 'Remove Shoes', desc: 'Take off your shoes when entering homes or most temples.' },
      ],
      donts: [
        { title: 'No Feet on Table', desc: 'Points at objects or people with your feet is offensive.' },
        { title: 'Touching Heads', desc: 'The head is considered sacred; do not touch others\' heads.' },
        { title: 'Losing Your Cool', desc: 'Raising your voice is seen as a sign of weakness.' },
      ],
      essentials: [
        { icon: '🧥', title: 'Temple Dress', desc: 'Shoulders and knees must be covered in temples.' },
        { icon: '💵', title: 'Tipping', desc: '10% is appreciated in restaurants but not mandatory.' },
        { icon: '🐘', title: 'Animal Welfare', desc: 'Visit ethical sanctuaries only, never ride elephants.' },
      ]
    },
    phrases: [
      {
        category: 'Greetings',
        items: [
          { original: 'Sawatdee krap/ka', translated: 'Hello', pronunciation: 'Sah-wah-dee-krup/kah' },
          { original: 'Khob khun krap/ka', translated: 'Thank you', pronunciation: 'Kob-koon-krup/kah' },
          { original: 'Sabai deemai?', translated: 'How are you?', pronunciation: 'Sah-bye-dee-my?' },
        ]
      },
      {
        category: 'Dining',
        items: [
          { original: 'Aroy mak!', translated: 'Very delicious!', pronunciation: 'Ah-roy-mahk!' },
          { original: 'Mai pet', translated: 'Not spicy', pronunciation: 'My-pet' },
          { original: 'Check bin krap/ka', translated: 'The bill, please', pronunciation: 'Check-bin-krup' },
        ]
      }
    ]
  },
  Japanese: {
    name: 'Japan',
    flag: '🇯🇵',
    etiquette: {
      dos: [
        { title: 'Bowing', desc: 'Bow when greeting, thanking, or apologizing.' },
        { title: 'Slurping Noodles', desc: 'Slurping is a sign that you are enjoying the meal.' },
        { title: 'Using Both Hands', desc: 'Give and receive business cards or gifts with both hands.' },
      ],
      donts: [
        { title: 'Tipping', desc: 'Tipping is not practiced and can be seen as confusing or rude.' },
        { title: 'Eating on the Go', desc: 'Walking while eating is generally frowned upon.' },
        { title: 'Talk on Phones', desc: 'Keep phone conversations quiet or non-existent on trains.' },
      ],
      essentials: [
        { icon: '♨️', title: 'Onsen Rules', desc: 'Shower thoroughly before entering public baths, hide tattoos.' },
        { icon: '🧣', title: 'Face Masks', desc: 'Worn commonly when sick out of respect for others.' },
        { icon: '🧤', title: 'White Gloves', desc: 'Taxi drivers often wear them; doors open automatically.' },
      ]
    },
    phrases: [
      {
        category: 'Greetings',
        items: [
          { original: 'Konnichiwa', translated: 'Hello / Good afternoon', pronunciation: 'Kon-nee-chee-wah' },
          { original: 'Arigato gozaimasu', translated: 'Thank you very much', pronunciation: 'Ah-ree-gah-toh' },
          { original: 'Sumimasen', translated: 'Excuse me / Sorry', pronunciation: 'Soo-mee-mah-sen' },
        ]
      },
      {
        category: 'Dining',
        items: [
          { original: 'Itadakimasu', translated: 'I gratefully receive (before meals)', pronunciation: 'Ee-tah-dah-kee-mahs' },
          { original: 'Oishii desu!', translated: 'It is delicious!', pronunciation: 'Oy-she-dess' },
          { original: 'Okaikei onegaishimasu', translated: 'Check, please', pronunciation: 'Oh-kye-kay' },
        ]
      }
    ]
  },
  French: {
    name: 'France',
    flag: '🇫🇷',
    etiquette: {
      dos: [
        { title: 'Say Bonjour', desc: 'Always greet shopkeepers with "Bonjour" when entering.' },
        { title: 'Dress Semi-formally', desc: 'Parisians appreciate a put-together appearance.' },
        { title: 'Moderate Volume', desc: 'Keep your speaking volume low in public spaces.' },
      ],
      donts: [
        { title: 'Rushing Meals', desc: 'Dining is meant to be slow and enjoyed; don\'t rush the waiter.' },
        { title: 'Addressing Informal', desc: 'Use "Vous" instead of "Tu" unless invited otherwise.' },
        { title: 'Expecting English', desc: 'Start with a bit of French, even if just "Pardon, parlez-vous anglais?"' },
      ],
      essentials: [
        { icon: '🥖', title: 'Boulangerie', desc: 'Buy bread daily; it\'s the heartbeat of local life.' },
        { icon: '🍷', title: 'Wine Pouring', desc: 'Let the host pour the wine; don\'t fill your own glass first.' },
        { icon: '🥐', title: 'Petit Déjeuner', desc: 'Breakfast is light, usually coffee and a pastry.' },
      ]
    },
    phrases: [
      {
        category: 'Greetings',
        items: [
          { original: 'Bonjour', translated: 'Hello / Good day', pronunciation: 'Bon-zhoor' },
          { original: 'Merci beaucoup', translated: 'Thank you very much', pronunciation: 'Mair-see-boh-koo' },
          { original: 'S\'il vous plaît', translated: 'Please', pronunciation: 'Seel-voo-play' },
        ]
      },
      {
        category: 'Directions',
        items: [
          { original: 'Où est le métro?', translated: 'Where is the metro?', pronunciation: 'Oo-ay-luh-may-troh' },
          { original: 'À gauche / À droite', translated: 'To the left / To the right', pronunciation: 'Ah-goah-sh / Ah-dr-waht' },
        ]
      }
    ]
  },
   Spanish: {
    name: 'Spain',
    flag: '🇪🇸',
    etiquette: {
      dos: [
        { title: 'The Siesta', desc: 'Respect that many shops close between 2 PM and 5 PM.' },
        { title: 'Late Dining', desc: 'Dinner starts late, usually after 8:30 PM or 9 PM.' },
        { title: 'Social Kissing', desc: 'Two kisses on the cheeks is a common greeting for friends.' },
      ],
      donts: [
        { title: 'Eating Breakfast', desc: 'Don\'t expect a heavy breakfast; it\'s usually coffee and a tostada.' },
        { title: 'Strict Punctuality', desc: 'Social gatherings often start 15-30 minutes after the set time.' },
        { title: 'Heavy Tipping', desc: 'Local people rarely leave more than a few coins as a tip.' },
      ],
      essentials: [
        { icon: '🥘', title: 'Paella Rules', desc: 'Authentic paella is traditionally eaten at lunch, not dinner.' },
        { icon: '💃', title: 'Flamenco', desc: 'In Andalusia, respect the silence during a performance.' },
        { icon: '🍷', title: 'Tapéo', desc: 'Going for "tapas" usually means moving from bar to bar.' },
      ]
    },
    phrases: [
      {
        category: 'Greetings',
        items: [
          { original: 'Hola', translated: 'Hello', pronunciation: 'Oh-lah' },
          { original: 'Gracias', translated: 'Thank you', pronunciation: 'Grah-see-as' },
          { original: '¿Cómo estás?', translated: 'How are you?', pronunciation: 'Koh-moh-es-tahs' },
        ]
      },
      {
        category: 'Help',
        items: [
          { original: '¿Dónde está el baño?', translated: 'Where is the bathroom?', pronunciation: 'Don-day-es-tah' },
          { original: 'Ayuda, por favor', translated: 'Help, please', pronunciation: 'Ah-yoo-dah' },
        ]
      }
    ]
  }
};
