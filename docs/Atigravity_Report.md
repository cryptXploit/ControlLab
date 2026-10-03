# CONTROL LAB — FULL FORENSIC PRODUCT, UI/UX, ARCHITECTURE & IMPLEMENTATION AUDIT

## ROLE

You are acting as a senior:

* Product Architect
* UI/UX Architect
* Interaction Designer
* Frontend Engineer
* React/TypeScript Architect
* Mobile/Capacitor Engineer
* Simulation UX Engineer
* Design-System Engineer
* i18n/Localization Engineer
* Performance Engineer
* QA Engineer
* Technical Auditor

Your task is NOT to redesign or modify the application yet.

Your task is to perform a complete forensic audit of the CURRENT ControlLab application and repository and produce an evidence-based report explaining:

1. What currently exists.
2. How it is actually implemented.
3. What is working.
4. What is partially implemented.
5. What is implemented incorrectly.
6. What is visually/UX weak.
7. What is architecturally weak.
8. What was planned but never implemented.
9. What was implemented in a naive or temporary way.
10. What will break when the application grows.
11. What important things were never considered.
12. What should be preserved.
13. What should be refactored.
14. What should be redesigned.
15. What should be added.
16. What should NOT be added.
17. What the real root causes are behind the current poor experience.

DO NOT modify any source code, configuration, dependencies, database, assets, routes, or UI.

DO NOT install packages.

DO NOT remove packages.

DO NOT “quickly fix” anything.

DO NOT silently rewrite anything.

DO NOT create a new architecture simply because you personally prefer it.

First inspect and report the actual state of the existing application.

---

# 1. IMPORTANT CONTEXT

ControlLab is intended to become a premium, offline-first interactive engineering education/laboratory application.

It is NOT supposed to feel like:

* a website wrapped inside an Android app
* an old academic calculator
* a collection of random buttons
* a spreadsheet-like engineering utility
* a desktop engineering tool squeezed into mobile
* a prototype/demo
* a generic CRUD application

The intended experience is:

* premium
* calm
* technical
* modern
* highly usable
* interactive
* visually clear
* smooth
* responsive
* intuitive
* locally useful
* scalable
* offline-first
* mobile-first
* professional enough to feel like a real commercial engineering product

The application must eventually support multiple engineering labs/tools without making the UI feel crowded or chaotic.

Current observed problems include, but are NOT limited to:

* UI looks old/basic rather than premium.
* Interaction feels static.
* User often cannot understand what to do next.
* Home screen feels excessively zoomed and text-heavy.
* Layout does not always feel like a real mobile application.
* Large amounts of unused side space appear in some views.
* Buttons can overlap each other.
* Labs currently expose tools as a simple group of buttons near the top.
* That architecture will become ugly and unusable when many future labs/tools are added.
* During simulation, changing variables may require scrolling down/up repeatedly to see the updated graph/output.
* Simulation controls and visualization are not organized optimally.
* Some screens feel vertically awkward.
* Bangla language selection does not fully translate the entire app.
* Some pages/components remain English after selecting Bangla.
* Practice/Challenge-related UI is not guaranteed to be localized.
* The application does not consistently communicate user flow.
* Some interactions may feel like developer-created controls rather than polished product interactions.

These are OBSERVATIONS from the product owner, not assumptions that you should blindly accept.

You must independently verify each one and discover additional problems that were not listed.

---

# 2. PRIMARY OBJECTIVE

Perform a full forensic audit of BOTH:

A. THE ACTUAL RUNNING APPLICATION

AND

B. THE ACTUAL SOURCE CODE / ARCHITECTURE

The report must connect the two.

Do not only say:

“UI should be improved.”

Instead say things such as:

* Which screen causes the problem.
* Which component causes it.
* Which file contains the component.
* Which CSS/layout system causes it.
* Which state controls it.
* Which event handler triggers it.
* Which store/service provides the data.
* Which architectural decision created the problem.
* Whether the issue is local or systemic.
* Whether fixing it locally would create future technical debt.
* What the correct architectural direction should be.

Every important claim should have evidence.

---

# 3. FIRST: INVENTORY THE ENTIRE REPOSITORY

Inspect:

