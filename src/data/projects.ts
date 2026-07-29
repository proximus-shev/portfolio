export type Project = {
  title: string;
  slug: string;
  status: "Live" | "In progress" | "Planned";
  summary: string;
  problem: string;
  solution: string;
  stack: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    title: "AI Study Assistant",
    slug: "ai-study-assistant",
    status: "Planned",
    summary:
      "A learning workspace that turns notes into summaries, flashcards, quizzes, and revision plans.",
    problem:
      "Students often collect notes but struggle to turn them into active recall and consistent revision.",
    solution:
      "Build an AI-assisted study tool that converts raw notes into practical study material and tracks progress.",
    stack: ["Next.js", "TypeScript", "OpenAI", "Supabase"],
    features: [
      "Note summarization",
      "Flashcard generation",
      "Quiz builder",
      "Revision dashboard",
    ],
  },
  {
    title: "Finance Dashboard",
    slug: "finance-dashboard",
    status: "Planned",
    summary:
      "A personal money dashboard for tracking expenses, budgets, savings goals, and monthly insights.",
    problem:
      "Personal finance data can feel scattered without a simple visual view of where money is going.",
    solution:
      "Create a focused finance dashboard with charts, categories, and clean monthly summaries.",
    stack: ["Next.js", "TypeScript", "Recharts", "Supabase"],
    features: [
      "Expense tracking",
      "Budget categories",
      "Savings goals",
      "Monthly visual reports",
    ],
  },
  {
    title: "Appointment Booking App",
    slug: "appointment-booking-app",
    status: "Planned",
    summary:
      "A booking system with service selection, availability, confirmations, and admin scheduling.",
    problem:
      "Small service providers need a clean way to collect bookings without messy message threads.",
    solution:
      "Build a responsive booking flow with availability logic and a simple admin schedule view.",
    stack: ["Next.js", "TypeScript", "Supabase", "Email"],
    features: [
      "Service catalog",
      "Availability slots",
      "Booking confirmation",
      "Admin schedule",
    ],
  },
  {
    title: "Mini E-Commerce Store",
    slug: "mini-ecommerce-store",
    status: "Planned",
    summary:
      "A polished storefront with product browsing, cart state, checkout simulation, and admin product management.",
    problem:
      "A portfolio needs a practical commerce project that shows UI, state, and product thinking.",
    solution:
      "Create a small but complete e-commerce experience with a clean buyer flow and product admin tools.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
    features: [
      "Product catalog",
      "Cart interactions",
      "Checkout simulation",
      "Admin product editor",
    ],
  },
  {
    title: "Python AI Document Analyzer",
    slug: "python-ai-document-analyzer",
    status: "Planned",
    summary:
      "A Python backend that uploads documents, extracts text, summarizes key points, and returns searchable insights.",
    problem:
      "Long PDFs and business documents are slow to review manually, especially when users only need the key actions and insights.",
    solution:
      "Build a FastAPI service that parses documents, produces summaries, extracts action items, and exposes the results through a clean web interface.",
    stack: ["Python", "FastAPI", "OpenAI", "PostgreSQL"],
    features: [
      "PDF/text upload",
      "Document summarization",
      "Action item extraction",
      "Searchable document history",
    ],
  },
  {
    title: "Proximus Shev Portfolio",
    slug: "proximus-shev-portfolio",
    status: "In progress",
    summary:
      "A personal portfolio website for presenting projects, skills, contact links, and case studies.",
    problem:
      "Personal work needs a central home that feels memorable and makes projects easy to explore.",
    solution:
      "Design a sci-fi terminal-inspired portfolio with project pages and a strong developer identity.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    features: [
      "Animated landing page",
      "Project index",
      "Case-study pages",
      "Responsive design",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
