import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { appendIntervalChart } from "../../store/intervalCharts";
import { IntervalCharts, IntervalType } from "../../types/types";
import { getIntervalStep } from "../../utils/Timestamp";
import axiosClient from "../../utils/axiosClient";
import "./InterOrder.css";
import { fifM, fourH, oneD, oneH } from "../../types/const";
import { setCurrentChart } from "../../store/currentChart";
import {
  setOrderMaxTimestamp,
  setOrderMinTimestamp,
  setOrderReqInterval,
} from "../../store/order";

export const InterOrder = () => {
  const [lastUpdated, setLastUpdated] = useState<IntervalType>(oneH);
  const intervalCharts = useAppSelector((state) => state.intervalCharts);
  const order = useAppSelector((state) => state.order);

  const dispatch = useAppDispatch();

  async function GetMediateChart(intv: IntervalType) {
    dispatch(setOrderReqInterval(intv));
    dispatch(
      setOrderMinTimestamp(getLastIdxTimeFromIntv(intv, intervalCharts))
    );
    dispatch(
      setOrderMaxTimestamp(
        getMaxTimeFromIntv(intervalCharts) + getIntervalStep(intv)
      )
    );
    // order.reqinterval = intv;
    // order.min_timestamp = getLastIdxTimeFromIntv(intv, intervalCharts);
    // order.max_timestamp =
    //   getMaxTimeFromIntv(intervalCharts) + getIntervalStep(intv);

    console.log(order);

    try {
      const result = await axiosClient.post("/intermediate", order);
      dispatch(
        appendIntervalChart({ interval: intv, oneChart: result.data.onechart })
      );
      setLastUpdated(intv);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    switch (lastUpdated) {
      case oneD:
        dispatch(
          setCurrentChart({
            interval: lastUpdated,
            oneChart: intervalCharts.oneDay,
          })
        );
        break;
      case fourH:
        dispatch(
          setCurrentChart({
            interval: lastUpdated,
            oneChart: intervalCharts.fourHours,
          })
        );
        break;
      case oneH:
        dispatch(
          setCurrentChart({
            interval: lastUpdated,
            oneChart: intervalCharts.oneHour,
          })
        );
        break;
      case fifM:
        dispatch(
          setCurrentChart({
            interval: lastUpdated,
            oneChart: intervalCharts.fifteenMinutes,
          })
        );
        break;
      default:
        break;
    }
  }, [lastUpdated]);

  return (
    <div className="inter_order">
      <button style={{ backgroundColor: "#BFBFBF" }}>종료</button>
      <button
        onClick={async () => {
          await GetMediateChart(fifM);
        }}
      >
        15분
      </button>
      <button
        onClick={async () => {
          await GetMediateChart(oneH);
        }}
      >
        1시간
      </button>
      <button
        onClick={async () => {
          await GetMediateChart(fourH);
        }}
      >
        4시간
      </button>
      <button
        onClick={async () => {
          await GetMediateChart(oneD);
        }}
      >
        1일
      </button>
    </div>
  );
};

function getLastIdxTimeFromIntv(
  intv: IntervalType,
  intvC: IntervalCharts
): number {
  switch (intv) {
    case oneD:
      return intvC.oneDay.pdata.length > 0 // 존재하지 않을 경우 초기화 및
        ? Number(intvC.oneDay.pdata[0].time)
        : 0;
    case fourH:
      return intvC.fourHours.pdata.length > 0
        ? Number(intvC.fourHours.pdata[0].time)
        : 0;
    case oneH:
      return intvC.oneHour.pdata.length > 0
        ? Number(intvC.oneHour.pdata[0].time)
        : 0;
    case fifM:
      return intvC.fifteenMinutes.pdata.length > 0
        ? Number(intvC.fifteenMinutes.pdata[0].time)
        : 0;
    default:
      return 0;
  }
}

function getMaxTimeFromIntv(intvC: IntervalCharts): number {
  const oneDayMaxTime =
    intvC.oneDay.pdata.length > 0 ? Number(intvC.oneDay.pdata[0].time) : 0;
  const fourHoursMaxTime =
    intvC.fourHours.pdata.length > 0
      ? Number(intvC.fourHours.pdata[0].time)
      : 0;
  const oneHourMaxTime =
    intvC.oneHour.pdata.length > 0 ? Number(intvC.oneHour.pdata[0].time) : 0;
  const fifteenMinutesMaxTime =
    intvC.fifteenMinutes.pdata.length > 0
      ? Number(intvC.fifteenMinutes.pdata[0].time)
      : 0;

  return Math.max(
    oneDayMaxTime,
    fourHoursMaxTime,
    oneHourMaxTime,
    fifteenMinutesMaxTime
  );
}
