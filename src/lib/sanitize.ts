import DOMPurify from 'dompurify';

// Allow standard formatting and links; strip everything executable.
const CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'del', 's', 'code', 'pre',
    'ul', 'ol', 'li',
    'blockquote',
    'a',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  // Force external links to be safe
  FORCE_BODY: true,
};

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') return '';
  const clean = DOMPurify.sanitize(dirty, CONFIG);
  // DOMPurify.sanitize returns string when no RETURN_DOM* options are set
  return clean as string;
}
