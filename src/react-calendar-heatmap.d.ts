declare module 'react-calendar-heatmap' {
  import { ComponentType } from 'react';

  interface HeatmapValue {
    date: string | Date;
    count?: number;
    [key: string]: any;
  }

  interface CalendarHeatmapProps {
    startDate: Date;
    endDate: Date;
    values: HeatmapValue[];
    classForValue?: (value: HeatmapValue | null) => string;
    tooltipDataAttrs?: (value: HeatmapValue) => { [key: string]: string };
    showWeekdayLabels?: boolean;
    [key: string]: any;
  }

  const CalendarHeatmap: ComponentType<CalendarHeatmapProps>;
  export default CalendarHeatmap;
}
