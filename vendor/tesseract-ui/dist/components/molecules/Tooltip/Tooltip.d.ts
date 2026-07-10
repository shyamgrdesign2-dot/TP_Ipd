export function TooltipProvider({ delayDuration, children }: {
    delayDuration?: number | undefined;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace TooltipProvider {
    let displayName: string;
}
export function Tooltip({ content, children, side, align, sideOffset, collisionPadding, delayDuration, closeDelay, skipDelayDuration, variant, arrow, arrowSize, maxWidth, disabled, whenTruncated, interactive, trigger, dismissible, icon, closeIcon, portalContainer, className, open: openProp, defaultOpen, onOpenChange, }: {
    content: any;
    children: any;
    side?: string | undefined;
    align?: string | undefined;
    sideOffset?: number | undefined;
    collisionPadding?: number | undefined;
    delayDuration: any;
    closeDelay?: number | undefined;
    skipDelayDuration: any;
    variant?: string | undefined;
    arrow?: boolean | undefined;
    arrowSize?: number | undefined;
    maxWidth?: number | undefined;
    disabled?: boolean | undefined;
    whenTruncated?: boolean | undefined;
    interactive?: boolean | undefined;
    trigger?: string | undefined;
    dismissible?: boolean | undefined;
    icon: any;
    closeIcon: any;
    portalContainer: any;
    className: any;
    open: any;
    defaultOpen: any;
    onOpenChange: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace Tooltip {
    let displayName_1: string;
    export { displayName_1 as displayName };
}
export const TooltipTrigger: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
export const TooltipContent: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
export default Tooltip;
import * as React from "react";
