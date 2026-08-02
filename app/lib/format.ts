/** Format a number as Malaysian Ringgit, e.g. 12.9 -> "RM 12.90". */
export function rm(amount: number): string {
  return `RM ${amount.toFixed(2)}`
}

/** Format an ISO timestamp as a short local time, e.g. "12:58 PM". */
export function time(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-MY', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
