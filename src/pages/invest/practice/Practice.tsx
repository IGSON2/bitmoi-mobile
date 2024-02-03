import { useEffect, useState } from "react";
import "./Practice.css";
import { ChartRef } from "../../../components/ChartRef";
import { ModePrac, oneH } from "../../../types/const";
import axiosClient from "../../../utils/axiosClient";
import { StageState } from "../../../types/stageState";
import { UserInfo } from "../../../types/types";
import { Interval } from "../../../components/Interval";
import { OrderBox } from "../../../components/OrderBox/OrderBox";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import checkAccessTokenValidity from "../../../utils/checkAccessTokenValidity";
import { setUserInfo } from "../../../store/userInfo";
import { LoginBlur } from "../../../components/LoginBlur";
import {
  initIntervalCharts,
  setIntervalCharts,
} from "../../../store/intervalCharts";
import {
  setStageAddRefreshCnt,
  setStageState,
} from "../../../store/stageState";
import {
  initOrder,
  setOrderEntryPrice,
  setOrderIdentifier,
  setOrderMode,
  setOrderName,
  setOrderScoreId,
  setOrderUserId,
} from "../../../store/order";
import { setCurrentChart } from "../../../store/currentChart";
import { InterOrder } from "../../../components/InterOrder/InterOrder";
import { setSubmit } from "../../../store/submit";
import ResultModal from "../../../components/InterOrder/ResultModal/ResultModal";
import { initScore } from "../../../store/score";

export function Practice() {
  const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
  const [isLogined, setIsLogined] = useState<boolean>(false);

  const currentChart = useAppSelector((state) => state.currentChart.oneChart);
  const currentState = useAppSelector((state) => state.stageState);
  const refreshCnt = useAppSelector((state) => state.stageState.refresh_cnt);
  const submit = useAppSelector((state) => state.submit.check);
  const position_closed = useAppSelector(
    (state) => state.positionClosed.closed
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function GetChart() {
      dispatch(initOrder());
      dispatch(initScore());
      dispatch(initIntervalCharts());
      dispatch(setSubmit(false));
      const userRes = await checkAccessTokenValidity();
      if (!userRes) {
        setIsLogined(false);
      } else {
        dispatch(setUserInfo(userRes as UserInfo));
        dispatch(setOrderUserId(userRes.user_id));
        setIsLogined(true);
        // 유저의 미 종료 포지션 진입기록 정산
      }

      setIsChartLoaded(false);
      try {
        const response = await axiosClient.get(`/${ModePrac}`);

        dispatch(setOrderEntryPrice(response.data.onechart.pdata[0].close));
        response.data.onechart.pdata.reverse();
        response.data.onechart.vdata.reverse();
        dispatch(
          setIntervalCharts({
            interval: oneH,
            oneChart: response.data.onechart,
          })
        );
        dispatch(
          setCurrentChart({ interval: oneH, oneChart: response.data.onechart })
        );

        dispatch(
          setStageState({
            name: response.data.name,
            btcratio: response.data.btcratio,
            entrytime:
              response.data.onechart.pdata[
                response.data.onechart.pdata.length - 1
              ].time,
            min_timestamp: response.data.onechart.pdata[0].time, // reversed
          } as StageState)
        );
        dispatch(setOrderName(response.data.name));
        dispatch(setOrderIdentifier(response.data.identifier));
        dispatch(setOrderScoreId(Date.now().toString()));

        setIsChartLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }
    GetChart();
  }, [refreshCnt]);

  useEffect(() => {
    dispatch(setOrderMode(ModePrac));
  }, []);

  return (
    <div className="practice">
      {isChartLoaded ? (
        <div className="prac_body">
          <div className="prac_header">
            <img
              className="prac_header_back"
              onClick={() => {
                window.location.href = "/invest";
              }}
              src="/images/left_arrow.png"
              alt="back"
            />
            <div className="title">
              <img
                className="title_img"
                src={`https://cdn.bitmoi.co.kr/symbols/${currentState.name
                  .replace("USDT", "")
                  .toLowerCase()}.png`}
                alt=""
              />
              <div className="title_name">{currentState.name}</div>
            </div>
            <img
              className="prac_header_tools"
              src={"/images/construction.png"}
              alt=""
            />
            <img
              className="prac_header_tools"
              src={"/images/refresh.png"}
              alt=""
              onClick={() => {
                dispatch(setStageAddRefreshCnt());
              }}
            />
          </div>
          <Interval />
          <div className="current_price">
            <div>
              <span className="current_price_type">O</span>
              {currentChart.pdata[currentChart.pdata.length - 1].open}
            </div>
            <div>
              <span className="current_price_type">H</span>
              {currentChart.pdata[currentChart.pdata.length - 1].high}
            </div>
            <div>
              <span className="current_price_type">L</span>
              {currentChart.pdata[currentChart.pdata.length - 1].low}
            </div>
            <div>
              <span className="current_price_type">C</span>
              {currentChart.pdata[currentChart.pdata.length - 1].close}
            </div>
          </div>
          <ChartRef />
          {position_closed ? <ResultModal /> : null}
          {submit ? <InterOrder /> : <OrderBox />}
          {isLogined ? null : <LoginBlur />}
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
}
