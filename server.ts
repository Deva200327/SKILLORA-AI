import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  DEMO_CANDIDATES,
  DEMO_JOBS,
  DEMO_MENTORS,
  INITIAL_LEARNING_PLAN,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_MESSAGES,
  INITIAL_PASSPORT,
} from './src/data/presentationData.ts';
import type {
  CandidateDirectoryItem,
  ChatMessage,
  DemoUser,
  DigitalSkillPassport,
  JobApplication,
  JobOpening,
  LearningPlan,
  MentorProfile,
  MentorshipRequest,
  UserRole,
} from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));

// Server-side AI Clients (Groq + Gemini)
function getGroqConfig(): { apiKey: string; model: string } | null {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GROQ_API_KEY') {
    return null;
  }
  return {
    apiKey,
    model: process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile',
  };
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function resolveAIProvider(requested?: 'auto' | 'groq' | 'gemini'): 'groq' | 'gemini' | null {
  const hasGroq = Boolean(getGroqConfig());
  const hasGemini = Boolean(getGeminiClient());
  if (requested === 'groq') return hasGroq ? 'groq' : null;
  if (requested === 'gemini') return hasGemini ? 'gemini' : null;
  if (hasGroq) return 'groq';
  if (hasGemini) return 'gemini';
  return null;
}

async function callGroqJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const config = getGroqConfig();
  if (!config) {
    throw new Error('GROQ_API_KEY is not configured in Settings > Secrets.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string; code?: string };
  };

  if (!response.ok) {
    const errMsg = payload?.error?.message || `Groq API request failed with status ${response.status}.`;
    const err = new Error(errMsg) as Error & { statusCode?: number };
    err.statusCode = response.status;
    throw err;
  }

  const rawContent = payload.choices?.[0]?.message?.content?.trim();
  if (!rawContent) {
    throw new Error('Groq API returned an empty completion.');
  }

  return JSON.parse(rawContent) as T;
}

function formatAIError(err: unknown, fallback: string, provider?: string): { status: number; message: string } {
  if (err && typeof err === 'object' && 'statusCode' in err && typeof (err as { statusCode?: number }).statusCode === 'number') {
    const code = (err as { statusCode: number }).statusCode;
    const msg = err instanceof Error ? err.message : fallback;
    const hint =
      code === 401 || code === 403
        ? ` Please check or update your ${provider === 'groq' ? 'GROQ_API_KEY' : 'GEMINI_API_KEY'} in Settings > Secrets.`
        : code === 429
        ? ' Rate limit or quota exceeded; please retry shortly.'
        : '';
    return { status: code, message: `${msg}${hint}` };
  }

  const raw = err instanceof Error ? err.message : fallback;
  try {
    const parsed = JSON.parse(raw) as { error?: { code?: number; message?: string; status?: string } };
    if (parsed?.error?.message) {
      const code = typeof parsed.error.code === 'number' ? parsed.error.code : 500;
      const hint =
        code === 403 || code === 400
          ? ' Please check or update your GEMINI_API_KEY in Settings > Secrets.'
          : code === 429
          ? ' Rate limit or quota exceeded; check your billing tier in Settings > Secrets.'
          : '';
      return { status: code, message: `${parsed.error.message}${hint}` };
    }
  } catch {
    // Raw message is already plain text
  }
  return { status: 500, message: raw };
}

// Demo Mode In-Memory Store (since Firebase is optional / not configured)
const store: {
  users: DemoUser[];
  jobs: JobOpening[];
  applications: JobApplication[];
  mentors: MentorProfile[];
  mentorshipRequests: MentorshipRequest[];
  messages: ChatMessage[];
  passport: DigitalSkillPassport;
  learningPlan: LearningPlan;
  candidates: CandidateDirectoryItem[];
} = {
  users: [
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
  ],
  jobs: [...DEMO_JOBS],
  applications: [],
  mentors: [...DEMO_MENTORS],
  mentorshipRequests: [...INITIAL_MENTORSHIP_REQUESTS],
  messages: [...INITIAL_MESSAGES],
  passport: structuredClone(INITIAL_PASSPORT),
  learningPlan: structuredClone(INITIAL_LEARNING_PLAN),
  candidates: structuredClone(DEMO_CANDIDATES),
};

