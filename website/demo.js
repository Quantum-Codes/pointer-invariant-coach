'use strict';

// ─── Problem arrays ────────────────────────────────────────────────────────
const MAIN  = [1,1,1,0,0,0,1,1,1,1,0];
const FAIL1 = [0,0,1,1,1,0,0];   // slide 9 failing case, k=0
const FAIL2 = [0,0,0,0,0,1];     // slide 10 failing case, k=2

// ─── Syntax highlighter ────────────────────────────────────────────────────
const HL_KW   = new Set(['int','class','public','private','return','for','if','else',
                          'while','continue','void','auto','bool','true','false',
                          'const','static','new','delete','this']);
const HL_TYPE = new Set(['vector','queue','Solution','string','size_t','max','min',
                          'pair','stack','deque','map','set']);

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function hlLine(raw) {
  const ci = raw.indexOf('//');
  const code    = ci >= 0 ? raw.slice(0, ci) : raw;
  const comment = ci >= 0 ? raw.slice(ci)    : null;

  let html = '';
  let i = 0;
  while (i < code.length) {
    const c = code[i];
    if (/[a-zA-Z_]/.test(c)) {
      let j = i;
      while (j < code.length && /\w/.test(code[j])) j++;
      const word = code.slice(i, j);
      if      (HL_KW.has(word))   html += `<span class="hl-kw">${esc(word)}</span>`;
      else if (HL_TYPE.has(word)) html += `<span class="hl-type">${esc(word)}</span>`;
      else                         html += esc(word);
      i = j;
    } else if (/\d/.test(c)) {
      let j = i;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      html += `<span class="hl-num">${esc(code.slice(i, j))}</span>`;
      i = j;
    } else {
      html += esc(c);
      i++;
    }
  }
  if (comment) html += `<span class="hl-comment">${esc(comment)}</span>`;
  return html;
}

function syntaxHL(rawCode) {
  return rawCode.split('\n').map(hlLine).join('\n');
}

// ─── Code versions (actual session code) ──────────────────────────────────
const CODE_VERSIONS = {

  // First paste — has double-increment bug in else-else branch
  v1: {
    bugLines: [29],
    code:
`class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int used_flips = 0;
        queue<int> flip_idx;
        int left = 0, right = 0;
        int soln = 0;

        for (right = 0; right < nums.size(); right++) {
            if (nums[right] == 1) {
                soln = max(soln, right - left + 1);
                continue;
            }
            else {
                if (used_flips < k) {
                    used_flips++;
                    flip_idx.push(right);
                    soln = max(soln, right - left + 1);
                    continue;
                }
                else {
                    if (!flip_idx.empty()) {
                        left = flip_idx.front() + 1;
                        flip_idx.pop();
                        continue;
                    }
                    else {
                        // k was 0 — skip past this 0
                        left = right + 1;
                        right++;  // BUG: for-loop already increments right
                        continue;
                    }
                }
            }
        }
        return soln;
    }
};`
  },

  // Double-increment removed — but still missing flip_idx.push(right) after pop
  v2: {
    bugLines: [23, 24],
    code:
`class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int used_flips = 0;
        queue<int> flip_idx;
        int left = 0, right = 0;
        int soln = 0;

        for (right = 0; right < nums.size(); right++) {
            if (nums[right] == 1) {
                soln = max(soln, right - left + 1);
                continue;
            }
            else {
                if (used_flips < k) {
                    used_flips++;
                    flip_idx.push(right);
                    soln = max(soln, right - left + 1);
                    continue;
                }
                else {
                    if (!flip_idx.empty()) {
                        left = flip_idx.front() + 1;
                        flip_idx.pop();
                        // BUG: forgot flip_idx.push(right) here
                        continue;
                    }
                    else {
                        // k was 0 — skip past this 0
                        left = right + 1;
                        continue;
                    }
                }
            }
        }
        return soln;
    }
};`
  },

  // Both bugs fixed — accepted, beats 100%
  v3: {
    bugLines: [],
    goodLines: [24],
    code:
`class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int used_flips = 0;
        queue<int> flip_idx;
        int left = 0, right = 0;
        int soln = 0;

        for (right = 0; right < nums.size(); right++) {
            if (nums[right] == 1) {
                soln = max(soln, right - left + 1);
                continue;
            }
            else {
                if (used_flips < k) {
                    used_flips++;
                    flip_idx.push(right);
                    soln = max(soln, right - left + 1);
                    continue;
                }
                else {
                    if (!flip_idx.empty()) {
                        left = flip_idx.front() + 1;
                        flip_idx.pop();
                        flip_idx.push(right);  // FIXED: track this flip
                        continue;
                    }
                    else {
                        // k was 0 — skip past this 0
                        left = right + 1;
                        continue;
                    }
                }
            }
        }
        return soln;
    }
};`
  }
};

