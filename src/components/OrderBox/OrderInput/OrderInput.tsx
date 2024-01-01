import { ChangeEvent, useState } from "react"
import { useAppSelector } from "../../../hooks/hooks"
import "./OrderInput.css"
import HorizontalLine from "../../lines/HorizontalLine";

interface Position {
    isLong: boolean;
}

  
export function OrderInput ({isLong}:Position) {
    const balance = useAppSelector((state)=>state.pracState.balance)
    const entryPrice = useAppSelector((state)=>state.pracState.entryPrice)
    const [quantity, setQuantity] = useState(0);
    const [quantityRate, setQuantityRate] = useState(1);
    const [profitPrice, setProfitPrice] = useState(0);
    const [profitRate, setProfitRate] = useState(1);
    const [lossPrice, setLossPrice] = useState(0);
    const [lossRate, setLossRate] = useState(1);
    const [leverage, setLeverage] = useState(1);

    const quantityChange = (event:ChangeEvent<HTMLInputElement>) => {
        if (event.target.valueAsNumber < 0) {
          setQuantity(0);
        } else {
          setQuantity(event.target.valueAsNumber);
        }
    };

    const quantityRateChange = (event:ChangeEvent<HTMLSelectElement>) => {
        const valueAsNumber = Number(event.target.value);
        setQuantityRate(valueAsNumber);
        setQuantity(
          Math.floor(
            ((balance * leverage * 0.9998) / entryPrice) *
              (valueAsNumber / 100) *
              10000
          ) / 10000
        );
      };

    return (
        <div className="OrderInput">
            <div className="OrderInput_balance">
                <div className="OrderInput_balance1">주문가능</div>
                <div className="OrderInput_balance2">{balance}</div>
                <div className="OrderInput_balance3">USDT</div>
            </div>
            <div className="input_wrapper">
                <div className="input_wrapper_1">
                    <div>{'가격(USDT)'}</div>
                    <div>{entryPrice}</div>
                </div>
                <div className="input_wrapper_2">현재가</div>
            </div>
            <div className="input_wrapper">
                <div className="input_wrapper_1">
                    <label htmlFor="quantity">수량</label>
                    <input
                    id="quantity"
                    type={"number"}
                    step={"0.0001"}
                    value={quantity}
                    onChange={quantityChange}
                    ></input>
                </div>
                <select
                    className="input_wrapper_2"
                    value={quantityRate}
                    onChange={quantityRateChange}
                >
                    <option value={25}>25%</option>
                    <option value={50}>50%</option>
                    <option value={75}>75%</option>
                    <option value={100} selected={true}>100%</option>
                </select>
            </div>            
            
            <HorizontalLine/>

            <div className="orderInput_title_help">
                <div>{'수익 실현 가격 (Take Profit)'}</div>
                <img src="/images/help.png"/>
            </div>

            <div>
                <input></input>
                <input></input>
            </div>

            <div className="orderInput_title_help">
                <div>{'손실 감수 가격 (Stop loss)'}</div>
                <img src="/images/help.png"/>
            </div>
            <div>
                <input></input>
                <input></input>
            </div> 
            <div></div>
            <div></div>
            <input></input>
        </div>
    )
}