// Health & Capability Status
app.get('/api/health', (_req, res) => {
  const hasGroqKey = Boolean(getGroqConfig());
  const hasGeminiKey = Boolean(getGeminiClient());
  res.json({
    ok: true,
    groqConfigured: hasGroqKey,
    groqModel: getGroqConfig()?.model || 'llama-3.3-70b-versatile',
    geminiConfigured: hasGeminiKey,
    activeDefaultProvider: hasGroqKey ? 'groq' : hasGeminiKey ? 'gemini' : null,
    persistenceMode: 'demo-in-memory',
    firebaseConfigured: false,
  });
});

// Full Demo Platform State
app.get('/api/state', (_req, res) => {
  res.json({
    jobs: store.jobs,
    applications: store.applications,
    mentors: store.mentors,
    mentorshipRequests: store.mentorshipRequests,
    messages: store.messages,
    passport: store.passport,
    learningPlan: store.learningPlan,
    candidates: store.candidates,
  });
});

// Demo Mode Auth (Register / Login / Role Switch)
app.post('/api/auth/register', (req, res) => {
  const { name, email, role, location, headline, organization } = req.body as {
    name?: string;
    email?: string;
    role?: UserRole;
    location?: string;
    headline?: string;
    organization?: string;
  };
  if (!name?.trim() || !email?.trim() || !role) {
    res.status(400).json({ error: 'Name, email, and role are required.' });
    return;
  }
  const newUser: DemoUser = {
    id: `${role}-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    role,
    location: location?.trim() || 'India',
    headline: headline?.trim() || (role === 'candidate' ? 'Job Seeker' : role === 'professional' ? 'Working Professional & Mentor' : 'Hiring Organization'),
    organization: organization?.trim(),
  };
  store.users.push(newUser);

  if (role === 'candidate') {
    store.passport = {
      ...store.passport,
      candidateId: newUser.id,
      candidateName: newUser.name,
      email: newUser.email,
      location: newUser.location,
      headline: newUser.headline,
      updatedAt: new Date().toISOString(),
    };
  } else if (role === 'professional') {
    store.mentors.unshift({
      id: newUser.id,
      name: `${newUser.name} (Demo Session Profile)`,
      designation: newUser.headline,
      companyLabel: newUser.organization || 'Working Professional',
      industry: 'Technology & Engineering',
      yearsExperience: 5,
      location: newUser.location,
      expertise: ['Technical Guidance', 'Code Review', 'Career Strategy'],
      availability: 'Available This Week',
      bio: 'Newly registered voluntary mentor sharing practical workplace guidance without leaving their full-time role.',
      careerAdvice: 'Demonstrate consistent practical problem-solving and ask specific questions.',
      reviews: [],
      isDemoData: true,
    });
  }

  res.status(201).json({ user: newUser, mode: 'demo-auth' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body as { email?: string; role?: UserRole };
  const matched =
    store.users.find((u) => email && u.email.toLowerCase() === email.toLowerCase()) ||
    store.users.find((u) => u.role === (role || 'candidate'));
  if (!matched) {
    res.status(404).json({ error: 'Demo user profile not found.' });
    return;
  }
  res.json({ user: matched, mode: 'demo-auth' });
});

// Real AI Endpoint 1: Generate Job-Specific AI Assessment (Groq or Gemini)
app.post('/api/ai/generate-assessment', async (req, res) => {
  const { jobRole, industry, difficulty, focusSkills, provider } = req.body as {
    jobRole?: string;
    industry?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    focusSkills?: string[];
    provider?: 'auto' | 'groq' | 'gemini';
  };

  if (!jobRole?.trim()) {
    res.status(400).json({ error: 'Target job role is required to generate an AI assessment.' });
    return;
  }

  const chosenProvider = resolveAIProvider(provider);
  if (!chosenProvider) {
    const missingMsg =
      provider === 'groq'
        ? 'GROQ_API_KEY is not configured. Please add GROQ_API_KEY in Settings > Secrets.'
        : provider === 'gemini'
        ? 'GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY in Settings > Secrets.'
        : 'No AI provider key configured. Please add GROQ_API_KEY (or GEMINI_API_KEY) in Settings > Secrets.';
    res.status(503).json({ error: missingMsg });
    return;
  }

  try {
    const skillsList = (focusSkills && focusSkills.length > 0 ? focusSkills : ['Core Fundamentals', 'Practical Problem Solving', 'Debugging']).join(', ');
    const systemPrompt =
      'You are SKILLORA AI Assessment Engine. Design fair, practical, workplace-grounded skill assessments that measure real capability rather than rote memorization. Always respond with valid JSON only.';
    const prompt = `Generate a practical, job-specific skill assessment for the role "${jobRole.trim()}" in the "${industry || 'Technology'}" industry at "${difficulty || 'Intermediate'}" level.
Focus skills: ${skillsList}.
Create exactly 4 questions:
- 2 multiple-choice questions (type: "mcq") testing practical engineering/domain judgment (each with 4 clear options and a 0-based correctOptionIndex).
- 2 written scenario questions (type: "written") asking the candidate to explain how they would solve or debug a real workplace scenario, suitable for NLP evaluation.
Ensure every question has a concise skillTag matching one of the focus skills.
Return JSON strictly matching this shape:
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "skillTag": "Skill Name",
      "prompt": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0
    },
    {
      "id": "q3",
      "type": "written",
      "skillTag": "Skill Name",
      "prompt": "Scenario question text",
      "rubricHint": "Key points expected"
    }
  ]
}`;

    type AssessmentPayload = {
      questions?: Array<{
        id: string;
        type: 'mcq' | 'written';
        skillTag: string;
        prompt: string;
        options?: string[];
        correctOptionIndex?: number;
        rubricHint?: string;
      }>;
    };

    let parsed: AssessmentPayload;
    if (chosenProvider === 'groq') {
      parsed = await callGroqJson<AssessmentPayload>(systemPrompt, prompt);
    } else {
      const ai = getGeminiClient()!;
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['mcq', 'written'] },
                    skillTag: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctOptionIndex: { type: Type.INTEGER },
                    rubricHint: { type: Type.STRING },
                  },
                  required: ['id', 'type', 'skillTag', 'prompt'],
                },
              },
            },
            required: ['questions'],
          },
        },
      });
      parsed = JSON.parse((response.text ?? '{}').trim()) as AssessmentPayload;
    }

    if (!parsed.questions || parsed.questions.length === 0) {
      res.status(502).json({ error: `${chosenProvider.toUpperCase()} returned an empty assessment payload. Please retry.` });
      return;
    }

    res.json({
      id: `assess-${Date.now()}`,
      jobRole: jobRole.trim(),
      industry: industry || 'Technology',
      difficulty: difficulty || 'Intermediate',
      focusSkills: focusSkills && focusSkills.length > 0 ? focusSkills : ['Core Fundamentals', 'Problem Solving'],
      questions: parsed.questions,
      generatedAt: new Date().toISOString(),
      isLiveAI: true,
      providerUsed: chosenProvider,
    });
  } catch (err) {
    console.error(`${chosenProvider} assessment generation error:`, err);
    const { status, message } = formatAIError(err, 'Failed to generate assessment via AI API.', chosenProvider);
    res.status(status).json({ error: message });
  }
});

// Real AI Endpoint 2: Evaluate Answers (MCQ + Written NLP Analysis via Groq or Gemini)
app.post('/api/ai/evaluate-assessment', async (req, res) => {
  const { assessmentId, jobRole, questions, answers, provider } = req.body as {
    assessmentId?: string;
    jobRole?: string;
    questions?: Array<{
      id: string;
      type: 'mcq' | 'written';
      skillTag: string;
      prompt: string;
      options?: string[];
      correctOptionIndex?: number;
    }>;
    answers?: Record<string, string | number>;
    provider?: 'auto' | 'groq' | 'gemini';
  };

  if (!jobRole || !questions || !answers) {
    res.status(400).json({ error: 'Assessment questions and candidate answers are required for evaluation.' });
    return;
  }

  const chosenProvider = resolveAIProvider(provider);
  if (!chosenProvider) {
    const missingMsg =
      provider === 'groq'
        ? 'GROQ_API_KEY is not configured. Please add GROQ_API_KEY in Settings > Secrets.'
        : provider === 'gemini'
        ? 'GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY in Settings > Secrets.'
        : 'No AI provider key configured. Please add GROQ_API_KEY (or GEMINI_API_KEY) in Settings > Secrets.';
    res.status(503).json({ error: missingMsg });
    return;
  }

  try {
    const formattedSubmission = questions.map((q, idx) => {
      const ans = answers[q.id];
      if (q.type === 'mcq') {
        const selectedIdx = typeof ans === 'number' ? ans : Number(ans);
        const selectedText = q.options && Number.isFinite(selectedIdx) ? q.options[selectedIdx] : 'No selection';
        const correctText = q.options && typeof q.correctOptionIndex === 'number' ? q.options[q.correctOptionIndex] : 'N/A';
        return `Q${idx + 1} [MCQ | Skill: ${q.skillTag}]: ${q.prompt}\nCandidate chose: "${selectedText}" (Correct: "${correctText}")`;
      }
      return `Q${idx + 1} [Written Scenario | Skill: ${q.skillTag}]: ${q.prompt}\nCandidate written response: "${String(ans || '').trim() || '(Blank response)'}"`;
    }).join('\n\n');

    const systemPrompt =
      'You are SKILLORA AI Skill Analysis Engine. Score objectively from 0 to 100, give constructive feedback, identify clear strengths and skill gaps, and list skills ready for the Digital Skill Passport (skills scoring >= 70). Always respond with valid JSON only.';
    const evalPrompt = `Evaluate this candidate submission for the role "${jobRole}". Use Natural Language Processing reasoning to grade written explanations fairly on technical accuracy, clarity, and practical thinking.