// Which code version per slide (12 slides, indices 0–11)
const CODE_PER_SLIDE = [
  null, null, null, null, null, null, null, null,  // slides 1–8: no code yet
  'v1',   // slide  9: first paste with bug 1
  'v2',   // slide 10: bug 1 fixed, bug 2 present
  'v3',   // slide 11: both fixed
  'v3'    // slide 12: post-card
];

// ─── Slide data (verbatim from session-lc1004.md) ─────────────────────────
const SLIDES = [

  // ── SLIDE 01 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 01 — the problem lands',
    exchanges: [
      { role: 'user', html:
        `Given a binary array <code>nums</code> and an integer <code>k</code>, return the maximum number of consecutive <code>1</code>'s in the array if you can flip at most <code>k</code> <code>0</code>'s.<br><br>
Example 1:<br>
<pre>Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
Output: 6
Explanation: [1,1,1,0,0,1,1,1,1,1,1]
Bolded numbers were flipped from 0 to 1.</pre>
Example 2:<br>
<pre>Input: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3
Output: 10
Explanation: [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1]</pre>
Constraints:<br>
<code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code><br>
<code>nums[i]</code> is either <code>0</code> or <code>1</code><br>
<code>0 &lt;= k &lt;= nums.length</code>`
      },
      { role: 'coach', html:
        `Got it. Before we touch approach or code — <strong>Gate 1</strong>: explain what this problem is actually asking in one sentence.`
      }
    ],
    narrator: 'The user pastes the problem verbatim. The coach fires Gate 1 immediately — no summary, no observation about approach, no hint about what data structure might help. One question.'
  },

  // ── SLIDE 02 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 02 — gates 1 + 2 clear',
    exchanges: [
      { role: 'user', html: `I can flip k amount of zeroes in the array. After flipping i need to see whats the max length of consecutive 1s` },
      { role: 'coach', html: `Good. <strong>Gate 2</strong>: what is the input size, and what does that tell you about the complexity you can afford?` },
      { role: 'user', html: `10^5<br>so nlogn and better is acceptable` },
      { role: 'coach', html: `Correct. <strong>Gate 3 Part A</strong>: take the first example — <code>nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2</code>. Walk me through how you'd find the answer by hand, any method, even brute force. Show every candidate you consider.` }
    ],
    narrator: 'Gates 1 and 2 clear without friction. The user correctly separates the task from the description and connects n ≤ 10⁵ to the complexity budget. The coach never confirms that O(n) exists — the user picks their target, the coach confirms feasibility.'
  },

  // ── SLIDE 03 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 03 — the brute-force trace (wrong answer)',
    exchanges: [
      { role: 'user', html:
        `[1] [11] [111]<br>
[1111] (flipped one)<br>
[11111] (flipped 2) - max yet. decreases after this. save size 5<br>
[1111] (flipped 2) - moved window ahead since i didnt have flipping power anymore. already had used 2<br>
actually i can skip the string of zeroes since when i get to such a point with a continuous string of 0s &gt; k, i can skip the entire region<br>
so now i start from the last few [11110] as new array<br>
[1] [11] [111] [1111] [11111] -&gt; flipped 1 but then this is same 5 size so now fine`
      },
      { role: 'coach', html: `You got 5, but the expected answer is 6. What candidate gives length 6?` }
    ],
    narrator: 'The trace is thoughtful but incomplete — the user missed the window that requires flipping zeros on both sides of the run. The coach doesn\'t explain the gap. It asks a single question and waits.'
  },

  // ── SLIDE 04 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 04 — the aha + wrong approach + the correct trace',
    exchanges: [
      { role: 'user', html: `ohhhhhhhhhhh<br>i missed the both sides flip<br>[011110] flip gives 6. my initial algo was wrong` },
      { role: 'coach', html: `Good catch. <strong>Gate 3 Part B</strong>: so instead of checking every candidate from scratch, what state could you carry forward to avoid redoing work?` },
      { role: 'user', html:
        `when i know there exists a string of 0s more in length than k, i know that no amount of flips will be able to join them both<br>
So i dont need to include all those 0s in the calculations<br>
just k of them from the end or from the start<br><br>
so if i have xxxxx00000xxxx and k=2<br>
i can partition as xxxxx00 and 00xxxx and run on there. one 0 completely eliminted and a whole lot of windows gone`
      },
      { role: 'coach', html: `Trace that approach on <code>[1,1,1,0,0,0,1,1,1,1,0]</code> with <code>k = 2</code>. What are your partitions and what answer do you get?` },
      { role: 'user', html:
        `Actually bad approach. i got a better one while tracing<br><br>
[1] [11] [111] normally expanding left and right (right++) - max is updated on every turn<br>
now we got a 0. we can use one flip and get [1111]. We have another flip available so we continue on right++<br>
ANOTHER 0. [11110] becomes [11111]. But used both flips.<br>
We will still expand to see if any future 1s can be included<br>
expanded [111110] -&gt; at this point we know that we need to move left now until the point where we made the first flip to get that flip back.<br>
First flip was at index 3. So we put left = 4 and get back a flip. And now immediately use that flip on the newly unlocked 0 on the right.<br>
[11] - left = 4, right = 5, remaining flips = 0<br>
now we again expand right to check for more 1s to join on here<br>
[111] yo got a 1. do that more<br>
[1111] [11111] [111111] booom got a new max - 6<br>
now expand again<br>
[1111110] - no flips available. gotta move left to the earliest flip + 1<br>
that earliest flip is now at index 4. so we move it at index 5<br>
left = 5, and we flipped tha last 0 now. [111111] another 6.<br><br>
answer is 6`
      }
    ],
    narrator: 'The user\'s first attempt at Gate 3B is a partition approach — plausible but wrong. The coach doesn\'t dismiss it; it asks for a trace. Mid-trace the user abandons it themselves and finds a better algorithm. That\'s Gate 3B passing itself: the structure emerged from their own trace.'
  },

  // ── SLIDE 05 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 05 — clarifying what to carry forward',
    exchanges: [
      { role: 'coach', html:
        `That's the right answer and the right structure. <strong>Gate 3 Part B</strong>: you're already doing this — instead of restarting from scratch, you're carrying two things forward. What are they?`
      },
      { role: 'user', html: `the most earliest flip AND the current max` },
      { role: 'coach', html:
        `Close. The current max is one. But the other isn't just the earliest flip position — it's something you're updating on every step that tells you when to move left. What is it?`
      },
      { role: 'user', html: `Earliest flip index indeed is necessary to store<br>and the remaining flips?` },
      { role: 'coach', html:
        `Yes — the count of flips used (or remaining) is what you carry forward. That's the state that tells you when the window is over budget and left needs to move. <strong>Gate 4 Part A</strong>: before any code, name your two pointers and tell me — at every moment during the loop, what is guaranteed about the stretch between them?`
      }
    ],
    narrator: 'The user names "earliest flip AND current max" — half right. The coach probes the other half without revealing it. The user reaches "remaining flips" on their own. Gate 3 closes. Gate 4 opens.'
  },

  // ── SLIDE 06 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 06 — Gate 4A: three rounds to the invariant',
    exchanges: [
      { role: 'user', html:
        `When i consider as a candidate to update max, the stretch [left, right] is a valid window with all 1s after using the flips within budget`
      },
      { role: 'coach', html:
        `"When I consider updating max" is not every moment — it's just one moment. Does your invariant hold at the start of the loop, after every single step, and at the end? State it as something that is always true about [left, right], not just sometimes.`
      },
      { role: 'user', html:
        `not even about the moment "when left moves"?<br>
because when left moves, before that [left, right-1] is the maximum window valid before we start considering other chars`
      },
      { role: 'coach', html:
        `What is always true about the number of zeros between left and right, at every single step of the loop — not just when left moves?`
      },
      { role: 'user', html: `number of zeros &lt;= k at every moment in [left, right]` },
      { role: 'coach', html: `Correct. That's the invariant. <strong>Gate 4 Part B</strong>: why does this loop always terminate?` }
    ],
    narrator: 'Three rounds. First attempt describes a role, not a guarantee. Second attempt describes a transition. Third attempt hits it: "zeros ≤ k at every moment." The coach never says what the invariant is — it asks about zeros, gives the student the vocabulary, and lets them state it.'
  },

  // ── SLIDE 07 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 07 — Gates 4B + 4C: termination and bounds',
    exchanges: [
      { role: 'user', html:
        `when right reaches nums.size(), we cant do right++ and moving left just decreases the window size.<br>So stop it there.`
      },
      { role: 'coach', html:
        `That tells me when you stop — not why you're guaranteed to make progress. Which pointer moves unconditionally on every iteration?`
      },
      { role: 'user', html: `right always makes progress and cant go past array len` },
      { role: 'coach', html:
        `Correct. <strong>Gate 4 Part C</strong>: state your loop termination condition and justify why that exact bound is correct — what breaks if you change it by one?`
      },
      { role: 'user', html:
        `loop condition would be right == nums.size(). nums[nums.size()] doesnt exist so before that we gotta terminate,<br>if i wait for the +1 to happen then memory access error`
      },
      { role: 'coach', html:
        `Good. One more thing: state your indexing scheme explicitly — 0-indexed or 1-indexed — and confirm your loop bound matches it.`
      },
      { role: 'user', html:
        `0 indexed, right++ happens and then the char is checked in the next iteration. So checking right==nums.size() is enough`
      },
      { role: 'coach', html:
        `Correct. <strong>Gate 4 Part D</strong>: trace your algorithm on <code>nums = [1,1,1,1,1], k = 2</code> — what does it return?`
      }
    ],
    narrator: 'Part B takes two rounds — the user first describes the stopping condition, not the progress guarantee. The coach redirects to "which pointer moves unconditionally." Part C and the indexing check close cleanly.'
  },

  // ── SLIDE 08 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 08 — Gate 4D: three edge cases + "No." three times',
    exchanges: [
      { role: 'user', html: `[1] [11] [111] [1111] [11111] still no budget used<br>right goes beyond limit and stops` },
      { role: 'coach', html: `What does it return?` },
      { role: 'user', html: `5` },
      { role: 'coach', html: `Correct. Now trace <code>nums = [0,0,0], k = 1</code> — what does it return?` },
      { role: 'user', html:
        `[0] -&gt; flip to 1 [1]<br>
now right goes ahead to find 1s<br>
[10] but we dont have a flip. move left = last flip index + 1<br>
left = 0+1 = 1, right still at 1<br>
[0] changed to [1]<br>
[1]<br>
[10] again same process<br>
both left and right at index 2<br>
then right moves ahead and stops<br><br>
returns 1`
      },
      { role: 'coach', html: `Correct. Now trace <code>nums = [0,0,0,0,0], k = 5</code> — what does it return?` },
      { role: 'user', html:
        `[0] -&gt; [1]<br>
[10] -&gt; [11]<br>
[110] -&gt; [111]<br>
[1110] -&gt; [1111]<br>
[11110] -&gt; [11111]<br>
right reaches end. stop.<br>
answer 5`
      },
      { role: 'coach', html: `Correct. All edge cases hold. Go write the code.` },
      { role: 'user', html: `can you write it for me?` },
      { role: 'coach', html: `No.` },
      { role: 'user', html: `just a little.. pls` },
      { role: 'coach', html: `No. You traced it perfectly. You know exactly what to write. Go.` },
      { role: 'user', html: `hint?` },
      { role: 'coach', html: `No. You have everything you need. Write it.` }
    ],
    narrator: '"No." Three times. Rule 0: never write algorithmic code. Gate 4 is closed — the invariant is proved, the edge cases are traced, the bounds are justified. The student has everything. The coach does not soften.'
  },

  // ── SLIDE 09 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 09 — bug 1: typing (double-increment)',
    exchanges: [
      { role: 'user', html: `wrong at <code>[0,0,1,1,1,0,0]</code> and k=0` },
      { role: 'coach', html: `What does your algorithm return, and what's the correct answer?` },
      { role: 'user', html: `returned 4, actual 3` },
      { role: 'coach', html: `Don't touch the code. At which step does your invariant first break?` },
      { role: 'user', html:
        `the very first<br>
[left, right] is [0, 0] now but inclusive so that has subarray [0] and this is not all 1s and budget was 0 too`
      },
      { role: 'coach', html:
        `Good — you found it. At initialization, your window already violates the invariant. What needs to change about how you initialize or what you check before updating max?`
      },
      { role: 'user', html: `I only update max when nums[right] == 1 or it was 0 AND i had a flip available. already doing these` },
      { role: 'coach', html:
        `Trace it step by step with <code>[0,0,1,1,1,0,0], k=0</code>. Walk me through each step — what are left, right, flips_used, and max after each move?`
      },
      { role: 'user', html:
        `Code so you know what I am tracing:<br>
<pre>// (shown in code panel →)</pre>
[0] -&gt; nothing in queue and no flip available. k=0 detected. left = right + 1 and right ++ so now left = right = 1<br>
[0] again same. change left = right = 2<br>
[1] -&gt; finally a 1. Max updated. right++<br>
[11] -&gt; another 1. max updated to 2. right++<br>
[111] -&gt; another 1. max updated to 3. right++<br>
[1110] -&gt; a 0.. now we cant handle this. left = right + 1<br>
[0]<br>
[0]<br>
end`
      },
      { role: 'coach', html:
        `Typing bug. In your else-else branch you do <code>right++</code> and then <code>continue</code> — but the <code>for</code> loop already does <code>right++</code>. You're double-incrementing. Remove the <code>right++</code> from inside that branch.`
      }
    ],
    narrator: 'Class 2 — typing bug. The coach read the code silently once, classified it, and pointed it out directly. No Socratic dance for a typo — that wastes time and erodes trust. One line, one fix. The student\'s trace actually confirmed the invariant held until the double-increment skipped index 1.'
  },

  // ── SLIDE 10 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 10 — bug 2: thinking (missing push)',
    exchanges: [
      { role: 'user', html:
        `OHHHHHHHHHH thank you<br>
but another problem at<br>
<code>[1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,0,1,1,0,1,1]</code> k=8<br>
expected 25 output 21`
      },
      { role: 'coach', html: `Don't show me code changes. At which step does your invariant first break?` },
      { role: 'user', html: `too long to trace :(` },
      { role: 'coach', html: `Pick a simpler case that also fails. Try <code>[1,0,1,0,1], k=1</code> — what does your code return?` },
      { role: 'user', html: `correct answer 3` },
      { role: 'coach', html: `What does your code return?` },
      { role: 'user', html: `3` },
      { role: 'coach', html: `Good. Try <code>[0,0,1,1,1,0,0], k=2</code> — what does your code return and what's the correct answer?` },
      { role: 'user', html: `all are fine. correct and expected are the same. maybe i need to trace this long thing` },
      { role: 'coach', html: `Try <code>[0,0,0,0,0,1,1,1,1,1,1], k=2</code> — what does your code return and what's the correct answer?` },
      { role: 'user', html: `OH WOW! failed. expected 8, got 6` },
      { role: 'coach', html: `Don't touch the code. At which step does your invariant first break?` },
      { role: 'user', html:
        `Huh? needs atleast 5 zeroes to fail..<br>
I constructed an even more minimal one <code>[0,0,0,0,0,1]</code> at k=2. expected 3, outputs 2. I will trace this<br><br>
[0] -&gt; used flips &lt; 2. so we can flip<br>
[1] but used flips = 1 and queue=[0]. max = 1<br>
[10] -&gt; use flip again. used flips = 2, queue = [0,1], max = 2<br>
became [11]<br>
now [110] but no flips available. pop queue and left = 0+1=1, and use the flip on the right.<br>
became [11] with left = 1 and right = 2, max 2<br>
right++<br>
[110] again same process. left = 2, right = 3, max 2 -&gt; [11]<br>
then [110] same process. left=3 right=4 -&gt; [11]<br>
then [111], good! left=3 right=5. max should be 3 here but somehow it didnt.. maybe i should track the queue<br>
queue became {1} after first pop BUT I DIDNT ADD THE RIGHT IN!<br><br>
<strong>OHHHHHHHHHH I FORGOT TO PUSH RIGHT!</strong><br><br>
thank you!! beats 100%`
      }
    ],
    narrator: 'Class 3 — thinking bug. The coach never touches the code. It guides the student toward a minimal failing case, then asks about the invariant. The student finds the missing push themselves by tracing [0,0,0,0,0,1] step by step and watching the queue go wrong. "You found it yourself. That\'s the one that matters."'
  },

  // ── SLIDE 11 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 11 — the invariant card',
    exchanges: [
      { role: 'coach', html:
        `You found it yourself. That's the one that matters.<br><br>Now close it out — write the Invariant Card.<br><br>
<pre>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVARIANT CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM      : Max Consecutive Ones III (LeetCode #1004)
TYPE         : sliding-window-variable

SLOW POINTER : left — at every moment,
               [left, right] contains at most k zeros
FAST POINTER : right — scans forward
               unconditionally; expands the window
TERMINATION  : right == nums.size();
               max window seen is the answer

EDGE CASE    : all zeros with k=0 → returns 1 ✓
               all ones            → right sweeps to end ✓
               all zeros with k=n  → returns n ✓

EARNED       : 2026-05-22
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</pre>
Save it. You earned it.`
      }
    ],
    narrator: 'The card is issued. The invariant is in writing, with the edge cases that were actually traced — not assumed. Edge cases that were not traced do not appear on the card. This is the proof the student earned, not a summary of the problem.'
  },

  // ── SLIDE 12 ─────────────────────────────────────────────────────────────
  {
    label: '// slide 12 — post-card: final code + observations',
    exchanges: [
      { role: 'user', html:
        `final code btw. how good is it<br><br>
<pre>// (full accepted code shown in code panel →)</pre>`
      },
      { role: 'coach', html:
        `It works and beats 100% — that's real. Two observations for after the card:<br><br>
1. The <code>queue&lt;int&gt;</code> is doing extra work. You only ever need <code>flip_idx.front()</code> — you never look at any other element. What simpler data structure holds exactly that?<br><br>
2. The <code>else { if { } else { } }</code> nesting is deep. Can you flatten it?<br><br>
But those are polish. The algorithm is correct and the invariant holds. Session's done.`
      },
      { role: 'user', html:
        `just give it to me, session is over. i could just use a standard array yes and have a pointer that iterates over it and never deletes.<br>Then nesting can be flattened with an elseif`
      },
      { role: 'coach', html:
        `Close — not an array with a pointer. Think smaller. You only need one piece of information: the index of the oldest flip. What holds exactly one integer?`
      },
      { role: 'user', html:
        `an int container?<br>
But suppose i flip index 3, then 5, then 8<br>
then container stores 3. when i reach an index 10 that has a 0 and k was 3 then i use the index 3 but then where else do i recover 5? i need to move left one by one rather than a big jump to get to that next element wasting time and its no longer exactly n. Sure 2n is O(n) but i am making some savings.`
      },
      { role: 'coach', html:
        `You're right — the queue is correct here. Keep it.<br><br>Flatten the nesting and you're done.`
      }
    ],
    narrator: 'Post-card protocol: the solution is optimal for this approach. The coach offers two polish observations — neither is blocking. The student pushes back on the data structure question with a real argument, and wins the point. Session closed.'
  }

];

