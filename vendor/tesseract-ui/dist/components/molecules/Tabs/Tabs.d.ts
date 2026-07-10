export function TabsList({ className, style, fullWidth, children, ...props }: {
    [x: string]: any;
    className?: string | undefined;
    style: any;
    fullWidth?: boolean | undefined;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace TabsList {
    let displayName: string;
}
export function TabsTrigger({ value, className, style, disabled, asChild, onClick, leftIcon, rightIcon, tag, tagTone, children, ...props }: {
    [x: string]: any;
    value: any;
    className?: string | undefined;
    style: any;
    disabled: any;
    asChild?: boolean | undefined;
    onClick: any;
    leftIcon: any;
    rightIcon: any;
    tag: any;
    tagTone?: string | undefined;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace TabsTrigger {
    let displayName_1: string;
    export { displayName_1 as displayName };
}
export function TabsContent({ value, className, style, children, ...props }: {
    [x: string]: any;
    value: any;
    className?: string | undefined;
    style: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element | null;
export namespace TabsContent {
    let displayName_2: string;
    export { displayName_2 as displayName };
}
export const Tabs: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
import * as React from "react";