${formattedSubmission}

Return JSON strictly matching this schema:
{
  "overallScore": 0-100 integer,
  "skillBreakdown": [
    {
      "skill": "Skill Name",
      "score": 0-100 integer,
      "level": "Foundational" | "Developing" | "Proficient" | "Job-Ready",
      "feedback": "Constructive evaluation feedback"
    }
  ],
  "strengths": ["Strength 1"],
  "skillGaps": ["Gap 1"],
  "employerReadinessSummary": "Concise readiness summary",
  "verifiedSkillsEarned": ["Verified Skill 1"]
}`;

    type EvalPayload = {
      overallScore: number;
      skillBreakdown: Array<{ skill: string; score: number; level: 'Foundational' | 'Developing' | 'Proficient' | 'Job-Ready'; feedback: string }>;
      strengths: string[];
      skillGaps: string[];
      employerReadinessSummary: string;
      verifiedSkillsEarned: string[];
    };

    let parsed: EvalPayload;
    if (chosenProvider === 'groq') {
      parsed = await callGroqJson<EvalPayload>(systemPrompt, evalPrompt);
    } else {
      const ai = getGeminiClient()!;
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: evalPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER },
              skillBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    level: { type: Type.STRING, enum: ['Foundational', 'Developing', 'Proficient', 'Job-Ready'] },
                    feedback: { type: Type.STRING },
                  },
                  required: ['skill', 'score', 'level', 'feedback'],
                },
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              skillGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              employerReadinessSummary: { type: Type.STRING },
              verifiedSkillsEarned: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              'overallScore',
              'skillBreakdown',
              'strengths',
              'skillGaps',
              'employerReadinessSummary',
              'verifiedSkillsEarned',
            ],
          },
        },
      });
      parsed = JSON.parse((response.text ?? '{}').trim()) as EvalPayload;
    }

    const evaluation = {
      assessmentId: assessmentId || `eval-${Date.now()}`,
      jobRole,
      ...parsed,
      evaluatedAt: new Date().toISOString(),
      isLiveAI: true,
      providerUsed: chosenProvider,
    };

    // Update Demo Candidate's Digital Skill Passport with real AI evaluation
    store.passport.assessmentResults.unshift({
      role: jobRole,
      score: evaluation.overallScore,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      source: chosenProvider === 'groq' ? 'Live Groq AI Assessment' : 'Live Gemini AI Assessment',
    });
    for (const item of evaluation.skillBreakdown) {
      const existing = store.passport.verifiedSkills.find(
        (s) => s.name.toLowerCase() === item.skill.toLowerCase()
      );
      if (existing) {
        existing.score = item.score;
      } else if (item.score >= 65) {
        store.passport.verifiedSkills.push({
          name: item.skill,
          verifiedBy: 'AI Assessment',
          score: item.score,
        });
      }
    }
    store.passport.updatedAt = new Date().toISOString();

    res.json(evaluation);
  } catch (err) {
    console.error(`${chosenProvider} assessment evaluation error:`, err);
    const { status, message } = formatAIError(err, 'Failed to evaluate assessment via AI API.', chosenProvider);
    res.status(status).json({ error: message });
  }
});

// Real AI Endpoint 3: Personalised Skill Development Recommendations (Groq or Gemini)
app.post('/api/ai/learning-recommendations', async (req, res) => {
  const { targetRole, skillGaps, currentSkills, provider } = req.body as {
    targetRole?: string;
    skillGaps?: string[];
    currentSkills?: string[];
    provider?: 'auto' | 'groq' | 'gemini';
  };

  if (!targetRole?.trim()) {
    res.status(400).json({ error: 'Target role is required.' });
    return;
  }

  const chosenProvider = resolveAIProvider(provider);
  if (!chosenProvider) {
    const missingMsg =
      provider === 'groq'
        ? 'GROQ_API_KEY is not configured. Please add GROQ_API_KEY in Settings > Secrets.'
        : provider === 'gemini'
        ? 'GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY in Settings > Secrets.'
        : 'No AI provider key configured. Please add GROQ_API_KEY (or GEMINI_API_KEY) in Settings > Secrets.';
    res.status(503).json({ error: missingMsg });
    return;
  }

  try {
    const gapsText = (skillGaps && skillGaps.length > 0 ? skillGaps : ['Practical system debugging', 'Production API error handling']).join(', ');
    const currentText = (currentSkills && currentSkills.length > 0 ? currentSkills : ['Core programming basics']).join(', ');
    const systemPrompt =
      'You are SKILLORA AI Learning Architect. Recommend practical, actionable training modules and hands-on projects—never vague motivational filler. Always respond with valid JSON only.';
    const planPrompt = `Create a personalised skill development plan for a candidate aiming to become a "${targetRole.trim()}".
