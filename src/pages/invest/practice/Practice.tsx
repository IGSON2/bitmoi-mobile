import { useEffect, useState } from "react";
import "./Practice.css";
import { ChartRef } from "../../../components/ChartRef";
import { ModePrac, oneH } from "../../../types/const";
import axiosClient from "../../../utils/axiosClient";
import { StageState, SubmitState } from "../../../types/stageState";
import { UserInfo } from "../../../types/types";
import { Interval } from "../../../components/Interval";
import { OrderBox } from "../../../components/OrderBox/OrderBox";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { checkAccessTokenValidity } from "../../../utils/checkAccessTokenValidity";
import { setUserInfo, setUserPracBalance } from "../../../store/userInfo";
import { LoginModal } from "../../../components/modals/LoginModal";
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
import { InterOrder } from "../../../components/OrderBox/InterOrder/InterOrder";
import ResultModal from "../../../components/modals/ResultModal";
import { initScore } from "../../../store/score";
import { SettleModal } from "../../../components/modals/SettleModal";
import { Review } from "../../../components/OrderBox/Review/Review";
import Loader from "../../../components/loader/Loader";
import { Timer, expiringMinute } from "../../../components/Timer/Timer";
import {
  LimitedTimeModal,
  MockInvestWarningKey,
} from "../../../components/modals/LimitedTimeModal";
import { MockInvestWarning } from "../../../components/modals/LimitedElements/MockInvestWarning";

export function Practice() {
  const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
  const [isLogined, setIsLogined] = useState<boolean>(true);
  const [settledPnl, setSettledPnl] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  const currentChart = useAppSelector((state) => state.currentChart.oneChart);
  const currentState = useAppSelector((state) => state.stageState);
  const refreshCnt = useAppSelector((state) => state.stageState.refresh_cnt);
  const submitState = useAppSelector((state) => state.stageState.submitState);
  const position_closed = useAppSelector(
    (state) => state.positionClosed.closed
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function GetChart() {
      dispatch(initOrder());
      dispatch(initScore());
      dispatch(initIntervalCharts());
      const userRes = await checkAccessTokenValidity("practice");
      if (!userRes) {
        setIsLogined(false);
      } else {
        dispatch(setUserInfo(userRes as UserInfo));
        dispatch(setOrderUserId(userRes.user_id));
        setIsLogined(true);
        try {
          const res = await axiosClient.put("/intermediate/settle");
          if (res.data.total_pnl !== 0) {
            dispatch(
              setUserPracBalance(userRes.prac_balance + res.data.total_pnl)
            );
            setSettledPnl(res.data.total_pnl);
          }
        } catch (error) {
          console.error(error);
        }
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
    setTimer(Date.now() + expiringMinute * 60 * 1000);
  }, [refreshCnt]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", "#f6f6f6");
    dispatch(setOrderMode(ModePrac));
    return () => {
      meta?.setAttribute("content", "#ffffff");
    };
  }, []);

  useEffect(() => {
    if (settledPnl) {
      const timer = setTimeout(() => {
        setSettledPnl(0);
      }, 3000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [settledPnl]);

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
            {submitState === SubmitState.NotSubmit ? (
              <Timer timeMilliStamp={timer} />
            ) : null}
          </div>
          <ChartRef />
          <LimitedTimeModal storageKey={MockInvestWarningKey} />
          {position_closed ? <ResultModal /> : null}
          
          {submitState === SubmitState.NotSubmit ? (
            <OrderBox />
          ) : submitState === SubmitState.Submit ? (
            <InterOrder />
          ) : submitState === SubmitState.Review ? (
            <Review />
          ) : null}
          {isLogined ? null : <LoginModal reqUrl="practice" />}
          {settledPnl ? <SettleModal total_pnl={settledPnl} /> : null}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
