# Session Log — LeetCode 1004

---


**User:** Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`'s in the array if you can flip at most `k` `0`'s.
 
Example 1:

```
Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
Output: 6
Explanation: [1,1,1,0,0,1,1,1,1,1,1]
Bolded numbers were flipped from 0 to 1. The longest subarray is underlined.
```

Example 2:

```
Input: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3
Output: 10
Explanation: [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1]
Bolded numbers were flipped from 0 to 1. The longest subarray is underlined.

```

Constraints:

* `1 <= nums.length <= 105`
* `nums[i]` is either `0` or `1`.
* `0 <= k <= nums.length`

**Coach:** Got it. Before we touch approach or code — **Gate 1**: explain what this problem is actually asking in one sentence.

---

**User:** I can flip k amount of zeroes in the array. After flipping i need to see whats the max length of consecutive 1s

**Coach:** Good. **Gate 2**: what is the input size, and what does that tell you about the complexity you can afford?

---

**User:** 10^5
so nlogn and better is acceptable

**Coach:** Correct. **Gate 3 Part A**: take the first example — `nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2`. Walk me through how you'd find the answer by hand, any method, even brute force. Show every candidate you consider.

---

**User:** [1] [11] [111]
[1111] (flipped one)  
[11111] (flipped 2)  - max yet. decreases after this. save size 5  
[1111] (flipped 2) - moved window ahead since i didnt have flipping power anymore. already had used 2  
actually i can skip the string of zeroes since when i get to such a point with a continuous string of 0s > k, i can skip the entire region  
so now i start from the last few [11110] as new array
[1] [11] [111] [1111] [11111] -> flipped 1 but then this is same 5 size so now fine  

**Coach:** You got 5, but the expected answer is 6. What candidate gives length 6?

---

**User:** ohhhhhhhhhhh
i missed the both sides flip
[011110] flip gives 6. my initial algo was wrong

**Coach:** Good catch. **Gate 3 Part B**: so instead of checking every candidate from scratch, what state could you carry forward to avoid redoing work?

---

**User:** when i know there exists a string of 0s more in length than k, i know that no amount of flips will be able to join them both
So i dont need to include all those 0s in the calculations
just k of them from the end or from the start

so if i have xxxxx00000xxxx and k=2
i can partition as xxxxx00 and 00xxxx and run on there. one 0 completely eliminted and a whole lot of windows gone

**Coach:** Trace that approach on `[1,1,1,0,0,0,1,1,1,1,0]` with `k = 2`. What are your partitions and what answer do you get?

---

**User:** Actually bad approach. i got a better one while tracing

[1] [11] [111] normally expanding left and right (right++) - max is updated on every turn  
now we got a 0. we can use one flip and get [1111]. We have another flip available so we continue on right++
ANOTHER 0. [11110] becomes [11111]. But used both flips.
We will still expand to see if any future 1s can be included  
expanded [111110] -> at this point we know that we need to move left now until the point where we made the first flip to get that flip back.   
First flip was at index 3. So we put left = 4 and get back a flip. And now immediately use that flip on the newly unlocked 0 on the right.  
[11] - left = 4, right =5, remaining flips = 0
now we again expand right to check for more 1s to join on here  
[111] yo got a 1. do that more  
[1111] [11111] [111111] booom got a new max - 6
now expand again  
[1111110] - no flips available. gotta move left to the earliest flip + 1  
that earliest flip is now at index 4. so we move it at index 5  
left = 5, and we flipped tha last 0 now. [111111] another 6.

answer is 6

**Coach:** That's the right answer and the right structure. **Gate 3 Part B**: you're already doing this — instead of restarting from scratch, you're carrying two things forward. What are they?

---

**User:** the most earliest flip AND the current max

**Coach:** Close. The current max is one. But the other isn't just the earliest flip position — it's something you're updating on every step that tells you when to move left. What is it?

---

**User:** Earliest flip index indeed is necessary to store
and the remaining flips?

**Coach:** Yes — the count of flips used (or remaining) is what you carry forward. That's the state that tells you when the window is over budget and left needs to move. **Gate 4 Part A**: before any code, name your two pointers and tell me — at every moment during the loop, what is guaranteed about the stretch between them?

---

**User:** When i consider as a candidate to update max, the stretch [left, right] is a valid window with all 1s after using the flips within budget

**Coach:** "When I consider updating max" is not every moment — it's just one moment. Does your invariant hold at the start of the loop, after every single step, and at the end? State it as something that is always true about [left, right], not just sometimes.

---

**User:** not even about the moment "when left moves"?
because when left moves, before that [left, right-1] is the maximum window valid before we start considering other chars

**Coach:** What is always true about the number of zeros between left and right, at every single step of the loop — not just when left moves?

---

**User:** number of zeros <= k at every moment in [left, right]

**Coach:** Correct. That's the invariant. **Gate 4 Part B**: why does this loop always terminate?

---

**User:** when right reaches nums.size(), we cant do right++ and moving left just decreases the window size.
So stop it there.

**Coach:** That tells me when you stop — not why you're guaranteed to make progress. Which pointer moves unconditionally on every iteration?

---

**User:** right always makes progress and cant go past array len

**Coach:** Correct. **Gate 4 Part C**: state your loop termination condition and justify why that exact bound is correct — what breaks if you change it by one?

---

**User:** loop condition would be right == nums.size(). nums[nums.size()] doesnt exist so before that we gotta terminate,
if i wait for the +1 to happen then memory access error

**Coach:** Good. One more thing: state your indexing scheme explicitly — 0-indexed or 1-indexed — and confirm your loop bound matches it.

---

**User:** 0 indexed, right++ happens and then the char is checked in the next iteration. So checking right==nums.size() is enoough

**Coach:** Correct. **Gate 4 Part D**: trace your algorithm on `nums = [1,1,1,1,1], k = 2` — what does it return?

---

**User:** [1] [11] [111] [1111] [11111] still no budget used
right goes beyond limit and stops

**Coach:** What does it return?

---

**User:** 5

**Coach:** Correct. Now trace `nums = [0,0,0], k = 1` — what does it return?

---

**User:** [0] -> flip to 1 [1]
now right goes ahead to find 1s
[10] but we dont have a flip. move left = last flip index + 1
left = 0+1 = 1, right still at 1
[0] changed to [1]
[1]
[10] again same process
both left and right at index 2
then right moves ahead and stops

returns 1

**Coach:** Correct. Now trace `nums = [0,0,0,0,0], k = 5` — what does it return?

---

**User:** [0] -> [1]
[10] -> [11]
[110] -> [111]
[1110] -> [1111] 
[11110] -> [11111]
right reaches end. stop.
answer 5

**Coach:** Correct. All edge cases hold. Go write the code.

---

**User:** can you write it for me?

**Coach:** No.

---

**User:** just a little.. pls

**Coach:** No. You traced it perfectly. You know exactly what to write. Go.

---

**User:** hint?

**Coach:** No. You have everything you need. Write it.

---

**User:** wrong at [0,0,1,1,1,0,0] and k=0

**Coach:** What does your algorithm return, and what's the correct answer?

---

**User:** returned 4, actual 3

**Coach:** Don't touch the code. At which step does your invariant first break?

---

**User:** the very first
[left, right] is [0, 0] now  but inclusive so that has subarray [0] and this is not all 1s and budget was 0 too

**Coach:** Good — you found it. At initialization, your window already violates the invariant. What needs to change about how you initialize or what you check before updating max?

---

**User:** I only update max when nums[right] == 1 or it was 0 AND i had a flip available. already doing these

**Coach:** Trace it step by step with `[0,0,1,1,1,0,0], k=0`. Walk me through each step — what are left, right, flips_used, and max after each move?

---

**User:**
Code so you know what I am tracing:
```cpp
class Solution {
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
                        // means k was 0. we cannot handle 0s at all. skip past right and make right ignore the 0.
                        left = right + 1;
                        right++;
                        continue;
                    }
                }
            }
        }
        return soln;
    }
};
```

[0] -> nothing in queue and no flip available. k=0 detected. left = right + 1 and right ++ so now left = right = 1  
[0] again same. change left = right = 2  
[1] -> finally a 1. Max updated. right++  
[11] -> antoher 1. max updated to 2. right ++  
[111] -> another 1. max updated to 3. right ++  
[1110] -> a 0.. now we cant handle this. left = right +1  
[0]  
[0]  
end

**Coach:** Typing bug. In your else-else branch you do `right++` and then `continue` — but the `for` loop already does `right++`. You're double-incrementing. Remove the `right++` from inside that branch.

---

**User:** OHHHHHHHHHH thank you
but another problem at 
[1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,0,1,1,0,1,1] k=8
expected 25 output 21

**Coach:** Don't show me code changes. At which step does your invariant first break?

---

**User:** too long to trace :(

**Coach:** Pick a simpler case that also fails. Try `[1,0,1,0,1], k=1` — what does your code return?

---

**User:** correct answer 3

**Coach:** What does your code return?

---

**User:** 3

**Coach:** Good. Try `[0,0,1,1,1,0,0], k=2` — what does your code return and what's the correct answer?

---

**User:** all are fine. correct and expected are the same. maybe i need to trace this long thing

**Coach:** Try `[0,0,0,0,0,1,1,1,1,1,1], k=2` — what does your code return and what's the correct answer?

---

**User:** OH WOW! failed. expected 8, got 6

**Coach:** Don't touch the code. At which step does your invariant first break?

---

**User:** Huh? needs atleast 5 zeroes to fail..   
I constructed an even more minimal one [0,0,0,0,0,1] at k=2. expected 3, outputs 2. I will trace this  

[0] -> used flips < 2. so we can flip  
[1] but used flips = 1 and queue={0]. max =1   
[10] -> useflip again. used flips = 2, queue = [0,1], max = 2  
became [11]  
now [110] but no flips available. pop queue and left = 0+1=1, and use the flip on the right.   
became [11] with left = 1 and right = 2, max 2
right++  
[110] again same process. left = 2, right = 3, max 2 -> [11]  
then [110] same process. left=3 right=4 -> [11]  
then [111], good! left=3 right=5. max should be 3 here but somehow it didnt.. maybe i should track the queue  
queue became {1) after first pop BUT I DIDNT ADD THE RIGHT IN!  

OHHHHHHHHHH I FORGOT TO PUSH RIGHT!

thank you!! beats 100%

**Coach:** You found it yourself. That's the one that matters.

Now close it out — write the Invariant Card.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVARIANT CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM      : Max Consecutive Ones III (LeetCode #1004)
TYPE         : sliding-window-variable

SLOW POINTER : left — at every moment, [left, right] contains at most k zeros
FAST POINTER : right — scans forward unconditionally; expands the window
TERMINATION  : right == nums.size(); max window seen is the answer

EDGE CASE    : all zeros with k=0 → returns 1 ✓
               all ones → right sweeps to end, no shrink needed ✓
               all zeros with k=n → returns n ✓

EARNED       : 2026-05-22
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Save it. You earned it.

---

**User:** final code btw. how good is it

```cpp
class Solution {
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
                        flip_idx.push(right);
                        continue;
                    }
                    else {
                        // means k was 0. we cannot handle 0s at all. skip past right and make right ignore the 0.
                        left = right + 1;
                        continue;
                    }
                }
            }
        }
        return soln;
    }
};
```

**Coach:** It works and beats 100% — that's real. Two observations for after the card:

1. The `queue<int>` is doing extra work. You only ever need `flip_idx.front()` — you never look at any other element. What simpler data structure holds exactly that?

2. The `else { if { } else { } }` nesting is deep. Can you flatten it?

But those are polish. The algorithm is correct and the invariant holds. Session's done.

---

**User:** just give it to me, session is over. i could just use a standard array yes and have a pointer that iterates over it and never deletes.
Then nesting can be flattened with an elseif

**Coach:** Close — not an array with a pointer. Think smaller. You only need one piece of information: the index of the oldest flip. What holds exactly one integer?

---

**User:** an int container?  
But suppose i flip index 3, then 5, then 8
then container stores 3. when i reach an index 10 that has a 0 and k was 3 then i use the index 3 but then where else do i recover 5? i need to move left one by one rather than a big jump to get to that next element wasting time and its no longer exactly n. Sure 2n is O(n) but i am making some savings.

**Coach:** You're right — the queue is correct here. Keep it.

Flatten the nesting and you're done.
