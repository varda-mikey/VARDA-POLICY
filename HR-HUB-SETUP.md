# Employee 201 & V-Points

Adds a simple HR dashboard, employee profiles, record tiles, and approved point history to the existing policy app. The employee policy and acknowledgment workflow stays available.

## Activation status

Activated on October 15, 2026. The connected Apps Script deployment is Version 6; the frontend is published from main. Private storage initialization passed with 100 starting points and PRIVATE visibility. The policy library loaded successfully after deployment. HR dashboard authentication and employee import verification remain pending until the administrator signs in. The numbered steps below describe the installation procedure for future maintenance; do not repeat them on the already activated deployment.

1. In the currently connected Apps Script project, verify that the original administrator login caches sessions under `admin_` + token. The add-on deliberately accepts only that administrator session, not a policy-editor session.
2. Make a copy of the current project source. Rename its existing `doPost` function to `policyDoPost`. Keep all other functions, settings, and credentials unchanged.
3. Add the privately supplied `HRHub.gs` file. Do not commit live backend source, credentials, or employee information to this repository.
4. Update the SAME existing web-app deployment with a new version. Keep its URL and audience settings unchanged. Authorize additional Drive access if Google requests it.
5. Merge the frontend change. Open HR – EMPLOYEE RECORDS with the Acknowledged Employees admin password. Choose a branch and click IMPORT BRANCH EMPLOYEES.
6. Verify existing acknowledgments still open. Use a designated test employee to check uploads, pending assessments, approval, reversal, and ranking before using it for real personnel decisions.

## Simple HR workflow

Choose branch → Open profile → Choose a tile → Add a record with a supporting file.

Tiles: Resume, Incident Reports, NTE, Awards, Certifications, Appraisal, Policy Acknowledgments, V-Points History.

- Profiles start at 100 points. An ordinary record has no point effect.
- A merit or demerit stays Pending until reviewed. Only Approved transactions affect points.
- Approval records reviewer name, decision reason, and verification checks. Demerit approval also requires an employee-response review confirmation. HR must attach the relevant case evidence and actually perform that review.
- Point reversals keep the original decision and create an equal opposite transaction. Approved records are not silently rewritten.
- Files accept PDF, JPG, or PNG, up to 5 MB. They remain in the restricted Drive folder and are downloaded through the authorized backend, not public links.
- Repeated acknowledgments with the same employee ID and matching name/branch link to one profile. Conflicting IDs stop import for HR verification. Different IDs are never merged by name alone.
- Branch transfers or changed IDs require verified migration; this first version blocks conflicting imports instead of guessing.
- Rankings include imported employees only, use approved scores, and include ties at the cutoff. No score triggers automatic employment action.

## Access and operating limits

This release uses the existing shared administrator password/session for HR records. The names entered in Recorded by / Reviewed by are self-reported labels; they are not separately verified individual accounts. Individual accounts and separate approver roles require an authentication upgrade. Do not give the administrator password to staff who should not access personnel records.

The private backend stores a small-team JSON index under the existing restricted records folder, plus private attachments. Check the parent folder's existing permissions before activation. Its append-only application history is not a tamper-proof audit log against the Drive owner. Records are not saved in browser local storage.

## Validation completed before activation

JavaScript syntax checks and backend fixture tests cover invalid sessions, legacy routing, duplicate imports, conflicting employee identities, pending and approved scores, approval requirements, duplicate retries, reversals, merits, declined cases, attachment signatures, dates, and file ownership.

Actual Apps Script initialization and deployment succeeded. The published frontend contains the new HR entry, and policy synchronization succeeds. Authenticated dashboard/profile layout, employee import, upload/download, and approval verification remain pending. No real employee assessments have been created.
