import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileCheck2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type {
  AIProvider,
  AssessmentEvaluation,
  GeneratedAssessment,
  JobOpening,
  WorkspaceTab,
} from '../types.ts';

interface AssessmentWorkspaceProps {
  jobs: JobOpening[];
  groqConfigured: boolean | null;
  geminiConfigured: boolean | null;
  aiProvider: AIProvider;
  onChangeProvider: (provider: AIProvider) => void;
  onEvaluationComplete: (evaluation: AssessmentEvaluation) => void;
  onSelectTab: (tab: WorkspaceTab) => void;
}

export function AssessmentWorkspace({
  jobs,
  groqConfigured,
  geminiConfigured,
  aiProvider,
  onChangeProvider,
  onEvaluationComplete,
  onSelectTab,
}: AssessmentWorkspaceProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || 'custom');
  const [customRole, setCustomRole] = useState('Junior Full-Stack Software Developer');
  const [industry, setIndustry] = useState('Software Development');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [skillsInput, setSkillsInput] = useState('TypeScript, React, REST APIs, Problem Solving');

  const [assessment, setAssessment] = useState<GeneratedAssessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [evaluation, setEvaluation] = useState<AssessmentEvaluation | null>(null);

  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setCustomRole(job.roleTitle);
      setIndustry(job.industry);
      setSkillsInput(job.requiredSkills.join(', '));
    }
  };

  const handleGenerateAssessment = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setEvaluation(null);
    setAnswers({});
    setGenerating(true);

    try {
      const focusSkills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/ai/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRole: customRole,
          industry,
          difficulty,
          focusSkills,
          provider: aiProvider,
        }),
      });

      const data = (await res.json()) as GeneratedAssessment & { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not generate assessment.');
        return;
      }
      setAssessment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error connecting to AI backend.');
    } finally {
      setGenerating(false);
    }
  };

  const handleEvaluate = async (e: FormEvent) => {
    e.preventDefault();
    if (!assessment) return;
    setError(null);
    setEvaluating(true);

    try {
      const res = await fetch('/api/ai/evaluate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessment.id,
          jobRole: assessment.jobRole,
          questions: assessment.questions,
          answers,
          provider: aiProvider,
        }),
      });
      const data = (await res.json()) as AssessmentEvaluation & { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not evaluate responses.');
        return;
      }
      setEvaluation(data);
      onEvaluationComplete(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error evaluating assessment.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium text-cyan-300">
            Live Server-Side AI (Groq & Gemini) · Assessment & NLP Skill Analysis
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">
            AI Assessment & Skill Gap Studio
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Generate job-specific technical and scenario assessments powered by Groq (Llama 3.3 70B) or Gemini, submit written and objective answers, and update your Digital Skill Passport automatically.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
            {([
              { id: 'auto', label: 'Auto' },
              { id: 'groq', label: 'Groq API' },
              { id: 'gemini', label: 'Gemini API' },
            ] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeProvider(item.id)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                  aiProvider === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="text-xs font-mono text-slate-400">
            {groqConfigured
              ? 'Groq API: Connected'
              : 'Groq API: Add GROQ_API_KEY in Settings > Secrets'}
            {' · '}
            {geminiConfigured ? 'Gemini: Key Set' : 'Gemini: Not Set'}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleGenerateAssessment} className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-white">
              Configure Target Role
            </h2>

            <div>
              <label htmlFor="job-preset" className="block text-xs font-medium text-slate-300 mb-1.5">
                Link to Job Opening (Demo Openings)
              </label>
              <select
                id="job-preset"
                value={selectedJobId}
                onChange={(e) => handleJobSelect(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.roleTitle} — {job.companyName}
                  </option>
                ))}
                <option value="custom">Custom Target Role</option>
              </select>
            </div>

            <div>
              <label htmlFor="target-role" className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Job Role
              </label>
              <input
                id="target-role"
                type="text"
                required
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="industry-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Industry
                </label>
                <input
                  id="industry-input"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="difficulty-select" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Level
                </label>
                <select
                  id="difficulty-select"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="skills-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                Skills to Evaluate (comma-separated)
              </label>
              <textarea
                id="skills-input"
                rows={2}
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-400 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating AI Assessment...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Live AI Assessment
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Active Assessment & Evaluation Output */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <div>
                <p className="font-semibold">AI Request Error</p>
                <p className="mt-1 text-xs leading-relaxed text-rose-200/90">{error}</p>
              </div>
            </div>
          )}

          {!assessment && !generating && (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <BrainCircuit className="mx-auto h-12 w-12 text-cyan-400" />
              <h3 className="mt-4 font-display text-xl font-semibold text-white">
                Ready to Generate Your Role-Specific Assessment
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-300">
                Choose a role and click “Generate Live AI Assessment”. SKILLORA AI creates 2 practical multiple-choice scenarios and 2 open-ended written questions for NLP evaluation via Groq or Gemini.
              </p>
            </div>
          )}

          {generating && (
            <div className="glass-panel rounded-2xl p-8 space-y-4">
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-800" />
              <div className="h-24 w-full animate-pulse rounded-xl bg-slate-900" />
              <div className="h-24 w-full animate-pulse rounded-xl bg-slate-900" />
            </div>
          )}

          {assessment && !evaluation && (
            <form onSubmit={handleEvaluate} className="glass-panel rounded-2xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <p className="text-xs font-mono text-cyan-300">
                    Live {assessment.providerUsed === 'groq' ? 'Groq' : 'Gemini'} AI Assessment · {assessment.difficulty}
                  </p>
                  <h2 className="font-display text-xl font-bold text-white">
                    {assessment.jobRole}
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  {assessment.questions.length} Questions
                </span>
              </div>

              <div className="space-y-6">
                {assessment.questions.map((q, index) => (
                  <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-cyan-300">
                        Question 0{index + 1} · {q.type === 'mcq' ? 'Multiple Choice' : 'Written Scenario (NLP Evaluated)'}
                      </span>
                      <span>Skill: {q.skillTag}</span>
                    </div>
                    <p className="mt-2.5 text-sm font-medium leading-relaxed text-white">
                      {q.prompt}
                    </p>

                    {q.type === 'mcq' && q.options ? (
                      <div className="mt-4 space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                              answers[q.id] === optIdx
                                ? 'border-cyan-400 bg-cyan-500/10 text-white'
                                : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              required
                              checked={answers[q.id] === optIdx}
                              onChange={() =>
                                setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                              }
                              className="mt-1 accent-cyan-400"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <textarea
                          rows={4}
                          required
                          value={String(answers[q.id] || '')}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          placeholder="Explain your practical engineering approach, edge cases, and reasoning..."
                          className="w-full rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                        {q.rubricHint && (
                          <p className="mt-1.5 text-xs text-slate-400">
                            Evaluation focus: {q.rubricHint}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={evaluating}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-400 disabled:opacity-60"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running AI NLP Skill Analysis...
                  </>
                ) : (
                  <>
                    Submit Answers for AI Skill Analysis
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {evaluation && (
            <div className="glass-panel-highlight rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col gap-4 border-b border-cyan-500/20 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-mono text-cyan-300">
                    Live {evaluation.providerUsed === 'groq' ? 'Groq' : 'Gemini'} AI Evaluation Report · Synced to Digital Skill Passport
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-white">
                    {evaluation.jobRole}
                  </h2>
                </div>
                <div className="rounded-xl border border-cyan-400/40 bg-slate-950/70 px-5 py-3 text-right">
                  <span className="text-xs text-slate-400">Overall Readiness Score</span>
                  <p className="font-mono text-3xl font-bold text-cyan-300 tabular-nums">
                    {evaluation.overallScore}%
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-200">
                {evaluation.employerReadinessSummary}
              </p>

              {/* Skill Breakdown */}
              <div className="space-y-3">
                <h3 className="font-display text-base font-semibold text-white">
                  Skill Breakdown & NLP Feedback
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {evaluation.skillBreakdown.map((item) => (
                    <div
                      key={item.skill}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-white">{item.skill}</span>
                        <span className="font-mono font-semibold text-cyan-300 tabular-nums">
                          {item.score}% · {item.level}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300">
                        {item.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Verified Strengths
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                    {evaluation.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Identified Skill Gaps
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                    {evaluation.skillGaps.map((g) => (
                      <li key={g}>• {g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectTab('learning')}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white"
                >
                  Generate Personalised Learning Plan
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('passport')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  <FileCheck2 className="h-4 w-4 text-cyan-300" />
                  Inspect Updated Passport
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEvaluation(null);
                    setAssessment(null);
                  }}
                  className="text-xs font-medium text-slate-400 hover:text-white ml-auto"
                >
                  Take Another Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
