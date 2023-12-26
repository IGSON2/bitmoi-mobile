import { forwardRef, useEffect, useRef, useState } from "react";
import { ColorType, createChart, CrosshairMode, IChartApi, LineStyle,ISeriesApi, Range,Time } from "lightweight-charts";
import {  OneChart,PData } from "../types/types";
import { useAppSelector } from "../hooks/hooks";

const backgroundcolor:string = "#555860";
const linecolor:string = "#ffffff";

export const ChartRef = forwardRef((oneChart:OneChart)=>{
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartApiRef = useRef<IChartApi|null>(null);
    const candleSeriesRef = useRef <ISeriesApi<"Candlestick">|null>(null);
    const volumeSeriesRef = useRef <ISeriesApi<"Histogram"> | null>(null);;

    const [visibleRange,setVisibleRange]=useState<Range<Time> | null>(null);

    useEffect(()=>{
        if (oneChart === {} as OneChart){
            return;
        }
        if (chartContainerRef.current) {
            chartApiRef.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: document.body.clientHeight *0.75,
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
                timeScale: { //TODO : 시간 축에서 일,월 안보이게 하기
                    timeVisible: true,
                    secondsVisible: false,
                },
                localization: {
                    dateFormat: "yyyy-MM-dd",
                },
                overlayPriceScales:{
                    scaleMargins: {
                        top: 0.8,
                        bottom: 0,
                      },
                }
            });
        }

        const decimal = getDecimal(oneChart.pdata[0])

        if (chartApiRef.current){
            candleSeriesRef.current = chartApiRef.current.addCandlestickSeries({
                priceFormat: {
                    precision: decimal,
                    minMove: 1*Math.pow(10,-decimal),
                  },

            });
            volumeSeriesRef.current = chartApiRef.current.addHistogramSeries({
                priceFormat: {
                  type: "volume",
                  minMove: 0.001,
                },
                priceScaleId: "",
                
            });

        }

    },[])

    useEffect(()=>{
        if (oneChart.pdata[0].time !== ""){
            candleSeriesRef.current?.setData([...oneChart.pdata]);
            volumeSeriesRef.current?.setData([...oneChart.vdata]);
        }else{
            return;
        }
        var range = 100;
        const length = oneChart.pdata.length;
        if (length < range) {
          range = length;
        }
        chartApiRef.current?.timeScale().setVisibleRange({
            from: oneChart.pdata[length - range].time,
            to: oneChart.pdata[length - 1].time,
        });

        chartApiRef.current?.timeScale().subscribeVisibleTimeRangeChange((param) => {
            setVisibleRange(param);
        });

    },[oneChart])

    return <div ref={chartContainerRef} />
})

function getDecimal(pdata:PData): number{
    let decimal:number = 1;
    Object.values(pdata).forEach((value)=>{
        if (typeof value === "number"&&value.toString().includes(".")){
            if (decimal < value.toString().split(".")[1].length){
                decimal = value.toString().split(".")[1].length;
            }
        }
    });
    return decimal;
}