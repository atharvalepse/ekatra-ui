// ==========================================================================
// Student Profile & WhatsApp Conversation Slide-over Drawer
// Educator Takeover & Real WhatsApp Message History
// ==========================================================================

import { store } from '../services/api.js';
import { formatWhatsAppText } from './CourseEditorModal.js';

export function renderStudentDrawer(studentId) {
  const student = store.students.find(s => s.id === studentId);
  if (!student) return '';

  const conversation = store.conversations[studentId] || [];
  const progressPct = Math.round((student.currentDay / student.totalDays) * 100);

  return `
    <div class="drawer-backdrop" id="student-drawer-backdrop">
      <div class="drawer-panel">
        <div class="drawer-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-size: 16px; font-weight: 700;">${student.name}</h3>
              <span class="badge ${
                student.status === 'active' ? 'badge-success' :
                student.status === 'needs_help' ? 'badge-warning' :
                student.status === 'stuck' ? 'badge-danger' :
                student.status === 'completed' ? 'badge-info' : 'badge-neutral'
              }">
                ${student.status.toUpperCase()}
              </span>
            </div>
            <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">
              ${student.phone} • Enrolled in ${student.courseName}
            </div>
          </div>
          <button type="button" class="btn btn-subtle btn-icon-sm" id="btn-close-student-drawer">✕</button>
        </div>

        <div class="drawer-body">
          <!-- Student Cohort Progress Summary -->
          <div style="background-color: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
              <span style="font-weight: 600;">Course Journey Progress</span>
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--wa-green);">
                Day ${student.currentDay} of ${student.totalDays} (${progressPct}%)
              </span>
            </div>
            <div class="progress-track" style="height: 8px; margin-bottom: 12px;">
              <div class="progress-fill" style="width: ${progressPct}%;"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
              <div style="background: var(--bg-surface); padding: 8px 10px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                <span style="color: var(--text-muted); display: block; font-size: 11px;">Quiz Accuracy</span>
                <span style="font-weight: 700; font-family: var(--font-mono); font-size: 14px;">${student.quizScore}</span>
              </div>
              <div style="background: var(--bg-surface); padding: 8px 10px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                <span style="color: var(--text-muted); display: block; font-size: 11px;">Last Inbound Active</span>
                <span style="font-weight: 600; font-family: var(--font-mono); font-size: 13px;">${student.lastActive}</span>
              </div>
            </div>
          </div>

          <!-- Pending Doubt Banner if flagged -->
          ${student.unhandledQuery ? `
            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-md); padding: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--status-warning);">
                <span>⚠️ Doubt Flagged for Educator Review</span>
              </div>
              <div style="font-size: 12px; color: var(--text-primary); margin-top: 4px;">
                "${student.notes}"
              </div>
            </div>
          ` : ''}

          <!-- WhatsApp Chat History Feed -->
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">
                WhatsApp Conversation Transcript
              </span>
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">
                ${conversation.length} messages logged
              </span>
            </div>

            <div class="wa-preview-window" style="border-radius: var(--radius-md);">
              <div class="wa-chat-body" style="max-height: 340px;" id="drawer-conversation-stream">
                ${conversation.length === 0 ? `
                  <div style="text-align: center; color: #8696a0; font-size: 12px; margin: auto;">
                    No messages recorded yet for this student.
                  </div>
                ` : conversation.map(m => `
                  <div class="wa-msg ${m.sender === 'student' ? 'wa-msg-received' : 'wa-msg-sent'}" style="max-width: 88%;">
                    ${m.sender === 'educator' ? `
                      <div style="font-size: 10px; font-weight: 700; color: #53bdeb; margin-bottom: 2px;">
                        👨‍🏫 Educator Manual Intervention
                      </div>
                    ` : ''}
                    <div style="white-space: pre-wrap;">
                      ${formatWhatsAppText(m.text)}
                    </div>
                    ${m.buttons ? `
                      <div class="wa-quick-replies" style="margin-top: 6px;">
                        ${m.buttons.map(b => `<div class="wa-btn-reply" style="padding: 4px 8px; font-size: 11px;">${b}</div>`).join('')}
                      </div>
                    ` : ''}
                    <div class="wa-msg-footer">
                      <span>${m.time}</span>
                      <span class="wa-tick-blue">✓✓</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Educator Reply Input -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: 600; font-size: 12px; color: var(--text-secondary);">
                Send Direct WhatsApp Message (Cloud API)
              </span>
              <span style="font-size: 10px; color: var(--wa-green); font-family: var(--font-mono);">
                ● 24h Window Active
              </span>
            </div>

            <textarea
              id="drawer-reply-text"
              class="form-textarea"
              rows="3"
              placeholder="Type your explanation or personalized feedback..."
            ></textarea>

            <!-- Canned Quick Responses -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              <button type="button" class="btn btn-subtle btn-sm btn-canned-response" data-text="Hey ${student.name.split(' ')[0]}! Great effort on today's drill. Here is a quick hint: remember to multiply 'a' and 'c' first.">
                💡 Math Hint
              </button>
              <button type="button" class="btn btn-subtle btn-sm btn-canned-response" data-text="Your doubt has been resolved! You can now resume your daily lesson by replying START.">
                ✅ Doubt Resolved
              </button>
              <button type="button" class="btn btn-subtle btn-sm btn-canned-response" data-text="Keep up the daily streak! Consistency is the key to mastering your syllabus.">
                🔥 Encouragement
              </button>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <button
                type="button"
                id="btn-send-drawer-reply"
                class="btn btn-primary btn-sm"
                data-student-id="${student.id}"
              >
                Send via WhatsApp
              </button>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <button type="button" id="btn-reset-student-progress" class="btn btn-secondary btn-sm" data-student-id="${student.id}">
            Reset to Day 1
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-student-drawer-footer">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}
