/**
 * Appends a two-digit hex alpha to a 6-digit hex color string.
 * alpha: 0–255 (e.g. 8 ≈ 3%, 18 ≈ 7%, 96 ≈ 38%)
 * Falls back to the original color string for non-hex inputs.
 */
export function hexOpacity(color: string, alpha: number): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  return color + Math.round(alpha).toString(16).padStart(2, '0');
}
