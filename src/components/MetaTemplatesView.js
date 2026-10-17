// ==========================================================================
// Meta WhatsApp Cloud Templates View
// Manage and preview Meta WABA approved message templates
// ==========================================================================

import { store } from '../services/api.js';
import { formatWhatsAppText } from './CourseEditorModal.js';

export function renderMetaTemplatesView() {
  const templates = store.templates;

  return `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-header-title">Meta WhatsApp Cloud Templates</h2>
          <p class="view-header-subtitle">
            Manage pre-approved WhatsApp message templates for automated lesson drops, quiz nudges, and certificates.
          </p>
        </div>
        <div class="view-actions">
          <button id="btn-sync-meta-templates" class="btn btn-secondary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            <span>Sync from Meta WABA</span>
          </button>
          <button id="btn-new-template" class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Submit New Template</span>
          </button>
        </div>
      </div>

      <!-- Templates Grid / Table -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Registered WABA Templates</h3>
          <span class="badge badge-success">Account Tier: 1k msgs/day</span>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Template Name & Category</th>
                  <th>Language</th>
                  <th>Meta Status</th>
                  <th>Sent Volume</th>
                  <th>Delivery Rate</th>
                  <th>Review Date</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${templates.map(t => `
                  <tr>
                    <td>
                      <div style="font-weight: 600; font-family: var(--font-mono); font-size: 13px;">${t.name}</div>
                      <div class="table-subinfo">${t.category} • ${t.buttons ? t.buttons.length : 0} Interactive Buttons</div>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); font-size: 11px;">${t.language}</span>
                    </td>
                    <td>
                      <span class="badge ${
                        t.status === 'APPROVED' ? 'badge-success' :
                        t.status === 'IN_REVIEW' ? 'badge-warning' : 'badge-danger'
                      }">
                        <span class="badge-dot"></span>
                        ${t.status}
                      </span>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); font-weight: 600;">${t.metrics.sent.toLocaleString()}</span>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); color: var(--status-success); font-weight: 600;">${t.metrics.delivered}</span>
                    </td>
                    <td>
                      <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${t.metaReviewDate}</span>
                    </td>
                    <td style="text-align: right;">
                      <button class="btn btn-secondary btn-sm btn-inspect-template" data-template-id="${t.id}">
                        Preview Bubble
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Live Template Inspector Card -->
      <div class="dashboard-grid-2">
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">Template Structure: daily_micro_drop_v2</h3>
            <span class="badge badge-success">Active Production Version</span>
          </div>
          <div class="card-body" style="font-size: 13px; display: flex; flex-direction: column; gap: 12px;">
            <div>
              <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Header</span>
              <div class="code-box" style="margin-top: 4px;">📚 *{{1}} — Day {{2}}*</div>
            </div>
            <div>
              <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Body Text</span>
              <div class="code-box" style="margin-top: 4px;">Hi {{3}},\n\nHere is your bite-sized lesson for today:\n\n{{4}}\n\nTap below to test yourself on today's quick quiz!</div>
            </div>
            <div>
              <span style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Interactive Quick-Reply Buttons</span>
              <div style="display: flex; gap: 8px; margin-top: 6px;">
                <span class="badge badge-neutral">1. Start Quiz ⚡</span>
                <span class="badge badge-neutral">2. Ask Educator 🙋‍♂️</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="wa-preview-window">
            <div class="wa-preview-header">
              <div class="wa-avatar">E</div>
              <div class="wa-header-info">
                <div class="wa-bot-name">Ekatra Learning Bot</div>
                <div class="wa-bot-status">WhatsApp Business Official</div>
              </div>
            </div>
            <div class="wa-chat-body">
              <div class="wa-msg wa-msg-received" style="max-width: 100%;">
                <div class="wa-msg-header">📚 Class 10 Math — Day 1</div>
                <div>
                  Hi Rahul,<br/><br/>
                  Here is your bite-sized lesson for today:<br/><br/>
                  A Quadratic equation has standard form ax² + bx + c = 0 where a ≠ 0.<br/><br/>
                  Tap below to test yourself on today's quick quiz!
                </div>
                <div class="wa-quick-replies">
                  <div class="wa-btn-reply">Start Quiz ⚡</div>
                  <div class="wa-btn-reply">Ask Educator 🙋‍♂️</div>
                </div>
                <div class="wa-msg-footer">
                  <span>08:30 AM</span>
                  <span class="wa-tick-blue">✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
