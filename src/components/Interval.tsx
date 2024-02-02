import "./Interval.css";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fifM, fourH, oneD, oneH } from "../types/const";
import axiosClient from "../utils/axiosClient";
import {
  appendIntervalChart,
  setIntervalCharts,
} from "../store/intervalCharts";
import { setCurrentChart } from "../store/currentChart";
import { IntervalType, OneChart } from "../types/types";
import { GetIntervalStep } from "../utils/IntervalUtil";
import { useState } from "react";

export function Interval() {
  const orderState = useAppSelector((state) => state.order);
  const intervalChart = useAppSelector((state) => state.intervalCharts);
  const currentIntv = useAppSelector((state) => state.currentChart.interval);
  const currentChart = useAppSelector((state) => state.currentChart.oneChart);
  const dispatch = useAppDispatch();

  const [fetching, setFetching] = useState<boolean>(false);

  const checkInterval = (intv: IntervalType) => {
    if (fetching || currentIntv === intv) {
      return true;
    }

    switch (intv) {
      case oneD:
        if (intervalChart.oneDay.pdata.length > 0) {
          dispatch(
            setCurrentChart({ interval: intv, oneChart: intervalChart.oneDay })
          );
          return true;
        }
        break;
      case fourH:
        if (intervalChart.fourHours.pdata.length > 0) {
          dispatch(
            setCurrentChart({
              interval: intv,
              oneChart: intervalChart.fourHours,
            })
          );
          return true;
        }
        break;
      case oneH:
        if (intervalChart.oneHour.pdata.length > 0) {
          dispatch(
            setCurrentChart({ interval: intv, oneChart: intervalChart.oneHour })
          );
          return true;
        }
        break;
      case fifM:
        if (intervalChart.fifteenMinutes.pdata.length > 0) {
          dispatch(
            setCurrentChart({
              interval: intv,
              oneChart: intervalChart.fifteenMinutes,
            })
          );
          return true;
        }
        break;
    }
    return false;
  };

  async function getAnotherInterval(intv: IntervalType) {
    setFetching(true);

    const fIdentifier = encodeURIComponent(orderState.identifier);
    const reqURL = `/interval?mode=${orderState.mode}&reqinterval=${intv}&identifier=${fIdentifier}`;

    let min_time = 0;
    const temp_onechart: OneChart = { pdata: [], vdata: [] };
    try {
      const response = await axiosClient.get(reqURL);
      min_time = response.data.onechart.pdata[0].time;
      response.data.onechart.pdata.reverse();
      response.data.onechart.vdata.reverse();
      dispatch(
        setIntervalCharts({ interval: intv, oneChart: response.data.onechart })
      );
      temp_onechart.pdata.push(...response.data.onechart.pdata);
      temp_onechart.vdata.push(...response.data.onechart.vdata);
    } catch (error) {
      console.error("Error fetching another interval data:", error);
    }

    const max_time =
      Number(currentChart.pdata[currentChart.pdata.length - 1].time) +
      GetIntervalStep(currentIntv) -
      1;

    if (min_time < max_time - GetIntervalStep(intv)) {
      const appendReqURL = `/intermediate/interval?mode=${orderState.mode}&reqinterval=${intv}&identifier=${fIdentifier}&min_timestamp=${min_time}&max_timestamp=${max_time}`;
      try {
        const appendResponse = await axiosClient.get(appendReqURL);
        if (!appendResponse.data.onechart.pdata) {
          setFetching(false);
          return;
        }
        appendResponse.data.onechart.pdata.reverse();
        appendResponse.data.onechart.vdata.reverse();
        dispatch(
          appendIntervalChart({
            interval: intv,
            oneChart: appendResponse.data.onechart,
          })
        );
        temp_onechart.pdata.push(...appendResponse.data.onechart.pdata);
        temp_onechart.vdata.push(...appendResponse.data.onechart.vdata);
      } catch (error) {
        console.error("Error appending another interval data:", error);
      }
    }

    dispatch(setCurrentChart({ interval: intv, oneChart: temp_onechart }));
    setFetching(false);
  }

  return (
    <div className="interval">
      <div
        className={`${
          currentIntv === fifM ? "interval_unit_active" : "interval_unit"
        }`}
        onClick={async () => {
          if (!checkInterval(fifM)) {
            await getAnotherInterval(fifM);
          }
        }}
      >
        <div>{fifM}</div>
      </div>
      <div
        className={`${
          currentIntv === oneH ? "interval_unit_active" : "interval_unit"
        }`}
        onClick={async () => {
          if (!checkInterval(oneH)) {
            await getAnotherInterval(oneH);
          }
        }}
      >
        <div>{oneH}</div>
      </div>
      <div
        className={`${
          currentIntv === fourH ? "interval_unit_active" : "interval_unit"
        }`}
        onClick={async () => {
          if (!checkInterval(fourH)) {
            await getAnotherInterval(fourH);
          }
        }}
      >
        <div>{fourH}</div>
      </div>
      <div
        className={`${
          currentIntv === oneD ? "interval_unit_active" : "interval_unit"
        }`}
        onClick={async () => {
          if (!checkInterval(oneD)) {
            await getAnotherInterval(oneD);
          }
        }}
      >
        <div>{oneD}</div>
      </div>
    </div>
  );
}
