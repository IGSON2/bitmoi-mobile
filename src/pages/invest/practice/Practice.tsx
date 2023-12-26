import { useEffect, useState } from "react";
import "./Practice.css"
import { ChartRef } from "../../../components/ChartRef";
import { ModePrac, fifM, fiveM, fourH, oneD, oneH} from "../../../types/const";
import { axiosClient } from "../../../utils/axiosClient";
import { ChartInfo, IntervalType } from "../../../types/types";
import { Interval } from "../../../components/Interval";
import { useAppDispatch } from "../../../hooks/hooks";

export function Practice () {
    const [titleArray,setTitleArray]=useState<string[]>([])
    const [chartInfo,setChartInfo]=useState<ChartInfo>({} as ChartInfo)
    const [name,setName]=useState<string>("" as string)
    const [isChartLoaded,setIsChartLoaded]=useState<boolean>(false)

    useEffect(()=>{
        async function GetChart(titleArray:string[]){
            setIsChartLoaded(false);
            try{
                const response = await axiosClient.get(`/${ModePrac}?names=${titleArray}`);

                setTitleArray((current)=>[...current,response.data.name]);
                if (titleArray.length>=10){
                    setTitleArray([]);
                }

                response.data.onechart.pdata.reverse();
                response.data.onechart.vdata.reverse();
                setChartInfo(response.data);
                setName(response.data.name);
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
                <div className="title">{name}</div >
                <div className="current_price">
                    <div></div> {/* TODO */}
                </div>
                <div className="interval">
                    <Interval intv={fifM}/>
                    <Interval intv={oneH}/>
                    <Interval intv={fourH}/>
                    <Interval intv={oneD}/>
                </div>
                <ChartRef {...chartInfo.onechart}/>
                <div className="orderBox">
                    <div>매수</div>
                    <div>매도</div>
                    <div>거래내역</div>
                </div>
            </div> 
            : <h3>Loading...</h3>
            }
        </div>
    );
}