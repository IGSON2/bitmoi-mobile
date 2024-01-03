import { useEffect, useState } from "react";
import "./Practice.css"
import { ChartRef } from "../../../components/ChartRef";
import { ModePrac, fifM, fourH, oneD, oneH} from "../../../types/const";
import { axiosClient } from "../../../utils/axiosClient";
import { ChartInfo } from "../../../types/types";
import { Interval } from "../../../components/Interval";
import { OrderBox } from "../../../components/OrderBox/OrderBox";
import { useAppDispatch } from "../../../hooks/hooks";
import { setPracEntryPrice, setPracIdentifier, setPracName, setPracScoreId, setPracStage } from "../../../store/pracState";

export function Practice () {
    const [titleArray,setTitleArray]=useState<string[]>([])
    const [chartInfo,setChartInfo]=useState<ChartInfo>({} as ChartInfo)
    const [name,setName]=useState<string>("" as string)
    const [isChartLoaded,setIsChartLoaded]=useState<boolean>(false)

    const dispatch = useAppDispatch();

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
                dispatch(setPracScoreId(Date.now().toString()));
                dispatch(setPracName(response.data.name));
                dispatch(setPracStage(titleArray.length));
                dispatch(setPracIdentifier(response.data.identifier));
                dispatch(setPracEntryPrice(response.data.onechart.pdata[response.data.onechart.pdata.length-1].close));
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
                        <div className="title_name">{name}</div>
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
                    <div><span className="current_price_type">O</span>{chartInfo.onechart.pdata[chartInfo.onechart.pdata.length-1].open}</div>
                    <div><span className="current_price_type">H</span>{chartInfo.onechart.pdata[chartInfo.onechart.pdata.length-1].high}</div>
                    <div><span className="current_price_type">L</span>{chartInfo.onechart.pdata[chartInfo.onechart.pdata.length-1].low}</div>
                    <div><span className="current_price_type">C</span>{chartInfo.onechart.pdata[chartInfo.onechart.pdata.length-1].close}</div>
                </div>
                <ChartRef {...chartInfo.onechart}/>
                <OrderBox/>
            </div> 
            : <h3>Loading...</h3>
            }
        </div>
    );
}