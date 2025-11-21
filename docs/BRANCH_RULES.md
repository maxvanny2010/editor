## 🛡️ Branch Protection Rules

### 🎯 Target Branches

- `develop` — default integration branch
- `main` — production-ready releases

---

### ⚙️ Ruleset: `lint-build-test`

#### 1. Pull Requests

- ✅ Require pull request before merging
- ✅ Require conversation resolution before merging
- ⛔ Required approvals: **0** (solo-project; in production usually 1–2)
- ✅ Allow squash merge (preferred)
- ⛔ Disallow direct pushes (handled by "Restrict updates")

#### 2. History & Commits

- ✅ Require linear history (no merge commits)
- ✅ Restrict updates (only via PR)
- ✅ Restrict deletions (branch cannot be deleted)
- ⛔ Restrict creations (not needed for feature branches)
- ⛔ Require signed commits (optional, not enforced here)

#### 3. Status Checks

- ✅ Require status checks to pass
- ✅ Require branches to be up to date before merging
- Required check:
	- `all-checks-passed` (aggregates ESLint, TypeScript, Build on Node.js 20 & 22)

#### 4. Security

- ⛔ Require deployments to succeed (not configured)
- ⛔ Require code scanning results (optional, not enforced here)

---

### 🔑 Summary

- All changes go through Pull Requests into `develop`.
- CI (`all-checks-passed`) must complete successfully.
- History is linear, without merge commits.
- Branches `develop` and `main` cannot be deleted or pushed to directly.
- For the diploma project, approvals = 0, but in a real project usually 1–2 are required.
