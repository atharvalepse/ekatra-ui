// ==========================================================================
// Settings & Backend API Configuration View
// Ready-to-connect API endpoints, Meta Cloud credentials, Webhook tester
// ==========================================================================

import { store, api } from '../services/api.js';

export function renderSettingsView() {
  const config = store.config;

  return `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-header-title">Backend API & Meta Cloud Configuration</h2>
          <p class="view-header-subtitle">
            Connect your ready backend server, manage WhatsApp Business Cloud API tokens, and verify webhooks.
          </p>
        </div>
        <div class="view-actions">
          <button id="btn-save-settings" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <div class="dashboard-grid-2">
        <!-- Left: Backend & WhatsApp Settings -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- 1. Backend Server Connection Card -->
          <div class="content-card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Backend Integration Mode</h3>
                <span class="card-description">Point the frontend UI to your ready server</span>
              </div>
              <span class="badge ${config.backendMode === 'live' ? 'badge-success' : 'badge-neutral'}">
                ${config.backendMode === 'live' ? 'Live Mode' : 'Local Mock Mode'}
              </span>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-label">Active Connection Mode</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <label style="display: flex; align-items: center; gap: 8px; padding: 10px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer; background: var(--bg-subtle);">
                    <input type="radio" name="backend_mode_radio" value="mock" ${config.backendMode !== 'live' ? 'checked' : ''} />
                    <div>
                      <div style="font-weight: 600; font-size: 13px;">Local Storage (Demo/Mock)</div>
                      <div style="font-size: 11px; color: var(--text-muted);">Self-contained, persists all changes in browser</div>
                    </div>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; padding: 10px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer; background: var(--bg-subtle);">
                    <input type="radio" name="backend_mode_radio" value="live" ${config.backendMode === 'live' ? 'checked' : ''} />
                    <div>
                      <div style="font-weight: 600; font-size: 13px;">Live Backend API</div>
                      <div style="font-size: 11px; color: var(--text-muted);">Sends fetch requests to your running server</div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span>Backend Base API URL</span>
                  <span class="form-hint">e.g. http://localhost:8000/api/v1</span>
                </label>
                <div style="display: flex; gap: 8px;">
                  <input
                    type="text"
                    id="cfg-backend-url"
                    class="form-input"
                    value="${config.backendApiUrl || 'http://localhost:8000/api/v1'}"
                  />
                  <button type="button" id="btn-test-backend-ping" class="btn btn-secondary">
                    Test Health
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Meta WhatsApp Cloud API Credentials -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">Meta Cloud API Credentials (WABA)</h3>
              <span class="card-description">Direct connection to Meta Graph API v20.0</span>
            </div>
            <div class="card-body">
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">WhatsApp Business Account ID (WABA ID)</label>
                  <input type="text" id="cfg-waba-id" class="form-input" value="${config.wabaId}" />
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number ID</label>
                  <input type="text" id="cfg-phone-id" class="form-input" value="${config.phoneNumberId}" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Display Phone Number</label>
                <input type="text" id="cfg-display-phone" class="form-input" value="${config.displayPhoneNumber}" />
              </div>

              <div class="form-group">
                <label class="form-label">Permanent System User Access Token</label>
                <input type="password" id="cfg-token" class="form-input" value="EAAGm0PXq15wBO8ZChXqK2..." />
              </div>
            </div>
          </div>

          <!-- 3. Webhook Endpoint & Verify Challenge -->
          <div class="content-card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Meta Inbound Webhook Configuration</h3>
                <span class="card-description">Where Meta sends incoming student messages & read receipts</span>
              </div>
              <button type="button" id="btn-ping-webhook-settings" class="btn btn-secondary btn-sm">
                Run Challenge Ping
              </button>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-label">Webhook Callback URL</label>
                <div style="display: flex; gap: 8px;">
                  <input
                    type="text"
                    id="cfg-webhook-url"
                    class="form-input"
                    value="${config.webhookUrl}"
                    readonly
                  />
                  <button type="button" id="btn-copy-webhook-url" class="btn btn-subtle btn-sm">
                    Copy URL
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Verify Token (hub.verify_token)</label>
                <input type="text" id="cfg-verify-token" class="form-input" value="${config.webhookVerifyToken}" />
              </div>

              <div id="webhook-test-log" style="display: none; margin-top: 10px;">
                <!-- Filled dynamically by ping test -->
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Bot Automation Pacing & Developer Schema Reference -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Automation Rules -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">Bot Automation Rules</h3>
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; gap: 14px; font-size: 13px;">
              <div>
                <label class="form-label">Daily Micro-Lesson Drop Pacing</label>
                <select id="cfg-drop-time" class="form-select">
                  <option value="08:30 IST" selected>08:30 AM IST (Recommended for students)</option>
                  <option value="17:00 IST">05:00 PM IST (After school drop)</option>
                  <option value="20:00 IST">08:00 PM IST (Evening study session)</option>
                </select>
              </div>

              <div>
                <label class="form-label">Inactivity Nudge Timeout</label>
                <select id="cfg-nudge-timeout" class="form-select">
                  <option value="24h">After 24 hours of inactivity</option>
                  <option value="48h">After 48 hours of inactivity</option>
                </select>
              </div>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 6px;">
                <label class="form-label">Reset Local Data</label>
                <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
                  Restore default sample courses, students, and chat transcripts.
                </p>
                <button type="button" id="btn-reset-defaults" class="btn btn-danger btn-sm">
                  Reset Demo Data to Initial State
                </button>
              </div>
            </div>
          </div>

          <!-- Clean Developer API Endpoints Reference -->
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">Backend API Contract</h3>
              <span class="badge badge-info">REST JSON</span>
            </div>
            <div class="card-body" style="font-size: 12px;">
              <p style="color: var(--text-secondary); margin-bottom: 10px;">
                The UI is architected around these clean endpoints. Wire them up directly to your Python/Node/Go backend:
              </p>
              <div class="code-box">
GET    /api/v1/stats
GET    /api/v1/courses
POST   /api/v1/courses
GET    /api/v1/students?status=&course=
GET    /api/v1/students/:id/conversation
POST   /api/v1/messages/send
POST   /api/v1/broadcasts
POST   /api/webhook/whatsapp (Meta Cloud Webhook)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
