export const config = {
  names: {
    person1: "[NAME_01]",
    person2: "[NAME_02]",
  },
  stats: {
    person1: {
      chaosLevel: 97,
      brainCells: 0.7,
      drama: 89,
      lateToEverything: 94,
      mainCharacterEnergy: 100,
    },
    person2: {
      chaosLevel: 99,
      brainCells: 0.3,
      drama: 12,
      lateToEverything: 100,
      mainCharacterEnergy: 85,
    },
  },
  audio: {
    backgroundMusic: "/media/audio/placeholder-bgm.mp3",
  },
  wrapped: {
    conversations: 18492,
    broDetected: 3821,
    plansMade: 147,
    plansCompleted: 8,
    photos: 2931,
    arguments: 73,
    sharedBrainCells: 0.7,
  },
  heist: {
    puzzles: [
      { question: "What is the most used word between these two humans?", answer: "BRO" },
      { question: "Who is statistically more likely to be late?", answer: "[NAME_02]" },
      { question: "Find the hidden symbol inside the timeline. What is it?", answer: "SKULL" },
      { question: "How many brain cells are shared?", answer: "0.7" },
      { question: "What year did the absolute chaos begin?", answer: "2023" },
    ]
  },
  timeline: [
    { year: "2020", title: "THE PREQUEL", description: "Before the chaos officially started.", image: "/media/shared/timeline-2020.svg" },
    { year: "2021", title: "THE BEGINNING", description: "Something happened here that nobody should have allowed.", image: "/media/shared/timeline-2021.svg" },
    { year: "2022", title: "CHARACTER DEVELOPMENT", description: "The lore expanded.", image: "/media/shared/timeline-2022.svg" },
    { year: "2023", title: "ABSOLUTE CHAOS", description: "No further explanation is necessary.", image: "/media/shared/timeline-2023.svg" },
    { year: "2024", title: "WE HAVE EVIDENCE", description: "The digital footprint is undeniable.", image: "/media/shared/timeline-2024.svg" },
    { year: "2025", title: "PEAK NPC BEHAVIOR", description: "Just surviving the simulation at this point.", image: "/media/shared/timeline-2025.svg" },
    { year: "2026", title: "CHAPTER 2026", description: "The current timeline.", image: "/media/shared/timeline-2026.svg" },
  ],
  memories: [
    { id: "memory-01", image: "/media/shared/memory-01.svg", title: "Canon Event #01", date: "2022", caption: "Replace this with the real story.", category: "CHAOS" },
    { id: "memory-02", image: "/media/shared/memory-02.svg", title: "Unexplained Activity", date: "2023", caption: "Still don't know what was happening here.", category: "RANDOM" },
    { id: "memory-03", image: "/media/shared/memory-03.svg", title: "The Trip", date: "2024", caption: "We actually made it.", category: "TRIPS" },
    { id: "memory-04", image: "/media/shared/memory-04.svg", title: "College Era", date: "2021", caption: "Too many bad decisions.", category: "COLLEGE" },
    { id: "memory-05", image: "/media/shared/memory-05.svg", title: "No Context", date: "2025", caption: "bro what.", category: "UNHINGED" },
    { id: "memory-06", image: "/media/shared/memory-06.svg", title: "Who took this?", date: "2024", caption: "Skill issue.", category: "WHO TOOK THIS PHOTO" },
    { id: "memory-07", image: "/media/shared/memory-07.svg", title: "Late Again", date: "2026", caption: "Standard procedure.", category: "CHAOS" },
    { id: "memory-08", image: "/media/shared/memory-08.svg", title: "NPC behavior", date: "2023", caption: "Just wandering around.", category: "RANDOM" },
  ],
  transmissions: [
    { from: "FRIEND_01", message: "Happy Birthday! Please stop causing problems on purpose." },
    { from: "FRIEND_02", message: "Y'all are insane but I love you both." },
    { from: "FRIEND_03", message: "I have evidence of what happened in 2024. Pay up." },
    { from: "FRIEND_04", message: "Happy bday bros, literal main character energy." },
  ]
};
