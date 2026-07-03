export function buildWhatsAppShareUrl(text: string, url: string): string {
  const message = `${text}\n${url}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function openWhatsAppShare(text: string, url: string): void {
  window.open(buildWhatsAppShareUrl(text, url), '_blank', 'noopener,noreferrer')
}
