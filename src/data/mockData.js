// ==========================================================================
// WhatsApp Learning Bot — Realistic Seed Data & Initial State
// ==========================================================================

export const INITIAL_WABA_CONFIG = {
  wabaId: "109482710382941",
  phoneNumberId: "104928371902847",
  displayPhoneNumber: "+91 98200 44321",
  verifiedName: "Ekatra Learning Bot",
  qualityRating: "GREEN (High Quality)",
  status: "CONNECTED",
  webhookUrl: "https://api.yourdomain.com/webhook/whatsapp",
  webhookVerifyToken: "ekatra_secret_verify_token_2026",
  webhookLatencyMs: 24,
  autoReplyEnabled: true,
  dailyDropTime: "08:30 IST",
  backendApiUrl: "http://localhost:8000/api/v1",
  backendMode: "mock", // 'mock' or 'live'
};

export const INITIAL_COURSES = [
  {
    id: "course_quad_10",
    code: "MATH-101",
    title: "Class 10: Quadratic Equations & Algebra",
    audience: "Class 10 CBSE / State Board",
    language: "English / Hinglish",
    status: "active",
    durationDays: 5,
    enrolledCount: 482,
    completionRate: 81.4,
    avgQuizScore: 88,
    createdAt: "2026-08-12",
    description: "Daily 5-minute bite-sized concepts, WhatsApp quizzes, and voice note explanations for Grade 10 students.",
    days: [
      {
        day: 1,
        title: "Introduction: What is a Quadratic Equation?",
        concept: "Standard form ax² + bx + c = 0 where a ≠ 0",
        messageText: "📚 *Day 1: Quadratic Equations*\n\nHey student! Welcome to Day 1.\n\nA *Quadratic Equation* is any equation of degree 2:\n👉 `ax² + bx + c = 0` (where a ≠ 0)\n\n*Example:* `2x² - 5x + 3 = 0` is quadratic because highest power is 2.\n`3x + 4 = 0` is NOT quadratic (highest power is 1).\n\nTap below to test yourself on today's micro-quiz! 👇",
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
        quiz: {
          question: "Which of the following is a Quadratic Equation?",
          options: [
            { id: "opt_a", text: "A) 4x + 7 = 0", isCorrect: false },
            { id: "opt_b", text: "B) x² - 9 = 0", isCorrect: true },
            { id: "opt_c", text: "C) x³ + x = 4", isCorrect: false }
          ],
          explanation: "✅ *Spot on!* In option B, highest power of x is 2 (x² - 9 = 0), making it a true quadratic equation."
        }
      },
      {
        day: 2,
        title: "Solving by Splitting the Middle Term",
        concept: "Factorisation method for ax² + bx + c = 0",
        messageText: "⚡ *Day 2: Factorisation Method*\n\nToday we learn how to factorise `x² - 5x + 6 = 0`.\n\n1. Multiply 'a' and 'c' -> 1 * 6 = 6\n2. Find two numbers that multiply to 6 and add to -5:\n   👉 -2 and -3!\n3. Rewrite: `(x - 2)(x - 3) = 0`\n4. Roots are `x = 2` and `x = 3`.\n\nListen to the 40s audio note below for a shortcut trick! 🎧",
        mediaType: "audio",
        mediaUrl: "voice_note_day2.mp3",
        quiz: {
          question: "What are the roots of x² - 7x + 12 = 0?",
          options: [
            { id: "opt_a", text: "A) 3 and 4", isCorrect: true },
            { id: "opt_b", text: "B) -3 and -4", isCorrect: false },
            { id: "opt_c", text: "C) 2 and 6", isCorrect: false }
          ],
          explanation: "✅ *Correct!* -3 * -4 = +12, and -3 + (-4) = -7. So (x-3)(x-4)=0 => x=3, 4."
        }
      },
      {
        day: 3,
        title: "Nature of Roots: The Discriminant (D = b² - 4ac)",
        concept: "Real & equal, real & distinct, or no real roots",
        messageText: "🔍 *Day 3: The Discriminant Formula*\n\nThe value `D = b² - 4ac` tells us the nature of roots instantly!\n\n• If *D > 0*: Two real & distinct roots\n• If *D = 0*: Two real & equal roots\n• If *D < 0*: No real roots (imaginary)\n\nLet's test this in today's challenge:",
        mediaType: "none",
        mediaUrl: "",
        quiz: {
          question: "For 2x² - 4x + 3 = 0, what is the value of D?",
          options: [
            { id: "opt_a", text: "A) D = -8 (No real roots)", isCorrect: true },
            { id: "opt_b", text: "B) D = +8 (Two real roots)", isCorrect: false },
            { id: "opt_c", text: "C) D = 0 (Equal roots)", isCorrect: false }
          ],
          explanation: "✅ *Correct!* D = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, equation has no real roots."
        }
      },
      {
        day: 4,
        title: "Word Problems: Speed, Distance & Time",
        concept: "Formulating real life quadratic equations",
        messageText: "🚂 *Day 4: Train Speed Challenge*\n\n'A train travels 360 km at uniform speed. If speed was 5 km/h more, it would take 1 hour less.'\n\nEquation formed: `360/x - 360/(x+5) = 1`\nSimplifies to: `x² + 5x - 1800 = 0`\nSolving gives speed `x = 40 km/h`.\n\nSolve the quick quiz below!",
        mediaType: "none",
        mediaUrl: "",
        quiz: {
          question: "Can train speed ever be a negative root like -45?",
          options: [
            { id: "opt_a", text: "A) No, speed is always positive", isCorrect: true },
            { id: "opt_b", text: "B) Yes, indicates reverse train", isCorrect: false }
          ],
          explanation: "✅ *Exactly right!* Speed is a scalar quantity and cannot be negative in this context, so we discard -45."
        }
      },
      {
        day: 5,
        title: "Final Rapid Fire Quiz & Course Certificate",
        concept: "Comprehensive assessment & revision",
        messageText: "🏆 *Day 5: Graduation Day!*\n\nYou made it through the 5-day WhatsApp sprint on Quadratic Equations!\n\nAnswer this final capstone question to claim your WhatsApp Certificate PDF instantly:",
        mediaType: "pdf",
        mediaUrl: "quadratic_summary_cheat_sheet.pdf",
        quiz: {
          question: "If roots of kx² - 2kx + 6 = 0 are equal, find value of k:",
          options: [
            { id: "opt_a", text: "A) k = 6", isCorrect: true },
            { id: "opt_b", text: "B) k = 0", isCorrect: false },
            { id: "opt_c", text: "C) k = 12", isCorrect: false }
          ],
          explanation: "🎉 *Congratulations!* D = 0 gives 4k² - 24k = 0 => k(k - 6) = 0. Since k≠0, k=6! You scored 5/5!"
        }
      }
    ]
  },
  {
    id: "course_spoken_eng",
    code: "ENG-201",
    title: "Daily Spoken English Sprint",
    audience: "High School & College Students",
    language: "English",
    status: "active",
    durationDays: 7,
    enrolledCount: 712,
    completionRate: 74.2,
    avgQuizScore: 82,
    createdAt: "2026-09-01",
    description: "Everyday conversational English drills delivered via WhatsApp audio prompts and interactive sentence building.",
    days: [
      {
        day: 1,
        title: "Confident Self-Introduction in 3 Sentences",
        concept: "Who you are, what you are studying, and your passion",
        messageText: "👋 *Day 1: Introduce Yourself Like a Pro*\n\nAvoid starting with 'Myself Rahul'. Instead use:\n1. 'Hi, I'm Rahul.'\n2. 'I'm currently in Grade 10 at St. Xavier's.'\n3. 'I'm passionate about robotics and football.'\n\nQuick test below: which sentence sounds most natural?",
        mediaType: "none",
        mediaUrl: "",
        quiz: {
          question: "Which greeting is most professional for a student?",
          options: [
            { id: "opt_a", text: "A) Hello, myself Priya.", isCorrect: false },
            { id: "opt_b", text: "B) Good morning, my name is Priya.", isCorrect: true },
            { id: "opt_c", text: "C) Hey Priya this side.", isCorrect: false }
          ],
          explanation: "✅ *Correct!* 'My name is...' or 'I am...' is grammatically clean and confident."
        }
      },
      {
        day: 2,
        title: "Polite Requests & Classroom Etiquette",
        concept: "Could you please vs Can you",
        messageText: "🗣️ *Day 2: Making Polite Requests*\n\nWhen asking a teacher or peer for help, use 'Could you please...':\n\n❌ 'Give me your notes.'\n✅ 'Could you please share yesterday's notes with me?'\n\nTap the right option below:",
        mediaType: "none",
        mediaUrl: "",
        quiz: {
          question: "How should you ask a teacher to repeat a question?",
          options: [
            { id: "opt_a", text: "A) Could you please repeat that, ma'am?", isCorrect: true },
            { id: "opt_b", text: "B) Speak again ma'am.", isCorrect: false }
          ],
          explanation: "✅ *Spot on!* 'Could you please...' is the gold standard for polite English."
        }
      }
    ]
  },
  {
    id: "course_fin_lit",
    code: "FIN-01",
    title: "Financial Literacy for Young Learners",
    audience: "Ages 14-20",
    language: "English / Hindi",
    status: "active",
    durationDays: 3,
    enrolledCount: 395,
    completionRate: 92.5,
    avgQuizScore: 94,
    createdAt: "2026-09-18",
    description: "Budgeting, UPI safety, compounding interest, and avoiding online fraud via simple WhatsApp lessons.",
    days: [
      {
        day: 1,
        title: "Needs vs Wants: The 50-30-20 Rule",
        concept: "Budgeting pocket money and earnings",
        messageText: "💰 *Day 1: The Golden 50/30/20 Rule*\n\nWhen you receive money:\n• 50% for *Needs* (Books, commute, essentials)\n• 30% for *Wants* (Snacks, outings, games)\n• 20% for *Savings* (Emergency fund)\n\nAnswer today's quiz:",
        mediaType: "none",
        mediaUrl: "",
        quiz: {
          question: "If your monthly allowance is ₹1,000, how much should you save?",
          options: [
            { id: "opt_a", text: "A) ₹100", isCorrect: false },
            { id: "opt_b", text: "B) ₹200 (20%)", isCorrect: true },
            { id: "opt_c", text: "C) ₹500", isCorrect: false }
          ],
          explanation: "✅ *Exactly!* 20% of ₹1,000 is ₹200 saved every month."
        }
      }
    ]
  },
  {
    id: "course_python_bot",
    code: "CS-101",
    title: "Python Logic & Coding via WhatsApp",
    audience: "High School Computer Science",
    language: "English",
    status: "draft",
    durationDays: 5,
    enrolledCount: 0,
    completionRate: 0,
    avgQuizScore: 0,
    createdAt: "2026-10-01",
    description: "Interactive coding snippets, output prediction quizzes, and syntax micro-drills.",
    days: [
      {
        day: 1,
        title: "Print statements & Variables",
        concept: "print('Hello World') and string types",
        messageText: "🐍 *Day 1: Your First Python Line*\n\nIn Python, you print anything with `print('...')`:\n```python\nname = 'Aarav'\nprint(f'Hello {name}!')\n```\nOutput: `Hello Aarav!`\n\nPredict the quiz output below:",
        mediaType: "none",
        mediaUrl: "",
        quiz: {
          question: "What is output of: print(3 + 2 * 2)?",
          options: [
            { id: "opt_a", text: "A) 10", isCorrect: false },
            { id: "opt_b", text: "B) 7 (BODMAS applies)", isCorrect: true },
            { id: "opt_c", text: "C) Error", isCorrect: false }
          ],
          explanation: "✅ *Great job!* Multiplication happens before addition: 2*2=4, then 3+4=7."
        }
      }
    ]
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "stu_9198201",
    name: "Rahul Sharma",
    phone: "+91 98201 44321",
    enrolledCourseId: "course_quad_10",
    courseName: "Class 10: Quadratic Equations",
    currentDay: 4,
    totalDays: 5,
    quizScore: "4/4 (100%)",
    status: "active",
    lastActive: "12 mins ago",
    joinedAt: "2026-10-10",
    unhandledQuery: false,
    notes: "Very consistent student, responds within 5 minutes of drop."
  },
  {
    id: "stu_9197110",
    name: "Pooja Patel",
    phone: "+91 97110 55219",
    enrolledCourseId: "course_spoken_eng",
    courseName: "Daily Spoken English Sprint",
    currentDay: 2,
    totalDays: 7,
    quizScore: "2/2 (100%)",
    status: "active",
    lastActive: "34 mins ago",
    joinedAt: "2026-10-13",
    unhandledQuery: false,
    notes: "Requested voice feedback feature."
  },
  {
    id: "stu_9198104",
    name: "Amit Verma",
    phone: "+91 98104 99120",
    enrolledCourseId: "course_quad_10",
    courseName: "Class 10: Quadratic Equations",
    currentDay: 2,
    totalDays: 5,
    quizScore: "1/2 (50%)",
    status: "stuck",
    lastActive: "Yesterday, 19:40",
    joinedAt: "2026-10-11",
    unhandledQuery: true,
    notes: "Asked: 'Why can we not split using -1 and -6?'. Needs educator explanation."
  },
  {
    id: "stu_9199341",
    name: "Sneha Mukherjee",
    phone: "+91 99341 88203",
    enrolledCourseId: "course_fin_lit",
    courseName: "Financial Literacy for Young Learners",
    currentDay: 3,
    totalDays: 3,
    quizScore: "3/3 (100%)",
    status: "completed",
    lastActive: "2 hours ago",
    joinedAt: "2026-10-09",
    unhandledQuery: false,
    notes: "Graduated with WhatsApp Certificate PDF."
  },
  {
    id: "stu_9198765",
    name: "Karan Johar",
    phone: "+91 98765 01928",
    enrolledCourseId: "course_quad_10",
    courseName: "Class 10: Quadratic Equations",
    currentDay: 1,
    totalDays: 5,
    quizScore: "0/1 (0%)",
    status: "paused",
    lastActive: "3 days ago",
    joinedAt: "2026-10-08",
    unhandledQuery: false,
    notes: "Student paused notifications for school exam week."
  },
  {
    id: "stu_9198112",
    name: "Ananya Iyer",
    phone: "+91 98112 33499",
    enrolledCourseId: "course_spoken_eng",
    courseName: "Daily Spoken English Sprint",
    currentDay: 3,
    totalDays: 7,
    quizScore: "3/3 (100%)",
    status: "active",
    lastActive: "Just now",
    joinedAt: "2026-10-12",
    unhandledQuery: false,
    notes: "High engagement."
  },
  {
    id: "stu_9197660",
    name: "Vikram Malhotra",
    phone: "+91 97660 72308",
    enrolledCourseId: "course_quad_10",
    courseName: "Class 10: Quadratic Equations",
    currentDay: 3,
    totalDays: 5,
    quizScore: "2/3 (66%)",
    status: "needs_help",
    lastActive: "15 mins ago",
    joinedAt: "2026-10-10",
    unhandledQuery: true,
    notes: "Student replied 'I don't understand discriminant negative value'."
  }
];

