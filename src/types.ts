export type UserRole = 'candidate' | 'professional' | 'employer';
export type AIProvider = 'auto' | 'groq' | 'gemini';

export type WorkspaceTab =
  | 'overview'
  | 'assessment'
  | 'mentorship'
  | 'learning'
  | 'passport'
  | 'employer';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  headline: string;
  organization?: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'written';
  skillTag: string;
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  rubricHint?: string;
}

export interface GeneratedAssessment {
  id: string;
  jobRole: string;
  industry: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusSkills: string[];
  questions: AssessmentQuestion[];
  generatedAt: string;
  isLiveAI: boolean;
  providerUsed?: 'groq' | 'gemini';
}

export interface SkillBreakdownItem {
  skill: string;
  score: number;
  level: 'Foundational' | 'Developing' | 'Proficient' | 'Job-Ready';
  feedback: string;
}

export interface AssessmentEvaluation {
  assessmentId: string;
  jobRole: string;
  overallScore: number;
  skillBreakdown: SkillBreakdownItem[];
  strengths: string[];
  skillGaps: string[];
  employerReadinessSummary: string;
  verifiedSkillsEarned: string[];
  evaluatedAt: string;
  isLiveAI: boolean;
  providerUsed?: 'groq' | 'gemini';
}

export interface LearningCourse {
  id: string;
  title: string;
  provider: string;
  targetSkill: string;
  duration: string;
  level: string;
  reason: string;
  completed: boolean;
}

export interface PracticalProject {
  id: string;
  title: string;
  description: string;
  targetSkills: string[];
  deliverable: string;
  mentorReviewStatus: 'Pending Submission' | 'Submitted for Review' | 'Reviewed by Mentor';
  mentorNote?: string;
  completed: boolean;
}

export interface LearningPlan {
  targetRole: string;
  courses: LearningCourse[];
  projects: PracticalProject[];
  mentorChecklist: string[];
  generatedAt: string;
  isLiveAI: boolean;
  providerUsed?: 'groq' | 'gemini';
}

export interface MentorReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  designation: string;
  companyLabel: string;
  industry: string;
  yearsExperience: number;
  location: string;
  expertise: string[];
  availability: 'Available This Week' | 'Limited Slots' | 'Weekend Sessions';
  bio: string;
  careerAdvice: string;
  reviews: MentorReview[];
  isDemoData: true;
}

export interface MentorshipRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateGoal: string;
  mentorId: string;
  mentorName: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface PassportPermissions {
  publicLinkEnabled: boolean;
  allowVerifiedEmployers: boolean;
  allowedEmployerNames: string[];
  showContactEmail: boolean;
}

export interface DigitalSkillPassport {
  candidateId: string;
  candidateName: string;
  headline: string;
  location: string;
  education: string;
  email: string;
  targetRole: string;
  assessmentResults: {
    role: string;
    score: number;
    date: string;
    source: string;
  }[];
  verifiedSkills: {
    name: string;
    verifiedBy: 'AI Assessment' | 'Mentor Review' | 'AI + Mentor Verified';
    score: number;
  }[];
  completedTraining: string[];
  practicalAchievements: string[];
  mentorFeedback: {
    mentorName: string;
    mentorDesignation: string;
    note: string;
    date: string;
  }[];
  permissions: PassportPermissions;
  updatedAt: string;
}

export interface JobOpening {
  id: string;
  companyName: string;
  roleTitle: string;
  industry: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  requiredSkills: string[];
  description: string;
  assessmentReady: boolean;
  postedAt: string;
  isDemoData: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  passportShared: boolean;
  status: 'Applied' | 'Shortlisted' | 'Interview Invited' | 'Hired';
  appliedAt: string;
  interviewNote?: string;
}

export interface CandidateDirectoryItem {
  id: string;
  name: string;
  location: string;
  targetRole: string;
  education: string;
  topSkills: string[];
  assessmentScore: number;
  passport: DigitalSkillPassport;
  shortlisted: boolean;
  interviewInvited: boolean;
  interviewNote?: string;
  isDemoData: boolean;
}
