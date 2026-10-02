/**
 * Pro waitlist → Google Form (responses land in a private Google Sheet).
 * Fill in both IDs from the form's pre-filled link:
 *   https://docs.google.com/forms/d/e/<FORM_ID>/viewform?usp=pp_url&entry.<ENTRY_ID>=...
 */
export const WAITLIST_FORM = {
  FORM_ID: '1FAIpQLSdcqUbCfC6suFOF3e7sMyLe6ZuGGp61twuM6qoEXLo7-qfJoA',
  ENTRY_ID: '145679912',
} as const;

export function isWaitlistFormConfigured(): boolean {
  return !WAITLIST_FORM.FORM_ID.startsWith('REPLACE_') && !WAITLIST_FORM.ENTRY_ID.startsWith('REPLACE_');
}
