// ==========================================================================
// Live WhatsApp Conversations & Educator Desk View
// Split-pane inbox for monitoring student queries and intervening live
// ==========================================================================

import { store } from '../services/api.js';
import { formatWhatsAppText } from './CourseEditorModal.js';

export function renderLiveChatView(selectedStudentId = null) {
  const students = store.students;
  const activeStudent = selectedStudentId
    ? students.find(s => s.id === selectedStudentId) || students[0]
    : (students.find(s => s.unhandledQuery) || students[0]);

  const conversation = activeStudent ? (store.conversations[activeStudent.id] || []) : [];

  return `
    <div class="view-container" style="padding: 16px; height: calc(100vh - var(--header-height)); display: flex; flex-direction: column;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <div>
          <h2 class="view-header-title">Live WhatsApp Student Inbox</h2>
          <p class="view-header-subtitle">Direct educator desk for unhandled questions, doubt clearance, and live chat monitoring.</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge badge-success">
            <span class="badge-dot"></span>
            Webhook Streaming Active
          </span>
        </div>
      </div>

      <!-- Split Desk Container -->
      <div style="flex: 1; display: grid; grid-template-columns: 320px 1fr; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; background-color: var(--bg-surface); min-height: 0;">
        <!-- Left: Conversations Roster -->
        <div style="border-right: 1px solid var(--border-subtle); display: flex; flex-direction: column; background-color: var(--bg-surface);">
          <div style="padding: 12px; border-bottom: 1px solid var(--border-subtle);">
            <input
              type="text"
              id="chat-search-input"
              class="form-input"
              style="height: 32px;"
              placeholder="Search conversations..."
            />
          </div>

          <div style="padding: 8px 12px; border-bottom: 1px solid var(--border-subtle); display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm chat-filter-tab active" data-filter="all">All</button>
            <button class="btn btn-subtle btn-sm chat-filter-tab" data-filter="doubts" style="color: var(--status-warning);">
              Doubts (${students.filter(s => s.unhandledQuery).length})
            </button>
            <button class="btn btn-subtle btn-sm chat-filter-tab" data-filter="active">Active</button>
          </div>

          <div style="flex: 1; overflow-y: auto;" id="chat-students-list">
            ${students.map(s => {
              const isSelected = activeStudent && activeStudent.id === s.id;
              return `
                <div
                  class="chat-student-item ${isSelected ? 'selected' : ''}"
                  data-student-id="${s.id}"
                  style="padding: 12px 14px; border-bottom: 1px solid var(--border-subtle); cursor: pointer; transition: background var(--transition-fast); background-color: ${isSelected ? 'var(--bg-subtle)' : 'transparent'};"
                >
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                    <span style="font-weight: 600; font-size: 13px; color: var(--text-primary);">${s.name}</span>
                    <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted);">${s.lastActive}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">
                    ${s.courseName} • Day ${s.currentDay}
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${s.phone}</span>
                    ${s.unhandledQuery ? `
                      <span class="badge badge-warning" style="font-size: 9px; padding: 1px 5px;">Needs Help</span>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Full Conversation Workspace -->
        <div style="display: flex; flex-direction: column; background-color: var(--wa-light-bg);">
          ${!activeStudent ? `
            <div class="empty-state" style="margin: auto;">
              <p class="empty-title">Select a student conversation to view</p>
            </div>
          ` : `
            <!-- Conversation Topbar -->
            <div style="padding: 10px 16px; background-color: var(--wa-light-panel); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div class="wa-avatar">${activeStudent.name.charAt(0)}</div>
                <div>
                  <div style="font-weight: 600; font-size: 14px; color: var(--text-primary);">${activeStudent.name}</div>
                  <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">
                    ${activeStudent.phone} • ${activeStudent.courseName} (Day ${activeStudent.currentDay}/${activeStudent.totalDays})
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge ${activeStudent.unhandledQuery ? 'badge-warning' : 'badge-success'}">
                  ${activeStudent.unhandledQuery ? 'Doubt Pending' : 'Bot Managing'}
                </span>
                <button class="btn btn-secondary btn-sm" id="btn-toggle-auto-reply" data-student-id="${activeStudent.id}">
                  Takeover Bot
                </button>
              </div>
            </div>

            <!-- Chat Body -->
            <div class="wa-chat-body" style="flex: 1; overflow-y: auto;" id="livechat-stream-body">
              ${conversation.map(m => `
                <div class="wa-msg ${m.sender === 'student' ? 'wa-msg-received' : 'wa-msg-sent'}" style="max-width: 75%;">
                  ${m.sender === 'educator' ? `
                    <div style="font-size: 10px; font-weight: 700; color: #008069; margin-bottom: 2px;">
                      👨‍🏫 Educator
                    </div>
                  ` : ''}
                  <div style="white-space: pre-wrap;">
                    ${formatWhatsAppText(m.text)}
                  </div>
                  ${m.buttons ? `
                    <div class="wa-quick-replies">
                      ${m.buttons.map(b => `<div class="wa-btn-reply">${b}</div>`).join('')}
                    </div>
                  ` : ''}
                  <div class="wa-msg-footer">
                    <span>${m.time}</span>
                    <span class="wa-tick-blue">✓✓</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Composer Footer -->
            <div style="padding: 12px; background-color: var(--wa-light-panel); border-top: 1px solid var(--border-subtle);">
              <div style="display: flex; gap: 8px;">
                <input
                  type="text"
                  id="livechat-composer-input"
                  class="sim-input"
                  style="font-size: 13px; height: 38px;"
                  placeholder="Type an instant reply to send to ${activeStudent.name}'s WhatsApp..."
                />
                <button
                  type="button"
                  id="btn-livechat-send"
                  class="btn btn-primary"
                  style="height: 38px; padding: 0 16px;"
                  data-student-id="${activeStudent.id}"
                >
                  Send
                </button>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
