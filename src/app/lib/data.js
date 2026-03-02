export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

export const highlights = [
  { iconName: 'mountain-view', title: 'Mountain View' },
  { iconName: 'river-view', title: 'River View' },
  { iconName: 'adventure', title: 'Adventure Activities' },
  { iconName: 'family', title: 'Family & Pet Friendly' },
];

export const rooms = [
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    description: 'Experience unparalleled comfort in our secluded luxury cottages.',
    longDescription: 'Our Luxury Cottages offer the perfect blend of rustic charm and modern amenities. Each cottage features a spacious bedroom, a private fireplace, and a veranda with breathtaking views of the Himalayas. Ideal for romantic getaways or peaceful solitude.',
    images: ['room-cottage-1', 'room-cottage-2'],
    amenities: [
      { name: 'Private Balcony' },
      { name: 'King Size Bed' },
      { name: 'Fireplace' },
      { name: 'Wi-Fi' },
      { name: 'Room Service' },
    ],
    price: 15000,
    badge: { label: 'HOT OFFER', variant: 'hot' },
  },
  {
    id: 'single-room',
    name: 'Single Room',
    description: 'Enjoy your own private outdoor space with stunning views.',
    longDescription: 'Each of these rooms features a private balcony, offering a personal space to enjoy a cup of tea, read a book, or simply soak in the magnificent mountain scenery. The rooms are tastefully decorated to create a warm and inviting atmosphere.',
    images: ['room-balcony-1', 'room-balcony-2'],
    amenities: [
        { name: 'Private Balcony' },
        { name: 'Mountain View' },
        { name: 'King Size Bed' },
        { name: 'Wi-Fi' },
    ],
    price: 10000,
  },
  {
    id: 'double-room',
    name: 'Double Room',
    description: 'Wake up to the soothing sounds and sights of the river.',
    longDescription: 'Situated with a direct view of the glistening river, these rooms are designed for tranquility. Large floor-to-ceiling windows ensure you never miss a moment of the natural beauty outside. The elegant interiors and plush furnishings provide a comfortable and relaxing stay.',
    images: ['room-river-1', 'room-river-2'],
    amenities: [
      { name: 'River View' },
      { name: 'Queen Size Bed' },
      { name: 'Wi-Fi' },
      { name: 'HD TV' },
      { name: 'Mini Bar' },
    ],
    price: 12000,
    rating: { stars: 5, label: 'Good' },
  },
  {
    id: 'family-room',
    name: 'Family Room',
    description: 'Spacious and comfortable, perfect for family vacations.',
    longDescription: 'Our Family Suites are designed to be a home away from home. With interconnected rooms, a separate living area, and kid-friendly amenities, they provide ample space and comfort for the entire family. Create lasting memories together in the heart of nature.',
    images: ['room-suite-1', 'room-suite-2'],
    amenities: [
      { name: '2 Bedrooms' },
      { name: 'Living Area' },
      { name: 'Wi-Fi' },
      { name: 'Kitchenette' },
      { name: 'Room Service' },
    ],
    price: 20000,
    badge: { label: 'MOST LIKED', variant: 'liked' },
  },
];

export const testimonials = [
    {
        summary: "Magical experience!",
        quote: "An absolutely magical experience. The views are breathtaking, and the hospitality is second to none. We felt completely rejuvenated. A true haven in Himachal!",
        name: "Anjali & Rohan Mehta",
        location: "Mumbai, India",
        timeAgo: "1 week ago",
        stars: 5,
    },
    {
        summary: "Perfect for Corporate!",
        quote: "We hosted our corporate retreat here and it was a massive success. The serene environment was perfect for brainstorming, and the adventure activities were great for team building.",
        name: "Vikram Singh",
        location: "CEO, Innovate Solutions",
        timeAgo: "2 weeks ago",
        stars: 5,
    },
    {
        summary: "Best family vacation!",
        quote: "The best family vacation we've ever had. The kids loved the play area and open spaces, and we loved the peace and quiet. The family suite was perfect. We'll be back!",
        name: "The Sharma Family",
        location: "New Delhi, India",
        timeAgo: "3 days ago",
        stars: 5,
    },
     {
        summary: "Exceeded expectations!",
        quote: "Himachal Haven delivered far beyond our expectations. From strategy to execution, their team worked like an extension of ours. The final product not only looked amazing.",
        name: "Priya Desai",
        location: "Bengaluru, India",
        timeAgo: "2 weeks ago",
        stars: 5,
    },
    {
        summary: "Luxury care every day.",
        quote: "I've stayed at many luxury resorts, but none match the attention to detail and genuine care at Himachal Haven. They made our entire vacation feel effortless.",
        name: "Rajesh Kumar",
        location: "Dubai, UAE",
        timeAgo: "1 month ago",
        stars: 5,
    },
    {
        summary: "A dream come true!",
        quote: "Our wedding at Himachal Haven was a dream come true. The team's creativity and precision brought our vision to life. It was a brand presence we’re truly proud of.",
        name: "Sameer & Isha",
        location: "New York, USA",
        timeAgo: "2 weeks ago",
        stars: 5,
    },
];

