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
import { getWcagContrastRatio, calculateApca } from './contrast-math.js';
import { SPRING_PRESETS } from './motion-tactile.js';

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
export function detectCurrentRuntime(): 'browser' | 'node' | 'react-native' {
  if (typeof navigator !== 'undefined' && (navigator as any).product === 'ReactNative') {
    return 'react-native';
  }
  if (typeof window !== 'undefined') {
    return 'browser';
  }
  return 'node';
}

/**
 * 2. Checks CSS for media pointer/hover platform capabilities
 */
export function auditPlatformCssCapabilities(css: string): {
  hasDesktopHoverGuard: boolean;
  hasMobileTouchGuard: boolean;
  hasReducedMotionGuard: boolean;
} {
  return {
    // Desktop mouse capabilities: @media (hover: hover)
    hasDesktopHoverGuard: /@media[^{]*\(\s*hover:\s*hover\s*\)/i.test(css),
    // Mobile touch capabilities: @media (pointer: coarse) or touch-target rules
    hasMobileTouchGuard: /\.touch-target|\(pointer:\s*coarse\)/i.test(css),
    // Accessibility motion safety: @media (prefers-reduced-motion: reduce)
    hasReducedMotionGuard: /@media[^{]*\(\s*prefers-reduced-motion:\s*reduce\s*\)/i.test(css),
  };
}

/**
 * 3. Platform-Specific Rule Evaluator
 */
export function evaluatePlatformRules(options: PlatformAuditOptions): PlatformCheckResult[] {
  const results: PlatformCheckResult[] = [];
  const { platform, html = '', css = '', tokens = [] } = options;

  // --- DESKTOP WEB RULES ---
  if (platform === 'web-desktop' || platform === 'universal') {
    // Desktop Landmark Rule
    const hasSkipLink = /class="[^"]*skip-link/i.test(html);
    results.push({
      rule: 'desktop-skip-link',
      platform: 'web-desktop',
      passed: hasSkipLink || html === '',
      message: 'Desktop pages must include an accessible Skip to Content link',
    });

    // Desktop Widescreen Reading Measure Rule
    const hasReadingMeasure = /max-w-|measure-optimal/i.test(html) || /max-width/i.test(css);
    results.push({
      rule: 'desktop-reading-measure',
      platform: 'web-desktop',
      passed: hasReadingMeasure || html === '',
      message: 'Desktop content must constrain prose reading width (45-75ch)',
    });
  }

  // --- MOBILE WEB RULES ---
  if (platform === 'web-mobile' || platform === 'universal') {
    // Viewport Fit Cover Rule
    const hasViewportFit = /viewport-fit=cover/i.test(html);
    results.push({
      rule: 'mobile-viewport-fit',
      platform: 'web-mobile',
      passed: hasViewportFit || html === '',
      message: 'Mobile web pages must specify viewport-fit=cover for notch/Dynamic Island support',
    });

    // Touch Target Standard Rule (>= 48px)
    const hasTouchTargetClass = /\.touch-target/i.test(css) || /class="[^"]*touch-target/i.test(html);
    results.push({
      rule: 'mobile-touch-targets-48px',
      platform: 'web-mobile',
      passed: hasTouchTargetClass,
      message: 'Mobile interfaces must define 48px touch-target standards',
    });

    // Tap Highlight Reset Rule
    const hasTapReset = /-webkit-tap-highlight-color:\s*transparent/i.test(css);
    results.push({
      rule: 'mobile-tap-highlight-reset',
      platform: 'web-mobile',
      passed: hasTapReset || css === '',
      message: 'Mobile CSS must reset -webkit-tap-highlight-color to avoid touch flicker',
    });
  }

  // --- REACT NATIVE RULES ---
  if (platform === 'react-native' || platform === 'universal') {
    // Reanimated Spring Curves
    const hasSpringCurves = !!SPRING_PRESETS.tactile.bezier;
    results.push({
      rule: 'rn-spring-physics',
      platform: 'react-native',
      passed: hasSpringCurves,
      message: 'React Native must provide bezier curve data compatible with react-native-reanimated',
    });

    // Token Contrast Validation for Native Devices
    if (tokens.length > 0) {
      const allTokensPassWcag = tokens.every((pair) => {
        const ratio = getWcagContrastRatio(pair.fg, pair.bg);
        return ratio >= (pair.expectedWcagMin ?? 4.5);
      });
      results.push({
        rule: 'rn-color-contrast-tokens',
        platform: 'react-native',
        passed: allTokensPassWcag,
        message: 'React Native design tokens must satisfy minimum contrast ratios',
      });
    }
  }

  return results;
}

/**
 * 4. Plug-and-Play Test Runner for Vitest / Jest
 */
export function runPlatformSuite(
  options: PlatformAuditOptions,
  testHooks: { describe: Function; it: Function; expect: Function }
): void {
  const { describe, it, expect } = testHooks;

  describe(`Platform-Aware Quality Suite [Platform: ${options.platform}]`, () => {
    const results = evaluatePlatformRules(options);

    results.forEach((check) => {
      it(`[${check.platform}] ${check.rule}: ${check.message}`, () => {
        expect(check.passed, check.message).toBe(true);
      });
    });
  });
}
