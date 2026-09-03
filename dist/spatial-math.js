/**
 * @intuitui/a11y-gate - Spatial Harmony & Typographic Geometry Engine
 * Implements:
 * 1. Fluid responsive clamp CSS generator (Utopia math)
 * 2. 4px / 8px Spatial quantum interval verification
 * 3. WCAG 2.2 Target Size evaluation (SC 2.5.5 AAA / 2.5.8 AA)
 * 4. Cognitive Reading Measure bounds (45 - 75ch)
 */
export function generateFluidClamp(config) {
    const minVp = config.minViewportPx ?? 360;
    const maxVp = config.maxViewportPx ?? 1280;
    const minRem = (config.minSizePx / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
    const maxRem = (config.maxSizePx / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
    const slope = (config.maxSizePx - config.minSizePx) / (maxVp - minVp);
    const slopeVw = (slope * 100).toFixed(4).replace(/\.?0+$/, '') + 'vw';
    const yIntersectionPx = config.minSizePx - slope * minVp;
    const yIntersectionRem = (yIntersectionPx / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
    const preferred = yIntersectionPx === 0
        ? slopeVw
        : yIntersectionPx > 0
            ? `${yIntersectionRem} + ${slopeVw}`
            : `${slopeVw} - ${Math.abs(yIntersectionPx / 16).toFixed(4)}rem`;
    return `clamp(${minRem}, ${preferred}, ${maxRem})`;
}
export function getModularStep(step, baseSizePx = 18, ratio = 1.25) {
    return Math.round(baseSizePx * Math.pow(ratio, step) * 100) / 100;
}
export const SPATIAL_INTERVALS = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128];
export function isValidSpatialQuantum(px) {
    return px % 4 === 0;
}
export const TOUCH_TARGET_STANDARDS = {
    WCAG_AA_MIN_PX: 24,
    WCAG_AAA_TARGET_PX: 44,
    RECOMMENDED_TOUCH_PX: 48,
};
export function evaluateTargetSize(widthPx, heightPx) {
    const minDim = Math.min(widthPx, heightPx);
    return {
        passesAa: minDim >= TOUCH_TARGET_STANDARDS.WCAG_AA_MIN_PX,
        passesAaa: minDim >= TOUCH_TARGET_STANDARDS.WCAG_AAA_TARGET_PX,
        minDimension: minDim,
    };
}
export function evaluateReadingMeasure(charCount) {
    return {
        charCount,
        isOptimal: charCount >= 45 && charCount <= 75,
        isTooNarrow: charCount < 40,
        isTooWide: charCount > 85,
    };
}
