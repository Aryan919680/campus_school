
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is React?",
    options: [
      "A JavaScript library for building user interfaces",
      "A programming language",
      "A database management system",
      "An operating system"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Which hook is used to perform side effects in React?",
    options: [
      "useState",
      "useEffect",
      "useContext",
      "useReducer"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is JSX?",
    options: [
      "JavaScript XML - A syntax extension for JavaScript",
      "JavaScript Extra - Additional JavaScript features",
      "JavaScript Xtra - A new JavaScript framework",
      "Java Syntax Extension - A Java-based tool"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "What function is used to update state in React?",
    options: [
      "modifyState()",
      "changeState()",
      "setState()",
      "updateState()"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Which of these is NOT a React hook?",
    options: [
      "useState",
      "useHistory",
      "useTransition",
      "useComponent"
    ],
    correctAnswer: 3
  },
  {
    id: 6,
    question: "What is the correct way to render a list in React?",
    options: [
      "Using a for loop inside the render method",
      "Using map() to transform array items into React elements",
      "Using a while loop with React elements",
      "Using the forEach() method on the array"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "What is the virtual DOM in React?",
    options: [
      "A complete copy of the real DOM in memory",
      "A lightweight JavaScript representation of the DOM",
      "A special browser feature used by React",
      "A technique to directly manipulate the DOM"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "What is the purpose of props in React?",
    options: [
      "To manage state within a component",
      "To pass data from parent to child components",
      "To handle HTTP requests",
      "To create CSS styles"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "What is the StrictMode component in React?",
    options: [
      "A component that enforces strict typing",
      "A tool for highlighting potential problems in application",
      "A performance optimization technique",
      "A way to enforce code style rules"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Which lifecycle method is called after a component renders?",
    options: [
      "componentDidMount",
      "componentWillMount",
      "componentDidUpdate",
      "componentWillRender"
    ],
    correctAnswer: 0
  }
];
