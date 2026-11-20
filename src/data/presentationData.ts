import type {
  CandidateDirectoryItem,
  ChatMessage,
  DigitalSkillPassport,
  JobOpening,
  LearningPlan,
  MentorProfile,
  MentorshipRequest,
} from '../types.ts';

export const GENERATED_ASSETS = {
  heroEcosystem: '/src/assets/images/hero_skillora_ecosystem_1795163158279.jpg',
  innovationBridge: '/src/assets/images/innovation_connection_bridge_1795163157808.jpg',
  teamMohammedFaisal: '/src/assets/images/team_mohammed_faisal_1795163158524.jpg',
  teamJeevaraj: '/src/assets/images/team_jeevaraj_1795163158171.jpg',
  teamSamKevinRaj: '/src/assets/images/team_sam_kevin_raj_1795163157977.jpg',
  storyTamilNadu: '/src/assets/images/story_tamil_nadu_student_1795163158435.jpg',
} as const;

export const TEAM_MEMBERS = [
  {
    name: 'Mr. Mohammed Faisal',
    role: 'Founder & CEO',
    focus: 'Vision, Strategic Direction & Ecosystem Architecture',
    bio: 'Leads SKILLORA AI’s mission to bridge higher education and real-world employment through AI skill verification and voluntary industry mentorship.',
    image: GENERATED_ASSETS.teamMohammedFaisal,
  },
  {
    name: 'Mr. Jeevaraj',
    role: 'Research & Information Manager',
    focus: 'Labor Market Research, Skill Frameworks & Analytics',
    bio: 'Oversees employment data research, competency taxonomy design, and evidence-backed skill-gap mapping aligned with employer hiring needs.',
    image: GENERATED_ASSETS.teamJeevaraj,
  },
  {
    name: 'Mr. Sam Kevin Raj',
    role: 'Team Lead & Project Manager',
    focus: 'Product Execution, Engineering & Platform Delivery',
    bio: 'Coordinates platform engineering, assessment workflows, mentorship tooling, and end-to-end delivery across web and mobile experiences.',
    image: GENERATED_ASSETS.teamSamKevinRaj,
  },
];

export const INDIA_UNEMPLOYMENT_STATS = [
  { label: 'Overall Unemployment', value: 3.1, note: 'All-India general rate' },
  { label: 'Educated Unemployment', value: 6.5, note: 'Graduates & educated workforce' },
  { label: 'Youth Unemployment', value: 9.9, note: 'Young job seekers across India' },
  { label: 'Urban Youth Unemployment', value: 13.6, note: 'Youth in urban centers' },
];

export const INDIA_VS_QATAR_STATS = [
  { country: 'India', rate: 4.2, highlight: true },
  { country: 'Qatar', rate: 0.1, highlight: false },
];

export const MAJOR_CHALLENGES = [
  {
    title: 'Educated Graduates',
    description: 'Graduates struggle to find suitable jobs that match their academic qualifications and career aspirations.',
  },
  {
    title: 'Skill Mismatch',
    description: 'Candidate abilities and classroom theory frequently do not match practical employer requirements.',
  },
  {
    title: 'Companies Searching',
    description: 'Employers struggle to identify truly capable candidates amidst thousands of unverified resumes.',
  },
  {
    title: 'Freshers Without Experience',
    description: 'Fresh graduates lack practical industry experience and structured professional guidance.',
  },
];

