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
export declare const SPRING_PRESETS: Record<MotionIntensity, SpringSpec>;
/**
 * Computes custom spring parameters along a continuous gradient from 0.0 (still) to 1.0 (maximum)
 */
export declare function getInterpolatedMotion(intensity: number): SpringSpec;
/**
 * Generates cursor-following ambient radial illumination CSS parameters
 */
export interface AmbientGlowConfig {
    xPercent: number;
    yPercent: number;
    radiusPx?: number;
    colorRgba?: string;
    opacity?: number;
}
export declare function generateAmbientGlowCss(config: AmbientGlowConfig): string;
/**
 * Checks if reduced motion media query is currently matched in environment
 */
export declare function prefersReducedMotion(): boolean;
