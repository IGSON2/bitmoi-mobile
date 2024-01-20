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

type stepInfo = {
  fromEntry: number;
  interval: IntervalType;
};

export const InterOrder = () => {
  const [intervalInfo, setIntervalInfo] = useState<stepInfo>({
    interval: oneH,
    fromEntry: 0,
  });
  const intervalCharts = useAppSelector((state) => state.intervalCharts);
  const orderState = useAppSelector((state) => state.order);

  const dispatch = useAppDispatch();

  async function GetMediateChart(intv: IntervalType) {
    let min_timestamp = getLastIdxTimeFromIntv(intv, intervalCharts);
    if (min_timestamp === 0) {
      const fIdentifier = encodeURIComponent(orderState.identifier);
      const reqURL = `/interval?mode=${orderState.mode}&reqinterval=${intv}&identifier=${fIdentifier}`;
      try {
        const response = await axiosClient.get(reqURL);
        min_timestamp = response.data.onechart.pdata[0].time;
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
      min_timestamp: min_timestamp,
      max_timestamp: getLatestTimestamp(intervalCharts) + getIntervalStep(intv),
    };

    try {
      const interResponse = await axiosClient.post("/intermediate", orderReq);
      interResponse.data.result_chart.pdata.reverse();
      interResponse.data.result_chart.vdata.reverse();

      dispatch(
        appendIntervalChart({
          interval: intv,
          oneChart: interResponse.data.result_chart,
        })
      );

      for (const key in interResponse.data.another_charts) {
        if (
          !interResponse.data.another_charts[key].pdata ||
          !checkIntervalCharts(key as IntervalType, intervalCharts)
        ) {
          continue;
        }

        const oc: OneChart = interResponse.data.another_charts[key];
        oc.pdata.reverse();
        oc.vdata.reverse();
        const slicedOc = sliceOnechart(
          oc,
          getLastIdxTimeFromIntv(key as IntervalType, intervalCharts)
        );
        if (slicedOc) {
          dispatch(
            appendIntervalChart({
              interval: key as IntervalType,
              oneChart: slicedOc,
            })
          );
        }
      }
      setIntervalInfo((prev) => ({
        interval: intv,
        fromEntry: prev.fromEntry + getIntervalStep(intv),
      }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    switch (intervalInfo.interval) {
      case oneD:
        dispatch(
          setCurrentChart({
            interval: intervalInfo.interval,
            oneChart: intervalCharts.oneDay,
          })
        );
        break;
      case fourH:
        dispatch(
          setCurrentChart({
            interval: intervalInfo.interval,
            oneChart: intervalCharts.fourHours,
          })
        );
        break;
      case oneH:
        dispatch(
          setCurrentChart({
            interval: intervalInfo.interval,
            oneChart: intervalCharts.oneHour,
          })
        );
        break;
      case fifM:
        dispatch(
          setCurrentChart({
            interval: intervalInfo.interval,
            oneChart: intervalCharts.fifteenMinutes,
          })
        );
        break;
      default:
        break;
    }
  }, [intervalInfo]);

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
  if (!checkIntervalCharts(intv, intvC)) {
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

function getLatestTimestamp(intvC: IntervalCharts): number {
  const oneDay = getLastIdxTimeFromIntv(oneD, intvC);
  const fourHours = getLastIdxTimeFromIntv(fourH, intvC);
  const oneHour = getLastIdxTimeFromIntv(oneH, intvC);
  const fifteenMinutes = getLastIdxTimeFromIntv(fifM, intvC);

  return Math.max(oneDay, fourHours, oneHour, fifteenMinutes);
}

// time이 오름차순이여야 함.
function sliceOnechart(oc: OneChart, lastTimestamp: number): OneChart | null {
  const idx = oc.pdata.findIndex((pd) => Number(pd.time) > lastTimestamp);
  if (idx === -1) {
    return null;
  }
  oc.pdata = oc.pdata.slice(idx);
  oc.vdata = oc.vdata.slice(idx);
  return oc;
}
