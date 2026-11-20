import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Building2,
  Compass,
  GraduationCap,
  MapPin,
  Network,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import {
  EXISTING_SYSTEMS,
  GENERATED_ASSETS,
  INDIA_UNEMPLOYMENT_STATS,
  INDIA_VS_QATAR_STATS,
  MAJOR_CHALLENGES,
  ROOT_CAUSES,
} from '../data/presentationData.ts';
import type { WorkspaceTab } from '../types.ts';

interface HeroAndProblemSectionProps {
  onSelectTab: (tab: WorkspaceTab) => void;
}

const ECOSYSTEM_CHAIN = [
  { label: 'Students', sub: 'Academic Foundation', icon: GraduationCap },
  { label: 'AI Assessment', sub: 'Evaluate Real Skills', icon: BrainCircuit },
  { label: 'Professional Mentors', sub: 'Industry Guidance', icon: Users },
  { label: 'Skill Development', sub: 'Close Skill Gaps', icon: TrendingUp },
  { label: 'Employment', sub: 'Verified Career Bridge', icon: Briefcase },
];

const ROOT_ICONS = [Briefcase, AlertTriangle, Compass, Wrench, MapPin, Network];

export function HeroAndProblemSection({ onSelectTab }: HeroAndProblemSectionProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [selectedCause, setSelectedCause] = useState<string>(ROOT_CAUSES[1].id);

  return (
    <>
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden bg-neural-grid pt-12 pb-20 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-10 lg:grid-cols-12">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col justify-between lg:col-span-6"
            >
              <div>
                <p className="text-xs font-medium tracking-wide text-cyan-300">
                  SKILLORA AI · The World of Opportunities and Skills
                </p>
                <h1 className="mt-4 font-display text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white text-balance">
                  Your Talent. Your Skills. Your Future.
                </h1>
                <p className="mt-4 text-base font-medium text-blue-200 sm:text-lg">
                  Test Your Skills. Connect with Experts. Build Your Career.
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                  Bridging the gap between education and employment through Artificial Intelligence, professional mentorship and skill-based opportunities. An AI-Powered Employment Development and Professional Connection Platform.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectTab('assessment')}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition-all hover:from-blue-500 hover:to-cyan-400 whitespace-nowrap shrink-0"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTab('employer')}
                    className="rounded-lg border border-slate-700 bg-slate-900/75 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-400/50 hover:bg-slate-800/80 whitespace-nowrap shrink-0"
                  >
                    Explore Opportunities
                  </button>
                  <a
                    href="#main-innovation"
                    className="rounded-lg px-4 py-3 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200 whitespace-nowrap shrink-0"
                  >
                    Discover Our Innovation
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Dominant Visual Carrier */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="lg:col-span-6"
            >
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                {!heroImgFailed ? (
                  <img
                    src={GENERATED_ASSETS.heroEcosystem}
                    alt="SKILLORA AI ecosystem connecting students, AI core assessment, and professional mentors"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="h-full w-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="flex h-full min-h-[300px] flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#0a1433] to-slate-950 p-8 text-center">
                    <BrainCircuit className="h-14 w-14 text-cyan-400" />
                    <p className="mt-3 font-display text-lg font-semibold text-white">
                      SKILLORA AI Neural Ecosystem
                    </p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050814]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                  <span>AI-Powered Skill Evaluation & Mentorship Network</span>
                  <span className="font-mono text-cyan-300">5-Stage Career Bridge</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3 Major Feature Cards */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <button
              type="button"
              onClick={() => onSelectTab('assessment')}
              className="glass-panel group rounded-2xl p-6 text-left transition-all hover:border-cyan-400/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <BrainCircuit className="h-6 w-6 text-cyan-400" />
                <span className="font-mono text-xs text-slate-400">01</span>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-white group-hover:text-cyan-200">
                AI Assessment
              </h2>
              <p className="mt-1.5 text-sm text-slate-300">
                Evaluate your real skills with intelligent job-specific tests and NLP answer analysis.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('mentorship')}
              className="glass-panel group rounded-2xl p-6 text-left transition-all hover:border-cyan-400/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <Users className="h-6 w-6 text-blue-400" />
                <span className="font-mono text-xs text-slate-400">02</span>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-white group-hover:text-cyan-200">
                Expert Connect
              </h2>
              <p className="mt-1.5 text-sm text-slate-300">
                Learn directly from experienced working professionals volunteering industry guidance.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('learning')}
              className="glass-panel group rounded-2xl p-6 text-left transition-all hover:border-cyan-400/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <TrendingUp className="h-6 w-6 text-violet-400" />
                <span className="font-mono text-xs text-slate-400">03</span>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-white group-hover:text-cyan-200">
                Career Growth
              </h2>
              <p className="mt-1.5 text-sm text-slate-300">
                Build your bridge to employment with personalised learning and Digital Skill Passports.
              </p>
            </button>
          </div>

          {/* Animated Ecosystem Pipeline */}
          <div className="mt-10 glass-panel rounded-2xl p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-sm font-semibold text-white">
                End-to-End Talent Transformation Flow
              </h3>
              <span className="text-xs text-slate-400">
                Students → AI Assessment → Professional Mentors → Skill Development → Employment
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {ECOSYSTEM_CHAIN.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div key={node.label} className="relative flex items-center gap-3">
                    <motion.div
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: [0.75, 1, 0.75] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
                      className="flex w-full flex-col rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-cyan-400" />
                        <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                      </div>
                      <span className="mt-3 text-sm font-semibold text-white">{node.label}</span>
                      <span className="mt-0.5 text-xs text-slate-400">{node.sub}</span>
                    </motion.div>
                    {index < ECOSYSTEM_CHAIN.length - 1 && (
                      <ArrowRight
                        aria-hidden="true"
                        className="hidden h-4 w-4 shrink-0 text-cyan-400/70 sm:block"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CHALLENGE – UNEMPLOYMENT IN INDIA */}
      <section id="challenge" className="border-t border-slate-800/70 bg-[#060a19] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">The Challenge</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Understanding the Unemployment Gap in India
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Millions of graduates leave colleges with academic credentials each year, yet employers still struggle to find job-ready talent due to mismatched practical skills and missing industry mentorship.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MAJOR_CHALLENGES.map((item, idx) => (
              <div key={item.title} className="glass-panel rounded-2xl p-6">
                <span className="font-mono text-xs text-cyan-300">Challenge 0{idx + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Separate Macro Statistics Section */}
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            {/* India PLFS Breakdown */}
            <div className="glass-panel rounded-2xl p-6 lg:col-span-7">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-lg font-semibold text-white">
                  India Unemployment Indicators
                </h3>
                <span className="text-xs text-slate-400">
                  Source: MoSPI, PLFS Annual Report 2025
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {INDIA_UNEMPLOYMENT_STATS.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <div>
                        <span className="font-medium text-slate-100">{stat.label}</span>
                        <span className="ml-2 text-xs text-slate-400">· {stat.note}</span>
                      </div>
                      <span className="font-mono text-base font-semibold text-cyan-300 tabular-nums">
                        {stat.value.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-900">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        style={{ width: `${Math.min(stat.value * 5.5, 100)}%`, transformOrigin: 'left' }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Separate India vs Qatar Total Comparison */}
            <div className="glass-panel rounded-2xl p-6 lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-lg font-semibold text-white">
                    Cross-Country Comparison: India vs Qatar
                  </h3>
                  <span className="text-xs text-slate-400">
                    Source: World Bank / ILO modelled estimates, 2025 (total unemployment rate)
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {INDIA_VS_QATAR_STATS.map((item) => (
                    <div
                      key={item.country}
                      className={`rounded-xl border p-5 ${
                        item.highlight
                          ? 'border-blue-500/40 bg-blue-500/10'
                          : 'border-slate-800 bg-slate-900/70'
                      }`}
                    >
                      <span className="text-xs font-medium text-slate-400">{item.country}</span>
                      <p className="mt-2 font-mono text-3xl font-bold text-white tabular-nums">
                        {item.rate.toFixed(1)}%
                      </p>
                      <p className="mt-1 text-xs text-slate-400">Modelled Total Rate</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs leading-relaxed text-slate-400">
                <strong>Methodological Note:</strong> Total unemployment figures and youth/urban-youth unemployment indicators are kept distinct. All figures above describe the macro employment situation cited in the presentation and are <strong>not</strong> results generated by SKILLORA AI.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROOT CAUSES OF UNEMPLOYMENT */}
      <section className="border-t border-slate-800/70 bg-[#050814] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Root Causes</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Six Structural Barriers Holding Back Capable Talent
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Select any card to inspect the underlying barrier in detail.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ROOT_CAUSES.map((cause, idx) => {
              const Icon = ROOT_ICONS[idx % ROOT_ICONS.length];
              const isSelected = selectedCause === cause.id;
              return (
                <button
                  key={cause.id}
                  type="button"
                  onClick={() => setSelectedCause(cause.id)}
                  className={`rounded-2xl p-6 text-left transition-all ${
                    isSelected ? 'glass-panel-highlight' : 'glass-panel hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-slate-400">0{idx + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">
                    {cause.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">{cause.summary}</p>
                  {isSelected && (
                    <p className="mt-3 border-t border-slate-800 pt-3 text-xs leading-relaxed text-cyan-200">
                      {cause.detail}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PROBLEM STATEMENT: EDUCATION VS EMPLOYMENT */}
      <section className="border-t border-slate-800/70 bg-[#060a19] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Problem Statement</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Education vs Employment: The Structural Divide
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* Education */}
            <div className="glass-panel rounded-2xl p-7">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <h3 className="font-display text-lg font-bold tracking-wide text-white">
                  EDUCATION
                </h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li className="border-b border-slate-800/80 pb-3">Degrees and Certificates.</li>
                <li className="border-b border-slate-800/80 pb-3">No Industry Exposure.</li>
                <li>No Professional Network.</li>
              </ul>
            </div>

            {/* The Gap */}
            <div className="glass-panel-highlight rounded-2xl p-7">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-cyan-300" />
                <h3 className="font-display text-lg font-bold tracking-wide text-cyan-200">
                  THE GAP
                </h3>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-200">
                <li>• Graduates struggle to find suitable employment.</li>
                <li>• Rural candidates lack access to guidance.</li>
                <li>• Candidates do not know what skills companies need.</li>
                <li>• Talented people lack professional connections.</li>
                <li>• Freshers miss out due to lack of experience.</li>
              </ul>
            </div>

            {/* Employment */}
            <div className="glass-panel rounded-2xl p-7">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-violet-400" />
                <h3 className="font-display text-lg font-bold tracking-wide text-white">
                  EMPLOYMENT
                </h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li className="border-b border-slate-800/80 pb-3">Practical Skills Needed.</li>
                <li className="border-b border-slate-800/80 pb-3">Industry Experience Expected.</li>
                <li>Networks Drive Hiring.</li>
              </ul>
            </div>
          </div>

          <blockquote className="mt-10 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-violet-950/60 p-8 text-center">
            <p className="font-display text-xl font-semibold text-white sm:text-2xl text-balance">
              “Education opens the door, but experience and connections help you walk through it.”
            </p>
          </blockquote>
        </div>
      </section>

      {/* 5. EXISTING SYSTEMS AND THEIR LIMITATIONS */}
      <section className="border-t border-slate-800/70 bg-[#050814] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Landscape Analysis</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Existing Systems and Their Limitations
            </h2>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400">
                  <th className="px-6 py-4 font-semibold">Existing System</th>
                  <th className="px-6 py-4 font-semibold">Observed Limitation</th>
                  <th className="px-6 py-4 font-semibold">What Remains Disconnected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {EXISTING_SYSTEMS.map((row) => (
                  <tr key={row.system} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{row.system}</td>
                    <td className="px-6 py-4 text-slate-300">{row.limitation}</td>
                    <td className="px-6 py-4 text-slate-400">{row.missing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              '1. AI Skill Assessment',
              '2. Professional Mentorship',
              '3. Personalised Development',
              '4. Direct Employment Bridge',
            ].map((item) => (
              <div key={item} className="glass-panel rounded-xl p-4 text-sm font-semibold text-cyan-200">
                {item}
              </div>
            ))}
          </div>

          <p className="mt-6 text-center font-display text-xl font-bold text-white">
            SKILLORA AI fills this gap.
          </p>
        </div>
      </section>
    </>
  );
}
