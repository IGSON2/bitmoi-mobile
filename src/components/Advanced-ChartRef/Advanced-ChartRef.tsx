import { useEffect, useRef } from "react";
import "./index.css";
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from "./charting_library";
import * as React from "react";
import { UDFCompatibleDatafeed } from "./udf-compatible-datafeed";
import { CustomDatafeed } from "./custom-datafeed";

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions["symbol"];
  interval: ChartingLibraryWidgetOptions["interval"];

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions["library_path"];
  chartsStorageUrl: ChartingLibraryWidgetOptions["charts_storage_url"];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions["charts_storage_api_version"];
  clientId: ChartingLibraryWidgetOptions["client_id"];
  userId: ChartingLibraryWidgetOptions["user_id"];
  fullscreen: ChartingLibraryWidgetOptions["fullscreen"];
  autosize: ChartingLibraryWidgetOptions["autosize"];
  studiesOverrides: ChartingLibraryWidgetOptions["studies_overrides"];
  container: ChartingLibraryWidgetOptions["container"];
}

const getLanguageFromURL = (): LanguageCode | null => {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode);
};

export const AdvancedChartRef = () => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const defaultProps: Omit<ChartContainerProps, "container"> = {
    symbol: "TEST",
    interval: "60" as ResolutionString,
    // datafeedUrl: "https://demo_feed.tradingview.com",
    datafeedUrl: "https://api.bitmoi.co.kr",
    libraryPath: "/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "bitmoi.co.kr",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: defaultProps.symbol as string,
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      // datafeed: new UDFCompatibleDatafeed(defaultProps.datafeedUrl) as any,
      datafeed: new CustomDatafeed(defaultProps.datafeedUrl) as any,
      interval:
        defaultProps.interval as ChartingLibraryWidgetOptions["interval"],
      container: chartContainerRef.current,
      library_path: defaultProps.libraryPath as string,

      // locale: getLanguageFromURL() || "ko",
      locale: getLanguageFromURL() || "en",
      disabled_features: [
        "use_localstorage_for_settings",
        "display_market_status",
        "header_compare",
        "header_symbol_search",
        "header_saveload",
        "header_quick_search",
        "header_undo_redo",
        "symbol_search_hot_key",
        "go_to_date",
        "edit_buttons_in_legend",
        "timeframes_toolbar",
      ],
      enabled_features: [
        "show_hide_button_in_legend",
        "delete_button_in_legend",
      ],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        // tvWidget.setDebugMode(true);
        // const button = tvWidget.createButton();
        // button.setAttribute("title", "Click to show a notification popup");
        // button.classList.add("apply-common-tooltip");
        // button.addEventListener("click", () =>
        //   tvWidget.showNoticeDialog({
        //     title: "Notification",
        //     body: "TradingView Charting Library API works correctly",
        //     callback: () => {
        //       console.log("Noticed!");
        //     },
        //   })
        // );
        // button.innerHTML = "Check API";
      });
    });

    return () => {
      tvWidget.remove();
    };
  });

  return <div ref={chartContainerRef} className={"TVChartContainer"} />;
};
