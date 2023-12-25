import { useEffect } from "react";
import "./Practice.css"
import { ChartRef } from "../../../components/ChartRef";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { setModePrac } from "../../../store/mode";
import { GetChart } from "../../../utils/chartFetcher";
import { ModePrac} from "../../../types/const";
import { setChartLoaded } from "../../../store/chartLoaded";

export function Practice () {
    const isChartLoaded = useAppSelector<boolean>(state => state.isChartLoaded)
    const name = useAppSelector<string>(state => state.chartInfo.name)
    const dispatch = useAppDispatch();
    
    useEffect(()=>{
        dispatch(setChartLoaded(false));
        dispatch(setModePrac()); // TODO
        GetChart(ModePrac,[]);
    },[])


    return (
        <div>
            {isChartLoaded ? 
            <div>
                <h1>{name}</h1>
                <ChartRef/>
                <div className="orderBox">
                    <div>매수</div>
                    <div>매도</div>
                    <div>거래내역</div>
                </div>
            </div> 
                : <h3>Loading...</h3>}
            
        </div>
    );
}