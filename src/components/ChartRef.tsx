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
  MouseEventParams,
} from "lightweight-charts";
import { PData } from "../types/types";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { SubmitState } from "../types/stageState";
import { setLastCandle } from "../store/lastCandle";

export const ChartRef = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const submitState = useAppSelector((state) => state.stageState.submitState);
  const positionClosed = useAppSelector((state) => state.positionClosed);
  const order = useAppSelector((state) => state.order);
  const etnryTime = useAppSelector((state) => state.stageState.entrytime);
  const oneChart = useAppSelector((state) => state.currentChart.oneChart);

  const dispatch = useAppDispatch();

  const [visibleRange, setVisibleRange] = useState<Range<Time> | null>({
    from: "0",
    to: "0",
  });

  const rootWidth = document.getElementById("root")?.clientWidth;

  const handleResize = () => {
    if (chartContainerRef.current && chartApiRef.current) {
      chartApiRef.current.applyOptions({
        width: rootWidth,
        height: window.innerHeight * 0.75,
      });
    }
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      chartApiRef.current = createChart(chartContainerRef.current, {
        width: rootWidth,
        height: window.innerHeight * 0.75,
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

    chartApiRef.current?.subscribeCrosshairMove((param) => {
      const pdata = param.seriesData.values().next().value;
      if (!pdata) {
        return;
      }
      dispatch(setLastCandle(pdata as PData));
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      chartApiRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    const length = oneChart.pdata.length;

    if (length <= 2) {
      return;
    }
    candleSeriesRef.current?.setData([...oneChart.pdata]);
    volumeSeriesRef.current?.setData([...oneChart.vdata]);

    let from = visibleRange!.from;
    let to = oneChart.pdata[length - 1].time;

    if (length < 100) {
      from = oneChart.pdata[0].time;
    } else if (from === "0") {
      from = oneChart.pdata[length - 100].time;
    } else if (from !== "0") {
    }
    if (Math.abs(Number(visibleRange?.to) - Number(to)) <= 86400) {
      return;
    }

    chartApiRef.current?.timeScale().setVisibleRange({
      from: from,
      to: to as Time,
    });
  }, [oneChart]);

  useEffect(() => {
    if (!candleSeriesRef.current) {
      return;
    }
    if (submitState === SubmitState.Submit) {
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
  }, [submitState]);

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
      style={{
        width: "100%",
        touchAction: "auto",
        borderTop: "1px solid #e7eaf3",
      }}
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
