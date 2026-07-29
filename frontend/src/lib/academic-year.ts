/** Indonesia school year: July–June (e.g. July 2026 → 2026/2027). */
export function getAcademicYear(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const startYear = month >= 7 ? year : year - 1
  return `${startYear}/${startYear + 1}`
}