* package.json
* package-lock / pnpm-lock / yarn.lock
* vite config
* tsconfig
* Tailwind configuration
* CSS files
* CSS variables
* routing
* state management
* storage
* i18n
* services
* utilities
* hooks
* simulation engine
* graph/chart system
* components
* pages
* assets
* icons
* fonts
* notification system
* AdMob abstraction
* Capacitor configuration
* Android configuration
* build configuration
* test configuration
* lint/typecheck configuration

Determine:

* actual framework versions
* actual Capacitor version
* actual React version
* actual TypeScript version
* actual UI libraries
* actual charting libraries
* actual animation libraries
* actual storage libraries
* actual i18n libraries
* actual localization files
* actual dependencies that are unused
* actual dependencies that are duplicated
* actual dependencies that are unnecessary
* any suspiciously large dependency

Do not assume the architecture document is correct.

The repository is the source of truth.

---

# 4. CREATE A COMPLETE FEATURE INVENTORY

List EVERY feature currently implemented.

For each feature provide:

| Feature | Route/Page | Main Component | Supporting Components | State | Storage | Logic Engine | Translation | Status |
| ------- | ---------- | -------------- | --------------------- | ----- | ------- | ------------ | ----------- | ------ |

Include:

* Home
* Labs
* First Order
* Second Order
* PID
* DC Motor
* Projects
* Practice
* Challenges
* Search
* Settings
* Theme
* Language
* Haptics
* Notifications
* Backup
* Import
* Export
* Ads
* Any additional feature found in repository

Do not omit small features.

---

# 5. CREATE A COMPLETE UI ELEMENT INVENTORY

For EVERY important screen inspect every major:

* button
* card
* slider
* input
* dropdown
* tab
* navigation item
* icon button
* modal
* bottom sheet
* tooltip
* graph
* metric
* badge
* switch
* menu
* list
* empty state
* loading state
* error state
* success state
* toast/snackbar
* FAB
* toolbar
* header
* footer
* bottom navigation

For each important interactive element report:

1. Visible text.
2. Component/file.
3. Event handler.
4. State affected.
5. Data source.
6. Navigation destination.
7. Whether the action actually works.
8. Whether loading is handled.
9. Whether error is handled.
10. Whether disabled state exists.
11. Whether the control has feedback.
12. Whether it has haptic feedback.
13. Whether it is animated.
14. Whether it is responsive.
15. Whether it is localized.
16. What happens in Bangla mode.
17. What happens on narrow screens.
18. What happens with long text.
19. Whether the control feels native/premium or prototype-like.

---

# 6. ACTUAL RUNNING UI AUDIT

Do NOT rely only on source code.

Run the application and visually inspect the real rendered interface.

Inspect:

* Home
* Labs
* every available laboratory/simulator
* Projects
* Practice
* Challenges
* Search
* Settings
* language switch
* theme switching
* simulator parameter changes
* graph interaction
* navigation
* modals
* sheets
* notifications
* backup/import/export where available

For each screen inspect:

### Layout

* viewport usage
* content width
* max width
* left/right whitespace
* padding
* alignment
* vertical rhythm
* card dimensions
* density
* visual hierarchy
* header proportions
* navigation proportions

### Typography

* font sizes
* heading hierarchy
* body hierarchy
* numerical values
* labels
* helper text
* line height
* letter spacing
* truncation
* wrapping
* localization behavior

### Interaction

* hover where applicable
* press
* active
* selected
* disabled
* loading
* success
* error
* focus
* touch target size
* gesture behavior
* animation
* transition

### Visual quality

Determine whether the UI feels:

* premium
* modern
* technical
* calm
* coherent
* mobile-native
* interactive

Or whether it feels:

* old
* generic
* web-like
* crowded
* oversized
* empty
* prototype-like
* inconsistent

Do not merely use subjective words.

Explain what concrete implementation decisions create that perception.

---

# 7. RESPONSIVE DESIGN FORENSIC AUDIT

This is critical.

Inspect the application at:

* small Android phone
* normal Android phone
* large phone
* tablet
* desktop browser

Determine:

* whether the layout is mobile-first
* whether widths are fixed
* whether max-width is incorrectly limiting content
* whether content is unnecessarily centered
* whether side whitespace is caused by containers
* whether grid breakpoints are wrong
* whether flex layouts are causing overlap
* whether buttons wrap correctly
* whether text overflow occurs
* whether cards maintain usable proportions
* whether graphs resize correctly
* whether controls overflow
* whether bottom navigation overlaps content
* whether modals fit smaller screens
* whether long Bangla text breaks layouts

