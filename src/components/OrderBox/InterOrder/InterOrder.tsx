import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  appendIntervalChart,
  setIntervalCharts,
} from "../../../store/intervalCharts";
import { IntervalType, OneChart, Order } from "../../../types/types";
import {
  CompareInterval,
  CompareIntervalRes,
  GetChartFromIntv,
  GetIntervalStep,
} from "../../../utils/IntervalUtil";
import axiosClient from "../../../utils/axiosClient";
import "./InterOrder.css";
import { fifM, fourH, oneD, oneH } from "../../../types/const";
import {
  setCurrentChartAppend,
  setCurrentChart,
} from "../../../store/currentChart";
import { setPositionClosed } from "../../../store/positionClosed";
import { setCurrentScore, setScore } from "../../../store/score";
import {
  setStageAppendRoeArray,
  setStageElapsedTime,
} from "../../../store/stageState";
import {
  CheckIntervalCharts,
  GetLastIdxTimeFromChart as GetLastIdxTimeFromIntv,
  GetLatestTimestamp,
} from "../../../utils/IntervalUtil";

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

  const [modified, setModified] = useState(false);

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
    let max_timestamp = GetLatestTimestamp(intervalCharts);
    const reqStep = GetIntervalStep(intv);

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

    if (min_timestamp > max_timestamp) {
      max_timestamp = min_timestamp;
    }

    // 첫 주문 시, 작은단위의 캔들이 현재 차트의 다음 캔들부터 시작하도록 한다.
    if (
      intervalInfo.elapsedTime === 0 &&
      CompareInterval(intv, currentChart.interval) === CompareIntervalRes.NEG
    ) {
      const currentNext =
        Number(
          currentChart.oneChart.pdata[currentChart.oneChart.pdata.length - 1]
            .time
        ) + GetIntervalStep(currentChart.interval);
      max_timestamp = currentNext - reqStep;
    }

    const orderReq: Order = {
      ...orderState,
      reqinterval: intv,
      min_timestamp: min_timestamp,
      max_timestamp: max_timestamp + reqStep,
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
        elapsedTime: prev.elapsedTime + reqStep,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    dispatch(setStageElapsedTime(intervalInfo.elapsedTime));

    const currentC = GetChartFromIntv(currentChart.interval, intervalCharts);
    if (!currentC) {
      console.error("Invalid current chart");
      return;
    }

    const currentLatest =
      currentC.oneChart.pdata[currentC.oneChart.pdata.length - 1].time;

    switch (CompareInterval(intervalInfo.interval, currentChart.interval)) {
      case CompareIntervalRes.SAME:
      case CompareIntervalRes.POS:
        dispatch(setCurrentChart(currentC));
        break;
      case CompareIntervalRes.NEG:
        const reqLatest = GetLastIdxTimeFromIntv(
          intervalInfo.interval,
          intervalCharts
        );
        if (Number(currentLatest) <= reqLatest) {
          const reqC = GetChartFromIntv(intervalInfo.interval, intervalCharts);
          if (!reqC) {
            console.error("reqC must be valid");
            break;
          }
          const slicedReqC: OneChart = {
            pdata: reqC.oneChart.pdata.slice(reqC.oneChart.pdata.length - 1),
            vdata: reqC.oneChart.vdata.slice(reqC.oneChart.vdata.length - 1),
          };

          dispatch(setCurrentChartAppend(slicedReqC));

          // TODO: 다른 인터벌도 변경해주기
          // const another_req = GetAnotherIntervalTypes(intervalInfo.interval);
          // const another_cur = GetAnotherIntervalTypes(currentChart.interval);
          // const non_dupl = another_req.filter((intv) =>
          //   another_cur.includes(intv)
          // );
          // non_dupl.forEach((intv) => {
          //   if (CheckIntervalCharts(intv, intervalCharts)) {
          //   }
          // });
          setModified(true);
        } else {
          console.error(
            `Invalid interval chart. req: ${intervalInfo.interval}, current: ${currentChart.interval}`
          );
        }
        break;
      case CompareIntervalRes.ERROR:
        console.error(
          `cannot compare interval. req: ${intervalInfo.interval}, current: ${currentChart.interval}`
        );
        break;
    }
    return;
  }, [intervalInfo]);

  useEffect(() => {
    if (modified) {
      // req interval chart에 현재 current chart에서 변경중인 사항 적용
      dispatch(
        setIntervalCharts({
          interval: currentChart.interval,
          oneChart: currentChart.oneChart,
        })
      );
      setModified(false);
    }
  }, [modified]);

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
