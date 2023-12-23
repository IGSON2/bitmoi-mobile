import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { ColorType, createChart, CrosshairMode, IChartApi, LineStyle,ISeriesApi, Range,Time } from "lightweight-charts";
import { ChartProps } from "../types/types";

const backgroundcolor:string = "#555860";
const linecolor:string = "#ffffff";

export const ChartRef = forwardRef((props:ChartProps,ref: ForwardedRef<HTMLElement | null>)=>{
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartApiRef = useRef<IChartApi|null>(null);
    const candleSeriesRef = useRef <ISeriesApi<"Candlestick">|null>(null);
    const volumeSeriesRef = useRef <ISeriesApi<"Histogram"> | null>(null);;

    const [visibleRange,setVisibleRange]=useState<Range<Time> | null>(null);

    useEffect(()=>{
        if (chartContainerRef.current) {
            chartApiRef.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: document.body.clientHeight * props.height,
                crosshair: {
                    mode: CrosshairMode.Normal,
                    vertLine: {
                        color: "#D6DCDE",
                    },
                    horzLine: {
                        color: "#D6DCDE",
                    },
                },
                layout: {
                    textColor: backgroundcolor,
                    background: {
                        type: ColorType.Solid,
                        color:linecolor
                    },
                },
                grid: {
                vertLines: {
                    color: "#D6DCDE",
                    style: LineStyle.Dotted,
                },
                horzLines: {
                    color: "#D6DCDE",
                    style: LineStyle.Dotted,
                },
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                },
                localization: {
                    dateFormat: "yyyy-MM-dd",
                },
            });
        }

        if (chartApiRef.current){
            candleSeriesRef.current = chartApiRef.current.addCandlestickSeries();
            volumeSeriesRef.current = chartApiRef.current.addHistogramSeries({
                priceFormat: {
                  type: "volume",
                },
                priceScaleId: "",
                autoscaleInfoProvider: () => ({
                    margins: {
                        top: 0.8,
                        bottom: 0,
                    },
                }),
            });
            candleSeriesRef.current.applyOptions({
                priceFormat: {
                  precision: 4,
                  minMove: 0.0001,
                },
            });
        }
    },[])

    useEffect(()=>{
        if (props.pdatas.length > 0 && props.vdats.length > 0){
            candleSeriesRef.current?.setData([...props.pdatas]);
            volumeSeriesRef.current?.setData([...props.vdats]);
        }else{
            return;
        }
        var range = 200;
        const length = props.pdatas.length;
        if (length < 200) {
          range = length;
        }
        chartApiRef.current?.timeScale().setVisibleRange({
            from: props.pdatas[length - range].time,
            to: props.pdatas[length - 1].time,
        });

        chartApiRef.current?.timeScale().subscribeVisibleTimeRangeChange((param) => {
            setVisibleRange(param);
        });

        chartApiRef.current?.timeScale().fitContent();
    },[props.pdatas,props.vdats])

    return <div ref={chartContainerRef} />
})