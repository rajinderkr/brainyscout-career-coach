
import React, { useState } from 'react';
import { Question, QuestionType, Submission, Visual } from '../types';
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, BarChart, Image as ImageIcon } from 'lucide-react';

interface AdminViewProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  submissions: Submission[];
}

const QuestionTypeOptions = [
  { value: QuestionType.Welcome, label: 'Welcome Screen' },
  { value: QuestionType.MultipleChoice, label: 'Multiple Choice' },
  { value: QuestionType.Text, label: 'Text Input' },
  { value: QuestionType.Rating, label: 'Rating (1-5)' },
  { value: QuestionType.Completion, label: 'Completion/Lead Form' },
];

const VisualTypeOptions = [
    { value: 'none', label: 'None' },
    { value: 'image', label: 'Image' },
    { value: 'chart', label: 'Chart (Example)' },
];

const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2 || countryCode === "N/A") return '🌎';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export const AdminView: React.FC<AdminViewProps> = ({ questions, setQuestions, submissions }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'submissions'>('questions');
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({ type: QuestionType.MultipleChoice, text: '', options: [''] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.type) {
      setQuestions([...questions, { ...newQuestion, id: Date.now().toString() } as Question]);
      setNewQuestion({ type: QuestionType.MultipleChoice, text: '', options: [''] });
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
    
  const handleStartEditing = (question: Question) => {
    setEditingId(question.id);
    setEditingQuestion({ ...question });
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditingQuestion(null);
  };

  const handleUpdateQuestion = () => {
    if (editingId && editingQuestion) {
      setQuestions(questions.map(q => (q.id === editingId ? (editingQuestion as Question) : q)));
      handleCancelEditing();
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, questionSetter: React.Dispatch<React.SetStateAction<any>>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Data = reader.result as string;
        questionSetter((prev: any) => ({ ...prev, visual: { type: 'image', data: base64Data } as Visual }));
    };
    reader.readAsDataURL(file);
  };

  const filteredSubmissions = submissions.filter(sub => {
    const searchTerm = filter.toLowerCase();
    const submissionDate = new Date(sub.submittedAt).toLocaleString().toLowerCase();
    return (
        sub.email.toLowerCase().includes(searchTerm) ||
        submissionDate.includes(searchTerm) ||
        sub.location.toLowerCase().includes(searchTerm)
    );
  });

  const renderQuestionForm = (
    questionData: Partial<Question>, 
    questionSetter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const onChange = (field: keyof Question, value: any) => questionSetter((prev: any) => ({ ...prev, [field]: value }));
    const onOptionChange = (index: number, value: string) => {
        const options = [...(questionData.options || [])];
        options[index] = value;
        onChange('options', options);
    };
    const onAddOption = () => onChange('options', [...(questionData.options || []), '']);
    const onRemoveOption = (index: number) => onChange('options', (questionData.options || []).filter((_, i) => i !== index));

    return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1">Question Type</label>
        <select value={questionData.type} onChange={e => onChange('type', e.target.value)} className="w-full bg-slate-700 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
          {QuestionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1">Question Text</label>
        <input type="text" value={questionData.text || ''} onChange={e => onChange('text', e.target.value)} className="w-full bg-slate-700 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., What is your biggest career challenge?" />
      </div>
       {(questionData.type === QuestionType.Welcome || questionData.type === QuestionType.Completion || questionData.type === QuestionType.Rating || questionData.type === QuestionType.Text) && (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Subtext (Optional)</label>
            <input type="text" value={questionData.subtext || ''} onChange={e => onChange('subtext', e.target.value)} className="w-full bg-slate-700 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Add some descriptive text" />
        </div>
        )}
      {(questionData.type === QuestionType.MultipleChoice || questionData.type === QuestionType.Rating) && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Options</label>
          {questionData.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input type="text" value={option} onChange={e => onOptionChange(index, e.target.value)} className="w-full bg-slate-700 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
              <button onClick={() => onRemoveOption(index)} className="p-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/40"><Trash2 size={16} /></button>
            </div>
          ))}
          <button onClick={onAddOption} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><Plus size={16} /> Add Option</button>
        </div>
      )}
      <div className="my-4 border-t border-slate-700 pt-4">
        <label className="block text-sm font-medium text-slate-300 mb-1">Visual Attachment (Optional)</label>
         <select 
            value={questionData.visual?.type || 'none'} 
            onChange={e => {
                const type = e.target.value;
                if (type === 'none') onChange('visual', undefined);
                else if (type === 'image') onChange('visual', { type: 'image', data: ''});
                else if (type === 'chart') onChange('visual', { type: 'chart', data: [{ name: 'Leadership', value: 400 }, { name: 'AI/ML', value: 300 }]});
            }} 
            className="w-full bg-slate-700 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {VisualTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {questionData.visual?.type === 'image' && (
            <div className="mt-2">
                <input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, questionSetter)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                {questionData.visual.data && typeof questionData.visual.data === 'string' && (
                    <img src={questionData.visual.data} alt="preview" className="mt-2 rounded-lg max-h-32"/>
                )}
            </div>
        )}
      </div>
    </>
    )
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="border-b border-slate-700 mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button 
                onClick={() => setActiveTab('questions')}
                className={`${
                  activeTab === 'questions'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
              >
                  Questions
              </button>
              <button 
                onClick={() => setActiveTab('submissions')}
                className={`${
                  activeTab === 'submissions'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors flex items-center gap-2`}
              >
                  Submissions
                  <span className="bg-slate-700 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full">{submissions.length}</span>
              </button>
          </nav>
      </div>

      {activeTab === 'questions' && (
        <div className="animate-fade-in">
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Add New Question</h3>
            {renderQuestionForm(newQuestion, setNewQuestion)}
            <button onClick={handleAddQuestion} className="mt-4 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Plus size={18} /> Add Question
            </button>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Current Questions</h3>
            <ul className="space-y-4">
              {questions.map((q) => (
                <li key={q.id} className="bg-slate-800 rounded-lg p-4">
                  {editingId === q.id ? (
                    <div>
                        {renderQuestionForm(editingQuestion!, setEditingQuestion)}
                        <div className="flex gap-2 mt-4">
                            <button onClick={handleUpdateQuestion} className="px-3 py-1.5 bg-green-600 rounded-md hover:bg-green-700 flex items-center gap-1 text-sm"><Save size={14} /> Save</button>
                            <button onClick={handleCancelEditing} className="px-3 py-1.5 bg-slate-600 rounded-md hover:bg-slate-700 flex items-center gap-1 text-sm"><X size={14} /> Cancel</button>
                        </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-slate-100">{q.text}</p>
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-cyan-400 uppercase tracking-wider">{q.type}</p>
                            {q.visual && (
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                    {q.visual.type === 'image' ? <ImageIcon size={14}/> : <BarChart size={14} />}
                                    {q.visual.type}
                                </span>
                            )}
                        </div>
                        {q.options && <div className="flex flex-wrap gap-2 mt-2">
                            {q.options.map((opt, i) => <span key={i} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">{opt}</span>)}
                        </div>}
                      </div>
                      <div className="flex gap-2 mt-1 flex-shrink-0">
                        <button onClick={() => handleStartEditing(q)} className="p-2 bg-slate-700 rounded-md hover:bg-slate-600"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/40"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <h3 className="text-2xl font-bold text-indigo-400">All Submissions</h3>
            <input
              type="text"
              placeholder="Filter by email, date, or location..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-700 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
           <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
              <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                      <tr>
                          <th scope="col" className="px-6 py-3">Email</th>
                          <th scope="col" className="px-6 py-3">Submitted On</th>
                          <th scope="col" className="px-6 py-3">Location</th>
                          <th scope="col" className="px-6 py-3 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredSubmissions.length > 0 ? (
                        [...filteredSubmissions].reverse().map(sub => (
                          <React.Fragment key={sub.id}>
                              <tr className="border-b border-slate-700 hover:bg-slate-700/30">
                                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{sub.email}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">{new Date(sub.submittedAt).toLocaleString()}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">{getFlagEmoji(sub.location)} {sub.location}</td>
                                  <td className="px-6 py-4 text-right">
                                      <button 
                                        onClick={() => setExpandedSubmission(expandedSubmission === sub.id ? null : sub.id)}
                                        className="font-medium text-cyan-400 hover:underline flex items-center gap-1 justify-end"
                                      >
                                        View Answers
                                        {expandedSubmission === sub.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                      </button>
                                  </td>
                              </tr>
                              {expandedSubmission === sub.id && (
                                  <tr className="bg-slate-900/50">
                                      <td colSpan={4} className="p-4">
                                          <div className="p-2">
                                              <h4 className="font-semibold mb-2 text-slate-200">User Responses:</h4>
                                              <ul className="space-y-2 text-sm">
                                                  {Object.entries(sub.answers).map(([key, answer]) => {
                                                  const question = questions.find(q => q.key === key); // ✅ match by key instead of id
                                                  return (
                                                      <li key={key} className="p-3 bg-slate-700/50 rounded-md">
                                                          <p className="font-bold text-slate-300">
                                                            {question?.text || key.replaceAll('_', ' ').toUpperCase()}
                                                          </p>
                                                          {Array.isArray(answer) ? (
                                                            <ul className="list-disc list-inside text-cyan-300 mt-1">
                                                              {answer.map((a, i) => (
                                                                <li key={i}>{a.toString()}</li>
                                                              ))}
                                                            </ul>
                                                          ) : (
                                                            <p className="text-cyan-300 mt-1">{answer.toString()}</p>
                                                          )}
                                                      </li>
                                                  );
                                              })}
                                              </ul>
                                          </div>
                                      </td>
                                  </tr>
                              )}
                          </React.Fragment>
                      ))
                      ) : (
                          <tr>
                              <td colSpan={4} className="text-center py-8 text-slate-400">
                                {submissions.length > 0 ? 'No submissions match your filter.' : 'No submissions yet.'}
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
            </div>
        </div>
      )}
    </div>
  );
};