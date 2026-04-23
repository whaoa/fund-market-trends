export function formatFundChange(change: number, isPercent?: boolean) {
  const value = isPercent ? change.toFixed(2) : change;
  return change > 0 ? `+${value}` : value;
}
