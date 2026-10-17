// ==========================================================================
// Broadcasts & Cohort Nudges View
// Bulk WhatsApp Template Dispatcher for student re-engagement
// ==========================================================================

import { store } from '../services/api.js';

export function renderBroadcastView() {
  const broadcasts = store.broadcasts;
  const templates = store.templates.filter(t => t.status === 'APPROVED');
  const courses = store.courses;

  return `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-header-title">Broadcasts & Cohort Nudges</h2>
          <p class="view-header-subtitle">
            Re-engage inactive learners, schedule daily lesson drops, or dispatch exam reminders via approved Meta templates.
          </p>
        </div>
      </div>

      <div class="dashboard-grid-2">
        <!-- Left: Broadcast Composer -->
        <div class="content-card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Compose WhatsApp Broadcast</h3>
              <span class="card-description">Dispatched directly via WhatsApp Cloud API without risk of phone number ban</span>
            </div>
          </div>
          <form id="broadcast-form" class="card-body">
            <div class="form-group">
              <label class="form-label">Broadcast Campaign Title*</label>
              <input
                type="text"
                id="bc-title"
                class="form-input"
                placeholder="e.g. Class 10 Mid-Term Algebra Nudge"
                required
              />
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Target Learner Segment</label>
                <select id="bc-cohort" class="form-select">
                  <option value="All Active Students">All Active Students (${store.students.length} learners)</option>
                  <option value="Students Inactive >24h">Students Inactive >24 Hours (3 learners)</option>
                  ${courses.map(c => `
                    <option value="Enrolled in ${c.title}">Cohort: ${c.title}</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Approved Meta Template*</label>
                <select id="bc-template" class="form-select">
                  ${templates.map(t => `
                    <option value="${t.name}">${t.name} (${t.category})</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Dynamic Template Preview Box -->
            <div style="background-color: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">
                  Template Body Preview
                </span>
                <span class="badge badge-success" style="font-size: 10px;">Meta Approved</span>
              </div>
              <div id="bc-template-preview-text" style="font-size: 13px; color: var(--text-primary); white-space: pre-wrap; font-family: var(--font-sans);">
${templates[0]?.body || 'Select a template to view text.'}
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; color: var(--text-secondary); font-family: var(--font-mono);">
                Estimated recipients: <strong>340 students</strong>
              </span>
              <button type="submit" class="btn btn-primary" id="btn-dispatch-broadcast">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                <span>Dispatch Broadcast Now</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Delivery Policies & Best Practices -->
        <div>
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">WhatsApp Cloud API Delivery Rules</h3>
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; gap: 12px; font-size: 12px; color: var(--text-secondary);">
              <div style="display: flex; gap: 8px;">
                <span style="color: var(--wa-green); font-weight: bold;">✓</span>
                <div>
                  <strong>Approved Utility Templates</strong>: Daily educational lessons and reminder nudges are classified under Meta UTILITY category for 99%+ delivery.
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <span style="color: var(--wa-green); font-weight: bold;">✓</span>
                <div>
                  <strong>24-Hour Active Window</strong>: When a student replies to a quiz or asks a question, your bot can send free-form replies for 24 hours at zero template cost.
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <span style="color: var(--status-warning); font-weight: bold;">!</span>
                <div>
                  <strong>Pacing Rate Limits</strong>: Broadcasts are throttled to 80 messages/second automatically to prevent Meta rate limiting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Past Broadcast History Table -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Dispatched Broadcast History</h3>
          <span class="card-description">Live delivery audit logs</span>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Campaign Title</th>
                  <th>Target Cohort</th>
                  <th>Meta Template</th>
                  <th>Sent</th>
                  <th>Delivered</th>
                  <th>Read</th>
                  <th>Status</th>
                  <th>Dispatched At</th>
                </tr>
              </thead>
              <tbody>
                ${broadcasts.map(b => `
                  <tr>
                    <td>
                      <strong>${b.title}</strong>
                    </td>
                    <td>
                      <span style="font-size: 12px;">${b.targetCohort}</span>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); font-size: 11px;">${b.templateUsed}</span>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); font-weight: 600;">${b.sentCount}</span>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); color: var(--status-success); font-weight: 600;">${b.deliveredCount}</span>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); color: var(--wa-check-blue); font-weight: 600;">${b.readCount}</span>
                    </td>
                    <td>
                      <span class="badge badge-success">
                        <span class="badge-dot"></span>
                        ${b.status}
                      </span>
                    </td>
                    <td>
                      <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${b.sentAt}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}
