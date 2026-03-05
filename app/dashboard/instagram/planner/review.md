## Summary

A well-structured, largely production-quality Next.js client component with good use of `useMemo`/`useCallback` throughout; several correctness bugs, one memory leak, a handful of accessibility gaps, and one stale-closure issue need addressing before shipping.

---

## Issues

### Correctness

- **[severity: high] Correctness — Memory leak in `handleGenerate` loading interval.**
  If the component unmounts while generation is in flight (user navigates away), `clearInterval` never runs because it only executes in the `finally` block of the still-pending async call. The interval keeps calling `setLoadingStep` on an unmounted component. Fix: track the interval ref with `useRef` and clear it on unmount via a cleanup in `useEffect`, or use an `AbortController` to cancel the fetch and skip state updates after unmount.

- **[severity: high] Correctness — `handleGenerate` can update state after unmount.**
  The same navigation-away scenario causes `setGenerating`, `setPlan`, `setError`, and `refreshBalance()` to fire after the component has been unmounted. Use a mounted-ref guard (`const mounted = useRef(true)`) and check it before every state update inside the async block.

- **[severity: major] Correctness — Calendar `onClick` passes a possibly-stale `cell.post` reference.**
  At line 1269:
  ```tsx
  onClick={() => setSelectedPost(cell.post)}
  ```
  `calendarCells` is derived from `filteredPosts` (not all posts), so if a filter is active when the user opens a post and then clears the filter without closing the panel, `selectedPost` holds the old reference while `plan.posts` may have a newer version (e.g. after `handleRegeneratePost`). The regenerate handler correctly updates `selectedPost` on line 1528, so this only becomes wrong if `plan.posts` is mutated by regeneration while the panel is open and the calendar is still showing the old `cell` snapshot. Low likelihood in practice but worth fixing by always looking up by `id`: `setSelectedPost(plan.posts.find(p => p.id === cell.post!.id) ?? cell.post)`.

- **[severity: major] Correctness — `addCustomPillar` reads `formData.contentPillars` from the closure, not from state.**
  ```ts
  const addCustomPillar = useCallback(() => {
    const trimmed = pillarInput.trim()
    if (trimmed && !formData.contentPillars.includes(trimmed) && formData.contentPillars.length < 5) {
  ```
  `formData` is captured in the closure at the time `addCustomPillar` was memoised. Between two rapid calls the duplicate-check can pass twice for the same value. The guard inside `togglePillar` correctly uses the functional updater (`setFormData(prev => ...)`); `addCustomPillar` should do the same:
  ```ts
  setFormData((prev) => {
    const trimmed = pillarInput.trim()
    if (!trimmed || prev.contentPillars.includes(trimmed) || prev.contentPillars.length >= 5) return prev
    return { ...prev, contentPillars: [...prev.contentPillars, trimmed] }
  })
  setPillarInput("")
  ```

- **[severity: major] Correctness — `handleGenerate` reads `tokenBalance` from closure; stale token check.**
  `tokenBalance` is in the dependency array so the callback does re-create when balance changes, which is correct. However there is a TOCTOU gap: between the check on line 451 and the actual API call, the balance may have changed (another tab deducted tokens). This is a known pattern in client-side token checks, and the server should enforce it, but worth a code comment so future maintainers don't remove the server-side guard.

- **[severity: minor] Correctness — `getCalendarCells` uses `(firstDay.getDay() + 6) % 7` for Monday-first offset.**
  This is correct for ISO weeks. No bug — just noting it is intentional.

- **[severity: minor] Correctness — `parseInt(post.date.split("-")[2])` at line 1305 with no radix.**
  `parseInt` without an explicit radix defaults to base 10 in modern JS for numeric strings, but the explicit radix `parseInt(..., 10)` is safer and clearer.

---

### React Best Practices

- **[severity: major] React — Stale closure in `handleRegeneratePost` dependency array.**
  ```ts
  }, [plan, selectedPost])
  ```
  `selectedPost` is in the dependency array only to check `selectedPost?.id === post.id` after a successful regeneration. Including `selectedPost` means the callback is re-created every time the panel opens/closes, which is harmless but unnecessary. More importantly, `selectedPost` is read inside a setState call that should use the functional form. Refactor to remove `selectedPost` from deps and use `setSelectedPost(prev => prev?.id === post.id ? newPost : prev)` instead:
  ```ts
  setSelectedPost((prev) => (prev?.id === post.id ? newPost : prev))
  ```
  Then remove `selectedPost` from the dependency array.

