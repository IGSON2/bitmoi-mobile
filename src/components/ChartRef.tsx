import { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import { ChartProps } from "../types/types";

const backgroundcolor = "#555860";
const linecolor = "#ffffff";

export const ChartRef = forwardRef<ChartProps>((props:ChartProps,ref: ForwardedRef<HTMLElement | null>)=>{
    const chartContainerRef = useRef<HTMLDivElement|null>(null);
    const candleSeriesRef = useRef();
    const volumeSeriesRef = useRef();
    const chartRef = useRef();



    useEffect(()=>{

    },[props.candles])

    return <div ref={chartContainerRef} />
})