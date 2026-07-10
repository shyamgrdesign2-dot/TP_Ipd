/**
 * Generate a 50→900 ramp from a single base colour placed at step 500.
 * 50–400 tint toward white; 600–900 shade toward black.
 */
export function ramp(base: any): {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: any;
    600: string;
    700: string;
    800: string;
    900: string;
};
export function createTheme(seed?: {}): any;
export default createTheme;
