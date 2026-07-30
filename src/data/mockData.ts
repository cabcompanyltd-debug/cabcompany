/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Project, BlogArticle } from '../types';

export const SERVICES = {
  agriculture: [
    {
      id: 'modern-farming',
      title: 'Modern Farming & Crop Production',
      description: 'Precision agronomy deploying IoT soil sensors, automated crop nutrition plans, and smart field mapping to yield high-density, nutrient-rich crops across Ghana.',
      icon: 'Leaf',
      features: ['Precision soil health optimization', 'Automated high-yield drone mapping', 'Drip fertigation integrations', 'Non-GMO certified organic outputs'],
      image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'greenhouse-farming',
      title: 'Greenhouse & Controlled Environment Agriculture (CEA)',
      description: 'Fully automated polycarbonate greenhouses combining smart climate controls, micro-misters, and hydroponic systems optimized for hot tropical weather.',
      icon: 'Sun',
      features: ['Micro-climate automation control', 'Soilless cultivation setups', 'Advanced UV filtration & irrigation loops', 'Integrated pest management (IPM)'],
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'livestock-management',
      title: 'Sustainable Livestock Production',
      description: 'Ethical, climate-smart livestock husbandry with individual biometric tracking, automated organic feeding loops, and certified health standards.',
      icon: 'Activity',
      features: ['Real-time RFID biometric tracking', 'Custom organic nutrition blending', 'Eco-friendly biogas digestion loops', 'Zero-antibiotics certified systems'],
      image: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'irrigation-systems',
      title: 'Precision Irrigation Engineering',
      description: 'Custom-designed water delivery networks integrating low-evaporation micro-sprinklers, smart sub-surface drip loops, and solar-powered pumping arrays.',
      icon: 'Droplet',
      features: ['GPS-guided telemetry integration', 'Weather station synchronization', 'Sub-surface localized root delivery', 'Solar-powered pump arrays'],
      image: 'https://images.unsplash.com/photo-1563514223-745144f41df0?auto=format&fit=crop&q=80&w=1200'
    }
  ],
  water: [
    {
      id: 'industrial-purification',
      title: 'Industrial Water Purification',
      description: 'Multi-stage reverse osmosis, high-velocity nano-filtration, and electro-deionization systems engineered for commercial, agricultural, and municipal scopes.',
      icon: 'Cpu',
      features: ['High-capacity reverse osmosis (RO)', 'Nano-filtration and multi-media barriers', 'Electro-deionization (EDI) systems', 'Automated clean-in-place (CIP) protocols'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'bottled-water',
      title: 'Premium Bottled Drinking Water',
      description: 'State-of-the-art sterile bottling plant utilizing continuous ozone treatment, active mineral stabilization, and clean-room packaging.',
      icon: 'GlassWater',
      features: ['Ozone sterile stabilization', 'Subtle mineral re-balancing', 'Automated touchless bottling lines', 'Eco-friendly biodegradable containers'],
      image: 'https://images.unsplash.com/photo-1608889174633-8a306f632152?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'wastewater-treatment',
      title: 'Wastewater Treatment & Reclamation',
      description: 'Bioreactors, membrane technology, and UV disinfection loops designed to safely recycle sewage and industrial effluents for farming or reuse.',
      icon: 'ShieldAlert',
      features: ['Membrane bioreactors (MBR)', 'Advanced ultraviolet sterilization', 'Eco-friendly sludge digestion', 'Strict WHO compliance standards'],
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200'
    }
  ],
  realestate: [
    {
      id: 'certified-land',
      title: 'Certified Land & Agri-Blocks',
      description: 'Prime, litigation-free agricultural and residential land parcels across Ghana, mapped with GPS telemetry and backed by verified legal deeds.',
      icon: 'Trees',
      features: ['100% litigation-free title deeds', 'GPS mapped drone survey reports', 'Soil & water aquifer verification', 'Chauffeured VIP site inspections'],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'eco-villas',
      title: 'Luxury Eco-Villas & Sustainable Residences',
      description: 'Modern architect-designed villas built with solar integration, off-grid water filtration, and lush green landscaping.',
      icon: 'Home',
      features: ['Off-grid solar & RO water systems', 'Smart home automation & security', 'Architectural luxury finishing', 'High rental yield potential'],
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'commercial-industrial',
      title: 'Commercial & Industrial Real Estate',
      description: 'Strategic warehouse parks, processing hubs, and corporate office parks built near major logistics corridors in Ghana.',
      icon: 'Building',
      features: ['Heavy equipment logistics access', 'Industrial power & high-capacity water', '24/7 biometric security access', 'Flexible long-term corporate leases'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200'
    }
  ]
};

export const PRODUCTS: Product[] = [
  // Agriculture products
  {
    id: 'prod-seeds-hybrid',
    name: 'CAB Elite Drought-Resistant Hybrid Maize Seeds',
    category: 'agriculture',
    subCategory: 'Seeds & Propagation',
    description: 'High-germination hybrid seeds optimized for arid and unpredictable conditions in West Africa. Yields up to 45% more bushels per acre.',
    price: 120,
    unit: '25kg Bag',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600',
    features: ['98% germination rate', 'Natural drought and pest resistance', 'Fast maturing (110 days)', 'Certified organic-safe coatings'],
    inStock: true,
    rating: 4.8
  },
  {
    id: 'prod-fert-bio',
    name: 'Bio-Max Premium Organic Liquid Fertilizer',
    category: 'agriculture',
    subCategory: 'Soil Nutrition',
    description: 'Concentrated microbial organic fertilizer that enriches soil biome, enhancing nutrient absorption and crop root density across regional soils.',
    price: 85,
    unit: '20L Canister',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600',
    features: ['100% natural and non-toxic', 'Enriched with active humic acids', 'Excellent for foliar application', 'Safe for all vegetable and fruit crops'],
    inStock: true,
    rating: 4.9
  },
  {
    id: 'prod-irr-kit',
    name: 'CAB Smart Solar Drip Irrigation Kit',
    category: 'agriculture',
    subCategory: 'Irrigation Equipment',
    description: 'Fully self-contained solar-powered drip irrigation kit for up to 1 acre. Includes solar pump, controller, filters, and lines.',
    price: 1450,
    unit: 'Full Kit',
    image: 'https://images.unsplash.com/photo-1563514223-745144f41df0?auto=format&fit=crop&q=80&w=600',
    features: ['150W high-efficiency solar pump', 'Programmable smart controller', 'Premium UV-resistant drip lines', 'Anti-clogging emitter technology'],
    inStock: true,
    rating: 4.7
  },
  {
    id: 'prod-greenhouse-prop',
    name: 'CAB Modular Eco-Poly Greenhouse Structure',
    category: 'agriculture',
    subCategory: 'Greenhouse Systems',
    description: 'Galvanized steel-framed modular greenhouse with double-wall polycarbonate siding and automated mechanical side-ventilation.',
    price: 3800,
    unit: 'Unit (6m x 12m)',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
    features: ['Heavy-duty galvanized steel tubing', '10-year UV rated polycarbonate', 'Easy slide-together assembly', 'Integrated micro-spray mounts'],
    inStock: false,
    rating: 4.6
  },

  // Water solutions
  {
    id: 'prod-water-bottle-500',
    name: 'CAB Purified Alkaline Bottled Water - 500ml Case',
    category: 'water',
    subCategory: 'Bottled Water',
    description: 'Case of 24 premium bottles of mineral-balanced, carbon-filtered drinking water, stabilized to an optimal pH of 8.2.',
    price: 18,
    unit: 'Case (24 Bottles)',
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600',
    features: ['pH 8.2 alkaline balanced', 'Eco-friendly 100% rPET bottles', 'Ultra-pure reverse osmosis filtration', 'Crisp, refreshing taste'],
    inStock: true,
    rating: 5.0
  },
  {
    id: 'prod-water-bottle-15l',
    name: 'CAB Premium Drinking Water Office Dispenser Refill',
    category: 'water',
    subCategory: 'Bottled Water',
    description: 'High-capacity 19-liter (5-gallon) water dispenser bottles. Purified and tested weekly for perfect chemical safety.',
    price: 9,
    unit: '19L Bottle',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600',
    features: ['100% BPA-free heavy-duty bottle', 'Hermetically sealed safety cap', 'Multi-barrier absolute filtration', 'Regular testing certificates included'],
    inStock: true,
    rating: 4.8
  },
  {
    id: 'prod-water-ro-industrial',
    name: 'CAB-RO 5000 Industrial Reverse Osmosis System',
    category: 'water',
    subCategory: 'Water Treatment Systems',
    description: 'Turnkey commercial-grade reverse osmosis system processing 5,000 gallons per day. Perfect for processing and bottling plants.',
    price: 6500,
    unit: 'System Unit',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    features: ['Multi-stage pre-filtration array', 'Dow Filmtec high-recovery membranes', 'Stainless steel chassis and multi-stage pump', 'Touchscreen PLC automation console'],
    inStock: true,
    rating: 4.9
  },
  {
    id: 'prod-water-tank-10k',
    name: 'CAB Heavy-Duty Reinforced 10,000L Water Tank',
    category: 'water',
    subCategory: 'Water Storage',
    description: 'Triple-layer polyethylene water storage tank with active food-grade black inner liner preventing algae growth.',
    price: 1250,
    unit: 'Tank Unit',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
    features: ['Triple-layer UV-stabilized polythene', 'Food-grade certified inner liner', 'Anti-algae opaque black design', 'Reinforced multi-rib structural design'],
    inStock: true,
    rating: 4.7
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'proj-keta-irrigation',
    title: 'The Keta Smart Basin Irrigation Project',
    category: 'agriculture',
    client: 'Ministry of Agriculture & Rural Development',
    location: 'Keta, Volta Region',
    date: 'February 2025',
    description: 'Implementation of a weather-integrated solar drip irrigation loop across 450 hectares of cooperative onion and tomato farms. This system stabilized yields and reduced aggregate water waste by 60%.',
    image: 'https://images.unsplash.com/photo-1563514223-745144f41df0?auto=format&fit=crop&q=80&w=1200',
    beforeImage: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600',
    afterImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600',
    status: 'Completed',
    impact: 'Increased farmer income by 85%, cut chemical runoffs by 70%, and saved 4.2 million liters of water monthly.',
    features: ['Solar pumps with smart frequency converters', 'Soil sensor array synced with Weather APIs', 'Custom filtration for river sediment', 'Farmer training programs']
  },
  {
    id: 'proj-accra-purification',
    title: 'Municipal Bottled Water Plant Upgrade',
    category: 'water',
    client: 'C.A.B Beverages Division',
    location: 'Industrial Area, Accra',
    date: 'November 2025',
    description: 'Development and validation of an updated high-velocity ozone-purification and automated glass bottling line, allowing fully sterile, zero-human-contact mineral water supply for commercial offices.',
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=1200',
    status: 'Completed',
    impact: 'Replaced single-use plastics in corporate offices with high-grade reusable glass, outputting 45,000 liters daily.',
    features: ['Dual stage UV-C sterilization chambers', 'pH mineral stabilization reactors', 'Sterile cleanroom encapsulation', 'Robotic stacking and sorting units']
  },
  {
    id: 'proj-kumasi-greenhouse',
    title: 'Kumasi Agri-Tech Greenhouse Park',
    category: 'sustainability',
    client: 'Agro-Innovate West Africa',
    location: 'Kumasi, Ashanti Region',
    date: 'Ongoing (Est. Aug 2026)',
    description: 'Construction of a state-of-the-art controlled-environment agricultural park hosting 12 modular polycarbonate greenhouses for premium vegetable seedling production.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
    status: 'In Progress',
    impact: 'Will supply 2 million disease-free seedlings annually to local crop farmers.',
    features: ['Automated misting systems', 'Cooling pads and exhaust ventilation', 'Hydroponic nutrient-dosing computers', 'Solar backup batteries']
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Optimizing Nitrogen and Phosphorus Ratios in CEA Hydroponics',
    category: 'Agri-Tech',
    summary: 'A deep dive into controlled-environment hydroponic nutrition recipes to maximize leaf count and prevent crop root burn.',
    content: 'Hydroponic crop production demands strict chemical calibration. By balancing nitrate-nitrogen with ammonium-nitrogen, modern greenhouses prevent cellular stress. At CAB, our standard mix utilizes a 9:1 nitrate-to-ammonium ratio coupled with active phosphorus buffering, yielding up to 30% larger crop sizes in tomatoes and leafy vegetables...',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Dr. Evelyn Mensah',
      role: 'Chief Agronomist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
    },
    date: 'May 12, 2026',
    readTime: '6 min read',
    tags: ['Hydroponics', 'Greenhouse', 'Crop Science', 'Agribusiness']
  },
  {
    id: 'blog-2',
    title: 'The Chemistry of Reverse Osmosis and Alkaline Re-mineralization',
    category: 'Water Science',
    summary: 'Why removing water contaminants is only half the battle. Exploring the benefits of mineral stabilization and structural pH balance.',
    content: 'Pure RO water is chemically aggressive and lacks taste due to the removal of essential trace elements. C.A.B’s Water Solutions department uses post-membrane calcite and corosex filter columns to slowly re-introduce safe levels of Calcium and Magnesium. This stabilizes the water to a crisp, alkaline pH of 8.2, optimizing hydration at a cellular level...',
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Ing. Robert Tetteh',
      role: 'Director of Water Quality',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'
    },
    date: 'June 28, 2026',
    readTime: '8 min read',
    tags: ['Water Treatment', 'Reverse Osmosis', 'Mineral Balance', 'Safety']
  },
  {
    id: 'blog-3',
    title: 'Solar-Powered Drip Irrigation: A Catalyst for African Agribusiness',
    category: 'Sustainability',
    summary: 'How off-grid water pumping coupled with automated soil moisture networks is transforming smallholder farm cooperatives into profitable enterprises.',
    content: 'Traditional flooding methods wash away valuable topsoil and waste upwards of 70% of drawn water. By combining solar arrays with sub-surface drip lines, cooperatives in the Volta basin can grow high-value crops even during dry spells, with close-to-zero electricity costs. This article explores how solar drip systems are driving massive food security gains...',
    image: 'https://images.unsplash.com/photo-1563514223-745144f41df0?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Kofi Boateng',
      role: 'Head of Agribusiness Consultancy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    date: 'July 14, 2026',
    readTime: '5 min read',
    tags: ['Solar Power', 'Irrigation', 'Food Security', 'Cooperatives']
  }
];