export const ROOT_CAUSES = [
  {
    id: 'opportunities',
    title: 'Lack of Suitable Job Opportunities',
    summary: 'Limited alignment between regional degree output and structured entry-level roles.',
    detail: 'Many graduates cannot discover openings where their foundational aptitude is fairly evaluated beyond college pedigree.',
  },
  {
    id: 'mismatch',
    title: 'Skill Mismatch',
    summary: 'Academic syllabi evolve slower than modern engineering and workplace tooling.',
    detail: 'Employers seek applied problem-solving, version control, debugging, and domain communication that degrees rarely measure.',
  },
  {
    id: 'guidance',
    title: 'Lack of Professional Guidance',
    summary: 'Students rarely have direct access to practitioners currently working in their target roles.',
    detail: 'Without candid feedback from industry insiders, candidates spend months learning the wrong priorities.',
  },
  {
    id: 'experience',
    title: 'Limited Practical Experience',
    summary: 'Entry-level roles routinely ask for prior hands-on exposure.',
    detail: 'Candidates need guided real-world exercises and code or project reviews to demonstrate applied readiness.',
  },
  {
    id: 'rural',
    title: 'Rural Employment Difficulties',
    summary: 'Talent outside metro hubs faces steep geographic and informational barriers.',
    detail: 'Students from rural towns and villages often possess strong potential but lack local industry mentors and hiring visibility.',
  },
  {
    id: 'networks',
    title: 'Lack of Professional Networks',
    summary: 'Informal referrals and industry connections heavily influence hiring outcomes.',
    detail: 'First-generation graduates lack warm professional networks to understand workplace expectations or earn visibility.',
  },
];

export const EXISTING_SYSTEMS = [
  {
    system: 'Job Websites',
    limitation: 'Display vacancies but lack skill assessment and personal guidance.',
    missing: 'No skill diagnosis or mentorship',
  },
  {
    system: 'Employment Offices',
    limitation: 'Provide registration listings with limited personal career guidance.',
    missing: 'No AI gap analysis or industry bridge',
  },
  {
    system: 'Online Courses',
    limitation: 'Offer recorded content with limited direct professional mentorship.',
    missing: 'No employer-linked verification',
  },
  {
    system: 'Networking Platforms',
    limitation: 'Focus on social profiles rather than complete skill development.',
    missing: 'No structured training-to-hiring workflow',
  },
  {
    system: 'Recruitment Agencies',
    limitation: 'Often prioritise formal qualifications and prior work experience.',
    missing: 'Exclude capable freshers without resumes',
  },
];

export const SEVEN_INNOVATIONS = [
  {
    number: '01',
    title: 'AI Assessment Test',
    description: 'Evaluates actual knowledge and practical abilities through intelligent, job-specific assessments.',
    isMain: false,
  },
  {
    number: '02',
    title: 'AI Skill Analysis',
    description: 'Identifies strengths, weaknesses, and current proficiency levels across core competencies.',
    isMain: false,
  },
  {
    number: '03',
    title: 'Professional Employee Connection',
    description: 'Our core innovation. Connects unemployed candidates directly with experienced employees already working across companies and industries.',
    isMain: true,
  },
  {
    number: '04',
    title: 'Expert Guidance',
    description: 'Provides practical industry knowledge, technical feedback, and career direction from working professionals.',
    isMain: false,
  },
  {
    number: '05',
    title: 'Skill Development',
    description: 'Recommends personalised learning activities and practical projects tailored to identified skill gaps.',
    isMain: false,
  },
  {
    number: '06',
    title: 'Digital Skill Passport',
    description: 'Stores assessment results, verified skills, completed training, and practical achievements in one candidate-controlled profile.',
    isMain: false,
  },
  {
    number: '07',
    title: 'Employment Opportunities',
    description: 'Helps employers discover candidates with demonstrated abilities and verified skills ready for interviews.',
    isMain: false,
  },
];

