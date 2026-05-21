# Pointer Patterns

Five canonical patterns. For each: how to recognize it, the invariant template, the classic problem, the most common wrong invariant, and the question that breaks it.

This file is for the coach's reference — not for reciting to users. Use it to know what a correct Gate 4 answer sounds like, and to recognize when an answer is close but imprecise.

---

## Pattern 1 — Fast/Slow Same Direction

**Signature:** Two pointers both start at the left. Slow advances only when a condition is met. Fast advances every step. Slow pointer defines a boundary.

**Invariant template:** "Everything at indices 0 through slow-1 satisfies [condition]. slow is the next position to write."

**Classic problems:** Remove Element, Remove Duplicates from Sorted Array, Move Zeroes

**Most common wrong invariant:** "Slow tracks where I'm writing next."
That's a role description, not an invariant. It says nothing about what the written values are.

**Question that breaks it:** "What do you know about the *contents* at indices 0 through slow-1 — not where slow is pointing, but what's actually stored there?"

**What a correct answer sounds like:**
- Remove Element: "Every element at index < slow is not equal to val."
- Remove Duplicates: "Every element at index < slow is unique and in sorted order."
- Move Zeroes: "Every element at index < slow is non-zero."

**Loop bound to probe:** Fast accesses `arr[fast]` in a 0-indexed array of size n. Ask: "On the last iteration, fast = n-1. Does your loop body access any index beyond n-1?"

---

## Pattern 2 — Opposite-End Two-Pointer

**Signature:** Left starts at index 0, right starts at the last index. They converge toward each other. Stop when they meet or cross.

**Invariant template:** "The answer, if it exists, lies within [left, right]. Everything outside has been eliminated."

**Classic problems:** Two Sum (sorted array), Valid Palindrome, Container With Most Water, Reverse a String

**Most common wrong invariant:** "Left moves right when the sum is too small, right moves left when too big."
That's the transition rule. The invariant is what those moves preserve.

**Question that breaks it:** "After you move left forward, what have you guaranteed about all pairs that include the old left index?"

**What a correct answer sounds like:**
- Two Sum sorted: "Every pair that could produce the target sum is within [left, right]. Pairs with indices outside have been proven impossible."
- Valid Palindrome: "Characters at indices left through right form the unchecked middle. Everything outside already matched."

**Edge case to always probe:** What happens when left == right? When the array has two elements?

**Loop bound to probe:** Loop runs `while left < right`. Ask: "When left == right, should you process that iteration? What does your invariant say about a window of size 1?"

**1-indexing trap:** Codeforces problems often give 1-indexed input. If the user initializes `right = n` instead of `n-1`, ask: "Is your array stored at indices 0 through n-1 or 1 through n? What sits at index 0 in your implementation?"

---

## Pattern 3 — Sliding Window (Fixed Size)

**Signature:** Window of exactly k elements moves through the array. Typically tracking a sum, max, or frequency count.

**Invariant template:** "The window [left, right] always contains exactly k elements. The current tracked value reflects exactly those k elements."

**Classic problems:** Maximum Average Subarray I, Find All Anagrams in String, Permutation in String

**Most common wrong invariant:** "I add the new element and remove the old one."
That's the update step. The invariant is what stays true after every update.

**Question that breaks it:** "After you slide the window, what is the exact relationship between your tracked value and the current window contents?"

**What a correct answer sounds like:**
- Max average: "The sum variable always equals the sum of exactly the k elements from left to right. The window always has exactly k elements."

**Edge case to always probe:** What happens at the first window (before the first slide)? What if k equals the array length?

**Loop bound to probe:** The last valid window starts at index `n-k`. Ask: "What is the last valid starting index for a window of size k in an array of size n? Is that n-k or n-k-1? Justify it."

---

## Pattern 4 — Sliding Window (Variable Size)

**Signature:** Window expands by advancing right. Window shrinks by advancing left when a condition is violated. Answer is typically the max or min valid window size.

**Invariant template:** "The window [left, right] always satisfies [condition]. When right advances and violates it, left advances until [condition] holds again."

**Classic problems:** Longest Substring Without Repeating Characters, Minimum Window Substring, Longest Subarray with Sum ≤ k

**Most common wrong invariant:** "Left chases right when there's a duplicate." 
That's mechanism, not invariant. Doesn't state what the window contains after the chase.

**Question that breaks it:** "After left finishes moving, before right moves again — what is guaranteed about every element in the current window?"

**What a correct answer sounds like:**
- Longest Substring: "All characters between left and right inclusive are unique, at every moment."
- Minimum Window: "The window either satisfies the condition or we are in the process of finding the minimum that does."

**The subtle trap in variable windows:** The invariant must hold *after* shrinking, not just before. Many users state an invariant that's true when expanding but temporarily false during shrinking. Probe this explicitly: "Is the invariant true *while* left is moving, or only *after* it stops?"

**The stale-entry trap (Longest Substring specifically):** When using a map to track last-seen index of each character, the stored index can be stale — pointing to a position before the current left. If left jumps to `map[char] + 1` without checking `map[char] >= left`, it can jump backward. Ask: "When you find a repeat at index right, is the stored position of that character guaranteed to be inside your current window?"

**Loop bound to probe:** Right runs `right < n`. Ask: "Does your inner while loop ever access `arr[left-1]`? What is left when the window shrinks to size 1?"

---

## Pattern 5 — Partition Pointer

**Signature:** Single pointer divides array into two regions in-place. Elements are swapped to the correct region. Classic in quicksort partition, but appears standalone.

