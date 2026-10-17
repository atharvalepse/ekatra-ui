// ==========================================================================
// WhatsApp Learning Bot — Main Application Controller & Router
// Fast, robust, responsive, zero-bloat operator dashboard
// ==========================================================================

import { store, api } from './services/api.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderHeader } from './components/Header.js';
import { renderOverviewView } from './components/OverviewView.js';
import { renderCoursesView } from './components/CoursesView.js';
import { renderCourseEditorModal, formatWhatsAppText } from './components/CourseEditorModal.js';
import { renderStudentsView } from './components/StudentsView.js';
import { renderStudentDrawer } from './components/StudentDrawer.js';
import { renderLiveChatView } from './components/LiveChatView.js';
import { renderBroadcastView } from './components/BroadcastView.js';
import { renderMetaTemplatesView } from './components/MetaTemplatesView.js';
import { renderSettingsView } from './components/SettingsView.js';
import { renderWhatsAppSimulator, initSimulatorLogic } from './components/WhatsAppSimulator.js';

class App {
  constructor() {
    this.currentRoute = this.getHashRoute();
    this.modalRoot = document.getElementById('modal-root');
    this.drawerRoot = document.getElementById('drawer-root');
    this.toastContainer = document.getElementById('toast-container');
    this.activeCourseModalData = null;
  }

  getHashRoute() {
    const hash = window.location.hash.replace('#', '').trim();
    const valid = ['overview', 'courses', 'students', 'livechat', 'broadcasts', 'templates', 'settings'];
    return valid.includes(hash) ? hash : 'overview';
  }