export const WORKING_PROCESS_STEPS = [
  {
    step: 1,
    title: 'Employer Registration',
    actor: 'Employer',
    description: 'Companies register on SKILLORA AI and define target job roles along with required practical skills.',
  },
  {
    step: 2,
    title: 'AI Assessment Creation',
    actor: 'SKILLORA AI',
    description: 'AI generates role-specific conceptual and practical assessment tests tailored to company expectations.',
  },
  {
    step: 3,
    title: 'Candidate Registration & Assessment',
    actor: 'Candidate',
    description: 'Candidates create profiles, choose target career tracks, and complete interactive AI assessments.',
  },
  {
    step: 4,
    title: 'AI Skill Analysis',
    actor: 'SKILLORA AI',
    description: 'AI evaluates both objective and written responses to map strengths, gaps, and readiness.',
  },
  {
    step: 5,
    title: 'Professional Connection',
    actor: 'AI Match',
    description: 'Candidates are matched directly with experienced employees working in the exact target industry.',
  },
  {
    step: 6,
    title: 'Professional Guidance',
    actor: 'Mentor',
    description: 'Working professionals voluntarily provide practical advice, code reviews, and industry context.',
  },
  {
    step: 7,
    title: 'Personalised Skill Development',
    actor: 'Candidate & AI',
    description: 'AI recommends focused courses and hands-on projects to close verified skill gaps.',
  },
  {
    step: 8,
    title: 'Digital Skill Passport',
    actor: 'Candidate',
    description: 'Verified skills, completed training, and mentor endorsements are recorded with candidate privacy controls.',
  },
  {
    step: 9,
    title: 'Employer Review & Interview',
    actor: 'Employer',
    description: 'Companies review permitted Digital Skill Passports, shortlist talent, and send interview invitations.',
  },
  {
    step: 10,
    title: 'Employment & Career Growth',
    actor: 'Career Cycle',
    description: 'Candidates enter the workplace, continue growing, and can voluntarily return as mentors.',
  },
];

export const TAMIL_NADU_JOURNEY = [
  {
    beat: 1,
    actor: 'Employer',
    title: 'Role Requirement Published',
    detail: 'A software engineering team publishes a Junior Full-Stack Developer opening specifying TypeScript, REST APIs, and problem-solving skills.',
  },
  {
    beat: 2,
    actor: 'Candidate',
    title: 'Registration from Rural Tamil Nadu',
    detail: 'A 21-year-old computer science graduate from a village in Tamil Nadu registers on SKILLORA AI and completes the AI assessment from home.',
  },
  {
    beat: 3,
    actor: 'AI Analysis',
    title: 'Skill Gaps Identified',
    detail: 'SKILLORA AI recognizes strong algorithmic fundamentals while identifying gaps in REST API error handling and database schema design.',
  },
  {
    beat: 4,
    actor: 'AI Match',
    title: 'Connected to an Experienced Developer',
    detail: 'The platform matches the student with a working Software Developer who volunteers 2 hours a week without leaving their current job.',
  },
  {
    beat: 5,
    actor: 'Mentorship',
    title: 'Practical Industry Guidance',
    detail: 'Over live sessions and messages, the mentor explains production API patterns, code reviews, and real engineering trade-offs.',
  },
  {
    beat: 6,
    actor: 'Skill Development',
    title: 'Training & Projects Completed',
    detail: 'The student completes AI-recommended modules and builds a verified API project reviewed directly by their mentor.',
  },
  {
    beat: 7,
    actor: 'Verification',
    title: 'Digital Skill Passport Updated',
    detail: 'Assessment scores, practical achievements, and mentor feedback are recorded in the student’s Digital Skill Passport.',
  },
  {
    beat: 8,
    actor: 'Permissioned Discovery',
    title: 'Employer Reviews Profile',
    detail: 'With the student’s explicit sharing permission, hiring teams inspect the verified skill evidence rather than relying on college location.',
  },
  {
    beat: 9,
    actor: 'Opportunity',
    title: 'Interview Invitation Received',
    detail: 'Impressed by demonstrated skills and mentor-reviewed work, the company sends a formal interview invitation.',
  },
];

