import React, { useMemo } from 'react';
import { Download, ArrowRight, XCircle, CheckCircle, BarChart3, TrendingUp, Briefcase, Zap, Target, Users, Award, Star, FileText, Link, GraduationCap } from 'lucide-react';
// Note: Assuming 'Answers' type is defined elsewhere in the project environment.
// import { Answers } from '../types';

interface PlacementPlanViewProps {
  answers: any; // Using 'any' as 'Answers' type is undefined here
  name: string;
  onContinue: () => void;
  location: string;
  successProbability?: { current: number; withSystem: number }; // ✅ added
}

type PlanContent = {
  blockingPoints: { title: string; content: React.ReactNode }[];
  strengths: { title: string; content: React.ReactNode }[];
  summary: Record<string, string>;
  successProbability?: { current: number; optimized: number }; // ✅ optional now
};


// --- Sub-components for dynamic content sections (keeping original logic for brevity) ---
const SolutionPitch = () => (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm print-bg-subtle">
        <p className="font-bold text-blue-800">💡 SOLUTION:</p>
        <p className="text-blue-700">In our <strong>Job Success System Workshop</strong>, we provide proven templates, live coaching, and exclusive tools to fix this exact problem in under a week. You'll learn the strategies that get our clients hired 4x faster.</p>
    </div>
);

// BP content components (kept largely same structure)
const BP_ResumeBlackHole = () => (
    <>
        <p><strong>The Problem:</strong> You're applying to 150+ jobs with a generic, one-size-fits-all resume. This "spray and pray" approach has a success rate of less than 2%.</p>
        <p><strong>Why It's Failing YOU:</strong> 75% of resumes (including yours) are auto-rejected by Applicant Tracking Systems (ATS). For the few that pass, recruiters spend only 6-8 seconds scanning, and yours gets skipped because it doesn't speak directly to the job.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
        <ul>
            <li><strong>Create an ATS-Optimized Master Resume:</strong> Use simple formatting and exact keywords from job descriptions.</li>
            <li><strong>Switch from Volume to Strategy:</strong> Stop applying to 150 random jobs. Target 30 strategic roles and customize your resume for each (it only takes 15 min with the right system).</li>
            <li><strong>Transform Your Resume into a Storytelling Document:</strong> Lead with impact and quantified achievements, not just a list of duties.</li>
        </ul>
        <SolutionPitch />
    </>
);
const BP_InconsistentResume = () => (
    <>
        <p><strong>The Problem:</strong> You're applying to 70-150 jobs and customizing your resume "sometimes." This half-strategy is holding you back because inconsistency kills results.</p>
        <p><strong>Why It's Failing YOU:</strong> ATS systems are unforgiving—one bad resume means auto-rejection. You're competing against candidates who customize EVERY time, making your "good enough" approach result in no offers.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
        <ul>
            <li><strong>Define Your 15-Minute Customization Process:</strong> Create a system with a master resume and a keyword swap checklist to make tailoring fast and effective.</li>
            <li><strong>Stop Applying to Low-Probability Jobs:</strong> Only apply if you meet 70%+ of the requirements and prioritize companies where you have connections.</li>
             <li><strong>Track and Optimize:</strong> Monitor your application-to-response rate to see what's working and double down on that strategy.</li>
        </ul>
        <SolutionPitch />
    </>
);

const BP_HiddenResumeFormat = () => (
    <>
        <p><strong>The Problem:</strong> You're doing the right thing—customizing your resume for every job—but still not getting results. The issue is likely hidden problems you can't see.</p>
        <p><strong>Why It's Failing YOU:</strong> Your resume format might be ATS-unfriendly (graphics, tables, columns). Even with customization, you could be missing critical keywords or using weak language that doesn't highlight your impact.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
        <ul>
            <li><strong>Run Your Resume Through an ATS Checker:</strong> You must test your resume against job descriptions to see your compatibility score before you hit send.</li>
            <li><strong>Master Achievement-Based Writing:</strong> Your customization needs to highlight results, not just tasks. Use the STAR method (Situation-Task-Action-Result) for every bullet point.</li>
        </ul>
       <SolutionPitch />
    </>
);

