
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Mail, Phone, Linkedin, CheckCircle, Inbox, MessageSquare, Gift, Calendar, Award, Target, Users, TrendingUp, Clock, Zap, Heart, Frown, ThumbsUp, HelpCircle, Lightbulb, FileText, Search, Star, Sparkles, Briefcase, BarChart3, LineChart as LineChartIcon, DollarSign, Download, UsersRound, Check, ShieldCheck, XCircle, ArrowRight, Video, PlayCircle, AlertTriangle } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid, LineChart, Line, ReferenceLine, AreaChart, Area } from 'recharts';
import { PlacementPlanView } from './PlacementPlanView';
import { DateTime } from "luxon"; // install via: npm install luxon

interface UserViewProps {
  onSubmission: (email: string, answers: Record<string, any>, location: string) => void;
  onSwitchToAdmin: () => void;
}
// inside your component
const getNextFriday = (isIndia) => {
  // Choose time zone
  const zone = isIndia ? "Asia/Kolkata" : "America/New_York";

  // Current date in correct zone
  let now = DateTime.local().setZone(zone);

  // Find next Friday (weekday = 5)
  let nextFriday = now.set({ weekday: 5, hour: 0, minute: 0, second: 0, millisecond: 0 });
  if (now.weekday >= 5) nextFriday = nextFriday.plus({ weeks: 1 });

  // Format the display
  const formattedDate = nextFriday.toFormat("EEEE, d LLL");
  const time = isIndia ? "7:30 PM IST" : "9:00 AM EST";

  return `${formattedDate} at ${time}`;
};


// --- Helper Components ---
const CountdownTimer = ({ initialMinutes = 15 }: {initialMinutes: number}) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <span className="font-bold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    );
};

// --- Dynamic Content Generation ---
const generateAnalysis = (answers: Record<string, any>) => {
    // Strength Identification
    let strength = { name: "Action-Taking Mindset", message: "You're taking action by completing this assessment! That's the #1 predictor of success." };
    if (answers.emotional_state?.includes('determined')) {
        strength = { name: "Determination", message: "Your commitment to completing this assessment shows you have the drive and focus to succeed." };
    } else if (['500+', '1000+'].includes(answers.linkedin)) {
        strength = { name: "Strong Professional Network", message: "You have 500+ LinkedIn connections - that's excellent! This gives you access to the hidden job market." };
    } else if (answers.resume_strategy === 'tailor_ats') {
        strength = { name: "Attention to Detail", message: "You customize your applications, which shows strategic thinking. This puts you ahead of 70% of job seekers." };
    } else if (answers.applying === 'network') {
        strength = { name: "Proactive Networking Skills", message: "You leverage networking instead of just job boards. This strategic approach significantly increases your chances." };
    } else if (answers.resume_strategy === 'tailor_ats' || answers.resume_strategy === 'tweaks') { // Simple check for ATS awareness
        strength = { name: "Technical Awareness", message: "You understand ATS systems and optimize for them. This technical knowledge puts you ahead of most candidates." };
    } else if (['3-5', 'offers', 'interviewing'].includes(answers.interviews)) {
        strength = { name: "Strong Application Profile", message: "You're getting interviews - your profile is working! We just need to optimize your interview-to-offer conversion." };
    } else if (answers.emotional_state?.includes('hopeful')) {
        strength = { name: "Optimism & Resilience", message: "Your positive outlook is a powerful asset. Employers value candidates who maintain hope through challenges." };
    }

    // Blocking Point Identification
    let blockingPoint = { name: "Job Search Strategy", message: "Your current approach needs refinement. Small strategic changes can dramatically improve your results." };
    if (['150+'].includes(answers.applications) && answers.resume_strategy === 'same') {
        blockingPoint = { name: "Resume Strategy", message: "Your 'one-size-fits-all' resume is likely getting filtered out by ATS bots before a human ever sees it." };
    } else if (answers.resume_strategy === 'same' || answers.resume_strategy === 'tailor_no_ats') {
        blockingPoint = { name: "ATS Optimization", message: "80% of your resumes are likely rejected by bots, not humans. ATS compatibility is critical." };
    } else if (answers.linkedin === 'not_active' || answers.linkedin === 'under100') {
        blockingPoint = { name: "LinkedIn Presence", message: "Being inactive on LinkedIn means you're invisible to 70% of recruiters who use it to source candidates." };
    } else if (answers.applying !== 'network' && answers.applying !== 'all') {
        blockingPoint = { name: "Networking Gap", message: "Relying solely on job portals can be inefficient. A lack of networking might be holding you back from the hidden job market." };
    } else if (['none', '1-2'].includes(answers.interviews) && ['30-70', '70-150', '150+'].includes(answers.applications)) {
        blockingPoint = { name: "Application Targeting", message: "Low response rates suggest you might be targeting roles that don't align with your profile or experience level." };
    } else if (['3-5'].includes(answers.interviews)) {
        blockingPoint = { name: "Interview Conversion Gap", message: "You're getting interviews but not converting them. There's likely a gap in interview preparation or storytelling." };
    } else if (['under10'].includes(answers.applications)) {
        blockingPoint = { name: "Application Volume", message: "Your application volume might not be high enough to generate consistent interview opportunities in this competitive market." };
    }

    // Success Probability Calculation
    let baseProbability = 15;
    if (answers.resume_strategy === 'tailor_ats' || answers.resume_strategy === 'tweaks') baseProbability += 15;
    if (answers.resume_strategy === 'tailor_ats') baseProbability += 10; // Extra for ATS
    if (answers.applying === 'network' || answers.applying === 'all') baseProbability += 20;
    if (['500+', '1000+'].includes(answers.linkedin)) baseProbability += 15;
    if (['30-70', '70-150', '150+'].includes(answers.applications)) baseProbability += 10;
    if (['1-2', '3-5', 'offers', 'interviewing'].includes(answers.interviews)) baseProbability += 15;

    const successProbability = {
        current: Math.min(80, baseProbability),
        withSystem: 85 + Math.floor(Math.random() * 8) // 85-92%
    };

    return { strength, blockingPoint, successProbability };
};