export const TECHNOLOGIES = [
  {
    name: 'Artificial Intelligence',
    role: 'Assessment generation and multidimensional skill analysis.',
  },
  {
    name: 'Machine Learning',
    role: 'Skill-gap pattern detection and personalised learning recommendations.',
  },
  {
    name: 'Natural Language Processing',
    role: 'Semantic evaluation of written technical answers and reasoning.',
  },
  {
    name: 'Cloud Database',
    role: 'Reliable, structured storage for candidate profiles, assessments, and records.',
  },
  {
    name: 'Mobile Application',
    role: 'Low-bandwidth accessibility for rural candidates and busy professionals.',
  },
  {
    name: 'Video Conferencing',
    role: 'Integrated remote mentorship sessions and practical feedback calls.',
  },
  {
    name: 'Cybersecurity',
    role: 'Role-based permissions and candidate-controlled profile privacy protection.',
  },
];

export const EXPECTED_IMPACTS = [
  'Reduce the Education-Employment Gap',
  'Improve Practical and Industry Skills',
  'Support Rural and Disadvantaged Candidates',
  'Increase Mentorship Access',
  'Help Companies Find Capable Talent',
  'Encourage Continuous Learning',
];

export const TARGET_AUDIENCES = [
  {
    title: 'Recent Graduates',
    description: 'Bridge degree knowledge to workplace-ready applied engineering and domain competencies.',
  },
  {
    title: 'Rural Candidates',
    description: 'Access structured AI evaluation and direct industry mentorship regardless of city or campus network.',
  },
  {
    title: 'Career Changers',
    description: 'Validate transferable abilities, pinpoint exact skill gaps, and build verifiable project proof.',
  },
  {
    title: 'Hiring Companies',
    description: 'Discover candidates by verified capability and practical evidence instead of unverified resumes.',
  },
];

export const DEMO_MENTORS: MentorProfile[] = [
  {
    id: 'mentor-1',
    name: 'Aravind Krishnan (Demo Profile)',
    designation: 'Senior Software Engineer',
    companyLabel: 'Demo Enterprise Cloud Team',
    industry: 'Software Development',
    yearsExperience: 7,
    location: 'Chennai, Tamil Nadu',
    expertise: ['TypeScript', 'React', 'Node.js & REST APIs', 'System Design'],
    availability: 'Available This Week',
    bio: 'Working full-stack engineer volunteering 3 hours weekly to help fresh graduates transition from textbook syntax to production web engineering.',
    careerAdvice: 'Focus on building two end-to-end projects with proper error handling, authentication, and clean documentation rather than ten half-finished tutorials.',
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Karthik M. (Demo Candidate)',
        rating: 5,
        comment: 'Reviewed my REST API architecture line by line and clarified what engineering teams actually test in technical rounds.',
        date: 'Demo Session Note',
      },
    ],
    isDemoData: true,
  },
  {
    id: 'mentor-2',
    name: 'Priya Dharshini (Demo Profile)',
    designation: 'Lead Data & ML Engineer',
    companyLabel: 'Demo FinTech Analytics',
    industry: 'Data Science & AI',
    yearsExperience: 6,
    location: 'Bengaluru, Karnataka',
    expertise: ['Python', 'SQL Analytics', 'Machine Learning Pipelines', 'Data Modeling'],
    availability: 'Weekend Sessions',
    bio: 'Voluntary mentor guiding recent graduates and rural learners on applied SQL, analytical thinking, and practical machine learning evaluation.',
    careerAdvice: 'Always explain why you chose a model or query structure and how it affects business decisions—clarity beats buzzwords.',
    reviews: [
      {
        id: 'rev-2',
        authorName: 'Divya S. (Demo Candidate)',
        rating: 5,
        comment: 'Helped me close my SQL window-function gap in two weeks with practical datasets.',
        date: 'Demo Session Note',
      },
    ],
    isDemoData: true,
  },
  {
    id: 'mentor-3',
    name: 'Vikram Deshmukh (Demo Profile)',
    designation: 'Cloud & DevOps Architect',
    companyLabel: 'Demo SaaS Infrastructure',
    industry: 'Cloud & Infrastructure',
    yearsExperience: 9,
    location: 'Pune, Maharashtra',
    expertise: ['Linux & Networking', 'Docker', 'CI/CD Pipelines', 'Cloud Security'],
    availability: 'Limited Slots',
    bio: 'Infrastructure engineer mentoring aspiring cloud specialists while maintaining his full-time role.',
    careerAdvice: 'Understand HTTP, DNS, Linux permissions, and container logs deeply before memorizing cloud service names.',
    reviews: [
      {
        id: 'rev-3',
        authorName: 'Rohan P. (Demo Candidate)',
        rating: 5,
        comment: 'Turned abstract deployment concepts into a clear step-by-step checklist.',
        date: 'Demo Session Note',
      },
    ],
    isDemoData: true,
  },
];

