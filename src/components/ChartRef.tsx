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
  TrackingModeExitMode,
} from "lightweight-charts";
import { PData } from "../types/types";
import { useAppSelector } from "../hooks/hooks";

export const ChartRef = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const submit = useAppSelector((state) => state.submit);
  const positionClosed = useAppSelector((state) => state.positionClosed);
  const order = useAppSelector((state) => state.order);
  const etnryTime = useAppSelector((state) => state.stageState.entrytime);
  const oneChart = useAppSelector((state) => state.currentChart.oneChart);

  const [visibleRange, setVisibleRange] = useState<Range<Time> | null>({
    from: "0",
    to: "0",
  });

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
          // visible: false,
          visible: true,
          timeVisible: true,
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
        // trackingMode: { exitMode: TrackingModeExitMode.OnTouchEnd },
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

    chartApiRef.current
      ?.timeScale()
      .subscribeVisibleTimeRangeChange((param) => {
        setVisibleRange(param);
      });
  }, []);

  useEffect(() => {
    const length = oneChart.pdata.length;

    if (length <= 2) {
      return;
    }
    candleSeriesRef.current?.setData([...oneChart.pdata]);
    volumeSeriesRef.current?.setData([...oneChart.vdata]);

    let from = visibleRange!.from;

    if (length < 100) {
      from = oneChart.pdata[0].time;
    } else if (from === "0") {
      from = oneChart.pdata[length - 100].time;
    } else if (from !== "0") {
      const step =
        Number(oneChart.pdata[1].time) - Number(oneChart.pdata[0].time);
      const visibleCandles = Math.floor(
        (Number(visibleRange!.to) - Number(from)) / step
      );
      if (visibleCandles < 100) {
        from = oneChart.pdata[length - 100].time;
      }
    }

    chartApiRef.current?.timeScale().setVisibleRange({
      from: from,
      to: oneChart.pdata[length - 1].time,
    });
  }, [oneChart]);

  useEffect(() => {
    if (!candleSeriesRef.current) {
      return;
    }
    if (submit.check) {
      candleSeriesRef.current.createPriceLine({
        price: order.entry_price,
        color: "rgb(51, 61, 121)",
        lineWidth: 2,
        lineStyle: LineStyle.Dotted,
        axisLabelVisible: true,
        title: order.is_long ? "Long entry" : "Short entry",
      });
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

  useEffect(() => {
    if (positionClosed.closed) {
      setVisibleRange({
        from: "0",
        to: "0",
      });
    }
  }, [positionClosed]);

  return (
    <div
      style={{ width: "100%", touchAction: "auto" }}
      ref={chartContainerRef}
    />
  );
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
