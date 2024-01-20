import { useEffect, useRef, useState } from "react";
import {
  ColorType,
  createChart,
  CrosshairMode,
  IChartApi,
  LineStyle,
  ISeriesApi,
  Range,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { PData } from "../types/types";
import { useAppSelector } from "../hooks/hooks";

export const ChartRef = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const submit = useAppSelector((state) => state.submit);
  const order = useAppSelector((state) => state.order);
  const etnryTime = useAppSelector((state) => state.stageState.entrytime);
  const oneChart = useAppSelector((state) => state.currentChart.oneChart);

  const [visibleRange, setVisibleRange] = useState<Range<Time> | null>(null);

  const handleResize = () => {
    if (chartContainerRef.current && chartApiRef.current) {
      chartApiRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: document.body.clientHeight * 0.75,
      });
    }
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      chartApiRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: document.body.clientHeight * 0.75,
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
          textColor: "#555860",
          background: {
            type: ColorType.Solid,
            color: "#ffffff",
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
          // secondsVisible: true,
        },
        localization: {
          dateFormat: "yyyy-MM-dd",
        },
        overlayPriceScales: {
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        },
      });
    }

    const decimal = getDecimal(oneChart.pdata[0]);
    const minMove = Number(Math.pow(10, -decimal).toFixed(decimal));

    if (chartApiRef.current) {
      candleSeriesRef.current = chartApiRef.current.addCandlestickSeries({
        priceFormat: {
          precision: decimal,
          minMove: minMove,
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
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (oneChart.pdata.length === 0) {
      return;
    }
    candleSeriesRef.current?.setData([...oneChart.pdata]);
    volumeSeriesRef.current?.setData([...oneChart.vdata]);
    var range = 100;
    const length = oneChart.pdata.length;
    if (length < range) {
      range = length;
    }
    chartApiRef.current?.timeScale().setVisibleRange({
      from: oneChart.pdata[length - range].time,
      to: oneChart.pdata[length - 1].time,
    });

    chartApiRef.current
      ?.timeScale()
      .subscribeVisibleTimeRangeChange((param) => {
        setVisibleRange(param);
      });
  }, [oneChart]);

  useEffect(() => {
    if (!candleSeriesRef.current) {
      return;
    }
    if (submit) {
      // candleSeriesRef.current.createPriceLine({
      //     price: order.entry_price,
      //     color: "rgb(51, 61, 121)",
      //     lineWidth: 2,
      //     lineStyle: LineStyle.Dotted,
      //     axisLabelVisible: true,
      //     title: "Entry price",
      // });
      candleSeriesRef.current.createPriceLine({
        price: order.profit_price,
        color: "rgb(53, 182, 169)",
        lineWidth: 2,
        lineStyle: LineStyle.Dotted,
        axisLabelVisible: true,
        title: "Take profit",
      });
      candleSeriesRef.current.createPriceLine({
        price: order.loss_price,
        color: "rgb(238, 103, 101)",
        lineWidth: 2,
        lineStyle: LineStyle.Dotted,
        axisLabelVisible: true,
        title: "Stop loss",
      });
      candleSeriesRef.current.setMarkers([
        {
          time: etnryTime as UTCTimestamp,
          position: "aboveBar",
          color: "rgb(51, 61, 121)",
          shape: "arrowDown",
          size: 1.5,
        },
      ]);
    }
  }, [submit]);

  return <div style={{ width: "100%" }} ref={chartContainerRef} />;
};

function getDecimal(pdata: PData): number {
  let decimal: number = 1;
  Object.values(pdata).forEach((value) => {
    if (typeof value === "number" && value.toString().includes(".")) {
      if (decimal < value.toString().split(".")[1].length) {
        decimal = value.toString().split(".")[1].length;
      }
    }
  });
  return decimal;
}