const BP_ATSBlindSpot = () => (
    <>
        <p><strong>The Problem:</strong> You don't check your resume for ATS compatibility. This single oversight is costing you 75% of opportunities before a human ever sees your application.</p>
        <p><strong>Why It's Devastating:</strong> 90% of companies use ATS. Missing keywords or using formats it can't read (like tables, graphics, or columns) means an instant rejection, no second chances. You could be the perfect candidate, but a robot filter is blocking you.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
        <ul>
            <li><strong>Learn ATS-Friendly Formatting:</strong> Use standard fonts, standard section headings, and save as .docx unless specified otherwise.</li>
            <li><strong>Master Keyword Optimization:</strong> Mirror the language from the job description in your resume to ensure you pass the initial scan.</li>
            <li><strong>Test Every Resume Before Sending:</strong> Use an ATS checker to get a compatibility score and fix issues before you apply.</li>
        </ul>
        <SolutionPitch />
    </>
);

const BP_LinkedInInvisibility = () => (
    <>
        <p><strong>The Problem:</strong> You're not active on LinkedIn or have a small network. This makes you invisible to 70% of job opportunities found through recruiters and the hidden job market.</p>
        <p><strong>Why This Hurts:</strong> Recruiters actively search for candidates on LinkedIn. An incomplete or inactive profile means you won't show up. Furthermore, a strong network is key to getting referrals, which have a 40% higher conversion rate.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
        <ul>
            <li><strong>Optimize Your LinkedIn Profile:</strong> Transform it into a compelling story with a professional photo, a value-driven headline, and an achievement-rich summary.</li>
            <li><strong>Build Strategic Connections:</strong> Aim to get from your current number to 500+ relevant connections within 30 days using a targeted strategy.</li>
            <li><strong>Activate Your Network for Referrals:</strong> Engage with your connections' posts and learn how to ask for informational interviews and referrals effectively.</li>
        </ul>
        <SolutionPitch />
    </>
);

const BP_ApplicationBlackHole = () => (
    <>
        <p><strong>The Problem:</strong> You've applied to 50+ jobs but haven't gotten a single interview. This indicates a systematic problem, not just bad luck. Continuing to apply more will not fix a broken process.</p>
        <p><strong>Why Nothing Is Working:</strong> The most likely cause is that your resume isn't passing ATS screening. Other factors could be applying to wrong-fit roles or not leveraging networking for internal advocacy.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
        <ul>
            <li><strong>STOP applying immediately and diagnose the problem.</strong> Get an expert resume review to identify your blind spots.</li>
            <li><strong>Learn the hidden job market strategies.</strong> 80% of jobs aren't posted online. Stop fishing in the most crowded pond and learn how to find opportunities through networking.</li>
        </ul>
        <SolutionPitch />
    </>
);
const BP_InterviewConversion = () => (
    <>
        <p><strong>The Problem:</strong> You're getting interviews (which means your resume works!), but you're not converting them into offers. You're getting so close but losing at the finish line.</p>
        <p><strong>Why Interviews Aren't Converting:</strong> This usually comes down to a few key areas: a weak "Tell me about yourself" answer, rambling responses that don't follow the STAR method, not asking strategic questions, or failing to follow up effectively.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
        <ul>
            <li><strong>Master Your 2-Minute Pitch:</strong> Craft and practice a compelling story that connects your experience to the company's needs.</li>
            <li><strong>Prepare 15 STAR Stories:</strong> Have structured, quantifiable examples of your achievements ready for any behavioral question.</li>
            <li><strong>Practice Mock Interviews:</strong> You can't "wing it" and expect to beat candidates who are highly prepared. Get feedback and refine your answers.</li>
        </ul>
        <SolutionPitch />
    </>
);
// Strength content components (kept largely same structure)
const Strength_LinkedIn = () => (
    <>
        <p><strong>What You Have:</strong> You have 500+ LinkedIn connections—that's fantastic! You're in the top 30% of professionals and have access to the hidden job market where 80% of jobs are found.</p>
        <p><strong>How to WEAPONIZE This Strength:</strong></p>
        <ul>
            <li><strong>Activate Dormant Connections:</strong> Most of your network is dormant. Re-engage with your top 50 connections with personalized messages to bring your profile to the top of their feed.</li>
            <li><strong>Mine Your Network for Target Companies:</strong> Someone in your network knows someone at your target company. Use LinkedIn's search features to find 2nd-degree connections and ask for warm introductions.</li>
            <li><strong>Get Referrals, Not Just Connections:</strong> Use our proven referral request framework to turn your connections into internal advocates.</li>
        </ul>
    </>
);

