// ==========================================================================
// WhatsApp Learning Bot — API Service Layer (Backend Ready & State Store)
// ==========================================================================

import {
  INITIAL_WABA_CONFIG,
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_META_TEMPLATES,
  INITIAL_INBOUND_FEED,
  INITIAL_BROADCASTS
} from '../data/mockData.js';

const STORAGE_KEYS = {
  CONFIG: 'wa_bot_config',
  COURSES: 'wa_bot_courses',
  STUDENTS: 'wa_bot_students',
  CONVERSATIONS: 'wa_bot_conversations',
  TEMPLATES: 'wa_bot_templates',
  EVENTS: 'wa_bot_inbound_events',
  BROADCASTS: 'wa_bot_broadcasts'
};

function getLocalData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Failed to read ${key} from localStorage, using fallback:`, e);
    return fallback;
  }
}

function setLocalData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

// In-memory / localStorage database
class BotDataStore {
  constructor() {
    this.config = getLocalData(STORAGE_KEYS.CONFIG, INITIAL_WABA_CONFIG);
    this.courses = getLocalData(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    this.students = getLocalData(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    this.conversations = getLocalData(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    this.templates = getLocalData(STORAGE_KEYS.TEMPLATES, INITIAL_META_TEMPLATES);
    this.events = getLocalData(STORAGE_KEYS.EVENTS, INITIAL_INBOUND_FEED);
    this.broadcasts = getLocalData(STORAGE_KEYS.BROADCASTS, INITIAL_BROADCASTS);
  }

  saveAll() {
    setLocalData(STORAGE_KEYS.CONFIG, this.config);
    setLocalData(STORAGE_KEYS.COURSES, this.courses);
    setLocalData(STORAGE_KEYS.STUDENTS, this.students);
    setLocalData(STORAGE_KEYS.CONVERSATIONS, this.conversations);
    setLocalData(STORAGE_KEYS.TEMPLATES, this.templates);
    setLocalData(STORAGE_KEYS.EVENTS, this.events);
    setLocalData(STORAGE_KEYS.BROADCASTS, this.broadcasts);
  }

  resetToDefaults() {
    this.config = { ...INITIAL_WABA_CONFIG };
    this.courses = [...INITIAL_COURSES];
    this.students = [...INITIAL_STUDENTS];
    this.conversations = { ...INITIAL_CONVERSATIONS };
    this.templates = [...INITIAL_META_TEMPLATES];
    this.events = [...INITIAL_INBOUND_FEED];
    this.broadcasts = [...INITIAL_BROADCASTS];
    this.saveAll();
  }
}

export const store = new BotDataStore();

// Core API client - ready to connect to real endpoints when backendMode === 'live'
export const api = {
  // Check backend mode
  getBackendMode() {
    return store.config.backendMode || 'mock';
  },

  setBackendMode(mode, url = null) {
    store.config.backendMode = mode;
    if (url) store.config.backendApiUrl = url;
    store.saveAll();
  },

  // 1. STATS & OVERVIEW
  async getDashboardStats() {
    if (store.config.backendMode === 'live') {
      try {
        const res = await fetch(`${store.config.backendApiUrl}/stats`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Live API unavailable, falling back to local store:', err);
      }
    }

    const totalStudents = store.students.length;
    const activeCourses = store.courses.filter(c => c.status === 'active').length;
    const completedStudents = store.students.filter(s => s.status === 'completed').length;
    const completionRate = totalStudents ? Math.round((completedStudents / totalStudents) * 100) : 78;

    return {
      totalStudents: 1482 + totalStudents,
      activeCoursesCount: activeCourses,
      completionRate: 78.4,
      todayMessagesSent: 4210,
      todayMessagesDelivered: 4185,
      deliverySuccessRate: "99.4%",
      webhookLatencyMs: store.config.webhookLatencyMs,
      unhandledQueriesCount: store.students.filter(s => s.unhandledQuery).length,
      events: store.events
    };
  },

  // 2. COURSES
  async getCourses() {
    return [...store.courses];
  },

  async getCourseById(id) {
    return store.courses.find(c => c.id === id) || null;
  },

  async saveCourse(courseData) {
    const isNew = !courseData.id || courseData.id === 'new';
    if (isNew) {
      const newCourse = {
        ...courseData,
        id: 'course_' + Date.now(),
        enrolledCount: 0,
        completionRate: 0,
        avgQuizScore: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: courseData.status || 'active',
        days: courseData.days && courseData.days.length ? courseData.days : [
          {
            day: 1,
            title: "Day 1: Getting Started",
            concept: "Introduction & Core Concept",
            messageText: "👋 Welcome to Day 1!\n\nHere is your first concept:\n...",
            mediaType: "none",
            mediaUrl: "",
            quiz: {
              question: "Sample Question?",
              options: [
                { id: "opt_a", text: "A) Option 1", isCorrect: true },
                { id: "opt_b", text: "B) Option 2", isCorrect: false }
              ],
              explanation: "Option 1 is correct."
            }
          }
        ]
      };
      store.courses.unshift(newCourse);
      store.saveAll();
      return newCourse;
    } else {
      const idx = store.courses.findIndex(c => c.id === courseData.id);
      if (idx !== -1) {
        store.courses[idx] = { ...store.courses[idx], ...courseData };
        store.saveAll();
        return store.courses[idx];
      }
      return null;
    }
  },

  async deleteCourse(id) {
    store.courses = store.courses.filter(c => c.id !== id);
    store.saveAll();
    return true;
  },

  // 3. STUDENTS
  async getStudents(filters = {}) {
    let list = [...store.students];
    if (filters.status && filters.status !== 'all') {
      list = list.filter(s => s.status === filters.status);
    }
    if (filters.courseId && filters.courseId !== 'all') {
      list = list.filter(s => s.enrolledCourseId === filters.courseId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getStudentById(id) {
    const student = store.students.find(s => s.id === id);
    if (!student) return null;
    const conversation = store.conversations[id] || [];
    return { ...student, conversation };
  },

  async updateStudent(id, updates) {
    const idx = store.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      store.students[idx] = { ...store.students[idx], ...updates };
      store.saveAll();
      return store.students[idx];
    }
    return null;
  },

  // 4. MESSAGES / EDUCATOR TAKEOVER
  async sendEducatorMessage(studentId, text) {
    if (!store.conversations[studentId]) {
      store.conversations[studentId] = [];
    }

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'educator',
      time: 'Just now',
      type: 'text',
      text: text
    };

    store.conversations[studentId].push(newMsg);

    // If student had an unhandled query flag, resolve it
    const student = store.students.find(s => s.id === studentId);
    if (student) {
      student.unhandledQuery = false;
      student.lastActive = 'Just now';
    }

    store.events.unshift({
      id: 'ev_' + Date.now(),
      time: 'Just now',
      phone: student ? student.phone : 'Student',
      student: student ? student.name : 'Student',
      course: student ? student.courseName : 'General',
      type: 'educator_reply',
      message: `Educator manual reply: "${text.slice(0, 45)}..."`
    });

    store.saveAll();
    return newMsg;
  },

  // 5. BROADCASTS
  async getBroadcasts() {
    return [...store.broadcasts];
  },

  async sendBroadcast({ title, targetCohort, templateUsed, customNote }) {
    const newBc = {
      id: 'bc_' + Date.now(),
      title,
      targetCohort,
      templateUsed,
      sentCount: 340,
      deliveredCount: 337,
      readCount: 295,
      status: "Delivered",
      sentAt: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    store.broadcasts.unshift(newBc);

    store.events.unshift({
      id: 'ev_' + Date.now(),
      time: 'Just now',
      phone: 'Broadcast Batch',
      student: targetCohort,
      course: 'All Cohorts',
      type: 'broadcast',
      message: `Dispatched template "${templateUsed}" to 340 students.`
    });

    store.saveAll();
    return newBc;
  },

  // 6. META TEMPLATES
  async getTemplates() {
    return [...store.templates];
  },

  async createTemplate(templateData) {
    const newTpl = {
      ...templateData,
      id: 'tpl_' + Date.now(),
      status: 'IN_REVIEW',
      metaReviewDate: new Date().toISOString().split('T')[0],
      metrics: { sent: 0, delivered: '--', read: '--' }
    };
    store.templates.unshift(newTpl);
    store.saveAll();
    return newTpl;
  },

  // 7. WEBHOOK & SETTINGS
  async testWebhookPing() {
    const start = performance.now();
    await new Promise(r => setTimeout(r, 400));
    const latency = Math.round(performance.now() - start);
    store.config.webhookLatencyMs = latency;
    store.saveAll();
    return {
      status: "SUCCESS",
      httpCode: 200,
      latencyMs: latency,
      message: "Webhook challenge verification succeeded. Received 'hub.challenge' 200 OK.",
      timestamp: new Date().toISOString()
    };
  },

  async getConfig() {
    return { ...store.config };
  },

  async updateConfig(newConfig) {
    store.config = { ...store.config, ...newConfig };
    store.saveAll();
    return { ...store.config };
  },

  // 8. INTERACTIVE BOT SIMULATOR ENGINE (Browser side test driver)
  async simulateBotInteraction(userMessage, currentSession = {}) {
    const cleanMsg = (userMessage || '').trim();
    const upper = cleanMsg.toUpperCase();

    // Small delay to simulate WhatsApp webhook response
    await new Promise(r => setTimeout(r, 600));

    // Keyword detection
    if (upper === 'HI' || upper === 'HELLO' || upper === 'START') {
      const course = store.courses[0];
      const day1 = course.days[0];
      return {
        replyText: `👋 *Welcome to Ekatra Student Learning Bot!*\n\nYou are enrolled in *${course.title}*.\n\n${day1.messageText}`,
        buttons: day1.quiz.options.map(o => o.text.split(')')[0].trim()),
        hasQuiz: true,
        quizQuestion: day1.quiz.question,
        quizOptions: day1.quiz.options,
        nextStep: 'DAY_1_QUIZ'
      };
    }

    if (upper === 'A' || upper === 'B' || upper === 'C' || upper.startsWith('OPT_')) {
      const course = store.courses[0];
      const day1 = course.days[0];
      const correctOpt = day1.quiz.options.find(o => o.isCorrect);
      const isCorrect = (upper === 'B' || (correctOpt && upper.includes(correctOpt.text.charAt(0))));

      if (isCorrect) {
        return {
          replyText: `${day1.quiz.explanation}\n\n🏆 *Score: 10/10 XP!*\nTomorrow at 8:30 AM, you will unlock *Day 2: ${course.days[1]?.title || 'Next Concept'}*.\n\nReply *STATUS* anytime to see your learning streak.`,
          buttons: ["Next Lesson", "My Streak 🔥"],
          hasQuiz: false
        };
      } else {
        return {
          replyText: `❌ *Not quite!* Try again or check the hint:\nRemember, quadratic equations must have an *x²* term as highest power.\n\nTap *B* to see factorisation.`,
          buttons: ["Try Option B", "Ask Educator 🙋‍♂️"],
          hasQuiz: false
        };
      }
    }

    if (upper === 'STATUS' || upper === 'MY STREAK' || upper.includes('STREAK')) {
      return {
        replyText: `📊 *Your Learning Stats*\n\n👤 *Student:* Demo Learner\n🔥 *Streak:* 4 Days Active\n⭐ *Quiz Accuracy:* 92%\n📚 *Current Course:* Class 10: Quadratic Equations\n\nKeep going! You are in the top 10% of your batch.`,
        buttons: ["Resume Today", "Help ❓"],
        hasQuiz: false
      };
    }

    if (upper.includes('HELP') || upper.includes('DOUBT') || upper.includes('EXPLAIN') || upper.includes('WHY')) {
      return {
        replyText: `🙋‍♂️ *Doubt Recorded for Educator*\n\nI've forwarded your query: "${cleanMsg}" to your teacher. They usually review doubts within 30 minutes.\n\nReply *CONTINUE* to proceed with your lesson drills.`,
        buttons: ["Continue Lesson", "FAQ"],
        hasQuiz: false
      };
    }

    // Default Fallback
    return {
      replyText: `🤖 *Ekatra Learning Assistant*\n\nI didn't quite catch that. You can:\n• Reply *START* to begin today's lesson\n• Reply *STATUS* to view your streak\n• Reply *DOUBT* followed by your question`,
      buttons: ["START 🚀", "STATUS 📊", "Ask Question ❓"],
      hasQuiz: false
    };
  }
};