Identify the exact CSS/layout mechanisms producing each issue.

---

# 8. HOME PAGE FORENSIC AUDIT

Analyze Home independently.

Answer:

* What is the user's primary job on Home?
* Is that job obvious within 3 seconds?
* Does the user know where to go next?
* Is the hierarchy clear?
* Is there too much text?
* Are headings too large?
* Is visual space wasted?
* Are cards doing too much?
* Are buttons too numerous?
* Are there meaningful shortcuts?
* Are recent projects visible?
* Are recent labs visible?
* Are practice/challenge actions visible?
* Is there contextual guidance?
* Is the Home screen actually useful, or is it just a landing page?

Analyze the cognitive load.

Identify whether the current Home is optimized for:

* discovery
* navigation
* repeat use
* returning users
* active experiments

Then propose the correct PRODUCT STRUCTURE for Home, without implementing it yet.

---

# 9. LABS PAGE INFORMATION ARCHITECTURE AUDIT

This is one of the most important sections.

Current implementation appears to have a simple Tools section with several buttons.

Audit whether this architecture can scale to:

* First Order
* Second Order
* PID
* DC Motor
* future control systems
* signal tools
* frequency-response tools
* stability tools
* controller tuning
* analysis utilities
* future engineering modules

Determine why a simple “many buttons on one page” model becomes problematic.

Evaluate possible scalable information architectures such as:

* categories
* sections
* search
* favorites
* recent tools
* recommended tools
* horizontal categories
* collapsible groups
* tool cards
* command/search access
* bottom-sheet selection
* segmented navigation

Do NOT automatically implement any of them.

Instead provide:

### Current IA

### Current scalability problems

### Recommended future IA

### Why it scales

### What happens when tool count becomes 10

### What happens at 20

### What happens at 50+

### Which navigation model should become the foundation

---

# 10. SIMULATION EXPERIENCE FORENSIC AUDIT

Audit every simulator.

For:

* First Order
* Second Order
* PID
* DC Motor
* any additional simulator

trace the complete interaction flow:

User enters simulator
→ selects/change parameter
→ simulation executes
→ graph updates
→ metrics update
→ explanation updates
→ user changes another parameter
→ simulation updates again

Document:

* source of parameters
* state management
* recomputation trigger
* solver
* numerical method
* graph rendering
* metrics calculation
* explanation engine
* validation
* error state
* reset behavior
* persistence
* history

---

# 11. SIMULATOR UX PROBLEM

Specifically investigate the problem where users must scroll repeatedly after changing parameters to see what happened.

Determine:

* Is graph too low on the page?
* Are controls physically separated from visualization?
* Is the page structure wrong?
* Is the graph container wrong?
* Is the result panel placed incorrectly?
* Is sticky positioning missing?
* Is a split-pane layout needed?
* Is there excessive vertical stacking?
* Is the graph height wrong?
* Does responsive behavior change poorly between desktop and mobile?
* Are the controls and graph both competing for viewport space?

Evaluate appropriate interaction models:

### Mobile

Possible patterns may include:

* sticky compact simulation toolbar
* parameter drawer
* bottom sheet
* segmented controls
* compact control panel
* graph-first viewport
* collapsible advanced parameters
* result metrics directly beneath graph
* synchronized scrolling

### Tablet/Desktop

Possible patterns may include:

* two-pane layout
* controls left
* visualization right
* sticky controls
* resizable panel
* graph occupying dominant workspace

Do not blindly choose one.

Explain which model best fits each viewport.

Also determine whether the current simulator behaves more like a document or like an application workspace.

That distinction is important.

---

# 12. GRAPH / VISUALIZATION AUDIT

Determine:

* which graphing library is used
* how many points are plotted
* whether data uses arrays or typed arrays
* whether every slider movement recomputes immediately
* whether rendering is throttled/debounced
* whether requestAnimationFrame is used
* whether graph updates are wasteful
* whether React is unnecessarily re-rendering the graph
* whether graph state is coupled to UI state
* whether zoom/pan exists
* whether reset exists
* whether axes update correctly
* whether units are visible
* whether legends are useful
* whether the graph remains readable in dark mode
* whether graphs remain readable with Bangla UI
* whether the visual hierarchy correctly communicates output

