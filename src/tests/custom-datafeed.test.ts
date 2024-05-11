import {
  LibrarySymbolInfo,
  ResolutionString,
} from "../components/Advanced-ChartRef/charting_library/charting_library";
import { CustomDatafeed } from "../components/Advanced-ChartRef/custom-datafeed";
import { PeriodParamsWithOptionalCountback } from "../components/Advanced-ChartRef/history-provider";

test("custom datafeed test", () => {
  const datafeed = new CustomDatafeed("http://localhost:5000");
  const testSymbolInfo: LibrarySymbolInfo = {
    name: "TEST",
    description: "TEST_DESCRIPTION",
    type: "crypto",
    session: "24x7",
    exchange: "TEST_EXCHANGE",
    listed_exchange: "TEST_LISTED_EXCHANGE",
    format: "price",
    pricescale: 100,
    minmov: 1,
    timezone: "Asia/Seoul",
  };
  const testPeriodParam: PeriodParamsWithOptionalCountback = {
    from: 1675814400,
    to: 1715558400,
    countBack: 329,
    firstDataRequest: true,
  };

  datafeed.getBars(
    testSymbolInfo,
    "1D" as ResolutionString,
    testPeriodParam,
    (bars) => {
      console.log(bars);
    },
    () => {
      console.log("error");
    }
  );
});
