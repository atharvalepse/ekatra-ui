// ==========================================================================
// Interactive WhatsApp Bot Simulator Component
// Test student journey, daily drops, quizzes, and bot auto-replies in real-time
// ==========================================================================

import { api } from '../services/api.js';
import { formatWhatsAppText } from './CourseEditorModal.js';

export function renderWhatsAppSimulator() {
  return `
    <div class="sim-overlay minimized" id="whatsapp-simulator-overlay">
      <div class="sim-header" id="sim-header-trigger">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="wa-avatar" style="width: 24px; height: 24px; font-size: 11px;">E</div>
          <div>
            <div style="font-weight: 600; font-size: 12px; color: #ffffff;">
              WhatsApp Bot Simulator
            </div>
            <div style="font-size: 10px; color: rgba(255, 255, 255, 0.85);">+91 98200 44321 • Online</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" class="btn btn-subtle btn-icon-sm" id="btn-sim-reset" title="Reset simulator chat" style="color: #ffffff;">
            ↺
          </button>
          <button type="button" class="btn btn-subtle btn-icon-sm" id="btn-sim-toggle" style="color: #ffffff;">
            ▼
          </button>
        </div>
      </div>

      <!-- Quick Test Chips -->
      <div style="padding: 6px 10px; background-color: #f0f2f5; border-bottom: 1px solid var(--border-subtle); display: flex; gap: 6px; overflow-x: auto;">
        <button type="button" class="btn-sim-shortcut" data-text="START" style="font-size: 10px; background: #ffffff; border: 1px solid #cbd5e1; color: #008069; font-weight: 600; padding: 3px 8px; border-radius: 4px; cursor: pointer; white-space: nowrap;">
          Send "START"
        </button>
        <button type="button" class="btn-sim-shortcut" data-text="B" style="font-size: 10px; background: #ffffff; border: 1px solid #cbd5e1; color: #008069; font-weight: 600; padding: 3px 8px; border-radius: 4px; cursor: pointer; white-space: nowrap;">
          Quiz "Option B"
        </button>
        <button type="button" class="btn-sim-shortcut" data-text="STATUS" style="font-size: 10px; background: #ffffff; border: 1px solid #cbd5e1; color: #008069; font-weight: 600; padding: 3px 8px; border-radius: 4px; cursor: pointer; white-space: nowrap;">
          Send "STATUS"
        </button>
        <button type="button" class="btn-sim-shortcut" data-text="I have a doubt on factorisation" style="font-size: 10px; background: #ffffff; border: 1px solid #fde68a; color: #b45309; font-weight: 600; padding: 3px 8px; border-radius: 4px; cursor: pointer; white-space: nowrap;">
          Ask Doubt 🙋‍♂️
        </button>
      </div>

      <!-- Messages Body -->
      <div class="wa-chat-body" id="sim-messages-body" style="height: 320px; overflow-y: auto;">
        <div class="wa-msg wa-msg-received" style="max-width: 90%;">
          <div style="font-size: 12px;">
            👋 *Hello Learner!*\n\nWelcome to the Ekatra WhatsApp Learning Bot.\nReply *START* to begin your micro-lesson!
          </div>
          <div class="wa-msg-footer">
            <span>Just now</span>
            <span class="wa-tick-blue">✓✓</span>
          </div>
        </div>
      </div>

      <!-- Input Footer -->
      <form class="sim-input-row" id="sim-form">
        <input
          type="text"
          id="sim-input-text"
          class="sim-input"
          placeholder="Type like a student (e.g. START, B)..."
          autocomplete="off"
        />
        <button type="submit" class="btn btn-primary btn-sm" style="border-radius: 6px; padding: 0 10px;">
          Send
        </button>
      </form>
    </div>
  `;
}

// Logic for simulator interactions
export function initSimulatorLogic(showToast) {
  const overlay = document.getElementById('whatsapp-simulator-overlay');
  const headerTrigger = document.getElementById('sim-header-trigger');
  const toggleBtn = document.getElementById('btn-sim-toggle');
  const resetBtn = document.getElementById('btn-sim-reset');
  const simForm = document.getElementById('sim-form');
  const simInput = document.getElementById('sim-input-text');
  const messagesBody = document.getElementById('sim-messages-body');

  if (!overlay) return;

  function toggleOpen() {
    overlay.classList.toggle('minimized');
    if (toggleBtn) {
      toggleBtn.innerText = overlay.classList.contains('minimized') ? '▲' : '▼';
    }
  }

  headerTrigger.addEventListener('click', (e) => {
    if (e.target.closest('#btn-sim-reset')) return;
    toggleOpen();
  });

  resetBtn.addEventListener('click', () => {
    messagesBody.innerHTML = `
      <div class="wa-msg wa-msg-received" style="max-width: 90%;">
        <div style="font-size: 12px;">
          👋 *Simulator Reset*\n\nWelcome back! Reply *START* to trigger Day 1 of Class 10 Quadratic Equations.
        </div>
        <div class="wa-msg-footer">
          <span>Just now</span>
          <span class="wa-tick-blue">✓✓</span>
        </div>
      </div>
    `;
    showToast('Simulator chat reset to initial state', 'info');
  });

  // Handle shortcut chips
  document.querySelectorAll('.btn-sim-shortcut').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const txt = btn.getAttribute('data-text');
      simInput.value = txt;
      simForm.dispatchEvent(new Event('submit'));
    });
  });

  // Submit student message
  simForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = simInput.value.trim();
    if (!text) return;

    // Append student bubble
    appendMsg(text, 'student');
    simInput.value = '';

    // Simulate bot thinking / webhook response
    const botReply = await api.simulateBotInteraction(text);
    appendMsg(botReply.replyText, 'bot', botReply.buttons);
  });

  // Handle clicking quick-reply buttons inside simulated bubbles
  messagesBody.addEventListener('click', (e) => {
    const replyBtn = e.target.closest('.wa-btn-reply');
    if (replyBtn) {
      const btnText = replyBtn.innerText.trim();
      simInput.value = btnText;
      simForm.dispatchEvent(new Event('submit'));
    }
  });

  function appendMsg(txt, sender, buttons = null) {
    const bubble = document.createElement('div');
    bubble.className = `wa-msg ${sender === 'student' ? 'wa-msg-sent' : 'wa-msg-received'}`;
    bubble.style.maxWidth = '90%';

    let btnHtml = '';
    if (buttons && buttons.length) {
      btnHtml = `
        <div class="wa-quick-replies" style="margin-top: 6px;">
          ${buttons.map(b => `<div class="wa-btn-reply" style="cursor: pointer;">${b}</div>`).join('')}
        </div>
      `;
    }

    bubble.innerHTML = `
      <div style="font-size: 12px; white-space: pre-wrap;">
        ${formatWhatsAppText(txt)}
      </div>
      ${btnHtml}
      <div class="wa-msg-footer">
        <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span class="wa-tick-blue">✓✓</span>
      </div>
    `;

    messagesBody.appendChild(bubble);
    messagesBody.scrollTop = messagesBody.scrollHeight;
  }
}
