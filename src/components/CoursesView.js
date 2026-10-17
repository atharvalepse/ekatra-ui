// ==========================================================================
// Courses & Microlearning Sequences View
// ==========================================================================

import { store } from '../services/api.js';

export function renderCoursesView() {
  const courses = store.courses;

  return `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2 class="view-header-title">Microlearning Courses & Sequences</h2>
          <p class="view-header-subtitle">
            Create and schedule automated daily WhatsApp lesson sequences, interactive quizzes, and media drops.
          </p>
        </div>
        <div class="view-actions">
          <button id="btn-create-course" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      <!-- Course Statistics Overview -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Total Courses</span>
          <div class="kpi-value-row">
            <span class="kpi-value">${courses.length}</span>
          </div>
          <span class="kpi-subtext">Active curriculum tracks</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Total Enrolled Learners</span>
          <div class="kpi-value-row">
            <span class="kpi-value">${courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0).toLocaleString()}</span>
          </div>
          <span class="kpi-subtext">Across Grade 10, English & Finance</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Average Sequence Length</span>
          <div class="kpi-value-row">
            <span class="kpi-value">5.2 Days</span>
          </div>
          <span class="kpi-subtext">Bite-sized daily drop format</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Average Quiz Accuracy</span>
          <div class="kpi-value-row">
            <span class="kpi-value">84.8%</span>
          </div>
          <span class="kpi-subtext">Automated evaluation by bot</span>
        </div>
      </div>

      <!-- Content Card with Data Table -->
      <div class="content-card">
        <div class="filter-bar">
          <div class="filter-group">
            <input
              type="text"
              id="course-search-input"
              class="form-input"
              style="width: 260px; height: 32px;"
              placeholder="Search course title or code..."
            />
            <select id="course-status-filter" class="input-select">
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Drafts Only</option>
            </select>
            <select id="course-lang-filter" class="input-select">
              <option value="all">All Languages</option>
              <option value="English">English</option>
              <option value="English / Hinglish">English / Hinglish</option>
              <option value="English / Hindi">English / Hindi</option>
            </select>
          </div>
          <span style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">
            Showing ${courses.length} courses
          </span>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table" id="courses-table">
              <thead>
                <tr>
                  <th>Course Title & Code</th>
                  <th>Target Audience</th>
                  <th>Sequence Pacing</th>
                  <th>Enrolled</th>
                  <th>Completion Rate</th>
                  <th>Status</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${courses.map(c => `
                  <tr data-course-id="${c.id}">
                    <td>
                      <div style="font-weight: 600; font-size: 14px;">${c.title}</div>
                      <div class="table-subinfo">
                        <span style="font-family: var(--font-mono); font-weight: 600; color: var(--text-secondary);">${c.code}</span>
                        • ${c.language}
                      </div>
                    </td>
                    <td>
                      <span style="font-size: 13px;">${c.audience}</span>
                    </td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-family: var(--font-mono); font-weight: 600;">${c.days ? c.days.length : c.durationDays} Days</span>
                        <span class="badge badge-neutral" style="font-size: 10px;">Daily 08:30</span>
                      </div>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); font-weight: 600; font-size: 13px;">${c.enrolledCount}</span>
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
                      <div style="display: inline-flex; gap: 6px;">
                        <button class="btn btn-secondary btn-sm btn-edit-course" data-course-id="${c.id}">
                          Edit Sequence
                        </button>
                        <button class="btn btn-subtle btn-sm btn-preview-course" data-course-id="${c.id}" title="Preview in WhatsApp Simulator">
                          Preview
                        </button>
                        <button class="btn btn-subtle btn-sm btn-delete-course" data-course-id="${c.id}" title="Delete" style="color: var(--status-danger);">
                          ✕
                        </button>
                      </div>
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
