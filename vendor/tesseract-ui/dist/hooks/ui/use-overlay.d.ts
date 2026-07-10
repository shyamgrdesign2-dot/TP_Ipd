/**
 * useEscape — invokes `onEscape` when the user presses Escape while
 * `active` is true. Listener is attached on the window with capture
 * so nested handlers can stop propagation if they need to.
 */
export function useEscape(onEscape: any, active?: boolean): void;
/**
 * useClickOutside — invokes `onOutside` when a pointerdown happens
 * outside any of the supplied refs. Active only while `active` is true.
 */
export function useClickOutside(refs: any, onOutside: any, active?: boolean): void;
/**
 * useScrollLock — locks <body> scroll while `active` is true. Restores
 * the previous overflow on cleanup. Compensates for the scrollbar so
 * the layout doesn't shift.
 */
export function useScrollLock(active: any): void;
/**
 * useFocusTrap — traps Tab/Shift+Tab inside `containerRef` while
 * `active` is true. On unmount, restores focus to the previously
 * focused element. Used by Dialog and DropdownMenu.
 */
export function useFocusTrap(containerRef: any, active: any): void;
/**
 * usePosition — computes `left`/`top` coordinates for a floating
 * element anchored to a trigger. Recomputes on scroll, resize, and
 * when the floating element's size changes.
 *
 * @param {object} args
 * @param {React.RefObject} args.triggerRef
 * @param {React.RefObject} args.floatingRef
 * @param {boolean} args.open
 * @param {"top"|"bottom"|"left"|"right"} args.side
 * @param {"start"|"center"|"end"} args.align
 * @param {number} args.sideOffset
 * @param {number} args.collisionPadding
 *
 * @returns { x, y, side } — final placement after collision flipping.
 */
export function usePosition({ triggerRef, floatingRef, open, side, align, sideOffset, collisionPadding, }: {
    triggerRef: React.RefObject<any>;
    floatingRef: React.RefObject<any>;
    open: boolean;
    side: "top" | "bottom" | "left" | "right";
    align: "start" | "center" | "end";
    sideOffset: number;
    collisionPadding: number;
}): x;
import * as React from "react";
