# Pointer Invariant Coach

A coaching system for competitive programmers who write two-pointer and sliding window solutions by feel — and get bitten by bugs they can't explain.

Landing page: https://quantum-codes.github.io/pointer-invariant-coach/

---

## What You Get

Every session ends with this:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVARIANT CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM      : Longest Substring Without Repeating Characters (LeetCode #3)
TYPE         : sliding-window-variable

SLOW POINTER : left — all characters in [left, right] are unique at every moment
FAST POINTER : right — scanner; advances one step per iteration regardless
TERMINATION  : right == s.size(); maxLen holds the longest valid window seen

EDGE CASE    : empty string → returns 0 ✓  single char → returns 1 ✓  all same → max stays 1 ✓

EARNED       : 2026-05-21
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

You don't get this by asking for it. You get it by proving the invariant yourself. Save every card. Over time they become a library of patterns you actually understand — not patterns you memorized from editorials.

---

## What This Coach Does

It does not explain. It does not give hints. It does not tell you the invariant.

It asks you five questions, in order, and refuses to move forward until you can answer each one correctly. When your code has a bug, it doesn't read the code — it asks you where your invariant breaks.

This is what coaching looks like. A coach that explains is a textbook.

> **Unlike ChatGPT, which will hand you the algorithm if you push, this coach won't — even if you beg.**

---

## Setup (60 seconds)

1. Clone or download this folder.
2. Open claude.ai → New Project. (Claude Code users: point it at this folder instead.)
3. Upload all `.md` files — root level and everything inside `reference/` — into the Project's knowledge base.
4. Open a new chat in that project.
5. Paste a problem — LeetCode/Codeforces link, or the problem statement as text (preferred) — into the chat.
6. The coach starts Gate 1 immediately.

That's it. No configuration. No prompt needed. Paste the problem and the session begins.

**Claude can read LeetCode and most Codeforces links directly.** If a link doesn't load, paste the problem text instead.  
The Sonnet 4.6 model is sufficient (medium effort mode if claudecode) for the coach.

---

## The Five Gates

Every session follows this path. You cannot skip a gate.

```
              PASTE PROBLEM
                   │
                   ▼
┌─────────────────────────────────────┐
│ GATE 1 — Problem Understanding      │
│ "What is this problem actually      │
│  asking, in one sentence?"          │
└──────────────────┬──────────────────┘
                   │ cleared
                   ▼
┌─────────────────────────────────────┐
│ GATE 2 — Constraints                │
│ "What complexity can you afford?    │
│  What does that rule out?"          │
└──────────────────┬──────────────────┘
                   │ cleared
                   ▼
┌─────────────────────────────────────┐
│ GATE 3 — Manual Trace               │
│ "Walk through the first example.    │
│  Where is each pointer after        │
│  every element?"                    │
└──────────────────┬──────────────────┘
                   │ cleared
                   ▼
┌─────────────────────────────────────┐
│ GATE 4 — Invariant Statement        │
│ "Before any code: what is true      │
│  about everything to the left of    │
│  your slow pointer at every single  │
│  moment during the loop?"           │
└──────────────────┬──────────────────┘
                   │ cleared → write code
                   ▼
┌─────────────────────────────────────┐
│ GATE 5 — Verification (if bug)      │
│ "At which step does your            │
│  invariant first break?"            │
└──────────────────┬──────────────────┘
                   │ cleared
                   ▼
             INVARIANT CARD
```

---

## What's In Scope

**In scope:**
- Fast/slow pointer (Remove Element, Remove Duplicates, Move Zeroes)
- Opposite-end two-pointer (Two Sum sorted, Valid Palindrome, Container With Most Water)
- Sliding window fixed size (Max Average Subarray, Find All Anagrams)
- Sliding window variable size (Longest Substring, Minimum Window Substring)
- Partition pointer (Sort Colors, Segregate by parity)

**Out of scope:**
- Dynamic programming
- Graph problems (BFS, DFS, shortest path)
- Tree traversals
- Divide and conquer
- Pure math/greedy with no pointer invariant

If you paste an out-of-scope problem, the coach will tell you what algorithm family it looks like and stop. This is not a general CP coach. Specificity is the point.  
You can even ask the coach to suggest a problem within scope. 

---

## Who This Is For

Competitive programmers who:
- Know implementation but aren't able to think algorithmically about pointer problems
- Write two-pointer solutions based on pattern recognition rather than proof
- Get off-by-one errors on edge cases they can't explain
- Pass 90% of test cases and fail on empty arrays or single elements

If you've ever written `while (left < right)` and not been able to state exactly what that condition preserves — this coach is for you.

---

## Files

| File | Job |
|---|---|
| `identity.md` | Who the coach is, what it handles, what it doesn't |
| `rules.md` | The five gates, the hard rules, the Invariant Card format |
| `examples.md` | One complete coaching arc — read this first |
| `reference/pointer-patterns.md` | Five canonical patterns with invariant templates and diagnostic questions |
| `README.md` | This file |