export const experiences = [
    {
        title: "Trekking & Nature Trails",
        description: "Explore guided treks through lush forests and discover hidden waterfalls.",
        image: "exp-trekking"
    },
    {
        title: "River Relaxation",
        description: "Unwind at serene spots along the river, perfect for meditation or a picnic.",
        image: "exp-river-relax"
    },
    {
        title: "Sports & Adventure",
        description: "Get your adrenaline pumping with activities like ziplining and rock climbing.",
        image: "exp-sports"
    },
    {
        title: "Outdoor Games",
        description: "Enjoy fun-filled afternoons with badminton, cricket, and more on our lawns.",
        image: "exp-outdoor-games"
    },
    {
        title: "Kids Play Zone",
        description: "A safe and exciting area for children to play and make new friends.",
        image: "exp-kids-zone"
    },
    {
        title: "Pet-Friendly Areas",
        description: "Spacious open areas where your furry friends can run and play freely.",
        image: "exp-pet-friendly"
    },
    {
        title: "Bird Watching",
        description: "Discover the diverse avian life with our expert-led bird watching tours.",
        image: "exp-bird-watching"
    },
    {
        title: "Stargazing",
        description: "Witness the magic of the cosmos with our open sky views, far from city lights.",
        image: "exp-stargazing"
    }
];

export const detailedExperiences = [
    {
        title: "Trekking & Nature Trails",
        description: "Embark on guided treks that wind through ancient forests and past cascading waterfalls. Our trails range from gentle walks suitable for all ages to challenging hikes for the seasoned adventurer. Discover the local flora and fauna and breathe in the crisp mountain air.",
        image: "exp-trekking",
        iconName: "mountain-view"
    },
    {
        title: "River View Relaxation Spots",
        description: "Find your inner peace at our specially designated relaxation spots along the riverbank. These tranquil locations are perfect for yoga, meditation, reading a book, or simply listening to the soothing symphony of flowing water.",
        image: "exp-river-relax",
        iconName: "river-view"
    },
    {
        title: "Sports & Adventure Activities",
        description: "For the thrill-seekers, we offer a range of adventure activities including rock climbing, rappelling, and ziplining, all under the supervision of certified instructors. Test your limits and create exhilarating memories.",
        image: "exp-sports",
        iconName: "adventure"
    },
    {
        title: "Outdoor Games & Events",
        description: "Our expansive green lawns are the perfect setting for a variety of outdoor games. From a friendly match of cricket or badminton to organized group activities, there's always something to keep you entertained.",
        image: "exp-outdoor-games",
        iconName: "lawns"
    },
    {
        title: "Kids Play Zone & Activities",
        description: "Our dedicated kids' zone is a haven of fun for our youngest guests. With safe and engaging play equipment and a host of planned activities, your children will be entertained for hours.",
        image: "exp-kids-zone",
        iconName: "family"
    },
    {
        title: "Pet-Friendly Open Areas",
        description: "We believe that pets are family. Our resort features large, open, and safe areas where your four-legged companions can roam, play, and enjoy the holiday with you.",
        image: "exp-pet-friendly",
        iconName: "pet"
    },
    {
        title: "Bird Watching Zones",
        description: "Himachal is a paradise for bird lovers. Our property includes several designated zones where you can spot a wide variety of native and migratory birds. Join our guides to learn more about these beautiful creatures.",
        image: "exp-bird-watching",
        iconName: "birdwatching"
    },
    {
        title: "Open Sky Views & Stargazing",
        description: "Far from the pollution of the city, our skies are a canvas of cosmic wonders. On clear nights, join our stargazing sessions to marvel at constellations, planets, and the Milky Way through our powerful telescope.",
        image: "exp-stargazing",
        iconName: "stargazing"
    }
];


