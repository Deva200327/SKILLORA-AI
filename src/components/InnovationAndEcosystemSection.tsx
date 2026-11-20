import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BrainCircuit,
  Briefcase,
  Building2,
  CheckCircle2,
  Cpu,
  FileCheck2,
  GraduationCap,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  GENERATED_ASSETS,
  SEVEN_INNOVATIONS,
  WORKING_PROCESS_STEPS,
} from '../data/presentationData.ts';
import type { WorkspaceTab } from '../types.ts';

interface InnovationAndEcosystemSectionProps {
  onSelectTab: (tab: WorkspaceTab) => void;
}

export function InnovationAndEcosystemSection({ onSelectTab }: InnovationAndEcosystemSectionProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [bridgeImgFailed, setBridgeImgFailed] = useState(false);

  const selectedProcess =
    WORKING_PROCESS_STEPS.find((s) => s.step === activeStep) || WORKING_PROCESS_STEPS[0];

  return (
    <>
      {/* 6. INTRODUCING SKILLORA AI — CENTRAL ANIMATED ECOSYSTEM */}
      <section id="ecosystem-hub" className="border-t border-slate-800/70 bg-[#060a19] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Introducing SKILLORA AI</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              One Connected AI Ecosystem for Talent, Mentors, and Companies
            </h2>
          </div>

          <div className="mt-12 grid items-center gap-6 lg:grid-cols-12">
            {/* Candidates */}
            <div className="glass-panel rounded-2xl p-6 lg:col-span-3">
              <div className="flex items-center gap-2.5 text-cyan-300">
                <GraduationCap className="h-5 w-5" />
                <h3 className="font-display text-base font-bold tracking-wide text-white">
                  CANDIDATES
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Get Assessed.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Build Skills.</span>
                </li>
              </ul>
            </div>

            {/* Animated Signal Line Left */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
              <motion.div
                animate={{ x: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="flex items-center gap-1 text-cyan-400"
              >
                <span className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-cyan-400" />
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>

            {/* SKILLORA AI HUB */}
            <div className="glass-panel-highlight rounded-2xl p-7 lg:col-span-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit className="h-6 w-6 text-cyan-300" />
                  <h3 className="font-display text-lg font-bold text-white">SKILLORA AI HUB</h3>
                </div>
                <span className="font-mono text-xs text-cyan-300">Core Engine</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-200">
                <li>• Identifies strengths and weaknesses.</li>
                <li>• Matches candidates with professionals.</li>
                <li>• Connects employers with talent.</li>
                <li>• Generates Digital Skill Passports.</li>
              </ul>
            </div>

            {/* Animated Signal Line Right */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
              <motion.div
                animate={{ x: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="flex items-center gap-1 text-violet-400"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span className="h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-violet-500" />
              </motion.div>
            </div>

            {/* Companies & Professionals */}
            <div className="glass-panel rounded-2xl p-6 lg:col-span-3">
              <div className="flex items-center gap-2.5 text-violet-300">
                <Building2 className="h-5 w-5" />
                <h3 className="font-display text-base font-bold tracking-wide text-white">
                  COMPANIES & PROFESSIONALS
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Discover Talent.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Mentor and Guide.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEVEN MAJOR INNOVATIONS */}
      <section className="border-t border-slate-800/70 bg-[#050814] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Platform Architecture</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Seven Major Innovations Powering SKILLORA AI
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SEVEN_INNOVATIONS.map((feat) => (
              <div
                key={feat.number}
                className={`rounded-2xl p-6 transition-all ${
                  feat.isMain
                    ? 'glass-panel-highlight md:col-span-2 flex flex-col justify-between'
                    : 'glass-panel hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-300">Feature {feat.number}</span>
                    {feat.isMain && (
                      <span className="font-medium text-cyan-200">Primary Innovation</span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {feat.description}
                  </p>
                </div>
                {feat.isMain && (
                  <div className="mt-5 flex items-center justify-between border-t border-cyan-500/20 pt-4">
                    <span className="text-xs text-slate-300">
                      Voluntary industry mentorship without leaving existing employment
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTab('mentorship')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 whitespace-nowrap"
                    >
                      Explore Connections <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MAIN INNOVATION — PROFESSIONAL EMPLOYEE CONNECTION */}
      <section
        id="main-innovation"
        className="border-t border-slate-800/70 bg-gradient-to-b from-[#070d22] via-[#050814] to-[#060a19] py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="text-xs font-medium text-cyan-300">
                Main Innovation · Professional Employee Connection
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl text-balance">
                Connecting Experience with Opportunity.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                An unemployed candidate who wants to become a software developer can connect directly with an experienced software developer already working in a company. Professionals voluntarily share practical guidance without leaving their existing jobs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onSelectTab('mentorship')}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-400"
                >
                  Explore Professional Connections
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950">
                {!bridgeImgFailed ? (
                  <img
                    src={GENERATED_ASSETS.innovationBridge}
                    alt="Experienced software developer mentoring a graduate across a dark studio workspace"
                    referrerPolicy="no-referrer"
                    onError={() => setBridgeImgFailed(true)}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-slate-900 p-8 text-center">
                    <Users className="h-12 w-12 text-cyan-400" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Candidate <-> Central AI Match <-> Professional */}
          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-11">
            <div className="glass-panel rounded-2xl p-6 lg:col-span-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-bold text-white">CANDIDATE</span>
                <GraduationCap className="h-5 w-5 text-blue-400" />
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                <li>• Wants to become a Software Developer.</li>
                <li>• Takes AI Assessment.</li>
                <li>• Gets Matched by AI.</li>
                <li>• Receives Professional Guidance.</li>
                <li>• Improves Practical Skills.</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-500/35 bg-cyan-500/10 p-6 text-center lg:col-span-3">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.8, repeat: Infinity }}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/50 bg-slate-950 text-cyan-300"
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
              <h3 className="mt-3 font-display text-base font-bold text-white">CENTRAL AI MATCH</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                Matches verified skill gaps and career goals with working practitioners in the exact domain.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 lg:col-span-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-bold text-white">PROFESSIONAL</span>
                <UserCheck className="h-5 w-5 text-cyan-300" />
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                <li>• Experienced Software Developer.</li>
                <li>• Shares Industry Knowledge.</li>
                <li>• Gives Practical Advice.</li>
                <li>• Guides Career Development.</li>
                <li>• Voluntarily Mentors Candidates.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. COMPLETE WORKING PROCESS (10-STEP TIMELINE) & FULL 10-STAGE ECOSYSTEM */}
      <section id="working-process" className="border-t border-slate-800/70 bg-[#050814] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-cyan-300">
                Complete Working Process & 10-Stage Ecosystem
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
                Ten Connected Stages from Registration to Career Growth
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Select any step below to inspect how SKILLORA AI operates end-to-end.
            </p>
          </div>

          {/* Interactive 10-step selector */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {WORKING_PROCESS_STEPS.map((item) => {
              const active = activeStep === item.step;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveStep(item.step)}
                  className={`rounded-xl p-4 text-left transition-all ${
                    active ? 'glass-panel-highlight' : 'glass-panel hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-cyan-300">
                      STEP {String(item.step).padStart(2, '0')}
                    </span>
                    <span className="text-slate-400">{item.actor}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail Inspector */}
          <div className="mt-6 glass-panel-highlight rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs text-cyan-300">
                  STEP {String(selectedProcess.step).padStart(2, '0')} · {selectedProcess.actor}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">
                  {selectedProcess.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200">
                  {selectedProcess.description}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev > 1 ? prev - 1 : 10))}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                >
                  Previous Step
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev < 10 ? prev + 1 : 1))}
                  className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Next Step
                </button>
              </div>
            </div>

            {/* Interactive 10-Stage Ecosystem Flow Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-5 text-xs">
              {[
                { label: 'Employer Registration', icon: Building2 },
                { label: 'AI Assessment Creation', icon: Cpu },
                { label: 'Candidate Assessment', icon: GraduationCap },
                { label: 'AI Skill Analysis', icon: BrainCircuit },
                { label: 'Professional Connection', icon: Users },
                { label: 'Professional Guidance', icon: UserCheck },
                { label: 'Skill Development', icon: Sparkles },
                { label: 'Digital Skill Passport', icon: FileCheck2 },
                { label: 'Employer Review', icon: Award },
                { label: 'Career Growth', icon: Briefcase },
              ].map((stage, i) => {
                const isCurr = activeStep === i + 1;
                return (
                  <div key={stage.label} className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveStep(i + 1)}
                      className={`rounded-md px-2.5 py-1 transition-colors ${
                        isCurr
                          ? 'bg-cyan-500/20 text-cyan-200 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {i + 1}. {stage.label}
                    </button>
                    {i < 9 && <ArrowRight className="h-3 w-3 text-slate-600" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
