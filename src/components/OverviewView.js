// ==========================================================================
// Overview & Operator Pulse View
// High information density, real-time stream, bot KPIs
// ==========================================================================

import { store } from '../services/api.js';

export function renderOverviewView() {
  const courses = store.courses;
  const students = store.students;
  const events = store.events;
  const unhandledStudents = students.filter(s => s.unhandledQuery);

  return `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-header-title">Operator Pulse</h2>
          <p class="view-header-subtitle">Real-time status of student cohort progress, WhatsApp delivery, and bot health.</p>
        </div>
        <div class="view-actions">
          <button id="btn-quick-broadcast" class="btn btn-secondary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            <span>Broadcast Nudge</span>
          </button>
          <button id="btn-open-sim-overview" class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <span>Test Simulator</span>
          </button>
        </div>
      </div>

      <!-- KPI Metrics Strip -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Active Learners</span>
            <span class="kpi-trend positive">↑ +14.2%</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${(1482 + students.length).toLocaleString()}</span>
          </div>
          <span class="kpi-subtext">Students enrolled across all WhatsApp tracks</span>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Active Micro-Courses</span>
            <span class="kpi-trend neutral">4 Total</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">${courses.filter(c => c.status === 'active').length}</span>
            <span style="font-size: 12px; color: var(--text-muted);">/ ${courses.length} courses</span>
          </div>
          <span class="kpi-subtext">Daily automated sequence active</span>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Cohort Completion Rate</span>
            <span class="kpi-trend positive">↑ 81.4%</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">81.4%</span>
          </div>
          <span class="kpi-subtext">Graduated with WhatsApp Certificate</span>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Today's WhatsApp Deliveries</span>
            <span class="kpi-trend positive">99.4% Deliv.</span>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">4,210</span>
            <span style="font-size: 11px; color: var(--wa-green); font-family: var(--font-mono);">● 4,185 read</span>
          </div>
          <span class="kpi-subtext">Meta Cloud API v20.0 via webhook</span>
        </div>
      </div>

      <!-- 2-Column High Density Layout -->
      <div class="dashboard-grid-2">
        <!-- Left: Course Performance & Live Inbound Event Feed -->
        <div>
          <!-- Courses Summary Table -->
          <div class="content-card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Active Learning Sequences</h3>
                <span class="card-description">Micro-courses currently pushing daily WhatsApp lessons</span>
              </div>
              <a href="#courses" class="btn btn-subtle btn-sm">View All Courses →</a>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Language</th>
                      <th>Enrolled</th>
                      <th>Avg. Completion</th>
                      <th>Status</th>
                      <th style="text-align: right;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${courses.slice(0, 4).map(c => `
                      <tr>
                        <td>
                          <div style="font-weight: 600;">${c.title}</div>
                          <div class="table-subinfo">${c.audience} • ${c.durationDays} Days</div>
                        </td>
                        <td>
                          <span style="font-family: var(--font-mono); font-size: 11px;">${c.language}</span>
                        </td>
                        <td>
                          <span style="font-weight: 600; font-family: var(--font-mono);">${c.enrolledCount}</span>
                        </td>
                        <td>
                          <div class="progress-bar-container">
                            <div class="progress-track">
                              <div class="progress-fill" style="width: ${c.completionRate}%;"></div>
                            </div>
                            <span class="progress-label">${c.completionRate}%</span>
                          </div>
                        </td>
                        <td>
                          <span class="badge ${c.status === 'active' ? 'badge-success' : 'badge-neutral'}">
                            <span class="badge-dot"></span>
                            ${c.status.toUpperCase()}
                          </span>
                        </td>
                        <td style="text-align: right;">
                          <button class="btn btn-secondary btn-sm btn-edit-course" data-course-id="${c.id}">
                            Edit Sequence
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Live Inbound Activity Stream -->
          <div class="content-card">
            <div class="card-header">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="pulse-dot"></span>
                <div>
                  <h3 class="card-title">Live Inbound WhatsApp Activity</h3>
                  <span class="card-description">Real-time webhook events from student interactions</span>
                </div>
              </div>
              <span class="badge badge-info" style="font-family: var(--font-mono);">
                Streaming
              </span>
            </div>
            <div class="card-body p-0">
              <div class="event-feed">
                ${events.slice(0, 6).map(ev => `
                  <div class="event-row">
                    <div class="event-icon-badge" style="background-color: ${
                      ev.type === 'unhandled_query' ? 'var(--status-warning-bg)' :
                      ev.type === 'quiz_correct' ? 'var(--status-success-bg)' : 'var(--bg-subtle)'
                    }; color: ${
                      ev.type === 'unhandled_query' ? 'var(--status-warning)' :
                      ev.type === 'quiz_correct' ? 'var(--status-success)' : 'var(--wa-green)'
                    };">
                      ${ev.type === 'unhandled_query' ? '⚠️' : ev.type === 'quiz_correct' ? '⚡' : '💬'}
                    </div>
                    <div class="event-content">
                      <div class="event-title">
                        <div>
                          <strong>${ev.student}</strong>
                          <span style="font-family: var(--font-mono); color: var(--text-muted); font-size: 11px; margin-left: 6px;">${ev.phone}</span>
                        </div>
                        <span class="event-meta">${ev.time}</span>
                      </div>
                      <div class="event-text">${ev.message}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Bot Health & Educator Doubts Deck -->
        <div>
          <!-- Bot Engine Status Card -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">WhatsApp Bot Engine</h3>
              <span class="badge badge-success">Online</span>
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; gap: 12px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Connected Number</span>
                <span style="font-family: var(--font-mono); font-weight: 600;">+91 98200 44321</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">API Provider</span>
                <span style="font-family: var(--font-mono);">Meta Cloud API v20</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Webhook Health</span>
                <span style="color: var(--status-success); font-weight: 600;">Active (24ms)</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">Auto-Responder</span>
                <span style="color: var(--status-success);">● Enabled</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Daily Drop Cadence</span>
                <span style="font-family: var(--font-mono);">08:30 AM IST</span>
              </div>

              <div style="margin-top: 6px;">
                <button id="btn-test-webhook-ping" class="btn btn-secondary btn-sm" style="width: 100%;">
                  Test Webhook Ping Challenge
                </button>
              </div>
            </div>
          </div>

          <!-- Urgent Educator Attention / Doubts -->
          <div class="content-card" style="border-color: ${unhandledStudents.length ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'};">
            <div class="card-header" style="background-color: ${unhandledStudents.length ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-surface)'};">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 14px;">🙋‍♂️</span>
                <h3 class="card-title">Doubts Awaiting Teacher</h3>
              </div>
              <span class="badge ${unhandledStudents.length ? 'badge-warning' : 'badge-neutral'}">
                ${unhandledStudents.length} Pending
              </span>
            </div>
            <div class="card-body p-0">
              ${unhandledStudents.length === 0 ? `
                <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px;">
                  All student doubts resolved. Automated responder is handling quizzes smoothly.
                </div>
              ` : `
                <div style="display: flex; flex-direction: column;">
                  ${unhandledStudents.map(s => `
                    <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 6px;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; font-size: 13px;">${s.name}</span>
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${s.lastActive}</span>
                      </div>
                      <div style="font-size: 11px; color: var(--text-muted);">
                        ${s.courseName} • Day ${s.currentDay}
                      </div>
                      <div style="font-size: 12px; color: var(--text-secondary); background: var(--bg-subtle); padding: 6px 10px; border-radius: 4px; font-style: italic;">
                        "${s.notes}"
                      </div>
                      <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                        <button class="btn btn-primary btn-sm btn-open-student-drawer" data-student-id="${s.id}">
                          Reply via WhatsApp
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
