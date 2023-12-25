import { forwardRef, useEffect, useRef, useState } from "react";
import { ColorType, createChart, CrosshairMode, IChartApi, LineStyle,ISeriesApi, Range,Time } from "lightweight-charts";
import { OneChart } from "../types/types";
import { useAppSelector } from "../hooks/hooks";

const backgroundcolor:string = "#555860";
const linecolor:string = "#ffffff";

export const ChartRef = forwardRef(()=>{
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartApiRef = useRef<IChartApi|null>(null);
    const candleSeriesRef = useRef <ISeriesApi<"Candlestick">|null>(null);
    const volumeSeriesRef = useRef <ISeriesApi<"Histogram"> | null>(null);;

    const oneChart = useAppSelector<OneChart>(state => state.chartInfo.onechart)

    const [visibleRange,setVisibleRange]=useState<Range<Time> | null>(null);

    
    useEffect(()=>{
        if (chartContainerRef.current) {
            chartApiRef.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth*0.985,
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
                timeScale: {
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

        if (chartApiRef.current){
            candleSeriesRef.current = chartApiRef.current.addCandlestickSeries({
                priceFormat: {
                    precision: 4,
                    minMove: 0.0001,
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
        if (oneChart){
            candleSeriesRef.current?.setData([...oneChart.pdatas]);
            volumeSeriesRef.current?.setData([...oneChart.vdatas]);
        }else{
            return;
        }
        var range = 100;
        const length = oneChart.pdatas.length;
        if (length < range) {
          range = length;
        }
        chartApiRef.current?.timeScale().setVisibleRange({
            from: oneChart.pdatas[length - range].time,
            to: oneChart.pdatas[length - 1].time,
        });

        chartApiRef.current?.timeScale().subscribeVisibleTimeRangeChange((param) => {
            setVisibleRange(param);
        });

    },[oneChart])

    return <div ref={chartContainerRef} />
})