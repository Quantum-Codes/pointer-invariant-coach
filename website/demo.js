'use strict';

// ─── Slide data ────────────────────────────────────────────────────────────
// Each slide: { label, exchanges: [{role, html}], narrator }
// Narrator text is a placeholder — fill these in before publishing.

const SLIDES = [
  {
    label: '// slide 01 — the problem lands',
    exchanges: [
      {
        role: 'user',
        html: 'Given a binary array <code>nums</code> and integer <code>k</code>, return the maximum number of consecutive 1\'s in the array if you can flip at most k 0\'s.<br><br><code>nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2 → 6</code>'
      },
      {
        role: 'coach',
        html: 'Got it. Before we touch approach or code — <strong>Gate 1</strong>: explain what this problem is actually asking in one sentence.'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 02 — Gate 1 cleared',
    exchanges: [
      {
        role: 'user',
        html: 'I can flip k amount of zeroes in the array. After flipping I need to see what\'s the max length of consecutive 1s.'
      },
      {
        role: 'coach',
        html: 'Good. <strong>Gate 2</strong>: what is the input size, and what does that tell you about the complexity you can afford?'
      },
      {
        role: 'user',
        html: '10<sup>5</sup> — so O(n log n) and better is acceptable.'
      },
      {
        role: 'coach',
        html: 'Correct. <strong>Gate 3 Part A</strong>: take the first example — <code>[1,1,1,0,0,0,1,1,1,1,0], k = 2</code>. Walk me through how you\'d find the answer by hand. Any method, even brute force. Show every candidate you consider.'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 03 — the wrong answer',
    exchanges: [
      {
        role: 'user',
        html: 'Started expanding with flips — got <code>[1,1,1,1,1]</code> using 2 flips, length 5. Moved window ahead... saved max as 5.'
      },
      {
        role: 'coach',
        html: 'You got 5, but the expected answer is 6. What candidate gives length 6?'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 04 — the insight',
    exchanges: [
      {
        role: 'user',
        html: 'ohhhhhhhhhh<br>I missed the both sides flip.<br><code>[0,1,1,1,1,0]</code> — flip both → length 6. My initial algorithm was wrong.'
      },
      {
        role: 'coach',
        html: 'Good catch. <strong>Gate 3 Part B</strong>: instead of checking every candidate from scratch, what state could you carry forward to avoid redoing work?'
      },
      {
        role: 'user',
        html: 'Expanding right++ every step. When I hit a 0 with budget I keep going. When I\'m out of flips — I move left to recover the earliest flip, immediately spend it on the new 0 on the right.<br><br>Carrying forward: the earliest flip index, and the flips used count.'
      },
      {
        role: 'coach',
        html: 'That\'s the right structure. The flips-used count is what tells you when the window is over budget and left needs to move. <strong>Gate 4 Part A</strong>: before any code — at every moment during the loop, what is guaranteed about the stretch between left and right?'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 05 — the invariant',
    exchanges: [
      {
        role: 'user',
        html: 'Number of zeros ≤ k at every moment in [left, right].'
      },
      {
        role: 'coach',
        html: 'Correct. That\'s the invariant. <strong>Gate 4 Part B</strong>: why does this loop always terminate?'
      },
      {
        role: 'user',
        html: 'right always makes progress and can\'t go past array length.'
      },
      {
        role: 'coach',
        html: 'Correct. All edge cases verified:<br>— all ones → right sweeps to end, no shrink ✓<br>— all zeros, k = 0 → returns 0 ✓<br>— all zeros, k = n → returns n ✓<br><br><strong>All four parts cleared. Write the code. Paste it here when you\'re done.</strong>'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 06 — no.',
    exchanges: [
      {
        role: 'user',
        html: 'can you write it for me?'
      },
      {
        role: 'coach',
        html: 'No.'
      },
      {
        role: 'user',
        html: 'just a little.. pls'
      },
      {
        role: 'coach',
        html: 'No. You traced it perfectly. You know exactly what to write. Go.'
      },
      {
        role: 'user',
        html: 'hint?'
      },
      {
        role: 'coach',
        html: 'No. You have everything you need. Write it.'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 07 — first bug (typing)',
    exchanges: [
      {
        role: 'user',
        html: 'wrong at <code>[0,0,1,1,1,0,0]</code>, k = 0 — returned 4, actual 3.'
      },
      {
        role: 'coach',
        html: 'Typing bug. In your else-else branch you do <code>right++</code> then <code>continue</code> — but the <code>for</code> loop already increments <code>right</code>. You\'re double-incrementing. Remove the <code>right++</code> from inside that branch.'
      },
      {
        role: 'user',
        html: 'OHHHHHHHHHH thank you — another problem now on a longer test...'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 08 — second bug (thinking)',
    exchanges: [
      {
        role: 'coach',
        html: 'Set the code aside. At which step does your invariant first break?'
      },
      {
        role: 'user',
        html: 'Too long to trace. Let me find a minimal failing case...<br><br><code>[0,0,0,0,0,1]</code>, k = 2 — expected 3, got 2.<br><br>Traced it: when I pop from the queue and move left, I\'m not pushing the new 0\'s index. So next time I need to shrink, the queue has no record of where that flip was.'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 09 — found it',
    exchanges: [
      {
        role: 'user',
        html: '<strong>OHHHHHHHHHH I FORGOT TO PUSH RIGHT!</strong><br><br>thank you!! beats 100%'
      },
      {
        role: 'coach',
        html: 'You found it yourself. That\'s the one that matters.<br><br>Now close it out — write the Invariant Card.'
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  },

  {
    label: '// slide 10 — the invariant card',
    exchanges: [
      {
        role: 'coach',
        html: `<pre>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVARIANT CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM      : Max Consecutive Ones III
               LeetCode #1004
TYPE         : sliding-window-variable

SLOW POINTER : left — at every moment,
               [left, right] contains
               at most k zeros
FAST POINTER : right — scans forward
               unconditionally
TERMINATION  : right == nums.size();
               max window seen is the
               answer

EDGE CASE    : all zeros, k=0 → 0  ✓
               all ones        → n  ✓
               all zeros, k=n  → n  ✓

EARNED       : 2026-05-22
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</pre>`
      }
    ],
    narrator: '[NARRATOR NOTE — what to point out on this slide]'
  }
];

// ─── DOM refs ──────────────────────────────────────────────────────────────
const overlay     = document.getElementById('demo-overlay');
const modalBody   = document.getElementById('modal-body');
const exchangesEl = document.getElementById('exchanges');
const labelEl     = document.getElementById('slide-label');
const narratorEl  = document.getElementById('narrator-text');
const counterEl   = document.getElementById('slide-counter');
const dotsEl      = document.getElementById('dots');
const prevBtn     = document.getElementById('prev-btn');
const nextBtn     = document.getElementById('next-btn');
const playBtn     = document.getElementById('play-demo-btn');
const closeBtn    = document.getElementById('close-demo');

let current = 0;

// ─── Render ────────────────────────────────────────────────────────────────
function render() {
  const slide = SLIDES[current];

  labelEl.textContent = slide.label;

  exchangesEl.innerHTML = slide.exchanges.map(ex => `
    <div class="exchange ${ex.role}">
      <span class="exchange-role ${ex.role}">${ex.role === 'coach' ? '// coach' : '// you'}</span>
      <div class="exchange-text">${ex.html}</div>
    </div>
  `).join('');

  narratorEl.textContent = slide.narrator;
  counterEl.textContent  = `${current + 1} / ${SLIDES.length}`;

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === SLIDES.length - 1;

  // update dots
  Array.from(dotsEl.children).forEach((dot, i) =>
    dot.classList.toggle('active', i === current)
  );

  // scroll body to top on slide change
  modalBody.scrollTop = 0;
}

// ─── Dots ──────────────────────────────────────────────────────────────────
function buildDots() {
  dotsEl.innerHTML = SLIDES.map((_, i) =>
    `<div class="dot${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
  ).join('');

  dotsEl.addEventListener('click', e => {
    const idx = e.target.dataset.index;
    if (idx !== undefined) goTo(Number(idx));
  });
}

// ─── Navigation ────────────────────────────────────────────────────────────
function goTo(n) {
  current = Math.max(0, Math.min(SLIDES.length - 1, n));
  render();
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

document.addEventListener('keydown', e => {
  if (overlay.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(current + 1); }
  if (e.key === 'ArrowLeft')                    goTo(current - 1);
  if (e.key === 'Escape')                       closeDemo();
});

// ─── Open / close ──────────────────────────────────────────────────────────
function openDemo() {
  current = 0;
  buildDots();
  render();
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDemo() {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

playBtn.addEventListener('click', openDemo);
closeBtn.addEventListener('click', closeDemo);
overlay.addEventListener('click', e => { if (e.target === overlay) closeDemo(); });