const getQuestionScreens = (currencySymbol = '$', countryCode = 'US') => [
    { id: 1, key: 'challenge', title: "What's your biggest challenge right now?", subtitle: "Select the one that resonates most with you", options: [
        { icon: Inbox, title: "Applying everywhere, hearing nothing", subtitle: "Sending out resumes but not getting interview calls", value: 'no_response' },
        { icon: MessageSquare, title: "Getting interviews but no offers", subtitle: "Making it to interviews, but not converting to offers", value: 'interview' },
        { icon: Target, title: "Want to change careers but feel stuck", subtitle: "Unsure how to pivot or where to start your transition", value: 'change' },
        { icon: HelpCircle, title: "Need clarity on the right direction", subtitle: "Not fully sure what role or path fits you best", value: 'clarity' }
    ]},
    { id: 3, key: 'applying', title: "Where are you applying for jobs?", subtitle: "Select the one that best describes your strategy", options: [
        { icon: Search, title: "Online job portals", subtitle: "LinkedIn, Indeed, Naukri, Monster", value: 'portals' },
        { icon: Briefcase, title: "Company websites directly", subtitle: "Applying through official career pages", value: 'company' },
        { icon: Users, title: "Networking and referrals", subtitle: "Reaching out through professional connections", value: 'network' },
        { icon: Target, title: "Mix of multiple channels", subtitle: "Using a balanced approach across different platforms", value: 'mixed' }
    ]},
    { id: 5, key: 'applications', title: "How many jobs have you applied to in the last 30 days?", subtitle: "This helps us understand your application strategy", options: [
        { icon: FileText, title: "Less than 10 applications", subtitle: "Just getting started or being selective", value: 'under10' },
        { icon: FileText, title: "10-30 applications", subtitle: "Actively searching with focus", value: '10-30' },
        { icon: FileText, title: "30-70 applications", subtitle: "High volume search", value: '30-70' },
        { icon: Zap, title: "70-150+ applications", subtitle: "Very aggressive approach", value: '70-150' }        
    ]},
    { id: 7, key: 'resume_strategy', title: "How do you handle your resume before applying?", subtitle: "Select the option that best describes your process", options: [
        { icon: FileText, title: "Same resume for every job", subtitle: "I usually send one standard version to all employers", value: 'same_resume' },
        { icon: Sparkles, title: "I make small tweaks sometimes", subtitle: "I adjust parts like the title or summary for certain roles", value: 'minor_tweaks' },
        { icon: CheckCircle, title: "I tailor each resume carefully and check ATS", subtitle: "I optimize every version for both recruiters and systems", value: 'ats_optimized' },
        { icon: Target, title: "I customize, but not sure about ATS", subtitle: "I focus on content but haven’t used ATS tools yet", value: 'custom_no_ats' }
    ]},
    { id: 9, key: 'linkedin', title: "How active are you on LinkedIn?", subtitle: "70% of recruiters find candidates through LinkedIn", options: [
        { icon: Frown, title: "Rarely active (under 100 connections)", subtitle: "I have a profile but hardly use or update it", value: 'under_100' },
        { icon: Users, title: "Somewhat active (100–500 connections)", subtitle: "I engage occasionally and update my profile sometimes", value: '100_500' },
        { icon: TrendingUp, title: "Active and growing (500–1000 connections)", subtitle: "I post, comment, and expand my network regularly", value: '500_1000' },
        { icon: Star, title: "Highly active (1000+ connections)", subtitle: "I’m well-connected and actively build my personal brand", value: '1000_plus' }
    ]},
    { id: 11, key: 'interviews', title: "How many interviews have you received in the last 30 days?", subtitle: "This helps us identify where you need support", options: [
        { icon: Frown, title: "Haven't gotten any interviews yet", subtitle: "Still waiting for callbacks", value: 'none' },
        { icon: MessageSquare, title: "Got 1-2 interviews, no offers", subtitle: "Getting some traction", value: '1-2' },
        { icon: MessageSquare, title: "Got 3-5 interviews, no offers", subtitle: "Interview stage but not converting", value: '3-5' },
        { icon: TrendingUp, title: "Currently interviewing", subtitle: "In active interview processes", value: 'interviewing' }
    ]},
    { id: 13, key: 'urgency', title: "When do you want to land your next role?", subtitle: "This helps us prioritize your roadmap", options: [
        { icon: Zap, title: "ASAP - Within 30 days", subtitle: "I need results fast", value: 'asap' },
        { icon: Calendar, title: "In the next 1-3 months", subtitle: "Ready to commit and take action", value: '1-3' },
        { icon: TrendingUp, title: "3-6 months - Planning ahead", subtitle: "Want to be strategic and prepared", value: '3-6' },
        { icon: Search, title: "Just exploring for now", subtitle: "Gathering information and options", value: 'exploring' }
    ]},
    { id: 15, key: 'experience', title: "Where are you in your career journey?", subtitle: "So we can match you with relevant strategies", options: [
        { icon: Star, title: "Early Career (0-3 years)", subtitle: "Building my foundation and gaining experience", value: 'early' },
        { icon: TrendingUp, title: "Mid-Career (4-10 years)", subtitle: "Ready to level up and advance", value: 'mid' },
        { icon: Award, title: "Senior Professional (10+ years)", subtitle: "Seeking leadership and executive roles", value: 'senior' },
        { icon: Target, title: "Career Changer (Any experience)", subtitle: "Pivoting to something completely new", value: 'changer' }
    ]},
    { id: 17, key: 'salary', title: "What's your desired salary range?", subtitle: "This helps us align opportunities with your financial goals.", options: 
      countryCode === 'IN' ? [
        { icon: '₹', title: "₹3L – ₹8L", subtitle: "Career Foundation", value: '3-8L' },
        { icon: '₹', title: "₹8L – ₹20L", subtitle: "Career Acceleration", value: '8-20L' },
        { icon: '₹', title: "₹20L – ₹40L", subtitle: "Career Mastery", value: '20-40L' },
        { icon: '₹', title: "₹40L+", subtitle: "Leadership Excellence", value: '40L+' }
       
      ] : [
        { icon: DollarSign, title: `${currencySymbol}50K - ${currencySymbol}80K`, subtitle: "Entry to Mid-Level", value: '50-80k' },
        { icon: DollarSign, title: `${currencySymbol}80K - ${currencySymbol}120K`, subtitle: "Mid-Level to Senior", value: '80-120k' },
        { icon: DollarSign, title: `${currencySymbol}120K - ${currencySymbol}180K`, subtitle: "Senior to Lead", value: '120-180k' },
        { icon: DollarSign, title: `${currencySymbol}180K+`, subtitle: "Lead to Executive", value: '180k+' }
      ]
    },
    { id: 19, key: 'emotional_state', title: "How are you feeling about your job search?", subtitle: "Select all that apply. It's okay to feel a mix of things!", multiSelect: true, options: [
        { icon: '😫', title: 'Stressed', subtitle: 'Feeling the pressure.', value: 'stressed' },
        { icon: '🤔', title: 'Confused', subtitle: 'Unsure of the next steps.', value: 'confused' },
        { icon: '😠', title: 'Frustrated', subtitle: 'By the process or lack of results.', value: 'frustrated' },
        { icon: '💪', title: 'Determined', subtitle: 'Ready to overcome challenges.', value: 'determined' }
    ]},
    { id: 21, key: 'coaching_experience', title: "Have you ever worked with a career coach before?", subtitle: "Just curious about your experience", customLayout: true, options: [
        { icon: Lightbulb, title: "No — but curious to learn more", subtitle: "I’ve never worked with a coach, but I’m open to exploring it", value: 'no_curious' },
        { icon: ThumbsUp, title: "Yes — and want to continue growing", subtitle: "I’ve worked with a coach before and value the guidance", value: 'yes_helped' },
        { icon: Frown, title: "Yes — but looking for a better experience", subtitle: "I’ve tried coaching before, now seeking a more practical approach", value: 'yes_no_results' },
        { icon: HelpCircle, title: "Not sure — still exploring", subtitle: "I’d like to understand how career coaching could actually help", value: 'no_unsure' }
    ]},
    ];

interface OptionCardProps {
    icon: React.ElementType | string;
    title: string;
    subtitle: string;
    onClick: () => void;
    selected: boolean;
}

interface OptionCardProps {
    icon: React.ElementType | string;
    title: string;
    subtitle: string;
    onClick: () => void;
    selected: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({ icon: Icon, title, subtitle, onClick, selected }) => (
    <div
    onClick={onClick}
    className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 border ${
        selected
        ? 'border-[#FF7A00] bg-[#FF7A00]/20 shadow-lg'
        : 'bg-[#4314A0]/50 border-[#A76EFF]/40 hover:border-[#FF7A00]'
    }`}
    >
    {selected && (
        <div className="absolute -top-2 -right-2 bg-[#FF7A00] rounded-full p-1 animate-bounce">
        <CheckCircle className="w-5 h-5 text-white" />
        </div>
    )}
    <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg flex items-center justify-center ${selected ? 'bg-[#FF7A00]/30' : 'bg-[#FF7A00]/20'}`}>
        {typeof Icon === 'string' ? (
            <span className="text-2xl w-6 h-6 flex items-center justify-center">{Icon}</span>
        ) : (
            <Icon className={`w-6 h-6 ${selected ? 'text-[#FFB84D]' : 'text-[#FF7A00]'}`} />
        )}
        </div>
        <div className="flex-1">
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-[#E7D6FF]">{subtitle}</p>
        </div>
    </div>
    </div>
);

interface InsightScreenProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}
    
const InsightScreen: React.FC<InsightScreenProps> = ({ icon: Icon, title, children }) => (
    <div className="h-full overflow-hidden flex flex-col items-center justify-center text-center p-6">
    <div className="w-full max-w-md">
        <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#FFB84D] rounded-full opacity-30 animate-ping"></div>
        <div style={{ animation: 'subtle-pulse 2s ease-in-out infinite' }} className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-[#4314A0] to-[#3D1A65] rounded-full shadow-lg border-2 border-[#A76EFF]/50">
            <Icon className="w-12 h-12 text-[#FFB84D]" />
        </div>
        </div>
        <h2 className="text-2xl font-bold text-[#FFB84D] mb-4">{title}</h2>
        <div className="text-lg text-[#E7D6FF] mb-12">
        {children}
        </div>
        <div className="w-full bg-[#4314A0] rounded-full h-1.5">
        <div
            className="bg-gradient-to-r from-[#FF7A00] to-[#FFB84D] h-1.5 rounded-full"
            style={{ animation: 'fill-progress 3s linear forwards' }}
        />
        </div>
    </div>
    </div>
);

const Confetti: React.FC = () => {
    const [visible, setVisible] = useState(true);
    const confettiCount = 150;
    const colors = ['#FF7A00', '#FFB84D', '#A76EFF', '#C59BFF', '#FFFFFF'];

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 2000); // Only show for 2 seconds
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
            {Array.from({ length: confettiCount }).map((_, i) => (
                <div 
                    key={i}
                    className="absolute w-2 h-4 rounded-sm"
                    style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        animation: `confetti-fall ${1.5 + Math.random()}s linear ${Math.random() * 0.5}s forwards`,
                    }}
                />
            ))}
        </div>
    );
};


