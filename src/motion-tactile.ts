/**
 * @intuitui-labs/a11y-gate - Motion & Tactile Physics Architecture
 * 
 * Provides flexible, non-dogmatic physical motion tokens, spring easing curves,
 * and ambient lighting math.
 * 
 * Supports tiered intensities: 'subtle' (restrained) | 'tactile' (balanced) | 'expressive' (punchy)
 * or continuous numeric intensity scale (0.0 to 1.0).
 */

export type MotionIntensity = 'subtle' | 'tactile' | 'expressive';

export interface SpringSpec {
  name: string;
  bezier: string;
  durationMs: number;
  hoverTranslateYPx: number;
  activeScale: number;
  shadowOffsetPx: number;
}

export const SPRING_PRESETS: Record<MotionIntensity, SpringSpec> = {
  subtle: {
    name: 'Subtle / Restrained',
    bezier: 'cubic-bezier(0.25, 1, 0.5, 1)', // Smooth ease-out
    durationMs: 150,
    hoverTranslateYPx: -1,
    activeScale: 0.99,
    shadowOffsetPx: 2,
  },
  tactile: {
    name: 'Tactile / Mechanical',
    bezier: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Snappy spring
    durationMs: 220,
    hoverTranslateYPx: -2,
    activeScale: 0.97,
    shadowOffsetPx: 4,
  },
  expressive: {
    name: 'Expressive / High-Feedback',
    bezier: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Organic bounce
    durationMs: 320,
    hoverTranslateYPx: -4,
    activeScale: 0.95,
    shadowOffsetPx: 6,
  },
};

/**
 * Computes custom spring parameters along a continuous gradient from 0.0 (still) to 1.0 (maximum)
 */
export function getInterpolatedMotion(intensity: number): SpringSpec {
  const clamped = Math.max(0, Math.min(1, intensity));
  return {
    name: `Custom (Intensity ${(clamped * 100).toFixed(0)}%)`,
    bezier: clamped < 0.5 ? SPRING_PRESETS.subtle.bezier : SPRING_PRESETS.tactile.bezier,
    durationMs: Math.round(100 + clamped * 220),
    hoverTranslateYPx: Math.round(-clamped * 4 * 10) / 10,
    activeScale: Math.round((1 - clamped * 0.05) * 1000) / 1000,
    shadowOffsetPx: Math.round(clamped * 6),
  };
}

/**
 * Generates cursor-following ambient radial illumination CSS parameters
 */
export interface AmbientGlowConfig {
  xPercent: number; // 0-100
  yPercent: number; // 0-100
  radiusPx?: number; // default 350px
  colorRgba?: string; // default subtle sky wash
  opacity?: number; // 0-1
}

export function generateAmbientGlowCss(config: AmbientGlowConfig): string {
  const radius = config.radiusPx ?? 350;
  const color = config.colorRgba ?? 'rgba(56, 189, 248, 0.07)';
  const opacity = config.opacity ?? 1;

  return `radial-gradient(${radius}px circle at ${config.xPercent}% ${config.yPercent}%, ${color} 0%, transparent 80%)`;
}

/**
 * Checks if reduced motion media query is currently matched in environment
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
