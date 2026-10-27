const pad = (n) => String(n).padStart(2, '0')
const localStamp = (d) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
const utcStamp = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
const escape = (s = '') => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

/** Builds an .ics file for the date and triggers a download (works with Apple, Google & Outlook). */
export function downloadCalendarInvite({ title, start, durationHours = 3, location, description }) {
  const startDate = new Date(start)
  const endDate = new Date(startDate.getTime() + durationHours * 3600 * 1000)

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Just For You//Date Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@just-for-you`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${localStamp(startDate)}`,
    `DTEND:${localStamp(endDate)}`,
    `SUMMARY:${escape(title)}`,
    `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'our-date.ics' })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