Also identify whether the graph is currently the PRIMARY result or merely another component in a long page.

---

# 13. CONTROL / PARAMETER PANEL AUDIT

For every parameter control determine:

* label
* unit
* minimum
* maximum
* step
* default
* current value
* validation
* input type
* slider vs number field
* mobile usability
* accessibility
* visual grouping
* reset behavior
* dependency on other parameters

Identify whether users understand:

“Which variable am I changing?”

“Why does this matter?”

“What effect should I expect?”

“Did the simulation actually change?”

Also inspect whether the UI communicates parameter/result relationships.

---

# 14. "EXPLAIN WHY" / LOCAL INTELLIGENCE AUDIT

Determine whether the app has real deterministic explanation logic or only static explanatory text.

For example:

Changing damping
→ overshoot changes
→ settling time changes
→ stability behavior changes
→ explanation should describe the observed relationship

Audit:

* rules
* thresholds
* metric interpretation
* rule priority
* conflicting explanations
* edge cases
* unavailable values
* unstable systems
* zero/negative inputs
* unusual parameter ranges

Report:

* implemented
* partially implemented
* static
* missing

---

# 15. PRACTICE / CHALLENGES AUDIT

Inspect the entire Practice and Challenge system.

Determine:

* where questions live
* how questions are selected
* whether questions are randomized
* whether difficulty exists
* whether answers are validated
* whether explanations exist
* whether progress is stored
* whether history is stored
* whether streaks exist
* whether completion is stored
* whether there are empty states
* whether the UI is scalable
* whether all content is localized
* whether challenge states are deterministic
* whether the page is actually useful or merely decorative

Report every issue.

---

# 16. PROJECTS AUDIT

Inspect:

* create project
* edit
* delete
* duplicate
* save
* autosave
* recent projects
* project metadata
* experiment history
* reopening previous simulations

Determine:

* actual storage
* schema
* migrations
* error handling
* import/export
* corruption behavior
* empty state
* project naming UX
* project navigation
* relation between project and simulator state

---

# 17. SEARCH AUDIT

Inspect:

* search engine
* indexed content
* fuzzy matching
* aliases
* Bangla terms
* categories
* tags
* tool names
* practice content
* projects

Determine whether search is:

* real
* partial
* placeholder
* static
* scalable

Test:

* English
* Bangla
* partial names
* spelling mistakes
* aliases
* long text

---

# 18. SETTINGS AUDIT

Inspect every setting.

Especially:

* Language
* Theme
* Haptics
* Notifications
* Data
* Backup
* Restore
* Export
* Import
* Ads/Pro if present
* About
* Privacy
* App information

Determine whether each setting actually controls the intended system globally.

---

# 19. COMPLETE LANGUAGE / i18n FORENSIC AUDIT

This is CRITICAL.

The requirement is:

When the user selects Bangla:

EVERY user-visible word/sentence in the entire application must become Bangla.

This includes:

* Home
* Labs
* every lab
* all simulator labels
* buttons
* tooltips
* menus
* settings
* Practice
* Challenges
* Search
* Projects
* empty states
* errors
* validation
* notifications
* success messages
* dialogs
* modal text
* placeholders
* hints
* onboarding
* educational descriptions
* metric labels
* explanation text
* navigation
* accessibility labels where user-visible
* dynamic text

Audit how localization is currently implemented.

Determine:

* translation library
* translation files
* hard-coded strings
* dynamic strings
* conditional English strings
* fallback behavior
* missing keys
* duplicate keys
* untranslated components
* strings inside data arrays
* strings inside JSON
* strings generated inside logic
* strings inside validation functions
* strings inside toast messages
* strings inside chart labels
* strings inside notifications
* strings in modals
* strings in practice/challenge data

Create an inventory:

| String/Area | File | Hardcoded? | Translation Key? | Bangla Exists? | Runtime Localized? |
| ----------- | ---- | ---------- | ---------------- | -------------- | ------------------ |

Also inspect whether the language switch triggers a global application update or only updates selected components.

Test whether navigation to another page after selecting Bangla resets any text back to English.

Test app restart behavior.

