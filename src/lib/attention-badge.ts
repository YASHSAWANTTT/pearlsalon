export function formatAttentionCount(count: number) {
  if (count <= 0) return null;
  return count > 5 ? "5+" : String(count);
}