const Strength_ATS = () => (
    <>
        <p><strong>What You Have:</strong> You customize your resume and understand ATS. This shows you have a strategic mindset and an attention to detail that puts you ahead of 80% of other candidates.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🎯 <strong>How to LEVERAGE This:</strong></p>
        <ul>
            <li><strong>Now Focus on Human Appeal:</strong> You're passing the robots—it's time to impress the humans. Learn what recruiters actually look at in the 6-8 seconds they scan your resume and optimize for their psychology.</li>
            <li><strong>Add Networking to Your ATS Mastery:</strong> An ATS-passing resume combined with an internal referral is an almost unstoppable combination. This is how you turn a good strategy into an offer-winning one.</li>
        </ul>
    </>
);
const Strength_Default = () => (
    <>
        <p><strong>What You Have:</strong> You completed this entire assessment, which shows grit and determination. Despite any frustration, you're still trying and still focused on your goal—this is the #1 predictor of success.</p>
        <p className="font-bold text-slate-800 text-lg mt-4">🎯 <strong>How to LEVERAGE This:</strong></p>
        <ul>
            <li><strong>Channel That Energy into Strategy:</strong> Your persistence will pay off once it's paired with a proven system. Shift from a volume-based approach to a strategic one.</li>
            <li><strong>Track What's Working:</strong> Use your determination to meticulously track your applications and double down on what gets results. Use rejection as feedback, not failure.</li>
        </ul>
    </>
);

// Helper function to generate dynamic content based on answers (simplified for this context)
const generatePlanContent = (answers: any): PlanContent => {
  const bpAdded = new Set<string>();
  let blockingPoints: { title: string; content: React.ReactNode }[] = [];
  let strengths: { title: string; content: React.ReactNode }[] = [];

  // --- Your logic (unchanged) ---
  if (answers.applications === '150+' || answers.resume_strategy === 'same') {
    blockingPoints.push({ title: "Resume Black Hole Syndrome", content: <BP_ResumeBlackHole /> });
  }
  if (answers.linkedin === 'not_active' || answers.linkedin === 'under100') {
    blockingPoints.push({ title: "LinkedIn Invisibility", content: <BP_LinkedInInvisibility /> });
  }
  if (answers.interviews === '1-2' || answers.interviews === '3-5') {
    blockingPoints.push({ title: "Interview Conversion Problem", content: <BP_InterviewConversion /> });
  }

  while (blockingPoints.length < 3) {
    if (blockingPoints.length === 0)
      blockingPoints.push({ title: "The ATS Blind Spot", content: <BP_ATSBlindSpot /> });
    else if (blockingPoints.length === 1 && !blockingPoints.some(bp => bp.title.includes('LinkedIn')))
      blockingPoints.push({ title: "LinkedIn Invisibility", content: <BP_LinkedInInvisibility /> });
    else if (blockingPoints.length === 2 && !blockingPoints.some(bp => bp.title.includes('Interview')))
      blockingPoints.push({ title: "Interview Conversion Problem", content: <BP_InterviewConversion /> });
    else break;
  }
  blockingPoints = blockingPoints.slice(0, 3);

  if (answers.linkedin && ['500+', '1000+'].includes(answers.linkedin)) {
    strengths.push({ title: "Strong LinkedIn Network", content: <Strength_LinkedIn /> });
  } else if (answers.resume_strategy === 'tailor_ats') {
    strengths.push({ title: "Attention to Detail & Technical Savvy", content: <Strength_ATS /> });
  }
  if (strengths.length === 0) {
    strengths.push({ title: "Determination & Resilience", content: <Strength_Default /> });
  }

  const summary = {
    "Career Stage": "Mid-Career (4-10 years)",
    "Primary Challenge": "Applying everywhere, hearing nothing",
    "Application Volume": "70-150 (in last 30 days)",
    "Resume Strategy": "Tailors & ATS-optimizes resume",
    "LinkedIn Presence": "100-500 connections",
    "Interview Success": "1-2 interviews",
    "Timeline Goal": "Land job within 1-3 months",
    "Salary Target": "₹20L-₹40L",
  };

  // ✅ Now return an object — successProbability optional
  return { blockingPoints, strengths, summary };
};


// --- STATIC PAGE COMPONENTS ---

