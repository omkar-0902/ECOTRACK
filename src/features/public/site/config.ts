/**
 * Company details for the public site. Leave a value empty until the real
 * detail is confirmed: anything that depends on it stays hidden rather than
 * showing a placeholder, an invented address or a form that goes nowhere.
 */
export const COMPANY = {
  /** Where enquiries should go, e.g. 'hello@your-domain'. Enables the contact form (via the visitor's email app). */
  contactEmail: '',
  /**
   * Optional form endpoint that accepts a JSON POST and returns 2xx on success
   * (for example a form service or your own API). Takes priority over email.
   */
  enquiryEndpoint: '',
} as const

export type EnquiryChannel = { kind: 'endpoint'; url: string } | { kind: 'email'; address: string } | null

/** How enquiries are delivered, or null while nothing is configured. */
export function enquiryChannel(): EnquiryChannel {
  const url = COMPANY.enquiryEndpoint.trim()
  if (url) return { kind: 'endpoint', url }
  const address = COMPANY.contactEmail.trim()
  if (address) return { kind: 'email', address }
  return null
}

/** Where "Request a demo" points: the contact section, when enquiries can be delivered. */
export const CONTACT_PATH = '/overview#contact'
