// ==========================================================================
// Students Directory & Progress Roster View
// ==========================================================================

import { store } from '../services/api.js';

export function renderStudentsView() {
  const students = store.students;
  const courses = store.courses;

  return `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-header-title">Students & Learner Roster</h2>
          <p class="view-header-subtitle">
            Track student progress across daily WhatsApp drops, quiz submissions, and doubts needing educator review.
          </p>
        </div>
        <div class="view-actions">
          <button id="btn-import-students" class="btn btn-secondary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Import CSV</span>
          </button>
          <button id="btn-add-student" class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="content-card">
        <div class="filter-bar">
          <div class="filter-group">
            <input
              type="text"
              id="student-search-input"
              class="form-input"
              style="width: 280px; height: 32px;"
              placeholder="Search by student name or phone number..."
            />

            <select id="student-course-filter" class="input-select">
              <option value="all">All Courses</option>
              ${courses.map(c => `
                <option value="${c.id}">${c.title}</option>
              `).join('')}
            </select>

            <select id="student-status-filter" class="input-select">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="needs_help">Needs Help / Doubt</option>
              <option value="stuck">Stuck</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <span style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">
            ${students.length} Learners Enrolled
          </span>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table" id="students-table">
              <thead>
                <tr>
                  <th>Student Learner</th>
                  <th>WhatsApp Phone</th>
                  <th>Course Track</th>
                  <th>Daily Progress</th>
                  <th>Quiz Accuracy</th>
                  <th>Status</th>
                  <th>Last Interaction</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => {
                  const progressPct = Math.round((s.currentDay / s.totalDays) * 100);
                  return `
                    <tr data-student-id="${s.id}">
                      <td>
                        <div class="table-student-name">${s.name}</div>
                        <div class="table-subinfo">Joined ${s.joinedAt}</div>
                      </td>
                      <td>
                        <div class="table-phone-cell">
                          <span>${s.phone}</span>
                          <button class="btn btn-subtle btn-icon-sm btn-copy-phone" data-phone="${s.phone}" title="Copy phone number">
                            📋
                          </button>
                        </div>
                      </td>
                      <td>
                        <span style="font-size: 13px; font-weight: 500;">${s.courseName}</span>
                      </td>
                      <td>
                        <div class="progress-bar-container">
                          <div class="progress-track">
                            <div class="progress-fill" style="width: ${progressPct}%;"></div>
                          </div>
                          <span class="progress-label">D${s.currentDay}/${s.totalDays}</span>
                        </div>
                      </td>
                      <td>
                        <span style="font-family: var(--font-mono); font-size: 12px; font-weight: 600;">
                          ${s.quizScore}
                        </span>
                      </td>
                      <td>
                        <span class="badge ${
                          s.status === 'active' ? 'badge-success' :
                          s.status === 'needs_help' ? 'badge-warning' :
                          s.status === 'stuck' ? 'badge-danger' :
                          s.status === 'completed' ? 'badge-info' : 'badge-neutral'
                        }">
                          <span class="badge-dot"></span>
                          ${s.status === 'needs_help' ? 'Doubt Flagged' : s.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">
                          ${s.lastActive}
                        </span>
                      </td>
                      <td style="text-align: right;">
                        <button class="btn btn-secondary btn-sm btn-open-student-drawer" data-student-id="${s.id}">
                          View & Reply
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}
