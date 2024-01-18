import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  appendIntervalChart,
  setIntervalCharts,
} from "../../store/intervalCharts";
import {
  IntervalCharts,
  IntervalType,
  OneChart,
  Order,
} from "../../types/types";
import { getIntervalStep } from "../../utils/Timestamp";
import axiosClient from "../../utils/axiosClient";
import "./InterOrder.css";
import { fifM, fourH, oneD, oneH } from "../../types/const";
import { setCurrentChart } from "../../store/currentChart";

export const InterOrder = () => {
  const [lastUpdated, setLastUpdated] = useState<IntervalType>(oneH);
  const intervalCharts = useAppSelector((state) => state.intervalCharts);
  const orderState = useAppSelector((state) => state.order);

  const dispatch = useAppDispatch();

  async function GetMediateChart(intv: IntervalType) {
    let minTimestamp = 0;
    const maxTimestamp =
      getMaxTimeFromIntv(intervalCharts) + getIntervalStep(intv);

    if (checkIntervalCharts(intv, intervalCharts)) {
      minTimestamp = getLastIdxTimeFromIntv(intv, intervalCharts);
    } else {
      const fIdentifier = encodeURIComponent(orderState.identifier);
      const reqURL = `/interval?mode=${orderState.mode}&reqinterval=${intv}&identifier=${fIdentifier}`;
      try {
        const response = await axiosClient.get(reqURL);
        minTimestamp = response.data.onechart.pdata[0].time;
        response.data.onechart.pdata.reverse();
        response.data.onechart.vdata.reverse();
        dispatch(
          setIntervalCharts({
            interval: intv,
            oneChart: response.data.onechart,
          })
        );
      } catch (error) {
        console.error(
          "Error fetching another intermideate interval chart:",
          error
        );
      }
    }

    const orderReq: Order = {
      ...orderState,
      reqinterval: intv,
      min_timestamp: minTimestamp,
      max_timestamp: maxTimestamp,
    };

    try {
      const interResponse = await axiosClient.post("/intermediate", orderReq);
      interResponse.data.result_chart.pdata.reverse();
      interResponse.data.result_chart.vdata.reverse();

      interResponse.data.another_charts.forEach((oneChart: OneChart) => {
        console.log(oneChart);
      });
      // interResponse.data.another_charts[OneD].pdata.reverse();
      // interResponse.data.another_charts[OneD].vdata.reverse();
      // dispatch(appendIntervalChart({ interval: OneD, oneChart: interResponse.data.another_charts[OneD] }));
      dispatch(
        appendIntervalChart({
          interval: intv,
          oneChart: interResponse.data.result_chart,
        })
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

function checkIntervalCharts(
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

function getLastIdxTimeFromIntv(
  intv: IntervalType,
  intvC: IntervalCharts
): number {
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

function getMaxTimeFromIntv(intvC: IntervalCharts): number {
  const oneDayMaxTime = checkIntervalCharts(oneD, intvC)
    ? getLastIdxTimeFromIntv(oneD, intvC)
    : 0;
  const fourHoursMaxTime = checkIntervalCharts(fourH, intvC)
    ? getLastIdxTimeFromIntv(fourH, intvC)
    : 0;
  const oneHourMaxTime = checkIntervalCharts(oneH, intvC)
    ? getLastIdxTimeFromIntv(oneH, intvC)
    : 0;
  const fifteenMinutesMaxTime = checkIntervalCharts(fifM, intvC)
    ? getLastIdxTimeFromIntv(fifM, intvC)
    : 0;

  return Math.max(
    oneDayMaxTime,
    fourHoursMaxTime,
    oneHourMaxTime,
    fifteenMinutesMaxTime
  );
}
