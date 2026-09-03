/**
 * @intuitui/a11y-gate - Universal Vitest / Jest Test Suite Runner
 * Runs all mathematical gates for any application with one line of code:
 * `runA11ySuite({ name: 'Neevsk', tokens: NEEVSK_PAIRS, typeScale: NEEVSK_SCALE }, { describe, it, expect });`
 */
import type { GateConfig } from './token-types.js';
export interface TestRunnerBindings {
    describe: (name: string, fn: () => void) => void;
    it: (name: string, fn: () => void) => void;
    expect: any;
}
export declare function runA11ySuite(config: GateConfig, { describe, it, expect }: TestRunnerBindings): void;
