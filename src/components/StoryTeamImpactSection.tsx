import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  Lock,
  MessageSquareCode,
  RefreshCw,
  Smartphone,
  Video,
} from 'lucide-react';
import {
  EXPECTED_IMPACTS,
  GENERATED_ASSETS,
  TAMIL_NADU_JOURNEY,
  TARGET_AUDIENCES,
  TEAM_MEMBERS,
  TECHNOLOGIES,
} from '../data/presentationData.ts';
import type { WorkspaceTab } from '../types.ts';

interface StoryTeamImpactSectionProps {
  onSelectTab: (tab: WorkspaceTab) => void;
}

const TECH_ICONS = [Cpu, RefreshCw, MessageSquareCode, Database, Smartphone, Video, Lock];

export function StoryTeamImpactSection({ onSelectTab }: StoryTeamImpactSectionProps) {
  const [storyBeat, setStoryBeat] = useState(1);
  const [storyImgFailed, setStoryImgFailed] = useState(false);
  const [failedPortraits, setFailedPortraits] = useState<Record<string, boolean>>({});

  const currentBeat =
    TAMIL_NADU_JOURNEY.find((b) => b.beat === storyBeat) || TAMIL_NADU_JOURNEY[0];

  return (
    <>
      {/* 10. REAL-LIFE EXAMPLE — A JOURNEY THAT COULD CHANGE A LIFE */}
      <section className="border-t border-slate-800/70 bg-[#060a19] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Real-Life Example</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              A Journey That Could Change a Life.
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Imagine a 21-year-old student from a village in Tamil Nadu who wants to become a software developer. Follow each stage of how SKILLORA AI turns isolated potential into verified employability.
            </p>
          </div>

          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                {!storyImgFailed ? (
                  <img
                    src={GENERATED_ASSETS.storyTamilNadu}
                    alt="21-year-old student in rural Tamil Nadu practicing software development on a laptop at dusk"
                    referrerPolicy="no-referrer"
                    onError={() => setStoryImgFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center bg-slate-900 p-6">
                    <Cloud className="h-12 w-12 text-cyan-400" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050814]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-200">
                  Illustrative Scenario · Rural Tamil Nadu → Software Developer Track
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-300">
                    Stage {currentBeat.beat} of {TAMIL_NADU_JOURNEY.length} · {currentBeat.actor}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStoryBeat((b) => (b > 1 ? b - 1 : 9))}
                      aria-label="Previous story stage"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoryBeat((b) => (b < 9 ? b + 1 : 1))}
                      aria-label="Next story stage"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-2xl font-bold text-white">
                  {currentBeat.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-300">
                  {currentBeat.detail}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-9">
                {TAMIL_NADU_JOURNEY.map((beat) => (
                  <button
                    key={beat.beat}
                    type="button"
                    onClick={() => setStoryBeat(beat.beat)}
                    className={`rounded-lg py-2 font-mono text-xs font-semibold transition-colors ${
                      beat.beat === storyBeat
                        ? 'bg-cyan-500 text-slate-950'
                        : beat.beat < storyBeat
                        ? 'bg-blue-600/30 text-cyan-200'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    0{beat.beat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. EMPLOYMENT AND CAREER GROWTH CYCLE */}
      <section className="border-t border-slate-800/70 bg-[#050814] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Continuous Career Cycle</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Employment and Career Growth
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Employed candidates can voluntarily return as mentors, expanding industry mentorship access for future job seekers.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Receive Interview Invitation',
                desc: 'Companies invite candidates whose permitted Digital Skill Passports demonstrate readiness.',
              },
              {
                step: '02',
                title: 'Enter the Workplace',
                desc: 'Graduates transition smoothly into real teams with practical fluency already built.',
              },
              {
                step: '03',
                title: 'Track Career Progress',
                desc: 'Continuous assessments and project milestones document ongoing skill growth.',
              },
              {
                step: '04',
                title: 'Become a Mentor',
                desc: 'Once established in industry, alumni voluntarily mentor the next wave of learners.',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="glass-panel rounded-2xl p-6"
              >
                <span className="font-mono text-xs text-cyan-300">Cycle {item.step}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. TECHNOLOGY BEHIND SKILLORA AI */}
      <section className="border-t border-slate-800/70 bg-[#060a19] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Technology Stack</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Technology Behind SKILLORA AI
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TECHNOLOGIES.map((tech, idx) => {
              const Icon = TECH_ICONS[idx % TECH_ICONS.length];
              return (
                <div key={tech.name} className="glass-panel rounded-2xl p-6">
                  <Icon className="h-6 w-6 text-cyan-400" />
                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {tech.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{tech.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13. EXPECTED IMPACT ON INDIA & TARGET AUDIENCES */}
      <section className="border-t border-slate-800/70 bg-[#050814] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-cyan-300">
                Expected Benefits (Projected Impact — Not Proven Outcomes)
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
                Expected Impact on India
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="glass-panel rounded-2xl p-6 lg:col-span-6">
              <h3 className="font-display text-lg font-semibold text-white">
                Projected Ecosystem Benefits
              </h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {EXPECTED_IMPACTS.map((impact, idx) => (
                  <li
                    key={impact}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200"
                  >
                    <span className="block font-mono text-xs text-cyan-300 mb-1">0{idx + 1}</span>
                    {impact}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-6 lg:col-span-6">
              <h3 className="font-display text-lg font-semibold text-white">
                Target Audiences Served
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {TARGET_AUDIENCES.map((aud) => (
                  <div
                    key={aud.title}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <h4 className="font-display text-base font-semibold text-cyan-200">
                      {aud.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                      {aud.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. MEET OUR TEAM */}
      <section id="team" className="border-t border-slate-800/70 bg-[#060a19] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-cyan-300">Leadership & Project Team</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet Our Team
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="glass-panel overflow-hidden rounded-2xl">
                <div className="aspect-square w-full overflow-hidden bg-slate-900">
                  {!failedPortraits[member.name] ? (
                    <img
                      src={member.image}
                      alt={`${member.name} — ${member.role}`}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedPortraits((prev) => ({ ...prev, [member.name]: true }))
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 font-display text-3xl font-bold text-cyan-300">
                      {member.name
                        .split(' ')
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-medium text-cyan-300">{member.role}</p>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">{member.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{member.focus}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FUTURE VISION AND CONCLUSION */}
      <section className="border-t border-slate-800/70 bg-gradient-to-b from-[#050814] to-[#040712] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-medium text-cyan-300">Future Vision</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl text-balance">
              The Future Starts With SKILLORA AI.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'ASSESSMENT', desc: 'AI-driven skill evaluation.' },
              { title: 'MENTORSHIP', desc: 'Human expertise guiding every step.' },
              { title: 'LEARNING', desc: 'Personalised practical development.' },
              { title: 'OPPORTUNITY', desc: 'Connecting talent to careers.' },
            ].map((pillar) => (
              <div key={pillar.title} className="glass-panel rounded-2xl p-6 text-center">
                <h3 className="font-display text-lg font-bold tracking-wider text-cyan-300">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-panel-highlight rounded-2xl p-8 sm:p-10 text-center">
            <p className="mx-auto max-w-3xl font-display text-xl font-semibold leading-snug text-white sm:text-3xl text-balance">
              “We don’t just connect people to jobs. We connect people to the knowledge, guidance and skills that lead to jobs.”
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  onSelectTab('assessment');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-400"
              >
                Launch AI Skill Assessment
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('passport');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                View Digital Skill Passport
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