// ─── Visualization frames (one per slide, 12 total) ───────────────────────
const VIZ_FRAMES = [
  // slide 01
  { array: MAIN,  k: 2, left: -1, right: -1, zeros: -1, maxLen: -1,
    status: 'pending', note: 'Problem received. Gate 1 starts immediately.' },
  // slide 02
  { array: MAIN,  k: 2, left: -1, right: -1, zeros: -1, maxLen: -1,
    status: 'pending', note: 'Budget: O(n log n) or better. Starting hand trace.' },
  // slide 03
  { array: MAIN,  k: 2, left: 0, right: 4, zeros: 2, maxLen: 5,
    status: 'wrong', note: 'User\'s trace: window [0,4] with 2 flips → length 5. Answer is 6. Missed window [4,9].' },
  // slide 04
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Insight: flip both 0s at indices 4+5 → window [4,9] = length 6.' },
  // slide 05
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'State to carry: earliest flip index + flips used count. Gate 4 opens.' },
  // slide 06
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Invariant: zeros in [left, right] ≤ k at every moment. Not just when max updates.' },
  // slide 07
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Liveness: right advances unconditionally. Bound: right < nums.size(). 0-indexed.' },
  // slide 08
  { array: MAIN,  k: 2, left: 0, right: 4, zeros: 0, maxLen: 5,
    status: 'correct', note: 'Edge cases: [1,1,1,1,1]→5 ✓  [0,0,0] k=1→1 ✓  [0,0,0,0,0] k=5→5 ✓. Gate 4 complete.' },
  // slide 09
  { array: FAIL1, k: 0, left: 1, right: 4, zeros: 0, maxLen: 4,
    status: 'wrong', note: 'Bug: right++ doubled. Window [1,4] includes nums[1]=0. Invariant broken at step 1.' },
  // slide 10
  { array: FAIL2, k: 2, left: 3, right: 4, zeros: 2, maxLen: 2,
    status: 'wrong', note: 'Bug: forgot flip_idx.push(right) after pop. Queue loses track. Window stuck at 2, correct is 3.' },
  // slide 11
  { array: MAIN,  k: 2, left: 4, right: 9, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Both bugs fixed. beats 100%. Card earned.' },
  // slide 12
  { array: MAIN,  k: 2, left: 5, right: 10, zeros: 2, maxLen: 6,
    status: 'correct', note: 'Post-card: queue is correct. Flatten the nesting. Session done.' }
];

