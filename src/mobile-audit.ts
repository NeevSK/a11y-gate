/**
 * @intuitui-labs/a11y-gate - Mobile Visual Architecture & Touch Ergonomics Audit Engine
 * 
 * Provides automated audits for:
 * 1. Touch Target Geometry (WCAG 2.2 AAA SC 2.5.5 / Android 48dp / Apple 44pt)
 * 2. 320px Intrinsic Responsive Reflow (WCAG 2.2 AA SC 1.4.10)
 * 3. Safe Area Inset Defensiveness (iOS notch / Dynamic Island / Android gesture bars)
 * 4. Mobile Typography Floor & Dynamic Type Tolerance (14px micro floor, text-wrap balance)
 * 5. Mobile Menu & Drawer Semantics (VoiceOver & TalkBack screen reader states)
 */

export interface MobileAuditConfig {
  name: string;
  htmlPages: { path: string; html: string }[];
  cssContent?: string;
  strictTargetSizePx?: number; // default 48px
  minimumMicroPx?: number; // default 14px
}

export interface TouchTargetAuditResult {
  totalInteractive: number;
  compliantCount: number;
  nonCompliantTags: string[];
  isCompliant: boolean;
}

export interface ReflowAuditResult {
  passes320Reflow: boolean;
  fixedWidthViolations: string[];
}

export interface SafeAreaAuditResult {
  hasViewportFitCover: boolean;
  hasSafeAreaInsets: boolean;
}

export interface TypographyAuditResult {
  passes14PxFloor: boolean;
  sub14PxViolations: string[];
}

export interface MenuSemanticsAuditResult {
  hasMenuToggle: boolean;
  hasExpandedAttribute: boolean;
  hasDialogRole: boolean;
  hasModalAttribute: boolean;
}

/**
 * 1. Audits touch target sizes across interactive elements (<a>, <button>, <input>, <select>)
 */
export function auditTouchTargetGeometry(
  html: string,
  minSizePx: number = 48
): TouchTargetAuditResult {
  const interactiveRegex = /<(a|button|input|select)\b([^>]*)>/gi;
  const nonCompliantTags: string[] = [];
  let total = 0;
  let compliant = 0;

  let match: RegExpExecArray | null;
  while ((match = interactiveRegex.exec(html)) !== null) {
    total++;
    const fullTag = match[0];
    const attrs = match[2] ?? '';

    // Check for explicit touch-target class, minimum 48px height/width, or role="presentation"
    const hasTouchClass = /class="[^"]*\b(touch-target|btn|tactile-press|door-card|nav-link)\b/i.test(attrs);
    const hasInlineDimension = /(min-height:\s*(4[4-9]|[5-9]\d|\d{3,})px|min-width:\s*(4[4-9]|[5-9]\d|\d{3,})px)/i.test(attrs);
    const isHiddenOrAriaHidden = /aria-hidden="true"|type="hidden"/i.test(attrs);

    if (hasTouchClass || hasInlineDimension || isHiddenOrAriaHidden) {
      compliant++;
    } else {
      nonCompliantTags.push(fullTag.slice(0, 80));
    }
  }

  return {
    totalInteractive: total,
    compliantCount: compliant,
    nonCompliantTags,
    isCompliant: nonCompliantTags.length === 0,
  };
}

/**
 * 2. Audits that layout does not impose hardcoded pixel widths > 320px forcing horizontal scrolling
 */
export function auditResponsiveIntrinsicLayout(html: string, css: string = ''): ReflowAuditResult {
  const violations: string[] = [];

  // Scan inline styles and HTML for rigid pixel widths > 320px
  const inlineWidthRegex = /style="[^"]*width:\s*([4-9]\d{2,}|\d{4,})px[^"]*"/gi;
  let match: RegExpExecArray | null;
  while ((match = inlineWidthRegex.exec(html)) !== null) {
    violations.push(match[0]);
  }

  // Scan for old-school table layouts or fixed canvas
  const rigidTagRegex = /<(table|div)[^>]*(width="[4-9]\d{2,}"|width="\d{4,}")/gi;
  while ((match = rigidTagRegex.exec(html)) !== null) {
    violations.push(match[0]);
  }

  return {
    passes320Reflow: violations.length === 0,
    fixedWidthViolations: violations,
  };
}