Test persistence.

Test mixed-language situations.

Identify the root architectural reason for incomplete localization.

---

# 20. DESIGN SYSTEM AUDIT

Inspect whether the application has a real design system.

Audit:

* colors
* semantic color tokens
* spacing
* typography
* radius
* shadows
* elevation
* borders
* iconography
* button variants
* cards
* inputs
* sliders
* dialogs
* bottom sheets
* navigation
* animations

Determine:

* tokenized
* partially tokenized
* hardcoded
* inconsistent

Identify duplicated styles.

Identify components with one-off styling.

Determine whether future pages can be built consistently.

---

# 21. ANIMATION / MOTION AUDIT

Determine exactly where motion exists.

Inspect:

* page transitions
* card entrance
* button press
* slider interaction
* modal opening
* sheet opening
* navigation
* graph update
* loading
* success
* error
* theme switch
* language switch

Determine whether:

* there is no animation
* animation is excessive
* animation is inconsistent
* animation is technically present but perceptually weak
* animations use heavy libraries unnecessarily
* transitions cause jank
* motion is missing where it improves comprehension

The target is NOT “add animation everywhere.”

The target is:

Purposeful motion that communicates:

* state
* hierarchy
* causality
* continuity
* interaction feedback

---

# 22. MICROINTERACTION AUDIT

For every important interaction determine whether the user receives adequate feedback.

Examples:

* pressing a button
* saving a project
* changing a parameter
* resetting
* switching theme
* switching language
* creating project
* deleting project
* completing practice
* changing slider
* simulation finished
* invalid input
* imported backup
* export completed

Report:

* feedback exists
* feedback type
* timing
* clarity
* haptics
* animation
* missing feedback

---

# 23. EMPTY / LOADING / ERROR STATE AUDIT

For every feature identify:

* empty state
* loading state
* error state
* offline state
* success state
* destructive confirmation

Determine if the current app only handles the “happy path”.

---

# 24. ACCESSIBILITY AUDIT

Inspect:

* touch targets
* contrast
* focus
* semantic buttons
* screen-reader labels
* input labels
* slider accessibility
* keyboard accessibility
* reduced motion behavior
* text scaling
* localization length
* color-only communication

Especially test long Bangla labels.

---

# 25. PERFORMANCE AUDIT

Inspect:

* React rerenders
* large component trees
* unnecessary state updates
* graph rerenders
* expensive calculations
* repeated calculations
* memoization
* useMemo/useCallback abuse
* list rendering
* bundle size
* asset size
* startup time
* lazy loading
* code splitting
* simulator computation
* local storage access
* IndexedDB access

Identify both:

### Current performance problems

### Future performance risks

---

# 26. STORAGE / DATA ARCHITECTURE AUDIT

Inspect:

* Dexie / IndexedDB
* Preferences
* local state
* schema
* migrations
* serialization
* backup
* restore
* import
* export

Determine whether storage architecture is suitable for:

* projects
* experiments
* history
* settings
* practice progress
* challenge progress
* future labs

Identify migration risks.

---

# 27. SIMULATION ENGINE AUDIT

Do not judge only the UI.

Inspect the actual engineering/math implementation.

For every solver determine:

* equations
* numerical method
* step size
* time range
* initial conditions
* parameter validation
* stability detection
* metric calculations
* rise time
* settling time
* peak time
* overshoot
* steady-state error
* controller logic
* DC motor model
* edge cases
* invalid parameters

Determine whether:

* values are mathematically meaningful
* metrics are robust
* stability detection is naive
* thresholds are hard-coded
* solver architecture scales
* UI is coupled to solver
* simulation engine is pure TS
* testing exists

Do not invent mathematical corrections.

Only identify implementation facts and clearly separate them from recommendations.

---

# 28. TESTING AUDIT

Inspect:

* unit tests
* integration tests
* component tests
* simulation tests
* storage tests
* i18n tests
* responsive testing
* Android testing
* build validation

Determine exactly what is tested and what is not.

Especially determine whether a test exists that can guarantee:

“Switching the app to Bangla results in zero unintended English UI strings.”

---

# 29. CAPACITOR / ANDROID AUDIT

Inspect:

* Capacitor config
* Android project
* WebView behavior
* status bar
* safe areas
* keyboard
* back navigation
* splash screen
* orientation
* haptics
* local notifications
* AdMob
* permissions
* release configuration

