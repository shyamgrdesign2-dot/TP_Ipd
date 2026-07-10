/** Full theme + scheme + active breakpoint. */
export function useTheme(): {
    theme: {
        colorScheme: string;
        iconBaseUrl: string;
        breakpoints: {
            mobile: number;
            tablet: number;
            desktop: number;
        };
        foundation: {
            colors: {
                blue: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                violet: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                amber: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                slate: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                    0: string;
                };
                success: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                warning: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                error: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
            };
            typography: {
                fontHeading: string;
                fontBody: string;
                fontMono: string;
                weight: {
                    regular: number;
                    medium: number;
                    semibold: number;
                    bold: number;
                    extrabold: number;
                };
                scale: {
                    "display-xl": {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    display: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h1: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h2: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h3: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h4: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h5: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h6: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    "body-base": {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    "body-sm": {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    "body-xs": {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    caption: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    micro: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                };
            };
            spacing: {
                "0.5": string;
                1: string;
                "1.5": string;
                2: string;
                3: string;
                4: string;
                5: string;
                6: string;
                8: string;
                10: string;
                12: string;
                16: string;
            };
            radius: {
                0: string;
                4: string;
                6: string;
                8: string;
                10: string;
                12: string;
                16: string;
                20: string;
                24: string;
                full: string;
            };
            shadow: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                "2xl": string;
            };
        };
        components: {
            button: {
                radius: string;
                height: {
                    sm: string;
                    md: string;
                    lg: string;
                };
                fontWeight: number;
            };
            input: {
                radius: string;
                height: {
                    sm: string;
                    md: string;
                    lg: string;
                };
            };
            card: {
                radius: string;
                shadow: string;
            };
            badge: {
                radius: string;
            };
            dropdown: {
                radius: string;
                shadow: string;
            };
        };
    };
    colorScheme: string;
    setColorScheme: () => void;
    breakpoint: string;
    __provided: boolean;
};
/** Active responsive breakpoint name (e.g. "mobile" | "tablet" | "desktop"). */
export function useBreakpoint(): string;
/** Resolved token set for one component, e.g. useComponentTokens("button"). */
export function useComponentTokens(name: any): any;
export const ThemeContext: import("react").Context<{
    theme: {
        colorScheme: string;
        iconBaseUrl: string;
        breakpoints: {
            mobile: number;
            tablet: number;
            desktop: number;
        };
        foundation: {
            colors: {
                blue: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                violet: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                amber: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                slate: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                    0: string;
                };
                success: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                warning: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
                error: {
                    50: any;
                    100: any;
                    200: any;
                    300: any;
                    400: any;
                    500: any;
                    600: any;
                    700: any;
                    800: any;
                    900: any;
                };
            };
            typography: {
                fontHeading: string;
                fontBody: string;
                fontMono: string;
                weight: {
                    regular: number;
                    medium: number;
                    semibold: number;
                    bold: number;
                    extrabold: number;
                };
                scale: {
                    "display-xl": {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    display: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h1: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h2: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h3: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h4: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h5: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    h6: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    "body-base": {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    "body-sm": {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    "body-xs": {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    caption: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                    micro: {
                        size: string;
                        lineHeight: string;
                        weight: number;
                    };
                };
            };
            spacing: {
                "0.5": string;
                1: string;
                "1.5": string;
                2: string;
                3: string;
                4: string;
                5: string;
                6: string;
                8: string;
                10: string;
                12: string;
                16: string;
            };
            radius: {
                0: string;
                4: string;
                6: string;
                8: string;
                10: string;
                12: string;
                16: string;
                20: string;
                24: string;
                full: string;
            };
            shadow: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                "2xl": string;
            };
        };
        components: {
            button: {
                radius: string;
                height: {
                    sm: string;
                    md: string;
                    lg: string;
                };
                fontWeight: number;
            };
            input: {
                radius: string;
                height: {
                    sm: string;
                    md: string;
                    lg: string;
                };
            };
            card: {
                radius: string;
                shadow: string;
            };
            badge: {
                radius: string;
            };
            dropdown: {
                radius: string;
                shadow: string;
            };
        };
    };
    colorScheme: string;
    setColorScheme: () => void;
    breakpoint: string;
    __provided: boolean;
}>;
