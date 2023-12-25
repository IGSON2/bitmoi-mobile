import { useState } from "react";
import { axiosClient } from "../utils/axiosClient";

export function TradingBoard (){
    const [titleArray, setTitleArray] = useState<string[]>([]);

  const getChartData = async (interval:string,identifier:string,stage:string) => {
      const response = await axiosClient.get(`/practice?names=${titleArray}`);
      console.log(response.data);
  }

    return(
        <div>
            <div>TradingBoard</div>
        </div>
    )
}