export const DEMO_JOBS: JobOpening[] = [
  {
    id: 'job-1',
    companyName: 'Apex Cloud Systems (Demo Employer)',
    roleTitle: 'Junior Full-Stack Software Developer',
    industry: 'Software Development',
    location: 'Chennai / Remote',
    workMode: 'Hybrid',
    requiredSkills: ['TypeScript', 'React', 'REST APIs', 'SQL Basics', 'Problem Solving'],
    description: 'Seeking capable early-career developers assessed on practical frontend state management, API design, and debugging fundamentals.',
    assessmentReady: true,
    postedAt: 'Demo Opening',
    isDemoData: true,
  },
  {
    id: 'job-2',
    companyName: 'Nila Data Labs (Demo Employer)',
    roleTitle: 'Associate Data Analyst',
    industry: 'Data Science & AI',
    location: 'Coimbatore / Remote',
    workMode: 'Remote',
    requiredSkills: ['SQL', 'Python', 'Data Cleaning', 'Statistical Thinking'],
    description: 'Entry-level analytical role welcoming graduates with verified query design skills and practical dataset projects.',
    assessmentReady: true,
    postedAt: 'Demo Opening',
    isDemoData: true,
  },
  {
    id: 'job-3',
    companyName: 'Vanguard Edge Tech (Demo Employer)',
    roleTitle: 'Cloud Support & DevOps Trainee',
    industry: 'Cloud & Infrastructure',
    location: 'Bengaluru',
    workMode: 'On-site',
    requiredSkills: ['Linux Fundamentals', 'Git', 'Docker Basics', 'Troubleshooting'],
    description: 'Hands-on infrastructure trainee track focused on verifiable troubleshooting ability rather than prior job titles.',
    assessmentReady: true,
    postedAt: 'Demo Opening',
    isDemoData: true,
  },
];

export const INITIAL_PASSPORT: DigitalSkillPassport = {
  candidateId: 'cand-demo-1',
  candidateName: 'Ananya Sundaram (Demo Candidate)',
  headline: 'Aspiring Full-Stack Software Developer',
  location: 'Madurai District, Tamil Nadu',
  education: 'B.E. Computer Science (2025 Graduate)',
  email: 'ananya.demo@example.org',
  targetRole: 'Junior Full-Stack Software Developer',
  assessmentResults: [
    {
      role: 'Junior Full-Stack Software Developer',
      score: 78,
      date: 'Demo Baseline',
      source: 'Skillora Baseline Assessment (Demo)',
    },
  ],
  verifiedSkills: [
    { name: 'JavaScript & TypeScript Core', verifiedBy: 'AI Assessment', score: 82 },
    { name: 'React Component Architecture', verifiedBy: 'AI + Mentor Verified', score: 79 },
    { name: 'REST API Design & Error Handling', verifiedBy: 'Mentor Review', score: 74 },
  ],
  completedTraining: [
    'TypeScript Strict Modeling & Async Patterns',
    'HTTP Status Codes & REST Validation Workshop',
  ],
  practicalAchievements: [
    'Built a paginated task tracker with Express API validation',
    'Completed mentor code-review checklist on state immutability',
  ],
  mentorFeedback: [
    {
      mentorName: 'Aravind Krishnan (Demo Profile)',
      mentorDesignation: 'Senior Software Engineer',
      note: 'Strong problem decomposition and clean React structure. Continue practicing relational SQL joins and API edge-case testing.',
      date: 'Demo Review',
    },
  ],
  permissions: {
    publicLinkEnabled: false,
    allowVerifiedEmployers: true,
    allowedEmployerNames: ['Apex Cloud Systems (Demo Employer)'],
    showContactEmail: false,
  },
  updatedAt: new Date().toISOString(),
};

