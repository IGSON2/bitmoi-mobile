import { useEffect, useState } from "react";
import "./Practice.css"
import { ChartRef } from "../../../components/ChartRef";
import { ModePrac, fifM, fourH, oneD, oneH} from "../../../types/const";
import axiosClient from "../../../utils/axiosClient";
import { StageState, UserInfo } from "../../../types/types";
import { Interval } from "../../../components/Interval";
import { OrderBox } from "../../../components/OrderBox/OrderBox";
import { useAppDispatch, useAppSelector} from "../../../hooks/hooks";
import checkAccessTokenValidity from "../../../utils/checkAccessTokenValidity";
import { setUserInfo } from "../../../store/userInfo";
import { LoginBlur } from "../../../components/LoginBlur";
import { setChart_1H } from "../../../store/intervalCharts";
import { setStageState, setStateTitleArray } from "../../../store/stageState";
import { setOrderEntryPrice, setOrderIdentifier, setOrderMode, setOrderName, setOrderScoreId, setOrderStage, setOrderUserId } from "../../../store/order";
import { setCurrentChart } from "../../../store/currentChart";

export function Practice () {
    const [isChartLoaded,setIsChartLoaded]=useState<boolean>(false)
    const [isLogined,setIsLogined]=useState<boolean>(false)

    const currentChart = useAppSelector((state)=>state.currentChart.oneChart);
    const currentState = useAppSelector((state)=>state.stageState);
    const titleArray = useAppSelector((state)=>state.stageState.titleArray);

    const dispatch = useAppDispatch();

    useEffect(()=>{
        async function GetChart(titleArray:string[]){
            const userRes = await checkAccessTokenValidity();
            if (!userRes) {
                setIsLogined(false);
            }else{
                dispatch(setUserInfo(userRes as UserInfo));
                dispatch(setOrderUserId(userRes.user_id));
                setIsLogined(true);
            }

            setIsChartLoaded(false);
            try{
                const response = await axiosClient.get(`/${ModePrac}?names=${titleArray.join(",")}`);

                response.data.onechart.pdata.reverse();
                response.data.onechart.vdata.reverse();                
                dispatch(setChart_1H(response.data.onechart));
                dispatch(setCurrentChart({interval:oneH,oneChart: response.data.onechart}));

                dispatch(setStageState({
                    name: response.data.name,
                    btcratio: response.data.btcratio,
                    entrytime: response.data.onechart.pdata[response.data.onechart.pdata.length-1].time,
                }as StageState));
                dispatch(setStateTitleArray(response.data.name))
                
                dispatch(setOrderName(response.data.name));
                dispatch(setOrderMode(ModePrac));
                dispatch(setOrderStage(titleArray.length+1));
                dispatch(setOrderIdentifier(response.data.identifier));
                dispatch(setOrderScoreId(Date.now().toString()));
                dispatch(setOrderEntryPrice(response.data.onechart.pdata[response.data.onechart.pdata.length-1].close));
                setIsChartLoaded(true);
            }catch(error){
                console.error(error);
            }
        }
        GetChart(titleArray);
    },[])


    return (
        <div className="practice">
            {
            isChartLoaded ? 
            <div className="prac_body">
                <div className="prac_header">
                    <img
                        className="prac_header_back" 
                        onClick={() => {window.location.href = "/invest";}}
                        src="/images/left_arrow.png"
                        alt="back"
                    />
                    <div className="title">
                        <img className="title_img" src={"/images/sample_btc.png"} alt=""/>
                        <div className="title_name">{currentState.name}</div>
                    </div>
                    <img className="prac_header_tools" src={"/images/construction.png"} alt=""/>
                    <img className="prac_header_tools" src={"/images/refresh.png"} alt=""/>
                </div >
                <div className="interval">
                    <Interval intv={fifM}/>
                    <Interval intv={oneH}/>
                    <Interval intv={fourH}/>
                    <Interval intv={oneD}/>
                </div>
                <div className="current_price">
                    <div><span className="current_price_type">O</span>{currentChart.pdata[currentChart.pdata.length-1].open}</div>
                    <div><span className="current_price_type">H</span>{currentChart.pdata[currentChart.pdata.length-1].high}</div>
                    <div><span className="current_price_type">L</span>{currentChart.pdata[currentChart.pdata.length-1].low}</div>
                    <div><span className="current_price_type">C</span>{currentChart.pdata[currentChart.pdata.length-1].close}</div>
                </div>
                <ChartRef/> 
                <OrderBox/>
                {
                    isLogined ? null :
                    <LoginBlur/>
                }
            </div>
            : <h3>Loading...</h3>
            }
        </div>
    );
}