- **[severity: major] React — Calendar cell `key={i}` uses array index.**
  Line 1255:
  ```tsx
  {calendarCells.map((cell, i) => (
    <div key={i} ...>
  ```
  When filters change, `calendarCells` is recomputed with different cells. Using the index as key means React may reuse DOM nodes incorrectly, causing visual glitches (e.g. animations firing on the wrong cell). Use a stable key: `key={cell.dateStr ?? \`empty-${i}\`}`.

- **[severity: minor] React — `months` list computed with `useMemo(() => getNextMonths(4), [])` is correct but `getNextMonths` captures `new Date()` at mount time. If the page stays open across midnight on the last day of a month, the month list becomes stale. This is an extremely edge case — noting for completeness.

---

### Accessibility

- **[severity: major] Accessibility — Slide-out panel is not keyboard-dismissable via Escape.**
  The panel has `role="dialog"` and `aria-modal="true"` (good), and an `aria-labelledby` pointing to `post-detail-title` (good), but pressing `Escape` does not close it. This violates ARIA Authoring Practices for modal dialogs. Fix:
  ```tsx
  useEffect(() => {
    if (!selectedPost) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedPost(null) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selectedPost])
  ```

- **[severity: major] Accessibility — Focus is not trapped or moved into the dialog when it opens.**
  When `selectedPost` is set, focus stays wherever the user clicked (a calendar cell or list item). Screen reader users navigating by keyboard will not be taken into the panel. Add `autoFocus` to the close button, or use a focus-trap library.

- **[severity: major] Accessibility — All form step "option card" buttons lack `aria-pressed` or `aria-selected`.**
  Buttons used as radio-group alternatives (audience size, goals, posting frequency, month selection) convey their selected state only via visual colour. Screen readers cannot tell which option is chosen. Add `aria-pressed={formData.audienceSize === opt.value}` (and equivalent) to each, or wrap in a `role="radiogroup"` with `role="radio"` and `aria-checked`.

- **[severity: major] Accessibility — Format toggle buttons do not announce their checked state.**
  The custom checkbox buttons (lines 945-959) render a visual tick but have no `aria-checked` or `role="checkbox"`. A screen reader announces only the format label, not whether it is enabled. Add `role="checkbox"` and `aria-checked={formData.enabledFormats.includes(fmt.value)}`.

- **[severity: minor] Accessibility — `<select>` elements have no associated `<label>` element.**
  The industry `<select>` (line 741) and pillar filter `<select>` (line 1195) use a visual `<label>` above them but without a `for`/`htmlFor` pointing to the select's `id`. Add matching `id` and `htmlFor` attributes.

- **[severity: minor] Accessibility — Mobile hamburger button has no accessible label.**
  Line 637: `<button onClick={...} className="md:hidden ...">` — no `aria-label`, no visible text. Add `aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}` and `aria-expanded={isMobileMenuOpen}`.

- **[severity: minor] Accessibility — Logo image `alt` text is descriptive but the wrapping `<a href="/">` has no additional label.**
  The `alt="JP Automations"` on the `<img>` covers this adequately. No change needed.

---

### Performance

- **[severity: minor] Performance — `plan.posts.filter((p) => p.format === f).length` inside the Formats stat card (line 1134) runs inside a `.map()` over `uniqueFormats`, giving O(formats × posts) on every render.**
  Pre-compute a count map in `useMemo`:
  ```ts
  const formatCounts = useMemo(() => {
    const map: Record<string, number> = {}
    plan?.posts.forEach(p => { map[p.format] = (map[p.format] ?? 0) + 1 })
    return map
  }, [plan])
  ```
  For the post counts in the stats area this is negligible at ~30 posts, but it is wasteful JSX territory.

- **[severity: minor] Performance — The list view sorts `filteredPosts` inline on every render (line 1294).**
  Because `filteredPosts` is already memoised, the `.sort()` call itself re-runs whenever the parent re-renders for any reason (e.g. `copiedToClipboard` toggling). Move the sort inside the `filteredPosts` `useMemo`, or add a separate `sortedFilteredPosts` memo.

---

### Security

- **[severity: low] Security — User-supplied text (`formData.businessDescription`, `targetAudience`, `desiredOutcomes`) is sent to the generation API but never sanitised on the client.**
  React's JSX rendering escapes all string interpolation, so there is no XSS risk in the UI itself. The concern is prompt-injection: a user could craft a business description that manipulates the AI response. This is a server-side concern (the API route should sanitise/truncate inputs), but worth noting the `maxLength` on textareas is a client-only control and can be bypassed.

- **[severity: low] Security — `URL.createObjectURL` blob URL in `handleExportCSV` is revoked immediately after click (line 564), which is correct. No issue.**

---

## Verdict

NEEDS CHANGES — two high-severity issues (memory leak / post-unmount state updates), several major accessibility violations, and a stale-closure bug should be fixed before this ships to production.