export const FAQS = [
  {
    q: 'Does C.A.B Company provide customized industrial water purification installations?',
    a: 'Absolutely. We design, manufacture, and install custom reverse osmosis, ultrafiltration, and UV sterilization configurations tailored to your source water quality. We conduct a complete lab-grade chemical analysis of your source water before engineering a solution.'
  },
  {
    q: 'Can we schedule on-site agricultural consultancy visits?',
    a: 'Yes, our agronomists conduct diagnostic visits across West Africa and internationally. We analyze soil profiles, greenhouse setups, pest challenges, and irrigation networks to prepare professional growth reports and nutrient recipes.'
  },
  {
    q: 'How does your automated greenhouse climate control operate?',
    a: 'Our systems use localized sensor hubs that measure humidity, ambient temperature, CO2, and light intensity. These connect to our custom smart PLC, which automatically adjusts shading curtains, triggers exhaust fans, activates cooling pads, or opens ventilation louvers.'
  },
  {
    q: 'Where is your premium bottled water sourced and purified?',
    a: 'Our bottled drinking water is sourced from high-quality protected deep aquifers, which is then subjected to an intensive 10-stage absolute purification process including multi-barrier micro-filtration, carbon polishing, dual-pass reverse osmosis, mineral enrichment, and continuous ozone stabilization.'
  },
  {
    q: 'How do I request a formal quote for a commercial irrigation project?',
    a: 'You can submit a detailed request through our secure Client Portal or directly via our Request Quote page. A technical representative will review your land dimensions, crop types, water source location, and contact you within 24-48 hours.'
  }
];

