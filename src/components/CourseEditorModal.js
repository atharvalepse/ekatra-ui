// ==========================================================================
// Course Editor Modal & Day Sequence Builder
// Side-by-side Day Editor + Real-time WhatsApp Bubble Preview
// ==========================================================================

import { store } from '../services/api.js';

export function renderCourseEditorModal(courseId = null) {
  const isNew = !courseId || courseId === 'new';
  let course = isNew
    ? {
        id: 'new',
        code: 'NEW-101',
        title: 'New Microlearning Course',
        audience: 'Class 10 / High School',
        language: 'English',
        status: 'active',
        durationDays: 3,
        description: 'Bite-sized daily WhatsApp lessons for students.',
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
              explanation: '✅ *Correct!* Option 1 is accurate.'
            }
          }
        ]
      }
    : JSON.parse(JSON.stringify(store.courses.find(c => c.id === courseId) || store.courses[0]));

  let currentSelectedDay = 1;

  function renderDayTabs(days, selectedDay) {
    return days.map(d => `
      <button
        type="button"
        class="step-chip ${d.day === selectedDay ? 'active' : ''}"
        data-day="${d.day}"
      >
        <span class="step-num">Day ${d.day}</span>
        <span>${d.title.slice(0, 18)}...</span>
      </button>
    `).join('');
  }

  function getDayData(days, dayNum) {
    return days.find(d => d.day === dayNum) || days[0];
  }

  const activeDay = getDayData(course.days, currentSelectedDay);

  return `
    <div class="modal-backdrop" id="course-editor-backdrop">
      <div class="modal-dialog" style="width: 980px;">
        <div class="modal-header">
          <div>
            <h3 style="font-size: 16px; font-weight: 600;">
              ${isNew ? 'Create New Microlearning Course' : `Edit Course: ${course.title}`}
            </h3>
            <span style="font-size: 12px; color: var(--text-muted);">
              Configure daily WhatsApp lesson drops, media attachments, and interactive quiz buttons.
            </span>
          </div>
          <button type="button" class="btn btn-subtle btn-icon-sm" id="btn-close-course-modal">✕</button>
        </div>

        <form id="course-editor-form" class="modal-body" style="padding: 20px;">
          <input type="hidden" id="edit-course-id" value="${course.id}" />

          <!-- Course Metadata Form Row -->
          <div class="form-row-2" style="margin-bottom: 20px; background-color: var(--bg-subtle); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div>
              <label class="form-label">Course Title*</label>
              <input type="text" id="edit-course-title" class="form-input" value="${course.title}" required />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
              <div>
                <label class="form-label">Subject Code</label>
                <input type="text" id="edit-course-code" class="form-input" value="${course.code}" />
              </div>
              <div>
                <label class="form-label">Language</label>
                <select id="edit-course-lang" class="form-select">
                  <option value="English" ${course.language === 'English' ? 'selected' : ''}>English</option>
                  <option value="English / Hinglish" ${course.language.includes('Hinglish') ? 'selected' : ''}>English / Hinglish</option>
                  <option value="English / Hindi" ${course.language.includes('Hindi') ? 'selected' : ''}>English / Hindi</option>
                </select>
              </div>
              <div>
                <label class="form-label">Status</label>
                <select id="edit-course-status" class="form-select">
                  <option value="active" ${course.status === 'active' ? 'selected' : ''}>Active</option>
                  <option value="draft" ${course.status === 'draft' ? 'selected' : ''}>Draft</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Day Sequencer Bar -->
          <div style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">
                Sequence Days (${course.days.length} Total Drops)
              </span>
              <button type="button" id="btn-add-day" class="btn btn-secondary btn-sm">
                + Add Day ${course.days.length + 1}
              </button>
            </div>
            <div class="sequence-stepper" id="day-stepper-container">
              ${renderDayTabs(course.days, currentSelectedDay)}
            </div>
          </div>

          <!-- Split Workspace: Day Editor (Left) & Live WhatsApp Bubble Preview (Right) -->
          <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 20px; align-items: start;">
            <!-- Left: Day Inputs -->
            <div style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-weight: 600; font-size: 13px; color: var(--wa-green);">
                  Editing Day <span id="current-day-label">${activeDay.day}</span> Content
                </span>
                <button type="button" id="btn-delete-current-day" class="btn btn-subtle btn-sm" style="color: var(--status-danger);">
                  Delete Day
                </button>
              </div>

              <div class="form-group">
                <label class="form-label">Day Lesson Title</label>
                <input type="text" id="edit-day-title" class="form-input" value="${activeDay.title}" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span>WhatsApp Message Text</span>
                  <span class="form-hint">Use *bold*, _italic_, \`code\`</span>
                </label>
                <textarea id="edit-day-message" class="form-textarea" rows="6">${activeDay.messageText}</textarea>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">Media Attachment</label>
                  <select id="edit-day-media-type" class="form-select">
                    <option value="none" ${activeDay.mediaType === 'none' ? 'selected' : ''}>None</option>
                    <option value="image" ${activeDay.mediaType === 'image' ? 'selected' : ''}>Image (Infographic)</option>
                    <option value="audio" ${activeDay.mediaType === 'audio' ? 'selected' : ''}>Audio Note (Voice Clip)</option>
                    <option value="pdf" ${activeDay.mediaType === 'pdf' ? 'selected' : ''}>PDF Cheat Sheet</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Media URL / Reference</label>
                  <input type="text" id="edit-day-media-url" class="form-input" placeholder="https://..." value="${activeDay.mediaUrl || ''}" />
                </div>
              </div>

              <!-- Interactive Quiz Section -->
              <div style="border-top: 1px solid var(--border-subtle); padding-top: 14px; margin-top: 8px;">
                <span style="font-weight: 600; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">
                  Interactive WhatsApp Micro-Quiz
                </span>

                <div class="form-group">
                  <label class="form-label">Quiz Question Prompt</label>
                  <input type="text" id="edit-quiz-question" class="form-input" value="${activeDay.quiz?.question || ''}" />
                </div>

                <div class="form-group">
                  <label class="form-label">Options (Quick Reply Buttons)</label>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${(activeDay.quiz?.options || [
                      { id: 'opt_a', text: 'A) Option 1', isCorrect: true },
                      { id: 'opt_b', text: 'B) Option 2', isCorrect: false },
                      { id: 'opt_c', text: 'C) Option 3', isCorrect: false }
                    ]).map((opt, i) => `
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <input
                          type="radio"
                          name="quiz_correct_radio"
                          value="${i}"
                          ${opt.isCorrect ? 'checked' : ''}
                          title="Mark as correct answer"
                        />
                        <input
                          type="text"
                          class="form-input quiz-opt-input"
                          data-idx="${i}"
                          value="${opt.text}"
                          style="flex: 1; height: 30px; font-size: 12px;"
                        />
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Instant Explanation (Bot auto-reply)</label>
                  <input type="text" id="edit-quiz-explanation" class="form-input" value="${activeDay.quiz?.explanation || ''}" />
                </div>
              </div>
            </div>

            <!-- Right: Real-time Live WhatsApp Phone Bubble Preview -->
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
                  Live WhatsApp Preview
                </span>
                <span style="font-size: 11px; font-family: var(--font-mono); color: var(--wa-green);">● Student View</span>
              </div>

              <div class="wa-preview-window">
                <div class="wa-preview-header">
                  <div class="wa-avatar">E</div>
                  <div class="wa-header-info">
                    <div class="wa-bot-name">Ekatra Learning Bot</div>
                    <div class="wa-bot-status">online</div>
                  </div>
                </div>

                <div class="wa-chat-body" id="modal-wa-preview-body">
                  <!-- Generated message bubble -->
                  <div class="wa-msg wa-msg-received" style="max-width: 100%;">
                    <div class="wa-msg-header">${course.title}</div>
                    
                    ${activeDay.mediaType === 'image' && activeDay.mediaUrl ? `
                      <div class="wa-msg-media">
                        <img src="${activeDay.mediaUrl}" alt="Media drop" style="max-height: 120px; object-fit: cover;" />
                      </div>
                    ` : ''}

                    ${activeDay.mediaType === 'audio' ? `
                      <div class="wa-audio-pill">
                        <button type="button" class="wa-audio-play">▶</button>
                        <div style="flex: 1; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;"></div>
                        <span style="font-size: 10px; font-family: var(--font-mono);">0:42</span>
                      </div>
                    ` : ''}

                    <div id="preview-text-content" style="white-space: pre-wrap; margin-bottom: 6px;">
                      ${formatWhatsAppText(activeDay.messageText)}
                    </div>

                    ${activeDay.quiz ? `
                      <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; margin-top: 6px;">
                        <div style="font-weight: 600; font-size: 12px; color: #53bdeb; margin-bottom: 4px;" id="preview-quiz-question">
                          ${activeDay.quiz.question}
                        </div>
                        <div class="wa-quick-replies" id="preview-quiz-buttons">
                          ${activeDay.quiz.options.map(o => `
                            <div class="wa-btn-reply">${o.text}</div>
                          `).join('')}
                        </div>
                      </div>
                    ` : ''}

                    <div class="wa-msg-footer">
                      <span>08:30 AM</span>
                      <span class="wa-tick-blue">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="btn-cancel-course-modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-save-course">Save Course & Schedule</button>
        </div>
      </div>
    </div>
  `;
}

// Simple WhatsApp markdown formatter for bold/italic/code
export function formatWhatsAppText(raw) {
  if (!raw) return '';
  return raw
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px;">$1</code>');
}
