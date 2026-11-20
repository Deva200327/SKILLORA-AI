import { useState, type FormEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowUpRight, CheckCircle2, Mail, X } from 'lucide-react';
import type { WorkspaceTab } from '../types.ts';

interface FooterProps {
  onSelectTab: (tab: WorkspaceTab) => void;
}

export function Footer({ onSelectTab }: FooterProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://skillora-ai.example';

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!contactName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      setFormError('Please provide your name and a valid email address.');
      return;
    }
    if (!contactMessage.trim()) {
      setFormError('Please enter a short message.');
      return;
    }
    setSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <footer id="contact" className="border-t border-slate-800/80 bg-[#040712] pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* About & Brand */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                SKILLORA <span className="text-cyan-400">AI</span>
              </span>
              <p className="mt-1 text-sm font-medium text-cyan-300">
                The World of Opportunities and Skills
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                An AI-Powered Employment Development and Professional Connection Platform bridging higher education and employment through skill assessment, voluntary mentorship, and Digital Skill Passports.
              </p>
            </div>

            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>contact@skillora-ai.example (Email Placeholder)</span>
              </div>
              <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
                <a href="#hero" className="hover:text-cyan-300 transition-colors">LinkedIn (Placeholder)</a>
                <a href="#hero" className="hover:text-cyan-300 transition-colors">GitHub (Placeholder)</a>
                <a href="#hero" className="hover:text-cyan-300 transition-colors">X / Twitter (Placeholder)</a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectTab('assessment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-400"
            >
              Explore SKILLORA AI
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Contact Us Form */}
          <div className="lg:col-span-5">
            <h3 className="font-display text-lg font-semibold text-white">Contact Us</h3>
            <p className="mt-1 text-xs text-slate-400">
              Reach out regarding pilot partnerships, academic collaborations, or mentorship onboarding.
            </p>
            {submitted ? (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Inquiry Recorded (Demo Mode)
                </div>
                <p className="mt-1 text-xs text-emerald-200/80">
                  Thank you for connecting with SKILLORA AI. Your message has been captured in this demonstration session.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-semibold text-cyan-300 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name"
                    aria-label="Your Name"
                    className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email Address"
                    aria-label="Email Address"
                    className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Share your message or inquiry..."
                  aria-label="Message"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                {formError && <p className="text-xs text-rose-400">{formError}</p>}
                <button
                  type="submit"
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:border-cyan-400/50 hover:bg-slate-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* QR Code Placeholder for Final Website URL */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end">
            <div className="glass-panel rounded-2xl p-4 text-center">
              <div className="inline-block rounded-xl bg-white p-3">
                <QRCodeSVG value={siteUrl} size={116} bgColor="#ffffff" fgColor="#050814" level="M" />
              </div>
              <p className="mt-3 text-xs font-semibold text-white">Website QR Access</p>
              <p className="mt-0.5 text-[11px] text-slate-400 max-w-[160px] break-all">
                Scan to open SKILLORA AI
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SKILLORA AI · Test Your Skills. Connect with Experts. Build Your Career.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms and Conditions
            </button>
          </div>
        </div>
      </div>

      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel relative max-w-lg rounded-2xl p-6">
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              aria-label="Close legal dialog"
              className="absolute right-4 top-4 rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-white">
              {legalModal === 'privacy' ? 'Privacy Policy — SKILLORA AI' : 'Terms and Conditions — SKILLORA AI'}
            </h3>
            <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-300">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    SKILLORA AI prioritizes candidate-controlled data governance. Candidates retain full authority over who can inspect their Digital Skill Passport, including public link toggles and employer allowlists.
                  </p>
                  <p>
                    AI assessment prompts and responses sent for evaluation are processed strictly to compute skill breakdowns and personalised learning recommendations.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    SKILLORA AI connects candidates, voluntary working professionals, and employers for skill assessment, mentorship, and career discovery.
                  </p>
                  <p>
                    Professionals provide mentorship voluntarily without leaving their primary employment. Employers retain final hiring and recruitment authority.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