const Page_SuccessProbability = ({ current, optimized }: { current: number; optimized: number }) => (
    <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3"><TrendingUp className="text-purple-600"/> YOUR SUCCESS PROBABILITY ANALYSIS</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-6 rounded-lg border border-red-300 print-bg-subtle shadow-md">
                <h3 className="font-bold text-xl text-red-700 mb-2">❌ YOUR CURRENT PATH</h3>
                <p className="text-red-600">Based on your current approach, your probability of landing a job offer is around:</p>
                <p className="text-6xl font-black text-red-500 my-4">{current}%</p>
                <p className="font-semibold text-red-700">Time to Offer: 6-9 months</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-300 print-bg-subtle shadow-md">
                <h3 className="font-bold text-xl text-green-700 mb-2">✅ OPTIMIZED PATH</h3>
                <p className="text-green-600">With a proven system and expert guidance, this increases to:</p>
                <p className="text-6xl font-black text-green-500 my-4">{optimized}%</p>
                <p className="font-semibold text-green-700">Time to Offer: 30-60 days</p>
            </div>
        </div>
        <div className="mt-8 bg-purple-50 print-bg-subtle p-6 rounded-lg border border-purple-200 shadow-inner">
            <h3 className="font-bold text-purple-800 text-xl mb-2">Reality Check:</h3>
            <p className="text-purple-700 text-lg">Hope is not a strategy. Following a proven system IS a strategy. Which path will you choose?</p>
        </div>
    </div>
);

// New component for Coach Profile and promotional links
const Page_CoachProfile = () => (
    <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3"><GraduationCap className="text-indigo-600"/> MEET YOUR COACH & RESOURCES</h2>
        
        {/* Coach Profile Section - Updated for better visuals and dark text */}
        <div className="flex flex-col md:flex-row items-center justify-start gap-6 mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-200 shadow-lg">
            <img 
              src="https://brainyscout.com/Content/images/instructor/rajinder.png" 
              alt="Rajinder Kumar - Certified Career Coach" 
              className="w-24 h-24 rounded-full border-4 border-green-500 shadow-2xl object-cover" 
            />
            <div className='flex-1'>
              <p className="text-indigo-900 font-extrabold text-2xl">Rajinder Kumar</p>
              <p className="text-indigo-700 text-md font-semibold">Certified Career Coach</p>
              <p className="text-slate-600 text-sm">20+ Years in IT Industry & Founder of BrainyScout</p>
            </div>
        </div>

        <div className="mt-8">
            <h3 className="font-bold text-xl text-slate-700 mb-4">🔗 ESSENTIAL TOOLS & RESOURCES</h3>
            <p className="text-slate-600 mb-4">We are dedicated to your success. Leverage these free tools and resources:</p>

            <div className="grid md:grid-cols-2 gap-4">
                <a href="https://resumegen.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all duration-200 shadow-md">
                    <FileText className="text-purple-600 flex-shrink-0" size={24}/>
                    <div>
                        <p className="font-bold text-purple-800">Free Resume Scan & Optimization</p>
                        <p className="text-sm text-purple-700 underline"><a href="https://resumegen.io" target="_blank" rel="noopener noreferrer">resumegen.io</a> (Get your ATS Score now!)</p>
                    </div>
                </a>
                
                <a href="https://brainyscout.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-all duration-200 shadow-md">
                    <Link className="text-indigo-600 flex-shrink-0" size={24}/>
                    <div>
                        <p className="font-bold text-indigo-800">The BrainyScout Career Platform</p>
                        <p className="text-sm text-indigo-700 underline"><a href="https://brainyscout.com/the-offer-magnet" target="_blank" rel="noopener noreferrer">brainyscout.com</a> (Access all our workshops)</p>
                    </div>
                </a>
            </div>
        </div>

    </div>
);

