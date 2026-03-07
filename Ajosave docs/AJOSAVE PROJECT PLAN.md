**AJOSAVE PROJECT PLAN**

**Team Size:** 5 members  
**Project Duration:** 6 months (January - June 2026)  
**Target Launch:** May 2026 (Beta), June 2026 (Public)  
**Primary Platforms:** Mobile (iOS & Android via React Native), Web (React)  
**Target Users:** 1,000 beta users, scaling to 10,000+ by the end of 2026

## [TECHNICAL ARCHITECTURE & TECH STACK(MVP)]{.underline} {#technical-architecture-tech-stackmvp}

**Backend:**

- **Language & Framework:** Node.js with Express.js

- **Database:** MongoDB Atlas (cloud-hosted, auto-scaling)

- **Authentication:** JWT (JSON Web Tokens)

- **Payment Gateway:** Paystack (Nigerian market leader)

**Frontend Web:**

- **Framework:** React 18 with Vite

- **Styling:** Tailwind CSS

- **State Management:** Context API

- **HTTP Requests:** Axios

**Mobile App:**

- **Framework:** React Native (cross-platform for iOS & Android)

- **Navigation:** React Navigation

- **Storage:** AsyncStorage (secure token storage)

- **Push Notifications:** Firebase Cloud Messaging

**Infrastructure:**

- **Backend Hosting:** Railway or Render

- **Web Hosting:** Render

- **Database:** MongoDB Atlas

- **File Storage:** Cloudinary (profile photos, KYC documents)

- **Monitoring:** Sentry (crash reporting), Winston (logging)

- **CI/CD:** GitHub Actions

**Third-Party Services:**

- **Payments:** Paystack API

- **SMS/Email:** Termii or Africa\'s Talking

- **Identity Verification:** Verified Nigerian BVN/NIN verification providers

- **Analytics:** Mixpanel or Google Analytics

### [Architecture Overview]{.underline}

### 

Mobile App (React Native) Web App (React)

↓ ↓

└──────────→ API Gateway ←─┘

↓

Node.js/Express Backend

↓

┌─────────────┼─────────────┐

↓ ↓ ↓

MongoDB Paystack Redis Queue

(Database) (Payments) (Background Jobs)

**[TEAM ROLES & RESPONSIBILITIES]{.underline}**

## **[Backend Team]{.underline}**

**Goal:** Maintain a single backend for both mobile and web apps.

**Tools:**

- VS Code, Postman, MongoDB Compass, GitHub

- Railway/Render dashboard.

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 22%" />
<col style="width: 61%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Member</strong></th>
<th><strong>Role</strong></th>
<th><strong>Responsibilities</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Feranmi (Lead)</strong></td>
<td>Backend Lead</td>
<td>- Owns backend architecture &amp; deployment<br />
- Designs database schema, with help from bash (MongoDB)<br />
- Writes core API services (auth, wallet, contributions, transactions)<br />
- Oversees security, performance, and compliance<br />
- Reviews code from nelson &amp; Bash</td>
</tr>
<tr class="even">
<td><strong>Nelson</strong></td>
<td>Mobile Backend support</td>
<td>- Assist Feranmi on backend if needed<br />
- Focus on API endpoints needed for mobile features<br />
- Integrate backend with React Native app<br />
- Handle bug fixes, test APIs, write endpoint docs (Postman)</td>
</tr>
<tr class="odd">
<td><strong>Bash</strong></td>
<td>Web Backend Support</td>
<td><p>- Assist with MongoDB &amp; backend support</p>
<p>- Focus on API endpoints needed for web features<br />
- Occasionally help with backend tasks as assigned by Feranmi</p></td>
</tr>
</tbody>
</table>

## **[Frontend Team]{.underline}**

**Goal:** Complete and maintain current web frontend.

**Tools:**

- VS Code, React DevTools, Figma (for design reference), GitHub

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 26%" />
<col style="width: 57%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Member</strong></th>
<th><strong>Role</strong></th>
<th><strong>Responsibilities</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Bash</strong></td>
<td>Frontend Web Dev</td>
<td>- Build/maintain web dashboard (React)<br />
- Test endpoints for web usability</td>
</tr>
</tbody>
</table>

## **[Mobile App Team]{.underline}**

**Goal:** Build and maintain the mobile app (React Native + Expo).

**Tools:**

- VS Code, React Native Debugger, Xcode (iOS), Android Studio, Figma, GitHub

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 24%" />
<col style="width: 64%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Member</strong></th>
<th><strong>Role</strong></th>
<th><strong>Responsibilities</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Nelson</strong></td>
<td>Mobile Frontend Lead</td>
<td>- Build mobile screens, navigation, state management<br />
- Integrate APIs from backend<br />
- Handle offline flows, error states, skeleton loaders<br />
- Manage testing for mobile UX</td>
</tr>
<tr class="even">
<td><strong>Kosi</strong></td>
<td>Mobile Support / PM Support</td>
<td>- Assist with app development<br />
- Help implement features nelson delegates (especially UI polishing, navigation)<br />
- Track sprint progress, deadlines<br />
- Optional: help with backend mobile integrations if needed</td>
</tr>
</tbody>
</table>

