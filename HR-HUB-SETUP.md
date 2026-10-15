# Simple employee profiles — upload proof and adjust points

## Workflow

Open EMPLOYEE PROFILES → choose branch → tap employee → tap IR, NTE, Resume, Awards, Certifications or Appraisal → upload proof → choose No change, Demerit or Merit → Save.

Employee cards appear directly from existing acknowledgments. There is no import button. Opening a profile links it to the existing private HR records. Matching employee IDs and names link safely; conflicting identities require HR verification.

Only the current points appear in the profile. Example: upload an IR and choose a 3-point demerit; saving records the attachment in that employee's IR tile and changes 100 to 97 immediately. HR does not need a second approval step. No points change without valid proof. Repeated requests do not apply the same change twice.

Up to five PDF/JPG/PNG files, 5 MB each and 10 MB total. Notes are optional. Points history and existing policy acknowledgments remain in the employee profile. Top employees are available in a collapsed section of each branch.

## Activation status

This simplified revision is prepared and tested but is not activated yet. The private Google Apps Script quick_record action must be deployed before merging this frontend revision. Google sign-in is currently blocking that private backend update. The existing live Version 6 is unchanged.

## Backend maintenance

Keep policyDoPost and the original acknowledgment/policy functions. Replace only the HR extension with the updated privately supplied HRHub.gs. Deploy a new version on the same existing web-app URL; keep credentials and sharing unchanged. This version adds quick_record and multiple-file downloads. Existing records remain intact.

The dashboard response includes quickRecord:true only after activation. The frontend disables the new Save action if the deployed backend does not support it; it never falsely reports that an immediate adjustment was saved.

## Access

Uses the existing administrator session. Files stay in the restricted Drive folder and are downloaded through the authorized backend. The shared administrator is recorded as HR administrator; individual accounts are not part of this change. Point changes are records of HR actions and do not automatically trigger an employment decision.

## Checks

Syntax and backend fixtures passed. Tests cover the exact 100 → 97 example, required proof, invalid files, multiple attachments, no-change records, immediate merits, retries, attachment ownership and invalid adjustments. Browser verification awaits private backend activation.