export const amenities = [
    {
        slug: "pool-with-mountain-view",
        title: "Pool with Mountain View",
        description: "Take a dip in our temperature-controlled swimming pool while enjoying panoramic views of the majestic mountains.",
        longDescription: "Our stunning infinity pool is the centerpiece of relaxation at Himachal Haven. Heated to the perfect temperature year-round, it offers an unparalleled swimming experience with panoramic views of the snow-capped Himalayan peaks. Lounge on the comfortable sunbeds, sip a refreshing drink from the poolside bar, and let the majestic scenery wash over you. It's the perfect spot to unwind after a day of exploring.",
        image: "amenity-pool",
        iconName: "waves",
    },
    {
        slug: "mini-cinema",
        title: "Mini Cinema / Home Theater",
        description: "Enjoy a private movie screening with your loved ones in our cozy, state-of-the-art mini cinema.",
        longDescription: "Experience movie magic in our exclusive mini cinema. Featuring plush, reclining seats, a state-of-the-art surround sound system, and a large, high-definition screen, it's the perfect venue for a private movie night. Choose from our extensive library of films or connect your own device to enjoy your favorite content. Popcorn and snacks are, of course, part of the experience.",
        image: "amenity-cinema",
        iconName: "sparkles",
    },
    {
        slug: "open-sky-dining",
        title: "Open Sky Dining",
        description: "Dine under the stars in our enchanting open-sky dining area, offering a unique culinary experience.",
        longDescription: "There's nothing quite like dining under a blanket of stars. Our open-sky dining area offers an unforgettable culinary journey amidst the beauty of nature. Whether it's a romantic dinner for two or a special celebration with family, our chefs will prepare a delectable meal using fresh, local ingredients, all while you enjoy the crisp mountain air and the celestial display above.",
        image: "amenity-dining",
        iconName: "sun",
    },
    {
        slug: "indoor-outdoor-games",
        title: "Indoor & Outdoor Games",
        description: "From pool and table tennis indoors to cricket and badminton outdoors, we have activities for everyone.",
        longDescription: "Fun and recreation are always on the agenda at Himachal Haven. Our indoor game room is equipped with a pool table, table tennis, carrom, and various board games. Step outside onto our lush lawns for a friendly match of badminton or cricket. We provide all the necessary equipment, so all you need to bring is your competitive spirit.",
        image: "amenity-games",
        iconName: "bike",
    },
    {
        slug: "event-party-spaces",
        title: "Event & Party Spaces",
        description: "Host your special events, from weddings to corporate retreats, in our versatile and beautiful spaces.",
        longDescription: "With its stunning backdrop and versatile venues, Himachal Haven is the ideal location for your next event. We offer both indoor and outdoor spaces that can be customized for destination weddings, corporate retreats, or private parties. Our dedicated event planning team will work with you to ensure every detail is perfect, from decor and catering to entertainment and accommodations.",
        image: "amenity-events",
        iconName: "heart-handshake",
    },
    {
        slug: "bonfire-nights",
        title: "Bonfire Nights",
        description: "Gather around a warm bonfire on chilly evenings for stories, music, and camaraderie.",
        longDescription: "As the sun sets and the mountain air turns crisp, gather around our roaring bonfire. It's a time-honored tradition at Himachal Haven, perfect for sharing stories, singing songs, or simply enjoying the warmth and a hot beverage. We often arrange live acoustic music and serve delicious snacks, creating a magical and memorable evening for all our guests.",
        image: "amenity-bonfire",
        iconName: "sparkles",
    },
];

export const galleryImages = [
    { id: "gallery-nature-1", category: "Nature" },
    { id: "gallery-rooms-1", category: "Rooms" },
    { id: "gallery-activities-1", category: "Activities" },
    { id: "gallery-pool-1", category: "Pool & Cinema" },
    { id: "gallery-events-1", category: "Events & Night Views" },
    { id: "gallery-nature-2", category: "Nature" },
    { id: "room-cottage-2", category: "Rooms" },
    { id: "exp-sports", category: "Activities" },
    { id: "amenity-cinema", category: "Pool & Cinema" },
    { id: "gallery-night-1", category: "Events & Night Views" },
    { id: "hero-1", category: "Nature" },
    { id: "room-river-1", category: "Rooms" },
];

export const faqs = [
  {
    question: "What are the check-in and check-out times?",
    answer: "Our standard check-in time is 2:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is subject to availability and may incur additional charges."
  },
  {
    question: "Is the resort pet-friendly?",
    answer: "Yes, we are a pet-friendly resort! We have designated open areas for pets to play. Please inform us at the time of booking if you will be bringing a pet."
  },
  {
    question: "Do you have free Wi-Fi?",
    answer: "Yes, complimentary Wi-Fi is available for all our guests throughout the resort premises, including rooms, restaurants, and common areas."
  },
  {
    question: "What kind of activities are available for kids?",
    answer: "We have a dedicated kids' play zone with swings and slides, as well as large open lawns for them to run around. We can also arrange for activities like drawing, and storytelling sessions upon request."
  },
  {
    question: "Is parking available at the resort?",
    answer: "Yes, we offer complimentary and secure parking for all our guests. You do not need to reserve a parking spot in advance."
  },
  {
    question: "How do I get to the resort?",
    answer: "The resort is accessible by road. The nearest airport is in Kullu, and the nearest major railway station is in Chandigarh. We can arrange for a taxi service from the airport or station upon request. You can find our exact location on the Contact page."
  },
];
