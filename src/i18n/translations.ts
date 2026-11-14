import type { LanguageCode, LearnerMode } from "../types";

export interface LanguageOption {
  code: LanguageCode;
  nativeLabel: string;
  englishName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", nativeLabel: "English", englishName: "English" },
  { code: "ta", nativeLabel: "தமிழ்", englishName: "Tamil" },
  { code: "es", nativeLabel: "Español", englishName: "Spanish" },
  { code: "fr", nativeLabel: "Français", englishName: "French" },
  { code: "de", nativeLabel: "Deutsch", englishName: "German" },
  { code: "hi", nativeLabel: "हिन्दी", englishName: "Hindi" },
  { code: "ja", nativeLabel: "日本語", englishName: "Japanese" },
];

export interface TranslationDictionary {
  brandName: string;
  workspaceLabel: string;
  nav: {
    overview: string;
    roadmap: string;
    coach: string;
    quiz: string;
    rankings: string;
    profile: string;
    planner: string;
  };
  actions: {
    newPlan: string;
    continueWeek: string;
    takeQuiz: string;
    generatePlan: string;
    generatingPlan: string;
    generateQuiz: string;
    generatingQuiz: string;
    markComplete: string;
    completed: string;
    submitQuiz: string;
    nextSkill: string;
    retakeQuiz: string;
    backToRoadmap: string;
    resetProgress: string;
    dismissGuide: string;
    signOut: string;
    saveProfile: string;
    addUser: string;
  };
  modes: Record<LearnerMode, string>;
  modeTracks: Record<LearnerMode, string>;
  modeDescriptions: Record<LearnerMode, string>;
  auth: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    signInTitle: string;
    signInSubtitle: string;
    tabs: {
      email: string;
      mobile: string;
      google: string;
    };
    emailLabel: string;
    emailPlaceholder: string;
    mobileLabel: string;
    mobilePlaceholder: string;
    sendOtp: string;
    sendingOtp: string;
    otpLabel: string;
    otpPlaceholder: string;
    verifyOtp: string;
    verifyingOtp: string;
    resendOtp: string;
    otpSentBanner: string;
    autofillOtp: string;
    googleButton: string;
    googleNameLabel: string;
    googleEmailLabel: string;
    googleHint: string;
    completeProfileTitle: string;
    completeProfileSubtitle: string;
    finishSetup: string;
    demoBypass: string;
  };
  overview: {
    welcomePrefix: string;
    targetGoalLabel: string;
    kpis: {
      roleReadiness: string;
      roleReadinessSub: string;
      roadmapProgress: string;
      roadmapProgressSub: string;
      assessmentsPassed: string;
      assessmentsPassedSub: string;
      globalRank: string;
      globalRankSub: string;
    };
    weeklyProgressTitle: string;
    weeklyProgressDesc: string;
    skillGapTitle: string;
    strengthsLabel: string;
    focusAreasLabel: string;
    quizHistoryTitle: string;
    quizHistoryEmpty: string;
    quizHistoryEmptyDesc: string;
    tableHeaders: {
      skill: string;
      score: string;
      status: string;
      date: string;
      action: string;
    };
    statusLabels: {
      passed: string;
      review: string;
    };
    guideTitle: string;
    guideSteps: [
      { title: string; desc: string },
      { title: string; desc: string },
      { title: string; desc: string }
    ];
  };
  roadmap: {
    title: string;
    subtitle: string;
    allWeeks: string;
    weekLabel: string;
    strengths: string;
    missingSkills: string;
    recommendedProjects: string;
    coursesTitle: string;
    practicalExerciseTitle: string;
    testSkillCta: string;
    progressLabel: string;
    modeSkillCatalogTitle: string;
  };
  coach: {
    title: string;
    subtitle: string;
    focusSkillLabel: string;
    focusSkillPlaceholder: string;
    generateCoachBtn: string;
    generatingCoachBtn: string;
    blueprintTitle: string;
    dailyDrillsTitle: string;
    challengeTitle: string;
    milestoneTitle: string;
    suggestedSkillsTitle: string;
    addSkillBtn: string;
    mentorTitle: string;
    mentorSubtitle: string;
    mentorPlaceholder: string;
    sendMessage: string;
  };
  quiz: {
    title: string;
    subtitle: string;
    topicLabel: string;
    topicPlaceholder: string;
    quickTopicsLabel: string;
    modeLabel: string;
    questionPrefix: string;
    ofLabel: string;
    correctLabel: string;
    reviewLabel: string;
    explanationLabel: string;
    scoreSummaryTitle: string;
    passedMessage: string;
    reviewMessage: string;
    emptyTitle: string;
    emptyDesc: string;
    selectAllPrompt: string;
  };
  rankings: {
    title: string;
    subtitle: string;
    filterAll: string;
    addUserTitle: string;
    addUserSubtitle: string;
    tableHeaders: {
      rank: string;
      learner: string;
      track: string;
      ageDob: string;
      skills: string;
      points: string;
    };
    youBadge: string;
    quizzesLabel: string;
  };
  profilePage: {
    title: string;
    subtitle: string;
    savedNotice: string;
    fields: {
      name: string;
      age: string;
      dob: string;
      mode: string;
      email: string;
      mobile: string;
      skills: string;
      projects: string;
      targetRole: string;
      details: string;
    };
    rankCardTitle: string;
    pointsLabel: string;
    modeSkillsTitle: string;
    modeSkillsDesc: string;
  };
  planner: {
    title: string;
    subtitle: string;
    presetsTitle: string;
    presetsSubtitle: string;
    agentFeedTitle: string;
    form: {
      modeLabel: string;
      nameLabel: string;
      namePlaceholder: string;
      skillsLabel: string;
      skillsPlaceholder: string;
      projectsLabel: string;
      projectsPlaceholder: string;
      targetRoleLabel: string;
      targetRolePlaceholder: string;
      mentorNoteLabel: string;
      mentorNotePlaceholder: string;
    };
    howItWorksTitle: string;
    agent1Title: string;
    agent1Desc: string;
    agent2Title: string;
    agent2Desc: string;
    agent3Title: string;
    agent3Desc: string;
  };
  common: {
    languageLabel: string;
    loading: string;
    errorTitle: string;
    weekShort: string;
    exercisesLabel: string;
    coursesLabel: string;
    pts: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brandName: "SkillMint",
    workspaceLabel: "Workspace",
    nav: {
      overview: "Overview",
      roadmap: "Learning Plan",
      coach: "AI Skill Coach & Lab",
      quiz: "Quiz & Brain Lab",
      rankings: "User Rankings",
      profile: "My Profile",
      planner: "New AI Plan",
    },
    actions: {
      newPlan: "New Learning Plan",
      continueWeek: "Continue Week",
      takeQuiz: "Take Quiz",
      generatePlan: "Run Autonomous AI Agents",
      generatingPlan: "Agents Analyzing...",
      generateQuiz: "Generate 3-Question Quiz",
      generatingQuiz: "Preparing Assessment...",
      markComplete: "Mark Exercise Complete",
      completed: "Completed",
      submitQuiz: "Check Answers",
      nextSkill: "Try Another Skill",
      retakeQuiz: "New Questions",
      backToRoadmap: "Back to Roadmap",
      resetProgress: "Reset Workspace",
      dismissGuide: "Hide Guide",
      signOut: "Sign Out / Switch User",
      saveProfile: "Save Profile & Update Rank",
      addUser: "Add Another User",
    },
    modes: {
      Student: "Student",
      Individual: "Individual",
      Organization: "Company",
    },
    modeTracks: {
      Student: "School & College Skills",
      Individual: "Personal & Career Skills",
      Organization: "Company Model Skills",
    },
    modeDescriptions: {
      Student: "School & college foundations, coursework labs, internships, and placement readiness",
      Individual: "Personal skill mastery, portfolio engineering, freelancing, and career pivots",
      Organization: "Company-based model skills, enterprise cloud governance, team KPIs, and security",
    },
    auth: {
      heroBadge: "Multi-Agent Skill Intelligence Platform",
      heroTitle: "Close Skill Gaps Faster for Students, Individuals & Companies",
      heroSubtitle:
        "Sign in with Google, Email OTP, or Mobile OTP to build your profile, develop mode-specific skills with AI coaching, and climb the live learner rankings.",
      signInTitle: "Sign in to SkillMint",
      signInSubtitle: "Choose Google, Email OTP, or Mobile OTP to access your workspace.",
      tabs: {
        email: "Email OTP",
        mobile: "Mobile OTP",
        google: "Google",
      },
      emailLabel: "Email Address",
      emailPlaceholder: "name@company.com or student@college.edu",
      mobileLabel: "Mobile Number",
      mobilePlaceholder: "+91 98401 22410",
      sendOtp: "Send OTP",
      sendingOtp: "Sending OTP...",
      otpLabel: "6-Digit Verification Code",
      otpPlaceholder: "Enter 6-digit OTP",
      verifyOtp: "Verify & Continue",
      verifyingOtp: "Verifying...",
      resendOtp: "Resend Code",
      otpSentBanner: "OTP sent! Verification code:",
      autofillOtp: "Autofill Code",
      googleButton: "Continue with Google",
      googleNameLabel: "Google Account Name",
      googleEmailLabel: "Google Email",
      googleHint: "Sign in directly with your Google profile details.",
      completeProfileTitle: "Complete Your Learner Profile",
      completeProfileSubtitle: "Add your details to personalize your track skills and initial rank.",
      finishSetup: "Create Profile & Enter Dashboard",
      demoBypass: "Preview with Demo Account",
    },
    overview: {
      welcomePrefix: "Progress Overview",
      targetGoalLabel: "Target Role",
      kpis: {
        roleReadiness: "Role Match Readiness",
        roleReadinessSub: "Skill profiler baseline",
        roadmapProgress: "Roadmap Completion",
        roadmapProgressSub: "Courses & lab exercises",
        assessmentsPassed: "Skills Verified",
        assessmentsPassedSub: "Quizzes scored 67%+",
        globalRank: "Leaderboard Rank",
        globalRankSub: "Ranked across active learners",
      },
      weeklyProgressTitle: "4-Week Curriculum Progress",
      weeklyProgressDesc: "Track weekly courses, hands-on labs, and earn ranking points.",
      skillGapTitle: "Skill Profile Snapshot",
      strengthsLabel: "Verified Strengths",
      focusAreasLabel: "Priority Growth Areas",
      quizHistoryTitle: "Recent Assessment Log",
      quizHistoryEmpty: "No assessments recorded yet",
      quizHistoryEmptyDesc: "Complete a 3-question skill assessment to earn points and rank higher.",
      tableHeaders: {
        skill: "Skill Topic",
        score: "Score",
        status: "Status",
        date: "Date",
        action: "Action",
      },
      statusLabels: {
        passed: "Passed",
        review: "Needs Review",
      },
      guideTitle: "Quick Start Guide for Learners",
      guideSteps: [
        {
          title: "1. Choose Your Track Skills",
          desc: "Student (School/College), Individual (Personal), or Company (Enterprise model skills) each unlock tailored skill tracks.",
        },
        {
          title: "2. Improve Skills with AI Coach",
          desc: "Use AI Skill Coach and 4-Week Roadmaps to practice daily drills and complete real exercises.",
        },
        {
          title: "3. Pass Quizzes & Climb Ranks",
          desc: "Every completed exercise (+40 pts) and passed quiz (+60 pts) increases your live rank against peers.",
        },
      ],
    },
    roadmap: {
      title: "4-Week Learning Roadmap",
      subtitle: "Personalized curriculum, practical exercises, and skill gap breakdown.",
      allWeeks: "All Weeks",
      weekLabel: "Week",
      strengths: "Core Strengths",
      missingSkills: "Skill Gaps to Close",
      recommendedProjects: "Recommended Projects",
      coursesTitle: "Recommended Courses & Tutorials",
      practicalExerciseTitle: "Practical Lab Exercise (+40 pts)",
      testSkillCta: "Test This Skill",
      progressLabel: "Weekly Completion",
      modeSkillCatalogTitle: "Recommended Skills for Your Mode",
    },
    coach: {
      title: "AI Skill Coach & Improvement Lab",
      subtitle: "Build meaningful, job-ready capabilities with tailored daily drills and an interactive AI Mentor.",
      focusSkillLabel: "Skill You Want to Improve",
      focusSkillPlaceholder: "e.g., System Design, Python OOP, Cloud Security",
      generateCoachBtn: "Generate Improvement Blueprint",
      generatingCoachBtn: "Analyzing Skill Growth...",
      blueprintTitle: "Personalized Development Blueprint",
      dailyDrillsTitle: "20-Minute Daily Skill Drills",
      challengeTitle: "Mode-Specific Hands-On Challenge",
      milestoneTitle: "7-Day Rank Milestone",
      suggestedSkillsTitle: "High-Impact Skills to Add",
      addSkillBtn: "Add to My Skills",
      mentorTitle: "Interactive AI Mentor",
      mentorSubtitle: "Ask anything about your roadmap, study concepts, or career growth.",
      mentorPlaceholder: "Ask your AI mentor how to practice or improve a skill...",
      sendMessage: "Send",
    },
    quiz: {
      title: "Skill Assessment Studio",
      subtitle: "Earn +60 ranking points for every quiz passed at 67% or higher.",
      topicLabel: "Skill or Concept to Assess",
      topicPlaceholder: "e.g., Docker Containers, React Hooks, SQL Joins",
      quickTopicsLabel: "Suggested from Your Roadmap & Track",
      modeLabel: "Assessment Track",
      questionPrefix: "Question",
      ofLabel: "of",
      correctLabel: "Correct",
      reviewLabel: "Review Needed",
      explanationLabel: "Why this matters",
      scoreSummaryTitle: "Assessment Complete",
      passedMessage: "Strong grasp! You earned +60 ranking points and updated your progress.",
      reviewMessage: "Good practice! Review the explanations below and try a fresh set.",
      emptyTitle: "Ready for a quick skill check?",
      emptyDesc: "Pick a skill from your track or enter any topic above to generate a 3-question quiz.",
      selectAllPrompt: "Please select an answer for all questions before checking.",
    },
    rankings: {
      title: "Global Learner Rankings",
      subtitle: "Compare ranks across Students, Individuals, and Company learners—or add another user to benchmark.",
      filterAll: "All Tracks",
      addUserTitle: "Add Another User to Rank",
      addUserSubtitle: "Register a classmate, colleague, or benchmark profile to see how they rank.",
      tableHeaders: {
        rank: "Rank",
        learner: "Learner",
        track: "Mode & Track",
        ageDob: "Age / DOB",
        skills: "Top Skills",
        points: "Score",
      },
      youBadge: "You",
      quizzesLabel: "quizzes",
    },
    profilePage: {
      title: "Learner Profile & Details",
      subtitle: "Manage your personal details, track mode, skills, and view your current rank.",
      savedNotice: "Profile saved and leaderboard rank updated.",
      fields: {
        name: "Full Name / Cohort Name",
        age: "Age",
        dob: "Date of Birth",
        mode: "Account Track Mode",
        email: "Email ID",
        mobile: "Mobile Number",
        skills: "Current Skills (comma-separated)",
        projects: "Projects & Certifications",
        targetRole: "Target Role / Goal",
        details: "Profile Details & Learning Bio",
      },
      rankCardTitle: "Current Standing",
      pointsLabel: "Skill Points",
      modeSkillsTitle: "Track Skill Library",
      modeSkillsDesc: "Click any skill from your mode library to add it to your profile.",
    },
    planner: {
      title: "AI Career & Skill Intelligence Studio",
      subtitle: "Deploy our multi-agent pipeline to profile gaps and build a 4-week roadmap.",
      presetsTitle: "Quick-Start Templates by Mode",
      presetsSubtitle: "Select a template for Student, Individual, or Company mode:",
      agentFeedTitle: "Multi-Agent Collaboration Feed",
      form: {
        modeLabel: "Learning Track Mode",
        nameLabel: "Student / Professional / Company Cohort Name",
        namePlaceholder: "e.g., Maya Chen or Backend Cohort A",
        skillsLabel: "Current Skills & Tools",
        skillsPlaceholder: "e.g., Python, HTML/CSS, Git, basic SQL",
        projectsLabel: "Projects & Certifications",
        projectsPlaceholder: "e.g., Campus Library Web App",
        targetRoleLabel: "Target Role or Upskilling Goal",
        targetRolePlaceholder: "e.g., Full-Stack Cloud Engineer",
        mentorNoteLabel: "Optional Mentor Focus Note",
        mentorNotePlaceholder: "e.g., Focus on practical labs and interview readiness",
      },
      howItWorksTitle: "4 Collaborating AI Agents",
      agent1Title: "Skill Profiler & Gap Analyst",
      agent1Desc: "Benchmarks your existing skills against industry standards for your target role.",
      agent2Title: "Curriculum Architect",
      agent2Desc: "Sequences a 4-week roadmap pairing courses with weekly hands-on lab exercises.",
      agent3Title: "Assessment & Coach Agents",
      agent3Desc: "Generate quizzes and personalized daily drills in your chosen language (including Tamil).",
    },
    common: {
      languageLabel: "Language",
      loading: "Loading...",
      errorTitle: "Request could not be completed",
      weekShort: "Wk",
      exercisesLabel: "exercises",
      coursesLabel: "courses",
      pts: "pts",
    },
  },
  ta: {
    brandName: "SkillMint",
    workspaceLabel: "பணியிடம்",
    nav: {
      overview: "முகப்பு",
      roadmap: "கற்றல் திட்டம்",
      coach: "AI திறன் பயிற்சியாளர்",
      quiz: "திறன் தேர்வுகள்",
      rankings: "தரவரிசைப் பட்டியல்",
      profile: "என் சுயவிவரம்",
      planner: "புதிய AI திட்டம்",
    },
    actions: {
      newPlan: "புதிய கற்றல் திட்டம்",
      continueWeek: "வாரத்தைத் தொடரவும்",
      takeQuiz: "தேர்வு எழுது",
      generatePlan: "AI முகவர்களை இயக்கவும்",
      generatingPlan: "AI திட்டம் உருவாகிறது...",
      generateQuiz: "3-கேள்வி வினாடி வினா உருவாக்கு",
      generatingQuiz: "தேர்வு தயாராகிறது...",
      markComplete: "பயிற்சியை முடித்ததாகக் குறி",
      completed: "முடிந்தது",
      submitQuiz: "விடைகளைச் சரிபார்",
      nextSkill: "மற்றொரு திறனை முயற்சி செய்",
      retakeQuiz: "புதிய கேள்விகள்",
      backToRoadmap: "திட்டத்திற்குத் திரும்பு",
      resetProgress: "தரவை மீட்டமை",
      dismissGuide: "வழிகாட்டியை மறை",
      signOut: "வெளியேறு / பயனர் மாற்று",
      saveProfile: "சுயவிவரத்தைச் சேமி & தரவரிசை புதுப்பி",
      addUser: "மற்றொரு பயனரைச் சேர்",
    },
    modes: {
      Student: "மாணவர்",
      Individual: "தனிநபர்",
      Organization: "நிறுவனம்",
    },
    modeTracks: {
      Student: "பள்ளி & கல்லூரித் திறன்கள்",
      Individual: "தனிப்பட்ட & தொழில் திறன்கள்",
      Organization: "நிறுவன மாதிரித் திறன்கள்",
    },
    modeDescriptions: {
      Student: "பள்ளி மற்றும் கல்லூரி அடிப்படைகள், ஆய்வகப் பயிற்சிகள் மற்றும் வேலைவாய்ப்புத் தயார்நிலை",
      Individual: "சுய கற்றல், தனிப்பட்ட போர்ட்ஃபோலியோ, ஃப்ரீலான்சிங் மற்றும் தொழில் வளர்ச்சி",
      Organization: "நிறுவன அளவிலான திறன்கள், கிளவுட் நிர்வாகம், குழு KPI மற்றும் பாதுகாப்பு",
    },
    auth: {
      heroBadge: "பல-முகவர் AI திறன் மேம்பாட்டுத் தளம்",
      heroTitle: "மாணவர்கள், தனிநபர்கள் மற்றும் நிறுவனங்களுக்கான திறன் இடைவெளியை விரைந்து நிரப்புங்கள்",
      heroSubtitle:
        "Google, மின்னஞ்சல் OTP அல்லது மொபைல் எண் OTP மூலம் உள்நுழைந்து உங்கள் சுயவிவரத்தை உருவாக்கி, AI பயிற்சியுடன் தரவரிசையில் முன்னேறுங்கள்.",
      signInTitle: "SkillMint-இல் உள்நுழையவும்",
      signInSubtitle: "Google, மின்னஞ்சல் OTP அல்லது மொபைல் OTP வழியைத் தேர்ந்தெடுக்கவும்.",
      tabs: {
        email: "மின்னஞ்சல் OTP",
        mobile: "மொபைல் OTP",
        google: "Google",
      },
      emailLabel: "மின்னஞ்சல் முகவரி",
      emailPlaceholder: "name@company.com அல்லது student@college.edu",
      mobileLabel: "மொபைல் எண்",
      mobilePlaceholder: "+91 98401 22410",
      sendOtp: "OTP அனுப்பு",
      sendingOtp: "OTP அனுப்பப்படுகிறது...",
      otpLabel: "6-இலக்க சரிபார்ப்பு எண்",
      otpPlaceholder: "6-இலக்க OTP-ஐ உள்ளிடவும்",
      verifyOtp: "சரிபார்த்து தொடரவும்",
      verifyingOtp: "சரிபார்க்கப்படுகிறது...",
      resendOtp: "மீண்டும் அனுப்பு",
      otpSentBanner: "OTP அனுப்பப்பட்டது! சரிபார்ப்பு எண்:",
      autofillOtp: "குறியீட்டை நிரப்பு",
      googleButton: "Google மூலம் தொடரவும்",
      googleNameLabel: "Google கணக்கு பெயர்",
      googleEmailLabel: "Google மின்னஞ்சல்",
      googleHint: "உங்கள் Google விவரங்களுடன் நேரடியாக உள்நுழையவும்.",
      completeProfileTitle: "உங்கள் சுயவிவரத்தை நிறைவு செய்யுங்கள்",
      completeProfileSubtitle: "உங்கள் பிரிவுக்கான திறன்கள் மற்றும் தரவரிசையை அமைக்க விவரங்களைச் சேர்க்கவும்.",
      finishSetup: "சுயவிவரத்தை உருவாக்கி உள்ளே செல்லவும்",
      demoBypass: "மாதிரி கணக்கில் பார்க்கவும்",
    },
    overview: {
      welcomePrefix: "முன்னேற்றப் பார்வை",
      targetGoalLabel: "இலக்குப் பதவி",
      kpis: {
        roleReadiness: "பதவித் தகுதி நிலை",
        roleReadinessSub: "தொடக்கத் திறன் மதிப்பீடு",
        roadmapProgress: "திட்ட நிறைவு",
        roadmapProgressSub: "பாடங்கள் & செய்முறை பயிற்சிகள்",
        assessmentsPassed: "சரிபார்க்கப்பட்ட திறன்கள்",
        assessmentsPassedSub: "67%+ மதிப்பெண் பெற்ற தேர்வுகள்",
        globalRank: "தரவரிசை இடம்",
        globalRankSub: "அனைத்து பயனர்களிடையே",
      },
      weeklyProgressTitle: "4-வார பாடத்திட்ட முன்னேற்றம்",
      weeklyProgressDesc: "வாராந்திர பாடங்கள், பயிற்சிகளை முடித்து தரவரிசைப் புள்ளிகளைப் பெறுங்கள்.",
      skillGapTitle: "திறன் சுயவிவரச் சுருக்கம்",
      strengthsLabel: "உறுதிப்படுத்தப்பட்ட பலங்கள்",
      focusAreasLabel: "மேம்படுத்த வேண்டிய பகுதிகள்",
      quizHistoryTitle: "சமீபத்திய தேர்வுப் பதிவுகள்",
      quizHistoryEmpty: "இன்னும் தேர்வுகள் எதுவும் இல்லை",
      quizHistoryEmptyDesc: "புள்ளிகள் பெறவும் தரவரிசையில் உயரவும் 3-கேள்வி தேர்வை எழுதுங்கள்.",
      tableHeaders: {
        skill: "திறன் தலைப்பு",
        score: "மதிப்பெண்",
        status: "நிலை",
        date: "தேதி",
        action: "செயல்",
      },
      statusLabels: {
        passed: "தேர்ச்சி",
        review: "மீள்பார்வை தேவை",
      },
      guideTitle: "புதிய கற்பவர்களுக்கான விரைவு வழிகாட்டி",
      guideSteps: [
        {
          title: "1. உங்கள் பிரிவுத் திறன்களைத் தேர்ந்தெடுங்கள்",
          desc: "மாணவர் (பள்ளி/கல்லூரி), தனிநபர் அல்லது நிறுவனம் என உங்களுக்கான தனிப்பட்ட திறன் பாதையைத் தேர்வுசெய்க.",
        },
        {
          title: "2. AI பயிற்சியாளருடன் திறனை வளர்க்கவும்",
          desc: "தினசரி பயிற்சிகள் மற்றும் 4-வார செயல்முறை பாடங்களைப் பின்பற்றி திறன்களை மேம்படுத்துங்கள்.",
        },
        {
          title: "3. தேர்வுகள் எழுதி தரவரிசையில் உயருங்கள்",
          desc: "ஒவ்வொரு பயிற்சி (+40 புள்ளி) மற்றும் தேர்வு தேர்ச்சிக்கும் (+60 புள்ளி) உங்கள் தரவரிசை உயரும்.",
        },
      ],
    },
    roadmap: {
      title: "4-வார கற்றல் வழித்தடம்",
      subtitle: "தனிப்பயனாக்கப்பட்ட பாடத்திட்டம், செய்முறை பயிற்சிகள் மற்றும் திறன் இடைவெளி பகுப்பாய்வு.",
      allWeeks: "அனைத்து வாரங்களும்",
      weekLabel: "வாரம்",
      strengths: "முக்கிய பலங்கள்",
      missingSkills: "நிரப்ப வேண்டிய திறன் இடைவெளிகள்",
      recommendedProjects: "பரிந்துரைக்கப்பட்ட திட்டங்கள்",
      coursesTitle: "பரிந்துரைக்கப்பட்ட பாடங்கள்",
      practicalExerciseTitle: "செய்முறை ஆய்வகப் பயிற்சி (+40 புள்ளிகள்)",
      testSkillCta: "இந்தத் திறனைச் சோதிக்கவும்",
      progressLabel: "வாராந்திர நிறைவு",
      modeSkillCatalogTitle: "உங்கள் பிரிவுக்கான பரிந்துரைக்கப்பட்ட திறன்கள்",
    },
    coach: {
      title: "AI திறன் பயிற்சியாளர் & மேம்பாட்டு ஆய்வகம்",
      subtitle: "தினசரி பயிற்சிகள் மற்றும் நேரடி AI வழிகாட்டியுடன் உங்கள் திறன்களை அர்த்தமுள்ளதாக வளர்த்துக்கொள்ளுங்கள்.",
      focusSkillLabel: "நீங்கள் மேம்படுத்த விரும்பும் திறன்",
      focusSkillPlaceholder: "எ.கா., System Design, Python OOP, Cloud Security",
      generateCoachBtn: "திறன் மேம்பாட்டுத் திட்டம் உருவாக்கு",
      generatingCoachBtn: "AI பகுப்பாய்வு செய்கிறது...",
      blueprintTitle: "தனிப்பயனாக்கப்பட்ட திறன் மேம்பாட்டுத் திட்டம்",
      dailyDrillsTitle: "20-நிமிட தினசரி பயிற்சிகள்",
      challengeTitle: "உங்கள் பிரிவுக்கான செய்முறை சவால்",
      milestoneTitle: "7-நாள் தரவரிசை இலக்கு",
      suggestedSkillsTitle: "சேர்க்க வேண்டிய முக்கியத் திறன்கள்",
      addSkillBtn: "என் திறன்களில் சேர்",
      mentorTitle: "நேரடி AI வழிகாட்டி",
      mentorSubtitle: "உங்கள் கற்றல் திட்டம், சந்தேகங்கள் அல்லது தொழில் வளர்ச்சி பற்றி கேளுங்கள்.",
      mentorPlaceholder: "ஒரு திறனை எப்படி மேம்படுத்துவது என்று AI வழிகாட்டியிடம் கேளுங்கள்...",
      sendMessage: "அனுப்பு",
    },
    quiz: {
      title: "திறன் மதிப்பீட்டு மையம்",
      subtitle: "67% அல்லது அதற்கு மேல் மதிப்பெண் பெற்றால் +60 தரவரிசைப் புள்ளிகள் கிடைக்கும்.",
      topicLabel: "மதிப்பீடு செய்ய வேண்டிய திறன்",
      topicPlaceholder: "எ.கா., Docker, React Hooks, SQL Joins",
      quickTopicsLabel: "உங்கள் திட்டத்திலிருந்து பரிந்துரைகள்",
      modeLabel: "மதிப்பீட்டுப் பிரிவு",
      questionPrefix: "கேள்வி",
      ofLabel: "/",
      correctLabel: "சரி",
      reviewLabel: "மீள்பார்வை",
      explanationLabel: "விளக்கம்",
      scoreSummaryTitle: "மதிப்பீடு முடிந்தது",
      passedMessage: "மிகச்சிறப்பு! +60 தரவரிசைப் புள்ளிகள் உங்கள் கணக்கில் சேர்க்கப்பட்டன.",
      reviewMessage: "நல்ல முயற்சி! கீழே உள்ள விளக்கங்களைப் படித்து மீண்டும் முயற்சி செய்யவும்.",
      emptyTitle: "விரைவான திறன் சோதனைக்குத் தயாரா?",
      emptyDesc: "மேலே ஒரு திறனைத் தேர்ந்தெடுத்து 3-கேள்வி வினாடி வினாவை உருவாக்குங்கள்.",
      selectAllPrompt: "சரிபார்க்கும் முன் அனைத்து கேள்விகளுக்கும் விடையைத் தேர்ந்தெடுக்கவும்.",
    },
    rankings: {
      title: "பயனர் தரவரிசைப் பட்டியல்",
      subtitle: "மாணவர்கள், தனிநபர்கள் மற்றும் நிறுவனப் பயனர்களின் தரவரிசையைப் பாருங்கள் அல்லது புதிய பயனரைச் சேர்க்கவும்.",
      filterAll: "அனைத்துப் பிரிவுகளும்",
      addUserTitle: "தரவரிசையில் புதிய பயனரைச் சேர்",
      addUserSubtitle: "சக மாணவர் அல்லது சக ஊழியரின் சுயவிவரத்தைச் சேர்த்து தரவரிசையை ஒப்பிடுங்கள்.",
      tableHeaders: {
        rank: "தரவரிசை",
        learner: "பயனர்",
        track: "பிரிவு",
        ageDob: "வயது / பிறந்த தேதி",
        skills: "முக்கிய திறன்கள்",
        points: "மதிப்பெண்",
      },
      youBadge: "நீங்கள்",
      quizzesLabel: "தேர்வுகள்",
    },
    profilePage: {
      title: "பயனர் சுயவிவரம் & விவரங்கள்",
      subtitle: "உங்கள் பெயர், வயது, பிறந்த தேதி, பிரிவு, திறன்கள் மற்றும் தற்போதைய தரவரிசையை நிர்வகிக்கவும்.",
      savedNotice: "சுயவிவரம் சேமிக்கப்பட்டு தரவரிசை புதுப்பிக்கப்பட்டது.",
      fields: {
        name: "முழுப் பெயர் / குழுவின் பெயர்",
        age: "வயது",
        dob: "பிறந்த தேதி",
        mode: "பயனர் பிரிவு",
        email: "மின்னஞ்சல் முகவரி",
        mobile: "மொபைல் எண்",
        skills: "தற்போதைய திறன்கள் (காற்புள்ளியால் பிரிக்கவும்)",
        projects: "திட்டங்கள் & சான்றிதழ்கள்",
        targetRole: "இலக்குப் பதவி / குறிக்கோள்",
        details: "சுயவிவர விவரங்கள் & கற்றல் குறிப்பு",
      },
      rankCardTitle: "தற்போதைய தரவரிசை",
      pointsLabel: "திறன் புள்ளிகள்",
      modeSkillsTitle: "பிரிவுக்கான திறன் நூலகம்",
      modeSkillsDesc: "உங்கள் பிரிவுக்கான திறனைத் தேர்ந்தெடுத்து சுயவிவரத்தில் சேர்க்கவும்.",
    },
    planner: {
      title: "AI தொழில் & திறன் நுண்ணறிவு மையம்",
      subtitle: "4-வார கற்றல் திட்டத்தை உருவாக்க எங்கள் பல-முகவர் AI அமைப்பை இயக்கவும்.",
      presetsTitle: "பிரிவுக்கான விரைவு மாதிரிகள்",
      presetsSubtitle: "மாணவர், தனிநபர் அல்லது நிறுவன மாதிரியைத் தேர்ந்தெடுக்கவும்:",
      agentFeedTitle: "AI முகவர்கள் செயல்பாட்டுப் பதிவு",
      form: {
        modeLabel: "கற்றல் பிரிவு",
        nameLabel: "மாணவர் / தனிநபர் / நிறுவனக் குழு பெயர்",
        namePlaceholder: "எ.கா., மாயா சென் அல்லது டெவலப்பர் குழு A",
        skillsLabel: "தற்போதைய திறன்கள் & கருவிகள்",
        skillsPlaceholder: "எ.கா., Python, HTML/CSS, Git, SQL",
        projectsLabel: "திட்டங்கள் & சான்றிதழ்கள்",
        projectsPlaceholder: "எ.கா., கல்லூரி இணையதளத் திட்டம்",
        targetRoleLabel: "இலக்குப் பதவி",
        targetRolePlaceholder: "எ.கா., Full-Stack Cloud Engineer",
        mentorNoteLabel: "வழிகாட்டிக்கான கூடுதல் குறிப்பு",
        mentorNotePlaceholder: "எ.கா., செய்முறைப் பயிற்சிகளுக்கு முன்னுரிமை அளிக்கவும்",
      },
      howItWorksTitle: "4 இணைந்து செயல்படும் AI முகவர்கள்",
      agent1Title: "திறன் பகுப்பாய்வாளர்",
      agent1Desc: "உங்கள் தற்போதைய திறன்களைத் துறைத் தரத்துடன் ஒப்பிட்டு மதிப்பீடு செய்கிறது.",
      agent2Title: "பாடத்திட்ட வடிவமைப்பாளர்",
      agent2Desc: "ஒவ்வொரு வாரமும் பாடங்கள் மற்றும் செய்முறைப் பயிற்சிகளுடன் 4-வார திட்டத்தை அமைக்கிறது.",
      agent3Title: "மதிப்பீட்டு & பயிற்சி முகவர்கள்",
      agent3Desc: "தமிழ் உள்ளிட்ட உங்கள் விருப்ப மொழியில் வினாடி வினா மற்றும் தினசரி பயிற்சிகளை வழங்குகிறது.",
    },
    common: {
      languageLabel: "மொழி",
      loading: "ஏற்றப்படுகிறது...",
      errorTitle: "கோரிக்கையை முடிக்க முடியவில்லை",
      weekShort: "வாரம்",
      exercisesLabel: "பயிற்சிகள்",
      coursesLabel: "பாடங்கள்",
      pts: "புள்ளிகள்",
    },
  },
  es: {
    brandName: "SkillMint",
    workspaceLabel: "Espacio",
    nav: {
      overview: "Resumen",
      roadmap: "Plan de estudio",
      coach: "Coach IA",
      quiz: "Evaluaciones",
      rankings: "Ranking",
      profile: "Mi Perfil",
      planner: "Nuevo plan IA",
    },
    actions: {
      newPlan: "Nuevo plan",
      continueWeek: "Continuar semana",
      takeQuiz: "Hacer quiz",
      generatePlan: "Ejecutar Agentes IA",
      generatingPlan: "Analizando...",
      generateQuiz: "Generar quiz (3 preguntas)",
      generatingQuiz: "Preparando...",
      markComplete: "Marcar completado",
      completed: "Completado",
      submitQuiz: "Comprobar respuestas",
      nextSkill: "Otra habilidad",
      retakeQuiz: "Nuevas preguntas",
      backToRoadmap: "Volver al plan",
      resetProgress: "Reiniciar",
      dismissGuide: "Ocultar guía",
      signOut: "Cerrar sesión",
      saveProfile: "Guardar perfil y ranking",
      addUser: "Añadir usuario",
    },
    modes: { Student: "Estudiante", Individual: "Individual", Organization: "Empresa" },
    modeTracks: {
      Student: "Habilidades Escolares y Universitarias",
      Individual: "Habilidades Personales y Profesionales",
      Organization: "Habilidades Modelo Empresarial",
    },
    modeDescriptions: {
      Student: "Bases académicas, prácticas de laboratorio e internados",
      Individual: "Crecimiento personal, portafolio y transición laboral",
      Organization: "Modelos corporativos, gobernanza cloud y KPIs de equipo",
    },
    auth: {
      heroBadge: "Plataforma Multi-Agente de Inteligencia de Habilidades",
      heroTitle: "Cierra Brechas de Habilidades para Estudiantes, Profesionales y Empresas",
      heroSubtitle: "Inicia sesión con Google, correo o móvil con código OTP para crear tu perfil y subir en el ranking.",
      signInTitle: "Acceder a SkillMint",
      signInSubtitle: "Elige Google, OTP por correo o OTP por móvil.",
      tabs: { email: "Correo OTP", mobile: "Móvil OTP", google: "Google" },
      emailLabel: "Correo electrónico",
      emailPlaceholder: "nombre@empresa.com",
      mobileLabel: "Número móvil",
      mobilePlaceholder: "+34 612 345 678",
      sendOtp: "Enviar OTP",
      sendingOtp: "Enviando...",
      otpLabel: "Código OTP de 6 dígitos",
      otpPlaceholder: "Ingresa el código",
      verifyOtp: "Verificar y continuar",
      verifyingOtp: "Verificando...",
      resendOtp: "Reenviar código",
      otpSentBanner: "¡OTP enviado! Código de verificación:",
      autofillOtp: "Autocompletar",
      googleButton: "Continuar con Google",
      googleNameLabel: "Nombre de cuenta Google",
      googleEmailLabel: "Correo de Google",
      googleHint: "Inicia sesión directamente con tu perfil de Google.",
      completeProfileTitle: "Completa tu perfil",
      completeProfileSubtitle: "Añade tus datos para personalizar habilidades y rango.",
      finishSetup: "Crear perfil y entrar",
      demoBypass: "Vista previa Demo",
    },
    overview: {
      welcomePrefix: "Resumen",
      targetGoalLabel: "Rol objetivo",
      kpis: {
        roleReadiness: "Preparación del rol",
        roleReadinessSub: "Línea base inicial",
        roadmapProgress: "Progreso del plan",
        roadmapProgressSub: "Cursos y ejercicios",
        assessmentsPassed: "Habilidades validadas",
        assessmentsPassedSub: "Quizzes con 67%+",
        globalRank: "Posición en Ranking",
        globalRankSub: "Entre todos los usuarios",
      },
      weeklyProgressTitle: "Progreso semanal (4 semanas)",
      weeklyProgressDesc: "Completa ejercicios y gana puntos de ranking.",
      skillGapTitle: "Perfil de habilidades",
      strengthsLabel: "Fortalezas",
      focusAreasLabel: "Áreas prioritarias",
      quizHistoryTitle: "Historial de evaluaciones",
      quizHistoryEmpty: "Sin evaluaciones aún",
      quizHistoryEmptyDesc: "Completa un quiz para ganar puntos.",
      tableHeaders: { skill: "Habilidad", score: "Nota", status: "Estado", date: "Fecha", action: "Acción" },
      statusLabels: { passed: "Aprobado", review: "Repasar" },
      guideTitle: "Guía rápida",
      guideSteps: [
        { title: "1. Elige tu modalidad", desc: "Estudiante, Individual o Empresa." },
        { title: "2. Usa el Coach IA", desc: "Practica ejercicios diarios personalizados." },
        { title: "3. Sube en el Ranking", desc: "Gana puntos con cada laboratorio y quiz." },
      ],
    },
    roadmap: {
      title: "Plan de aprendizaje de 4 semanas",
      subtitle: "Currículo adaptado, ejercicios prácticos y brechas.",
      allWeeks: "Todas",
      weekLabel: "Semana",
      strengths: "Fortalezas",
      missingSkills: "Brechas por cubrir",
      recommendedProjects: "Proyectos recomendados",
      coursesTitle: "Cursos y tutoriales",
      practicalExerciseTitle: "Ejercicio práctico (+40 pts)",
      testSkillCta: "Evaluar habilidad",
      progressLabel: "Completado",
      modeSkillCatalogTitle: "Habilidades recomendadas para tu modo",
    },
    coach: {
      title: "Coach IA de Mejora de Habilidades",
      subtitle: "Prácticas diarias significativas y mentoría IA interactiva.",
      focusSkillLabel: "Habilidad a mejorar",
      focusSkillPlaceholder: "ej., Diseño de sistemas, Python",
      generateCoachBtn: "Generar plan de mejora",
      generatingCoachBtn: "Analizando...",
      blueprintTitle: "Plan de desarrollo personalizado",
      dailyDrillsTitle: "Prácticas diarias de 20 min",
      challengeTitle: "Reto práctico según tu modo",
      milestoneTitle: "Meta de 7 días",
      suggestedSkillsTitle: "Habilidades recomendadas",
      addSkillBtn: "Añadir a mis habilidades",
      mentorTitle: "Mentor IA Interactivo",
      mentorSubtitle: "Pregunta sobre estudios, proyectos o mejora de rango.",
      mentorPlaceholder: "Escribe tu pregunta al mentor IA...",
      sendMessage: "Enviar",
    },
    quiz: {
      title: "Estudio de Evaluación",
      subtitle: "Gana +60 puntos por cada quiz aprobado con 67%+.",
      topicLabel: "Habilidad a evaluar",
      topicPlaceholder: "ej., Docker, React Hooks",
      quickTopicsLabel: "Sugerencias de tu ruta",
      modeLabel: "Modalidad",
      questionPrefix: "Pregunta",
      ofLabel: "de",
      correctLabel: "Correcto",
      reviewLabel: "Repasar",
      explanationLabel: "Explicación",
      scoreSummaryTitle: "Evaluación completada",
      passedMessage: "¡Excelente! Ganaste +60 puntos de ranking.",
      reviewMessage: "Buen intento. Revisa las explicaciones.",
      emptyTitle: "¿Listo para evaluar?",
      emptyDesc: "Elige una habilidad o escribe un tema arriba.",
      selectAllPrompt: "Responde todas las preguntas primero.",
    },
    rankings: {
      title: "Ranking Global de Usuarios",
      subtitle: "Compara posiciones entre Estudiantes, Individuales y Empresas.",
      filterAll: "Todos",
      addUserTitle: "Añadir otro usuario al ranking",
      addUserSubtitle: "Registra un nuevo perfil para comparar puntuaciones.",
      tableHeaders: { rank: "Rango", learner: "Usuario", track: "Modalidad", ageDob: "Edad / Nac.", skills: "Habilidades", points: "Puntos" },
      youBadge: "Tú",
      quizzesLabel: "quizzes",
    },
    profilePage: {
      title: "Perfil y Detalles del Usuario",
      subtitle: "Actualiza nombre, edad, nacimiento, modalidad y habilidades.",
      savedNotice: "Perfil guardado y ranking actualizado.",
      fields: {
        name: "Nombre completo",
        age: "Edad",
        dob: "Fecha de nacimiento",
        mode: "Modalidad",
        email: "Correo",
        mobile: "Móvil",
        skills: "Habilidades actuales",
        projects: "Proyectos y certificaciones",
        targetRole: "Rol objetivo",
        details: "Detalles y biografía",
      },
      rankCardTitle: "Posición actual",
      pointsLabel: "Puntos",
      modeSkillsTitle: "Biblioteca de habilidades del modo",
      modeSkillsDesc: "Haz clic para añadir a tu perfil.",
    },
    planner: {
      title: "Estudio IA Multi-Agente",
      subtitle: "Genera una ruta de 4 semanas adaptada a tu perfil.",
      presetsTitle: "Plantillas rápidas",
      presetsSubtitle: "Selecciona un perfil de ejemplo:",
      agentFeedTitle: "Registro de colaboración de agentes",
      form: {
        modeLabel: "Modalidad",
        nameLabel: "Nombre o cohorte",
        namePlaceholder: "ej., Maya Chen",
        skillsLabel: "Habilidades actuales",
        skillsPlaceholder: "ej., Python, SQL",
        projectsLabel: "Proyectos",
        projectsPlaceholder: "ej., App web universitaria",
        targetRoleLabel: "Rol objetivo",
        targetRolePlaceholder: "ej., Full-Stack Cloud Engineer",
        mentorNoteLabel: "Nota opcional",
        mentorNotePlaceholder: "ej., Enfoque práctico",
      },
      howItWorksTitle: "4 Agentes IA Colaborando",
      agent1Title: "Analista de brechas",
      agent1Desc: "Compara tus habilidades con el rol objetivo.",
      agent2Title: "Arquitecto curricular",
      agent2Desc: "Diseña 4 semanas de estudio y laboratorios.",
      agent3Title: "Agentes de evaluación y coach",
      agent3Desc: "Generan quizzes y retos diarios en tu idioma.",
    },
    common: { languageLabel: "Idioma", loading: "Cargando...", errorTitle: "Error", weekShort: "Sem", exercisesLabel: "ejercicios", coursesLabel: "cursos", pts: "pts" },
  },
  fr: {
    brandName: "SkillMint",
    workspaceLabel: "Espace",
    nav: {
      overview: "Tableau de bord",
      roadmap: "Plan d'étude",
      coach: "Coach IA",
      quiz: "Évaluations",
      rankings: "Classement",
      profile: "Mon Profil",
      planner: "Nouveau plan IA",
    },
    actions: {
      newPlan: "Nouveau plan",
      continueWeek: "Continuer semaine",
      takeQuiz: "Passer le quiz",
      generatePlan: "Lancer les Agents IA",
      generatingPlan: "Analyse en cours...",
      generateQuiz: "Générer un quiz (3 questions)",
      generatingQuiz: "Préparation...",
      markComplete: "Marquer terminé",
      completed: "Terminé",
      submitQuiz: "Vérifier",
      nextSkill: "Autre compétence",
      retakeQuiz: "Nouvelles questions",
      backToRoadmap: "Retour au plan",
      resetProgress: "Réinitialiser",
      dismissGuide: "Masquer",
      signOut: "Déconnexion",
      saveProfile: "Enregistrer le profil",
      addUser: "Ajouter un utilisateur",
    },
    modes: { Student: "Étudiant", Individual: "Individuel", Organization: "Entreprise" },
    modeTracks: {
      Student: "Compétences Scolaires & Universitaires",
      Individual: "Compétences Personnelles & Carrière",
      Organization: "Compétences Modèle Entreprise",
    },
    modeDescriptions: {
      Student: "Bases académiques, stages et projets d'études",
      Individual: "Évolution personnelle, portfolio et freelance",
      Organization: "Modèles d'entreprise, gouvernance cloud et KPIs",
    },
    auth: {
      heroBadge: "Plateforme Multi-Agents d'Intelligence des Compétences",
      heroTitle: "Comblez vos écarts de compétences : Étudiants, Individus et Entreprises",
      heroSubtitle: "Connectez-vous via Google, Email OTP ou Mobile OTP pour suivre votre rang.",
      signInTitle: "Connexion à SkillMint",
      signInSubtitle: "Choisissez Google, Email OTP ou Mobile OTP.",
      tabs: { email: "Email OTP", mobile: "Mobile OTP", google: "Google" },
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "nom@entreprise.com",
      mobileLabel: "Numéro de mobile",
      mobilePlaceholder: "+33 6 12 34 56 78",
      sendOtp: "Envoyer OTP",
      sendingOtp: "Envoi...",
      otpLabel: "Code OTP à 6 chiffres",
      otpPlaceholder: "Entrez le code",
      verifyOtp: "Vérifier et continuer",
      verifyingOtp: "Vérification...",
      resendOtp: "Renvoyer",
      otpSentBanner: "OTP envoyé ! Code de vérification :",
      autofillOtp: "Remplir",
      googleButton: "Continuer avec Google",
      googleNameLabel: "Nom du compte Google",
      googleEmailLabel: "Email Google",
      googleHint: "Connectez-vous avec votre profil Google.",
      completeProfileTitle: "Compléter votre profil",
      completeProfileSubtitle: "Ajoutez vos informations pour personnaliser votre classement.",
      finishSetup: "Créer le profil et entrer",
      demoBypass: "Aperçu Démo",
    },
    overview: {
      welcomePrefix: "Progression",
      targetGoalLabel: "Poste visé",
      kpis: {
        roleReadiness: "Adéquation poste",
        roleReadinessSub: "Base initiale",
        roadmapProgress: "Avancement",
        roadmapProgressSub: "Cours et exercices",
        assessmentsPassed: "Compétences validées",
        assessmentsPassedSub: "Quiz à 67%+",
        globalRank: "Classement Global",
        globalRankSub: "Parmi tous les apprenants",
      },
      weeklyProgressTitle: "Progression sur 4 semaines",
      weeklyProgressDesc: "Gagnez des points à chaque exercice et quiz.",
      skillGapTitle: "Profil de compétences",
      strengthsLabel: "Points forts",
      focusAreasLabel: "Priorités",
      quizHistoryTitle: "Historique des quiz",
      quizHistoryEmpty: "Aucun quiz enregistré",
      quizHistoryEmptyDesc: "Complétez un quiz pour gagner des points.",
      tableHeaders: { skill: "Compétence", score: "Score", status: "Statut", date: "Date", action: "Action" },
      statusLabels: { passed: "Validé", review: "À revoir" },
      guideTitle: "Guide rapide",
      guideSteps: [
        { title: "1. Choisissez votre voie", desc: "Étudiant, Individuel ou Entreprise." },
        { title: "2. Coach IA dédié", desc: "Exercices quotidiens sur mesure." },
        { title: "3. Montez dans le classement", desc: "Accumulez des points à chaque réussite." },
      ],
    },
    roadmap: {
      title: "Feuille de route sur 4 semaines",
      subtitle: "Parcours structuré et analyse des écarts.",
      allWeeks: "Tout",
      weekLabel: "Semaine",
      strengths: "Points forts",
      missingSkills: "Écarts à combler",
      recommendedProjects: "Projets recommandés",
      coursesTitle: "Cours recommandés",
      practicalExerciseTitle: "Exercice pratique (+40 pts)",
      testSkillCta: "Tester",
      progressLabel: "Avancement",
      modeSkillCatalogTitle: "Compétences recommandées pour votre mode",
    },
    coach: {
      title: "Coach IA & Développement des Compétences",
      subtitle: "Pratiques quotidiennes et mentor IA interactif.",
      focusSkillLabel: "Compétence à améliorer",
      focusSkillPlaceholder: "ex., Docker, Architecture Cloud",
      generateCoachBtn: "Générer le plan d'amélioration",
      generatingCoachBtn: "Analyse...",
      blueprintTitle: "Plan de progression personnalisé",
      dailyDrillsTitle: "Exercices quotidiens (20 min)",
      challengeTitle: "Défi pratique adapté",
      milestoneTitle: "Objectif à 7 jours",
      suggestedSkillsTitle: "Compétences clés à ajouter",
      addSkillBtn: "Ajouter",
      mentorTitle: "Mentor IA Interactif",
      mentorSubtitle: "Posez vos questions sur vos compétences ou études.",
      mentorPlaceholder: "Demandez conseil à votre mentor IA...",
      sendMessage: "Envoyer",
    },
    quiz: {
      title: "Studio d'Évaluation",
      subtitle: "+60 points par quiz réussi à 67%+.",
      topicLabel: "Compétence à tester",
      topicPlaceholder: "ex., Docker, React",
      quickTopicsLabel: "Suggestions",
      modeLabel: "Mode",
      questionPrefix: "Question",
      ofLabel: "sur",
      correctLabel: "Correct",
      reviewLabel: "À revoir",
      explanationLabel: "Explication",
      scoreSummaryTitle: "Terminé",
      passedMessage: "Bravo ! +60 points ajoutés à votre classement.",
      reviewMessage: "Bon entraînement. Consultez les explications.",
      emptyTitle: "Prêt pour un quiz ?",
      emptyDesc: "Choisissez un sujet ci-dessus.",
      selectAllPrompt: "Répondez à toutes les questions.",
    },
    rankings: {
      title: "Classement des Utilisateurs",
      subtitle: "Comparez les rangs ou ajoutez un autre utilisateur.",
      filterAll: "Tous",
      addUserTitle: "Ajouter un utilisateur au classement",
      addUserSubtitle: "Ajoutez un profil pour comparer les rangs.",
      tableHeaders: { rank: "Rang", learner: "Apprenant", track: "Mode", ageDob: "Âge / Naiss.", skills: "Compétences", points: "Points" },
      youBadge: "Vous",
      quizzesLabel: "quiz",
    },
    profilePage: {
      title: "Profil & Détails",
      subtitle: "Gérez nom, âge, date de naissance, mode et compétences.",
      savedNotice: "Profil enregistré et rang mis à jour.",
      fields: {
        name: "Nom complet",
        age: "Âge",
        dob: "Date de naissance",
        mode: "Mode",
        email: "Email",
        mobile: "Mobile",
        skills: "Compétences",
        projects: "Projets",
        targetRole: "Poste visé",
        details: "Détails",
      },
      rankCardTitle: "Classement actuel",
      pointsLabel: "Points",
      modeSkillsTitle: "Bibliothèque de compétences",
      modeSkillsDesc: "Cliquez pour ajouter à votre profil.",
    },
    planner: {
      title: "Studio IA Multi-Agents",
      subtitle: "Déployez les agents IA pour bâtir votre plan sur 4 semaines.",
      presetsTitle: "Modèles rapides",
      presetsSubtitle: "Choisissez un exemple :",
      agentFeedTitle: "Journal des agents IA",
      form: {
        modeLabel: "Mode",
        nameLabel: "Nom ou cohorte",
        namePlaceholder: "ex., Maya Chen",
        skillsLabel: "Compétences actuelles",
        skillsPlaceholder: "ex., Python, SQL",
        projectsLabel: "Projets",
        projectsPlaceholder: "ex., Application web",
        targetRoleLabel: "Poste visé",
        targetRolePlaceholder: "ex., Full-Stack Cloud Engineer",
        mentorNoteLabel: "Note optionnelle",
        mentorNotePlaceholder: "ex., Focus pratique",
      },
      howItWorksTitle: "4 Agents IA Collaboratifs",
      agent1Title: "Analyste de compétences",
      agent1Desc: "Évalue vos acquis par rapport au marché.",
      agent2Title: "Architecte pédagogique",
      agent2Desc: "Crée un parcours concret sur 4 semaines.",
      agent3Title: "Agents Quiz & Coach",
      agent3Desc: "Génèrent quiz et exercices dans votre langue.",
    },
    common: { languageLabel: "Langue", loading: "Chargement...", errorTitle: "Erreur", weekShort: "Sem", exercisesLabel: "exercices", coursesLabel: "cours", pts: "pts" },
  },
  de: {
    brandName: "SkillMint",
    workspaceLabel: "Bereich",
    nav: {
      overview: "Übersicht",
      roadmap: "Lernplan",
      coach: "KI-Coach",
      quiz: "Tests",
      rankings: "Rangliste",
      profile: "Mein Profil",
      planner: "Neuer KI-Plan",
    },
    actions: {
      newPlan: "Neuer Plan",
      continueWeek: "Woche fortsetzen",
      takeQuiz: "Quiz starten",
      generatePlan: "KI-Agenten starten",
      generatingPlan: "Analyse läuft...",
      generateQuiz: "3-Fragen-Quiz starten",
      generatingQuiz: "Wird erstellt...",
      markComplete: "Abschließen",
      completed: "Erledigt",
      submitQuiz: "Antworten prüfen",
      nextSkill: "Nächster Skill",
      retakeQuiz: "Neue Fragen",
      backToRoadmap: "Zum Plan",
      resetProgress: "Zurücksetzen",
      dismissGuide: "Ausblenden",
      signOut: "Abmelden",
      saveProfile: "Profil speichern",
      addUser: "Nutzer hinzufügen",
    },
    modes: { Student: "Studierende", Individual: "Einzelperson", Organization: "Unternehmen" },
    modeTracks: {
      Student: "Schul- & Hochschul-Skills",
      Individual: "Persönliche Karriere-Skills",
      Organization: "Unternehmensmodell-Skills",
    },
    modeDescriptions: {
      Student: "Studieninhalte, Praktika und Grundlagen",
      Individual: "Portfolio, Spezialisierung und Karrierewechsel",
      Organization: "Enterprise-Architektur, Team-KPIs und Compliance",
    },
    auth: {
      heroBadge: "Multi-Agenten Skill-Plattform",
      heroTitle: "Kompetenzlücken schneller schließen: Studierende, Einzelpersonen & Unternehmen",
      heroSubtitle: "Mit Google, E-Mail-OTP oder Mobil-OTP anmelden und im Ranking aufsteigen.",
      signInTitle: "Bei SkillMint anmelden",
      signInSubtitle: "Wählen Sie Google, E-Mail-OTP oder Mobil-OTP.",
      tabs: { email: "E-Mail OTP", mobile: "Mobil OTP", google: "Google" },
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "name@firma.de",
      mobileLabel: "Mobilnummer",
      mobilePlaceholder: "+49 170 1234567",
      sendOtp: "OTP senden",
      sendingOtp: "Wird gesendet...",
      otpLabel: "6-stelliger OTP-Code",
      otpPlaceholder: "Code eingeben",
      verifyOtp: "Bestätigen & Weiter",
      verifyingOtp: "Prüfung...",
      resendOtp: "Erneut senden",
      otpSentBanner: "OTP gesendet! Code:",
      autofillOtp: "Ausfüllen",
      googleButton: "Mit Google fortfahren",
      googleNameLabel: "Google Kontoname",
      googleEmailLabel: "Google E-Mail",
      googleHint: "Direkt mit Ihrem Google-Profil anmelden.",
      completeProfileTitle: "Profil vervollständigen",
      completeProfileSubtitle: "Daten für Track-Skills und Ranking hinzufügen.",
      finishSetup: "Profil erstellen & starten",
      demoBypass: "Demo-Vorschau",
    },
    overview: {
      welcomePrefix: "Fortschritt",
      targetGoalLabel: "Zielrolle",
      kpis: {
        roleReadiness: "Rollen-Passung",
        roleReadinessSub: "Ausgangsbasis",
        roadmapProgress: "Plan-Fortschritt",
        roadmapProgressSub: "Kurse & Übungen",
        assessmentsPassed: "Geprüfte Skills",
        assessmentsPassedSub: "Tests mit 67%+",
        globalRank: "Rangliste",
        globalRankSub: "Unter allen Lernenden",
      },
      weeklyProgressTitle: "4-Wochen-Fortschritt",
      weeklyProgressDesc: "Sammeln Sie Punkte mit Übungen und Tests.",
      skillGapTitle: "Skill-Profil",
      strengthsLabel: "Stärken",
      focusAreasLabel: "Lernziele",
      quizHistoryTitle: "Testergebnisse",
      quizHistoryEmpty: "Noch keine Tests",
      quizHistoryEmptyDesc: "Absolvieren Sie ein Quiz für Punkte.",
      tableHeaders: { skill: "Thema", score: "Ergebnis", status: "Status", date: "Datum", action: "Aktion" },
      statusLabels: { passed: "Bestanden", review: "Wiederholen" },
      guideTitle: "Kurzanleitung",
      guideSteps: [
        { title: "1. Track wählen", desc: "Studierende, Einzelperson oder Unternehmen." },
        { title: "2. KI-Coach nutzen", desc: "Tägliche Übungen gezielt trainieren." },
        { title: "3. Rang verbessern", desc: "Punkte durch Praxis und Tests sammeln." },
      ],
    },
    roadmap: {
      title: "4-Wochen-Lernroadmap",
      subtitle: "Strukturierter Plan und Kompetenzanalyse.",
      allWeeks: "Alle",
      weekLabel: "Woche",
      strengths: "Stärken",
      missingSkills: "Kompetenzlücken",
      recommendedProjects: "Praxisprojekte",
      coursesTitle: "Empfohlene Kurse",
      practicalExerciseTitle: "Praxisübung (+40 Pkt.)",
      testSkillCta: "Testen",
      progressLabel: "Fortschritt",
      modeSkillCatalogTitle: "Empfohlene Skills für Ihren Modus",
    },
    coach: {
      title: "KI-Skill-Coach & Übungslabor",
      subtitle: "Tägliche Übungen und interaktiver KI-Mentor.",
      focusSkillLabel: "Zu verbessernder Skill",
      focusSkillPlaceholder: "z. B. Docker, Systemdesign",
      generateCoachBtn: "Entwicklungsplan erstellen",
      generatingCoachBtn: "Analysiere...",
      blueprintTitle: "Persönlicher Entwicklungsplan",
      dailyDrillsTitle: "20-Minuten-Tagesübungen",
      challengeTitle: "Praxis-Challenge",
      milestoneTitle: "7-Tage-Meilenstein",
      suggestedSkillsTitle: "Empfohlene Skills",
      addSkillBtn: "Hinzufügen",
      mentorTitle: "Interaktiver KI-Mentor",
      mentorSubtitle: "Stellen Sie Fragen zu Lernzielen oder Karriere.",
      mentorPlaceholder: "Frage an den KI-Mentor stellen...",
      sendMessage: "Senden",
    },
    quiz: {
      title: "Kompetenz-Teststudio",
      subtitle: "+60 Punkte pro bestandenem Quiz (67%+).",
      topicLabel: "Testthema",
      topicPlaceholder: "z. B. Docker, React Hooks",
      quickTopicsLabel: "Vorschläge",
      modeLabel: "Modus",
      questionPrefix: "Frage",
      ofLabel: "von",
      correctLabel: "Richtig",
      reviewLabel: "Vertiefen",
      explanationLabel: "Erklärung",
      scoreSummaryTitle: "Abgeschlossen",
      passedMessage: "Stark! +60 Rangpunkte erhalten.",
      reviewMessage: "Gute Übung. Lesen Sie die Erklärungen.",
      emptyTitle: "Bereit für den Test?",
      emptyDesc: "Wählen Sie oben ein Thema.",
      selectAllPrompt: "Bitte alle Fragen beantworten.",
    },
    rankings: {
      title: "Globale Rangliste",
      subtitle: "Vergleichen Sie Ränge oder fügen Sie weitere Nutzer hinzu.",
      filterAll: "Alle",
      addUserTitle: "Weiteren Nutzer hinzufügen",
      addUserSubtitle: "Neues Profil zum Rangvergleich anlegen.",
      tableHeaders: { rank: "Rang", learner: "Nutzer", track: "Modus", ageDob: "Alter / Geb.", skills: "Skills", points: "Punkte" },
      youBadge: "Sie",
      quizzesLabel: "Tests",
    },
    profilePage: {
      title: "Nutzerprofil & Details",
      subtitle: "Name, Alter, Geburtsdatum, Modus und Skills verwalten.",
      savedNotice: "Profil gespeichert und Rang aktualisiert.",
      fields: {
        name: "Name",
        age: "Alter",
        dob: "Geburtsdatum",
        mode: "Modus",
        email: "E-Mail",
        mobile: "Mobil",
        skills: "Aktuelle Skills",
        projects: "Projekte",
        targetRole: "Zielrolle",
        details: "Details",
      },
      rankCardTitle: "Aktueller Rang",
      pointsLabel: "Punkte",
      modeSkillsTitle: "Skill-Bibliothek",
      modeSkillsDesc: "Klicken zum Hinzufügen.",
    },
    planner: {
      title: "KI-Multi-Agenten-Studio",
      subtitle: "Erstellen Sie einen 4-Wochen-Lernplan.",
      presetsTitle: "Vorlagen",
      presetsSubtitle: "Profil wählen:",
      agentFeedTitle: "Agenten-Protokoll",
      form: {
        modeLabel: "Modus",
        nameLabel: "Name",
        namePlaceholder: "z. B. Maya Chen",
        skillsLabel: "Skills",
        skillsPlaceholder: "z. B. Python, SQL",
        projectsLabel: "Projekte",
        projectsPlaceholder: "z. B. Web-App",
        targetRoleLabel: "Zielrolle",
        targetRolePlaceholder: "z. B. Full-Stack Cloud Engineer",
        mentorNoteLabel: "Hinweis",
        mentorNotePlaceholder: "z. B. Praxisfokus",
      },
      howItWorksTitle: "4 KI-Agenten",
      agent1Title: "Skill-Analyst",
      agent1Desc: "Vergleicht Skills mit Zielanforderungen.",
      agent2Title: "Curriculum-Architekt",
      agent2Desc: "Erstellt den 4-Wochen-Plan.",
      agent3Title: "Quiz- & Coach-Agenten",
      agent3Desc: "Erstellen Tests und Übungen in Ihrer Sprache.",
    },
    common: { languageLabel: "Sprache", loading: "Lädt...", errorTitle: "Fehler", weekShort: "Wo", exercisesLabel: "Übungen", coursesLabel: "Kurse", pts: "Pkt" },
  },
  hi: {
    brandName: "SkillMint",
    workspaceLabel: "कार्यक्षेत्र",
    nav: {
      overview: "डैशबोर्ड",
      roadmap: "अध्ययन योजना",
      coach: "AI कौशल कोच",
      quiz: "कौशल परीक्षा",
      rankings: "रैंकिंग लीडरबोर्ड",
      profile: "मेरी प्रोफ़ाइल",
      planner: "नया AI प्लान",
    },
    actions: {
      newPlan: "नई योजना",
      continueWeek: "सप्ताह जारी रखें",
      takeQuiz: "क्विज़ दें",
      generatePlan: "AI एजेंट चलाएं",
      generatingPlan: "विश्लेषण हो रहा है...",
      generateQuiz: "3-प्रश्न क्विज़ बनाएं",
      generatingQuiz: "तैयार हो रहा है...",
      markComplete: "पूर्ण चिह्नित करें",
      completed: "पूर्ण",
      submitQuiz: "उत्तर जांचें",
      nextSkill: "अन्य कौशल",
      retakeQuiz: "नए प्रश्न",
      backToRoadmap: "रोडमैप पर लौटें",
      resetProgress: "रीसेट करें",
      dismissGuide: "छुपाएं",
      signOut: "लॉग आउट",
      saveProfile: "प्रोफ़ाइल सहेजें और रैंक अपडेट करें",
      addUser: "नया उपयोगकर्ता जोड़ें",
    },
    modes: { Student: "छात्र", Individual: "व्यक्तिगत", Organization: "कंपनी" },
    modeTracks: {
      Student: "स्कूल और कॉलेज कौशल",
      Individual: "व्यक्तिगत और करियर कौशल",
      Organization: "कंपनी मॉडल कौशल",
    },
    modeDescriptions: {
      Student: "स्कूल और कॉलेज की नींव, लैब और इंटर्नशिप तैयारी",
      Individual: "व्यक्तिगत कौशल विकास, पोर्टफोलियो और करियर ग्रोथ",
      Organization: "एंटरप्राइज़ क्लाउड, सुरक्षा और टीम KPI कौशल",
    },
    auth: {
      heroBadge: "मल्टी-एजेंट AI स्किल प्लेटफ़ॉर्म",
      heroTitle: "छात्रों, पेशेवरों और कंपनियों के लिए कौशल अंतर को तेज़ी से दूर करें",
      heroSubtitle: "Google, ईमेल OTP या मोबाइल OTP से लॉगिन करें और लाइव रैंकिंग में आगे बढ़ें।",
      signInTitle: "SkillMint में साइन इन करें",
      signInSubtitle: "Google, ईमेल OTP या मोबाइल OTP चुनें।",
      tabs: { email: "ईमेल OTP", mobile: "मोबाइल OTP", google: "Google" },
      emailLabel: "ईमेल पता",
      emailPlaceholder: "name@company.com",
      mobileLabel: "मोबाइल नंबर",
      mobilePlaceholder: "+91 98401 22410",
      sendOtp: "OTP भेजें",
      sendingOtp: "भेज रहे हैं...",
      otpLabel: "6-अंकीय सत्यापन कोड",
      otpPlaceholder: "OTP दर्ज करें",
      verifyOtp: "सत्यापित करें और आगे बढ़ें",
      verifyingOtp: "जांच हो रही है...",
      resendOtp: "पुनः भेजें",
      otpSentBanner: "OTP भेजा गया! कोड:",
      autofillOtp: "कोड भरें",
      googleButton: "Google से जारी रखें",
      googleNameLabel: "Google खाता नाम",
      googleEmailLabel: "Google ईमेल",
      googleHint: "अपनी Google प्रोफ़ाइल से लॉगिन करें।",
      completeProfileTitle: "अपनी प्रोफ़ाइल पूरी करें",
      completeProfileSubtitle: "अपने ट्रैक और रैंक के लिए विवरण जोड़ें।",
      finishSetup: "प्रोफ़ाइल बनाएं और प्रवेश करें",
      demoBypass: "डेमो प्रीव्यू देखें",
    },
    overview: {
      welcomePrefix: "प्रगति विवरण",
      targetGoalLabel: "लक्ष्य भूमिका",
      kpis: {
        roleReadiness: "भूमिका तैयारी",
        roleReadinessSub: "प्रारंभिक स्तर",
        roadmapProgress: "रोडमैप प्रगति",
        roadmapProgressSub: "कोर्स और अभ्यास",
        assessmentsPassed: "सत्यापित कौशल",
        assessmentsPassedSub: "67%+ अंक वाले क्विज़",
        globalRank: "लीडरबोर्ड रैंक",
        globalRankSub: "सभी उपयोगकर्ताओं में",
      },
      weeklyProgressTitle: "4-सप्ताह पाठ्यक्रम प्रगति",
      weeklyProgressDesc: "अभ्यास पूरे करें और रैंकिंग अंक जीतें।",
      skillGapTitle: "कौशल सारांश",
      strengthsLabel: "मजबूत पक्ष",
      focusAreasLabel: "सुधार क्षेत्र",
      quizHistoryTitle: "परीक्षा रिकॉर्ड",
      quizHistoryEmpty: "कोई परीक्षा नहीं",
      quizHistoryEmptyDesc: "अंक पाने के लिए क्विज़ पूरा करें।",
      tableHeaders: { skill: "कौशल", score: "स्कोर", status: "स्थिति", date: "दिनांक", action: "क्रिया" },
      statusLabels: { passed: "उत्तीर्ण", review: "दोहराव" },
      guideTitle: "त्वरित गाइड",
      guideSteps: [
        { title: "1. अपना ट्रैक चुनें", desc: "छात्र, व्यक्तिगत या कंपनी मोड चुनें।" },
        { title: "2. AI कोच से सीखें", desc: "दैनिक अभ्यास से कौशल सुधारें।" },
        { title: "3. रैंक बढ़ाएं", desc: "क्विज़ पास कर लीडरबोर्ड में ऊपर जाएं।" },
      ],
    },
    roadmap: {
      title: "4-सप्ताह अध्ययन रोडमैप",
      subtitle: "व्यक्तिगत पाठ्यक्रम और कौशल विश्लेषण।",
      allWeeks: "सभी",
      weekLabel: "सप्ताह",
      strengths: "प्रमुख क्षमताएं",
      missingSkills: "सीखने योग्य कौशल",
      recommendedProjects: "प्रोजेक्ट्स",
      coursesTitle: "अनुशंसित कोर्स",
      practicalExerciseTitle: "व्यावहारिक अभ्यास (+40 अंक)",
      testSkillCta: "टेस्ट लें",
      progressLabel: "प्रगति",
      modeSkillCatalogTitle: "आपके मोड के लिए सुझाए गए कौशल",
    },
    coach: {
      title: "AI कौशल कोच और सुधार लैब",
      subtitle: "दैनिक अभ्यास और इंटरैक्टिव AI मेंटर के साथ कौशल बढ़ाएं।",
      focusSkillLabel: "सुधारने योग्य कौशल",
      focusSkillPlaceholder: "उदा. Python, Cloud Security",
      generateCoachBtn: "सुधार योजना बनाएं",
      generatingCoachBtn: "तैयार हो रहा है...",
      blueprintTitle: "व्यक्तिगत विकास योजना",
      dailyDrillsTitle: "20-मिनट दैनिक अभ्यास",
      challengeTitle: "व्यावहारिक चुनौती",
      milestoneTitle: "7-दिवसीय लक्ष्य",
      suggestedSkillsTitle: "सीखने योग्य नए कौशल",
      addSkillBtn: "जोड़ें",
      mentorTitle: "इंटरैक्टिव AI मेंटर",
      mentorSubtitle: "पढ़ाई या करियर से जुड़े सवाल पूछें।",
      mentorPlaceholder: "अपने AI मेंटर से पूछें...",
      sendMessage: "भेजें",
    },
    quiz: {
      title: "कौशल मूल्यांकन स्टूडियो",
      subtitle: "67%+ अंक पर +60 रैंकिंग अंक पाएं।",
      topicLabel: "परीक्षा विषय",
      topicPlaceholder: "उदा. Docker, React",
      quickTopicsLabel: "सुझाए गए विषय",
      modeLabel: "मोड",
      questionPrefix: "प्रश्न",
      ofLabel: "/",
      correctLabel: "सही",
      reviewLabel: "पुनरावलोकन",
      explanationLabel: "स्पष्टीकरण",
      scoreSummaryTitle: "परीक्षा पूर्ण",
      passedMessage: "बधाई हो! +60 रैंकिंग अंक मिले।",
      reviewMessage: "अच्छा प्रयास। व्याख्या पढ़ें।",
      emptyTitle: "क्विज़ के लिए तैयार?",
      emptyDesc: "ऊपर कोई विषय चुनें।",
      selectAllPrompt: "सभी प्रश्नों के उत्तर चुनें।",
    },
    rankings: {
      title: "उपयोगकर्ता रैंकिंग लीडरबोर्ड",
      subtitle: "अन्य छात्रों, व्यक्तियों और कंपनी उपयोगकर्ताओं की रैंक देखें या नया उपयोगकर्ता जोड़ें।",
      filterAll: "सभी",
      addUserTitle: "रैंकिंग में नया उपयोगकर्ता जोड़ें",
      addUserSubtitle: "तुलना के लिए एक नया उपयोगकर्ता प्रोफ़ाइल जोड़ें।",
      tableHeaders: { rank: "रैंक", learner: "नाम", track: "मोड", ageDob: "आयु / जन्म", skills: "कौशल", points: "अंक" },
      youBadge: "आप",
      quizzesLabel: "क्विज़",
    },
    profilePage: {
      title: "मेरी प्रोफ़ाइल और विवरण",
      subtitle: "नाम, आयु, जन्म तिथि, मोड और कौशल अपडेट करें।",
      savedNotice: "प्रोफ़ाइल सहेजी गई और रैंक अपडेट हुई।",
      fields: {
        name: "पूरा नाम",
        age: "आयु",
        dob: "जन्म तिथि",
        mode: "मोड",
        email: "ईमेल",
        mobile: "मोबाइल",
        skills: "वर्तमान कौशल",
        projects: "प्रोजेक्ट्स",
        targetRole: "लक्ष्य भूमिका",
        details: "विवरण",
      },
      rankCardTitle: "वर्तमान रैंक",
      pointsLabel: "अंक",
      modeSkillsTitle: "मोड कौशल लाइब्रेरी",
      modeSkillsDesc: "जोड़ने के लिए क्लिक करें।",
    },
    planner: {
      title: "AI करियर इंटेलिजेंस स्टूडियो",
      subtitle: "4-सप्ताह की योजना बनाने के लिए AI एजेंट्स चलाएं।",
      presetsTitle: "त्वरित टेम्पलेट्स",
      presetsSubtitle: "एक उदाहरण चुनें:",
      agentFeedTitle: "AI एजेंट गतिविधि लॉग",
      form: {
        modeLabel: "मोड",
        nameLabel: "नाम",
        namePlaceholder: "उदा. माया चेन",
        skillsLabel: "कौशल",
        skillsPlaceholder: "उदा. Python, SQL",
        projectsLabel: "प्रोजेक्ट्स",
        projectsPlaceholder: "उदा. वेब ऐप",
        targetRoleLabel: "लक्ष्य भूमिका",
        targetRolePlaceholder: "उदा. Full-Stack Cloud Engineer",
        mentorNoteLabel: "नोट",
        mentorNotePlaceholder: "उदा. व्यावहारिक अभ्यास",
      },
      howItWorksTitle: "4 सहयोगी AI एजेंट्स",
      agent1Title: "कौशल विश्लेषक",
      agent1Desc: "कौशल अंतर की पहचान करता है।",
      agent2Title: "पाठ्यक्रम निर्माता",
      agent2Desc: "4-सप्ताह का रोडमैप बनाता है।",
      agent3Title: "क्विज़ और कोच एजेंट्स",
      agent3Desc: "आपकी भाषा में अभ्यास और क्विज़ बनाते हैं।",
    },
    common: { languageLabel: "भाषा", loading: "लोड हो रहा है...", errorTitle: "त्रुटि", weekShort: "सप्त.", exercisesLabel: "अभ्यास", coursesLabel: "कोर्स", pts: "अंक" },
  },
  ja: {
    brandName: "SkillMint",
    workspaceLabel: "ワークスペース",
    nav: {
      overview: "概要",
      roadmap: "学習プラン",
      coach: "AIコーチ",
      quiz: "スキル診断",
      rankings: "ランキング",
      profile: "プロフィール",
      planner: "AIプラン作成",
    },
    actions: {
      newPlan: "新規プラン",
      continueWeek: "今週を続ける",
      takeQuiz: "クイズを受ける",
      generatePlan: "AIエージェント実行",
      generatingPlan: "分析中...",
      generateQuiz: "3問クイズを生成",
      generatingQuiz: "準備中...",
      markComplete: "完了にする",
      completed: "完了",
      submitQuiz: "解答を確認",
      nextSkill: "別のスキル",
      retakeQuiz: "新しい問題",
      backToRoadmap: "プランに戻る",
      resetProgress: "リセット",
      dismissGuide: "非表示",
      signOut: "ログアウト",
      saveProfile: "保存してランク更新",
      addUser: "ユーザーを追加",
    },
    modes: { Student: "学生", Individual: "個人", Organization: "企業" },
    modeTracks: {
      Student: "学校・大学スキル",
      Individual: "個人・キャリアスキル",
      Organization: "企業モデルスキル",
    },
    modeDescriptions: {
      Student: "基礎学力、大学課題、インターン対策",
      Individual: "個人開発、ポートフォリオ、キャリア転換",
      Organization: "企業クラウド統制、KPI連携、セキュリティ",
    },
    auth: {
      heroBadge: "マルチエージェントAIスキルプラットフォーム",
      heroTitle: "学生・個人・企業のスキルギャップを高速解消",
      heroSubtitle: "Google、メールOTP、携帯OTPでログインし、ランクを上げましょう。",
      signInTitle: "SkillMintにログイン",
      signInSubtitle: "Google、メールOTP、または携帯OTPを選択してください。",
      tabs: { email: "メールOTP", mobile: "携帯OTP", google: "Google" },
      emailLabel: "メールアドレス",
      emailPlaceholder: "name@company.com",
      mobileLabel: "携帯番号",
      mobilePlaceholder: "+81 90 1234 5678",
      sendOtp: "OTP送信",
      sendingOtp: "送信中...",
      otpLabel: "6桁の確認コード",
      otpPlaceholder: "コードを入力",
      verifyOtp: "確認して続行",
      verifyingOtp: "確認中...",
      resendOtp: "再送",
      otpSentBanner: "OTP送信完了！コード:",
      autofillOtp: "自動入力",
      googleButton: "Googleで続行",
      googleNameLabel: "Googleアカウント名",
      googleEmailLabel: "Googleメール",
      googleHint: "Googleアカウント情報でログインします。",
      completeProfileTitle: "プロフィール設定",
      completeProfileSubtitle: "トラックとランクを設定するための詳細を入力してください。",
      finishSetup: "プロフィールを作成",
      demoBypass: "デモでプレビュー",
    },
    overview: {
      welcomePrefix: "進捗概要",
      targetGoalLabel: "目標ロール",
      kpis: {
        roleReadiness: "目標適合度",
        roleReadinessSub: "初期評価",
        roadmapProgress: "プラン進捗",
        roadmapProgressSub: "教材と演習",
        assessmentsPassed: "認定スキル",
        assessmentsPassedSub: "67%以上合格",
        globalRank: "ランキング順位",
        globalRankSub: "全学習者中",
      },
      weeklyProgressTitle: "4週間カリキュラム進捗",
      weeklyProgressDesc: "演習とクイズでランクポイントを獲得しましょう。",
      skillGapTitle: "スキル概要",
      strengthsLabel: "強み",
      focusAreasLabel: "強化項目",
      quizHistoryTitle: "診断履歴",
      quizHistoryEmpty: "履歴なし",
      quizHistoryEmptyDesc: "クイズを受けてポイントを獲得しましょう。",
      tableHeaders: { skill: "スキル", score: "スコア", status: "判定", date: "日付", action: "操作" },
      statusLabels: { passed: "合格", review: "要復習" },
      guideTitle: "クイックガイド",
      guideSteps: [
        { title: "1. モードを選択", desc: "学生・個人・企業トラックから選択。" },
        { title: "2. AIコーチで実践", desc: "毎日のドリルで着実に成長。" },
        { title: "3. ランクを上げる", desc: "テスト合格でポイント獲得。" },
      ],
    },
    roadmap: {
      title: "4週間学習ロードマップ",
      subtitle: "最適化されたカリキュラムとギャップ分析。",
      allWeeks: "全週",
      weekLabel: "第",
      strengths: "強み",
      missingSkills: "課題スキル",
      recommendedProjects: "推奨課題",
      coursesTitle: "推奨教材",
      practicalExerciseTitle: "実践演習 (+40 pt)",
      testSkillCta: "テスト",
      progressLabel: "進捗",
      modeSkillCatalogTitle: "モード別推奨スキル",
    },
    coach: {
      title: "AIスキルコーチ＆改善ラボ",
      subtitle: "毎日の練習メニューと対話型AIメンター。",
      focusSkillLabel: "強化したいスキル",
      focusSkillPlaceholder: "例: Python, クラウド設計",
      generateCoachBtn: "改善プランを作成",
      generatingCoachBtn: "分析中...",
      blueprintTitle: "個別スキル開発プラン",
      dailyDrillsTitle: "20分デイリードリル",
      challengeTitle: "実践チャレンジ",
      milestoneTitle: "7日間マイルストーン",
      suggestedSkillsTitle: "追加推奨スキル",
      addSkillBtn: "追加",
      mentorTitle: "AIメンターチャット",
      mentorSubtitle: "学習方法やキャリアについて質問できます。",
      mentorPlaceholder: "AIメンターに質問する...",
      sendMessage: "送信",
    },
    quiz: {
      title: "スキル診断スタジオ",
      subtitle: "67%以上で+60ランクポイント獲得。",
      topicLabel: "診断スキル",
      topicPlaceholder: "例: Docker, React",
      quickTopicsLabel: "おすすめ",
      modeLabel: "モード",
      questionPrefix: "問題",
      ofLabel: "/",
      correctLabel: "正解",
      reviewLabel: "復習",
      explanationLabel: "解説",
      scoreSummaryTitle: "完了",
      passedMessage: "素晴らしい！+60ポイント獲得しました。",
      reviewMessage: "解説を確認して再挑戦しましょう。",
      emptyTitle: "診断を始めましょう",
      emptyDesc: "上からトピックを選んでください。",
      selectAllPrompt: "すべての問題に回答してください。",
    },
    rankings: {
      title: "ユーザーランキング",
      subtitle: "他ユーザーのランクを確認したり、新しいユーザーを追加できます。",
      filterAll: "すべて",
      addUserTitle: "ランキングにユーザーを追加",
      addUserSubtitle: "比較用の学習者プロフィールを追加します。",
      tableHeaders: { rank: "順位", learner: "ユーザー", track: "モード", ageDob: "年齢 / 生年月日", skills: "スキル", points: "スコア" },
      youBadge: "あなた",
      quizzesLabel: "テスト",
    },
    profilePage: {
      title: "プロフィール＆詳細",
      subtitle: "氏名、年齢、生年月日、モード、スキルを管理します。",
      savedNotice: "プロフィールを保存し順位を更新しました。",
      fields: {
        name: "氏名",
        age: "年齢",
        dob: "生年月日",
        mode: "モード",
        email: "メール",
        mobile: "携帯番号",
        skills: "現在のスキル",
        projects: "実績・資格",
        targetRole: "目標職種",
        details: "詳細",
      },
      rankCardTitle: "現在の順位",
      pointsLabel: "ポイント",
      modeSkillsTitle: "モード別スキルライブラリ",
      modeSkillsDesc: "クリックして追加。",
    },
    planner: {
      title: "AIキャリア＆スキルスタジオ",
      subtitle: "マルチエージェントが4週間プランを生成します。",
      presetsTitle: "テンプレート",
      presetsSubtitle: "サンプルを選択:",
      agentFeedTitle: "エージェント稼働ログ",
      form: {
        modeLabel: "モード",
        nameLabel: "氏名",
        namePlaceholder: "例: Maya Chen",
        skillsLabel: "スキル",
        skillsPlaceholder: "例: Python, SQL",
        projectsLabel: "プロジェクト",
        projectsPlaceholder: "例: Webアプリ",
        targetRoleLabel: "目標職種",
        targetRolePlaceholder: "例: Full-Stack Cloud Engineer",
        mentorNoteLabel: "補足",
        mentorNotePlaceholder: "例: 実践重視",
      },
      howItWorksTitle: "4つの連携AIエージェント",
      agent1Title: "スキル分析",
      agent1Desc: "目標とのギャップを算出します。",
      agent2Title: "カリキュラム設計",
      agent2Desc: "4週間ロードマップを作成します。",
      agent3Title: "診断＆コーチ",
      agent3Desc: "選択言語でクイズと練習を生成します。",
    },
    common: { languageLabel: "言語", loading: "読み込み中...", errorTitle: "エラー", weekShort: "W", exercisesLabel: "演習", coursesLabel: "教材", pts: "pt" },
  },
};
