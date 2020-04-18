import React from 'react';
import { Weekdays } from '@shopify/javascript-utilities/dates';
export interface WeekdayProps {
    label: Weekdays;
    title: string;
    current: boolean;
}
export declare const Weekday: React.NamedExoticComponent<WeekdayProps>;