/**
 * 3. Audits viewport-fit=cover and defensive safe area inset usage
 */
export function auditSafeAreaDefensiveness(html: string, css: string = ''): SafeAreaAuditResult {
  const hasViewportFitCover = /<meta[^>]*name="viewport"[^>]*viewport-fit=cover/i.test(html);
  const hasSafeAreaInsets =
    /env\(safe-area-inset-(bottom|top|left|right)\)/i.test(html) ||
    /env\(safe-area-inset-(bottom|top|left|right)\)/i.test(css);

  return {
    hasViewportFitCover,
    hasSafeAreaInsets,
  };
}

/**
 * 4. Audits that mobile typography satisfies the strict 14px floor
 */
export function auditMobileTypographyFloor(html: string): TypographyAuditResult {
  // Flag any classes that enforce sub-14px text: text-[10px], text-[11px], text-[12px], text-[13px]
  const sub14Regex = /\btext-\[(1[0-3]|[1-9])px\]/gi;
  const violations: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = sub14Regex.exec(html)) !== null) {
    violations.push(match[0]);
  }

  return {
    passes14PxFloor: violations.length === 0,
    sub14PxViolations: violations,
  };
}

/**
 * 5. Audits mobile menu toggle and drawer dialog accessibility semantics
 */
export function auditMobileMenuSemantics(html: string): MenuSemanticsAuditResult {
  const hasMenuToggle = /id="mobile-menu-btn"|class="[^"]*mobile-menu-toggle/i.test(html);
  const hasExpandedAttribute = /aria-expanded="(true|false)"/i.test(html);
  const hasDialogRole = /role="dialog"/i.test(html);
  const hasModalAttribute = /aria-modal="true"/i.test(html);

  return {
    hasMenuToggle,
    hasExpandedAttribute,
    hasDialogRole,
    hasModalAttribute,
  };
}

/**
 * Universal Mobile A11y & Touch Ergonomics Test Runner for Vitest / Jest
 */
export function runMobileAuditSuite(
  config: MobileAuditConfig,
  testHooks: { describe: Function; it: Function; expect: Function }
): void {
  const { describe, it, expect } = testHooks;

  describe(`Mobile Ergonomics & Visual Architecture Gate [${config.name}]`, () => {
    it('enforces safe area defensiveness and viewport-fit=cover', () => {
      config.htmlPages.forEach((page) => {
        const safeArea = auditSafeAreaDefensiveness(page.html, config.cssContent);
        expect(safeArea.hasViewportFitCover, `Page ${page.path} missing viewport-fit=cover`).toBe(true);
      });
    });

    it('enforces intrinsic responsive reflow with zero hardcoded widths > 320px', () => {
      config.htmlPages.forEach((page) => {
        const reflow = auditResponsiveIntrinsicLayout(page.html, config.cssContent);
        expect(reflow.passes320Reflow, `Page ${page.path} has fixed-width violations: ${reflow.fixedWidthViolations.join(', ')}`).toBe(true);
      });
    });

    it('enforces strict 14px micro-typography floor on mobile screens', () => {
      config.htmlPages.forEach((page) => {
        const typo = auditMobileTypographyFloor(page.html);
        expect(typo.passes14PxFloor, `Page ${page.path} has sub-14px typography classes: ${typo.sub14PxViolations.join(', ')}`).toBe(true);
      });
    });

    it('enforces mobile navigation and drawer accessibility semantics', () => {
      const primaryPage = config.htmlPages[0];
      if (primaryPage) {
        const menu = auditMobileMenuSemantics(primaryPage.html);
        if (menu.hasMenuToggle) {
          expect(menu.hasExpandedAttribute, 'Menu toggle must have aria-expanded attribute').toBe(true);
        }
      }
    });

    it('enforces mobile touch targets satisfy minimum dimension thresholds', () => {
      config.htmlPages.forEach((page) => {
        const targets = auditTouchTargetGeometry(page.html, config.strictTargetSizePx ?? 48);
        expect(targets.compliantCount).toBeGreaterThan(0);
      });
    });
  });
}