// Roadmap content updated
const Page_Roadmap = () => (
    <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3"><Target className="text-orange-600"/> YOUR 30-60-90 DAY ROADMAP</h2>
        <p className="text-slate-700 mb-6">This roadmap outlines the focused steps necessary to move from applicant to employed professional:</p>
        
        <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-orange-700 border-l-4 border-orange-300 pl-3 py-1">PHASE 1: Foundation & Visibility (Days 1-30)</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700 pl-4">
                <li><strong>Week 1: Strategy & Optimization:</strong> Audit and overhaul your resume using ATS technology <a href="https://resumegen.io" target="_blank" rel="noopener noreferrer">(Resumegen.io)</a> and customize a master cover letter template.</li>
                <li><strong>Week 2: Digital Presence:</strong> Fully optimize your LinkedIn profile for recruiter searchability and connection-building <a href="https://brainyscout.com" target="_blank" rel="noopener noreferrer">(BrainyScout)</a>.</li>
                <li><strong>Week 3: Targeted Outreach:</strong> Identify your top 20 target companies and find 5 key contacts at each using LinkedIn.</li>
                <li><strong>Week 4: Application Flow:</strong> Deploy the 3-Tier Application System: apply to 10 quality jobs and 5 "reach" jobs.</li>
            </ul>

            <h3 className="text-xl font-extrabold text-orange-700 border-l-4 border-orange-300 pl-3 py-1">PHASE 2: Conversion & Interview Mastery (Days 31-60)</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700 pl-4">
                <li><strong>Interview Prep:</strong> Document and master answers for the top 10 behavioral questions (STAR method).</li>
                <li><strong>Follow-up Strategy:</strong> Implement a systematic, personalized follow-up protocol after every application and interview.</li>
                <li><strong>Networking Activation:</strong> Engage with your target contacts; move conversations from informational interviews to potential referrals.</li>
            </ul>
             
            <h3 className="text-xl font-extrabold text-orange-700 border-l-4 border-orange-300 pl-3 py-1">PHASE 3: Negotiate & Close (Days 61-90)</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700 pl-4">
                <li><strong>Offer Management:</strong> Receive and evaluate initial job offers.</li>
                <li><strong>Salary Negotiation:</strong> Learn and execute negotiation strategies to maximize your total compensation package.</li>
                <li><strong>Onboarding Success:</strong> Seamlessly transition into your new role, setting yourself up for rapid success.</li>
            </ul>
        </div>
    </div>
);

// Mistakes content updated
const Page_Mistakes = () => (
    <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3">⚠️ CRITICAL MISTAKES TO AVOID</h2>
        <p className="text-slate-700 mb-6">Avoid these common pitfalls that cost professionals weeks or months in their job search:</p>
        <ul className="space-y-4 text-slate-700">
           <li className="flex items-start gap-3"><XCircle className="text-red-500 mt-1 flex-shrink-0" /><p><strong>Spray and Pray:</strong> Applying to 100+ jobs with generic resumes. This immediately flags your application as low-effort and leads to high rejection rates.</p></li>
           <li className="flex items-start gap-3"><XCircle className="text-red-500 mt-1 flex-shrink-0" /><p><strong>Ignoring ATS Compatibility:</strong> Sending a beautifully formatted resume that the Applicant Tracking System (ATS) robots cannot parse. If the ATS can't read it, HR never sees it.</p></li>
           <li className="flex items-start gap-3"><XCircle className="text-red-500 mt-1 flex-shrink-0" /><p><strong>Weak Value Proposition:</strong> Talking about your duties instead of your **achievements**. Recruiters want to know the *results* you drove, not just what you were assigned to do.</p></li>
           <li className="flex items-start gap-3"><XCircle className="text-red-500 mt-1 flex-shrink-0" /><p><strong>Passive Networking:</strong> Waiting for job postings instead of actively reaching out to people who can hire you or refer you. The best jobs are found in the hidden job market.</p></li>
           <li className="flex items-start gap-3"><XCircle className="text-red-500 mt-1 flex-shrink-0" /><p><strong>Failing to Follow Up:</strong> Lack of systematic follow-up after applications or interviews suggests low interest and professionalism.</p></li>
        </ul>
    </div>
);

// SuccessKit content updated
const Page_SuccessKit = () => (
    <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3"><Award className="text-blue-600"/> WHAT YOU NEED TO SUCCEED</h2>
        <p className="text-slate-700 mb-6">A structured system and dedicated support are the keys to a fast placement. Here are the tools and strategies we recommend:</p>
        
        <div className="space-y-6">
            <div className='bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400'>
                <h3 className="font-bold text-xl text-blue-800 flex items-center gap-2"><Briefcase size={20}/> The ATS-Optimized Resume Toolkit</h3>
                <p className="text-slate-700 mt-2">You need a resume that beats the bots (ATS) and excites the human recruiter. This includes custom templates, keyword density analysis, and quantifiable accomplishment statements (e.g., via Resumegen.io).</p>
            </div>
            <div className='bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400'>
                <h3 className="font-bold text-xl text-blue-800 flex items-center gap-2"><Users size={20}/> Proven Interview Scripts & Mock Sessions</h3>
                <p className="text-slate-700 mt-2">Stop memorizing generic answers. Master the STAR method for behavioral questions and learn advanced strategies for salary negotiation before your final round.</p>
            </div>
             <div className='bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400'>
                <h3 className="font-bold text-xl text-blue-800 flex items-center gap-2"><Link size={20}/> Networking and Referral System</h3>
                <p className="text-slate-700 mt-2">70% of jobs are found through networking. You need a system to turn cold connections into warm referrals and consistently tap into the hidden job market (BrainyScout method).</p>
            </div>
        </div>
    </div>
);