export const INITIAL_CONVERSATIONS = {
  "stu_9198201": [
    { id: "m1", sender: "bot", time: "08:30 AM", type: "text", text: "📚 *Day 1: Quadratic Equations*\n\nHey Rahul! Standard form is `ax² + bx + c = 0` (a ≠ 0)." },
    { id: "m2", sender: "bot", time: "08:31 AM", type: "quiz", text: "Quiz 1: Which of the following is a Quadratic Equation?\nA) 4x+7=0\nB) x²-9=0\nC) x³+x=4", buttons: ["A", "B", "C"] },
    { id: "m3", sender: "student", time: "08:33 AM", type: "text", text: "B" },
    { id: "m4", sender: "bot", time: "08:33 AM", type: "text", text: "✅ *Spot on!* In option B, highest power of x is 2 (x² - 9 = 0). Score: 1/1" },
    { id: "m5", sender: "bot", time: "Yesterday, 08:30 AM", type: "text", text: "⚡ *Day 2: Factorisation Method*\nSolve `x² - 5x + 6 = 0` by splitting -5 into -2 and -3." },
    { id: "m6", sender: "student", time: "Yesterday, 08:35 AM", type: "text", text: "A" },
    { id: "m7", sender: "bot", time: "Yesterday, 08:35 AM", type: "text", text: "✅ *Correct!* Roots are 3 and 4. Keep this momentum!" },
    { id: "m8", sender: "student", time: "12 mins ago", type: "text", text: "Ready for Day 4 word problems sir!" }
  ],
  "stu_9197660": [
    { id: "m10", sender: "bot", time: "Yesterday, 08:30 AM", type: "text", text: "🔍 *Day 3: Nature of Roots (D = b² - 4ac)*\nIf D < 0, equation has NO real roots." },
    { id: "m11", sender: "student", time: "Yesterday, 08:42 AM", type: "text", text: "Sir, what does no real roots mean? Does x have no answer?" },
    { id: "m12", sender: "bot", time: "Yesterday, 08:42 AM", type: "text", text: "🤖 (Automated) Great question Vikram! 'No real roots' means you cannot find any normal real number that fits. In Grade 11, you will study imaginary numbers (i = √-1)." },
    { id: "m13", sender: "student", time: "15 mins ago", type: "text", text: "Still feeling confused on how to write it in board exam" }
  ],
  "stu_9198104": [
    { id: "m20", sender: "bot", time: "2 days ago, 08:30 AM", type: "text", text: "Welcome Amit to Class 10 Quadratic Equations!" },
    { id: "m21", sender: "student", time: "Yesterday, 19:40", type: "text", text: "Why can we not split using -1 and -6?" }
  ]
};

