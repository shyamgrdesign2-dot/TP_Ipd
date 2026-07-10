/**
 * Resolve a cell's status ring colour.
 *   1. column.validate(value, row) wins when it returns a status.
 *   2. else, a `search` column with `flagCustom` rings any value that is NOT in
 *      its option list — i.e. a custom / not-from-database entry. `flagCustom`
 *      may be `true` (→ "warning"), or an explicit "warning" | "error".
 * Opt-in: with no validate and no flagCustom, a cell shows no status ring.
 */
export function resolveStatus(c: any, value: any, row: any): any;
export function toOptions(opts: any): any;
export namespace TYPE_WIDTHS {
    namespace number {
        let minWidth: number;
        let maxWidth: number;
    }
    namespace date {
        let minWidth_1: number;
        export { minWidth_1 as minWidth };
        let maxWidth_1: number;
        export { maxWidth_1 as maxWidth };
    }
    namespace select {
        let minWidth_2: number;
        export { minWidth_2 as minWidth };
        let maxWidth_2: number;
        export { maxWidth_2 as maxWidth };
    }
    namespace multiselect {
        let minWidth_3: number;
        export { minWidth_3 as minWidth };
        let maxWidth_3: number;
        export { maxWidth_3 as maxWidth };
    }
    namespace combo {
        let minWidth_4: number;
        export { minWidth_4 as minWidth };
        let maxWidth_4: number;
        export { maxWidth_4 as maxWidth };
    }
    namespace text {
        let minWidth_5: number;
        export { minWidth_5 as minWidth };
        let maxWidth_5: number;
        export { maxWidth_5 as maxWidth };
    }
    namespace search {
        let minWidth_6: number;
        export { minWidth_6 as minWidth };
        let maxWidth_6: number;
        export { maxWidth_6 as maxWidth };
    }
}
export function columnWidthStyle(c: any): {
    width: any;
    minWidth: any;
    maxWidth: any;
};
export function showsKeyHints(c: any): boolean;
