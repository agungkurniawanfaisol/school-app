/** Capitalize the first letter of each word (split on spaces). */
export function formatTitleCaseWords(value: string): string {
  return value
    .split(/(\s+)/)
    .map((segment) => {
      if (!segment || /^\s+$/.test(segment)) return segment
      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    })
    .join('')
}

/** Capitalize the first alphabetic character at the start of the value. */
export function formatCapitalizeFirst(value: string): string {
  const match = value.match(/^(\s*)(\S)(.*)$/s)
  if (!match) return value

  const [, lead, first, rest] = match
  return `${lead}${first.toUpperCase()}${rest}`
}