export const INITIAL_META_TEMPLATES = [
  {
    id: "tpl_daily_drop",
    name: "daily_micro_drop_v2",
    category: "UTILITY",
    language: "en_US",
    status: "APPROVED",
    metaReviewDate: "2026-09-28",
    header: "📚 *{{1}} — Day {{2}}*",
    body: "Hi {{3}},\n\nHere is your bite-sized lesson for today:\n\n{{4}}\n\nTap below to test yourself on today's quick quiz!",
    buttons: ["Start Quiz ⚡", "Ask Educator 🙋‍♂️"],
    metrics: { sent: 12490, delivered: "99.2%", read: "89.4%" }
  },
  {
    id: "tpl_quiz_nudge",
    name: "quiz_reminder_nudge",
    category: "UTILITY",
    language: "en_US",
    status: "APPROVED",
    metaReviewDate: "2026-10-02",
    header: "⏰ Quick Reminder",
    body: "Hey {{1}},\n\nYou haven't submitted your 1-minute quiz for Day {{2}} yet! Keep your learning streak alive. Reply with your answer or tap below.",
    buttons: ["Take Quiz Now 🚀", "Pause Today ⏸️"],
    metrics: { sent: 3410, delivered: "98.9%", read: "84.1%" }
  },
  {
    id: "tpl_welcome_student",
    name: "student_welcome_onboarding",
    category: "MARKETING",
    language: "en_US",
    status: "APPROVED",
    metaReviewDate: "2026-08-15",
    header: "🎉 Welcome to Ekatra WhatsApp Learning",
    body: "Hello {{1}}! You have successfully enrolled in *{{2}}*.\n\nEvery morning at 8:30 AM, you will receive a 5-minute interactive lesson and quiz right here on WhatsApp.\n\nReady to begin?",
    buttons: ["Start Day 1 Now", "Change Schedule"],
    metrics: { sent: 8900, delivered: "99.8%", read: "94.6%" }
  },
  {
    id: "tpl_grad_cert",
    name: "course_completion_certificate",
    category: "UTILITY",
    language: "en_US",
    status: "APPROVED",
    metaReviewDate: "2026-09-15",
    header: "🏆 Congratulations!",
    body: "Proud moment {{1}}! You have completed all {{2}} days of *{{3}}* with a quiz score of {{4}}%.\n\nYour official PDF certificate is attached below.",
    buttons: ["Download PDF", "Explore Next Course"],
    metrics: { sent: 2150, delivered: "99.7%", read: "96.1%" }
  },
  {
    id: "tpl_audio_prompt",
    name: "audio_practice_prompt_v1",
    category: "UTILITY",
    language: "en_US",
    status: "IN_REVIEW",
    metaReviewDate: "2026-10-14",
    header: "🎧 Audio Practice Drill",
    body: "Listen to the 30-second pronunciation sample and send back your voice note.",
    buttons: ["Send Voice Note", "Text Equivalent"],
    metrics: { sent: 0, delivered: "--", read: "--" }
  }
];