Current verified strengths: ${currentText}.
Identified skill gaps: ${gapsText}.
Provide 3 focused courses/modules, 2 hands-on practical projects suitable for mentor review, and 3 mentor review checklist items.
Return JSON strictly matching this schema:
{
  "courses": [
    {
      "id": "c1",
      "title": "Course Title",
      "provider": "Provider / Track",
      "targetSkill": "Target Skill",
      "duration": "4 hours",
      "level": "Intermediate",
      "reason": "Why this closes the gap"
    }
  ],
  "projects": [
    {
      "id": "p1",
      "title": "Project Title",
      "description": "Practical project scope",
      "targetSkills": ["Skill 1"],
      "deliverable": "Expected deliverable"
    }
  ],
  "mentorChecklist": ["Checklist item 1", "Checklist item 2", "Checklist item 3"]
}`;

    type PlanPayload = {
      courses: Array<{ id: string; title: string; provider: string; targetSkill: string; duration: string; level: string; reason: string }>;
      projects: Array<{ id: string; title: string; description: string; targetSkills: string[]; deliverable: string }>;
      mentorChecklist: string[];
    };

    let parsed: PlanPayload;
    if (chosenProvider === 'groq') {
      parsed = await callGroqJson<PlanPayload>(systemPrompt, planPrompt);
    } else {
      const ai = getGeminiClient()!;
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: planPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              courses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    provider: { type: Type.STRING },
                    targetSkill: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    level: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ['id', 'title', 'provider', 'targetSkill', 'duration', 'level', 'reason'],
                },
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    targetSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    deliverable: { type: Type.STRING },
                  },
                  required: ['id', 'title', 'description', 'targetSkills', 'deliverable'],
                },
              },
              mentorChecklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['courses', 'projects', 'mentorChecklist'],
          },
        },
      });
      parsed = JSON.parse((response.text ?? '{}').trim()) as PlanPayload;
    }

    const plan: LearningPlan = {
      targetRole: targetRole.trim(),
      courses: parsed.courses.map((c) => ({ ...c, completed: false })),
      projects: parsed.projects.map((p) => ({
        ...p,
        mentorReviewStatus: 'Pending Submission',
        completed: false,
      })),
      mentorChecklist: parsed.mentorChecklist,
      generatedAt: new Date().toISOString(),
      isLiveAI: true,
      providerUsed: chosenProvider,
    };

    store.learningPlan = plan;
    res.json(plan);
  } catch (err) {
    console.error(`${chosenProvider} learning plan error:`, err);
    const { status, message } = formatAIError(err, 'Failed to generate learning recommendations via AI API.', chosenProvider);
    res.status(status).json({ error: message });
  }
});

// Mentorship Requests & Management
app.post('/api/mentorship-requests', (req, res) => {
  const { candidateId, candidateName, candidateGoal, mentorId, message } = req.body as {
    candidateId?: string;
    candidateName?: string;
    candidateGoal?: string;
    mentorId?: string;
    message?: string;
  };

  const mentor = store.mentors.find((m) => m.id === mentorId);
  if (!mentor || !candidateName?.trim() || !message?.trim()) {
    res.status(400).json({ error: 'Valid mentor, candidate name, and mentorship goal message are required.' });
    return;
  }

  const newReq: MentorshipRequest = {
    id: `req-${Date.now()}`,
    candidateId: candidateId || 'cand-demo-1',
    candidateName: candidateName.trim(),
    candidateGoal: candidateGoal?.trim() || 'Skill gap closure & career readiness',
    mentorId: mentor.id,
    mentorName: mentor.name,
    status: 'pending',
    message: message.trim(),
    createdAt: 'Just now (Demo)',
  };

  store.mentorshipRequests.unshift(newReq);
  res.status(201).json(newReq);
});

app.patch('/api/mentorship-requests/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status?: 'accepted' | 'rejected' };
  const target = store.mentorshipRequests.find((r) => r.id === id);
  if (!target || (status !== 'accepted' && status !== 'rejected')) {
    res.status(404).json({ error: 'Mentorship request not found or invalid status.' });
    return;
  }
  target.status = status;
  if (status === 'accepted') {
    store.messages.push({
      id: `msg-${Date.now()}`,
      requestId: target.id,
      senderId: target.mentorId,
      senderName: target.mentorName,
      senderRole: 'professional',
      text: `Accepted your mentorship request! Let's review your target skills for "${target.candidateGoal}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }
  res.json(target);
});

