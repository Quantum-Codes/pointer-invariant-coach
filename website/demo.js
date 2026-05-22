'use strict';

// ─── Problem arrays ────────────────────────────────────────────────────────
const MAIN  = [1,1,1,0,0,0,1,1,1,1,0];
const FAIL1 = [0,0,1,1,1,0,0];   // slide 7 failing case, k=0
const FAIL2 = [0,0,0,0,0,1];     // slide 8 failing case, k=2

// ─── Slide data ────────────────────────────────────────────────────────────
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
    narrator: 'The user pastes the problem. No context, no preamble. The coach fires Gate 1 immediately — no summary of the problem, no observation about the approach. One question.'
  },

  {
    label: '// slide 02 — gates 1 + 2 clear',
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
    narrator: 'Gates 1 and 2 clear cleanly. The user understands what the problem wants and connects n ≤ 10⁵ to the complexity budget without being told O(n) is the target. Gate 3 Part A starts: brute force trace of the problem, not an algorithm trace.'
  },

  {
    label: '// slide 03 — the wrong answer',
    exchanges: [
      {
        role: 'user',
        html: 'I started at index 0 and tried expanding the window while tracking flips used. Flipped index 3 and index 4 (the two zeros), got <code>[1,1,1,1,1]</code> — length 5. Then I moved the window starting point forward — started at 1, still 5. Continued through the array and couldn\'t beat 5. Saved max as 5.'
      },
      {
        role: 'coach',
        html: 'You got 5, but the expected answer is 6. What candidate gives length 6?'
      }
    ],
    narrator: 'The user\'s trace is almost right — they found a valid window but missed a longer one. The coach doesn\'t explain the gap. It asks what candidate gives 6. The error is in the trace, not the invariant. Let the user find it.'
  },

  {
    label: '// slide 04 — the insight + Gate 3B',
    exchanges: [
      {
        role: 'user',
        html: 'ohhhhhhhhhh<br>I missed the both sides flip.<br><code>[0,1,1,1,1,0]</code> — flip both → length 6. My initial algorithm was wrong, I was only looking at consecutive zeroes starting from the left side.'
      },
      {
        role: 'coach',
        html: '<strong>Gate 3 Part B</strong>: instead of checking every candidate from scratch, what state could you carry forward to avoid redoing work?'
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
    narrator: 'The user sees the missed candidate and corrects themselves. Gate 3 Part B: the user describes carrying forward the earliest flip index and the flips-used count. The algorithm emerged from their own trace. The coach confirms the structure and moves straight to Gate 4.'
  },

  {
    label: '// slide 05 — invariant + Gate 4 complete',
    exchanges: [
      {
        role: 'user',
        html: 'Number of zeros in [left, right] is always ≤ k at every moment.'
      },
      {
        role: 'coach',
        html: 'Correct. That\'s the invariant. <strong>Gate 4 Part B</strong>: why does this loop always terminate?'
      },
      {
        role: 'user',
        html: 'right always advances unconditionally on every iteration of the for loop, and it can\'t go past nums.size().'
      },
      {
        role: 'coach',
        html: 'Correct. <strong>Gate 4 Part C</strong>: your loop runs while <code>right &lt; nums.size()</code>. What happens on the last iteration when right = n−1? Does anything inside access <code>nums[right+1]</code>?'
      },
      {
        role: 'user',
        html: 'No — I only access <code>nums[right]</code> and <code>nums[left]</code>. Both are in bounds. The condition <code>right &lt; nums.size()</code> is correct.'
      },
      {
        role: 'coach',
        html: 'Good. <strong>Gate 4 Part D — edge cases</strong>. Trace each of these:<br>1. All ones, k = 2 — what does your algorithm return?<br>2. All zeros, k = 0 — what does it return?<br>3. All zeros, k = n — what does it return?'
      },
      {
        role: 'user',
        html: '1. All ones, k=2: right sweeps to end, left never moves (no zeros to shrink from), returns n. ✓<br>2. All zeros, k=0: every right step is a zero, size > k immediately, left chases right — window stays size 0, returns 0. ✓<br>3. All zeros, k=n: budget never runs out, window grows to full array, returns n. ✓'
      },
      {
        role: 'coach',
        html: 'All four parts cleared. Write the code. <strong>Paste it here when you\'re done.</strong>'
      }
    ],
    narrator: 'The invariant states exactly the right condition. Liveness is clean — right advances unconditionally. Bounds justified. All three edge cases correctly traced on specific inputs. Gate 4 closes. No hints given. The student did this.'
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
    narrator: '"No." Three times. The coach does not help, hint, or soften. Gate 4 is already closed — the information is there. Rule 0: never write algorithmic code. The student writes it alone.'
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
        html: 'Typing bug. In your else-else branch you do <code>right++</code> then <code>continue</code> — but the <code>for</code> loop already increments <code>right</code>. You\'re double-incrementing on every step where the window is over budget and the flip queue is empty. Remove the <code>right++</code> from inside that branch.'
      },
      {
        role: 'user',
        html: 'OHHHHHHHHHH thank you — another failing case now on a longer test...'
      }
    ],
    narrator: 'Typing bug. The coach read the code silently, classified it as Class 2, and pointed it out directly. No Socratic dance for a typo — that wastes time and erodes trust. One line, one fix. The student moves on.'
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
        html: 'The case is too long to trace directly. Let me find a minimal input that breaks it...<br><br>Found one: <code>[0,0,0,0,0,1]</code>, k = 2. Expected 3, got 2.<br><br>Tracing: right=0, arr[0]=0, budget ok, push 0. right=1, arr[1]=0, budget ok, push 1. right=2, arr[2]=0, budget full. Pop front (index 0), move left to 1. But I never push index 2 into the queue. So the queue now has only index 1. right=3, arr[3]=0, budget full again — pops index 1, moves left to 2. Still never pushed 2 or 3. Queue is empty now. From here the window shrinks every zero instead of maintaining 2 flips. That\'s where the invariant breaks — zeros in [left, right] dips below k when I have leftover budget I\'m not tracking.'
      }
    ],
    narrator: 'Thinking bug. The coach put the code aside entirely and asked only about the invariant. The student found a minimal failing case themselves, traced it step by step, and located the exact moment the invariant breaks. No code quoted, no line referenced.'
  },

  {
    label: '// slide 09 — found it',
    exchanges: [
      {
        role: 'user',
        html: '<strong>OHHHHHHHHHH I FORGOT TO PUSH RIGHT INTO THE QUEUE WHEN I POP AND REPLACE!</strong><br><br>When the budget is full and I pop the oldest flip and move left, I need to immediately push the new zero\'s index so the queue tracks it. Without that push, the next zero thinks the budget is empty when it\'s actually full — and the invariant breaks right there.<br><br>Fixed it. Beats 100% on runtime.'
      },
      {
        role: 'coach',
        html: 'You found it yourself. That\'s the one that matters.<br><br>Now close it out — write the Invariant Card.'
      }
    ],
    narrator: 'The student found the missing push themselves by following the invariant, not the code. The coach confirms and asks for the card. "You found it yourself. That\'s the one that matters." — this is what the session is for.'
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
               unconditionally each step
TERMINATION  : right == nums.size();
               max window seen is the
               answer

EDGE CASE    : all zeros, k=0  → 0  ✓
               all ones        → n  ✓
               all zeros, k=n  → n  ✓

EARNED       : 2026-05-22
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</pre>`
      }
    ],
    narrator: 'The card is issued. The invariant is in writing, with the edge cases that were actually traced — not assumed. This is what the student earned. There is no card for a session where the invariant was handed to them.'
  }
];

// ─── Visualization frames (one per slide) ─────────────────────────────────
const VIZ_FRAMES = [
  // slide 01 — problem pasted, no algorithm yet
  { array: MAIN,  k: 2, left: -1, right: -1, zeros: -1, maxLen: -1,
    status: 'pending', note: 'Problem received. Gate 1 starts immediately.' },

  // slide 02 — gates 1+2 clear, brute-force trace begins
  { array: MAIN,  k: 2, left: 0, right: 4, zeros: 2, maxLen: 5,
    status: 'pending', note: 'Brute force: window [0,4] — length 5. Scanning for a longer candidate.' },

  // slide 03 — wrong answer (missed both-sides flip)
  { array: MAIN,  k: 2, left: 0, right: 4, zeros: 2, maxLen: 5,
    status: 'wrong',   note: 'User got 5. Correct is 6. Missed window [4,9] — flip zeros at both sides.' },

  // slide 04 — aha + Gate 3B complete
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Key insight: flip index 4 and 5 → window [4,9] = length 6.' },

  // slide 05 — invariant stated, Gate 4 complete
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Invariant: zeros in [left, right] ≤ k at every moment. All parts cleared.' },

  // slide 06 — "write the code"
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Gate 4 closed. Invariant proved. Student writes code alone.' },

  // slide 07 — first bug: double-increment (k=0 failing case)
  { array: FAIL1, k: 0, left: 2, right: 5, zeros: 0, maxLen: 4,
    status: 'wrong',   note: 'k=0: no flips allowed. Bug: right++ inside loop + for-loop increment = skip. Got 4, expected 3.' },

  // slide 08 — second bug: missing push (k=2 failing case)
  { array: FAIL2, k: 2, left: 1, right: 2, zeros: 1, maxLen: 2,
    status: 'wrong',   note: 'k=2: when popping oldest flip, forgot to push new zero. Queue loses track. Got 2, expected 3.' },

  // slide 09 — both bugs fixed
  { array: MAIN,  k: 2, left: 5, right: 10, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Both bugs fixed. Final window [5,10] → length 6. Beats 100%.' },

  // slide 10 — invariant card
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Session complete. Card earned.' }
];

// ─── Code versions ─────────────────────────────────────────────────────────
const CODE_VERSIONS = {
  // v1: original paste — has double-increment bug in else-else branch
  v1:
`int longestOnes(vector<int>& nums, int k) {
    int left = 0, maxLen = 0;
    queue<int> flips;

    for (int right = 0; right < nums.size(); right++) {
        if (nums[right] == 0) {
            if ((int)flips.size() < k) {
                flips.push(right);
            } else if (!flips.empty()) {
                left = flips.front() + 1;
                flips.pop();
                flips.push(right);
            } else {
                right++;   // BUG: for-loop already increments
                continue;
            }
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,

  // v2: double-increment fixed, but still missing flips.push(right) after pop
  v2:
`int longestOnes(vector<int>& nums, int k) {
    int left = 0, maxLen = 0;
    queue<int> flips;

    for (int right = 0; right < nums.size(); right++) {
        if (nums[right] == 0) {
            if ((int)flips.size() < k) {
                flips.push(right);
            } else if (!flips.empty()) {
                left = flips.front() + 1;
                flips.pop();
                // BUG: forgot flips.push(right) here
            }
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,

  // v3: both bugs fixed — accepted, beats 100%
  v3:
`int longestOnes(vector<int>& nums, int k) {
    int left = 0, maxLen = 0;
    queue<int> flips;

    for (int right = 0; right < nums.size(); right++) {
        if (nums[right] == 0) {
            if ((int)flips.size() < k) {
                flips.push(right);
            } else if (!flips.empty()) {
                left = flips.front() + 1;
                flips.pop();
                flips.push(right);  // FIXED
            }
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`
};

// Which code version to show per slide (index 0–9)
const CODE_PER_SLIDE = [
  null, null, null, null, null, null,   // slides 1-6: no code yet
  'v1',                                  // slide 7: first paste, has bug 1
  'v2',                                  // slide 8: bug 1 fixed, has bug 2
  'v3',                                  // slide 9: both fixed
  'v3'                                   // slide 10: card
];

// ─── DOM refs ──────────────────────────────────────────────────────────────
const overlay      = document.getElementById('demo-overlay');
const exchangesWrap= document.getElementById('exchanges-wrap');
const exchangesEl  = document.getElementById('exchanges');
const labelEl      = document.getElementById('slide-label');
const narratorEl   = document.getElementById('narrator-text');
const counterEl    = document.getElementById('slide-counter');
const dotsEl       = document.getElementById('dots');
const prevBtn      = document.getElementById('prev-btn');
const nextBtn      = document.getElementById('next-btn');
const playBtn      = document.getElementById('play-demo-btn');
const closeBtn     = document.getElementById('close-demo');
const vizPanelEl   = document.getElementById('viz-panel');
const codeContentEl= document.getElementById('code-content');
const approachEl   = document.getElementById('approach-badge');

let current = 0;

// ─── Render ────────────────────────────────────────────────────────────────
function renderViz(frame) {
  const { array, k, left, right, zeros, maxLen, status, note } = frame;

  approachEl.className = 'approach-badge ' + status;
  approachEl.textContent =
    status === 'correct' ? '✓  CORRECT APPROACH' :
    status === 'wrong'   ? '✗  WRONG APPROACH'   :
                           '◌  TRACING...';

  const cells = array.map((val, i) => {
    const inWin = left >= 0 && right >= 0 && i >= left && i <= right;
    const cls = [
      'arr-cell',
      inWin            ? 'in-win'  : '',
      inWin && val===0 ? 'is-zero' : ''
    ].filter(Boolean).join(' ');
    return `<div class="${cls}">${val}</div>`;
  }).join('');

  const ptrs = array.map((_, i) => {
    let inner = '';
    if (left >= 0 && right >= 0) {
      if (i === left && i === right) inner = '<span class="ptr-lr">L=R</span>';
      else if (i === left)           inner = '<span class="ptr-l">L</span>';
      else if (i === right)          inner = '<span class="ptr-r">R</span>';
    }
    return `<div class="ptr-cell">${inner}</div>`;
  }).join('');

  const showVars = zeros >= 0 && maxLen >= 0;
  const varsHtml = showVars
    ? `<div class="viz-vars">
         <span class="viz-var">k<em>${k}</em></span>
         <span class="viz-var">zeros<em>${zeros}</em></span>
         <span class="viz-var">maxLen<em>${maxLen}</em></span>
       </div>`
    : '';

  vizPanelEl.innerHTML =
    `<div class="arr-row">${cells}</div>` +
    `<div class="ptr-row">${ptrs}</div>` +
    varsHtml +
    `<div class="viz-note">${note}</div>`;
}

function renderCode(idx) {
  const version = CODE_PER_SLIDE[idx];
  if (!version) {
    codeContentEl.className = 'code-placeholder';
    codeContentEl.textContent = '// code appears after Gate 4 clears';
    return;
  }
  codeContentEl.className = '';
  codeContentEl.textContent = CODE_VERSIONS[version];
}

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

  Array.from(dotsEl.children).forEach((dot, i) =>
    dot.classList.toggle('active', i === current)
  );

  exchangesWrap.scrollTop = 0;

  renderViz(VIZ_FRAMES[current]);
  renderCode(current);
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