Determine whether the app feels like an Android application or simply a web app running inside Android.

---

# 30. ADS / MONETIZATION ARCHITECTURE AUDIT

Inspect:

* AdMob implementation
* Ad service abstraction
* ad placement
* frequency
* screen interruption
* simulator interruption
* loading behavior
* failure behavior
* Pro/paid handling if implemented

Determine whether monetization damages the core engineering workflow.

Do NOT propose aggressive ad placement.

---

# 31. NOTIFICATION AUDIT

Inspect:

* notification logic
* scheduling
* cancellation
* frequency
* permission handling
* duplicate scheduling
* localization
* Bangla notification content
* persistence

Determine whether notification architecture is actually production-ready.

---

# 32. ARCHITECTURE GAP ANALYSIS

Compare the current repository against the previously proposed ControlLab architecture.

Evaluate:

* presentation layer
* application layer
* domain layer
* infrastructure layer
* simulation engine
* state management
* storage
* search
* notifications
* ads
* i18n
* theme
* testing

Mark each as:

KEEP
PARTIALLY KEEP
MODIFY
REFACTOR
REPLACE
MISSING
UNKNOWN

Explain why.

---

# 33. GEMINI VS ANTIGRAVITY RESPONSIBILITY ANALYSIS

Do not blame either tool without evidence.

Identify:

### Problems caused by weak product/architecture planning

### Problems caused by implementation shortcuts

### Problems caused by missing design system

### Problems caused by missing QA

### Problems caused by poor component abstraction

### Problems caused by incomplete requirements

### Problems caused by missing validation

### Problems caused by scaling assumptions

### Problems that originated from the architecture recommendation

### Problems that are simply unfinished work

This distinction is important.

---

# 34. TECHNICAL DEBT MAP

Create a table:

| Problem | Root Cause | Evidence | Current Impact | Future Impact | Severity | Recommended Action |
| ------- | ---------- | -------- | -------------- | ------------- | -------- | ------------------ |

Severity:

P0 = foundational / blocking

P1 = major product problem

P2 = important improvement

P3 = polish/future

---

# 35. "NOT MENTIONED BUT IMPORTANT" AUDIT

This section is mandatory.

Find important problems that the product owner did NOT mention.

Examples may include:

* inconsistent spacing
* poor information hierarchy
* weak empty states
* poor destructive-action handling
* missing feedback
* bad loading behavior
* poor graph labeling
* inaccessible controls
* navigation dead ends
* poor persistence
* missing state restoration
* inconsistent icons
* excessive component duplication
* localization architecture flaws
* poor error handling
* bad Android back behavior
* unsafe assumptions
* scalability problems
* performance bottlenecks

Do not limit yourself to these examples.

---

# 36. PRODUCT FLOW ANALYSIS

For each major user goal, trace:

### Goal A

“I want to simulate a control system.”

### Goal B

“I want to understand why the output changed.”

### Goal C

“I want to save my experiment.”

### Goal D

“I want to practice.”

### Goal E

“I want to find a tool.”

### Goal F

“I want to come back to an old project.”

### Goal G

“I want the app fully in Bangla.”

For each goal:

1. Entry point.
2. Steps required.
3. Number of taps/screens.
4. Confusion points.
5. unnecessary steps.
6. dead ends.
7. feedback.
8. failure states.
9. ideal future flow.

---

# 37. USER MENTAL MODEL AUDIT

Determine whether the current UI communicates the concepts:

* Tool
* Lab
* Experiment
* Parameter
* Simulation
* Result
* Metric
* Explanation
* Project
* Practice
* Challenge

Determine whether terminology is consistent.

For example:

Does “Lab”, “Tool”, “Simulation”, and “Experiment” mean distinct things?

If not, explain the confusion.

---

# 38. SCALE TEST

Mentally and architecturally test the current system at:

### 5 tools

### 10 tools

### 20 tools

### 50 tools

### 100 tools

Evaluate:

* Labs navigation
* search
* categories
* data model
* routing
* rendering
* translation
* cards
* home
* favorites
* recent items
* projects

This is not a hypothetical exercise only.

Use the current code architecture to predict which parts will become difficult.

---

