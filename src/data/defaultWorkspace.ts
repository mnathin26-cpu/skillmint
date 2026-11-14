import type { LearnerMode, LearnerProfile, StudentProgressState } from "../types";

export const MODE_SEPARATED_SKILLS: Record<LearnerMode, string[]> = {
  Student: [
    "Data Structures & Algorithms",
    "Python Programming & OOP",
    "Web Foundations (HTML, CSS, React)",
    "Relational SQL & Campus Databases",
    "Git & Collaborative Coding",
    "Technical Interview & Placement Prep",
  ],
  Individual: [
    "Full-Stack TypeScript & APIs",
    "Personal Portfolio Architecture",
    "UI/UX Product Engineering",
    "Freelance Client Delivery & Scoping",
    "System Design & Scalability",
    "Applied AI Integration",
  ],
  Organization: [
    "Enterprise Cloud Governance",
    "Microservices & Docker/Kubernetes",
    "CI/CD & Automated Quality Gates",
    "Zero-Trust Security & SOC2 Compliance",
    "AI Workflow Automation for Teams",
    "Engineering KPIs & Observability",
  ],
};

export const DEFAULT_PROGRESS_STATE: StudentProgressState = {
  currentUserId: "user-maya-student",
  isAuthenticated: false,
  authProvider: "email",
  profile: {
    mode: "Student",
    name: "Maya Chen",
    age: 20,
    dob: "2006-08-14",
    email: "maya.chen@university.edu",
    mobile: "+1 415 555 0192",
    avatarUrl: "/src/assets/images/avatar_learner_profile_1794635815463.jpg",
    skills: "Python, TypeScript, React, Data Structures, SQL Fundamentals",
    projects: "Campus Study Planner App, REST API Coursework",
    target_role: "Full-Stack Cloud Engineer",
    details:
      "Junior Computer Science undergraduate preparing for summer software engineering internships.",
    mentor_note: "Prioritize practical cloud deployment and automated testing.",
  },
  plan: {
    analysis: {
      strengths: [
        "Strong academic foundation in React, TypeScript, and Python coursework",
        "Clean version control workflow using Git and relational SQL fundamentals",
        "Hands-on campus project experience building full-stack prototypes",
      ],
      missing_skills: [
        "Containerization with Docker and multi-service local orchestration",
        "Automated API integration testing and error validation",
        "Cloud deployment workflows and CI/CD pipelines",
      ],
      match_percentage: 68,
      summary:
        "Maya demonstrates strong Computer Science fundamentals well suited for summer engineering internships. Focusing the next four weeks on containerization, automated testing, and cloud deployment will raise internship readiness to production standards.",
      recommended_projects: [
        "Containerized Student Task API with Docker, PostgreSQL, and GitHub Actions",
        "Campus Placement Prep Tracker with Automated Integration Tests",
      ],
    },
    roadmap: [
      {
        week: 1,
        skill: "Docker & Containerization",
        title: "Containerizing Student Full-Stack Projects",
        courses_and_tutorials: [
          "Docker Official Getting Started Guide (Multi-stage Builds)",
          "Docker Compose for Local Backend & Database Workflows",
        ],
        practical_exercise:
          "Write a multi-stage Dockerfile and compose setup for your Campus Study Planner app with health checks.",
      },
      {
        week: 2,
        skill: "REST API Testing & Security",
        title: "Reliable Backend Services & Automated Testing",
        courses_and_tutorials: [
          "Integration Testing Express APIs with Vitest & Supertest",
          "OWASP API Security Top 10 Essentials for Developers",
        ],
        practical_exercise:
          "Build an automated test suite covering validation, error responses, and edge cases on 3 REST endpoints.",
      },
      {
        week: 3,
        skill: "CI/CD Pipelines",
        title: "Automated Builds & Continuous Delivery",
        courses_and_tutorials: [
          "GitHub Actions Workflow Design for TypeScript Repositories",
          "Automated Linting, Typechecking, and Build Verification",
        ],
        practical_exercise:
          "Configure a GitHub Actions pipeline that runs typechecks, unit tests, and builds a container on push.",
      },
      {
        week: 4,
        skill: "Cloud Deployment & Observability",
        title: "Production Cloud Hosting & Monitoring",
        courses_and_tutorials: [
          "Deploying Containerized Apps to Managed Cloud Services",
          "Structured Logging & Latency Alerting Fundamentals",
        ],
        practical_exercise:
          "Deploy your containerized project with environment secrets and verify live structured request logs.",
      },
    ],
  },
  completedExercises: [1],
  completedCourses: ["1-0", "1-1", "2-0"],
  quizAttempts: [
    {
      id: "initial-docker-quiz",
      skill: "Docker & Containerization",
      mode: "Student",
      score: 3,
      total: 3,
      percentage: 100,
      completedAt: "2026-11-12",
    },
  ],
  coachPlan: null,
  mentorMessages: [],
  lastUpdated: "2026-11-13",
};

export const EXAMPLE_PROFILES: Array<{
  id: string;
  label: string;
  profile: LearnerProfile;
}> = [
  {
    id: "cs-student",
    label: "Student (School / College) → Full-Stack Cloud",
    profile: {
      mode: "Student",
      name: "Maya Chen",
      age: 20,
      dob: "2006-08-14",
      email: "maya.chen@university.edu",
      skills: "Python, TypeScript, React, Data Structures, SQL Fundamentals",
      projects: "Campus Study Planner App, REST API Coursework",
      target_role: "Full-Stack Cloud Engineer",
      details: "Computer Science undergraduate preparing for internships.",
      mentor_note: "Prioritize practical cloud deployment and automated testing.",
    },
  },
  {
    id: "data-transition",
    label: "Individual (Own Skills) → AI Product Engineer",
    profile: {
      mode: "Individual",
      name: "Priya Natarajan",
      age: 25,
      dob: "2001-02-09",
      mobile: "+91 98401 22410",
      skills: "UI/UX Design Systems, React, Tailwind CSS, Freelance Client Delivery",
      projects: "SaaS Analytics Redesign, E-Commerce Accessibility Audit",
      target_role: "Senior Product Engineer",
      details: "Independent designer expanding into full-stack AI product engineering.",
      mentor_note: "Focus on portfolio architecture and API integration.",
    },
  },
  {
    id: "org-cohort",
    label: "Company (Enterprise Model) → Cloud Security Architect",
    profile: {
      mode: "Organization",
      name: "Arjun Krishnan",
      age: 29,
      dob: "1997-04-18",
      email: "arjun.k@nexustech.io",
      skills: "Enterprise Cloud Governance, Kubernetes, Microservices CI/CD, SOC2 Compliance",
      projects: "Zero-Trust Internal Developer Platform, Multi-Region Failover",
      target_role: "Principal Cloud Platform Architect",
      details: "Company platform lead driving enterprise resilience and team KPIs.",
      mentor_note: "Align weekly labs with measurable SLA and compliance KPIs.",
    },
  },
];
