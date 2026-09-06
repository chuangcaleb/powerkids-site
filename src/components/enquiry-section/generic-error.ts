// Shared between `submit-enquiry.ts` ('use server', handled failures) and
// `enquiry-form.tsx` (client, transport failures that never reach the
// action) so both paths render the same message through the same alert.
export const GENERIC_ERROR =
  'Something went wrong when submitting your enquiry — please try again, or reach us directly through the contact information below.'
