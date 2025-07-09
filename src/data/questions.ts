export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PrizeLevel {
  level: number;
  amount: string;
  isSafeHaven: boolean;
}

export const PRIZE_LADDER: PrizeLevel[] = [
  { level: 1, amount: "$1,000", isSafeHaven: false },
  { level: 2, amount: "$2,000", isSafeHaven: false },
  { level: 3, amount: "$3,000", isSafeHaven: false },
  { level: 4, amount: "$5,000", isSafeHaven: false },
  { level: 5, amount: "$10,000", isSafeHaven: true }, // First safe haven
  { level: 6, amount: "$25,000", isSafeHaven: false },
  { level: 7, amount: "$50,000", isSafeHaven: false },
  { level: 8, amount: "$100,000", isSafeHaven: false },
  { level: 9, amount: "$200,000", isSafeHaven: false },
  { level: 10, amount: "$500,000", isSafeHaven: true }, // Second safe haven
  { level: 11, amount: "$750,000", isSafeHaven: false },
  { level: 12, amount: "$1,000,000", isSafeHaven: false },
  { level: 13, amount: "$2,000,000", isSafeHaven: false },
  { level: 14, amount: "$5,000,000", isSafeHaven: false },
  { level: 15, amount: "$10,000,000", isSafeHaven: false }, // Grand prize
];

export const QUESTIONS: Question[] = [
  // Easy questions (1-5)
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "How many months are there in a year?",
    options: ["10", "11", "12", "13"],
    correctAnswer: "12",
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "From which direction does the sun rise?",
    options: ["North", "South", "East", "West"],
    correctAnswer: "East",
    difficulty: 'easy'
  },
  {
    id: 4,
    question: "How many hearts does a human have?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "1",
    difficulty: 'easy'
  },
  {
    id: 5,
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
    difficulty: 'easy'
  },

  // Medium questions (6-10)
  {
    id: 6,
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    difficulty: 'medium'
  },
  {
    id: 7,
    question: "What does DNA stand for?",
    options: ["Deoxyribonucleic Acid", "Dynamic Nuclear Acid", "Natural Neutral Acid", "Direct Nuclear Acid"],
    correctAnswer: "Deoxyribonucleic Acid",
    difficulty: 'medium'
  },
  {
    id: 8,
    question: "Which country's flag features a dragon?",
    options: ["China", "Japan", "Bhutan", "Thailand"],
    correctAnswer: "Bhutan",
    difficulty: 'medium'
  },
  {
    id: 9,
    question: "Mozart was from which country?",
    options: ["Germany", "Italy", "Austria", "France"],
    correctAnswer: "Austria",
    difficulty: 'medium'
  },
  {
    id: 10,
    question: "What is the highest mountain in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"],
    correctAnswer: "Mount Everest",
    difficulty: 'medium'
  },

  // Hard questions (11-15)
  {
    id: 11,
    question: "Which element is represented by the symbol 'Au' in the periodic table?",
    options: ["Silver", "Gold", "Aluminum", "Argon"],
    correctAnswer: "Gold",
    difficulty: 'hard'
  },
  {
    id: 12,
    question: "Who proposed the uncertainty principle in quantum physics?",
    options: ["Einstein", "Heisenberg", "Schrödinger", "Bohr"],
    correctAnswer: "Heisenberg",
    difficulty: 'hard'
  },
  {
    id: 13,
    question: "Who was the last emperor of the Ottoman Empire?",
    options: ["Mehmet VI", "Abdülhamit II", "Mehmet V", "Abdülmecit II"],
    correctAnswer: "Mehmet VI",
    difficulty: 'hard'
  },
  {
    id: 14,
    question: "Which mathematician is considered the 'father of number theory'?",
    options: ["Euler", "Gauss", "Fermat", "Newton"],
    correctAnswer: "Gauss",
    difficulty: 'hard'
  },
  {
    id: 15,
    question: "What is the largest research station in Antarctica?",
    options: ["McMurdo Station", "Vostok Station", "Halley Station", "Scott Base"],
    correctAnswer: "McMurdo Station",
    difficulty: 'hard'
  }
]; 