// Messaging Interface
app.post('/api/messages', (req, res) => {
  const { requestId, senderId, senderName, senderRole, text } = req.body as {
    requestId?: string;
    senderId?: string;
    senderName?: string;
    senderRole?: UserRole;
    text?: string;
  };
  if (!requestId || !text?.trim()) {
    res.status(400).json({ error: 'Request ID and message text are required.' });
    return;
  }
  const msg: ChatMessage = {
    id: `msg-${Date.now()}`,
    requestId,
    senderId: senderId || 'user-demo',
    senderName: senderName || 'Demo User',
    senderRole: senderRole || 'candidate',
    text: text.trim(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  store.messages.push(msg);
  res.status(201).json(msg);
});

// Digital Skill Passport Updates & Privacy Controls
app.put('/api/passport', (req, res) => {
  const updated = req.body as Partial<DigitalSkillPassport>;
  store.passport = {
    ...store.passport,
    ...updated,
    permissions: updated.permissions
      ? { ...store.passport.permissions, ...updated.permissions }
      : store.passport.permissions,
    updatedAt: new Date().toISOString(),
  };

  const candEntry = store.candidates.find((c) => c.id === store.passport.candidateId);
  if (candEntry) {
    candEntry.passport = structuredClone(store.passport);
    candEntry.name = store.passport.candidateName;
    candEntry.location = store.passport.location;
    candEntry.targetRole = store.passport.targetRole;
  }

  res.json(store.passport);
});

// Learning Plan Toggle
app.put('/api/learning-plan', (req, res) => {
  const updated = req.body as LearningPlan;
  store.learningPlan = updated;
  res.json(store.learningPlan);
});

// Employer Job Posting & Applications
app.post('/api/jobs', (req, res) => {
  const { companyName, roleTitle, industry, location, workMode, requiredSkills, description } = req.body as {
    companyName?: string;
    roleTitle?: string;
    industry?: string;
    location?: string;
    workMode?: 'Remote' | 'Hybrid' | 'On-site';
    requiredSkills?: string[];
    description?: string;
  };
  if (!companyName?.trim() || !roleTitle?.trim()) {
    res.status(400).json({ error: 'Company name and role title are required.' });
    return;
  }
  const newJob: JobOpening = {
    id: `job-${Date.now()}`,
    companyName: companyName.trim(),
    roleTitle: roleTitle.trim(),
    industry: industry?.trim() || 'Technology',
    location: location?.trim() || 'India / Remote',
    workMode: workMode || 'Hybrid',
    requiredSkills: requiredSkills && requiredSkills.length > 0 ? requiredSkills : ['Problem Solving', 'Domain Fundamentals'],
    description: description?.trim() || 'Skill-based opening prioritizing verified abilities and practical project readiness.',
    assessmentReady: true,
    postedAt: 'Just now (Demo)',
    isDemoData: true,
  };
  store.jobs.unshift(newJob);
  res.status(201).json(newJob);
});

app.post('/api/applications', (req, res) => {
  const { jobId, candidateId, candidateName, passportShared } = req.body as {
    jobId?: string;
    candidateId?: string;
    candidateName?: string;
    passportShared?: boolean;
  };
  if (!jobId || !candidateName) {
    res.status(400).json({ error: 'Job ID and candidate name are required.' });
    return;
  }
  const existing = store.applications.find((a) => a.jobId === jobId && a.candidateId === (candidateId || 'cand-demo-1'));
  if (existing) {
    res.json(existing);
    return;
  }
  const appRecord: JobApplication = {
    id: `app-${Date.now()}`,
    jobId,
    candidateId: candidateId || 'cand-demo-1',
    candidateName,
    passportShared: Boolean(passportShared),
    status: 'Applied',
    appliedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  store.applications.unshift(appRecord);
  res.status(201).json(appRecord);
});

// Employer Shortlist & Interview Invitation
app.patch('/api/employer/candidates/:id/invite', (req, res) => {
  const { id } = req.params;
  const { action, interviewNote } = req.body as { action?: 'shortlist' | 'invite'; interviewNote?: string };
  const candidate = store.candidates.find((c) => c.id === id);
  if (!candidate) {
    res.status(404).json({ error: 'Candidate not found.' });
    return;
  }
  if (action === 'shortlist') {
    candidate.shortlisted = !candidate.shortlisted;
  } else if (action === 'invite') {
    candidate.shortlisted = true;
    candidate.interviewInvited = true;
    candidate.interviewNote =
      interviewNote?.trim() || 'Invited for technical & practical skills interview based on Digital Skill Passport.';
  }
  res.json(candidate);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SKILLORA AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
