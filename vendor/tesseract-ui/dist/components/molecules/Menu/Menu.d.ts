export function Menu({ open: openProp, defaultOpen, onOpenChange, children, ...rest }: {
    [x: string]: any;
    open: any;
    defaultOpen?: boolean | undefined;
    onOpenChange: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace Menu {
    let displayName: string;
}
export function MenuContent({ side, align, sideOffset, className, style, children, ...props }: {
    [x: string]: any;
    side?: string | undefined;
    align?: string | undefined;
    sideOffset?: number | undefined;
    className: any;
    style: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element | null;
export namespace MenuContent {
    let displayName_1: string;
    export { displayName_1 as displayName };
}
export function MenuItem({ icon, shortcut, danger, disabled, onSelect, onClick, children, className, ...props }: {
    [x: string]: any;
    icon: any;
    shortcut: any;
    danger?: boolean | undefined;
    disabled?: boolean | undefined;
    onSelect: any;
    onClick: any;
    children: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace MenuItem {
    let displayName_2: string;
    export { displayName_2 as displayName };
}
export function MenuSeparator({ className, ...rest }: {
    [x: string]: any;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace MenuSeparator {
    let displayName_3: string;
    export { displayName_3 as displayName };
}
export function MenuLabel({ className, children, ...rest }: {
    [x: string]: any;
    className: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace MenuLabel {
    let displayName_4: string;
    export { displayName_4 as displayName };
}
export const MenuTrigger: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
export default Menu;
import * as React from "react";