# 39. UI COMPONENT REUSABILITY AUDIT

Determine:

* which components are truly reusable
* which are duplicated
* which are page-specific
* which should become primitives
* which abstractions are too generic
* which abstractions are too specific
* which components contain business logic
* which UI components directly call storage
* which UI components directly call simulation engines
* which components are violating separation of concerns

---

# 40. COMPLETE FILE-LEVEL TRACE

For each major feature, identify:

Route
→ Page
→ Layout
→ Component
→ Hook
→ Store
→ Service
→ Domain logic
→ Storage

Example format:

Home
→ HomePage.tsx
→ DashboardCard.tsx
→ useProjects()
→ projectStore
→ projectService
→ Dexie
→ local database

Do this for all major flows.

---

# 41. IDENTIFY PLACEHOLDER / FAKE / STATIC IMPLEMENTATIONS

Find anything that only LOOKS functional.

Examples:

* static data
* hard-coded values
* fake metrics
* fake progress
* static challenge content
* placeholder search
* mock notifications
* dummy save behavior
* buttons without real action
* decorative cards
* hard-coded English
* non-persistent settings

Clearly label:

REAL
PARTIAL
MOCK
STATIC
PLACEHOLDER
UNKNOWN

---

# 42. FIND DEAD CODE / UNUSED CODE

Identify:

* unused components
* unused hooks
* unused utilities
* unused dependencies
* dead routes
* duplicate implementations
* old architecture remnants
* temporary code
* debugging code
* console logs
* commented-out code

Do NOT delete anything.

Only report.

---

# 43. ROOT-CAUSE ANALYSIS OF THE CURRENT UI QUALITY

For every major visual problem answer:

“Why does the product LOOK like this?”

Do not answer:

“CSS needs improvement.”

Instead trace the underlying cause.

Examples:

Problem:
Huge blank side space.

Possible root:
fixed max-width container + centered content + desktop-first layout.

Problem:
Buttons overlap.

Possible root:
fixed-height cards + absolute positioning + insufficient min-width.

Problem:
Simulation requires scrolling.

Possible root:
document-oriented vertical composition instead of workspace-oriented simulator architecture.

Problem:
Labs page becomes ugly with more tools.

Possible root:
flat navigation model instead of scalable information architecture.

Problem:
Bangla is incomplete.

Possible root:
translation architecture is not centralized and static content/business logic contains raw English strings.

Use this depth of reasoning throughout the audit.

---

# 44. PREMIUM PRODUCT AUDIT

Evaluate whether the current application has the visual and behavioral qualities users associate with premium software:

* intentional hierarchy
* strong spacing system
* restrained typography
* purposeful motion
* excellent feedback
* predictable interactions
* high-quality empty states
* consistent controls
* adaptive layouts
* visual continuity
* polished navigation
* coherent iconography
* clear primary action
* minimal cognitive load

Again, explain concrete technical reasons.

---

# 45. WHAT SHOULD BE PRESERVED

Identify parts of the current application that are:

* technically solid
* useful
* correctly architected
* worth keeping
* already scalable

We do NOT want to rewrite working code unnecessarily.

---

# 46. WHAT SHOULD BE REWORKED

Identify:

* UI-only changes
* component refactors
* architecture refactors
* data model changes
* state changes
* simulation changes
* navigation changes
* i18n changes

Separate them clearly.

---

# 47. WHAT MUST NOT BE CHANGED

Identify code/components/architecture that should be preserved because changing them would create unnecessary risk.

---

# 48. RECOMMENDED FUTURE PRODUCT ARCHITECTURE

Do NOT implement it.

Describe the recommended architecture for a premium version of ControlLab.

It must account for:

* many future labs
* scalable navigation
* mobile-first
* simulator workspace
* project persistence
* full localization
* search
* practice
* challenges
* notifications
* ads
* offline operation
* future feature expansion

---

# 49. RECOMMENDED UI SYSTEM

Describe the future system for:

* spacing
* type scale
* buttons
* cards
* inputs
* sliders
* graphs
* metrics
* navigation
* sheets
* modals
* tabs
* segmented controls
* badges
* feedback
* motion

Do not produce visual mockups yet.

This is an architecture/design audit.

---

# 50. IMPLEMENTATION ROADMAP

After analyzing everything, produce a dependency-aware roadmap.