// --- Main View Component ---
export const UserView: React.FC<UserViewProps> = ({ onSubmission, onSwitchToAdmin }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [multiSelectedOptions, setMultiSelectedOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [location, setLocation] = useState('N/A');
  const userEmail = (formData && (formData.email || formData['email'])) || "unknown@example.com";
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [chosenPath, setChosenPath] = useState<'diy' | 'expert' | null>(null);
  const [showPlanForPrint, setShowPlanForPrint] = useState(false);

  // State for the new single-screen interactive analysis
  const [analysisProgress, setAnalysisProgress] = useState([
    { id: 'strength', label: 'Analyzing Your Strengths', status: 'pending', visible: true },
    { id: 'roadblock', label: 'Identifying Your Biggest Roadblock', status: 'pending', visible: false },
    { id: 'probability', label: 'Calculating Your Success Probability', status: 'pending', visible: false }
  ]);
  const [currentAnalysisPrompt, setCurrentAnalysisPrompt] = useState<string | null>(null);


  const QUESTION_SCREENS = useMemo(() => getQuestionScreens(currencySymbol, location), [currencySymbol, location]);
  
  const totalQuestionScreens = QUESTION_SCREENS.length;

  useEffect(() => {
    fetch('https://ipinfo.io?token=d369b6f31b30af')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch location');
        return response.json();
      })
      .then(data => {
        if (data && data.country) {
          setLocation(data.country);
          const countryToCurrency: { [key: string]: string } = {
            'GB': '£', 'DE': '€', 'FR': '€', 'ES': '€', 'IT': '€', 'NL': '€',
            'IE': '€', 'AT': '€', 'BE': '€', 'FI': '€', 'GR': '€', 'PT': '€',
            'IN': '₹', 'JP': '¥', 'AU': 'A$', 'CA': 'C$',
          };
          setCurrencySymbol(countryToCurrency[data.country] || '$');
        }
      })
      .catch(error => {
        console.error('Error fetching country:', error);
      });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const isQuestionInsightScreen = currentScreen > 0 && currentScreen % 2 === 0 && currentScreen <= totalQuestionScreens * 2;

    if (isQuestionInsightScreen) {
      const timer = setTimeout(() => {
        setCurrentScreen(cs => cs + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    // --- New logic for the single-screen analysis ---
    if (currentScreen === 23) {
      if (!analysisData) {
        setAnalysisData(generateAnalysis(formData));
      }
      
      const currentAnalyzingStep = analysisProgress.find(p => p.status === 'analyzing');
      const nextPendingStep = analysisProgress.find(p => p.status === 'pending' && p.visible);

      // If a step is analyzing and there's no prompt, show the prompt after a delay
      if (currentAnalyzingStep && !currentAnalysisPrompt) {
        const timer = setTimeout(() => {
          setCurrentAnalysisPrompt(currentAnalyzingStep.id);
        }, 2500); // Duration of the progress bar animation
        return () => clearTimeout(timer);
      }
      
      // If there's no step analyzing but there is a pending one, start it
      if (!currentAnalyzingStep && nextPendingStep) {
         const timer = setTimeout(() => {
            setAnalysisProgress(prev => prev.map(p => p.id === nextPendingStep.id ? { ...p, status: 'analyzing' } : p));
        }, 500); // A small delay to kick off the animation
        return () => clearTimeout(timer);
      }
    }


    // When navigating to a question, restore previous selection
    const currentQuestion = QUESTION_SCREENS.find(q => q.id === currentScreen);
    if (currentQuestion) {
      const previousAnswer = formData[currentQuestion.key];
      if (currentQuestion.multiSelect) {
        setMultiSelectedOptions(Array.isArray(previousAnswer) ? previousAnswer : []);
        setSelectedOption(null);
      } else {
        setSelectedOption(previousAnswer || null);
        setMultiSelectedOptions([]);
      }
    } else {
      setSelectedOption(null);
      setMultiSelectedOptions([]);
    }
  }, [currentScreen, formData, QUESTION_SCREENS, totalQuestionScreens, analysisProgress, currentAnalysisPrompt, analysisData]);
  
  const handleAnalysisPromptAnswer = (response: boolean) => {
    const currentStepId = currentAnalysisPrompt;
    if (!currentStepId) return;
    
    // You can optionally store the 'yes'/'no' response if needed later
    // setFormData(prev => ({ ...prev, [`analysis_${currentStepId}`]: response }));

    setAnalysisProgress(prev => {
        const newProgress = [...prev];
        const currentStepIndex = newProgress.findIndex(p => p.id === currentStepId);
        
        if (currentStepIndex !== -1) {
            newProgress[currentStepIndex].status = 'complete';
        }
        
        // Make the next step visible
        if (currentStepIndex + 1 < newProgress.length) {
            newProgress[currentStepIndex + 1].visible = true;
        }
        
        return newProgress;
    });

    setCurrentAnalysisPrompt(null);
    
    const lastStepId = analysisProgress[analysisProgress.length - 1].id;
    if (currentStepId === lastStepId) {
        setTimeout(() => setCurrentScreen(24), 500);
    }
  };


  const handleNext = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setSelectedOption(null);
    setMultiSelectedOptions([]);
    setTimeout(() => {
      setCurrentScreen(cs => {
        // After the last question (ID 21), skip the final (removed) insight screen and go to analysis (ID 23)
        if (cs === 21) {
          return 23;
        }
        return cs + 1;
      });
    }, 300);
  };
  
  const handleMultiSelect = (value: string) => {
    setMultiSelectedOptions(prev => 
        prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
    );
  };

  const handleBack = () => {
    if (currentScreen <= 1) return;
    // Jump back 2 steps to skip the insight screen in between questions
    const prevQuestionScreen = QUESTION_SCREENS.slice().reverse().find(q => q.id < currentScreen);
    if(prevQuestionScreen) {
        setCurrentScreen(prevQuestionScreen.id);
    } else {
        setCurrentScreen(0);
    }
  };

const handleContactSubmit = useCallback(async () => {
  // ✅ Validate fields
  const newErrors: Record<string, boolean> = {};
  if (!formData.fullName) newErrors.fullName = true;
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
  if (!formData.phone) newErrors.phone = true;
  if (!formData.consent) newErrors.consent = true;
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsSubmitting(true);

  // ✅ Save lead data to BrainyScout API first
  const apiUrl = "https://www.brainyscout.com/API/ReceiveLead";
  const leadData = {
    FirstName: formData.fullName.split(" ")[0],
    LastName: formData.fullName.split(" ").slice(1).join(" ") || "",
    Email: formData.email,
    Phone: formData.phone,
    IsSubscribe: formData.consent,
    SubmissionDateTime: new Date().toISOString(),
    LeadSourceId: 6,
    Status: "New",
    NextTriggerDate: new Date().toISOString().split("T")[0],
    CurrentTemplateId: 1,
    CountryCode: location || "",
    UserAccountId: "",
  };

  const formBody = new URLSearchParams(
    Object.entries(leadData).map(([key, value]) => [key, value.toString()])
  );

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
    });

    console.log("✅ Lead sent:", response.status);
  } catch (error) {
    console.error("❌ Failed to save lead:", error);
  }

  // ✅ Generate PDF and send to webhook
  try {
    const element = document.querySelector(".print-container") as HTMLElement;
    if (element) {
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 0.5,
        filename: "Career-Placement-Plan.pdf",
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const },
      };

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");

      const formDataWebhook = new FormData();
      formDataWebhook.append("email", formData.email);
      formDataWebhook.append("location", location);
      formDataWebhook.append("file", pdfBlob, "Career-Placement-Plan.pdf");

      await fetch("https://hook.us2.make.com/c6yh9h0lq58aca3iwp42uk7fu8b37rey", {
        method: "POST",
        body: formDataWebhook,
        mode: "no-cors",
      });

      console.log("✅ PDF sent to Make webhook");
    }
  } catch (err) {
    console.error("❌ PDF generation or webhook failed:", err);
  }

  // ✅ Continue flow
  setIsSubmitting(false);
  onSubmission(formData.email, formData, location);
  setCurrentScreen(26);
}, [formData, location, onSubmission]);



  const handleDownloadPlan = () => {
    setShowPlanForPrint(true);
  };


  const renderContent = () => {
    const benefits = [
        { icon: Target, title: "Day #1: The Hidden Job Market", text: "Learn how to find and tap into the 70% of jobs that are never advertised online." },
        { icon: Sparkles, title: "Day #2: The 'Magnetic' Resume", text: "Craft a resume that beats ATS bots and captivates human recruiters in under 7 seconds." },
        { icon: MessageSquare, title: "Day #3: LinkedIn Optimization", text: "Build a magnetic LinkedIn profile that attracts recruiters and learn proven referral strategies to unlock hidden opportunities." },
        { icon: MessageSquare, title: "Day #4: Master the Interview", text: "Use our 'STAR-C' framework to ace any interview and master the follow-up strategies that turn conversations into offers." },
        { icon: TrendingUp, title: "Bonus: Salary Negotiation", text: "Learn the exact script that has helped our clients increase their offers by an average of 18%." },
    ];
    // Screen 0: Welcome
    if (currentScreen === 0) {
      return (
        <div className="min-h-screen flex justify-center items-center p-6">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 text-sm mb-4 px-3 py-1 bg-[#FF7A00]/20 text-[#FFB84D] font-semibold rounded-full uppercase tracking-wide animate-pulse">
                <Zap className="w-4 h-4" />
                Free Career Assessment
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Still Sending 100+ Applications<br />
              <span className="text-[#FF7A00]">With ZERO Callbacks?</span>
            </h1>
            <p className="text-xl text-[#E7D6FF] mb-16">
              You're not alone. 87% of job seekers make the same 3 mistakes.
            </p>
            <p className="text-2xl text-white font-bold mb-10">
              Get Your Personalized Placement Plan FREE in 60 seconds!
            </p>
            <button
              onClick={() => handleNext('started', true)}
              className="bg-gradient-to-r from-[#FF7A00] to-[#FFB84D] text-white font-bold py-5 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-[#FF7A00]/30 w-full md:w-auto"
            >
              Get My FREE Placement Plan
              <ChevronRight className="inline ml-2 w-5 h-5" />
            </button>
            <p className="text-md text-[#FFB84D] mt-4 font-semibold mb-0">
              ⚡ Join 15,000+ career changers who got hired faster.
            </p>
          </div>
        </div>
      );
    }

    const currentQuestion = QUESTION_SCREENS.find(q => q.id === currentScreen);
    if (currentQuestion) {
        const isMultiSelect = currentQuestion.multiSelect;
        const isContinueDisabled = isMultiSelect ? multiSelectedOptions.length === 0 : !selectedOption;

        const handleContinue = () => {
            const value = isMultiSelect ? multiSelectedOptions : selectedOption;
            handleNext(currentQuestion.key, value);
        }

        if(currentQuestion.customLayout) {
             const conditionalMessages: Record<string, string> = {
                'yes_helped': "That's fantastic! You already know the power of a good strategy. We're here to take that to the next level.",
                'yes_no_results': "We hear that a lot. The right fit and a proven system make all the difference. Let's show you what works.",
                'no_curious': "You're in the right place! Being open to new strategies is the first step towards a major breakthrough.",
                'no_unsure': "No problem at all. Our goal is to demystify the process and show you the clear, data-backed path to success."
            };

            return (
                 <div className="max-w-3xl mx-auto px-6 pb-6">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-3">{currentQuestion.title}</h2>
                        <p className="text-[#E7D6FF]">{currentQuestion.subtitle}</p>
                    </div>
                    
                    <div className="space-y-4">
                        {currentQuestion.options.map(opt => (
                        <OptionCard 
                            key={opt.value} 
                            {...opt} 
                            selected={selectedOption === opt.value} 
                            onClick={() => setSelectedOption(opt.value)} 
                        />
                        ))}
                    </div>

                    <div className="mt-8 flex justify-between items-center gap-4">
                        <button 
                            onClick={handleBack} 
                            className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold transition-colors py-4 px-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                        <button onClick={handleContinue} disabled={isContinueDisabled} className={`w-auto min-w-[180px] text-center px-6 py-4 rounded-xl font-semibold text-lg transition-all ${!isContinueDisabled ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB84D] hover:scale-105 shadow-lg text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}>
                        Continue <ChevronRight className="inline ml-2 w-5 h-5" />
                        </button>
                    </div>
                    
                    {selectedOption && (
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center text-blue-300 transition-opacity duration-300">
                           {conditionalMessages[selectedOption]}
                        </div>
                    )}
                 </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto px-6 pb-6">
            <div className="mb-4">
                <h2 className="text-3xl font-bold text-white mb-3">{currentQuestion.title}</h2>
                <p className="text-[#E7D6FF]">{currentQuestion.subtitle}</p>
            </div>
            <div className="space-y-4">
                {currentQuestion.options.map(opt => (
                <OptionCard 
                    key={opt.value} 
                    {...opt} 
                    selected={isMultiSelect ? multiSelectedOptions.includes(opt.value) : selectedOption === opt.value} 
                    onClick={() => isMultiSelect ? handleMultiSelect(opt.value) : setSelectedOption(opt.value)} 
                />
                ))}
            </div>
            <div className="mt-8 flex justify-between items-center gap-4">
                {currentScreen > 1 ? (
                    <button 
                        onClick={handleBack} 
                        className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold transition-colors py-4 px-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>
                ) : <div />}
                <button onClick={handleContinue} disabled={isContinueDisabled} className={`w-auto min-w-[180px] text-center px-6 py-4 rounded-xl font-semibold text-lg transition-all ${!isContinueDisabled ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB84D] hover:scale-105 shadow-lg text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}>
                Continue <ChevronRight className="inline ml-2 w-5 h-5" />
                </button>
            </div>
            </div>
        );
    }
    
    const insightScreens = [
        { id: 2, icon: BarChart3, title: "A Critical Insight", content:(
            <>
               <p>Only 2-3% of online applications result in interviews—but <span className="font-bold text-white">60% of referrals lead to job offers.</span></p>
                <div className="flex items-center justify-center text-5xl gap-2 mt-4 text-slate-400">
                🤝
                </div>
            </>
        )       
    
    },
        { id: 4, icon: Briefcase, title: "The Reality of the Job Market", content: (
            <>
                <p>The average job posting receives <span className="font-bold text-white">250+ applications.</span> Standing out requires strategy, not just volume.</p>
                <div className="flex items-center justify-center text-5xl gap-2 mt-4 text-slate-400">
                🎯
                </div>
            </>
        ) },
        { id: 6, icon: Clock, title: "First Impressions Matter", content: (
          <>
               <p>Recruiters spend only <span className="font-bold text-white">6-8 seconds</span> scanning your resume. Your first impression happens in seconds, not minutes.</p> 
                <div className="flex items-center justify-center text-5xl gap-2 mt-4 text-slate-400">
                ⏱️
                </div>
            </>         
          
        )},
        { id: 8, icon: FileText, title: "Beating the Bots", content: (
        <>
                <p><span className="font-bold text-white">75% of resumes</span> are rejected by ATS (Applicant Tracking Systems) before a human ever sees them.</p>
                <div className="flex items-center justify-center text-4xl gap-2 mt-4 text-slate-400">
                🤖
                </div>
            </>         
        )      
        },
        { id: 10, icon: Users, title: "The Power of Your Network", content:(
        <>
                <p><span className="font-bold text-white">82% of employers</span> rate employee referrals as the #1 source for quality hires—higher ROI than any job portal.</p> 
                <div className="flex items-center justify-center text-4xl gap-2 mt-4 text-slate-400">
                🏆
                </div>
            </>         
        ) },
        { id: 12, icon: Mail, title: "The Follow-Up Advantage", content:(
        <>
                <p><span className="font-bold text-white">80%</span> of hiring managers look favorably upon follow-up thank-you messages — yet only <span className="font-bold text-white">25%</span> of candidates actually send one.</p>
               <div className="flex items-center justify-center text-4xl gap-2 mt-4 text-slate-400">
                ✉️ 
                </div>
            </>         
        )},
        { id: 14, icon: LineChartIcon, title: "Your Personalized Trajectory", content: null }, // Placeholder for dynamic chart
        { id: 16, icon: TrendingUp, title: "Your Career Journey", content: (
             <>
                <div className="bg-[#4314A0]/50 border border-[#A76EFF]/40 rounded-xl p-6 shadow-lg max-w-sm mx-auto mb-6">
                    <div className="flex items-center justify-between text-center text-xs text-slate-300 mb-2">
                        <span>🌱 Starting</span>
                        <span>🚀 Growing</span>
                        <span>👑 Leading</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-l-full"></div>
                        <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 to-orange-500"></div>
                        <div className="flex-1 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-r-full"></div>
                    </div>
                    <p className="text-center text-sm text-purple-300 font-semibold mt-4">Every level needs different strategies</p>
                </div>
                <p className="text-base">Professionals who work with coaches report an average salary increase of <span className="font-bold text-white">25% in their next role.</span></p>
            </>
        )},
        { id: 18, icon: TrendingUp, title: "Salary Negotiation Tip", content: 
            (
        <>
               <p>Did you know? <span className="font-bold text-white">58% of people</span> don't negotiate their salary. A successful negotiation can increase your starting pay by 7-10%.</p>
               <div className="flex items-center justify-center text-4xl gap-2 mt-4 text-slate-400">
                💰 
                </div>
            </>         
        )        
     },
        { id: 20, icon: UsersRound, title: "Join a Thriving Community", content: (
            <div className="max-w-sm mx-auto space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-xl">
                        <p className="text-2xl font-bold text-green-400">15K</p>
                        <p className="text-xs text-slate-300">Happy Clients</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl">
                        <p className="text-2xl font-bold text-blue-400">93%</p>
                        <p className="text-xs text-slate-300">Success Rate</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-xl">
                        <p className="text-2xl font-bold text-orange-400">4.9 ★</p>
                        <p className="text-xs text-slate-300">Average Rating</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-4 rounded-2xl border border-indigo-400/30 text-center">
                    <p className="text-sm font-semibold text-indigo-300 mb-2">Over 500 professionals have transformed their careers with us</p>
                    <div className="bg-slate-900/50 p-4 rounded-xl">
                        <div className="flex items-center gap-4 mb-3">
                             <img src="https://brainyscout.com/Content/images/avatar/Eben.png" alt="User avatar" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                             <div>
                                <p className="font-bold text-white text-left">Eben Arko</p>
                                <p className="text-xs text-slate-300 text-left">Business Analyst</p>
                             </div>
                        </div>
                        <p className="italic text-sm text-slate-200 mb-3">"Landed my dream role in less than 60 days! The 4-day workshop changed everything. My salary jumped by $35K!"</p>
                    </div>
                </div>
            </div>
        )},
    ];

    const currentInsight = insightScreens.find(s => s.id === currentScreen);
    if (currentInsight) {
      if (currentInsight.id === 14) {
        const UrgencyChart = () => {
          const urgency = formData.urgency;
          let timelineLabel = 'IN 1 Mon';
          if (urgency === '1-3') timelineLabel = 'IN 3 Mons';
          else if (urgency === '3-6') timelineLabel = 'IN 6 Mons';

          const data = [
              { name: 'Today', expert: 30, diy: 30 },
              { name: 'p2', expert: 55, diy: 26 },
              { name: 'p3', expert: 80, diy: 22 },
              { name: timelineLabel, expert: 95, diy: null },
          ];
          
          const startY = data[0].expert;
          const endExpertY = data[data.length - 1].expert;
          const lastDiyPoint = [...data].reverse().find(p => p.diy !== null);

          const CustomDot = (props: any) => {
              const { cx, cy, payload, dataKey } = props;
              const isStart = payload.name === 'Today';
              const isExpertEnd = dataKey === 'expert' && payload.name === timelineLabel;
              const isDiyEnd = dataKey === 'diy' && payload.name === lastDiyPoint?.name;

              if (!isStart && !isExpertEnd && !isDiyEnd) return null;

              let dotColor = '#A76EFF';
              if (isExpertEnd) dotColor = '#1A8E72';
              if (isDiyEnd) dotColor = '#D95D39';
              
              return <circle cx={cx} cy={cy} r={8} fill={dotColor} stroke="#13162E" strokeWidth={2} />;
          };

          return (
              <div className="w-full max-w-lg mx-auto">
                  <div className="relative w-full h-80 line-chart-draw">
                      <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={data} margin={{ top: 40, right: 40, left: 20, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="0" stroke="rgba(167, 110, 255, 0.15)" horizontal={true} vertical={false} />
                               <XAxis 
                                dataKey="name" 
                                stroke="#E7D6FF" 
                                dy={10} 
                                tick={({ x, y, payload }) => {
                                    if (payload.value === 'Today' || payload.value === timelineLabel) {
                                        return (
                                            <g transform={`translate(${x},${y})`}>
                                                <text x={0} y={0} dy={16} textAnchor="middle" fill="#E7D6FF" fontSize={14} fontWeight="bold">
                                                    {payload.value}
                                                </text>
                                            </g>
                                        );
                                    }
                                    return null;
                                }}
                                interval={0} 
                                axisLine={false} 
                                tickLine={false} 
                              />
                              <YAxis hide={true} domain={[0, 105]} />
                              <ReferenceLine y={0} x="Today" segment={[{ x: 'TODAY', y: 0 }, { x: 'TODAY', y: startY }]} stroke="#A76EFF" />
                              <ReferenceLine y={0} x={timelineLabel} segment={[{ x: timelineLabel, y: 0 }, { x: timelineLabel, y: endExpertY }]} stroke="#1A8E72" />
                              <Line type="monotone" dataKey="diy" stroke="#D95D39" strokeWidth={4} dot={<CustomDot />} activeDot={false} connectNulls={false}/>
                              <Line type="monotone" dataKey="expert" stroke="#1A8E72" strokeWidth={4} dot={<CustomDot />} activeDot={false}/>
                          </LineChart>
                      </ResponsiveContainer>
                       <div className="graph-label diy-label">
                          <p>Your Current Path</p>
                      </div>
                      <div className="graph-label expert-label">
                          <p>The Expert Path</p>
                      </div>
                  </div>
                   <p className="font-bold text-lg tracking-widest text-slate-300 mt-2 uppercase text-center">SELF-CONFIDENCE IMPROVEMENT</p>
              </div>
          );
        };
        return (
          <InsightScreen icon={LineChartIcon} title="Your Personalized Trajectory">
            <UrgencyChart />
          </InsightScreen>
        );
      }
      return (
        <InsightScreen icon={currentInsight.icon} title={currentInsight.title}>
          {currentInsight.content}
        </InsightScreen>
      );
    }
    
    if (currentScreen === 23) {
      if (!analysisData) return <div className="min-h-screen flex items-center justify-center"><p>Initializing analysis...</p></div>;

      const promptContent: Record<string, any> = {
        strength: {
            icon: Zap,
            subTitle: "We found your #1 strength",
            mainTitle: analysisData.strength.name,
            description: analysisData.strength.message,
            question: "Do you want to leverage this strength to get hired faster?",
            yesButtonColor: 'orange'
        },
        roadblock: {
            icon: AlertTriangle,
            subTitle: "Your Top Blocking Point",
            mainTitle: analysisData.blockingPoint.name,
            description: analysisData.blockingPoint.message,
            question: "Want to fix this and start getting recruiter messages in your inbox?",
            yesButtonColor: 'orange'
        },
        probability: {
            icon: BarChart3,
            subTitle: "Your Success Probability",
            current: analysisData.successProbability.current,
            withSystem: analysisData.successProbability.withSystem,
            question: `Ready to nearly double your success rate?`,
            yesButtonColor: 'orange'
        },
      };

      const currentPromptData = currentAnalysisPrompt ? promptContent[currentAnalysisPrompt] : null;

      return (
        <div className="min-h-screen flex flex-col justify-between p-6">
            <div className="pt-12">
                <h1 className="text-3xl font-bold text-center mb-8">Analyzing your placement plan...</h1>
                <div className="space-y-6 max-w-lg mx-auto">
                    {analysisProgress.filter(step => step.visible).map(step => (
                        <div key={step.id}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-slate-200">{step.label}</span>
                                {step.status === 'complete' && <CheckCircle className="w-6 h-6 text-green-400" />}
                            </div>
                            <div className="w-full bg-[#4314A0] h-2 rounded-full overflow-hidden">
                                {step.status === 'analyzing' && <div className="h-full bg-blue-500 rounded-full" style={{ animation: 'progress-bar-fill-slow 2.5s linear forwards' }}></div>}
                                {step.status === 'complete' && <div className="h-full bg-green-400 rounded-full w-full"></div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pb-8 mt-4">
                 {currentPromptData && (
                    <div className="max-w-lg mx-auto bg-[#1e1b4b]/80 border border-[#A76EFF]/30 p-6 rounded-2xl backdrop-blur-sm animate-fade-in">
                        {currentAnalysisPrompt === 'probability' ? (
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <currentPromptData.icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
                                    <h2 className="text-xl font-bold text-white">{currentPromptData.subTitle}</h2>
                                </div>
                                <div className="flex justify-around items-center text-center my-6">
                                    <div>
                                        <p className="text-slate-400 text-sm">Your Current Chance</p>
                                        <p className="text-4xl font-bold text-red-500">{currentPromptData.current}%</p>
                                    </div>
                                    <ArrowRight className="w-8 h-8 text-slate-500" />
                                    <div>
                                        <p className="text-slate-400 text-sm">With Our System</p>
                                        <p className="text-4xl font-bold text-green-400">{currentPromptData.withSystem}%</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4">
                                <currentPromptData.icon className={`w-8 h-8 ${currentAnalysisPrompt === 'strength' ? 'text-green-400' : 'text-orange-400'} mt-1 flex-shrink-0`} />
                                <div>
                                    <p className={`font-semibold ${currentAnalysisPrompt === 'strength' ? 'text-green-400' : 'text-orange-400'}`}>{currentPromptData.subTitle}</p>
                                    <h2 className="text-xl font-bold text-white mb-2">{currentPromptData.mainTitle}</h2>
                                    <p className="text-slate-300 text-base">{currentPromptData.description}</p>
                                </div>
                            </div>
                        )}
                        <p className="text-center text-2xl font-semibold text-white mt-6 mb-4">{currentPromptData.question}</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => handleAnalysisPromptAnswer(false)} className="px-8 py-3 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-colors w-1/2 text-white">No</button>
                            <button onClick={() => handleAnalysisPromptAnswer(true)} className={`px-8 py-3 rounded-lg font-bold text-white hover:scale-105 transition-transform w-1/2 ${
                                currentPromptData.yesButtonColor === 'orange' ? 'bg-gradient-to-r from-orange-500 to-red-600' :
                                currentPromptData.yesButtonColor === 'green' ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                                'bg-gradient-to-r from-blue-500 to-purple-600'
                            }`}>Yes</button>
                        </div>
                    </div>
                )}
                
                <div className="text-center mt-8 text-slate-400">
                    <div className="flex justify-center items-center gap-1 text-yellow-400 mb-2">
                         <ul className="flex justify-center -space-x-3 mb-3">
                            <li><img src="https://brainyscout.com/Content/images/avatar/01.jpg" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" /></li>
                            <li><img src="https://brainyscout.com/Content/images/avatar/02.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" /></li>
                            <li><img src="https://brainyscout.com/Content/images/avatar/03.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" /></li>
                            <li><img src="https://brainyscout.com/Content/images/avatar/04.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" /></li>
                          </ul>
                    </div>
                    <p className="font-bold text-white">Join 15,000+ Candidates Who Loved Our Services!</p>
                    <p className="text-sm text-slate-400">Start your journey to success with real guidance that works.</p>
                </div>
            </div>
        </div>
      );
    }
    
    if (currentScreen === 24) { // NEW Consolidated Congratulations & Path Choice Screen
        const urgency = formData.urgency;
        const timeline = urgency === 'asap' ? 'IN 1 Mon' : (urgency === '1-3' ? 'IN 3 Mons' : 'IN 6 Mons');
        const graphData = [
            { name: 'Today', value: 20 },
            { name: 'p1', value: 30 },
            { name: 'p2', value: 65 },
            { name: 'p3', value: 80 },
            { name: timeline, value: 90 },
        ];
        
        const CustomDot = (props: any) => {
            const { cx, cy, payload } = props;
            if (payload.name === 'Today' || payload.name === timeline) {
              return <circle cx={cx} cy={cy} r={8} fill="#facc15" stroke="#13162E" strokeWidth={3} />;
            }
            return null;
        };
        return (
             <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <Confetti />
                <div className="max-w-4xl w-full z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ animation: 'text-focus-in 1s both'}}>CONGRATULATIONS!</h1>
                    <p className="text-xl text-slate-200 mb-6">You've Unlocked Your FREE Personalized Career Placement Plan!</p>
                    
                    {/* Value Banner */}
                    <div className="flex justify-center items-center gap-2 md:gap-4 my-6">
                       
                        <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 md:p-4 rounded-2xl" style={{ animation: 'glow-pulse 2.5s infinite ease-in-out' }}>
                         <div className="flex justify-center items-center" style={{ animation: 'bounce-in 1s ease-out 0.5s both' }}>
                            <Gift className="w-16 h-16 md:w-20 md:h-20 text-yellow-300" style={{ filter: 'drop-shadow(0 0 10px #facc15)' }} />
                        </div>
                            <div className="text-base md:text-lg font-semibold line-through opacity-80">Worth $189</div>
                            <div className="text-3xl md:text-4xl font-black tracking-wide">TODAY 100% FREE</div>
                        </div>
                    </div>
                    {/* Graph */}
                    <div className="bg-[#1e1b4b]/50 border border-[#A76EFF]/30 rounded-2xl p-6 md:p-8 shadow-2xl mb-8">
                        <div className="relative w-full h-80 line-chart-draw">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={graphData} margin={{ top: 40, right: 50, left: 30, bottom: 20 }}>
                                     <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#40f84c" stopOpacity={0}/>
                                        </linearGradient>
                                         <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#facc15" />   {/* Green start */}
                                            <stop offset="100%" stopColor="#40f84c" /> {/* Yellow end */}
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0" stroke="rgba(167, 110, 255, 0.1)" horizontal={true} vertical={false}/>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#E7D6FF" 
                                        dy={10} 
                                        tick={({ x, y, payload }) => {
                                            if (payload.value === 'Today' || payload.value === timeline) {
                                                return (
                                                    <g transform={`translate(${x},${y})`}>
                                                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#E7D6FF" fontSize={14} fontWeight="bold">
                                                            {payload.value}
                                                        </text>
                                                    </g>
                                                );
                                            }
                                            return null;
                                        }} 
                                        interval={0}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide={true} domain={[0, 105]} />
                                    <Area type="monotone" dataKey="value" stroke="url(#strokeGradient)" strokeWidth={4} fillOpacity={1} fill="url(#colorUv)" dot={<CustomDot />} />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div className="graph-label trajectory-label">
                                <p>Your Dream Job</p>
                            </div>
                        </div>
                        <p className="font-bold text-lg tracking-widest text-slate-300 mt-2 uppercase">Career Trajectory Improvement</p>
                    </div>
                    
                    {/* NEW: What You'll Receive Section */}
                    <div className="bg-[#4314A0]/50 border border-[#A76EFF]/40 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="text-2xl font-bold text-yellow-300 mb-4 text-center">🎯 Your Customized Roadmap Includes:</h3>
                        <div className="space-y-3 text-slate-200">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span>Career assessment & success metrics</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span>Personalized job search strategy tailored to your goals</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span>Industry-specific placement roadmap</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                <span>Timeline to land your dream job in 30-60 days</span>
                            </div>
                        </div>
                    </div>                   
                    
                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <div className="relative w-full md:w-auto">
                            <button onClick={() => { setChosenPath('expert'); setCurrentScreen(25); }} className="w-full px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FFB84D] hover:scale-105 transition-all shadow-lg shadow-[#FF7A00]/30 text-lg">
                                Download Your Free Placement Plan
                            </button>
                        </div>
                    </div>
                    {/* Trust Elements */}
                    <div className="mt-6 text-slate-300 text-sm space-y-2">
                        <div className="text-slate-400 text-xs">
                            <p>✅ Start Your 30-60 Day Job Search Transformation Today</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }    
    if (currentScreen === 25) { // Lead Capture Form
       return (
        <div className="max-w-2xl mx-auto px-6 pb-12 pt-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">🎯Claim Your FREE Placement Plan...</h2>
                <p className="text-[#E7D6FF]">Enter your details to receive:</p>
            </div>
            <div className="space-y-5 bg-[#4314A0]/50 border border-[#A76EFF]/40 p-8 rounded-2xl">
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name *</label>
                    <input type="text" placeholder="What should we call you?" value={formData.fullName || ''} onChange={(e) => { setFormData(p => ({ ...p, fullName: e.target.value })); setErrors(p => ({ ...p, fullName: false })); }} className={`w-full px-4 py-3 rounded-xl border bg-[#3D0090] placeholder-gray-400 ${errors.fullName ? 'border-red-500' : 'border-[#A76EFF]/40'} focus:ring-2 focus:ring-[#FF7A00] outline-none transition-all`} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address *</label>
                    <input type="email" placeholder="your.email@example.com" value={formData.email || ''} onChange={(e) => { setFormData(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: false })); }} className={`w-full px-4 py-3 rounded-xl border bg-[#3D0090] placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-[#A76EFF]/40'} focus:ring-2 focus:ring-[#FF7A00] outline-none transition-all`} />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number *</label>
                    <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone || ""}
                            onChange={(e) => {
                                // ✅ Keep only numbers and an optional leading "+"
                                const cleaned = e.target.value.replace(/[^\d+]/g, "");

                                // ✅ Limit "+" to only the first character
                                const normalized = cleaned.startsWith("+")
                                ? "+" + cleaned.slice(1).replace(/\+/g, "")
                                : cleaned.replace(/\+/g, "");

                                setFormData((p) => ({ ...p, phone: normalized }));
                                setErrors((p) => ({ ...p, phone: false }));
                            }}
                            onBlur={() => {
                                // ✅ Validate minimum 8 digits on blur
                                if (!/^\+?\d{8,15}$/.test(formData.phone || "")) {
                                setErrors((p) => ({ ...p, phone: true }));
                                }
                            }}
                            inputMode="numeric"
                            maxLength={16}
                            className={`w-full px-4 py-3 rounded-xl border bg-[#3D0090] placeholder-gray-400 ${
                                errors.phone ? "border-red-500" : "border-[#A76EFF]/40"
                            } focus:ring-2 focus:ring-[#FF7A00] outline-none transition-all`}
                            />

                </div>
                <div className="flex items-start gap-3 pt-2">
                    <input type="checkbox" id="consent" checked={formData.consent || false} onChange={(e) => { setFormData(p => ({ ...p, consent: e.target.checked })); setErrors(p => ({ ...p, consent: false })); }} className="mt-1 w-5 h-5 accent-[#FF7A00] bg-gray-700 border-gray-600 rounded" />
                    <label htmlFor="consent" className="text-sm text-[#E7D6FF]"> I agree to receive career tips, workshop details, and personalized guidance. Unsubscribe anytime.</label>
                </div>
                 {errors.consent && <p className="text-red-400 text-sm -mt-2">Please accept to continue</p>}
                 <button onClick={handleContactSubmit} disabled={isSubmitting} className={`w-full text-center py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all ${isSubmitting ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-[#FF7A00] to-[#FFB84D] hover:scale-105'}`}>
                    {isSubmitting ? 'Generating Your Plan...' : 'Generate My Free Career Plan Now'}
                </button>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><ShieldCheck size={14}/> 100% Secure</span>
                    <span className="flex items-center gap-1"><XCircle size={14}/> No Spam Ever</span>
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">After submission, you'll see your personalized plan & a special offer!</p>
            </div>
        </div>
       );
    }
    
if (currentScreen === 26) { // Thank You / Offer Page (MONEY PAGE) - Final Optimized Version
  const isIndia = location === 'IN';
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <div className="max-w-4xl w-full">
        
        {/* ✅ Header Section */}
        <div className="text-center mb-10">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-extrabold text-white mb-3">
            ✅ SUCCESS! Your Free Placement Plan is On Its Way!
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
             🎉 Your personalized <span className="font-semibold text-orange-400">Career Placement Plan </span> 
                 is ready! You can download it instantly using the button below.
          </p>
        </div>

        {/* ✅ Offer Container */}
        <div className="bg-[#1e1b4b]/80 border border-[#A76EFF]/30 rounded-2xl shadow-2xl shadow-[#A76EFF]/10 mb-8 backdrop-blur-md overflow-hidden">          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#60A5FA]/90 to-[#1E3A8A]/90 p-4 text-center backdrop-blur-md rounded-t-xl shadow-lg shadow-blue-500/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white">⚡ BUT WAIT - Don't Leave Yet!</h2>
          </div>

          <div className="p-6 md:p-8">
            
            {/* Hero Comparison */}
            <div className="text-center bg-black/30 p-6 rounded-xl border border-slate-700 mb-8">
            <p className="text-white text-xl font-bold mb-4">
                DIY Job Search: <span className="text-orange-400">3–6 months</span> 😰 
                vs 
                Workshop Graduates: <span className="text-green-400">30–45 days</span> 🚀
            </p>
            
            <div className="flex items-center justify-center gap-8 mt-4 text-sm">
                <div className="text-red-400">
                <p className="font-bold mb-1">❌ Going Alone</p>
                <p className="text-slate-400">Trial & error</p>
                </div>
                <div className="text-4xl text-slate-600">→</div>
                <div className="text-green-400">
                <p className="font-bold mb-1">✅ With Workshop</p>
                <p className="text-slate-400">Proven system</p>
                </div>
            </div>
            </div>

            {/* One-Time Offer Section */}
            <div className="text-center my-8 pt-6 border-t border-slate-700">
              <h3 className="text-3xl font-bold text-yellow-300 mb-2">🔥 SPECIAL ONE-TIME OFFER</h3>
              <p className="text-slate-300 mb-2 text-lg">
                (Available for Next 15 Minutes Only!)
              </p>
              <p className="text-slate-400 text-sm mb-6">
                Since you're serious about your career (you downloaded the plan!), you've earned exclusive access to our:
              </p>
                <div className="flex justify-center">
                <h4 className="text-3xl font-bold text-white mb-2 relative">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md animate-pulse shadow-md align-middle relative -top-1">
                    LIVE
                    </span>
                    <span className=" ms-2">4-Day Career Breakthrough Workshop</span>
                </h4>
                </div>

              <p className="text-slate-300 text-lg">
                Transform Your Job Search in Just 4 Days
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold text-center text-white mb-6">🎓 Here's What You'll Master:</h4>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                {benefits.map((b) => (
                  <div key={b.title} className="bg-[#4314A0]/40 p-5 rounded-xl border border-[#A76EFF]/30 flex items-start gap-4 hover:scale-[1.02] transition-transform duration-200">
                    <b.icon className="w-8 h-8 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-white text-lg">{b.title}</h3>
                      <p className="text-sm text-slate-300">{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Suite */}
            <div className="bg-black/40 p-6 rounded-xl mb-8 border border-slate-700">
              <h4 className="text-2xl font-bold text-yellow-300 mb-4 text-center">💼 EXCLUSIVE TOOLS INCLUDED:</h4>
              <div className="grid md:grid-cols-2 gap-3 text-slate-200">
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /><span>ResumeGen.io - AI Resume Builder ({isIndia ? '₹8,000' : '$97'} value)</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /><span>ATS Checker & Optimization ({isIndia ? '₹4,000' : '$49'} value)</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /><span>50+ Professional Templates ({isIndia ? '₹6,500' : '$79'} value)</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /><span>LinkedIn Profile Optimizer ({isIndia ? '₹5,500' : '$67'} value)</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /><span>Interview Question Database ({isIndia ? '₹2,400' : '$29'} value)</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /><span>Lifetime Access to All Materials</span></div>
              </div>
              <p className="text-center text-yellow-300 font-bold text-2xl mt-4">Total Value: {isIndia ? '₹67,000' : '$818'}</p>
            </div>

            {/* ⭐ TESTIMONIALS SECTION - MOVED UP & ENHANCED */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold text-center text-yellow-300 mb-6">⭐ What Our Students Say</h4>
              
              {/* Main Featured Testimonial */}
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 md:p-5 rounded-xl border border-purple-500/30 mb-6 flex items-center gap-4 shadow-md shadow-purple-800/30">
                {/* Avatar */}
                <img
                    src="https://brainyscout.com/Content/images/avatar/04.png"
                    alt="Sarin Suresh"
                    className="w-16 h-16 rounded-full border-2 border-yellow-400 shadow-md shadow-yellow-400/20 flex-shrink-0"
                />

                {/* Text Section */}
                <div className="flex-1">
                    {/* Name + Role + Rating (Inline Compact) */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-yellow-300 font-semibold text-sm">Mandy</p>
                    <span className="text-slate-400 text-xs">| QA Analyst</span>
                    <span className="text-yellow-400 text-sm">{'⭐'.repeat(5)}</span>
                    </div>

                    {/* Quote */}
                    <p className="text-white italic text-sm leading-snug">
                    Landing an interview on the very first day with your resume was unbelievable! After 3 months of silence, Rajinder Kumar’s guidance completely transformed my job search strategy.
                    </p>
                </div>
                </div>

              {/* Secondary Testimonials Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 text-center">
                    <div className="relative border-3 border-green-400 mx-auto mb-3 overflow-hidden rounded-xl shadow-md shadow-green-400/30">
                    <video
                        className="w-full h-full object-cover rounded-xl"
                        src="https://ik.imagekit.io/brainyscout/bs_media/videos/Siddhant_BrainyScout.mp4"                        
                        loop
                        muted
                        controls
                        playsInline
                        preload="metadata"
                        poster="https://brainyscout.com/Content/images/event/Tyagi_brainyScout.png"
                    >
                        Your browser does not support the video tag.
                    </video>
                    </div>
                     <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
                    <p className="text-green-400 font-bold text-sm">Siddhant.</p>
                     <p className="text-slate-400 text-xs">| Data Analyst | </p>
                    <span className="text-yellow-400 text-sm">{'⭐'.repeat(5)}</span>
                    </div>
                </div>
                
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 text-center">
                    <div className="relative border-3 border-green-400 mx-auto mb-3 overflow-hidden rounded-xl shadow-md shadow-green-400/30">
                    <video
                        className="w-full h-full object-cover rounded-xl"
                        src="https://ik.imagekit.io/brainyscout/bs_media/videos/Eben-Success-Story.mp4"                        
                        loop
                        muted
                        controls
                        playsInline
                        preload="metadata"
                        poster="https://brainyscout.com/Content/images/event/Eben-video-thumbnail.png"
                    >
                        Your browser does not support the video tag.
                    </video>
                    </div>
                     <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
                    <p className="text-blue-400 font-bold text-sm">Eben</p>
                     <p className="text-slate-400 text-xs">| Business Analyst | </p>
                    <span className="text-yellow-400 text-sm">{'⭐'.repeat(5)}</span>
                    </div>
                </div>
              </div>
              
              <p className="text-center text-slate-300 mt-4 text-sm">
                ⭐ Rated 4.9/5 by 500+ Career Changers
              </p>
            </div>

            {/* Scarcity Elements */}
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 mb-8 text-center">
              <p className="text-slate-300 mb-2">⏰ Offer Ends In:</p>
              <p className="text-4xl font-bold text-yellow-300 mb-2"><CountdownTimer initialMinutes={15} /></p>
              <p className="text-orange-400 font-bold">🎟️ Only 23 Seats Remaining</p>
              <p className="text-xl text-white-300 mb-3">🎯 Upcoming Workshop Schedule: {getNextFriday(isIndia)}</p>
            </div>

            {/* Pricing & CTA */}
            <div className="bg-black/40 p-6 rounded-2xl border-2 border-green-500/50">
                <div className="text-center mb-6">
                    <p className="text-slate-400 line-through text-lg mb-1">Regular Price: {isIndia ? '₹49,000' : '$497'}</p>
                    <p className="text-slate-400 line-through text-xl mb-1">Early Bird Price: {isIndia ? '₹19,000' : '$297'}</p>
                    <p className="text-4xl md:text-5xl font-extrabold text-green-400 mb-2">YOUR PRICE TODAY: {isIndia ? '₹6,490' : '$189'}</p>
                    <p className="text-yellow-300 font-bold text-xl mb-3">(60% OFF)</p>
                    <p className="text-orange-400 text-lg">
                        <strong>Next Batch Starts:</strong> {getNextFriday(isIndia)}
                    </p>
                </div>

                <div className="space-y-4">
                    <a
                        href={isIndia 
                            ? "https://pages.razorpay.com/4-Day-Job-Winning-Workshop" 
                            : "https://buy.stripe.com/8wM00O5Lw34q5sk28D"
                        }
                        onClick={(e) => {
                            e.preventDefault(); // prevent immediate navigation
                            setCurrentScreen(27); // trigger your screen logic
                            // open the right payment link after short delay
                            setTimeout(() => {
                            window.open(
                                isIndia 
                                ? "https://pages.razorpay.com/4-Day-Job-Winning-Workshop" 
                                : "https://buy.stripe.com/8wM00O5Lw34q5sk28D", 
                                "_blank"
                            );
                            }, 500);
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-5 rounded-full text-xl hover:scale-105 transition-transform shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 text-center"
                        >
                        YES! I Want to Invest in Myself {isIndia ? '₹6,490' : '$189'}
                        </a>


                    {/* Avatar Group */}
                    <div>
                      <ul className="flex justify-center -space-x-3 mb-3">
                        <li><img src="https://brainyscout.com/Content/images/avatar/01.jpg" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" /></li>
                        <li><img src="https://brainyscout.com/Content/images/avatar/02.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" /></li>
                        <li><img src="https://brainyscout.com/Content/images/avatar/03.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" /></li>
                        <li><img src="https://brainyscout.com/Content/images/avatar/04.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" /></li>
                      </ul>
                    </div>

                    <p className="text-center text-slate-400 text-xs mt-2">
                      Over 15,000 professionals have joined — your seat is next.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-300 pt-2">
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-green-400" /> Money-Back Guarantee
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-400" /> Live Q&A with Career Coaches
                      </span>
                    </div>
                </div>
            </div>

            {/* 👤 Coach Profile Section */}
            <div className="flex items-center justify-center gap-4 mt-8 bg-slate-800/30 p-4 rounded-xl border border-slate-700">
              <img 
                src="https://brainyscout.com/Content/images/instructor/rajinder.png" 
                alt="Rajinder Kumar - Certified Career Coach" 
                className="w-20 h-20 rounded-full border-3 border-green-400 shadow-lg" 
              />
              <div>
                <p className="text-white font-bold text-lg">Rajinder Kumar</p>
                <p className="text-slate-400 text-sm">Certified Career Coach</p>
                <p className="text-slate-400 text-xs">20+ Years in IT Industry</p>
              </div>
            </div>

            {/* Decline Option */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentScreen(29)}
                className="w-full py-3 mt-4 rounded-xl border border-gray-500 text-slate-300 font-semibold text-sm bg-orange-700 hover:bg-slate-800 hover:text-white transition-all duration-300 shadow-md"
                >
                No Thanks, I'll Try Alone — Just Give Me the Plan
                </button>
            </div>

            {/* Expiry Note */}
            <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
              <p className="text-yellow-300 font-bold text-center mb-2">⚠️ Fair Warning:</p>
              <p className="text-slate-200 text-sm text-center">
                If you close this page, this special pricing disappears forever. The workshop will still be available, but at the regular {isIndia ? '₹20,000' : '$497'} price.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
    
    if (currentScreen === 27) { // Payment / Enrollment Confirmed
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-xl text-center bg-[#4314A0]/50 border border-[#A76EFF]/40 p-10 rounded-2xl">
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6"/>
                    <h1 className="text-4xl font-bold mb-4">🎉 You're All Set!</h1>
                        <p className="text-slate-200 text-lg mb-8">Your spot in the 4-Day Career Breakthrough Workshop is confirmed! We've sent a confirmation and calendar invite to your email.</p>
                    <div className="bg-black/30 p-6 rounded-xl text-left mb-8 space-y-2">
                        <p><span className="font-bold text-slate-300">Event:</span> 4-Day Career Breakthrough Workshop</p>
                        <p><span className="font-bold text-slate-300">Start Date:</span> Next Tuesday, 7 PM EST</p>
                        <p><span className="font-bold text-slate-300">Platform:</span> Zoom (Link in email)</p>
                        <p><span className="font-bold text-slate-300">What's Next:</span> Check your email for access details</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 mb-6">
                        <p className="text-green-400 font-bold mb-2">✅ Your Investment: {location === 'IN' ? '₹6,490' : '$189'}</p>
                        <p className="text-slate-300 text-sm">Receipt sent to your email</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
                            <Calendar size={20}/> Add to Calendar
                        </button>
                        <button className="px-8 py-3 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 transition-colors">
                            Access Workshop Portal
                        </button>
                    </div>
                    <p className="text-slate-400 text-sm mt-6">See you in the workshop! Get ready to transform your career. 🚀</p>
                </div>
            </div>
        );
    }
    
    if (currentScreen === 29) { // Declined Offer - Free Plan Only
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-xl text-center bg-[#4314A0]/50 border border-[#A76EFF]/40 p-10 rounded-2xl">
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6"/>
                    <h1 className="text-4xl font-bold mb-4">Your Plan is Ready!</h1>
                    <p className="text-slate-200 text-lg mb-6">You can download your personalized Career Placement Plan below. We've also sent a copy to your inbox. Best of luck!</p>
                    
                    <button
                        onClick={handleDownloadPlan}
                        className="bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 hover:bg-green-700 shadow-lg flex items-center gap-3 mx-auto mb-8"
                    >
                        <Download size={24} /> Download Your Plan Now
                    </button>
                    
                    <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6">
                        <p className="text-yellow-300 font-bold mb-2">💡 Changed Your Mind?</p>
                        <p className="text-slate-300 text-sm mb-4">The workshop offer is available in your email at regular pricing. Join anytime!</p>
                        <button onClick={() => setCurrentScreen(26)} className="text-orange-400 hover:text-orange-300 underline text-sm">
                            View Workshop Details Again
                        </button>
                    </div>                    
                    <p className="text-slate-400 text-sm">Good luck with your job search! 🎯</p>
                </div>
            </div>
        );
    }
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  };
  
  const questionIndex = QUESTION_SCREENS.findIndex(q => q.id === currentScreen);
  const isQuestionScreen = questionIndex !== -1;
  const currentProgress = isQuestionScreen ? ((questionIndex + 1) / totalQuestionScreens) * 100 : 0;
  
  const isInsightScreen = currentScreen > 0 && currentScreen % 2 === 0 && currentScreen <= totalQuestionScreens * 2;
  const showHeader = !isInsightScreen && currentScreen > 0 && currentScreen < 23;

  
  return (
    <div>
        {showPlanForPrint ? (
            <PlacementPlanView 
                answers={formData} 
                name={formData.fullName || 'Valued Professional'} 
                onContinue={() => {}} 
                location={location} 
                email={formData.email}            // ✅ pass email
                shouldSendToWebhook={true}        // ✅ triggers webhook when mounted
                />
        ) : (
            <>
                {showHeader && (
                    <header className="fixed top-0 left-0 right-0 bg-[#3D1A65]/95 backdrop-blur-sm px-4 py-3 z-20 border-b border-[#A76EFF]/20">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 max-w-4xl mx-auto">
                            <div className="flex items-center gap-3">
                                <img
                                src="https://brainyscout.com/Content/images/logo-light.png"
                                alt="BrainyScout Logo"
                                className="h-5 md:h-6 lg:h-7 w-auto flex-shrink-0"
                                />
                            </div>
                            <div className="w-full bg-[#4314A0] rounded-full h-2.5">
                                <div
                                    className="h-2.5 bg-gradient-to-r from-[#FF7A00] to-[#FFB84D] rounded-full"
                                    style={{ width: `${currentProgress}%`, transition: 'width 0.5s ease-out' }}
                                ></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-sm font-semibold text-orange-400 tracking-wide flex-shrink-0 w-24 text-right">
                                    Step {questionIndex + 1} of {totalQuestionScreens}
                                </p>
                            </div>
                        </div>
                    </header>
                )}
                
                <div className={showHeader ? "pt-24" : ""}>
                    {renderContent()}
                </div>
            </>
        )}
    </div>
  );
};
