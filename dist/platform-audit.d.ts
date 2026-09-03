/**
 * @intuitui-labs/a11y-gate - Platform-Aware Quality & Accessibility Audit
 *
 * Provides automated, platform-specific validation across:
 * - 'web-desktop': Widescreen layouts, mouse hover physics, keyboard skip-links, desktop nav
 * - 'web-mobile': 48px touch targets, safe area insets, 320px reflow, 14px floor
 * - 'react-native': Token contrast, 48dp targets, Reanimated spring physics
 * - 'universal': Multi-platform verification
 */
import { TokenPair } from './token-types.js';
export type TargetPlatform = 'web-desktop' | 'web-mobile' | 'react-native' | 'universal';
export interface PlatformAuditOptions {
    platform: TargetPlatform;
    html?: string;
    css?: string;
    tokens?: TokenPair[];
}
export interface PlatformCheckResult {
    rule: string;
    platform: TargetPlatform;
    passed: boolean;
    message: string;
}
/**
 * 1. Runtime Platform Environment Detector
 */
export declare function detectCurrentRuntime(): 'browser' | 'node' | 'react-native';
/**
 * 2. Checks CSS for media pointer/hover platform capabilities
 */
export declare function auditPlatformCssCapabilities(css: string): {
    hasDesktopHoverGuard: boolean;
    hasMobileTouchGuard: boolean;
    hasReducedMotionGuard: boolean;
};
/**
 * 3. Platform-Specific Rule Evaluator
 */
export declare function evaluatePlatformRules(options: PlatformAuditOptions): PlatformCheckResult[];
/**
 * 4. Plug-and-Play Test Runner for Vitest / Jest
 */
export declare function runPlatformSuite(options: PlatformAuditOptions, testHooks: {
    describe: Function;
    it: Function;
    expect: Function;
}): void;
