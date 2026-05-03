# Task Progress: Fix Projects Member Addition (400 Error)

**Approved Plan:**
1. Backend: Accept `userEmail` → lookup `userId`.
2. Frontend: "Member email" input → send `userEmail`.
3. Validation: Accept email OR UUID.

**Steps:**
- [x] Create TODO.md
- [x] Update middleware/validation.js (validateMember)
- [x] Update controllers/projectController.js (addMember lookup) 
- [x] Update frontend/src/pages/Projects.jsx (input → email)
- [x] Test endpoint (fixed 400 error)
- [x] Update README


