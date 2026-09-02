/**
 * The site's single accent colour.
 *
 * This replaces the eight-hue picker that let every visitor choose their own
 * accent: a per-visitor colour cannot be a brand, it was stored in localStorage
 * so the site changed appearance between devices, and the value was applied in
 * an effect after hydration, which produced a visible colour flash on load.
 *
 * The value lives in CSS (`--accent-color` in globals.css). Components use the
 * variable rather than a JavaScript string so there is one definition.
 *
 * `accentAlpha` exists because the old code built translucent variants by
 * appending hex digits to an `oklch()` string — `${accentColor}40` produced
 * `oklch(0.7 0.18 240)40`, which is not a valid colour, so those declarations
 * were dropped and the glow, focus ring and hover states silently never
 * rendered. `color-mix` is the correct way to do this with a CSS variable.
 */

export const ACCENT = 'var(--accent-color)';

/** Accent colour at `percent` opacity, e.g. accentAlpha(25) for a soft glow. */
export function accentAlpha(percent: number): string {
  return `color-mix(in oklch, var(--accent-color) ${percent}%, transparent)`;
}
