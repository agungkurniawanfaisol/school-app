import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'a',
  'blockquote',
  'br',
  'code',
  'div',
  'em',
  'h2',
  'h3',
  'hr',
  'i',
  'iframe',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'strike',
  'strong',
  'sub',
  'sup',
  'u',
  'ul',
  'video',
]

const ALLOWED_ATTR = [
  'alt',
  'class',
  'controls',
  'data-align',
  'data-column',
  'data-columns',
  'data-video-block',
  'data-youtube-video',
  'height',
  'href',
  'loading',
  'poster',
  'rel',
  'src',
  'style',
  'tabindex',
  'target',
  'title',
  'width',
]

const YOUTUBE_EMBED_PATTERN = /^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\//i

let hooksRegistered = false

function registerHooks() {
  if (hooksRegistered) return
  hooksRegistered = true

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName !== 'iframe' || !(node instanceof HTMLIFrameElement)) {
      return
    }

    const src = node.getAttribute('src') ?? ''
    if (!YOUTUBE_EMBED_PATTERN.test(src)) {
      node.remove()
    }
  })

  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    if (data.attrName === 'href') {
      const value = String(data.attrValue ?? '').trim().toLowerCase()
      if (value.startsWith('javascript:') || value.startsWith('data:')) {
        data.keepAttr = false
      }
      return
    }

    if (data.attrName === 'target' && data.attrValue === '_blank') {
      data.keepAttr = true
    }
  })

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.nodeName === 'IFRAME') {
      node.setAttribute('tabindex', '-1')
      node.setAttribute('loading', 'lazy')
      return
    }

    if (node.nodeName !== 'A') {
      return
    }

    const href = node.getAttribute('href')
    if (!href) {
      const parent = node.parentNode
      if (parent) {
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node)
        }
        parent.removeChild(node)
      }
      return
    }

    if (/^https?:/i.test(href)) {
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

export function sanitizeRichHtml(html: string): string {
  if (!html.trim()) {
    return ''
  }

  registerHooks()

  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/(?!\/)|#)/i,
  })

  return unwrapAnchorsWithoutHref(sanitized)
}

function unwrapAnchorsWithoutHref(html: string): string {
  if (typeof DOMParser === 'undefined') {
    return html.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
  }

  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.body.querySelectorAll('a').forEach((anchor) => {
    const href = anchor.getAttribute('href')?.trim().toLowerCase() ?? ''
    const isUnsafe =
      href === '' || href.startsWith('javascript:') || href.startsWith('data:') || href.startsWith('vbscript:')

    if (!isUnsafe) {
      return
    }

    const fragment = doc.createDocumentFragment()
    while (anchor.firstChild) {
      fragment.appendChild(anchor.firstChild)
    }
    anchor.replaceWith(fragment)
  })

  return doc.body.innerHTML
}
