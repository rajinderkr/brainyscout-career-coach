
import { Question, Testimonial, Fact, QuestionType } from './types';
import { TrendingUp, Briefcase, Zap, BarChart } from 'lucide-react';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'welcome',
    type: QuestionType.Welcome,
    text: "Unlock Your Career's Full Potential.",
    subtext: "Let's discover your unique strengths and find the path where you'll thrive. This short assessment is the first step."
  },
  {
    id: 'q1',
    type: QuestionType.MultipleChoice,
    text: 'Which of these energizes you the most at work?',
    options: ['Solving complex problems', 'Collaborating with a team', 'Creating something new', 'Organizing and planning'],
    hint: 'Think about what makes you lose track of time.',
  },
  {
    id: 'q2',
    type: QuestionType.Rating,
    text: 'On a scale of 1-5, how important is work-life balance to you right now?',
    subtext: '1 being "not important" and 5 being "extremely important".',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'q3',
    type: QuestionType.Text,
    text: 'What is one skill you want to develop in the next year?',
    subtext: 'This can be a technical skill, a soft skill, or anything in between.',
    hint: 'e.g., "Public Speaking", "Python Programming", "Project Management"',
    visual: {
        type: 'chart',
        data: [
            { name: 'Leadership', value: 400 },
            { name: 'AI/ML', value: 300 },
            { name: 'Data Analysis', value: 280 },
            { name: 'Comms', value: 200 },
        ]
    }
  },
  {
    id: 'q4',
    type: QuestionType.MultipleChoice,
    text: 'What kind of work environment helps you do your best work?',
    options: ['A quiet, focused space', 'A bustling, collaborative office', 'A flexible remote setup', 'A mix of office and remote'],
    visual: {
        type: 'image',
        data: 'https://picsum.photos/seed/career/600/400'
    }
  },
  {
    id: 'completion',
    type: QuestionType.Completion,
    text: "You're on the verge of a breakthrough!",
    subtext: "Your responses show great potential. Enter your email to receive your personalized career insights and learn how our program can accelerate your growth."
  },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "This program completely changed my perspective. I landed a promotion within 3 months!",
        author: "Sarah J.",
        role: "Senior Product Manager",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
        quote: "I was stuck in a career rut. The coaching helped me identify my passions and make a successful career change.",
        author: "Michael B.",
        role: "Software Engineer turned UX Designer",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d"
    },
];

export const FACTS: Fact[] = [
    {
        icon: TrendingUp,
        title: '70% of professionals',
        description: 'who receive coaching report improved work performance, relationships, and more effective communication skills.'
    },
    {
        icon: Briefcase,
        title: 'The "Gig Economy"',
        description: 'is expected to grow to 86.5 million people by 2027, highlighting a shift towards flexible work.'
    },
    {
        icon: Zap,
        title: 'Continuous Learning',
        description: 'is the top-rated skill for career success in the age of AI. Stay curious, stay relevant.'
    },
     {
        icon: BarChart,
        title: 'Data-Driven Decisions',
        description: 'Professionals who leverage data in their roles are 58% more likely to exceed their career goals.'
    }
];