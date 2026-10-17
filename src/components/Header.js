// ==========================================================================
// Header Component — Fast search, webhook monitor, theme switcher
// ==========================================================================

import { store } from '../services/api.js';

export function renderHeader(currentRoute = 'overview') {
  const titles = {
    overview: 'Overview & Operator Pulse',
    courses: 'Microlearning Courses & Sequences',
    students: 'Students Directory & Cohort Progress',
    livechat: 'Live WhatsApp Conversations & Doubts',
    broadcasts: 'Broadcasts & Cohort Nudges',
    templates: 'Meta WhatsApp Cloud Templates',
    settings: 'Backend API & Webhook Configuration'
  };

  const title = titles[currentRoute] || 'Dashboard';
  const backendMode = store.config.backendMode || 'mock';

  return `
    <header class="app-header">
      <div class="header-left">
        <div class="header-title-group">
          <h1 class="header-title">${title}</h1>
          <span class="header-badge">
            <span class="badge-dot"></span>
            Webhook ${store.config.webhookLatencyMs || 24}ms
          </span>
        </div>
      </div>

      <div class="header-center">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            id="global-search-input"
            placeholder="Search students, phone numbers, courses, templates..."
            autocomplete="off"
          />
          <span class="search-shortcut">⌘K</span>
        </div>
      </div>

      <div class="header-right">
        <div
          id="btn-backend-toggle"
          class="btn btn-secondary btn-sm"
          title="Click to toggle between Mock Database and Live Backend API"
          style="font-family: var(--font-mono); font-size: 11px; cursor: pointer;"
        >
          <span style="color: ${backendMode === 'live' ? 'var(--status-success)' : 'var(--text-muted)'};">●</span>
          <span>Backend: ${backendMode === 'live' ? 'Live API' : 'Local Mock'}</span>
        </div>

        <button id="btn-theme-toggle" class="btn btn-subtle btn-icon-sm" title="Toggle Light / Dark Mode">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>

        <button id="btn-header-quick-action" class="btn btn-primary btn-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>New Course</span>
        </button>
      </div>
    </header>
  `;
}
