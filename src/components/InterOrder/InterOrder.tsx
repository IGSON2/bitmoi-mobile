import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  appendIntervalChart,
  setIntervalCharts,
} from "../../store/intervalCharts";
import { IntervalType, OneChart, Order } from "../../types/types";
import {
  CompareInterval,
  CompareIntervalRes,
  GetChartFromIntv,
  GetIntervalStep,
} from "../../utils/IntervalUtil";
import axiosClient from "../../utils/axiosClient";
import "./InterOrder.css";
import { fifM, fourH, oneD, oneH } from "../../types/const";
import { setAppendTempCandle, setCurrentChart } from "../../store/currentChart";
import { setPositionClosed } from "../../store/positionClosed";
import { setCurrentScore, setScore } from "../../store/score";
import {
  setStageAppendRoeArray,
  setStageElapsedTime,
  setStageMaxTimestamp,
} from "../../store/stageState";
import {
  CheckIntervalCharts,
  GetLastIdxTimeFromChart as GetLastIdxTimeFromIntv,
  GetLatestTimestamp,
} from "../../utils/IntervalUtil";

type stepInfo = {
  elapsedTime: number;
  interval: IntervalType;
};

export const InterOrder = () => {
  const [intervalInfo, setIntervalInfo] = useState<stepInfo>({
    interval: oneH,
    elapsedTime: 0,
  });
  const intervalCharts = useAppSelector((state) => state.intervalCharts);
  const orderState = useAppSelector((state) => state.order);
  const currentChart = useAppSelector((state) => state.currentChart);

  const dispatch = useAppDispatch();

  async function ClosePosition() {
    let max_reqTime = GetLatestTimestamp(intervalCharts);
    const orderReq: Order = {
      ...orderState,
      reqinterval: intervalInfo.interval,
      min_timestamp: max_reqTime - GetIntervalStep(intervalInfo.interval), // 현재 interval의 1 step만큼 빼주면 된다. -> 작은단위와 큰단위 시간이 겹칠경우 : 작은단위가 큰단위보다 몇 칸 앞선경우
      max_timestamp: max_reqTime,
    };
    const res = await axiosClient.post("/intermediate/close", orderReq);
    dispatch(setPositionClosed(true));
    dispatch(
      setScore({
        current_score: res.data.score,
        after_score: res.data.after_score,
      })
    );
  }

  async function GetMediateChart(intv: IntervalType) {
    let min_timestamp = GetLastIdxTimeFromIntv(intv, intervalCharts);
    if (min_timestamp === 0) {
      const fIdentifier = encodeURIComponent(orderState.identifier);
      const reqURL = `/interval?mode=${orderState.mode}&reqinterval=${intv}&identifier=${fIdentifier}`; // TODO: Req URL 변경
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
      max_timestamp: GetLatestTimestamp(intervalCharts) + GetIntervalStep(intv), // (현재 Interval의 마지막 Timestamp, 가장 최근까지 할당된 Interval의 마지막 Timestamp + 요청한 Interval의 step]
    };

    try {
      const interResponse = await axiosClient.post("/intermediate", orderReq);

      dispatch(setStageAppendRoeArray(interResponse.data.score.roe));
      if (interResponse.data.score.out_time > 0) {
        dispatch(setPositionClosed(true));
        dispatch(setCurrentScore(interResponse.data.score));
      }
      if (interResponse.data.result_chart.pdata[0].time === min_timestamp) {
        alert("마지막 캔들입니다.");
      }

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
          !CheckIntervalCharts(key as IntervalType, intervalCharts)
        ) {
          // 차트가 존재하지 않으면 Fetching 하고 붙여주어야 interval component에서 append된 기간까지 렌더링됨
          continue;
        }

        const oc: OneChart = interResponse.data.another_charts[key];
        oc.pdata.reverse();
        oc.vdata.reverse();
        const slicedOc = sliceOnechart(
          oc,
          GetLastIdxTimeFromIntv(key as IntervalType, intervalCharts)
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
        elapsedTime: prev.elapsedTime + GetIntervalStep(intv),
      }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    dispatch(setStageElapsedTime(intervalInfo.elapsedTime));
    dispatch(setStageMaxTimestamp(GetLatestTimestamp(intervalCharts)));

    const currentC = GetChartFromIntv(currentChart.interval, intervalCharts);
    if (!currentC) {
      console.error("Invalid current chart");
      return;
    }

    const currentLatest =
      currentC.oneChart.pdata[currentC.oneChart.pdata.length - 1].time;

    switch (CompareInterval(intervalInfo.interval, currentChart.interval)) {
      case CompareIntervalRes.SAME:
      case CompareIntervalRes.POS: // 요청 interval이 같거나 더 큰 경우 -> append, 이미 위에서 append된 현재 interval chart를 최신화 하기만 하면 됨.
        dispatch(setCurrentChart(currentC));
        return;
      case CompareIntervalRes.NEG: // 요청 interval이 더 작은 경우 -> 최신화 또는 modify
        // 항상 interChart 요청 후 추가된 다른 interval chart의 latest timestamp는 current chart의 latest timestamp와
        // current chart의 1 step을 초과할 일이 없기 때문에 modify 하거나, 최신화 하기만 하면 됨
        const reqLatest = GetLastIdxTimeFromIntv(
          intervalInfo.interval,
          intervalCharts
        );
        if (Number(currentLatest) === reqLatest) {
          dispatch(setCurrentChart(currentC)); // 최신화
        } else if (Number(currentLatest) < reqLatest) {
          const reqC = GetChartFromIntv(intervalInfo.interval, intervalCharts);
          if (!reqC) {
            console.error("reqC must be valid");
            return;
          }
          const slicedReqC = sliceOnechart(
            reqC.oneChart,
            Number(currentLatest) // currentLatest보다 큰 timestamp를 가진 Req 차트 반환
          );
          if (!slicedReqC) {
            console.error("slicedReqC's length must be greater than 0");
            return;
          }
          dispatch(setAppendTempCandle(slicedReqC)); // modify
        } else {
          // 요청한 작은 단위의 interval이 무조건 더 근래여야 함.
          console.error(
            `Invalid interval chart. req: ${intervalInfo.interval}, current: ${currentChart.interval}`
          );
        }
        return;
      // current chart의 마지막 캔들에 새로운 캔들을 만들어 작은 단위가 앞서나간 캔들 수 만큼 반복하여 고,저,종가를 갱신해주고 볼륨값을 더해주면 된다.
      case CompareIntervalRes.ERROR:
        console.error(
          `cannot compare interval. req: ${intervalInfo.interval}, current: ${currentChart.interval}`
        );
    }
    return;
  }, [intervalInfo]);

  return (
    <div className="inter_order">
      <button style={{ backgroundColor: "#BFBFBF" }} onClick={ClosePosition}>
        종료
      </button>
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

// oc가 time 기준 오름차순일 때 주어진 timestamp보다 큰 배열을 슬라이싱 하여 반환.
function sliceOnechart(oc: OneChart, lastTimestamp: number): OneChart | null {
  let slicedOc: OneChart = { pdata: [], vdata: [] };
  const idx = oc.pdata.findIndex((pd) => Number(pd.time) > lastTimestamp);
  if (idx === -1) {
    return null;
  }
  slicedOc.pdata = oc.pdata.slice(idx); // [idx, end]
  slicedOc.vdata = oc.vdata.slice(idx);
  return slicedOc;
}
