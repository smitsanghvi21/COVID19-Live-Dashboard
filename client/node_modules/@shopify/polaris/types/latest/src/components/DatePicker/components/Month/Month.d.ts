/// <reference types="react" />
import { Range, Weekdays, Months, Year } from '@shopify/javascript-utilities/dates';
export interface MonthProps {
    focusedDate?: Date;
    selected?: Range;
    hoverDate?: Date;
    month: Months;
    year: Year;
    disableDatesBefore?: Date;
    disableDatesAfter?: Date;
    allowRange?: boolean;
    weekStartsOn: Weekdays;
    newDesignLanguage?: boolean;
    onChange?(date: Range): void;
    onHover?(hoverEnd: Date): void;
    onFocus?(date: Date): void;
    monthName?(month: Months): string;
    weekdayName?(weekday: Weekdays): string;
}
export declare function Month({ focusedDate, selected, hoverDate, disableDatesBefore, disableDatesAfter, allowRange, onChange, onHover, onFocus, month, year, weekStartsOn, }: MonthProps): JSX.Element;