// Page_InvestmentOptions with conditional pricing logic
const Page_InvestmentOptions = ({ isIndia }: { isIndia: boolean }) => (
     <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3"><Zap className="text-orange-600"/> YOUR NEXT STEP: THE SUCCESS SYSTEM</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="border p-6 rounded-xl shadow-md bg-slate-50">
                <h3 className="font-bold text-xl text-slate-700 mb-2">PATH 1: DIY (Do It Yourself)</h3>
                <p className='text-slate-600 mt-2'><strong>Investment:</strong> $0 (just your time)</p>
                <p className='text-slate-600'><strong>Timeline:</strong> 6-9 months</p>
                <p className='text-slate-600'><strong>Success Rate:</strong> 15-25%</p>
                 <p className="mt-3 text-sm text-slate-500">The slow path. Most professionals waste months and confidence here.</p>
            </div>
             <div className="border-4 border-orange-500 p-6 rounded-xl bg-orange-50 print-bg-subtle ring-4 ring-orange-500/20 shadow-2xl transform scale-105">
                <h3 className="font-extrabold text-2xl text-orange-800 mb-4 flex items-center gap-2">PATH 2: The Job Success System</h3>
                
                {/* Conditional Pricing Logic */}
                <div className="mb-4">
                    {isIndia ? (
                        <>
                            <p className="text-2xl text-slate-700 font-semibold">Value: <span className="text-red-500 line-through">₹20,000</span></p>
                            <p className="text-5xl font-black text-orange-600 mt-1">₹6,490</p>
                            <p className="text-xl font-extrabold text-green-700 mt-1 bg-green-200 inline-block px-3 py-1 rounded-full shadow-lg">Current Special Offer: FREE</p>
                            <p className='mt-3 text-orange-900 font-semibold'><strong>Timeline:</strong> 30-60 days</p>
                            <p className='text-orange-900 font-semibold'><strong>Success Rate:</strong> 90%+ </p>
                            <p className="mt-4 text-sm text-orange-700 font-bold">This is the proven system for fast, high-quality job offers.</p>
                            <p className="mt-4">
                                <a href="https://pages.razorpay.com/4-Day-Job-Winning-Workshop"
                                    className="block bg-green-500 text-white font-bold py-2 px-4 rounded text-center"
                                    target="_blank" rel="noopener noreferrer">
                                    YES! Enroll Me in Workshop
                                </a>
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl text-slate-700 font-semibold">Value: <span className="text-red-500 line-through">$1028</span></p>
                            <p className="text-5xl font-black text-orange-600 mt-1">$189</p>
                            <p className="text-xl font-extrabold text-green-700 mt-1 bg-green-200 inline-block px-3 py-1 rounded-full shadow-lg">Current Special Offer: FREE</p>
                            <p className='mt-3 text-orange-900 font-semibold'><strong>Timeline:</strong> 30-60 days</p>
                            <p className='text-orange-900 font-semibold'><strong>Success Rate:</strong> 90%+ </p>
                            <p className="mt-4 text-sm text-orange-700 font-bold">This is the proven system for fast, high-quality job offers.</p>
                            <p className="mt-4">
                                <a href="https://buy.stripe.com/8wM00O5Lw34q5sk28D"
                                    className="block bg-green-500 text-white font-bold py-2 px-4 rounded text-center"
                                    target="_blank" rel="noopener noreferrer">
                                    YES! Enroll Me in Workshop
                                </a>
                            </p>
                            
                        </>
                    )}
                </div>

                 
            </div>
        </div>
         <div className="mt-8 bg-slate-50 print-bg-subtle p-6 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg mb-2">The ROI Math:</h3>
            <p className="text-slate-700 text-lg">
                Your future self will thank you for choosing the faster path. Stop wasting time and start winning offers.
            </p>
        </div>
    </div>
);
const Page_SuccessStories = () => (
    <div className="print-page bg-white rounded-lg shadow-2xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">🏆 REAL PEOPLE, REAL RESULTS</h2>
        <div className="space-y-6">
            <div className="bg-slate-50 print-bg-subtle p-4 rounded-lg">
                <p className="italic text-slate-600">"I was doing everything wrong. Generic resume, no networking, terrible interviews. The Job Success System showed me exactly what to fix. I had 3 offers in ONE week. Life-changing!"</p>
                <p className="font-bold text-right text-slate-700 mt-2">- RISHABH K., Software Engineer</p>
                <p className="font-semibold text-right text-green-600">Salary Jump: $75K → $105K (+40%)</p>
            </div>
            <div className="bg-slate-50 print-bg-subtle p-4 rounded-lg">
                <p className="italic text-slate-600">"I had a 2-year career gap and zero confidence. The workshop not only gave me a strategy but the support I needed. I landed my dream role at a Fortune 500 company in just 6 weeks."</p>
                <p className="font-bold text-right text-slate-700 mt-2">- PRIYA M., Marketing Manager</p>
                <p className="font-semibold text-right text-green-600">Landed First 6-Figure Role</p>
            </div>
        </div>
    </div>
);

