import { useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal.tsx';
import { AssessmentWorkspace } from './components/AssessmentWorkspace.tsx';
import { EmployerWorkspace } from './components/EmployerWorkspace.tsx';
import { Footer } from './components/Footer.tsx';
import { HeroAndProblemSection } from './components/HeroAndProblemSection.tsx';
import { InnovationAndEcosystemSection } from './components/InnovationAndEcosystemSection.tsx';
import {
  LearningWorkspace,
  PassportWorkspace,
} from './components/LearningAndPassportWorkspace.tsx';
import { MentorshipWorkspace } from './components/MentorshipWorkspace.tsx';
import { Navbar } from './components/Navbar.tsx';
import { StoryTeamImpactSection } from './components/StoryTeamImpactSection.tsx';
import {
  DEMO_CANDIDATES,
  DEMO_JOBS,
  DEMO_MENTORS,
  INITIAL_LEARNING_PLAN,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_MESSAGES,
  INITIAL_PASSPORT,
} from './data/presentationData.ts';
import type {
  AIProvider,
  AssessmentEvaluation,
  CandidateDirectoryItem,
  ChatMessage,
  DemoUser,
  DigitalSkillPassport,
  JobApplication,
  JobOpening,
  LearningPlan,
  MentorProfile,
  MentorshipRequest,
  WorkspaceTab,
} from './types.ts';

const DEFAULT_USER: DemoUser = {
  id: 'cand-demo-1',
  name: 'Ananya Sundaram (Demo Candidate)',
  email: 'ananya.demo@example.org',
  role: 'candidate',
  location: 'Madurai District, Tamil Nadu',
  headline: 'Aspiring Full-Stack Software Developer',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<DemoUser>(() => {
    try {
      const saved = localStorage.getItem('skillora_demo_user');
      return saved ? (JSON.parse(saved) as DemoUser) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [groqConfigured, setGroqConfigured] = useState<boolean | null>(null);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);
  const [aiProvider, setAiProvider] = useState<AIProvider>('auto');
  const [jobs, setJobs] = useState<JobOpening[]>(DEMO_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [mentors, setMentors] = useState<MentorProfile[]>(DEMO_MENTORS);
  const [requests, setRequests] = useState<MentorshipRequest[]>(INITIAL_MENTORSHIP_REQUESTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [passport, setPassport] = useState<DigitalSkillPassport>(INITIAL_PASSPORT);
  const [learningPlan, setLearningPlan] = useState<LearningPlan>(INITIAL_LEARNING_PLAN);
  const [candidates, setCandidates] = useState<CandidateDirectoryItem[]>(DEMO_CANDIDATES);
  const [lastEvaluation, setLastEvaluation] = useState<AssessmentEvaluation | null>(null);

  useEffect(() => {
    let active = true;
    async function loadPlatformState() {
      try {
        const [healthRes, stateRes] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/state'),
        ]);
        if (!active) return;

        if (healthRes.ok) {
          const health = (await healthRes.json()) as {
            groqConfigured?: boolean;
            geminiConfigured: boolean;
          };
          setGroqConfigured(Boolean(health.groqConfigured));
          setGeminiConfigured(health.geminiConfigured);
        }

        if (stateRes.ok) {
          const data = (await stateRes.json()) as {
            jobs: JobOpening[];
            applications: JobApplication[];
            mentors: MentorProfile[];
            mentorshipRequests: MentorshipRequest[];
            messages: ChatMessage[];
            passport: DigitalSkillPassport;
            learningPlan: LearningPlan;
            candidates: CandidateDirectoryItem[];
          };
          setJobs(data.jobs);
          setApplications(data.applications);
          setMentors(data.mentors);
          setRequests(data.mentorshipRequests);
          setMessages(data.messages);
          setPassport(data.passport);
          setLearningPlan(data.learningPlan);
          setCandidates(data.candidates);
        }
      } catch {
        // Keep initial local demo state when server is restarting
      }
    }
    loadPlatformState();
    return () => {
      active = false;
    };
  }, []);

  const handleUserChange = (user: DemoUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('skillora_demo_user', JSON.stringify(user));
    } catch {
      // Ignore storage quota issues
    }
    if (user.role === 'employer') {
      setActiveTab('employer');
    } else if (user.role === 'professional') {
      setActiveTab('mentorship');
    }
  };

  const handleEvaluationComplete = async (evaluation: AssessmentEvaluation) => {
    setLastEvaluation(evaluation);
    try {
      const stateRes = await fetch('/api/state');
      if (stateRes.ok) {
        const data = (await stateRes.json()) as {
          passport: DigitalSkillPassport;
          candidates: CandidateDirectoryItem[];
        };
        setPassport(data.passport);
        setCandidates(data.candidates);
      }
    } catch {
      // Optimistically update locally
      setPassport((prev) => ({
        ...prev,
        assessmentResults: [
          {
            role: evaluation.jobRole,
            score: evaluation.overallScore,
            date: 'Today',
            source: 'Live Gemini AI Assessment',
          },
          ...prev.assessmentResults,
        ],
      }));
    }
  };

  const handleCreateRequest = async (mentor: MentorProfile, message: string, goal: string) => {
    const res = await fetch('/api/mentorship-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: currentUser.id,
        candidateName: currentUser.name,
        candidateGoal: goal,
        mentorId: mentor.id,
        message,
      }),
    });
    if (res.ok) {
      const created = (await res.json()) as MentorshipRequest;
      setRequests((prev) => [created, ...prev]);
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: 'accepted' | 'rejected') => {
    const res = await fetch(`/api/mentorship-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = (await res.json()) as MentorshipRequest;
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      const stateRes = await fetch('/api/state');
      if (stateRes.ok) {
        const data = (await stateRes.json()) as { messages: ChatMessage[] };
        setMessages(data.messages);
      }
    }
  };

  const handleSendMessage = async (requestId: string, text: string) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        text,
      }),
    });
    if (res.ok) {
      const msg = (await res.json()) as ChatMessage;
      setMessages((prev) => [...prev, msg]);
    }
  };

  const handleSavePassport = async (updated: DigitalSkillPassport) => {
    const res = await fetch('/api/passport', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const saved = (await res.json()) as DigitalSkillPassport;
      setPassport(saved);
      setCandidates((prev) =>
        prev.map((c) => (c.id === saved.candidateId ? { ...c, passport: saved } : c))
      );
    }
  };

  const handleUpdateLearningPlan = async (plan: LearningPlan) => {
    setLearningPlan(plan);
    await fetch('/api/learning-plan', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
  };

  const handleCreateJob = async (jobPayload: {
    companyName: string;
    roleTitle: string;
    industry: string;
    location: string;
    workMode: 'Remote' | 'Hybrid' | 'On-site';
    requiredSkills: string[];
    description: string;
  }) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobPayload),
    });
    if (res.ok) {
      const created = (await res.json()) as JobOpening;
      setJobs((prev) => [created, ...prev]);
    }
  };

  const handleApplyJob = async (jobId: string, passportShared: boolean) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        candidateId: currentUser.id,
        candidateName: currentUser.name,
        passportShared,
      }),
    });
    if (res.ok) {
      const created = (await res.json()) as JobApplication;
      setApplications((prev) => [created, ...prev.filter((a) => a.id !== created.id)]);
    }
  };

  const handleCandidateAction = async (
    candidateId: string,
    action: 'shortlist' | 'invite',
    note?: string
  ) => {
    const res = await fetch(`/api/employer/candidates/${candidateId}/invite`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, interviewNote: note }),
    });
    if (res.ok) {
      const updated = (await res.json()) as CandidateDirectoryItem;
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? updated : c)));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050814] text-slate-100">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {activeTab !== 'overview' && (
        <div className="border-b border-slate-800/80 bg-[#080d20]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 text-slate-300">
              <span>Active Role:</span>
              <strong className="text-white">{currentUser.name}</strong>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-cyan-300 capitalize">{currentUser.role}</span>
            </div>
            <div className="text-slate-400">
              AI Engine: {groqConfigured ? 'Live Groq API Connected' : geminiConfigured ? 'Live Gemini API' : 'Configure GROQ_API_KEY in Settings > Secrets'} · Profiles & Openings: Demo Mode
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'overview' && (
          <>
            <HeroAndProblemSection onSelectTab={setActiveTab} />
            <InnovationAndEcosystemSection onSelectTab={setActiveTab} />
            <StoryTeamImpactSection onSelectTab={setActiveTab} />
          </>
        )}

        {activeTab === 'assessment' && (
          <AssessmentWorkspace
            jobs={jobs}
            groqConfigured={groqConfigured}
            geminiConfigured={geminiConfigured}
            aiProvider={aiProvider}
            onChangeProvider={setAiProvider}
            onEvaluationComplete={handleEvaluationComplete}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'mentorship' && (
          <MentorshipWorkspace
            currentUser={currentUser}
            mentors={mentors}
            requests={requests}
            messages={messages}
            onCreateRequest={handleCreateRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'learning' && (
          <LearningWorkspace
            learningPlan={learningPlan}
            lastEvaluation={lastEvaluation}
            aiProvider={aiProvider}
            onChangeProvider={setAiProvider}
            onUpdateLearningPlan={handleUpdateLearningPlan}
          />
        )}

        {activeTab === 'passport' && (
          <PassportWorkspace passport={passport} onSavePassport={handleSavePassport} />
        )}

        {activeTab === 'employer' && (
          <EmployerWorkspace
            currentUser={currentUser}
            jobs={jobs}
            applications={applications}
            candidates={candidates}
            onCreateJob={handleCreateJob}
            onApplyJob={handleApplyJob}
            onCandidateAction={handleCandidateAction}
            onSelectTab={setActiveTab}
          />
        )}
      </main>

      <Footer onSelectTab={setActiveTab} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />
    </div>
  );
}
