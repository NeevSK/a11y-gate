/**
 * @intuitui/a11y-gate - Color Vision Deficiency (CVD) Simulation Engine
 * Implements Brettel-Viénot / Machado LMS Cone-Response Transformation:
 * - Deuteranopia (M-cone deficiency / green-blindness)
 * - Protanopia (L-cone deficiency / red-blindness)
 * - Tritanopia (S-cone deficiency / blue-blindness)
 * - Achromatopsia (Complete rod monochromacy)
 */
import { type RGB } from './contrast-math';
export type CvdType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export declare function simulateCvd(color: RGB | string, type: CvdType): RGB;
export declare function simulateCvdHex(hex: string, type: CvdType): string;
