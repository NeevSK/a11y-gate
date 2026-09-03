/**
 * @intuitui/a11y-gate - Color Vision Deficiency (CVD) Simulation Engine
 * Implements Brettel-Viénot / Machado LMS Cone-Response Transformation:
 * - Deuteranopia (M-cone deficiency / green-blindness)
 * - Protanopia (L-cone deficiency / red-blindness)
 * - Tritanopia (S-cone deficiency / blue-blindness)
 * - Achromatopsia (Complete rod monochromacy)
 */
import { hexToRgb, rgbToHex, sRgbToLinear } from './contrast-math';
export function simulateCvd(color, type) {
    const rgb = typeof color === 'string' ? hexToRgb(color) : color;
    // Linearize to physical photon energy
    const rLin = sRgbToLinear(rgb.r);
    const gLin = sRgbToLinear(rgb.g);
    const bLin = sRgbToLinear(rgb.b);
    let simR = rLin;
    let simG = gLin;
    let simB = bLin;
    if (type === 'achromatopsia') {
        // Complete rod monochromacy (ISO relative luminance)
        const lum = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
        simR = lum;
        simG = lum;
        simB = lum;
    }
    else if (type === 'deuteranopia') {
        // M-cone deficiency (green-blindness, ~6% of male population)
        simR = 0.625 * rLin + 0.375 * gLin;
        simG = 0.7 * rLin + 0.3 * gLin;
        simB = 0.3 * gLin + 0.7 * bLin;
    }
    else if (type === 'protanopia') {
        // L-cone deficiency (red-blindness, ~2% of male population)
        simR = 0.56667 * rLin + 0.43333 * gLin;
        simG = 0.55833 * rLin + 0.44167 * gLin;
        simB = 0.24167 * gLin + 0.75833 * bLin;
    }
    else if (type === 'tritanopia') {
        // S-cone deficiency (blue-blindness, rare)
        simR = 0.95 * rLin + 0.05 * gLin;
        simG = 0.43333 * gLin + 0.56667 * bLin;
        simB = 0.475 * gLin + 0.525 * bLin;
    }
    // De-linearize to 8-bit sRGB
    const toSrgb = (c) => {
        const clamped = Math.max(0, Math.min(1, c));
        const val = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
        return Math.round(Math.max(0, Math.min(255, val * 255)));
    };
    return {
        r: toSrgb(simR),
        g: toSrgb(simG),
        b: toSrgb(simB),
        a: rgb.a ?? 1,
    };
}
export function simulateCvdHex(hex, type) {
    return rgbToHex(simulateCvd(hex, type));
}
