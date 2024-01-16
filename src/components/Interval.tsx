import "./Interval.css"
import { IntervalProps, OneChart} from "../types/types";
import { useAppSelector } from "../hooks/hooks";
import { fifM, fourH, oneD, oneH } from "../types/const";

export function Interval({intv}:IntervalProps){
    let intervalChart:OneChart;
    switch(intv){
        case oneD:
            // intervalChart = useAppSelector((state)=>state.intervalCharts.oneDay)
        case fourH:
        case oneH:
        case fifM:
    }
    return (
        <div className="interval_unit">
            <div>{intv}</div>
        </div>
    )
}