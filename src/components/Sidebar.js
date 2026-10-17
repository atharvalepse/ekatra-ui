// ==========================================================================
// Sidebar Component — Clean, utilitarian navigation
// ==========================================================================

export function renderSidebar(currentRoute = 'overview') {
  const routes = [
    {
      id: 'overview',
      label: 'Overview & Pulse',
      badge: 'Live',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
    },
    {
      id: 'courses',
      label: 'Courses & Sequences',
      badge: '4',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
    },
    {
      id: 'students',
      label: 'Students & Roster',
      badge: '7',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      id: 'livechat',
      label: 'Live WhatsApp Inbox',
      badge: '2 Doubts',
      badgeClass: 'badge-warning',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
    },
    {
      id: 'broadcasts',
      label: 'Broadcasts & Nudges',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
    },
    {
      id: 'templates',
      label: 'Meta Cloud Templates',
      badge: 'Approved',
      badgeClass: 'badge-success',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M14 9h4"/><path d="M14 15h4"/></svg>`
    },
    {
      id: 'settings',
      label: 'API & Webhook Config',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
    }
  ];

  return `
    <aside class="app-sidebar">
      <div class="sidebar-header">
        <a href="#overview" class="brand-badge">
          <div class="brand-icon-box">E</div>
          <div>
            <div style="font-weight: 700; line-height: 1.1;">Ekatra Admin</div>
            <div style="font-size: 10px; color: var(--text-muted); font-weight: 500;">WhatsApp Learning Bot</div>
          </div>
        </a>
      </div>

      <div class="sidebar-status-banner">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="pulse-dot"></span>
          <span style="font-weight: 600; color: var(--status-success);">WhatsApp Online</span>
        </div>
        <span style="font-family: var(--font-mono); color: var(--text-muted);">v20.0</span>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section-label">Operator Workspace</div>
        ${routes.map(r => `
          <a class="nav-item ${currentRoute === r.id ? 'active' : ''}" data-route="${r.id}" href="#${r.id}">
            <div class="nav-item-content">
              ${r.icon}
              <span>${r.label}</span>
            </div>
            ${r.badge ? `
              <span class="nav-pill-badge ${r.badgeClass || ''}">${r.badge}</span>
            ` : ''}
          </a>
        `).join('')}

        <div class="nav-section-label" style="margin-top: 16px;">Simulator & Testing</div>
        <div class="nav-item" id="btn-toggle-simulator" style="background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.3); color: var(--text-primary);">
          <div class="nav-item-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <span style="font-weight: 600;">Open Bot Simulator</span>
          </div>
          <span style="font-size: 10px; font-family: var(--font-mono); color: var(--wa-green);">Test</span>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="waba-tag">
          <span>WABA ID</span>
          <span style="color: var(--text-primary);">#10948271</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--text-muted); padding: 0 4px;">
          <span>+91 98200 44321</span>
          <span style="color: var(--status-success);">● Tier 1 (1k/day)</span>
        </div>
      </div>
    </aside>
  `;
}
