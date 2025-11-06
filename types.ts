
import { FC } from 'react';

export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  Text = 'text',
  Rating = 'rating',
  Welcome = 'welcome',
  Completion = 'completion'
}

export type ChartData = {
  name: string;
  value: number;
}[];

export interface Visual {
  type: 'image' | 'chart';
  data: string | ChartData;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  subtext?: string;
  options?: string[];
  hint?: string;
  visual?: Visual;
}

export type Answers = Record<string, any>;

export interface Submission {
  id: string;
  email: string;
  answers: Answers;
  submittedAt: string;
  location: string;
}

export interface Testimonial {
    quote: string;
    author: string;
    role: string;
    avatar: string;
}

export interface Fact {
    icon: FC<{ className?: string }>;
    title: string;
    description: string;
}