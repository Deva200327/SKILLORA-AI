import { useState, type FormEvent } from 'react';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  FileCheck2,
  Lock,
  Plus,
  Search,
  Send,
  UserCheck,
  X,
} from 'lucide-react';
import type {
  CandidateDirectoryItem,
  DemoUser,
  DigitalSkillPassport,
  JobApplication,
  JobOpening,
  WorkspaceTab,
} from '../types.ts';

interface EmployerWorkspaceProps {
  currentUser: DemoUser;
  jobs: JobOpening[];
  applications: JobApplication[];
  candidates: CandidateDirectoryItem[];
  onCreateJob: (job: {
    companyName: string;
    roleTitle: string;
    industry: string;
    location: string;
    workMode: 'Remote' | 'Hybrid' | 'On-site';
    requiredSkills: string[];
    description: string;
  }) => Promise<void>;
  onApplyJob: (jobId: string, passportShared: boolean) => Promise<void>;
  onCandidateAction: (candidateId: string, action: 'shortlist' | 'invite', note?: string) => Promise<void>;
  onSelectTab: (tab: WorkspaceTab) => void;
}

export function EmployerWorkspace({
  currentUser,
  jobs,
  applications,
  candidates,
  onCreateJob,
  onApplyJob,
  onCandidateAction,
  onSelectTab,
}: EmployerWorkspaceProps) {
  const [skillQuery, setSkillQuery] = useState('');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [companyName, setCompanyName] = useState(
    currentUser.organization || 'Apex Cloud Systems (Demo Employer)'
  );
  const [roleTitle, setRoleTitle] = useState('');
  const [industry, setIndustry] = useState('Software Development');
  const [location, setLocation] = useState('Chennai / Remote');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [skillsText, setSkillsText] = useState('TypeScript, React, REST APIs');
  const [description, setDescription] = useState('');

  const [inspectedPassport, setInspectedPassport] = useState<{
    candidate: CandidateDirectoryItem;
    passport: DigitalSkillPassport;
  } | null>(null);

  const filteredCandidates = candidates.filter((c) => {
    const q = skillQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.targetRole.toLowerCase().includes(q) ||
      c.topSkills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleCreateJobSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;
    await onCreateJob({
      companyName,
      roleTitle,
      industry,
      location,
      workMode,
      requiredSkills: skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      description,
    });
    setRoleTitle('');
    setDescription('');
    setShowCreateJob(false);
  };

  const canEmployerViewPassport = (cand: CandidateDirectoryItem) => {
    const p = cand.passport.permissions;
    return p.allowVerifiedEmployers || p.allowedEmployerNames.includes(companyName);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium text-cyan-300">
            Employer Hub · Skill-First Hiring & Demo Job Portal
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">
            Employer Discovery & Recruitment Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Create job openings, generate AI assessments, search candidates by verified skills, and inspect Digital Skill Passports when permitted. Employers always make the final recruitment decision.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateJob((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shrink-0"
        >
          <Plus className="h-4 w-4" />
          {showCreateJob ? 'Close Opening Form' : 'Create Job Opening'}
        </button>
      </div>

      {/* 4 Employer Process Steps */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          '1. View Verified Profiles',
          '2. Identify Suitable Candidates',
          '3. Send Interview Invitations',
          '4. Final Recruitment Decision',
        ].map((step) => (
          <div key={step} className="glass-panel rounded-xl p-4 text-sm font-semibold text-white">
            {step}
          </div>
        ))}
      </div>

      {showCreateJob && (
        <form onSubmit={handleCreateJobSubmit} className="mt-6 glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-white">
            Create Skill-Based Job Opening (Demo Mode)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Job Role Title</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Junior Backend Developer"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as 'Remote' | 'Hybrid' | 'On-site')}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Required Skills</label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Role Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the practical capabilities required..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Publish Job Opening & Enable AI Assessment
          </button>
        </form>
      )}

      {/* Candidate Search & Skill-Based Filtering */}
      <div className="mt-8 glass-panel rounded-2xl p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              Verified Candidate Discovery (Demo Profiles)
            </h2>
            <p className="text-xs text-slate-400">
              Filter candidates by required skill, role, or name. Passport inspection respects candidate privacy controls.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Filter by skill (e.g. TypeScript, SQL)..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {filteredCandidates.map((cand) => {
            const permitted = canEmployerViewPassport(cand);
            return (
              <div
                key={cand.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-base font-bold text-white">{cand.name}</h3>
                      <p className="text-xs text-cyan-300">{cand.targetRole}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {cand.education} · {cand.location}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold text-cyan-300 tabular-nums">
                      {cand.assessmentScore}%
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300">
                    Skills: {cand.topSkills.join(' · ')}
                  </p>

                  {cand.interviewInvited && (
                    <p className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] text-emerald-200">
                      Interview Invitation Sent ✓
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
                  {permitted ? (
                    <button
                      type="button"
                      onClick={() =>
                        setInspectedPassport({ candidate: cand, passport: cand.passport })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20"
                    >
                      <FileCheck2 className="h-3.5 w-3.5" /> View Passport
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-400">
                      <Lock className="h-3 w-3" /> Restricted by Candidate
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onCandidateAction(cand.id, 'shortlist')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      cand.shortlisted
                        ? 'bg-blue-600/30 text-cyan-200 border border-blue-500/40'
                        : 'border border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    {cand.shortlisted ? 'Shortlisted ✓' : 'Shortlist'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onCandidateAction(cand.id, 'invite')}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    <Send className="h-3 w-3" /> Invite
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Job Openings (Employer & Candidate Apply Bridge) */}
      <div className="mt-8 glass-panel rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          Skill-Based Job Openings (Demo Openings)
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {jobs.map((job) => {
            const applied = applications.some((a) => a.jobId === job.id);
            return (
              <div
                key={job.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-5"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                      {job.companyName}
                    </span>
                    <span>{job.workMode}</span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-white">
                    {job.roleTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {job.industry} · {job.location}
                  </p>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                    {job.description}
                  </p>
                  <p className="mt-3 text-xs text-cyan-300">
                    Skills: {job.requiredSkills.join(' · ')}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={() => onSelectTab('assessment')}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <Briefcase className="h-3.5 w-3.5" /> Take AI Test
                  </button>
                  <button
                    type="button"
                    disabled={applied}
                    onClick={() => onApplyJob(job.id, true)}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      applied
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {applied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passport Shared & Applied
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3.5 w-3.5" /> Apply with Passport
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspected Passport Modal */}
      {inspectedPassport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6">
            <button
              type="button"
              onClick={() => setInspectedPassport(null)}
              aria-label="Close passport preview"
              className="absolute right-4 top-4 rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="font-mono text-xs text-cyan-300">
              Permissioned Employer View · Digital Skill Passport
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-white">
              {inspectedPassport.passport.candidateName}
            </h3>
            <p className="text-sm text-slate-300">
              {inspectedPassport.passport.headline} · {inspectedPassport.passport.education}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {inspectedPassport.passport.verifiedSkills.map((s) => (
                <div
                  key={s.name}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-white">
                    <span>{s.name}</span>
                    <span className="font-mono text-cyan-300">{s.score}%</span>
                  </div>
                  <p className="mt-1 text-slate-400">{s.verifiedBy}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">Practical Achievements</p>
              {inspectedPassport.passport.practicalAchievements.map((a) => (
                <p key={a}>• {a}</p>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={async () => {
                  await onCandidateAction(inspectedPassport.candidate.id, 'invite');
                  setInspectedPassport(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Send className="h-3.5 w-3.5" /> Send Interview Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