export const INITIAL_INBOUND_FEED = [
  {
    id: "ev_1",
    time: "2 mins ago",
    phone: "+91 98201 44321",
    student: "Rahul Sharma",
    course: "Quadratic Equations",
    type: "quiz_correct",
    message: "Answered Quiz 3: B (Correct) -> Bot awarded 10 XP"
  },
  {
    id: "ev_2",
    time: "8 mins ago",
    phone: "+91 97660 72308",
    student: "Vikram Malhotra",
    course: "Quadratic Equations",
    type: "unhandled_query",
    message: "Asked: 'Still feeling confused on how to write it in board exam' -> Flagged for educator"
  },
  {
    id: "ev_3",
    time: "22 mins ago",
    phone: "+91 97110 55219",
    student: "Pooja Patel",
    course: "Daily Spoken English",
    type: "lesson_completed",
    message: "Finished Day 2 lesson + interactive dialogue exercise"
  },
  {
    id: "ev_4",
    time: "45 mins ago",
    phone: "+91 98104 99120",
    student: "Amit Verma",
    course: "Quadratic Equations",
    type: "quiz_retry",
    message: "Answered Quiz 2: Option A (Attempt 2 - Correct)"
  },
  {
    id: "ev_5",
    time: "1 hr ago",
    phone: "+91 99341 88203",
    student: "Sneha Mukherjee",
    course: "Financial Literacy",
    type: "certificate_issued",
    message: "Course finished! Dispatched certificate PDF via WhatsApp Cloud API"
  }
];

export const INITIAL_BROADCASTS = [
  {
    id: "bc_1",
    title: "Class 10 Weekend Revision Nudge",
    targetCohort: "Students in Class 10 Quadratic Equations",
    templateUsed: "quiz_reminder_nudge",
    sentCount: 342,
    deliveredCount: 339,
    readCount: 301,
    status: "Completed",
    sentAt: "2026-10-12, 18:00 IST"
  },
  {
    id: "bc_2",
    title: "Day 3 Morning Drop — All Cohorts",
    targetCohort: "Active enrolled students",
    templateUsed: "daily_micro_drop_v2",
    sentCount: 680,
    deliveredCount: 677,
    readCount: 612,
    status: "Completed",
    sentAt: "2026-10-14, 08:30 IST"
  }
];
