import { useState, type FormEvent } from 'react';
import {
  Check,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Star,
  UserCheck,
  Video,
  VideoOff,
  X,
} from 'lucide-react';
import type {
  ChatMessage,
  DemoUser,
  MentorProfile,
  MentorshipRequest,
} from '../types.ts';

interface MentorshipWorkspaceProps {
  currentUser: DemoUser;
  mentors: MentorProfile[];
  requests: MentorshipRequest[];
  messages: ChatMessage[];
  onCreateRequest: (mentor: MentorProfile, message: string, goal: string) => Promise<void>;
  onUpdateRequestStatus: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
  onSendMessage: (requestId: string, text: string) => Promise<void>;
}

export function MentorshipWorkspace({
  currentUser,
  mentors,
  requests,
  messages,
  onCreateRequest,
  onUpdateRequestStatus,
  onSendMessage,
}: MentorshipWorkspaceProps) {
  const [industryFilter, setIndustryFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'candidate' | 'mentor'>(
    currentUser.role === 'professional' ? 'mentor' : 'candidate'
  );
  const [requestTarget, setRequestTarget] = useState<MentorProfile | null>(null);
  const [requestGoal, setRequestGoal] = useState('Become job-ready for Software Developer roles');
  const [requestMsg, setRequestMsg] = useState('');

  const [activeChatRequestId, setActiveChatRequestId] = useState<string>(
    requests.find((r) => r.status === 'accepted')?.id || requests[0]?.id || ''
  );
  const [chatInput, setChatInput] = useState('');

  // Simulated Live Video Session UI
  const [videoSessionOpen, setVideoSessionOpen] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sessionNotes, setSessionNotes] = useState(
    'Agenda: 1) Review REST API error-handling code 2) Discuss production debugging workflow 3) Next milestone targets.'
  );
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const industries = ['All', ...Array.from(new Set(mentors.map((m) => m.industry)))];
  const filteredMentors =
    industryFilter === 'All'
      ? mentors
      : mentors.filter((m) => m.industry === industryFilter);

  const activeRequest = requests.find((r) => r.id === activeChatRequestId);
  const activeMessages = messages.filter((m) => m.requestId === activeChatRequestId);

  const handleSubmitRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!requestTarget || !requestMsg.trim()) return;
    await onCreateRequest(requestTarget, requestMsg.trim(), requestGoal.trim());
    setRequestMsg('');
    setRequestTarget(null);
  };

  const handleSendChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeChatRequestId || !chatInput.trim()) return;
    await onSendMessage(activeChatRequestId, chatInput.trim());
    setChatInput('');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium text-cyan-300">
            Demo Mode Mentorship Platform · Voluntary Working Professionals
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">
            Professional Mentorship & Expert Connect
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Connect with experienced employees already working in industry who voluntarily share guidance without leaving their jobs. Profiles below are realistic demonstration profiles clearly labeled as Demo Data.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('candidate')}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              viewMode === 'candidate'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Candidate View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mentor')}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              viewMode === 'mentor'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Professional Mentor View
          </button>
        </div>
      </div>

      {/* Industry Filter Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {industries.map((ind) => (
          <button
            key={ind}
            type="button"
            onClick={() => setIndustryFilter(ind)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              industryFilter === ind
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Mentor Profiles Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="glass-panel flex flex-col justify-between rounded-2xl p-6">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-cyan-300">
                    {mentor.industry} · {mentor.yearsExperience} yrs exp
                  </span>
                  <h2 className="mt-1 font-display text-lg font-bold text-white">
                    {mentor.name}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {mentor.designation} · {mentor.companyLabel}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-300">{mentor.bio}</p>

              <div className="mt-4 border-t border-slate-800 pt-3 text-xs">
                <span className="text-slate-400">Expertise: </span>
                <span className="text-slate-200">{mentor.expertise.join(' · ')}</span>
              </div>
              <div className="mt-1.5 text-xs">
                <span className="text-slate-400">Availability: </span>
                <span className="text-cyan-300">{mentor.availability}</span>
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
                <p className="font-semibold text-white">Career Advice</p>
                <p className="mt-1 italic text-slate-300">“{mentor.careerAdvice}”</p>
              </div>

              {mentor.reviews.length > 0 && (
                <div className="mt-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-300" />
                    <span>{mentor.reviews[0].rating}.0 · {mentor.reviews[0].authorName}</span>
                  </div>
                  <p className="mt-1 text-slate-400">{mentor.reviews[0].comment}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setRequestTarget(mentor)}
              className="mt-5 w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-400"
            >
              Request Mentorship
            </button>
          </div>
        ))}
      </div>

      {/* Requests Management + Messaging & Live Video Session */}
      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        {/* Left: Requests Queue */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              {viewMode === 'mentor' ? 'Incoming Mentorship Requests' : 'Your Mentorship Connections'}
            </h2>
            <span className="font-mono text-xs text-slate-400">{requests.length} total</span>
          </div>

          <div className="mt-4 space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`rounded-xl border p-4 transition-colors ${
                  activeChatRequestId === req.id
                    ? 'border-cyan-400/50 bg-cyan-500/10'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-white">
                    {viewMode === 'mentor' ? req.candidateName : req.mentorName}
                  </span>
                  <span
                    className={`font-mono capitalize ${
                      req.status === 'accepted'
                        ? 'text-emerald-300'
                        : req.status === 'rejected'
                        ? 'text-rose-400'
                        : 'text-amber-300'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Goal: {req.candidateGoal}</p>
                <p className="mt-2 text-xs text-slate-300">“{req.message}”</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {viewMode === 'mentor' && req.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onUpdateRequestStatus(req.id, 'accepted')}
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                      >
                        <Check className="h-3.5 w-3.5" /> Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateRequestStatus(req.id, 'rejected')}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                      >
                        <X className="h-3.5 w-3.5" /> Decline
                      </button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <button
                      type="button"
                      onClick={() => setActiveChatRequestId(req.id)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Open Workspace Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Messaging & Video Session Interface */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  Mentorship Messaging & Session Workspace
                </h2>
                <p className="text-xs text-slate-400">
                  {activeRequest
                    ? `Connected: ${activeRequest.candidateName} ↔ ${activeRequest.mentorName}`
                    : 'Select an accepted connection to message'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVideoSessionOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Video className="h-4 w-4" />
                {videoSessionOpen ? 'Hide Live Video Session' : 'Start Live Video Session (Demo)'}
              </button>
            </div>

            {videoSessionOpen && (
              <div className="mt-4 rounded-xl border border-cyan-500/35 bg-slate-950 p-4 space-y-4">
                <div className="flex items-center justify-between text-xs text-cyan-300">
                  <span className="font-mono">Simulated Mentorship Video Room (Demo UI)</span>
                  <span>Encrypted Peer Guidance</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex h-36 flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
                    <UserCheck className="h-8 w-8 text-cyan-300" />
                    <span className="mt-2 text-xs font-semibold text-white">
                      {activeRequest?.mentorName || 'Senior Software Engineer (Demo)'}
                    </span>
                    <span className="text-[11px] text-slate-400">Sharing Industry Code Review</span>
                  </div>
                  <div className="flex h-36 flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
                    <span className="text-xs font-semibold text-white">{currentUser.name}</span>
                    <span className="mt-1 text-[11px] text-slate-400">
                      Camera: {camOn ? 'On' : 'Muted'} · Mic: {micOn ? 'Active' : 'Muted'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Shared Session Notes & Career Guidance
                  </label>
                  <textarea
                    rows={2}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMicOn((m) => !m)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    >
                      {micOn ? <Mic className="h-3.5 w-3.5 text-cyan-300" /> : <MicOff className="h-3.5 w-3.5 text-rose-400" />}
                      {micOn ? 'Mute Mic' : 'Unmute'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCamOn((c) => !c)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    >
                      {camOn ? <Video className="h-3.5 w-3.5 text-cyan-300" /> : <VideoOff className="h-3.5 w-3.5 text-rose-400" />}
                      {camOn ? 'Camera On' : 'Camera Off'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSessionOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <PhoneOff className="h-3.5 w-3.5" /> End Call
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeedbackGiven(true)}
                    className="text-xs font-semibold text-cyan-300 hover:underline"
                  >
                    {feedbackGiven ? 'Feedback Recorded ✓' : 'Submit Session Feedback'}
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {activeMessages.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  No messages yet in this mentorship thread. Send a message below to begin.
                </p>
              ) : (
                activeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl border p-3 text-xs ${
                      msg.senderRole === 'professional'
                        ? 'border-cyan-500/30 bg-cyan-500/10'
                        : 'border-slate-800 bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-white">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="mt-1.5 text-slate-200 leading-relaxed">{msg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleSendChat} className="mt-4 flex gap-2 border-t border-slate-800 pt-4">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Write a message or ask for career guidance..."
              aria-label="Mentorship message"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!activeChatRequestId}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </form>
        </div>
      </div>

      {/* Request Mentorship Modal */}
      {requestTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel relative w-full max-w-md rounded-2xl p-6">
            <button
              type="button"
              onClick={() => setRequestTarget(null)}
              aria-label="Close request modal"
              className="absolute right-4 top-4 rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-white">
              Request Mentorship
            </h3>
            <p className="mt-1 text-xs text-cyan-300">
              {requestTarget.name} · {requestTarget.designation}
            </p>
            <form onSubmit={handleSubmitRequest} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Target Goal
                </label>
                <input
                  type="text"
                  required
                  value={requestGoal}
                  onChange={(e) => setRequestGoal(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Introduction & Questions
                </label>
                <textarea
                  rows={3}
                  required
                  value={requestMsg}
                  onChange={(e) => setRequestMsg(e.target.value)}
                  placeholder="Share your skill gaps and what practical advice you are seeking..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Send Mentorship Request
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
