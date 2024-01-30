import { fifM, fourH, oneD, oneH } from "../types/const";
import {
  CurrentChart,
  IntervalCharts,
  IntervalType,
  OneChart,
} from "../types/types";

export function CheckIntervalCharts(
  intv: IntervalType,
  intvC: IntervalCharts
): boolean {
  switch (intv) {
    case oneD:
      return intvC.oneDay.pdata.length > 0;
    case fourH:
      return intvC.fourHours.pdata.length > 0;
    case oneH:
      return intvC.oneHour.pdata.length > 0;
    case fifM:
      return intvC.fifteenMinutes.pdata.length > 0;
    default:
      console.error("Invalid interval type");
      return false;
  }
}

export function GetLastIdxTimeFromChart(
  intv: IntervalType,
  intvC: IntervalCharts
): number {
  if (!CheckIntervalCharts(intv, intvC)) {
    return 0;
  }
  switch (intv) {
    case oneD:
      return Number(intvC.oneDay.pdata[intvC.oneDay.pdata.length - 1].time);
    case fourH:
      return Number(
        intvC.fourHours.pdata[intvC.fourHours.pdata.length - 1].time
      );
    case oneH:
      return Number(intvC.oneHour.pdata[intvC.oneHour.pdata.length - 1].time);
    case fifM:
      return Number(
        intvC.fifteenMinutes.pdata[intvC.fifteenMinutes.pdata.length - 1].time
      );
    default:
      console.error("Invalid interval type");
      return 0;
  }
}

export function GetLatestTimestamp(intvC: IntervalCharts): number {
  const oneDay = GetLastIdxTimeFromChart(oneD, intvC);
  const fourHours = GetLastIdxTimeFromChart(fourH, intvC);
  const oneHour = GetLastIdxTimeFromChart(oneH, intvC);
  const fifteenMinutes = GetLastIdxTimeFromChart(fifM, intvC);

  return Math.max(oneDay, fourHours, oneHour, fifteenMinutes);
}

export function GetIntervalStep(intv: IntervalType): number {
  switch (intv) {
    case fifM:
      return 15 * 60;
    case oneH:
      return 60 * 60;
    case fourH:
      return 4 * 60 * 60;
    case oneD:
      return 24 * 60 * 60;
    default:
      console.error("Invalid interval type");
  }
  return 1;
}

export enum CompareIntervalRes {
  NEG = -1,
  SAME = 0,
  POS = 1,
  ERROR = 2,
}

export function CompareInterval(
  intv: IntervalType,
  target: IntervalType
): CompareIntervalRes {
  if (intv === target) {
    return CompareIntervalRes.SAME;
  }
  switch (intv) {
    case fifM:
      return CompareIntervalRes.NEG;
    case oneH:
      if (target === fifM) {
        return CompareIntervalRes.POS;
      }
      return CompareIntervalRes.NEG;
    case fourH:
      if (target === oneD) {
        return CompareIntervalRes.POS;
      }
      return CompareIntervalRes.NEG;
    case oneD:
      return CompareIntervalRes.POS;
    default:
      console.error("Invalid interval type");
  }
  return CompareIntervalRes.ERROR;
}

export function GetChartFromIntv(
  intv: IntervalType,
  intvC: IntervalCharts
): CurrentChart | null {
  switch (intv) {
    case fifM:
      return { interval: intv, oneChart: intvC.fifteenMinutes };
    case oneH:
      return { interval: intv, oneChart: intvC.oneHour };
    case fourH:
      return { interval: intv, oneChart: intvC.fourHours };
    case oneD:
      return { interval: intv, oneChart: intvC.oneDay };
    default:
      console.error("Invalid interval type");
  }
  return null;
}
