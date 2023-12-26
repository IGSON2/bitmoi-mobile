import "./Interval.css"
import { IntervalProps} from "../types/types";

export function Interval({intv}:IntervalProps){
    return (
        <div className="interval_unit">
            <div>{intv}</div>
        </div>
    )
}