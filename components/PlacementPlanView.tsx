import React, { useMemo } from 'react';
import html2pdf from "html2pdf.js";
import { useEffect } from "react"; // ✅ ensure you have this import at top
import { Download, ArrowRight, XCircle, CheckCircle, BarChart3, TrendingUp, Briefcase, Zap, Target, Users, Award, Star, FileText, Link, GraduationCap } from 'lucide-react';
// Note: Assuming 'Answers' type is defined elsewhere in the project environment.
// import { Answers } from '../types';

interface PlacementPlanViewProps {
  answers: any;
  name: string;
  onContinue: () => void;
  location: string;
  email?: string;
  successProbability?: { current: number; withSystem: number };
  shouldSendToWebhook?: boolean; // ✅ new
}

type PlanContent = {
  blockingPoints: { title: string; content: React.ReactNode }[];
  strengths: { title: string; content: React.ReactNode }[];
  summary: Record<string, string>;
  successProbability?: { current: number; optimized: number }; // ✅ optional now
};

        export const PlacementPlanView: React.FC<PlacementPlanViewProps> = ({
        answers,
        name,
        onContinue,
        location: userLocation, // ✅ alias avoids global conflict
        successProbability,
        email,
        shouldSendToWebhook
        }) => {
        const normalizedAnswers = useMemo(
            () =>
            Object.fromEntries(
                Object.entries(answers || {}).map(([k, v]) => [
                k.replace(/^q\d+_/, "")
                    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
                    .toLowerCase(),
                v,
                ])
            ),
            [answers]
        );

        const userEmail = email || answers?.email || "unknown@example.com";
        const planData = useMemo(() => generatePlanContent(normalizedAnswers, userLocation), [normalizedAnswers, userLocation]);
        const finalSuccessProbability = successProbability || planData.successProbability || { current: 35, optimized: 90 };
        const firstName = name ? name.split(" ")[0] : "there";
        const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const isIndia = userLocation === "IN";


    useEffect(() => {
    if (!shouldSendToWebhook) return; // Only trigger when flagged true

    const sendPDFToWebhook = async () => {
        try {
        const element = document.querySelector(".print-container") as HTMLElement;
        if (!element) {
            console.warn("⚠️ No print-container found for PDF generation");
            return;
        }

        const html2pdfLib = await import("html2pdf.js");
        const opt = {
            margin: 0.5,
            filename: "Career-Placement-Plan.pdf",
            image: { type: "jpeg" as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const },
        };

        const pdfBlob = await html2pdfLib.default().set(opt).from(element).outputPdf("blob");

        const webhookUrl = "https://hook.us2.make.com/c6yh9h0lq58aca3iwp42uk7fu8b37rey";
        const formData = new FormData();
        formData.append("email", email || "unknown@example.com");
        formData.append("location", userLocation);
        formData.append("file", pdfBlob, "Career-Placement-Plan.pdf");

        await fetch(webhookUrl, {
            method: "POST",
            body: formData,
            mode: "no-cors", // Required for local development
        });

        console.log("✅ PDF successfully sent to Make webhook!");
        } catch (err) {
        console.error("❌ Failed to send PDF to webhook:", err);
        }
    };

    const timer = setTimeout(sendPDFToWebhook, 2000);
    return () => clearTimeout(timer);
    }, [shouldSendToWebhook, email, location]);

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
    const element = document.querySelector(".print-container") as HTMLElement;

    const opt = {
      margin: 0.5,
      filename: "Career-Placement-Plan.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const },
    };

    if (!element) {
      alert("PDF content not found — please try again.");
      return;
    }

    // 🖨️ Only handle download/print, no webhook call
    if (isMobile) {
      import("html2pdf.js").then((html2pdf) => {
        html2pdf.default().set(opt).from(element).save();
      });
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
                    <img src="https://www.brainyscout.com/Content/images/logo.png" alt="BrainyScout Logo" className="h-10 w-auto mb-4"/>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mt-12 mb-4">YOUR PERSONALIZED CAREER</h1>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-purple-600 mb-12">PLACEMENT PLAN</h1>
                    
                    <div className="bg-indigo-50 p-6 rounded-xl shadow-lg border-l-4 border-purple-500 max-w-sm w-full">
                        <p className="text-xl font-semibold text-slate-700">Prepared For:</p>
                        <p className="text-3xl font-extrabold text-indigo-900 mt-1 mb-2">{name || 'Valued Professional'}</p>
                        <p className="text-slate-600">Date: {currentDate}</p>
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


// --- Sub-components for dynamic content sections (keeping original logic for brevity) ---
const SolutionPitch = ({ type }: { type: "resume" | "linkedin" | "interview" | "default" }) => {
  const messages = {
    resume: `In our Job Success System Workshop, you’ll get ATS-friendly resume templates, keyword tools, and expert feedback to fix these exact resume blind spots in under a week.`,
    linkedin: `Inside the Workshop, you’ll learn how to turn your LinkedIn into a magnet for recruiters — from profile optimization to referral messaging scripts.`,
    interview: `We guide you through mock interviews, STAR storytelling, and confidence training so you convert interviews into offers consistently.`,
    default: `In our Job Success System Workshop, we give you personalized templates, coaching, and proven systems to fix these career roadblocks fast.`,
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm print-bg-subtle">
      <p className="font-bold text-blue-800">💡 SOLUTION:</p>
      <p className="text-blue-700">{messages[type] || messages.default}</p>
    </div>
  );
};

// BP content components (kept largely same structure)
// each BP now accepts props so we can show the user's chosen option dynamically
const BP_ResumeBlackHole = ({ appsLabel }: { appsLabel: string }) => (
  <>
    <p>
      <strong>The Problem:</strong> You're applying to <strong>{appsLabel}</strong> jobs
      with a generic, one-size-fits-all resume. This "spray and pray" approach has a very low success rate.
    </p>
    <p>
      <strong>Why It's Failing YOU:</strong> Many resumes are auto-rejected by Applicant Tracking Systems (ATS).
      Even when a resume passes the bot, recruiters spend only a few seconds scanning — if your resume doesn't
      speak directly to the role, it gets skipped.
    </p>
    <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
    <ul>
      <li><strong>Create an ATS-Optimized Master Resume:</strong> Use simple formatting and exact keywords from job descriptions.</li>
      <li><strong>Switch from Volume to Strategy:</strong> Instead of sending many generic applications, target ~30 strategic roles and customize each resume (it only takes ~15 minutes with the right system).</li>
      <li><strong>Transform Your Resume into a Storytelling Document:</strong> Lead with impact and quantified achievements, not tasks.</li>
    </ul>
    <SolutionPitch type="resume" />
  </>
);

const BP_InconsistentResume = ({ appsLabel }: { appsLabel: string }) => (
  <>
    <p><strong>The Problem:</strong> You sometimes customize your resume but not consistently. When you apply to <strong>{appsLabel}</strong> roles inconsistently, results drop.</p>
    <p><strong>Why It's Failing YOU:</strong> ATS and hiring managers prefer consistency — inconsistent tailoring reduces your chance to get noticed.</p>
    <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
    <ul>
      <li><strong>Define a 15-minute customization process:</strong> Create a master resume and a keyword-swap checklist to make tailoring fast and repeatable.</li>
      <li><strong>Apply selectively:</strong> Prioritize roles where you meet ~70%+ of requirements and where you can use referrals.</li>
      <li><strong>Track & iterate:</strong> Measure application → reply rate and double down on what works.</li>
    </ul>
    <SolutionPitch type="resume" />
  </>
);

const BP_HiddenResumeFormat = ({ appsLabel }: { appsLabel: string }) => (
  <>
    <p><strong>The Problem:</strong> You're customizing but still not getting results. Even applying to <strong>{appsLabel}</strong> jobs won't help if your resume format hides your value.</p>
    <p><strong>Why It's Failing YOU:</strong> Visual formatting (tables, graphics, columns) or missing keywords can make a resume unreadable for ATS or confusing for recruiters.</p>
    <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
    <ul>
      <li><strong>Run an ATS check:</strong> Test your resume against target job descriptions and fix compatibility issues.</li>
      <li><strong>Rewrite bullets with impact:</strong> Use the STAR approach and measurable results for each role.</li>
    </ul>
    <SolutionPitch type="resume" />
  </>
);

const BP_ATSBlindSpot = ({ appsLabel }: { appsLabel: string }) => (
  <>
    <p><strong>The Problem:</strong> You may not be checking your resume for ATS compatibility — this can block candidates applying to <strong>{appsLabel}</strong> roles before a human ever sees them.</p>
    <p><strong>Why It's Devastating:</strong> Many companies use ATS. Missing keywords or unreadable formats mean immediate rejection.</p>
    <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
    <ul>
      <li><strong>Use ATS-friendly formatting:</strong> Standard fonts, headings, and .docx unless otherwise asked.</li>
      <li><strong>Mirror job language:</strong> Match keywords and phrasing from the description.</li>
      <li><strong>Test every resume:</strong> Fix issues before applying.</li>
    </ul>
    <SolutionPitch type="resume" />
  </>
);

const BP_ApplicationBlackHole = ({ appsLabel }: { appsLabel: string }) => (
  <>
    <p><strong>The Problem:</strong> You've applied to <strong>{appsLabel}</strong> jobs but received few/no interviews — this points to a systematic problem rather than bad luck.</p>
    <p><strong>Why Nothing Is Working:</strong> Common causes include ATS failure, poor targeting, or not leveraging networking and referrals.</p>
    <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
    <ul>
      <li><strong>Pause bulk applications:</strong> Diagnose by testing a small batch of highly targeted applications.</li>
      <li><strong>Get an expert review:</strong> Check ATS compatibility and message/keyword alignment.</li>
      <li><strong>Activate networking:</strong> Target referrals and informational chats instead of posting blind applications.</li>
    </ul>
    <SolutionPitch type="resume" />
  </>
);

const BP_InterviewConversion = ({ appsLabel }: { appsLabel: string }) => (
  <>
    <p><strong>The Problem:</strong> You're getting interviews around your applications to <strong>{appsLabel}</strong> roles but not converting them into offers.</p>
    <p><strong>Why Interviews Aren't Converting:</strong> Often due to weak storytelling, lack of structured STAR answers, or not asking strategic questions.</p>
    <p className="font-bold text-slate-800 text-lg mt-4">🔧 <strong>What You MUST Do to Fix This:</strong></p>
    <ul>
      <li><strong>Master a 2-minute pitch:</strong> Clear, compelling connection between your experience and the role.</li>
      <li><strong>Prepare STAR stories:</strong> Have measurable examples for core competencies.</li>
      <li><strong>Mock interviews:</strong> Practice with feedback.</li>
    </ul>
    <SolutionPitch type="interview" />
  </>
);
const BP_LinkedInInvisibility = ({ linkedinLabel }: { linkedinLabel?: string }) => (
  <>
    <p>
      <strong>The Problem:</strong> Your LinkedIn profile shows{" "}
      <strong>{linkedinLabel || "low activity"}</strong> and limited networking — this keeps you hidden from recruiters.
    </p>
    <p>
      <strong>Why This Hurts:</strong> Over 70% of jobs are found through recruiters or referrals on LinkedIn. 
      Without a visible and active profile, you're missing opportunities daily.
    </p>

    <p className="font-bold text-slate-800 text-lg mt-4">
      🔧 <strong>What You MUST Do to Fix This:</strong>
    </p>
    <ul>
      <li><strong>Optimize Your Profile:</strong> Use a professional photo, add a compelling headline, and write a results-driven “About” section.</li>
      <li><strong>Grow Strategically:</strong> Add 20–30 new relevant professionals weekly until you reach 500+ connections.</li>
      <li><strong>Engage Weekly:</strong> Comment, post insights, and interact with industry discussions to stay visible.</li>
    </ul>

    <SolutionPitch type="linkedin" />
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
// ✅ FIXED DISPLAY TEXT MAPPER — ensures user's answers show correctly
const getDisplayText = (key: string, value: any) => {
  if (!value) return "Not specified";

  const map: Record<string, Record<string, string>> = {
    experience: {
      fresher: "Fresher (0–1 year)",
      early: "Early Career (0–3 years)",
      mid: "Mid-Career (4–10 years)",
      senior: "Senior Professional (10+ years)",
      changer: "Career Changer / Transitioning",
    },
    challenge: {
      no_calls: "Applying everywhere, hearing nothing back",
      resume_rejection: "Resume getting rejected by ATS",
      interview_rejection: "Getting interviews but no offers",
      clarity: "Need clarity on the right direction",
      change: "Want to change careers but feel stuck",
    },
    applications: {
      under10: "Less than 10 applications",
      "0-20": "0–20 applications (Low Activity)",
      "20-70": "20–70 applications (Moderate Activity)",
      "70-150": "70–150 applications (High Activity)",
      "150+": "150+ applications (Spray & Pray)",
    },
    resume_strategy: {
      same: "Using the same resume everywhere",
      tweaks: "Minor tweaks for each job",
      tailor_ats: "Tailored and ATS-Optimized Resume",
      tailor_no_ats: "Customized, but not ATS checked",
      ats_optimized: "ATS Optimized Resume",
    },
    linkedin: {
      not_active: "Not active on LinkedIn",
      under100: "Under 100 connections",
      "100-500": "100–500 connections",
      "500+": "500+ connections",
      "1000+": "1000+ connections",
    },
    interviews: {
      none: "No interviews yet",
      "1-2": "1–2 interviews so far",
      "3-5": "3–5 interviews so far",
      interviewing: "Currently interviewing",
      offers: "Received offers",
    },
    urgency: {
      asap: "ASAP – within 30 days",
      "1-3": "Within 1–3 months",
      "3-6": "Within 3–6 months",
      exploring: "Just exploring for now",
    },
  };

  return map[key]?.[value] || value;
};


// Helper function to generate dynamic content based on answers (simplified for this context)
const generatePlanContent = (answers: any, userLocation: string): PlanContent => {
  const bpAdded = new Set<string>();
  let blockingPoints: { title: string; content: React.ReactNode }[] = [];
  let strengths: { title: string; content: React.ReactNode }[] = [];
  // human-friendly label for applications
const formatApplicationsLabel = (val?: string) => {
  if (!val) return "multiple";
  switch (val) {
    case "under10": return "under 10";
    case "10-30": return "10–30";
    case "30-70": return "30–70";
    case "70-150": return "70–150";
    case "150+": return "150+";
    case "0-20": return "0–20";
    default: return String(val);
  }
};


  // --- 1️⃣ Alias mapping: handles alternate or camelCase keys ---
// --- 1️⃣ Normalize Aliases ---
const a = {
  ...answers,
  challenge: answers.challenge || answers.primary_challenge,
  applications: answers.applications || answers.application_volume,
  resume_strategy: answers.resume_strategy || answers.resumeStrategy,
  linkedin: answers.linkedin || answers.linkedin_presence,
  interviews: answers.interviews || answers.interview_count,
  timeline: answers.timeline || answers.timeline_goal,
  career_stage: answers.career_stage || answers.careerStage,
  salary: answers.salary,
};

const appsLabel = formatApplicationsLabel(a.applications);

// --- Blocking Points Logic (replace existing pushes) ---
if (a.resume_strategy === "same" || a.applications === "150+") {
  blockingPoints.push({ title: "Resume Black Hole Syndrome", content: <BP_ResumeBlackHole appsLabel={appsLabel} /> });
} else if (a.resume_strategy === "minor_tweaks" || a.resume_strategy === "partial") {
  blockingPoints.push({ title: "Inconsistent Resume Strategy", content: <BP_InconsistentResume appsLabel={appsLabel} /> });
} else if (a.resume_strategy === "tailor_ats" || a.resume_strategy === "custom_no_ats") {
  blockingPoints.push({ title: "Hidden Resume Format Issues", content: <BP_HiddenResumeFormat appsLabel={appsLabel} /> });
}

const linkedinLabel =
  a.linkedin === "not_active"
    ? "inactive status"
    : a.linkedin === "under100"
    ? "under 100 connections"
    : "limited engagement";

if (a.linkedin === "not_active" || a.linkedin === "under100") {
  blockingPoints.push({
    title: "LinkedIn Invisibility",
    content: <BP_LinkedInInvisibility linkedinLabel={linkedinLabel} />,
  });
}

if (["none", "under10"].includes(a.interviews) && ["10-30", "30-70"].includes(a.applications)) {
  blockingPoints.push({ title: "Application Targeting Problem", content: <BP_ApplicationBlackHole appsLabel={appsLabel} /> });
} else if (["3-5", "offers", "interviewing"].includes(a.interviews)) {
  blockingPoints.push({ title: "Interview Conversion Problem", content: <BP_InterviewConversion appsLabel={appsLabel} /> });
}

// --- 3️⃣ Fallback if No Personal Blocking Points Found ---
if (blockingPoints.length === 0) {
  // No personal blockers found
  blockingPoints.push({
    title: "Hidden Resume Optimization Gaps",
    content: (
      <>
        <p><strong>The Insight:</strong> Even strong resumes often fail due to missing keywords, weak formatting, or vague achievements.</p>
        <p><strong>What to Do:</strong> Run an ATS compatibility check and rewrite key bullet points with measurable results. Small changes can boost responses by 50%.</p>
        <SolutionPitch type="resume" />
      </>
    ),
  });
  blockingPoints.push({
    title: "Networking Opportunity Missed",
    content: (
      <>
        <p><strong>The Insight:</strong> Over 70% of job offers come through referrals or LinkedIn connections — not job portals.</p>
        <p><strong>What to Do:</strong> Identify 10 professionals in your field and start short, informational chats to build referral opportunities.</p>
        <SolutionPitch type="linkedin" />
      </>
    ),
  });
} else if (blockingPoints.length === 1) {
  // Only one blocker found → add a smart companion insight
  const primary = blockingPoints[0].title.toLowerCase();

  if (primary.includes("resume")) {
    blockingPoints.push({
      title: "Networking Opportunity Missed",
      content: (
        <>
          <p><strong>The Insight:</strong> Even with a strong resume, lack of network visibility slows results.</p>
          <p><strong>What to Do:</strong> Engage actively on LinkedIn, post once a week, and connect with 5 recruiters in your target field.</p>
          <SolutionPitch type="linkedin" />
        </>
      ),
    });
  } else if (primary.includes("linkedin")) {
    blockingPoints.push({
      title: "Hidden Resume Optimization Gaps",
      content: (
        <>
          <p><strong>The Insight:</strong> LinkedIn visibility helps — but without an ATS-optimized resume, many opportunities are still missed.</p>
          <p><strong>What to Do:</strong> Use a resume scan to identify missing keywords and fix your format for higher compatibility.</p>
          <SolutionPitch type="linkedin" />
        </>
      ),
    });
  } else {
    blockingPoints.push({
      title: "ATS Optimization Opportunity",
      content: (
        <>
          <p><strong>The Insight:</strong> Your approach is solid, but your resume may not be fully optimized for automated systems.</p>
          <p><strong>What to Do:</strong> Test your resume through an ATS checker to raise visibility by 2x.</p>
          <SolutionPitch type="resume" />
        </>
      ),
    });
  }
}

// ✅ Clean duplicates and limit to 3 total
blockingPoints = [
  ...new Map(blockingPoints.map(bp => [bp.title, bp])).values(),
].slice(0, 3);


// --- 4️⃣ Strengths Logic ---
if (a.linkedin && ["500+", "1000+"].includes(a.linkedin)) {
  strengths.push({
    title: "Strong LinkedIn Network",
    content: <Strength_LinkedIn />,
  });
} else if (a.resume_strategy === "tailor_ats") {
  strengths.push({
    title: "Attention to Detail & Technical Savvy",
    content: <Strength_ATS />,
  });
}

if (strengths.length === 0) {
  strengths.push({
    title: "Determination & Resilience",
    content: <Strength_Default />,
  });
}

  // --- 4️⃣ Summary Section (uses aliased `a`) ---
  const summary = {
  "Career Stage": getDisplayText("experience", a.experience),
  "Primary Challenge": getDisplayText("challenge", a.challenge),
  "Application Volume": getDisplayText("applications", a.applications),
  "Resume Strategy": getDisplayText("resume_strategy", a.resume_strategy),
  "LinkedIn Presence": getDisplayText("linkedin", a.linkedin),
  "Interview Success": getDisplayText("interviews", a.interviews),
  "Timeline Goal": getDisplayText("urgency", a.urgency),
  "Salary Target":
    userLocation === "IN"
      ? a.salary === "3-8L"
        ? "₹3L – ₹8L"
        : a.salary === "8-20L"
        ? "₹8L – ₹20L"
        : a.salary === "20-40L"
        ? "₹20L – ₹40L"
        : a.salary === "40L+"
        ? "₹40L+"
        : "Not specified"
      : a.salary === "50-80k"
      ? "$50K – $80K"
      : a.salary === "80-120k"
      ? "$80K – $120K"
      : a.salary === "120-180k"
      ? "$120K – $180K"
      : a.salary === "180k+"
      ? "$180K+"
      : "Not specified",
};


  // ✅ Return final structured data
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
                <h3 className="font-bold text-xl text-blue-800 flex items-center gap-2"><Briefcase size={20}/> The ATS-Optimized Resume Toolkit <a href="https://resumegen.io" target="_blank" rel="noopener noreferrer"> [ResumeGen.io]</a></h3>
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
                            <p className="text-5xl font-black mt-1">₹6,490</p>
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

// Required for the component to be callable in the environment
export default PlacementPlanView;