**Invariant template:** "Everything at index < boundary satisfies [condition A]. Everything at index ≥ boundary and < current satisfies [condition B]. Current and beyond are unprocessed."

**Classic problems:** Sort Colors (Dutch National Flag), Partition Array by Parity, Segregate 0s and 1s

**Most common wrong invariant:** "I put small elements on the left."
Doesn't specify where the boundary is or what "processed" means.

**Question that breaks it:** "At this exact moment, what region does index boundary-1 belong to? What about index current?"

**What a correct answer sounds like:**
- Sort Colors: "Indices 0 through low-1 contain only 0s. Indices low through mid-1 contain only 1s. Indices high+1 through end contain only 2s. Indices mid through high are unprocessed."

**Why this pattern is hardest:** Three regions instead of two. The invariant has three clauses. Users typically state two correctly and forget the third. Always ask: "What about the region between your two pointers?"

**Loop bound to probe:** For Dutch National Flag, loop runs `while mid <= high`. Ask: "When mid == high, do you process that element? What does your invariant say about index high — is it processed or unprocessed?"

---

## Recognizing Out-of-Scope Problems

Use this to quickly identify when to invoke Rule 5.

| Problem type | Signal | Response |
|---|---|---|
| DP | "how many ways", "minimum cost", overlapping subproblems | Out of scope — looks like DP |
| Graph | "shortest path", "connected components", grid with neighbors | Out of scope — looks like graph |
| Binary search | sorted array, "find the minimum X such that..." | May be out of scope — check if a pointer invariant is the core insight or just a binary search |
| Pure greedy | no pointer, just a mathematical observation | Out of scope — looks like greedy/math |
| Two-pointer + another concept | e.g., two-pointer on a sorted array to count pairs | In scope if the invariant is the core of the solution |

When in doubt: if you cannot state a loop invariant that is the *reason* the algorithm works, the problem is probably out of scope.

---

## Gate 5 — Four Structural Fault Classes

When code fails, map the failure to one of these before asking the diagnostic question. Do not suggest the fix — the fix follows from identifying the violation.

---

### Fault Class 1 — Shrink Slippage

**Definition:** The window shrinks (left advances), but the invariant is not fully restored. The shrink loop exits too early.

**Root cause:** Using `if` instead of `while` for the shrink condition, or shrinking by a fixed amount instead of shrinking until the condition holds.

**Symptom:** Passes most test cases. Fails on inputs where a single violation requires left to move more than once — e.g., `"abba"` where removing the first repeat still leaves another.

**Diagnostic question:** "After left moves once, is your invariant guaranteed to hold? Or could it still be violated? What input would require left to move more than once?"

---

### Fault Class 2 — Greedy Overflow

**Definition:** The fast/right pointer advances past a position that should have triggered a boundary update. The check happens after the advance instead of before, or the advance condition is too permissive.

**Symptom:** Works on given examples. Fails on inputs where the critical element appears at the exact position the advance happens — an off-by-one in check order.

**Diagnostic question:** "Does your pointer check the condition before advancing or after? What is the state of the window at the exact moment of advance? Does your invariant hold at that moment?"

---

### Fault Class 3 — Duplicate Stride

**Definition:** The map/set is updated before the window is adjusted, so the old position is overwritten before left can use it to move forward.

**Root cause:** In character frequency maps, writing `map[char] = right` before adjusting left means the stale position is lost. Left can no longer correctly move past the old occurrence.

**Symptom:** Wrong answer on inputs with repeated characters appearing more than twice. `"abcabcbb"` may pass, `"abba"` fails.

**Diagnostic question:** "When you find a duplicate at index right, in what order do you: check the map, update left, update the map? What is `map[s[right]]` pointing to at each step in that sequence?"

---

### Fault Class 4 — Empty Boundary Crash

**Definition:** The invariant is not established for degenerate inputs: empty array, single element, all-same elements, or k equals n.

**Root cause:** Initialization assumes at least two elements, or the return value assumes at least one valid window existed.

**Symptom:** Accepted on standard test cases. Wrong answer or runtime error on the hidden edge case — typically empty string or single character.

**Diagnostic question:** "What does your code return for an empty input? Walk through it — does left ever move? Does right enter the loop? What does `right - left + 1` equal before any iteration?"

**Connection to Gate 4 Part C:** Empty Boundary Crash is almost always traceable to a loop bound that assumes n ≥ 1, or an access to `arr[i+1]` when i could equal n-1. If the user justified their bounds from the invariant at Gate 4, this crash cannot happen silently.

---

## Loop Bound Quick Reference

Coach reference. When a user writes an unsafe bound, ask: "What is the maximum index your loop body accesses? Is that index within your array?"

| Access pattern inside loop | Safe bound | Unsafe bound | Why |
|---|---|---|---|
| `arr[i]` only | `i < n` | `i <= n` | `arr[n]` is out of bounds |
| `arr[i]` and `arr[i+1]` | `i < n-1` | `i < n` | last iteration accesses `arr[n]` |
| `arr[i]` and `arr[i-1]` | start at `i=1` | start at `i=0` | first iteration accesses `arr[-1]` |
| 1-indexed arr[1..n], access `arr[i]` | `i <= n` | `i < n` | misses last element |
| 1-indexed arr[1..n], access `arr[i+1]` | `i < n` | `i <= n` | last iteration accesses `arr[n+1]` |

Note on C++ silent failures: accessing `arr[n]` in C++ often does not crash — adjacent memory is usually allocated. The bug produces wrong answers on specific inputs, not a segfault. This is why the loop bound must be *derived from the invariant* at Gate 4, not guessed.
