/** Today's date as a local YYYY-MM-DD string (the date picker's minimum). */
export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatISODate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(
    new Date(y, m - 1, d),
  )
}

/** Turns a saved plan into readable labels using the planner config. */
export function describePlan(plan, planner) {
  if (!plan) return null
  const option = planner.options.find((o) => o.id === plan.optionId)
  const day = planner.days.find((d) => d.value === plan.day)
  const when = plan.day === 'custom' && plan.customDate ? formatISODate(plan.customDate) : (day?.label ?? '')
  return { what: option?.label ?? '', when, note: plan.note ?? '' }
}

export function planToText(plan, planner, herName) {
  const d = describePlan(plan, planner)
  if (!d) return ''
  const lines = ['Our little date ♡']
  if (d.what) lines.push(`What: ${d.what}`)
  if (d.when) lines.push(`When: ${d.when}`)
  if (d.note) lines.push(`Note: ${d.note}`)
  if (herName) lines.push(`— planned by ${herName}`)
  return lines.join('\n')
}

/** Copies text to the clipboard, with a fallback for older or non-secure contexts. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const active = document.activeElement
    try {
      const area = Object.assign(document.createElement('textarea'), { value: text, readOnly: true })
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      return ok
    } catch {
      return false
    } finally {
      if (active instanceof HTMLElement) active.focus({ preventScroll: true })
    }
  }
}
