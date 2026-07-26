/* ==========================================================================
   Ben Guerdane Louage Station - Core Interactive Application
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Initial State --- */
  let currentLang = localStorage.getItem('station_lang') || 'en';
  let currentTheme = localStorage.getItem('station_theme') || 'light';
  let slideIndex = 0;
  let slideTimer = null;
  let syncCountdown = 30;
  let syncInterval = null;

  /* --- Master 8 Destinations Dataset with Queued Louages --- */
  const destinationsData = [
    {
      id: 'tunis',
      nameEn: 'Tunis', nameFr: 'Tunis', nameAr: 'تونس العاصمة',
      distance: 490,
      timeEn: '5h 30m', timeFr: '5h 30m', timeAr: '5 ساعات و 30 د',
      price: 32.50,
      freqEn: 'Every 30 min', freqFr: 'Toutes les 30 min', freqAr: 'كل 30 دقيقة',
      totalSeats: 8, availableSeats: 5, status: 'Available', dock: 'Dock 1',
      plate: '142 TN 8891', model: 'Peugeot Expert (Air-Con)',
      queuedLouages: [
        { num: 2, plate: '156 TN 9102', model: 'Peugeot Boxer' },
        { num: 3, plate: '178 TN 1240', model: 'Citroën Jumper' }
      ],
      stopoversEn: 'Medenine, Gabes, Sfax, Sousse',
      stopoversFr: 'Médenine, Gabès, Sfax, Sousse',
      stopoversAr: 'مدنين، قابس، صفاقس، سوسة',
      descEn: 'Direct express louage service connecting Ben Guerdane to Monastir Pass and Tunis Grand Station. Fast motorway route with climate control.',
      descFr: 'Ligne express reliant Ben Guerdane au grand terminal de Tunis via l’autoroute A1. Véhicule climatisé haut confort.',
      descAr: 'خط سريع مباشر يربط بين بنقردان والمحطة الكبرى بتونس عبر الطريق السيارة مع تكييف كامل وراحة تامة.',
      tipsEn: 'Best departure window is between 05:00 and 08:00 AM. Baggage space included at Dock 1.',
      tipsFr: 'Meilleur créneau de départ entre 05h00 et 08h00. Bagages inclus au Quai 1.',
      tipsAr: 'أفضل توقيت للانطلاق بين 05:00 و 08:00 صباحاً. مكان الأمتعة متوفر بالرصيف 1.',
      image: 'images/tunis_ph.jpg'
    },
    {
      id: 'sousse',
      nameEn: 'Sousse', nameFr: 'Sousse', nameAr: 'سوسة',
      distance: 350,
      timeEn: '4h 15m', timeFr: '4h 15m', timeAr: '4 ساعات و 15 د',
      price: 24.00,
      freqEn: 'Every 45 min', freqFr: 'Toutes les 45 min', freqAr: 'كل 45 دقيقة',
      totalSeats: 8, availableSeats: 3, status: 'Almost Full', dock: 'Dock 2',
      plate: '118 TN 4022', model: 'Volkswagen Transporter T6',
      queuedLouages: [
        { num: 2, plate: '144 TN 2011', model: 'VW Transporter T6' },
        { num: 3, plate: '160 TN 8812', model: 'Peugeot Expert' },
        { num: 4, plate: '185 TN 3309', model: 'Renault Master' }
      ],
      stopoversEn: 'Gabes, Maharès, Sfax',
      stopoversFr: 'Gabès, Maharès, Sfax',
      stopoversAr: 'قابس، المحرس، صفاقس',
      descEn: 'Connects Southeastern Tunisia to Sousse Pearl of the Sahel. Ideal for university students, professionals, and beachgoers.',
      descFr: 'Relie le Sud-Est tunisien à la Perle du Sahel, Sousse. Ligne très prisée par les étudiants et professionnels.',
      descAr: 'تربط الجنوب الشرقي بجوهرة الساحل سوسة. خط متميز للطلبة والمهنيين والمسافرين.',
      tipsEn: 'Departs promptly once 8 seats are filled. Ticket counter window 2.',
      tipsFr: 'Départ dès remplissage des 8 places. Guichet 2.',
      tipsAr: 'تنطلق فور اكتمال 8 مقاعد. القاطعة رقم 2.',
      image: 'images/sousse_ph.jfif'
    },
    {
      id: 'sfax',
      nameEn: 'Sfax', nameFr: 'Sfax', nameAr: 'صفاقس',
      distance: 220,
      timeEn: '2h 45m', timeFr: '2h 45m', timeAr: '2 ساعتان و 45 د',
      price: 16.50,
      freqEn: 'Every 20 min', freqFr: 'Toutes les 20 min', freqAr: 'كل 20 دقيقة',
      totalSeats: 8, availableSeats: 2, status: 'Almost Full', dock: 'Dock 3',
      plate: '135 TN 6710', model: 'Peugeot Boxer Express',
      queuedLouages: [
        { num: 2, plate: '129 TN 5510', model: 'Peugeot Expert' },
        { num: 3, plate: '151 TN 6620', model: 'Citroën Jumper' },
        { num: 4, plate: '168 TN 7730', model: 'Fiat Ducato' },
        { num: 5, plate: '190 TN 8840', model: 'VW Caravelle' }
      ],
      stopoversEn: 'Gabes, Maharès',
      stopoversFr: 'Gabès, Maharès',
      stopoversAr: 'قابس، المحرس',
      descEn: 'Frequent daily commercial artery connecting Medenine Governorate directly to the economic capital of Sfax.',
      descFr: 'Axe commercial majeur à fréquence élevée reliant Médenine à la capitale économique Sfax.',
      descAr: 'شريان تجاري واقتصادي يومي عالي التردد يربط ولاية مدنين مباشرة بالعاصمة الاقتصادية صفاقس.',
      tipsEn: 'High frequency during business hours. Priority boarding for express commuters.',
      tipsFr: 'Fréquence élevée aux heures de pointe. Embarquement prioritaire.',
      tipsAr: 'انطلاقات متواترة خلال ساعات العمل. أولوية للركاب السريعين.',
      image: 'images/sfax_ph.jfif'
    },
    {
      id: 'gabes',
      nameEn: 'Gabès', nameFr: 'Gabès', nameAr: 'قابس',
      distance: 120,
      timeEn: '1h 30m', timeFr: '1h 30m', timeAr: '1 ساعة و 30 د',
      price: 9.80,
      freqEn: 'Every 15 min', freqFr: 'Toutes les 15 min', freqAr: 'كل 15 دقيقة',
      totalSeats: 8, availableSeats: 1, status: 'Departing Soon', dock: 'Dock 4',
      plate: '95 TN 4410', model: 'Citroën Jumper HDi',
      queuedLouages: [
        { num: 2, plate: '102 TN 3311', model: 'Citroën Jumper' },
        { num: 3, plate: '145 TN 4422', model: 'Peugeot Expert' }
      ],
      stopoversEn: 'Mareth, Matmata Junction',
      stopoversFr: 'Mareth, Jonction Matmata',
      stopoversAr: 'مareth، مفترق مطماطة',
      descEn: 'Rapid coastal connector to Gabès oasis and railway connection hub. Continuous departures throughout the day.',
      descFr: 'Liaison rapide vers l’oasis de Gabès et le nœud ferroviaire. Départs continus toute la journée.',
      descAr: 'ربط ساحلي سريع نحو واحة قابس ومحطة القطار. مغادرات متواصلة على مدار اليوم.',
      tipsEn: 'Only 1 seat left for immediate departure! Board at Dock 4.',
      tipsFr: 'Plus qu’une seule place disponible ! Embarquement Quai 4.',
      tipsAr: 'مقعد واحد متبق للانطلاق الفوري! الركوب في الرصيف 4.',
      image: 'images/gabes_ph.png'
    },
    {
      id: 'medenine',
      nameEn: 'Médenine', nameFr: 'Médenine', nameAr: 'مدنين',
      distance: 33,
      timeEn: '0h 30m', timeFr: '0h 30m', timeAr: '30 دقيقة',
      price: 3.50,
      freqEn: 'Continuous', freqFr: 'En continu', freqAr: 'مستمر على مدار الساعة',
      totalSeats: 8, availableSeats: 6, status: 'Available', dock: 'Dock 5',
      plate: '130 TN 1092', model: 'Peugeot Expert Combi',
      queuedLouages: [
        { num: 2, plate: '112 TN 1001', model: 'Peugeot Expert' },
        { num: 3, plate: '125 TN 2002', model: 'Renault Master' },
        { num: 4, plate: '138 TN 3003', model: 'Citroën Jumper' },
        { num: 5, plate: '150 TN 4004', model: 'VW Caravelle' }
      ],
      stopoversEn: 'Direct Express Shuttle',
      stopoversFr: 'Navette Directe Express',
      stopoversAr: 'مباشر بدون توقف',
      descEn: 'Regional administrative trunk shuttle connecting Ben Guerdane directly to Medenine provincial capital in 30 minutes.',
      descFr: 'Navette administrative régionale reliant Ben Guerdane au chef-lieu du gouvernorat Médenine en 30 minutes.',
      descAr: 'خط إقليمي إداري سريع يربط بنقردان بمركز الولاية مدنين في 30 دقيقة فقط.',
      tipsEn: 'Departs continuously with non-stop express highway connection.',
      tipsFr: 'Départs en continu via la route express sans arrêt.',
      tipsAr: 'رحلات مستمرة دون توقف عبر الطريق السريع.',
      image: 'images/mednine_ph.png'
    },
    {
      id: 'zarzis',
      nameEn: 'Zarzis', nameFr: 'Zarzis', nameAr: 'جرجيس',
      distance: 45,
      timeEn: '0h 40m', timeFr: '0h 40m', timeAr: '40 دقيقة',
      price: 4.20,
      freqEn: 'Continuous', freqFr: 'En continu', freqAr: 'مستمر على مدار الساعة',
      totalSeats: 8, availableSeats: 4, status: 'Available', dock: 'Dock 6',
      plate: '88 TN 6625', model: 'Renault Master DCI',
      queuedLouages: [
        { num: 2, plate: '92 TN 1122', model: 'Renault Master' },
        { num: 3, plate: '115 TN 3344', model: 'Peugeot Expert' },
        { num: 4, plate: '140 TN 5566', model: 'Citroën Jumper' }
      ],
      stopoversEn: 'Souihel Coast Road',
      stopoversFr: 'Route Côtière Souihel',
      stopoversAr: 'طريق سويحل الساحلي',
      descEn: 'Coastal coastal route serving Zarzis olive groves, port, and seaside resort area from Ben Guerdane terminal.',
      descFr: 'Ligne côtière reliant Ben Guerdane à la zone portuaire et balnéaire de Zarzis.',
      descAr: 'خط ساحلي يربط بنقردان بالمنطقة المينائية والسياحية بجرجيس.',
      tipsEn: 'Scenic coastal drive. Air-conditioned vehicle available.',
      tipsFr: 'Trajet panoramique de la côte. Véhicule climatisé.',
      tipsAr: 'طريق ساحلي جميل. سيارات مكيفة متوفرة.',
      image: 'images/zarzis_ph.png'
    },
    {
      id: 'djerba',
      nameEn: 'Djerba', nameFr: 'Djerba', nameAr: 'جربة',
      distance: 85,
      timeEn: '1h 15m', timeFr: '1h 15m', timeAr: '1 ساعة و 15 د',
      price: 7.50,
      freqEn: 'Every 20 min', freqFr: 'Toutes les 20 min', freqAr: 'كل 20 دقيقة',
      totalSeats: 8, availableSeats: 7, status: 'Available', dock: 'Dock 7',
      plate: '104 TN 3301', model: 'Volkswagen Caravelle',
      queuedLouages: [
        { num: 2, plate: '110 TN 9911', model: 'VW Caravelle' },
        { num: 3, plate: '132 TN 8822', model: 'Peugeot Expert' }
      ],
      stopoversEn: 'El Kantara Roman Causeway, Houmt Souk',
      stopoversFr: 'Chaussée Romaine El Kantara, Houmt Souk',
      stopoversAr: 'القنطرة الرومانية، حومة السوق',
      descEn: 'Direct route over the ancient Roman Causeway to Djerba Island (Houmt Souk and Midoun resort zones).',
      descFr: 'Ligne directe empruntant la Chaussée Romaine vers l’île de Djerba (Houmt Souk & Midoun).',
      descAr: 'خط مباشر عبر الطريق الرومانية نحو جزيرة جربة (حومة السوق وميدون).',
      tipsEn: 'Crosses El Kantara causeway. Excellent island connection.',
      tipsFr: 'Traverse la chaussée d’El Kantara. Connexion directe.',
      tipsAr: 'يعبر طريق القنطرة الرومانية التاريخية. ربط ممتاز.',
      image: 'images/djerba_ph.jfif'
    },
    {
      id: 'tataouine',
      nameEn: 'Tataouine', nameFr: 'Tataouine', nameAr: 'تطاوين',
      distance: 80,
      timeEn: '1h 05m', timeFr: '1h 05m', timeAr: '1 ساعة و 05 د',
      price: 6.80,
      freqEn: 'Every 30 min', freqFr: 'Toutes les 30 min', freqAr: 'كل 30 دقيقة',
      totalSeats: 8, availableSeats: 2, status: 'Almost Full', dock: 'Dock 8',
      plate: '99 TN 5218', model: 'Peugeot Expert HDI',
      queuedLouages: [
        { num: 2, plate: '105 TN 4411', model: 'Peugeot Expert' },
        { num: 3, plate: '128 TN 5522', model: 'Renault Master' },
        { num: 4, plate: '154 TN 6633', model: 'Citroën Jumper' }
      ],
      stopoversEn: 'Ghomrassen Junction, Ksar Ouled Soltane Jct',
      stopoversFr: 'Jonction Ghomrassen, Ksar Ouled Soltane',
      stopoversAr: 'مفترق غمراسن، كسر أولاد سلطان',
      descEn: 'Connects Ben Guerdane to the desert gateway Tataouine. Serves local commuters, merchants, and desert travelers.',
      descFr: 'Reliant Ben Guerdane aux portes du désert à Tataouine. Sert les commerçants et visiteurs.',
      descAr: 'يربط بنقردان ببوابة الصحراء تطاوين. يخدم المسافرين والتجار والزوار.',
      tipsEn: 'Comfortable seating with spacious luggage compartments.',
      tipsFr: 'Sièges confortables avec compartiment à bagages spacieux.',
      tipsAr: 'مقاعد مريحة مع صندوق أمتعة واسع.',
      image: 'images/tataouine_ph.png'
    }
  ];

  /* --- Multi-Language Dictionary --- */
  const translations = {
    en: {
      brand_name: "Ben Guerdane Louage",
      brand_sub: "Real-Time Hub • Tunisia",
      nav_home: "Home",
      nav_destinations: "Destinations",
      nav_about: "About",
      nav_contact: "Contact",
      hero_tagline: "Live Terminal Status • Ben Guerdane",
      hero_title: "Ben Guerdane Louage Station",
      hero_subtitle: "Live information about available louages, real-time seat counts, prices, and departures from Ben Guerdane hub.",
      hero_btn_dest: "View Destinations",
      hero_btn_about: "About Station",
      search_placeholder: "Search destination e.g. Tunis, Sfax, Djerba...",
      filter_all: "All Destinations",
      filter_available: "Available Now",
      filter_almost: "Almost Full",
      filter_departing: "Departing Soon",
      dest_badge: "Popular Routes",
      dest_title: "Destination Hubs",
      dest_subtitle: "Explore routes departing from Ben Guerdane Louage Station across Tunisia.",
      about_badge: "About Our Hub",
      about_title: "The Southeastern Transport Gateway of Tunisia",
      about_p1: "Ben Guerdane Louage Station serves as a vital arterial transport hub in Medenine Governorate, bridging southern Tunisia with coastal economic centers and international corridors.",
      about_p2: "Our modern station facility combines classic louage convenience with cutting-edge SaaS monitoring, ensuring comfortable waiting lounges, transparent pricing, and efficient vehicle dispatching.",
      about_stat_lbl: "Digitalized Management",
      about_h1: "Official Tariff Rates",
      about_h2: "Air-Conditioned Lounges",
      about_h3: "24/7 Security Supervision",
      about_h4: "Priority Baggage Handling",
      contact_badge: "Get In Touch",
      contact_title: "Contact Station Administration",
      contact_subtitle: "Have questions regarding routes, group travel, or lost & found? Reach out to our team.",
      contact_addr_title: "Station Location",
      contact_addr_desc: "Avenue Habib Bourguiba / Route Ras Jedir, Ben Guerdane 4160, Medenine, Tunisia",
      contact_phone_title: "Phone & Support",
      contact_email_title: "Email Address",
      map_pin_title: "Ben Guerdane Louage Station",
      map_btn_open: "Open Map",
      form_name: "Full Name",
      form_name_placeholder: "e.g. Mohamed Ben Salem",
      form_email: "Email Address",
      form_email_placeholder: "name@example.com",
      form_message: "Your Message",
      form_msg_placeholder: "Write your inquiry here...",
      form_btn: "Send Message",
      footer_gov: "Medenine Governorate • Tunisia",
      footer_desc: "Ben Guerdane Louage Station real-time passenger transport hub. Connecting southern Tunisia with major coastal and inland cities with live seat availability.",
      footer_quick_links: "Quick Links",
      footer_top_routes: "Top Routes",
      footer_project_team: "Project Team",
      role_ali: "Project Lead & System Analyst",
      role_siraj: "Full-Stack Developer",
      footer_credit_prefix: "Designed and built by",
      footer_credit_and: "and",
      footer_rights: "All rights reserved.",
      footer_system_op: "System Operational • Real-Time Sync Active",
      sync_just_now: "Synced just now",
      view_details: "View Details",
      seats_avail: "available",
      dist_lbl: "Distance",
      est_lbl: "Est. Duration",
      price_lbl: "Price",
      status_avail: "Available",
      status_almost: "Almost Full",
      status_departing: "Departing Soon",
      status_waiting: "Waiting",
      seat_map_title: "Active Louage (#1 Loading)",
      next_louages_lbl: "Next Louages in Queue",
      queued_badge_suffix: "Queued",
      terminal_queue_title: "Terminal Dock Queue Status",
      modal_terminal_bay: "Assigned Dock Bay",
      modal_fixed_price: "Official Tariff Rate",
      modal_vehicle_info: "Current Loading Vehicle",
      modal_stopovers: "Stopovers and Route",
      modal_tips: "Travel Guidance",
      modal_close: "Close Overview",
      seat_tooltip_avail: "Available Seat",
      seat_tooltip_occ: "Occupied Seat",
      no_results: "No destinations found matching your criteria."
    },
    fr: {
      brand_name: "Station Louage Ben Guerdane",
      brand_sub: "Hub En Temps Réel • Tunisie",
      nav_home: "Accueil",
      nav_destinations: "Destinations",
      nav_about: "À Propos",
      nav_contact: "Contact",
      hero_tagline: "Statut En Direct • Ben Guerdane",
      hero_title: "Station de Louage Ben Guerdane",
      hero_subtitle: "Informations en direct sur les louages disponibles, les places en temps réel, les prix et les départs depuis Ben Guerdane.",
      hero_btn_dest: "Voir Destinations",
      hero_btn_about: "À Propos de la Station",
      search_placeholder: "Rechercher destination ex. Tunis, Sfax, Djerba...",
      filter_all: "Toutes Destinations",
      filter_available: "Disponible",
      filter_almost: "Presque Plein",
      filter_departing: "Départ Imminent",
      dest_badge: "Lignes Populaires",
      dest_title: "Réseau de Destinations",
      dest_subtitle: "Découvrez les lignes au départ de la station de louage de Ben Guerdane.",
      about_badge: "Notre Station",
      about_title: "Le Carrefour de Transport du Sud-Est",
      about_p1: "La station de louage de Ben Guerdane constitue un nœud de transport stratégique dans le gouvernorat de Médenine.",
      about_p2: "Notre gare moderne combine l'agilité des louages avec le suivi numérique de pointe.",
      about_stat_lbl: "Gestion Digitalisée",
      about_h1: "Tarifs Officiels",
      about_h2: "Salles d'Attente Climatisées",
      about_h3: "Sécurité 24/7",
      about_h4: "Gestion des Bagages",
      contact_badge: "Contactez-Nous",
      contact_title: "Administration de la Station",
      contact_subtitle: "Des questions sur les lignes ou les objets perdus ? Contactez notre équipe.",
      contact_addr_title: "Adresse de la Station",
      contact_addr_desc: "Avenue Habib Bourguiba / Route Ras Jedir, Ben Guerdane 4160, Médenine, Tunisie",
      contact_phone_title: "Téléphone",
      contact_email_title: "Email",
      map_pin_title: "Station Louage Ben Guerdane",
      map_btn_open: "Ouvrir Carte",
      form_name: "Nom Complet",
      form_name_placeholder: "ex. Mohamed Ben Salem",
      form_email: "Adresse Email",
      form_email_placeholder: "nom@exemple.com",
      form_message: "Votre Message",
      form_msg_placeholder: "Écrivez votre message ici...",
      form_btn: "Envoyer le Message",
      footer_gov: "Gouvernorat de Médenine • Tunisie",
      footer_desc: "Station de Louage de Ben Guerdane - Hub de transport de passagers en temps réel.",
      footer_quick_links: "Liens Rapides",
      footer_top_routes: "Lignes Principales",
      footer_project_team: "Équipe du Projet",
      role_ali: "Chef de Projet & Analyste Système",
      role_siraj: "Développeur Full-Stack",
      footer_credit_prefix: "Conçu et développé par",
      footer_credit_and: "et",
      footer_rights: "Tous droits réservés.",
      footer_system_op: "Système Opérationnel • Synchro Temps Réel",
      sync_just_now: "Mis à jour à l'instant",
      view_details: "Détails",
      seats_avail: "disponibles",
      dist_lbl: "Distance",
      est_lbl: "Durée Est.",
      price_lbl: "Prix",
      status_avail: "Disponible",
      status_almost: "Presque Plein",
      status_departing: "Départ Imminent",
      status_waiting: "En Attente",
      seat_map_title: "Louage Active (#1 En Chargement)",
      next_louages_lbl: "Louages Suivantes en File",
      queued_badge_suffix: "En File",
      terminal_queue_title: "File d'Attente des Louages au Quai",
      modal_terminal_bay: "Quai d'Embarquement",
      modal_fixed_price: "Tarif Officiel Réglementé",
      modal_vehicle_info: "Véhicule Actuel en Chargement",
      modal_stopovers: "Escale et Villes Traversées",
      modal_tips: "Conseils et Guide Voyage",
      modal_close: "Fermer Aperçu",
      seat_tooltip_avail: "Siège Libre pour Réservation",
      seat_tooltip_occ: "Siège Occupé par Passager",
      no_results: "Aucune destination ne correspond à votre recherche."
    },
    ar: {
      brand_name: "محطة لواج بنقردان",
      brand_sub: "مركز المعلومات المباشر • تونس",
      nav_home: "الرئيسية",
      nav_destinations: "الوجهات",
      nav_about: "عن المحطة",
      nav_contact: "اتصل بنا",
      hero_tagline: "حالة المحطة المباشرة • بنقردان",
      hero_title: "محطة لواج بنقردان",
      hero_subtitle: "معلومات مباشرة عن سيارات اللواج المتاحة، الأماكن الشاغرة المرئية، الأسعار، والمغادرات من محطة بنقردان.",
      hero_btn_dest: "عرض الوجهات",
      hero_btn_about: "عن المحطة",
      search_placeholder: "ابحث عن وجهتك مثل تونس، صفاقس، جربة...",
      filter_all: "جميع الوجهات",
      filter_available: "متاح الآن",
      filter_almost: "شبه مكتمل",
      filter_departing: "مغادرة وشيكة",
      dest_badge: "الخطوط الشائعة",
      dest_title: "شبكة الوجهات",
      dest_subtitle: "استكشف الرحلات المنطلقة من محطة اللواج بنقردان نحو مختلف أنحاء تونس.",
      about_badge: "عن المحطة",
      about_title: "شريان المواصلات في الجنوب الشرقي",
      about_p1: "تعتبر محطة اللواج ببنقردان نقطة عبور حيوية بولاية مدنين لربط الجنوب بالمراكز الاقتصادية.",
      about_p2: "تجمع محطتنا بين مرونة وسيلة اللواج وأحدث نظم المتابعة الرقمية.",
      about_stat_lbl: "إدارة رقمية 100%",
      about_h1: "أسعار رسمية مظبوطة",
      about_h2: "قاعات انتظار مكيفة",
      about_h3: "حراسة وأمان 24/7",
      about_h4: "خدمة الأمتعة المباشرة",
      contact_badge: "تواصل معنا",
      contact_title: "إدارة محطة بنقردان",
      contact_subtitle: "هل لديك استفسار حول الخطوط أو المفقودات؟ تواصل معنا.",
      contact_addr_title: "عنوان المحطة",
      contact_addr_desc: "شارع الحبيب بورقيبة / طريق رأس جدير، بنقردان 4160، مدنين، تونس",
      contact_phone_title: "الهاتف والدعم",
      contact_email_title: "البريد الإلكتروني",
      map_pin_title: "محطة اللواج بنقردان",
      map_btn_open: "فتح الخريطة",
      form_name: "الاسم الكامل",
      form_name_placeholder: "مثال: محمد بن سالم",
      form_email: "البريد الإلكتروني",
      form_email_placeholder: "name@example.com",
      form_message: "رسالتك",
      form_msg_placeholder: "اكتب استفسارك هنا...",
      form_btn: "إرسال الرسالة",
      footer_gov: "ولاية مدنين • تونس",
      footer_desc: "محطة سيارات اللواج بنقردان - مركز النقل البري المباشر للمسافرين.",
      footer_quick_links: "روابط سريعة",
      footer_top_routes: "أهم الخطوط",
      footer_project_team: "فريق المشروع",
      role_ali: "قائد المشروع ومحلل النظم",
      role_siraj: "مطور الويب الشامل",
      footer_credit_prefix: "تصميم وتطوير",
      footer_credit_and: "و",
      footer_rights: "جميع الحقوق محفوظة.",
      footer_system_op: "النظام يعمل • التحديث المباشر نشط",
      sync_just_now: "تم التحديث الآن",
      view_details: "التفاصيل",
      seats_avail: "شاغرة",
      dist_lbl: "المسافة",
      est_lbl: "الزمن المتوقع",
      price_lbl: "السعر",
      status_avail: "متاح",
      status_almost: "شبه مكتمل",
      status_departing: "انطلاق وشيك",
      status_waiting: "في الانتظار",
      seat_map_title: "سيارة اللواج الحالية (#1 قيد الركوب)",
      next_louages_lbl: "سيارات اللواج التالية في الانتظار",
      queued_badge_suffix: "في الانتظار",
      terminal_queue_title: "طابور سيارات اللواج بالرصيف",
      modal_terminal_bay: "رصيف الانطلاق",
      modal_fixed_price: "التعريفة الرسمية المضبوطة",
      modal_vehicle_info: "معلومات السيارة الحالية",
      modal_stopovers: "محطات التوقف والمدن العابرة",
      modal_tips: "دليل وإرشادات السفر",
      modal_close: "إغلاق النظرة العامة",
      seat_tooltip_avail: "مقعد شاغر للحجز",
      seat_tooltip_occ: "مقعد محجوز لمسافر",
      no_results: "لم يتم العثور على وجهات تطابق بحثك."
    }
  };

  /* --- DOM Elements --- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const langBtns = document.querySelectorAll('.lang-btn');
  const liveClockEl = document.getElementById('liveClock');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const destinationsGrid = document.getElementById('destinationsGrid');
  const mobileToggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const contactForm = document.getElementById('contactForm');
  const backToTopBtn = document.getElementById('backToTop');
  const destModal = document.getElementById('destModal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const mainContent = document.getElementById('mainContent');

  // Auto-Sync Elements
  const syncTimerEl = document.getElementById('syncTimer');
  const syncTextEl = document.getElementById('syncText');
  const syncIconEl = document.getElementById('syncIcon');

  // Hero Slider Elements
  const heroSlider = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  const sliderPrevBtn = document.getElementById('sliderPrev');
  const sliderNextBtn = document.getElementById('sliderNext');
  const slideCurrentNum = document.getElementById('slideCurrentNum');
  const slideTotalNum = document.getElementById('slideTotalNum');

  /* --- Initialize Application --- */
  function init() {
    setTheme(currentTheme);
    setLanguage(currentLang);
    initLiveClock();
    initHeroSlider();
    initScrollObserver();
    initLiveSyncEngine();
  }

  /* --- Live 30-Second Auto-Sync Countdown Engine --- */
  function initLiveSyncEngine() {
    function updateCountdown() {
      syncCountdown--;
      if (syncCountdown <= 0) {
        triggerLiveSyncRefresh();
        syncCountdown = 30;
      }
      if (syncTimerEl) {
        syncTimerEl.textContent = `${syncCountdown}s`;
      }
    }

    syncInterval = setInterval(updateCountdown, 1000);
  }

  function triggerLiveSyncRefresh() {
    if (syncIconEl) {
      syncIconEl.classList.add('spinning');
      setTimeout(() => syncIconEl.classList.remove('spinning'), 800);
    }

    if (destinationsData && destinationsData.length > 0) {
      const randomIndex = Math.floor(Math.random() * destinationsData.length);
      const target = destinationsData[randomIndex];

      if (target.availableSeats > 0 && Math.random() > 0.3) {
        target.availableSeats -= 1;
      } else if (target.availableSeats === 0) {
        target.availableSeats = 8;
      } else {
        target.availableSeats = Math.min(8, target.availableSeats + 1);
      }

      if (target.availableSeats >= 5) target.status = 'Available';
      else if (target.availableSeats >= 2) target.status = 'Almost Full';
      else if (target.availableSeats === 1) target.status = 'Departing Soon';
      else target.status = 'Waiting';

      handleFilterChange();

      const card = document.querySelector(`.dest-card[data-id="${target.id}"]`);
      if (card) {
        card.classList.add('seat-flash');
        setTimeout(() => card.classList.remove('seat-flash'), 1000);
      }
    }
  }

  /* --- Set Language & Re-render --- */
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('station_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    const t = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.placeholder = t[key];
      }
    });

    handleFilterChange();
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang !== currentLang) {
        mainContent.classList.add('lang-fade-out');
        setTimeout(() => {
          setLanguage(lang);
          mainContent.classList.remove('lang-fade-out');
        }, 200);
      }
    });
  });

  /* --- Theme Handler --- */
  function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('station_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  themeToggleBtn.addEventListener('click', () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  /* --- 8-Seat Visual Map Generator with Clean Queued Louages Count Summary --- */
  function generateSeatMapHTML(availableSeats, totalSeats = 8, queuedLouages = []) {
    const t = translations[currentLang] || translations.en;
    const occupiedSeatsCount = totalSeats - availableSeats;
    const queuedCount = queuedLouages ? queuedLouages.length : 0;
    
    let queuedText = '';
    if (queuedCount === 1) {
      queuedText = currentLang === 'ar' ? 'سيارة لواج واحدة في الانتظار' : (currentLang === 'fr' ? '1 Louage en Attente' : '1 Louage in Queue');
    } else if (queuedCount > 1) {
      queuedText = currentLang === 'ar' ? `${queuedCount} سيارات لواج في الانتظار` : (currentLang === 'fr' ? `${queuedCount} Louages en Attente` : `${queuedCount} Louages in Queue`);
    }

    let html = `
      <div class="seat-visualization-box">
        <div class="seat-vis-header">
          <div class="seat-vis-title-group">
            <span class="seat-vis-main-title"><i class="fa-solid fa-chair" style="color: var(--accent);"></i> ${t.seat_map_title}</span>
          </div>
          <div class="seat-vis-badges">
            <span class="seat-avail-count-badge ${availableSeats > 0 ? 'avail-green' : 'avail-red'}">
              ${availableSeats} / ${totalSeats} ${t.seats_avail}
            </span>
          </div>
        </div>

        <div class="seat-grid-8">
    `;

    for (let i = 1; i <= totalSeats; i++) {
      const isOccupied = i <= occupiedSeatsCount;
      const seatState = isOccupied ? 'occupied' : 'available';
      const tooltipText = isOccupied ? t.seat_tooltip_occ : t.seat_tooltip_avail;

      html += `
        <div class="seat-item ${seatState}" title="${tooltipText} (#${i})" aria-label="Seat ${i}: ${seatState}">
          <i class="fa-solid fa-chair"></i>
          <span class="seat-number">#${i}</span>
        </div>
      `;
    }

    html += `
        </div>
    `;

    /* Clean Queued Louages Count Summary Footer */
    if (queuedCount > 0) {
      html += `
        <div class="queued-count-footer">
          <i class="fa-solid fa-van-shuttle" style="color: var(--accent);"></i>
          <span>${queuedText}</span>
        </div>
      `;
    }

    html += `
      </div>
    `;

    return html;
  }

  /* --- Render Status Badges --- */
  function getStatusBadgeHTML(status) {
    const t = translations[currentLang] || translations.en;
    if (status === 'Available') {
      return `<span class="status-badge status-badge-available"><i class="fa-solid fa-circle-check"></i> ${t.status_avail}</span>`;
    } else if (status === 'Almost Full') {
      return `<span class="status-badge status-badge-almost"><i class="fa-solid fa-triangle-exclamation"></i> ${t.status_almost}</span>`;
    } else if (status === 'Departing Soon') {
      return `<span class="status-badge status-badge-departing"><i class="fa-solid fa-bolt"></i> ${t.status_departing}</span>`;
    } else {
      return `<span class="status-badge status-badge-waiting"><i class="fa-solid fa-clock"></i> ${t.status_waiting}</span>`;
    }
  }

  /* --- Render Destination Cards (8 Destinations) --- */
  function renderDestinations(items) {
    const t = translations[currentLang] || translations.en;
    destinationsGrid.innerHTML = '';

    if (!items || items.length === 0) {
      destinationsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-route-slash" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p style="font-weight: 800; font-size: 1.1rem;">${t.no_results}</p>
        </div>
      `;
      return;
    }

    items.forEach(dest => {
      const name = currentLang === 'ar' ? dest.nameAr : (currentLang === 'fr' ? dest.nameFr : dest.nameEn);
      const time = currentLang === 'ar' ? dest.timeAr : (currentLang === 'fr' ? dest.timeFr : dest.timeEn);
      const freq = currentLang === 'ar' ? dest.freqAr : (currentLang === 'fr' ? dest.freqFr : dest.freqEn);

      const card = document.createElement('article');
      card.className = 'dest-card reveal active';
      card.setAttribute('data-id', dest.id);

      card.innerHTML = `
        <div>
          <div class="dest-img-box">
            <img src="${dest.image}" alt="${name}" class="dest-img">
            <div class="dest-img-overlay">
              <div class="dest-title-overlay">
                <h3>${name}</h3>
                <span class="dest-freq-tag"><i class="fa-solid fa-rotate"></i> ${freq}</span>
              </div>
            </div>
            <div class="dest-badge-top">
              ${getStatusBadgeHTML(dest.status)}
            </div>
          </div>

          <div class="dest-card-body">
            <div class="dest-info-row">
              <div class="info-item">
                <span class="info-label">${t.dist_lbl}</span>
                <span class="info-value">${dest.distance} km</span>
              </div>
              <div class="info-item">
                <span class="info-label">${t.est_lbl}</span>
                <span class="info-value">${time}</span>
              </div>
            </div>

            ${generateSeatMapHTML(dest.availableSeats, 8, dest.queuedLouages)}
          </div>
        </div>

        <div class="dest-card-body" style="padding-top: 0;">
          <div class="dest-card-footer">
            <div class="price-tag">
              <span class="price-amount">${dest.price.toFixed(2)}</span>
              <span class="price-unit">TND / seat</span>
            </div>
            <button class="btn btn-primary btn-sm view-details-btn" data-id="${dest.id}">
              ${t.view_details} <i class="fa-solid ${currentLang === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'}"></i>
            </button>
          </div>
        </div>
      `;

      destinationsGrid.appendChild(card);
    });

    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openDestinationModal(id);
      });
    });
  }

  /* --- Multi-Language Search & Normalization --- */
  function normalizeText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u0652]/g, '')
      .trim();
  }

  let activeFilter = 'all';

  function getFilteredDestinations() {
    const rawQuery = searchInput.value;
    const query = normalizeText(rawQuery);

    if (searchClearBtn) {
      searchClearBtn.classList.toggle('show', rawQuery.length > 0);
    }

    return destinationsData.filter(item => {
      const haystack = normalizeText(
        `${item.nameEn} ${item.nameFr} ${item.nameAr} ` +
        `${item.stopoversEn} ${item.stopoversFr} ${item.stopoversAr} ` +
        `${item.descEn} ${item.descFr} ${item.descAr} ` +
        `${item.distance} ${item.price} ${item.dock} ${item.plate}`
      );

      const matchesSearch = query === '' || haystack.includes(query);
      const matchesFilter = activeFilter === 'all' || item.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }

  function handleFilterChange() {
    const filtered = getFilteredDestinations();
    renderDestinations(filtered);
  }

  searchInput.addEventListener('input', handleFilterChange);

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      handleFilterChange();
      searchInput.focus();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter');
      handleFilterChange();
    });
  });

  /* --- Hero Slider Engine --- */
  function initHeroSlider() {
    if (slideTotalNum && slides.length > 0) {
      slideTotalNum.textContent = String(slides.length).padStart(2, '0');
    }

    function goToSlide(index) {
      if (!slides || slides.length === 0) return;
      slideIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === slideIndex);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === slideIndex);
      });

      if (slideCurrentNum) {
        slideCurrentNum.textContent = String(slideIndex + 1).padStart(2, '0');
      }
    }

    function nextSlide() {
      goToSlide(slideIndex + 1);
    }

    function startTimer() {
      stopTimer();
      slideTimer = setInterval(nextSlide, 5000);
    }

    function stopTimer() {
      if (slideTimer) clearInterval(slideTimer);
    }

    if (sliderNextBtn) {
      sliderNextBtn.addEventListener('click', () => {
        nextSlide();
        startTimer();
      });
    }

    if (sliderPrevBtn) {
      sliderPrevBtn.addEventListener('click', () => {
        goToSlide(slideIndex - 1);
        startTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startTimer();
      });
    });

    if (heroSlider) {
      heroSlider.addEventListener('mouseenter', stopTimer);
      heroSlider.addEventListener('mouseleave', startTimer);
    }

    goToSlide(0);
    startTimer();
  }

  /* --- Travel Details Modal Window with Full License Plate & Model Queue Breakdown --- */
  function openDestinationModal(id) {
    const item = destinationsData.find(d => d.id === id);
    if (!item) return;

    const t = translations[currentLang] || translations.en;
    const name = currentLang === 'ar' ? item.nameAr : (currentLang === 'fr' ? item.nameFr : item.nameEn);
    const time = currentLang === 'ar' ? item.timeAr : (currentLang === 'fr' ? item.timeFr : item.timeEn);
    const freq = currentLang === 'ar' ? item.freqAr : (currentLang === 'fr' ? item.freqFr : item.freqEn);
    const stopovers = currentLang === 'ar' ? item.stopoversAr : (currentLang === 'fr' ? item.stopoversFr : item.stopoversEn);
    const desc = currentLang === 'ar' ? item.descAr : (currentLang === 'fr' ? item.descFr : item.descEn);
    const tips = currentLang === 'ar' ? item.tipsAr : (currentLang === 'fr' ? item.tipsFr : item.tipsEn);

    let queueCardsHTML = '';
    if (item.queuedLouages && item.queuedLouages.length > 0) {
      queueCardsHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-list-ol" style="color: var(--accent);"></i> ${t.terminal_queue_title}
          </h4>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            <div style="background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.3); padding: 0.85rem 1.1rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <strong style="color: var(--accent); font-size: 0.85rem; display: block;">#1 - ${t.modal_vehicle_info}</strong>
                <span style="font-size: 0.9rem; font-weight: 700;">${item.model}</span>
              </div>
              <span class="vehicle-plate">${item.plate}</span>
            </div>

            ${item.queuedLouages.map(q => `
              <div style="background: var(--bg-input); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <strong style="color: var(--text-muted); font-size: 0.82rem; display: block;">#${q.num} - ${t.queued_badge_suffix}</strong>
                  <span style="font-size: 0.88rem; font-weight: 700;">${q.model}</span>
                </div>
                <span style="background: var(--bg-card-solid); border: 1px solid var(--border-color); padding: 0.25rem 0.65rem; border-radius: 6px; font-weight: 800; font-size: 0.8rem;">
                  ${q.plate}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="modal-hero-banner">
        <img src="${item.image}" alt="${name}">
        <div class="modal-hero-overlay">
          <div>
            <div style="margin-bottom: 0.4rem;">
              ${getStatusBadgeHTML(item.status)}
            </div>
            <h2 style="font-size: 1.8rem; font-weight: 900; line-height: 1.1;">Ben Guerdane → ${name}</h2>
          </div>
        </div>
      </div>

      <div class="modal-body-content">
        <p style="color: var(--text-muted); font-size: 0.98rem; margin-bottom: 1.5rem; line-height: 1.6;">
          ${desc}
        </p>

        <div style="background: var(--bg-input); padding: 1.25rem; border-radius: var(--radius-lg); display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <span style="color: var(--text-muted); font-size: 0.75rem; display: block; font-weight: 700;">${t.modal_terminal_bay}</span>
            <strong style="color: var(--accent); font-size: 1.15rem;">${item.dock}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.75rem; display: block; font-weight: 700;">${t.modal_fixed_price}</span>
            <strong style="color: var(--text-main); font-size: 1.15rem;">${item.price.toFixed(2)} TND</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.75rem; display: block; font-weight: 700;">${t.dist_lbl}</span>
            <strong>${item.distance} km</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.75rem; display: block; font-weight: 700;">${t.est_lbl}</span>
            <strong>${time} (${freq})</strong>
          </div>
        </div>

        ${generateSeatMapHTML(item.availableSeats, 8, item.queuedLouages)}

        ${queueCardsHTML}

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.4rem; color: var(--text-main);">${t.modal_stopovers}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;"><i class="fa-solid fa-route" style="color: var(--accent);"></i> ${stopovers}</p>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1rem 1.25rem; border-radius: var(--radius-md); display: flex; align-items: flex-start; gap: 0.8rem; font-size: 0.88rem; color: var(--text-main); margin-bottom: 1.5rem;">
          <i class="fa-solid fa-circle-info" style="color: var(--success); font-size: 1.2rem; margin-top: 0.1rem;"></i>
          <div>
            <strong style="display: block; margin-bottom: 0.2rem;">${t.modal_tips}</strong>
            <span>${tips}</span>
          </div>
        </div>

        <button class="btn btn-primary" id="modalCloseBtn" style="width: 100%;">
          ${t.modal_close}
        </button>
      </div>
    `;

    destModal.classList.add('active');
    destModal.setAttribute('aria-hidden', 'false');

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  }

  function closeModal() {
    destModal.classList.remove('active');
    destModal.setAttribute('aria-hidden', 'true');
  }

  modalClose.addEventListener('click', closeModal);
  destModal.addEventListener('click', (e) => {
    if (e.target === destModal) closeModal();
  });

  /* --- Contact Form Submission --- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      showToast(`Thank you, ${name}! Your message has been received.`);
      contactForm.reset();
    });
  }

  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  /* --- Live Clock --- */
  function initLiveClock() {
    function updateClock() {
      if (!liveClockEl) return;
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      liveClockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* --- Scroll Observer & Instant Reveal Guarantee --- */
  function initScrollObserver() {
    function checkReveals() {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(el => {
        el.classList.add('active');
      });
    }

    checkReveals();
    setTimeout(checkReveals, 100);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
  }

  /* --- Mobile Drawer Navigation --- */
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  /* --- Button Ripple Animation --- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const existing = btn.querySelector('.ripple');
    if (existing) existing.remove();

    btn.appendChild(circle);
  });

  // Launch App
  init();
});
