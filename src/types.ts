export type LearnerMode = "Student" | "Individual" | "Organization";

export type LanguageCode = "en" | "ta" | "es" | "fr" | "de" | "hi" | "ja";

export type WorkspaceTab =
  | "overview"
  | "roadmap"
  | "coach"
  | "quiz"
  | "rankings"
  | "profile"
  | "planner";

export type AuthProviderType = "google" | "email" | "mobile";

export interface SkillHistoryPoint {
  date: string;
  label: string;
  points: number;
  brainScore: number;
}

export interface SkillRadarMetrics {
  foundations: number;
  brainLogic: number;
  practicalLabs: number;
  quizAccuracy: number;
  consistency: number;
}

export interface RankedUser {
  id: string;
  name: string;
  age: number;
  dob: string;
  mode: LearnerMode;
  email?: string;
  mobile?: string;
  authProvider: AuthProviderType;
  avatarUrl?: string;
  skills: string;
  projects: string;
  target_role: string;
  details: string;
  points: number;
  brainScore: number;
  quizzesPassed: number;
  completedExercisesCount: number;
  dailyStreak: number;
  lastDailyUpdate: string;
  skillHistory: SkillHistoryPoint[];
  radarMetrics: SkillRadarMetrics;
  rank: number;
  joinedAt: string;
}

export interface LearnerProfile {
  mode: LearnerMode;
  name: string;
  age: number;
  dob: string;
  email?: string;
  mobile?: string;
  avatarUrl?: string;
  skills: string;
  projects: string;
  target_role: string;
  details: string;
  mentor_note: string;
}

export interface SkillAnalysis {
  strengths: string[];
  missing_skills: string[];
  match_percentage: number;
  summary: string;
  recommended_projects: string[];
}

export interface RoadmapStep {
  week: number;
  skill: string;
  title: string;
  courses_and_tutorials: string[];
  practical_exercise: string;
}

export interface FullPipelineOutput {
  analysis: SkillAnalysis;
  roadmap: RoadmapStep[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer_index: number;
  explanation?: string;
}

export interface QuizOutput {
  questions: QuizQuestion[];
}

export interface AiAskedQuestion {
  id: string;
  mode: LearnerMode;
  topic: string;
  question: string;
  hint: string;
  sample_key_points: string[];
}

export interface AiAnswerEvaluation {
  score: number;
  pointsEarned: number;
  feedback: string;
  ideal_answer: string;
  next_question: AiAskedQuestion;
}

export interface QuizAttempt {
  id: string;
  skill: string;
  mode: LearnerMode;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export interface SkillCoachPlan {
  focus_summary: string;
  daily_drills: string[];
  mode_project_challenge: string;
  next_milestone: string;
  recommended_skills_to_add: string[];
}

export interface MentorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface StorageGuideSummary {
  storageFile: string;
  lastUpdated: string;
  totalLearnedQuestions: number;
  modeGuidance: Record<
    LearnerMode,
    {
      focus: string;
      brainFocus: string;
      dailyTargetPoints: number;
      corePillars: string[];
    }
  >;
  recentLearnedTopics: Array<{
    topic: string;
    mode: LearnerMode;
    askedAt: string;
  }>;
}

export interface StudentProgressState {
  currentUserId: string | null;
  isAuthenticated: boolean;
  authProvider: AuthProviderType;
  profile: LearnerProfile;
  plan: FullPipelineOutput;
  completedExercises: number[];
  completedCourses: string[];
  quizAttempts: QuizAttempt[];
  coachPlan: SkillCoachPlan | null;
  mentorMessages: MentorMessage[];
  lastUpdated: string;
}