export const INITIAL_LEARNING_PLAN: LearningPlan = {
  targetRole: 'Junior Full-Stack Software Developer',
  courses: [
    {
      id: 'course-1',
      title: 'Production REST API Error Handling & Validation',
      provider: 'Skillora Guided Track (Demo)',
      targetSkill: 'REST APIs',
      duration: '4 hours',
      level: 'Intermediate',
      reason: 'Bridges foundational Express routes to production input validation and status codes.',
      completed: true,
    },
    {
      id: 'course-2',
      title: 'Relational SQL Queries & Schema Normalization',
      provider: 'Skillora Guided Track (Demo)',
      targetSkill: 'SQL Basics',
      duration: '5 hours',
      level: 'Intermediate',
      reason: 'Addresses detected gap in multi-table joins and indexing basics.',
      completed: false,
    },
    {
      id: 'course-3',
      title: 'React State Management & Async Edge Cases',
      provider: 'Skillora Guided Track (Demo)',
      targetSkill: 'React',
      duration: '3.5 hours',
      level: 'Intermediate',
      reason: 'Strengthens loading, empty, and retry states in interactive interfaces.',
      completed: true,
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Build a Skill-Verified Task API with Schema Validation',
      description: 'Design an Express + TypeScript backend endpoint with structured error responses and test cases.',
      targetSkills: ['TypeScript', 'REST APIs'],
      deliverable: 'Git repository + API error test matrix',
      mentorReviewStatus: 'Reviewed by Mentor',
      mentorNote: 'Clean request validation. Add rate-limit header handling next.',
      completed: true,
    },
    {
      id: 'proj-2',
      title: 'Candidate Application Tracker Query Workbench',
      description: 'Write parameterized queries filtering candidates by verified skill scores without N+1 lookups.',
      targetSkills: ['SQL Basics', 'Problem Solving'],
      deliverable: 'SQL schema + query benchmark report',
      mentorReviewStatus: 'Submitted for Review',
      completed: false,
    },
  ],
  mentorChecklist: [
    'Walk through one live debugging session using browser network & console tools',
    'Explain trade-offs between client state and server state during mentor review',
    'Demonstrate clean git commit history on practical project repository',
  ],
  generatedAt: new Date().toISOString(),
  isLiveAI: false,
};

export const INITIAL_MENTORSHIP_REQUESTS: MentorshipRequest[] = [
  {
    id: 'req-1',
    candidateId: 'cand-demo-1',
    candidateName: 'Ananya Sundaram (Demo Candidate)',
    candidateGoal: 'Transition from college CS theory to Junior Full-Stack Software Developer readiness.',
    mentorId: 'mentor-1',
    mentorName: 'Aravind Krishnan (Demo Profile)',
    status: 'accepted',
    message: 'Hello Aravind, my AI skill analysis highlighted REST API error handling and SQL joins as growth areas. Would love your practical feedback.',
    createdAt: 'Demo Active Connection',
  },
  {
    id: 'req-2',
    candidateId: 'cand-demo-2',
    candidateName: 'Prakash R. (Demo Candidate)',
    candidateGoal: 'Prepare for Associate Data Analyst SQL & Python assessments.',
    mentorId: 'mentor-2',
    mentorName: 'Priya Dharshini (Demo Profile)',
    status: 'pending',
    message: 'Seeking guidance on structuring analytical case studies and improving Python pandas fluency.',
    createdAt: 'Demo Pending Request',
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    requestId: 'req-1',
    senderId: 'cand-demo-1',
    senderName: 'Ananya Sundaram (Demo Candidate)',
    senderRole: 'candidate',
    text: 'Thank you for accepting my mentorship request! I completed the REST API validation module and pushed my project.',
    timestamp: '10:15 AM',
  },
  {
    id: 'msg-2',
    requestId: 'req-1',
    senderId: 'mentor-1',
    senderName: 'Aravind Krishnan (Demo Profile)',
    senderRole: 'professional',
    text: 'Great progress, Ananya. Your TypeScript types look solid. Let us review edge-case HTTP 400 vs 422 handling in our live session.',
    timestamp: '10:22 AM',
  },
];