export const TEAM = [
  {
    name: 'Christian Asara Boafo',
    role: 'Chief Executive Officer - CEO',
    position: 'Chief Executive Officer - CEO',
    image: '/CEO.jpg',
    bio: 'Leading C.A.B Company Limited with vision and commitment to sustainable agriculture, pure mineral water production, and certified real estate development.',
    email: 'c.boafo@cabcompany.com',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'Devine Adade',
    role: 'Project Manager',
    position: 'Project Manager',
    image: '/projectmanager.png',
    bio: 'Overseeing all C.A.B Company projects to ensure timely delivery and quality across our agriculture, water, and real estate operations.',
    email: 'd.adade@cabcompany.com',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'Justice K Dzomeku',
    role: 'Manager',
    position: 'Manager',
    image: '/manager.png',
    bio: 'Managing daily operations and ensuring excellence across our agriculture, water production, and real estate divisions.',
    email: 'j.dzomeku@cabcompany.com',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'Ama Serwaa Mensah',
    role: 'Supervisor',
    position: 'Supervisor',
    image: '/Supervisor.png',
    bio: 'Supervising field and production teams to maintain C.A.B Company’s high standards of quality, safety, and excellence.',
    email: 'a.mensah@cabcompany.com',
    linkedin: 'https://linkedin.com'
  }
];
