import { useState, type FormEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  Edit3,
  Loader2,
  Lock,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  AIProvider,
  AssessmentEvaluation,
  DigitalSkillPassport,
  LearningPlan,
} from '../types.ts';

interface LearningWorkspaceProps {
  learningPlan: LearningPlan;
  lastEvaluation: AssessmentEvaluation | null;
  aiProvider: AIProvider;
  onChangeProvider: (provider: AIProvider) => void;
  onUpdateLearningPlan: (plan: LearningPlan) => Promise<void>;
}

export function LearningWorkspace({
  learningPlan,
  lastEvaluation,
  aiProvider,
  onChangeProvider,
  onUpdateLearningPlan,
}: LearningWorkspaceProps) {
  const [targetRole, setTargetRole] = useState(
    lastEvaluation?.jobRole || learningPlan.targetRole
  );
  const [gapsText, setGapsText] = useState(
    lastEvaluation?.skillGaps.join(', ') || 'SQL Joins, REST API Error Handling'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completedCourses = learningPlan.courses.filter((c) => c.completed).length;
  const totalCourses = learningPlan.courses.length || 1;
  const liveProgressPct = Math.round((completedCourses / totalCourses) * 100);

  const handleGeneratePlan = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const skillGaps = gapsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch('/api/ai/learning-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          skillGaps,
          currentSkills: lastEvaluation?.verifiedSkillsEarned || ['TypeScript', 'React'],
          provider: aiProvider,
        }),
      });
      const data = (await res.json()) as LearningPlan & { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not generate AI learning plan.');
        return;
      }
      await onUpdateLearningPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error loading recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = async (id: string) => {
    const updated: LearningPlan = {
      ...learningPlan,
      courses: learningPlan.courses.map((c) =>
        c.id === id ? { ...c, completed: !c.completed } : c
      ),
    };
    await onUpdateLearningPlan(updated);
  };

  const toggleProject = async (id: string) => {
    const updated: LearningPlan = {
      ...learningPlan,
      projects: learningPlan.projects.map((p) =>
        p.id === id
          ? {
              ...p,
              completed: !p.completed,
              mentorReviewStatus: !p.completed ? 'Submitted for Review' : 'Pending Submission',
            }
          : p
      ),
    };
    await onUpdateLearningPlan(updated);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium text-cyan-300">
            Personalised Skill Development · AI-Guided Learning Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">
            Skill Development & Gap Closure
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Generate personalised courses and practical mentor-reviewed projects based on your AI assessment gaps.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Your Active Module Completion: <span className="text-cyan-300">{liveProgressPct}%</span>
        </div>
      </div>

      {/* Illustrative Targets vs Live Progress */}
      <div className="mt-6 glass-panel rounded-2xl p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-base font-semibold text-white">
            Program Benchmark Indicators
          </h2>
          <span className="text-xs font-medium text-amber-300">
            Illustrative Targets from Presentation (Not Actual Measured Results)
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Course Completion (Illustrative Target)', value: 85 },
            { label: 'Skill Gap Closure (Illustrative Target)', value: 72 },
            { label: 'Mentor Satisfaction (Illustrative Target)', value: 90 },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-300">{metric.label}</span>
                <span className="font-mono text-xl font-bold text-cyan-300 tabular-nums">
                  {metric.value}%
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full rounded-full bg-slate-900">
                <div
                  style={{ width: `${metric.value}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left: Gemini AI Learning Plan Generator */}
        <div className="lg:col-span-4 space-y-5">
          <form onSubmit={handleGeneratePlan} className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                AI Learning Plan Generator
              </h2>
              <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-0.5">
                {(['auto', 'groq', 'gemini'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChangeProvider(p)}
                    className={`rounded px-2 py-1 text-[11px] font-semibold uppercase transition-colors ${
                      aiProvider === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Role</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Identified Skill Gaps
              </label>
              <textarea
                rows={3}
                value={gapsText}
                onChange={(e) => setGapsText(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating AI Learning Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Personalised Plan
                </>
              )}
            </button>
          </form>

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display text-base font-semibold text-white">
              Mentor Review Checklist
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-300">
              {learningPlan.mentorChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Courses & Practical Projects */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Personalised Course Recommendations
              </h2>
              <span className="text-xs font-mono text-cyan-300">
                {learningPlan.isLiveAI
                  ? `Generated by Live ${learningPlan.providerUsed === 'groq' ? 'Groq' : 'Gemini'} AI`
                  : 'Demo Starter Plan'}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {learningPlan.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{course.targetSkill}</span>
                      <span>·</span>
                      <span>{course.duration}</span>
                      <span>·</span>
                      <span>{course.level}</span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-white">{course.title}</h3>
                    <p className="mt-1 text-xs text-slate-300">{course.reason}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCourse(course.id)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      course.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {course.completed ? 'Completed ✓' : 'Mark Complete'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              Practical Exercises & Mentor-Reviewed Projects
            </h2>
            <div className="mt-4 space-y-3">
              {learningPlan.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{proj.title}</h3>
                    <span className="font-mono text-xs text-cyan-300">
                      {proj.mentorReviewStatus}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300">{proj.description}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Deliverable: {proj.deliverable} · Skills: {proj.targetSkills.join(', ')}
                  </p>
                  {proj.mentorNote && (
                    <p className="mt-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
                      Mentor Feedback: {proj.mentorNote}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleProject(proj.id)}
                    className="mt-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    {proj.completed ? 'Submitted for Mentor Review ✓' : 'Submit Practical Project'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PassportWorkspaceProps {
  passport: DigitalSkillPassport;
  onSavePassport: (updated: DigitalSkillPassport) => Promise<void>;
}

export function PassportWorkspace({ passport, onSavePassport }: PassportWorkspaceProps) {
  const [editing, setEditing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [draft, setDraft] = useState<DigitalSkillPassport>(passport);
  const [newEmployer, setNewEmployer] = useState('');

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    await onSavePassport(draft);
    setEditing(false);
  };

  const togglePermission = async (
    key: 'publicLinkEnabled' | 'allowVerifiedEmployers' | 'showContactEmail'
  ) => {
    const updated: DigitalSkillPassport = {
      ...passport,
      permissions: {
        ...passport.permissions,
        [key]: !passport.permissions[key],
      },
    };
    await onSavePassport(updated);
  };

  const addAllowedEmployer = async () => {
    if (!newEmployer.trim()) return;
    const updated: DigitalSkillPassport = {
      ...passport,
      permissions: {
        ...passport.permissions,
        allowedEmployerNames: Array.from(
          new Set([...passport.permissions.allowedEmployerNames, newEmployer.trim()])
        ),
      },
    };
    setNewEmployer('');
    await onSavePassport(updated);
  };

  const handleDownloadPassport = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${passport.candidateName} — Digital Skill Passport</title>
    <style>body{font-family:sans-serif;background:#050814;color:#f1f5f9;padding:40px;max-width:800px;margin:auto}h1{color:#22d3ee}section{margin-top:24px;border-top:1px solid #1e293b;padding-top:16px}</style></head>
    <body><h1>SKILLORA AI — Digital Skill Passport</h1>
    <p><strong>${passport.candidateName}</strong> · ${passport.headline}</p>
    <p>${passport.education} · ${passport.location}</p>
    <section><h2>Verified Skills</h2><ul>${passport.verifiedSkills.map((s) => `<li>${s.name} — ${s.score}% (${s.verifiedBy})</li>`).join('')}</ul></section>
    <section><h2>Assessment Results</h2><ul>${passport.assessmentResults.map((a) => `<li>${a.role}: ${a.score}% (${a.source})</li>`).join('')}</ul></section>
    <section><h2>Completed Training</h2><ul>${passport.completedTraining.map((t) => `<li>${t}</li>`).join('')}</ul></section>
    <section><h2>Practical Achievements</h2><ul>${passport.practicalAchievements.map((p) => `<li>${p}</li>`).join('')}</ul></section>
    </body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillora-passport-${passport.candidateId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://skillora-ai.example'}?passport=${passport.candidateId}`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium text-cyan-300">
            Verified Identity Credential · Candidate-Controlled Access
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">
            Digital Skill Passport
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setDraft(passport);
              setEditing((prev) => !prev);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile
          </button>
          <button
            type="button"
            onClick={handleDownloadPassport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" /> Download Passport
          </button>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white"
          >
            <Share2 className="h-3.5 w-3.5" /> Share Profile
          </button>
        </div>
      </div>

      {/* Three Steps: BUILD -> VERIFY -> SHARE */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            step: 'BUILD',
            desc: 'Complete assessments, training and projects.',
          },
          {
            step: 'VERIFY',
            desc: 'AI and mentor verification of skills.',
          },
          {
            step: 'SHARE',
            desc: 'Share the passport with employers under your privacy controls.',
          },
        ].map((item, idx) => (
          <div key={item.step} className="glass-panel rounded-xl p-4">
            <span className="font-mono text-xs text-cyan-300">Step 0{idx + 1} · {item.step}</span>
            <p className="mt-1 text-sm text-slate-200">{item.desc}</p>
          </div>
        ))}
      </div>

      {editing && (
        <form onSubmit={handleSaveEdit} className="mt-6 glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-white">Edit Passport Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Candidate Name</label>
              <input
                type="text"
                value={draft.candidateName}
                onChange={(e) => setDraft({ ...draft, candidateName: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Headline / Target Role</label>
              <input
                type="text"
                value={draft.headline}
                onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Education</label>
              <input
                type="text"
                value={draft.education}
                onChange={(e) => setDraft({ ...draft, education: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Passport Credential Card + Privacy Controls */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="glass-panel-highlight rounded-2xl p-6 sm:p-8 lg:col-span-8 space-y-6">
          <div className="flex flex-col gap-3 border-b border-cyan-500/20 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                <Award className="h-4 w-4" />
                <span>SKILLORA DIGITAL SKILL PASSPORT</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">
                {passport.candidateName}
              </h2>
              <p className="text-sm text-slate-300">
                {passport.headline} · {passport.education} · {passport.location}
              </p>
            </div>
            <div className="text-left sm:text-right text-xs font-mono text-slate-400">
              <p>ID: {passport.candidateId}</p>
              <p className="mt-0.5 text-cyan-300">
                {passport.permissions.allowVerifiedEmployers ? 'Employer Sharing Active' : 'Private Mode'}
              </p>
            </div>
          </div>

          {/* Verified Skills */}
          <div>
            <h3 className="font-display text-base font-semibold text-white">Verified Skills</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {passport.verifiedSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">{skill.name}</span>
                    <span className="font-mono font-semibold text-cyan-300 tabular-nums">
                      {skill.score}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{skill.verifiedBy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Results & Completed Training */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-base font-semibold text-white">
                Assessment Results
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs">
                {passport.assessmentResults.map((res, idx) => (
                  <li
                    key={`${res.role}-${idx}`}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{res.role}</span>
                      <span className="font-mono text-cyan-300 tabular-nums">{res.score}%</span>
                    </div>
                    <p className="mt-1 text-slate-400">
                      {res.source} · {res.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold text-white">
                Completed Training & Achievements
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                {passport.completedTraining.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    <span>{t}</span>
                  </li>
                ))}
                {passport.practicalAchievements.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mentor Feedback */}
          <div>
            <h3 className="font-display text-base font-semibold text-white">Mentor Feedback</h3>
            <div className="mt-3 space-y-2.5">
              {passport.mentorFeedback.map((fb, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs"
                >
                  <p className="font-semibold text-cyan-200">
                    {fb.mentorName} · {fb.mentorDesignation}
                  </p>
                  <p className="mt-1.5 text-slate-300 leading-relaxed">{fb.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Candidate Privacy & Access Controls */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-4 space-y-5">
          <div className="flex items-center gap-2 text-cyan-300">
            <Lock className="h-5 w-5" />
            <h2 className="font-display text-lg font-semibold text-white">
              Privacy & Sharing Controls
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            You control exactly who can view your Digital Skill Passport. Turning off Employer Sharing hides your detailed credential inside the Employer Hub.
          </p>

          <div className="space-y-3">
            {[
              {
                key: 'allowVerifiedEmployers' as const,
                label: 'Allow Employers to View Passport',
                desc: 'Permits registered companies in the Employer Hub to inspect your verified skills.',
              },
              {
                key: 'publicLinkEnabled' as const,
                label: 'Enable Direct Share Link',
                desc: 'Allows anyone with your QR code or share link to view your passport.',
              },
              {
                key: 'showContactEmail' as const,
                label: 'Show Contact Email on Passport',
                desc: 'Displays email address to permitted employers.',
              },
            ].map((toggle) => (
              <label
                key={toggle.key}
                className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5"
              >
                <div>
                  <span className="block text-xs font-semibold text-white">{toggle.label}</span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">{toggle.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={passport.permissions[toggle.key]}
                  onChange={() => togglePermission(toggle.key)}
                  className="mt-1 h-4 w-4 accent-cyan-400"
                />
              </label>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4">
            <label className="block text-xs font-semibold text-white mb-2">
              Specific Employer Allowlist
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newEmployer}
                onChange={(e) => setNewEmployer(e.target.value)}
                placeholder="Company name..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={addAllowedEmployer}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Allow
              </button>
            </div>
            <ul className="mt-2.5 space-y-1 text-xs text-slate-300">
              {passport.permissions.allowedEmployerNames.map((emp) => (
                <li key={emp}>• {emp}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel relative w-full max-w-sm rounded-2xl p-6 text-center">
            <button
              type="button"
              onClick={() => setShareOpen(false)}
              aria-label="Close share dialog"
              className="absolute right-4 top-4 rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-white">Share Digital Skill Passport</h3>
            <p className="mt-1 text-xs text-slate-400">
              Direct link status: {passport.permissions.publicLinkEnabled ? 'Enabled' : 'Restricted (Enable in Privacy Controls)'}
            </p>
            <div className="mt-4 inline-block rounded-xl bg-white p-3">
              <QRCodeSVG value={shareUrl} size={140} />
            </div>
            <p className="mt-3 break-all rounded-lg border border-slate-800 bg-slate-950 p-2 font-mono text-[11px] text-cyan-300">
              {shareUrl}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