**Notes:**

- Kosi could **focus on smaller mobile tasks initially**, gradually taking on more responsibility.

## **[UI/UX & Marketing]{.underline}** {#uiux-marketing}

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 26%" />
<col style="width: 60%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Member</strong></th>
<th><strong>Role</strong></th>
<th><strong>Responsibilities</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Temi</strong></td>
<td>Designer / Marketing</td>
<td><p>- Figma design system (colors, fonts, components)<br />
- High-fidelity UI for mobile &amp; web<br />
- Marketing assets for launch &amp; beta promotion<br />
- Onboarding &amp; illustration consistency</p>
<p>- Legal procedures and documentations</p></td>
</tr>
</tbody>
</table>

**Notes:**

- Temi's main focus is **visual identity and user experience**.

- He also works on **branding and social media presence,** as well as **networking procedures**.

**Other Open Roles:**  
Github Conflict/Review Manager

Deployment Manager

Quality Assurance/Tester(Mobile and Web)

### [How We Work Together]{.underline}

**Collaboration Patterns:**

- Backend ↔ Frontend/Mobile: API contract first, then parallel development

- Backend ↔ Backend: Code reviews, pair programming for complex features

- Everyone ↔ PM: Daily updates, blockers communicated immediately

- Design decisions: Collaborative discussion, PM facilitates

**Communication:**

- **Daily:** Async standup in Slack/Discord (5 min per person)

- **Weekly:** Monday sprint planning (1 hour), Sunday demo & retro (1 hour)

- **As needed:** Pair programming, code reviews, quick syncs

- **Format:** Post 3 things:

  1.  ✅ What I completed yesterday

  2.  🚀 What I\'m working on today

  3.  🚧 Any blockers or help needed

<!-- -->

- **Example:**

✅ Yesterday: Completed payment webhook handler, merged PR \#5

🚀 Today: Working on credit scoring algorithm, reviewing mobile PR

🚧 Blocker: Need clarification on group payout calculation logic

**Weekly Structured Meetings:**

**Monday - Sprint Planning (30 mins -- 1hr, 10 PM WAT):**

- Review what we accomplished last week

- Demo any completed features

- Select tasks for current sprint

- Break down stories into specific tasks

- Assign tasks to team members

