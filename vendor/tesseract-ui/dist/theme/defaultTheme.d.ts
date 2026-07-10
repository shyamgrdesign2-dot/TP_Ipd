export namespace defaultTheme {
    export let colorScheme: string;
    export { ICON_BASE_DEFAULT as iconBaseUrl };
    export namespace breakpoints {
        let mobile: number;
        let tablet: number;
        let desktop: number;
    }
    export namespace foundation {
        namespace colors {
            let blue: {
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
            let violet: {
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
            let amber: {
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
            let slate: {
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
            let success: {
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
            let warning: {
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
            let error: {
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
        }
        namespace typography {
            let fontHeading: string;
            let fontBody: string;
            let fontMono: string;
            namespace weight {
                let regular: number;
                let medium: number;
                let semibold: number;
                let bold: number;
                let extrabold: number;
            }
            let scale: {
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
        }
        let spacing: {
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
        let radius: {
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
        let shadow: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            "2xl": string;
        };
    }
    export namespace components {
        namespace button {
            let radius_1: string;
            export { radius_1 as radius };
            export namespace height {
                let sm: string;
                let md: string;
                let lg: string;
            }
            export let fontWeight: number;
        }
        namespace input {
            let radius_2: string;
            export { radius_2 as radius };
            export namespace height_1 {
                let sm_1: string;
                export { sm_1 as sm };
                let md_1: string;
                export { md_1 as md };
                let lg_1: string;
                export { lg_1 as lg };
            }
            export { height_1 as height };
        }
        namespace card {
            let radius_3: string;
            export { radius_3 as radius };
            let shadow_1: string;
            export { shadow_1 as shadow };
        }
        namespace badge {
            let radius_4: string;
            export { radius_4 as radius };
        }
        namespace dropdown {
            let radius_5: string;
            export { radius_5 as radius };
            let shadow_2: string;
            export { shadow_2 as shadow };
        }
    }
}
export default defaultTheme;
import { ICON_BASE_DEFAULT } from "../components/atoms/icons/tp/iconBase";