Separate:

## P0 — Foundation

Things that must be fixed before visual polish.

## P1 — Major UX

Things that strongly affect usability.

## P2 — Product depth

Things that improve usefulness.

## P3 — Polish

Microinteractions and visual refinement.

For every task provide:

* reason
* dependency
* files affected
* risk
* estimated complexity
* whether existing code can be preserved

Do NOT provide vague tasks such as:

“Improve UI.”

Instead use precise tasks such as:

“Replace page-level max-width constraint in X with adaptive workspace layout for simulator route Y.”

---

# 51. IDEAL FUTURE FLOW

Describe how a high-quality user journey should work:

Open app
→ understand current state
→ discover tool
→ open lab
→ understand objective
→ configure variables
→ immediately observe output
→ understand why output changed
→ save experiment
→ return later
→ practice
→ continue learning

Identify where the current application deviates from this.

---

# 52. FINAL REQUIRED REPORT FORMAT

Your response MUST use exactly this high-level structure:

# CONTROL LAB — FORENSIC AUDIT REPORT

## 1. Executive Summary

## 2. Current Repository Architecture

## 3. Technology Stack Actually Used

## 4. Complete Feature Inventory

## 5. Complete Screen / Route Inventory

## 6. Complete UI Component Inventory

## 7. Current User Flows

## 8. Home Page Audit

## 9. Labs Information Architecture Audit

## 10. Simulator UX Audit

## 11. Graph / Visualization Audit

## 12. Parameter Control Audit

## 13. Practice & Challenge Audit

## 14. Projects Audit

## 15. Search Audit

## 16. Settings Audit

## 17. Full i18n / Bangla Audit

## 18. Design System Audit

## 19. Animation & Motion Audit

## 20. Microinteraction Audit

## 21. Responsive / Mobile / Desktop Audit

## 22. Accessibility Audit

## 23. Performance Audit

## 24. Storage / Data Audit

## 25. Simulation Engine Audit

## 26. Testing Audit

## 27. Capacitor / Android Audit

## 28. AdMob / Monetization Audit

## 29. Notification Audit

## 30. Architecture Gap Analysis

## 31. Gemini Architecture vs Current Reality

## 32. Gemini Planning Gaps

## 33. Antigravity Implementation Gaps

## 34. Missing Product Requirements

## 35. Technical Debt Map

## 36. Hidden / Unmentioned Problems

## 37. Scalability Analysis: 5 → 10 → 20 → 50 → 100 Tools

## 38. Files / Components to KEEP

## 39. Files / Components to MODIFY

## 40. Files / Components to REFACTOR

## 41. Files / Components to ADD

## 42. Files / Components That Should NOT Be Touched

## 43. Recommended Future UI Architecture

## 44. Recommended Future Information Architecture

## 45. Recommended Simulator Workspace Architecture

## 46. Recommended Localization Architecture

## 47. Recommended Design System

## 48. Priority Roadmap P0 → P3

## 49. Dependency-Aware Implementation Order

## 50. Final Readiness Assessment

---

# 53. EVIDENCE REQUIREMENT

For important findings provide concrete evidence.

Use:

* file path
* component name
* function name
* relevant code behavior
* route
* dependency
* CSS/layout mechanism
* state/store
* screenshot/reference if available

Do not invent evidence.

If something cannot be verified, say:

NOT VERIFIED

rather than guessing.

---

# 54. IMPORTANT DISTINCTIONS

Always distinguish:

OBSERVED FACT
INFERENCE
RECOMMENDATION

Do not present recommendations as existing implementation.

Do not assume a library is being used simply because the architecture document recommended it.

Do not assume a feature exists because a button exists.

Do not assume localization is complete simply because i18next exists.

Do not assume a simulation is correct merely because a graph is rendered.

---

# 55. NO CODE CHANGES

At the end of the audit:

DO NOT modify any file.

DO NOT install any package.

DO NOT remove anything.

DO NOT rewrite the UI.

DO NOT refactor.

DO NOT commit anything.

Only return the forensic audit report.

The purpose of this audit is to give the product owner a complete technical and product diagnosis so a later implementation phase can be generated from verified evidence rather than assumptions.

The report must be detailed enough that another engineer could understand the entire application's current state without opening the repository themselves.
