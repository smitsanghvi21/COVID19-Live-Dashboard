/// <reference types="react" />
import { Range, Months, Year, Weekdays } from '@shopify/javascript-utilities/dates';
export { Months };
export type { Range, Year };
export interface DatePickerProps {
    /** ID for the element */
    id?: string;
    /** The selected date or range of dates */
    selected?: Date | Range;
    /** The month to show */
    month: Months;
    /** The year to show */
    year: Year;
    /** Allow a range of dates to be selected */
    allowRange?: boolean;
    /** Disable selecting dates before this. */
    disableDatesBefore?: Date;
    /** Disable selecting dates after this. */
    disableDatesAfter?: Date;
    /** The selection can span multiple months */
    multiMonth?: boolean;
    /** First day of week. Sunday by default */
    weekStartsOn?: Weekdays;
    /** Callback when date is selected. */
    onChange?(date: Range): void;
    /** Callback when month is changed. */
    onMonthChange?(month: Months, year: Year): void;
}
export declare function DatePicker({ id, selected, month, year, allowRange, multiMonth, disableDatesBefore, disableDatesAfter, weekStartsOn, onMonthChange, onChange, }: DatePickerProps): JSX.Element;