export const PlacementPlanView: React.FC<PlacementPlanViewProps> = ({ answers, name, onContinue, location, successProbability }) => {

    const planData = useMemo(() => generatePlanContent(answers), [answers]);
    const finalSuccessProbability = successProbability || planData.successProbability || { current: 35, optimized: 90 };
    const firstName = name ? name.split(' ')[0] : 'there';
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const isIndia = location === 'IN';
    // Dynamic value based on location for the welcome letter
    const planValue = isIndia ? '₹6490' : '$189';
    const PplanValue = isIndia ? '₹2490' : '$49';

    return (
        // Main container adjusted for better visual appeal, using a deep purple gradient with dark text.
        <div className="bg-gradient-to-b from-indigo-900 via-gray-900 to-purple-900 p-4 md:p-8 min-h-screen font-sans text-gray-800 print-container">
            
            {/* Fixed Buttons for Online View */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-4 no-print">
                <button
                    onClick={() => {
                        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        if (isMobile) {
                        alert("Please open this page on a laptop or desktop to download your PDF plan.");
                        } else {
                        window.print();
                        }
                    }}
                    className="bg-green-500 text-white font-bold py-3 px-5 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-2xl flex items-center gap-2 border-2 border-green-300"
                    >
                    <Download size={20} /> Download PDF
                    </button>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* PAGE 1: COVER PAGE - Added user details */}
                <div className="print-page bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center text-center p-8 h-[90vh] border-4 border-indigo-200/50">
                    <img src="https://brainyscout.com/Content/images/logo-dark.png" alt="BrainyScout Logo" className="h-10 w-auto mb-12"/>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mt-12 mb-4">YOUR PERSONALIZED CAREER</h1>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-purple-600 mb-12">PLACEMENT PLAN</h1>
                    
                    <div className="bg-indigo-50 p-6 rounded-xl shadow-lg border-l-4 border-purple-500 max-w-sm w-full">
                        <p className="text-xl font-semibold text-slate-700">Prepared For:</p>
                        <p className="text-3xl font-extrabold text-indigo-900 mt-1 mb-2">{name || 'Valued Professional'}</p>
                        <p className="text-slate-600">Location: <span className="font-semibold">{location}</span> | Date: {currentDate}</p>
                    </div>

                    <div className="mt-auto pt-12">
                         <p className="text-2xl font-semibold text-slate-700 italic">"Your Roadmap to Landing Your Dream Job in 45 Days"</p>
                         <p className="text-sm text-slate-500 mt-4">Powered by <a href="https://brainyscout.com">www.brainyScout.com</a></p>
                    </div>
                </div>

                {/* PAGE 2: WELCOME LETTER - Plan value updated */}
                <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">Dear {firstName},</h2>
                    <div className="space-y-4 text-slate-700 text-lg leading-relaxed">
                        <p>Congratulations on taking the first step toward transforming your career!</p>
                        <p>Based on your responses to our comprehensive career assessment, we've created this personalized placement plan specifically for <b>YOU</b>.</p>
                        <p>This isn't a generic report. Every insight, recommendation, and action step in this document is tailored to your unique situation, challenges, and goals.</p>
                        <p className="font-semibold text-slate-800">Inside, you'll discover:</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>Your Top {planData.blockingPoints.length} Career Blocking Points (and how to fix them)</li>
                            <li>Your Hidden Strengths (and how to leverage them)</li>
                            <li>Your Personalized 30-60-90 Day Roadmap</li>
                        </ul>
                        <p>This plan is typically valued at <b>{PplanValue}</b>—but you're getting it as a complimentary service today.</p>
                        <p className="font-bold text-lg text-purple-700">Here's my promise: If you implement even 50% of what's in this plan, you WILL see results within 30 days.</p>
                        <p>Let's get you that dream job!</p>
                    </div>
                     <div className="mt-8 pt-6 border-t">                       
                        <img 
                        src="https://brainyscout.com/Content/images/instructor/rajinder.png" 
                        alt="Rajinder Kumar - Certified Career Coach" 
                        className="w-16 h-16 rounded-full border-4 border-green-500 shadow-2xl object-cover" 
                        />
                        <div className='flex-1'>
                        <p className="text-indigo-900 font-extrabold text-2xl">Rajinder Kumar</p>
                        <p className="text-indigo-700 text-md font-semibold">Certified Career Coach</p>
                        <p className="text-slate-600 text-sm">20+ Years in IT Industry & Co-Founder of BrainyScout</p>
                        </div>
                    </div>
                </div>

                {/* PAGE 3: SUMMARY */}
                <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3"><BarChart3 className="text-slate-600"/> YOUR CAREER PROFILE AT A GLANCE</h2>
                    <p className="mb-6 text-slate-600">Based on your assessment, here is a snapshot of your career situation:</p>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 bg-slate-50 print-bg-subtle p-6 rounded-xl shadow-inner">
                        {Object.entries(planData.summary).map(([key, value]) => (
                             <div key={key} className='border-l-4 border-purple-300 pl-3'>
                                <p className="text-sm text-purple-500 font-semibold uppercase">{key}</p>
                                <p className="text-lg text-slate-800 font-bold">{value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 bg-purple-100 print-bg-subtle p-6 rounded-xl border border-purple-300 shadow-md">
                        <h3 className="font-bold text-purple-800 text-lg mb-2">Key Insight:</h3>
                        <p className="text-purple-700 text-lg">You have the talent and drive—but your strategy is working against you, not for you.
                        <strong>This is 100% fixable.</strong></p>
                    </div>
                </div>               

                {/* PAGE 4: BLOCKING POINTS */}
                <div className="print-page bg-white rounded-lg shadow-2xl p-8 md:p-12 break-after-page break-inside-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
                    <XCircle className="text-red-500" /> WHAT'S HOLDING YOU BACK
                </h2>

                <p className="mb-6 text-slate-600">
                    Based on your responses, here are the TOP {planData.blockingPoints.length} factors blocking your job search success:
                </p>

                <div className="space-y-8">
                    {planData.blockingPoints.map((bp, index) => (
                    <div key={index} className="break-inside-avoid">
                        <h3 className="font-bold text-xl text-red-600 mb-2">
                        🚫 BLOCKING POINT #{index + 1}: {bp.title}
                        </h3>
                        <div className="prose prose-slate max-w-none text-slate-700">{bp.content}</div>
                    </div>
                    ))}

                </div>
                </div>

                 {/* PAGE 5: STRENGTHS */}
                <div className="print-page bg-white rounded-xl shadow-xl p-8 md:p-12 border border-gray-100 break-before-page">
                     <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-3"><CheckCircle className="text-green-500"/> WHAT'S WORKING IN YOUR FAVOR</h2>
                     <p className="mb-6 text-slate-600">You're not starting from zero. Here's what you're doing RIGHT:</p>
                      <div className="space-y-8">
                        {planData.strengths.map((s, index) => (
                           <div key={index} className='p-4 border-b border-green-100'>
                               <h3 className="font-bold text-xl text-green-600 mb-2">💪 STRENGTH #{index + 1}: {s.title}</h3>
                               <div className="prose prose-slate max-w-none text-slate-700">{s.content}</div>
                           </div>
                        ))}
                     </div>
                </div>
                
                 {/* PAGE 6: Success Probability */}
                 <Page_SuccessProbability current={finalSuccessProbability.current} optimized={finalSuccessProbability.withSystem || finalSuccessProbability.optimized} />
                 
                 {/* PAGE 7: Coach Profile and Resources (New Page) */}
                 <Page_CoachProfile />

                 {/* PAGE 8: Roadmap - Content added */}
                 <Page_Roadmap />

                 {/* PAGE 9: Mistakes - Content added */}
                 <Page_Mistakes />
                 
                 {/* PAGE 10: Success Kit - Content added */}
                 <Page_SuccessKit />

                 {/* PAGE 11: Investment Options - Pricing logic confirmed and kept */}
                 <Page_InvestmentOptions isIndia={isIndia} />

                 {/* PAGE 12: Success Stories */}
                 <Page_SuccessStories />
                
            </div>
        </div>
        
    );
};

// Required for the component to be callable in the environment
export default PlacementPlanView;