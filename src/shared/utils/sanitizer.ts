import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
  if (process.server) return html // Should be sanitized on client or with a server-side compatible library
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'br',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'code',
      'pre',
      'span',
      'div',
    ],
    ALLOWED_ATTR: ['href', 'target', 'class', 'style', 'id'],
  })
}