  init() {
    // Check saved theme
    const savedTheme = localStorage.getItem('wa_admin_theme') || 'theme-light';
    document.body.className = savedTheme;

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.currentRoute = this.getHashRoute();
      this.render();
    });

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
      }
    });

    this.render();
  }

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `
      <span style="font-weight: bold;">${icon}</span>
      <span>${message}</span>
    `;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  render() {
    const appContainer = document.getElementById('app');
    
    // Build App Shell
    appContainer.innerHTML = `
      ${renderSidebar(this.currentRoute)}
      <main class="app-main">
        ${renderHeader(this.currentRoute)}
        <div id="view-content" style="flex: 1; overflow: hidden; display: flex; flex-direction: column;">
          ${this.getViewHtml()}
        </div>
      </main>
      ${renderWhatsAppSimulator()}
    `;

    // Attach listeners
    this.attachGlobalListeners();
    this.attachViewSpecificListeners();
    initSimulatorLogic((msg, type) => this.showToast(msg, type));
  }

  getViewHtml() {
    switch (this.currentRoute) {
      case 'overview':
        return renderOverviewView();
      case 'courses':
        return renderCoursesView();
      case 'students':
        return renderStudentsView();
      case 'livechat':
        return renderLiveChatView();
      case 'broadcasts':
        return renderBroadcastView();
      case 'templates':
        return renderMetaTemplatesView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderOverviewView();
    }
  }

  attachGlobalListeners() {
    // Theme toggle
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('theme-dark');
        const next = isDark ? 'theme-light' : 'theme-dark';
        document.body.className = next;
        localStorage.setItem('wa_admin_theme', next);
        this.showToast(`Switched to ${isDark ? 'light' : 'dark'} mode`, 'info');
      });
    }

    // Backend toggle in header
    const backendBtn = document.getElementById('btn-backend-toggle');
    if (backendBtn) {
      backendBtn.addEventListener('click', () => {
        const currentMode = store.config.backendMode || 'mock';
        const nextMode = currentMode === 'mock' ? 'live' : 'mock';
        api.setBackendMode(nextMode);
        this.showToast(`Switched backend mode to: ${nextMode.toUpperCase()}`, 'info');
        this.render();
      });
    }

    // Header Quick Action ("New Course")
    const headerQuickBtn = document.getElementById('btn-header-quick-action');
    if (headerQuickBtn) {
      headerQuickBtn.addEventListener('click', () => {
        this.openCourseModal('new');
      });
    }

    // Open Simulator Button from Sidebar or Overview
    const toggleSimBtn = document.getElementById('btn-toggle-simulator');
    if (toggleSimBtn) {
      toggleSimBtn.addEventListener('click', () => {
        const sim = document.getElementById('whatsapp-simulator-overlay');
        if (sim) {
          sim.classList.remove('minimized');
          const toggle = document.getElementById('btn-sim-toggle');
          if (toggle) toggle.innerText = '▼';
        }
      });
    }

    // Global Search
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) return;
        // If on students or courses, route filter
        if (this.currentRoute !== 'students' && this.currentRoute !== 'courses') {
          window.location.hash = '#students';
          setTimeout(() => {
            const studentSearch = document.getElementById('student-search-input');
            if (studentSearch) {
              studentSearch.value = q;
              studentSearch.dispatchEvent(new Event('input'));
            }
          }, 50);
        }
      });
    }
  }

  attachViewSpecificListeners() {
    // Overview listeners
    if (this.currentRoute === 'overview') {
      const pingBtn = document.getElementById('btn-test-webhook-ping');
      if (pingBtn) {
        pingBtn.addEventListener('click', async () => {
          pingBtn.disabled = true;
          pingBtn.innerText = 'Pinging Webhook...';
          const res = await api.testWebhookPing();
          pingBtn.disabled = false;
          pingBtn.innerText = 'Test Webhook Ping Challenge';
          this.showToast(`Webhook 200 OK (${res.latencyMs}ms latency)`, 'success');
        });
      }

      const quickBc = document.getElementById('btn-quick-broadcast');
      if (quickBc) {
        quickBc.addEventListener('click', () => {
          window.location.hash = '#broadcasts';
        });
      }

      const simOverview = document.getElementById('btn-open-sim-overview');
      if (simOverview) {
        simOverview.addEventListener('click', () => {
          const sim = document.getElementById('whatsapp-simulator-overlay');
          if (sim) {
            sim.classList.remove('minimized');
          }
        });
      }

      document.querySelectorAll('.btn-edit-course').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-course-id');
          this.openCourseModal(id);
        });
      });

      document.querySelectorAll('.btn-open-student-drawer').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-student-id');
          this.openStudentDrawer(id);
        });
      });
    }

    // Courses View Listeners
    if (this.currentRoute === 'courses') {
      const createBtn = document.getElementById('btn-create-course');
      if (createBtn) {
        createBtn.addEventListener('click', () => this.openCourseModal('new'));
      }

      document.querySelectorAll('.btn-edit-course').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-course-id');
          this.openCourseModal(id);
        });
      });

      document.querySelectorAll('.btn-preview-course').forEach(btn => {
        btn.addEventListener('click', () => {
          const sim = document.getElementById('whatsapp-simulator-overlay');
          if (sim) {
            sim.classList.remove('minimized');
            const simInput = document.getElementById('sim-input-text');
            if (simInput) {
              simInput.value = 'START';
              document.getElementById('sim-form')?.dispatchEvent(new Event('submit'));
            }
          }
        });
      });

      document.querySelectorAll('.btn-delete-course').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-course-id');
          if (confirm('Are you sure you want to delete this course sequence?')) {
            await api.deleteCourse(id);
            this.showToast('Course sequence deleted', 'info');
            this.render();
          }
        });
      });

      // Filter & Search
      const searchBox = document.getElementById('course-search-input');
      const statusFilter = document.getElementById('course-status-filter');
      const langFilter = document.getElementById('course-lang-filter');

      const applyCourseFilters = () => {
        const q = (searchBox?.value || '').toLowerCase();
        const st = statusFilter?.value || 'all';
        const lg = langFilter?.value || 'all';

        document.querySelectorAll('#courses-table tbody tr').forEach(row => {
          const courseId = row.getAttribute('data-course-id');
          const course = store.courses.find(c => c.id === courseId);
          if (!course) return;

          const matchText = course.title.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);
          const matchStatus = st === 'all' || course.status === st;
          const matchLang = lg === 'all' || course.language.includes(lg);

          row.style.display = (matchText && matchStatus && matchLang) ? '' : 'none';
        });
      };

      searchBox?.addEventListener('input', applyCourseFilters);
      statusFilter?.addEventListener('change', applyCourseFilters);
      langFilter?.addEventListener('change', applyCourseFilters);
    }

    // Students View Listeners
    if (this.currentRoute === 'students') {
      document.querySelectorAll('.btn-open-student-drawer').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-student-id');
          this.openStudentDrawer(id);
        });
      });

      document.querySelectorAll('.btn-copy-phone').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const phone = btn.getAttribute('data-phone');
          navigator.clipboard.writeText(phone);
          this.showToast(`Copied ${phone} to clipboard`, 'info');
        });
      });

      const addStudentBtn = document.getElementById('btn-add-student');
      if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
          const name = prompt('Enter student full name:');
          if (!name) return;
          const phone = prompt('Enter WhatsApp phone number with country code (e.g. +91 98200 11223):');
          if (!phone) return;

          const newStudent = {
            id: 'stu_' + Date.now(),
            name,
            phone,
            enrolledCourseId: store.courses[0].id,
            courseName: store.courses[0].title,
            currentDay: 1,
            totalDays: store.courses[0].durationDays || 5,
            quizScore: '0/1 (0%)',
            status: 'active',
            lastActive: 'Just enrolled',
            joinedAt: new Date().toISOString().split('T')[0],
            unhandledQuery: false,
            notes: 'Newly enrolled student via admin console'
          };

          store.students.unshift(newStudent);
          store.saveAll();
          this.showToast(`Enrolled student ${name}`, 'success');
          this.render();
        });
      }

      const importBtn = document.getElementById('btn-import-students');
      if (importBtn) {
        importBtn.addEventListener('click', () => {
          this.showToast('CSV batch importer ready for 500+ records', 'info');
        });
      }

      // Filter & Search
      const searchBox = document.getElementById('student-search-input');
      const courseFilter = document.getElementById('student-course-filter');
      const statusFilter = document.getElementById('student-status-filter');

      const applyStudentFilters = () => {
        const q = (searchBox?.value || '').toLowerCase();
        const cs = courseFilter?.value || 'all';
        const st = statusFilter?.value || 'all';

        document.querySelectorAll('#students-table tbody tr').forEach(row => {
          const sId = row.getAttribute('data-student-id');
          const student = store.students.find(s => s.id === sId);
          if (!student) return;

          const matchText = student.name.toLowerCase().includes(q) || student.phone.includes(q);
          const matchCourse = cs === 'all' || student.enrolledCourseId === cs;
          const matchStatus = st === 'all' || student.status === st;

          row.style.display = (matchText && matchCourse && matchStatus) ? '' : 'none';
        });
      };

      searchBox?.addEventListener('input', applyStudentFilters);
      courseFilter?.addEventListener('change', applyStudentFilters);
      statusFilter?.addEventListener('change', applyStudentFilters);
    }

    // Live Chat View Listeners
    if (this.currentRoute === 'livechat') {
      document.querySelectorAll('.chat-student-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-student-id');
          document.getElementById('view-content').innerHTML = renderLiveChatView(id);
          this.attachViewSpecificListeners();
        });
      });

      const sendBtn = document.getElementById('btn-livechat-send');
      const input = document.getElementById('livechat-composer-input');

      const submitLiveMsg = async () => {
        const txt = input?.value?.trim();
        const studentId = sendBtn?.getAttribute('data-student-id');
        if (!txt || !studentId) return;

        await api.sendEducatorMessage(studentId, txt);
        input.value = '';
        this.showToast('Message dispatched via WhatsApp Cloud API', 'success');
        document.getElementById('view-content').innerHTML = renderLiveChatView(studentId);
        this.attachViewSpecificListeners();
      };

      sendBtn?.addEventListener('click', submitLiveMsg);
      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitLiveMsg();
      });

      // Filter tabs in chat
      document.querySelectorAll('.chat-filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.chat-filter-tab').forEach(t => t.classList.remove('active', 'btn-secondary'));
          tab.classList.add('active', 'btn-secondary');
          const mode = tab.getAttribute('data-filter');

          document.querySelectorAll('.chat-student-item').forEach(item => {
            const sid = item.getAttribute('data-student-id');
            const student = store.students.find(s => s.id === sid);
            if (!student) return;

            if (mode === 'doubts') {
              item.style.display = student.unhandledQuery ? '' : 'none';
            } else if (mode === 'active') {
              item.style.display = student.status === 'active' ? '' : 'none';
            } else {
              item.style.display = '';
            }
          });
        });
      });
    }

    // Broadcasts View Listeners
    if (this.currentRoute === 'broadcasts') {
      const form = document.getElementById('broadcast-form');
      const templateSelect = document.getElementById('bc-template');
      const previewText = document.getElementById('bc-template-preview-text');

      templateSelect?.addEventListener('change', () => {
        const t = store.templates.find(item => item.name === templateSelect.value);
        if (previewText && t) {
          previewText.innerText = t.body;
        }
      });

      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('bc-title')?.value;
        const targetCohort = document.getElementById('bc-cohort')?.value;
        const templateUsed = document.getElementById('bc-template')?.value;

        await api.sendBroadcast({ title, targetCohort, templateUsed });
        this.showToast(`Broadcast "${title}" queued & dispatched!`, 'success');
        this.render();
      });
    }

    // Meta Templates View Listeners
    if (this.currentRoute === 'templates') {
      const syncBtn = document.getElementById('btn-sync-meta-templates');
      if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
          syncBtn.disabled = true;
          syncBtn.innerText = 'Syncing Meta Graph API...';
          await new Promise(r => setTimeout(r, 600));
          syncBtn.disabled = false;
          syncBtn.innerText = 'Sync from Meta WABA';
          this.showToast('Synchronized with Meta WABA Account #10948271', 'success');
        });
      }

      const newTplBtn = document.getElementById('btn-new-template');
      if (newTplBtn) {
        newTplBtn.addEventListener('click', () => {
          const name = prompt('Enter Template Name (snake_case, e.g. weekly_recap_v1):');
          if (!name) return;
          api.createTemplate({
            name,
            category: 'UTILITY',
            language: 'en_US',
            header: '📚 Weekly Recap',
            body: 'Hi {{1}}, here is your weekly progress recap!',
            buttons: ['View Progress', 'Next Week Schedule']
          });
          this.showToast(`Submitted template "${name}" for Meta approval`, 'info');
          this.render();
        });
      }
    }

    // Settings View Listeners
    if (this.currentRoute === 'settings') {
      const saveBtn = document.getElementById('btn-save-settings');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const backendUrl = document.getElementById('cfg-backend-url')?.value;
          const wabaId = document.getElementById('cfg-waba-id')?.value;
          const phoneNumberId = document.getElementById('cfg-phone-id')?.value;
          const displayPhoneNumber = document.getElementById('cfg-display-phone')?.value;
          const webhookVerifyToken = document.getElementById('cfg-verify-token')?.value;

          const modeRadio = document.querySelector('input[name="backend_mode_radio"]:checked');
          const backendMode = modeRadio ? modeRadio.value : 'mock';

          api.updateConfig({
            backendApiUrl: backendUrl,
            wabaId,
            phoneNumberId,
            displayPhoneNumber,
            webhookVerifyToken,
            backendMode
          });

          this.showToast('System configuration saved successfully', 'success');
          this.render();
        });
      }

      const pingWebhookBtn = document.getElementById('btn-ping-webhook-settings');
      if (pingWebhookBtn) {
        pingWebhookBtn.addEventListener('click', async () => {
          pingWebhookBtn.disabled = true;
          pingWebhookBtn.innerText = 'Verifying Challenge...';
          const res = await api.testWebhookPing();
          pingWebhookBtn.disabled = false;
          pingWebhookBtn.innerText = 'Run Challenge Ping';

          const logBox = document.getElementById('webhook-test-log');
          if (logBox) {
            logBox.style.display = 'block';
            logBox.innerHTML = `
              <div class="code-box" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3); color: var(--status-success);">
[HTTP 200 OK] Challenge passed in ${res.latencyMs}ms
Payload: hub.challenge=9482019482 verified with token "${store.config.webhookVerifyToken}"
Timestamp: ${res.timestamp}
              </div>
            `;
          }
          this.showToast(`Webhook challenge passed (${res.latencyMs}ms)`, 'success');
        });
      }

      const copyWebhookBtn = document.getElementById('btn-copy-webhook-url');
      if (copyWebhookBtn) {
        copyWebhookBtn.addEventListener('click', () => {
          const url = document.getElementById('cfg-webhook-url')?.value;
          navigator.clipboard.writeText(url);
          this.showToast('Webhook Callback URL copied to clipboard', 'info');
        });
      }

      const resetBtn = document.getElementById('btn-reset-defaults');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Reset all courses, students, and chat logs to default demo data?')) {
            store.resetToDefaults();
            this.showToast('Data reset to initial defaults', 'info');
            this.render();
          }
        });
      }
    }
  }

  // Course Modal Controller
  openCourseModal(courseId) {
    this.modalRoot.innerHTML = renderCourseEditorModal(courseId);
    const modalBackdrop = document.getElementById('course-editor-backdrop');
    const closeBtn = document.getElementById('btn-close-course-modal');
    const cancelBtn = document.getElementById('btn-cancel-course-modal');
    const saveBtn = document.getElementById('btn-save-course');

    // Local copy of course for editing
    const isNew = !courseId || courseId === 'new';
    const original = isNew
      ? {
          id: 'new',
          code: 'NEW-101',
          title: 'New Microlearning Course',
          audience: 'Class 10 / High School',
          language: 'English',
          status: 'active',
          durationDays: 3,
          description: 'Daily WhatsApp learning drop',
          days: [
            {
              day: 1,
              title: 'Concept Introduction',
              concept: 'Core principle and definition',
              messageText: '📚 *Day 1: Welcome!*\n\nHere is today’s 5-minute concept:\n\nTap below to test yourself on today’s micro-quiz! 👇',
              mediaType: 'none',
              mediaUrl: '',
              quiz: {
                question: 'Which of the following is correct?',
                options: [
                  { id: 'opt_a', text: 'A) Option 1', isCorrect: true },
                  { id: 'opt_b', text: 'B) Option 2', isCorrect: false },
                  { id: 'opt_c', text: 'C) Option 3', isCorrect: false }
                ],
                explanation: 'Option 1 is accurate.'
              }
            }
          ]
        }
      : JSON.parse(JSON.stringify(store.courses.find(c => c.id === courseId) || store.courses[0]));

    let currentDayNum = 1;

    const closeModal = () => {
      this.modalRoot.innerHTML = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    const updatePreview = () => {
      const msgInput = document.getElementById('edit-day-message');
      const previewText = document.getElementById('preview-text-content');
      if (msgInput && previewText) {
        previewText.innerHTML = formatWhatsAppText(msgInput.value);
      }

      const qInput = document.getElementById('edit-quiz-question');
      const previewQ = document.getElementById('preview-quiz-question');
      if (qInput && previewQ) {
        previewQ.innerText = qInput.value;
      }

      const optInputs = document.querySelectorAll('.quiz-opt-input');
      const previewBtns = document.getElementById('preview-quiz-buttons');
      if (previewBtns) {
        previewBtns.innerHTML = Array.from(optInputs).map(inp => `
          <div class="wa-btn-reply">${inp.value}</div>
        `).join('');
      }
    };

    // Live typing updates
    document.getElementById('edit-day-message')?.addEventListener('input', updatePreview);
    document.getElementById('edit-quiz-question')?.addEventListener('input', updatePreview);
    document.querySelectorAll('.quiz-opt-input').forEach(inp => {
      inp.addEventListener('input', updatePreview);
    });

    // Add Day Button
    document.getElementById('btn-add-day')?.addEventListener('click', () => {
      const nextNum = original.days.length + 1;
      original.days.push({
        day: nextNum,
        title: `Day ${nextNum} Lesson`,
        concept: 'Daily learning topic',
        messageText: `⚡ *Day ${nextNum}: Topic*\n\nWelcome to Day ${nextNum}! Read the concept and take the quick quiz below.`,
        mediaType: 'none',
        mediaUrl: '',
        quiz: {
          question: `Day ${nextNum} Quiz Challenge:`,
          options: [
            { id: 'opt_a', text: 'A) Option 1', isCorrect: true },
            { id: 'opt_b', text: 'B) Option 2', isCorrect: false }
          ],
          explanation: 'Great job!'
        }
      });
      this.openCourseModal(original.id);
      this.showToast(`Added Day ${nextNum} to sequence`, 'info');
    });

    // Save Course
    saveBtn?.addEventListener('click', async () => {
      const title = document.getElementById('edit-course-title')?.value || original.title;
      const code = document.getElementById('edit-course-code')?.value || original.code;
      const language = document.getElementById('edit-course-lang')?.value || original.language;
      const status = document.getElementById('edit-course-status')?.value || original.status;

      // Update current active day data from inputs
      const activeDay = original.days.find(d => d.day === currentDayNum) || original.days[0];
      activeDay.title = document.getElementById('edit-day-title')?.value || activeDay.title;
      activeDay.messageText = document.getElementById('edit-day-message')?.value || activeDay.messageText;
      activeDay.mediaType = document.getElementById('edit-day-media-type')?.value || 'none';
      activeDay.mediaUrl = document.getElementById('edit-day-media-url')?.value || '';

      const quizQ = document.getElementById('edit-quiz-question')?.value;
      const quizExp = document.getElementById('edit-quiz-explanation')?.value;
      const checkedRadio = document.querySelector('input[name="quiz_correct_radio"]:checked');
      const correctIdx = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;

      const optInputs = document.querySelectorAll('.quiz-opt-input');
      const options = Array.from(optInputs).map((inp, idx) => ({
        id: 'opt_' + idx,
        text: inp.value,
        isCorrect: idx === correctIdx
      }));

      activeDay.quiz = {
        question: quizQ,
        options,
        explanation: quizExp
      };

      original.title = title;
      original.code = code;
      original.language = language;
      original.status = status;
      original.durationDays = original.days.length;

      await api.saveCourse(original);
      this.showToast(`Saved course: ${original.title}`, 'success');
      closeModal();
      this.render();
    });
  }

  // Student Drawer Controller
  openStudentDrawer(studentId) {
    this.drawerRoot.innerHTML = renderStudentDrawer(studentId);

    const closeBtn = document.getElementById('btn-close-student-drawer');
    const closeFooterBtn = document.getElementById('btn-close-student-drawer-footer');
    const sendReplyBtn = document.getElementById('btn-send-drawer-reply');
    const replyInput = document.getElementById('drawer-reply-text');
    const resetProgressBtn = document.getElementById('btn-reset-student-progress');

    const closeDrawer = () => {
      this.drawerRoot.innerHTML = '';
    };

    closeBtn?.addEventListener('click', closeDrawer);
    closeFooterBtn?.addEventListener('click', closeDrawer);

    // Canned response buttons
    document.querySelectorAll('.btn-canned-response').forEach(btn => {
      btn.addEventListener('click', () => {
        if (replyInput) {
          replyInput.value = btn.getAttribute('data-text');
          replyInput.focus();
        }
      });
    });

    // Send educator reply
    sendReplyBtn?.addEventListener('click', async () => {
      const text = replyInput?.value?.trim();
      if (!text) return;

      sendReplyBtn.disabled = true;
      sendReplyBtn.innerText = 'Sending...';

      await api.sendEducatorMessage(studentId, text);
      this.showToast('Dispatched WhatsApp reply to student', 'success');

      // Re-render drawer with updated chat
      this.openStudentDrawer(studentId);
    });

    // Reset Progress
    resetProgressBtn?.addEventListener('click', async () => {
      if (confirm('Reset this student back to Day 1?')) {
        await api.updateStudent(studentId, { currentDay: 1, quizScore: '0/1 (0%)', status: 'active' });
        this.showToast('Student reset to Day 1', 'info');
        this.openStudentDrawer(studentId);
      }
    });
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
