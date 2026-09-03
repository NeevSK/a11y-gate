/**
 * @intuitui/a11y-gate - Spatial Harmony & Typographic Geometry Engine
 * Implements:
 * 1. Fluid responsive clamp CSS generator (Utopia math)
 * 2. 4px / 8px Spatial quantum interval verification
 * 3. WCAG 2.2 Target Size evaluation (SC 2.5.5 AAA / 2.5.8 AA)
 * 4. Cognitive Reading Measure bounds (45 - 75ch)
 */
export interface FluidClampConfig {
    minSizePx: number;
    maxSizePx: number;
    minViewportPx?: number;
    maxViewportPx?: number;
}
export declare function generateFluidClamp(config: FluidClampConfig): string;
export declare function getModularStep(step: number, baseSizePx?: number, ratio?: number): number;
export declare const SPATIAL_INTERVALS: readonly [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128];
export declare function isValidSpatialQuantum(px: number): boolean;
export declare const TOUCH_TARGET_STANDARDS: {
    WCAG_AA_MIN_PX: number;
    WCAG_AAA_TARGET_PX: number;
    RECOMMENDED_TOUCH_PX: number;
};
export declare function evaluateTargetSize(widthPx: number, heightPx: number): {
    passesAa: boolean;
    passesAaa: boolean;
    minDimension: number;
};
export declare function evaluateReadingMeasure(charCount: number): {
    charCount: number;
    isOptimal: boolean;
    isTooNarrow: boolean;
    isTooWide: boolean;
};
