import { ChangeEvent, useState } from "react"
import { useAppSelector } from "../../../hooks/hooks"
import "./OrderInput.css"

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
            <div>
                <div>주문가능</div>
                <div>{balance}</div>
                <div>USDT</div>
            </div>
            <div>
                {/* <label htmlFor="">{'가격(USDT)'}</label> */}
                {/* <input></input> TODO : 예약주문 */}
                {/* <input></input> */}
                <div>
                    <div>{'가격(USDT)'}</div>
                    <div>{entryPrice}</div>
                </div>
                <div>현재가</div>
            </div>
            <div></div>
            <div>
                <input
                    id="quantity"
                    type={"number"}
                    step={"0.0001"}
                    value={quantity}
                    onChange={quantityChange}
                ></input>
                <select
                    value={quantityRate}
                    onChange={quantityRateChange}
                >
                    <option value={25}>25%</option>
                    <option value={50}>50%</option>
                    <option value={75}>75%</option>
                    <option value={100} selected={true}>100%</option>
                </select>
            </div>            
            
            <div></div>

            <div></div>
            <div>
                <input></input>
                <input></input>
            </div>
            <div></div>
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