- Set sprint goal (e.g., \"Complete payment integration testing\")

- Everyone leaves knowing exactly what they\'re doing this week

**Sunday - Demo & Retrospective (30 mins -- 1hr, 11 PM WAT):**

- **Demo (30 min):** Show completed work

  - Each person demos what they built

  - Get feedback from team

  - Celebrate wins!

- **Retrospective (30 min):** Team health check

  - What went well this week? 🎉

  - What could we improve? 🤔

  - Any process changes needed?

**Ad-Hoc Communication:**

- **Quick questions:** Slack/Discord (expect response within 2 hours during core hours)

- **Complex discussions:** Schedule 15-30 min call

- **Urgent issues:** mention in Slack + phone call if no response in 15 min

**Decision Needed: Team Communication Platform**

We need to finalize which tools we\'ll use for daily communication and project management. Here are our options and what we need to decide as a team:

**For Daily Communication (Pick One):**

- **Slack:** Professional, organized channels, good search, integrates with GitHub and other tools. Free tier allows 90-day message history.

- **Discord:** Free forever, unlimited message history, voice channels for quick calls, familiar to most developers. Less \"corporate\" feel.

- **WhatsApp Group:** Everyone already has it, instant notifications, easy to use. Downside: gets messy with lots of messages, hard to search old conversations, no threading.

**Recommendation:** Discord or Slack (both have threading, file sharing, and integration capabilities). WhatsApp are backups for urgent issues only.

**For Project Management (Pick One):**

- **Trello:** Simple, visual boards, easy to learn, free tier is generous. Great for smaller teams. Drag-and-drop cards.

- **Jira:** More powerful, better for complex projects, but steeper learning curve. Free for small teams (up to 10 users).

- **GitHub Projects:** Built into GitHub, no extra tool needed. Basic but functional. Good if we want everything in one place.

- **Notion:** All-in-one workspace with project boards, docs, databases. Very flexible but can be overwhelming at first.

**Recommendation:** Trello (easiest to start) or GitHub Projects (no extra tool to learn). Jira if we want more structure as we scale.

**For Code & Version Control (Already Decided):**

- **GitHub:** Already using this. All code repositories live here.

- **Git Branching:** Use feature branches, pull requests for all changes, code reviews required.

**For Design & Collaboration (Already Decided):**

- **Figma:** Temi uses this for all designs. Free for our team size.

**For API Documentation (Pick One):**

- **Postman:** Free, easy to use, can share collections with team, test endpoints directly. Good for development.

- **Swagger/OpenAPI:** Auto-generates documentation from code comments, more formal, better for external developers. Requires more setup.

**Recommendation:** Start with Postman (faster), migrate to Swagger later if needed.

**For Meetings:**

- **Google Meet:** Free with Google account, reliable, works on all devices.

- **Zoom:** Free tier allows 40-minute meetings, good quality.

- **Discord/Slack Voice:** Built into our chat platform, convenient for quick syncs.

**Recommendation:** Use Google Meet for scheduled meetings (sprint planning, demos). Discord/Slack voice for quick ad-hoc calls.

**Team Decision Required:** At our first team meeting, we need to agree on:

1.  **Primary chat tool:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ (Slack, Discord, WhatsApp)

2.  **Project management tool:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ (Trello, Jira, GitHub Projects, Notion)

3.  **API documentation:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ (Postman, Swagger, or both)

4.  **Meeting platform:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ (Google Meet, Zoom)

**Setup Tasks After Decision:**

- **Feranmi:** Create team workspace/server for chosen chat tool, set up channels (#general, \#backend, \#frontend, \#mobile, \#design, \#bugs, \#random)

- **Kosi:** Set up project management board with initial tasks from this sprint doc

- **Bash and Feranmi :** Create and share Postman/Swagger API documentation workspace

- **Temi:** Schedule recurring team meetings (Monday sprint planning, sunday demo/retro) on chosen meeting platform

- **Everyone:** Download and set up all chosen tools, test access, ensure notifications are working

**Communication Guidelines (Once Tools Are Set):**

- Tag people with @name for urgent questions

- Use threads to keep conversations organized

- Don\'t let important decisions get lost in chat---document them in project board or Notion

- Respond to messages within 2 hours during core working hours (10 AM - 4 PM WAT)

- Use @channel or @everyone sparingly (only for critical/time-sensitive issues)

- Keep \#random for non-work chat to build team culture

**Timeline:**

- **This Week:** Make tool decisions at first team meeting

- **This Week:** Set up all tools and ensure everyone has access

- **Next Week:** Start using tools consistently---no excuses about \"I didn\'t see the message\"

The tools we choose matter less than actually using them consistently. Pick what works for the team and commit to checking it daily.

**[GitHub Workflow:]{.underline}**

**[Branch Strategy (3 branch types):]{.underline}**

main (production)

↑

develop (staging)

↑

feature branches

**[Branch Naming Convention:]{.underline}**

- feature/user-authentication - New features

- bugfix/payment-webhook-error - Bug fixes

- hotfix/critical-production-bug - Emergency production fixes

- refactor/database-optimization - Code improvements

**[Development Workflow:]{.underline}**

1.  **Start New Work:**

bash

git checkout develop

git pull origin develop

git checkout -b feature/group-creation

2.  **Make Changes:**

    - Write code

    - Test locally

    - Commit frequently with clear messages

bash

git add .

git commit -m \"feat: Add group creation endpoint with validation\"

3.  **Commit Message Format:**

    - feat: New feature

    - fix: Bug fix

    - docs: Documentation only

> **Examples:**

- feat: Add Paystack webhook handler

- fix: Resolve wallet balance calculation error

- docs: Update API documentation for groups endpoint

4.  **Push to GitHub:**

bash

git push origin feature/group-creation

5.  **Create Pull Request (PR):**

    - Go to GitHub

    - Click \"New Pull Request\"

    - Base: develop ← Compare: feature/group-creation

    - **Fill out PR template  
      **

**[Communication Etiquette:]{.underline}**

**DO:**

- ✅ Be responsive during core hours (10 AM - 4 PM WAT)

- ✅ Update your status if you\'ll be away (lunch, appointment, etc.)

- ✅ Ask questions when you\'re stuck (after trying for 30 min yourself)

- ✅ Share wins and celebrate team members\' achievements

- ✅ Give constructive feedback in code reviews

- ✅ Admit when you don\'t know something

- ✅ Keep video on during important meetings (builds connection)

**DON\'T:**

- ❌ Ghost the team (disappear without communication)

- ❌ Wait until the last minute to say you\'re blocked

- ❌ Be dismissive of others\' ideas or questions

- ❌ Commit directly to main or develop (always use PRs)

- ❌ Work in isolation for days without updating team

- ❌ Leave cryptic commit messages (\"fixed stuff\", \"updates\")

- ❌ Forget to pull latest changes before starting work

**Conflict Resolution:**

- If technical disagreement: Discuss pros/cons, vote if needed, PM breaks tie

- If personal conflict: Talk privately first, involve PM if needed

- If persistent issues: Team retrospective to address

- Remember: We\'re all on the same team, building something together
