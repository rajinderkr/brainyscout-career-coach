import React, { useState, useEffect } from 'react';
import { AdminView } from './components/AdminView';
import { UserView } from './components/UserView';
import { Question, Submission, Answers } from './types';
import { INITIAL_QUESTIONS } from './constants';

const ADMIN_KEY = "rajAdmin123";

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('careerCoachQuestions');
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const saved = localStorage.getItem('careerCoachSubmissions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ✅ Detect adminRaj and handle password logic
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();

    if (path.endsWith("/adminraj")) {
      // If already authenticated once, skip password
      const hasAccess = localStorage.getItem("isAdminAccessGranted");

      if (hasAccess === "true") {
        setIsAdminView(true);
      } else {
        const key = prompt("Enter Admin Access Key:");
        if (key === ADMIN_KEY) {
          localStorage.setItem("isAdminAccessGranted", "true");
          setIsAdminView(true);
        } else {
          alert("Access Denied ❌");
          window.history.pushState({}, "", "/");
          setIsAdminView(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('careerCoachQuestions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('careerCoachSubmissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleNewSubmission = (email: string, answers: Answers, location: string) => {
    const newSubmission: Submission = {
      id: Date.now().toString(),
      email,
      answers,
      submittedAt: new Date().toISOString(),
      location,
    };
    setSubmissions(prev => [...prev, newSubmission]);
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem("isAdminAccessGranted");
    setIsAdminView(false);
    window.history.pushState({}, "", "/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3D1A65] via-[#13162E] to-[#761435] text-white font-['Outfit',_sans-serif] antialiased">
      {isAdminView && (
        <header className="sticky top-0 bg-[#3D1A65]/80 backdrop-blur-sm p-4 flex justify-between items-center z-20 border-b border-[#A76EFF]/40">
          <div className="flex items-center gap-4">
            <img src="https://brainyscout.com/Content/images/logo-light.png" alt="BrainyScout Logo" className="h-4 w-auto" />
            <h1 className="text-xl font-bold text-slate-200">Admin Panel</h1>
          </div>
          <button 
            onClick={handleLogoutAdmin}
            className="px-4 py-2 text-sm bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
          >
            Logout Admin
          </button>
        </header>
      )}

      <main>
        {isAdminView ? (
          <AdminView
            questions={questions}
            setQuestions={setQuestions}
            submissions={submissions}
          />
        ) : (
          <UserView
            onSubmission={handleNewSubmission}
            onSwitchToAdmin={() => {
              window.location.href = "/adminRaj"; // redirect to adminRaj path
            }}
          />
        )}
      </main>
       {/* ✅ Footer Added Here */}
    <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-700/50">
      © {new Date().getFullYear()}{" "}
      <a
        href="https://brainyscout.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-300 hover:text-white transition-colors"
      >
        BrainyScout
      </a>
      . All rights reserved.
    </footer>
    </div>
  );
};

export default App;