export const DEMO_CANDIDATES: CandidateDirectoryItem[] = [
  {
    id: 'cand-demo-1',
    name: 'Ananya Sundaram (Demo Candidate)',
    location: 'Madurai District, Tamil Nadu',
    targetRole: 'Junior Full-Stack Software Developer',
    education: 'B.E. Computer Science (2025)',
    topSkills: ['TypeScript', 'React', 'REST APIs', 'Problem Solving'],
    assessmentScore: 78,
    passport: INITIAL_PASSPORT,
    shortlisted: true,
    interviewInvited: false,
    isDemoData: true,
  },
  {
    id: 'cand-demo-2',
    name: 'Prakash Rajendran (Demo Candidate)',
    location: 'Thanjavur, Tamil Nadu',
    targetRole: 'Associate Data Analyst',
    education: 'B.Sc. Mathematics & Computing (2025)',
    topSkills: ['SQL', 'Python', 'Statistical Thinking', 'Data Cleaning'],
    assessmentScore: 81,
    passport: {
      ...INITIAL_PASSPORT,
      candidateId: 'cand-demo-2',
      candidateName: 'Prakash Rajendran (Demo Candidate)',
      headline: 'Aspiring Data Analyst',
      location: 'Thanjavur, Tamil Nadu',
      education: 'B.Sc. Mathematics & Computing (2025)',
      targetRole: 'Associate Data Analyst',
      verifiedSkills: [
        { name: 'SQL Query Design', verifiedBy: 'AI Assessment', score: 84 },
        { name: 'Python Data Manipulation', verifiedBy: 'AI + Mentor Verified', score: 79 },
      ],
      permissions: {
        publicLinkEnabled: false,
        allowVerifiedEmployers: true,
        allowedEmployerNames: [],
        showContactEmail: false,
      },
    },
    shortlisted: false,
    interviewInvited: false,
    isDemoData: true,
  },
  {
    id: 'cand-demo-3',
    name: 'Meenakshi K. (Demo Candidate)',
    location: 'Salem, Tamil Nadu',
    targetRole: 'Cloud Support & DevOps Trainee',
    education: 'B.Tech Information Technology (2024)',
    topSkills: ['Linux Fundamentals', 'Git', 'Docker Basics', 'Troubleshooting'],
    assessmentScore: 75,
    passport: {
      ...INITIAL_PASSPORT,
      candidateId: 'cand-demo-3',
      candidateName: 'Meenakshi K. (Demo Candidate)',
      headline: 'Cloud & Infrastructure Trainee',
      location: 'Salem, Tamil Nadu',
      education: 'B.Tech Information Technology (2024)',
      targetRole: 'Cloud Support & DevOps Trainee',
      verifiedSkills: [
        { name: 'Linux & Shell Scripting', verifiedBy: 'AI Assessment', score: 77 },
        { name: 'Container Troubleshooting', verifiedBy: 'Mentor Review', score: 73 },
      ],
      permissions: {
        publicLinkEnabled: false,
        allowVerifiedEmployers: false,
        allowedEmployerNames: [],
        showContactEmail: false,
      },
    },
    shortlisted: false,
    interviewInvited: false,
    isDemoData: true,
  },
];
