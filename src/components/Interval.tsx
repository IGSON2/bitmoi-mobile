import "./Interval.css";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { fifM, fourH, oneD, oneH } from "../types/const";
import axiosClient from "../utils/axiosClient";
import { setIntervalCharts } from "../store/intervalCharts";
import { setCurrentChart } from "../store/currentChart";
import { IntervalType } from "../types/types";
import { useState } from "react";
import { setSubmit } from "../store/submit";

export function Interval() {
  const orderState = useAppSelector((state) => state.order);
  const intervalChart = useAppSelector((state) => state.intervalCharts);
  const [currentIntv, setCurrentIntv] = useState<IntervalType>(oneH);
  const dispatch = useAppDispatch();

  const checkInterval = (intv: IntervalType) => {
    setCurrentIntv(intv);
    dispatch(setSubmit(true));
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
    const fIdentifier = encodeURIComponent(orderState.identifier);
    const reqURL = `/interval?mode=${orderState.mode}&reqinterval=${intv}&identifier=${fIdentifier}`;
    try {
      const response = await axiosClient.get(reqURL);
      response.data.onechart.pdata.reverse();
      response.data.onechart.vdata.reverse();
      dispatch(
        setIntervalCharts({ interval: intv, oneChart: response.data.onechart })
      );
      dispatch(
        setCurrentChart({ interval: intv, oneChart: response.data.onechart })
      );
    } catch (error) {
      console.error("Error fetching another interval data:", error);
    }
  }

  return (
    <div className="interval">
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
    </div>
  );
}