// ─── DOM refs ──────────────────────────────────────────────────────────────
const overlay       = document.getElementById('demo-overlay');
const exchangesWrap = document.getElementById('exchanges-wrap');
const exchangesEl   = document.getElementById('exchanges');
const labelEl       = document.getElementById('slide-label');
const narratorEl    = document.getElementById('narrator-text');
const counterEl     = document.getElementById('slide-counter');
const dotsEl        = document.getElementById('dots');
const prevBtn       = document.getElementById('prev-btn');
const nextBtn       = document.getElementById('next-btn');
const playBtn       = document.getElementById('play-demo-btn');
const playBtnNav    = document.getElementById('play-demo-btn-nav');
const closeBtn      = document.getElementById('close-demo');
const vizPanelEl    = document.getElementById('viz-panel');
const codeContentEl = document.getElementById('code-content');
const approachEl    = document.getElementById('approach-badge');

let current = 0;

// ─── Render viz ────────────────────────────────────────────────────────────
function renderViz(frame) {
  const { array, k, left, right, zeros, maxLen, status, note } = frame;

  approachEl.className = 'approach-badge ' + status;
  approachEl.textContent =
    status === 'correct' ? '✓  CORRECT APPROACH' :
    status === 'wrong'   ? '✗  WRONG APPROACH'   :
                           '◌  TRACING...';

  const cells = array.map((val, i) => {
    const inWin = left >= 0 && right >= 0 && i >= left && i <= right;
    const cls = ['arr-cell', inWin ? 'in-win' : '', inWin && val === 0 ? 'is-zero' : '']
                .filter(Boolean).join(' ');
    return `<div class="${cls}">${val}</div>`;
  }).join('');

  const ptrs = array.map((_, i) => {
    let inner = '';
    if (left >= 0 && right >= 0) {
      if      (i === left && i === right) inner = '<span class="ptr-lr">L=R</span>';
      else if (i === left)                inner = '<span class="ptr-l">L</span>';
      else if (i === right)               inner = '<span class="ptr-r">R</span>';
    }
    return `<div class="ptr-cell">${inner}</div>`;
  }).join('');

  const showVars = zeros >= 0 && maxLen >= 0;

  vizPanelEl.innerHTML =
    `<div class="arr-row">${cells}</div>` +
    `<div class="ptr-row">${ptrs}</div>` +
    (showVars
      ? `<div class="viz-vars">
           <span class="viz-var">k<em>${k}</em></span>
           <span class="viz-var">zeros<em>${zeros}</em></span>
           <span class="viz-var">maxLen<em>${maxLen}</em></span>
         </div>`
      : '') +
    `<div class="viz-note">${note}</div>`;
}

// ─── Render code ───────────────────────────────────────────────────────────
function renderCode(idx) {
  const vkey = CODE_PER_SLIDE[idx];
  if (!vkey) {
    codeContentEl.className = 'code-placeholder';
    codeContentEl.innerHTML = '// code appears after Gate 4 clears';
    return;
  }
  const { code, bugLines, goodLines } = CODE_VERSIONS[vkey];
  codeContentEl.className = '';
  const highlighted = syntaxHL(code).split('\n');
  const okLines = goodLines || [];
  codeContentEl.innerHTML = highlighted.map((line, i) =>
    `<span class="code-line${bugLines.includes(i) ? ' bug' : ''}${okLines.includes(i) ? ' good' : ''}">${line}</span>`
  ).join('');
}

// ─── Render slide ──────────────────────────────────────────────────────────
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
if (playBtnNav) playBtnNav.addEventListener('click', openDemo);
closeBtn.addEventListener('click', closeDemo);
overlay.addEventListener('click', e => { if (e.target === overlay) closeDemo(); });
