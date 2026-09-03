/**
 * @intuitui/a11y-gate - Universal Token & Gate Types
 */
export interface TokenPair {
    id: string;
    name: string;
    theme?: string;
    fg: string;
    bg: string;
    expectedWcagMin?: number;
    expectedApcaMin?: number;
    usage?: string;
}
export interface TypeScaleSpec {
    name: string;
    step: number;
    minPx: number;
    maxPx: number;
    clampCss: string;
    lineHeight: number;
    letterSpacingEm: number;
    recommendedMeasureCh: number;
}
export interface GateConfig {
    name: string;
    tokens: TokenPair[];
    typeScale?: Record<string, TypeScaleSpec>;
    spatialIntervals?: readonly number[];
    minimumMicroPx?: number;
    testCvd?: boolean;
}
