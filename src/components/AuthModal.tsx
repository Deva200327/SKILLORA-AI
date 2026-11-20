import { useState, type FormEvent } from 'react';
import { Briefcase, GraduationCap, ShieldAlert, UserCheck, X } from 'lucide-react';
import type { DemoUser, UserRole } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: DemoUser;
  onUserChange: (user: DemoUser) => void;
}

const PRESET_PROFILES: DemoUser[] = [
  {
    id: 'cand-demo-1',
    name: 'Ananya Sundaram (Demo Candidate)',
    email: 'ananya.demo@example.org',
    role: 'candidate',
    location: 'Madurai District, Tamil Nadu',
    headline: 'Aspiring Full-Stack Software Developer',
  },
  {
    id: 'mentor-1',
    name: 'Aravind Krishnan (Demo Profile)',
    email: 'aravind.demo@example.org',
    role: 'professional',
    location: 'Chennai, Tamil Nadu',
    headline: 'Senior Software Engineer · Voluntary Mentor',
    organization: 'Demo Enterprise Cloud Team',
  },
  {
    id: 'emp-1',
    name: 'Apex Cloud Systems (Demo Employer)',
    email: 'talent.demo@example.org',
    role: 'employer',
    location: 'Chennai, Tamil Nadu',
    headline: 'Skill-First Hiring Team',
    organization: 'Apex Cloud Systems (Demo Employer)',
  },
];

export function AuthModal({ isOpen, onClose, currentUser, onUserChange }: AuthModalProps) {
  const [mode, setMode] = useState<'switch' | 'register'>('switch');
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [headline, setHeadline] = useState('');
  const [organization, setOrganization] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetSwitch = async (preset: DemoUser) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: preset.email, role: preset.role }),
      });
      if (res.ok) {
        const data = (await res.json()) as { user: DemoUser };
        onUserChange(data.user);
        onClose();
        return;
      }
    } catch {
      // Fallback to local preset if offline
    }
    onUserChange(preset);
    onClose();
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Please enter your full name and email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
          location: location.trim() || 'India',
          headline: headline.trim(),
          organization: organization.trim(),
        }),
      });
      const data = (await res.json()) as { user?: DemoUser; error?: string };
      if (!res.ok || !data.user) {
        setError(data.error || 'Could not create demo account.');
        return;
      }
      onUserChange(data.user);
      setName('');
      setEmail('');
      setLocation('');
      setHeadline('');
      setOrganization('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="glass-panel relative w-full max-w-xl rounded-2xl p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close account modal"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="auth-modal-title" className="font-display text-xl font-bold text-white">
          Role-Based Workspace Access
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Switch between Candidate, Professional Mentor, and Employer roles or create a session profile.
        </p>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <strong>Demo Mode Authentication:</strong> Firebase is not configured for this workspace. Accounts run in interactive Demo Mode while AI assessments and recommendations use the live server-side Gemini API.
          </span>
        </div>

        <div className="mt-4 flex gap-2 rounded-lg bg-slate-900/80 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('switch')}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              mode === 'switch' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quick Role Switch (Demo)
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
              mode === 'register' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register New Profile
          </button>
        </div>

        {mode === 'switch' ? (
          <div className="mt-4 space-y-3">
            {PRESET_PROFILES.map((preset) => {
              const active = currentUser.role === preset.role && currentUser.id === preset.id;
              const Icon =
                preset.role === 'candidate'
                  ? GraduationCap
                  : preset.role === 'professional'
                  ? UserCheck
                  : Briefcase;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSwitch(preset)}
                  className={`flex w-full items-start gap-3.5 rounded-xl border p-3.5 text-left transition-colors ${
                    active
                      ? 'border-cyan-400/60 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-white truncate">{preset.name}</span>
                      <span className="text-xs font-mono text-cyan-300 capitalize">{preset.role}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">{preset.headline}</p>
                    <p className="mt-1 text-xs text-slate-500">{preset.location} · {preset.email}</p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleRegister} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['candidate', 'professional', 'employer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                      role === r
                        ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name / Company Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karthik Velan"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="reg-email" className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.org"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-location" className="block text-xs font-medium text-slate-300 mb-1">
                  City / District
                </label>
                <input
                  id="reg-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Tirunelveli, Tamil Nadu"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="reg-headline" className="block text-xs font-medium text-slate-300 mb-1">
                  {role === 'employer' ? 'Company Industry' : 'Target Role / Designation'}
                </label>
                <input
                  id="reg-headline"
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={role === 'candidate' ? 'Software Developer' : role === 'professional' ? 'Senior Engineer' : 'SaaS Engineering'}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {role !== 'candidate' && (
              <div>
                <label htmlFor="reg-org" className="block text-xs font-medium text-slate-300 mb-1">
                  Organization Name
                </label>
                <input
                  id="reg-org"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Company or Organization"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50"
            >
              {submitting ? 'Creating Demo Profile...' : 'Continue to Workspace'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
