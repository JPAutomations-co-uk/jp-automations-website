const LOOPS_API_KEY = process.env.LOOPS_API_KEY || ''
const LOOPS_BASE_URL = 'https://app.loops.so/api/v1'

type ContactSource =
  | 'newsletter-popup'
  | 'newsletter-x'
  | 'blueprint'
  | 'client-folder'
  | 'onboarding-system'
  | 'prompt-guide'
  | 'whiteboard-prompt'
  | 'openclaw-guide'
  | 'contact-form'
  | 'apply-form'
  | 'audit-form'

interface CreateContactOptions {
  email: string
  firstName: string
  source: ContactSource
  /** Extra custom properties to set on the contact */
  properties?: Record<string, string | number | boolean>
}

/**
 * Create or update a contact in Loops with source tagging.
 * Non-blocking — catches and logs errors so it never breaks the parent request.
 */
export function addToLoops({ email, firstName, source, properties }: CreateContactOptions): void {
  if (!LOOPS_API_KEY) return

  fetch(`${LOOPS_BASE_URL}/contacts/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      firstName,
      source,
      subscribed: true,
      ...properties,
    }),
  })
    .then(async (res) => {
      // If contact already exists (409), update instead
      if (res.status === 409) {
        return fetch(`${LOOPS_BASE_URL}/contacts/update`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            firstName,
            source,
            ...properties,
          }),
        })
      }
      if (!res.ok) {
        const text = await res.text()
        console.error('Loops create contact error:', res.status, text)
      }
    })
    .catch((err) => console.error('Loops API error:', err))
}
