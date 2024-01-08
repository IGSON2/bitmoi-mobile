import { ChangeEvent, useState } from "react"
import { useAppSelector } from "../../../hooks/hooks"
import "./OrderInput.css"
import HorizontalLine from "../../lines/HorizontalLine";
import axiosClient from "../../../utils/axiosClient";
import { Order } from "../../../types/types";
import { ValidateOrderRequest } from "../../../utils/ValidateOrderRequest";

interface Position {
    isLong: boolean;
}

  
export function OrderInput ({isLong}:Position) {
    const pracState = useAppSelector((state)=>state.pracState)
    const userInfo = useAppSelector((state)=>state.userInfo)
    const balance = pracState.balance
    const entryPrice = pracState.entryPrice

    const [quantity, setQuantity] = useState(0);
    const [quantityRate, setQuantityRate] = useState(0);
    const [profitPrice, setProfitPrice] = useState(0);
    const [profitRate, setProfitRate] = useState(0);
    const [lossPrice, setLossPrice] = useState(0);
    const [lossRate, setLossRate] = useState(1);
    const [leverage, setLeverage] = useState(1);
    const [errorMessage,setErrorMessage] = useState("")

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
            ((balance * leverage * 0.98) / entryPrice) *
              (valueAsNumber / 100) *
              10000
          ) / 10000
        );
    };

    const profitChange = (event:ChangeEvent<HTMLInputElement>) => {
        if (event.target.valueAsNumber < 0) {
          setProfitPrice(0);
        } else {
          setProfitPrice(event.target.valueAsNumber);
          setProfitRate(
            Math.floor(
              (10000 * (event.target.valueAsNumber - entryPrice)) / entryPrice
            ) / 100
          );
        }
      };

      const profitRateChange = (event:ChangeEvent<HTMLSelectElement>) => {
        const valueAsNumber = Number(event.target.value);
        setProfitRate(valueAsNumber);
          setProfitPrice(
            Math.floor(
              entryPrice * (1 + valueAsNumber / 100) * 10000
            ) / 10000
          );
      };

      const lossChange = (event:ChangeEvent<HTMLInputElement>) => {
        if (event.target.valueAsNumber < 0) {
          setLossPrice(0);
        } else {
          setLossPrice(event.target.valueAsNumber);
          setLossRate(
            Math.floor(
              (10000 * (event.target.valueAsNumber - entryPrice)) / entryPrice
            ) / 100
          );
        }
      };

      const lossRateChange = (event:ChangeEvent<HTMLSelectElement>) => {
        const valueAsNumber = Number(event.target.value);
        setLossRate(valueAsNumber);
        if(isLong){
          setLossPrice(
            Math.ceil(
              entryPrice * (1 + valueAsNumber / 100) * 10000
            ) / 10000
          );
        }else{
          setLossPrice(
            Math.floor(
              entryPrice * (1 + valueAsNumber / 100) * 10000
              ) / 10000
              );
        }
      };

      const leverageChange = (event:ChangeEvent<HTMLInputElement>) => {
        if (!event.target.valueAsNumber) {
          setLeverage(1);
        } else {
          setLeverage(event.target.valueAsNumber);
          setQuantity(
            Math.floor(
              ((balance * event.target.valueAsNumber * 0.98) / entryPrice) *
                (quantityRate / 100) *
                10000
            ) / 10000
          );
        }
      };

      const submitOrder = async () => {
        const order:Order = {
            mode: "practice",
            user_id: userInfo.user_id,
            name: pracState.name,
            stage:pracState.stage,
            is_long: isLong,
            entry_price: entryPrice,
            quantity: quantity,
            profit_price: profitPrice,
            loss_price: lossPrice,
            leverage: leverage,
            balance: balance,
            identifier: pracState.identifier,
            score_id:pracState.score_id,
            waiting_Term:1
        }
        const err = ValidateOrderRequest(order);
        if (err){
            setErrorMessage(err.message);
            return;
        }
        const response = await axiosClient.post("/practice",order);
      }
    return (
        <div className="OrderInput">
            <div className="OrderInput_balance">
                <div className="OrderInput_balance1">주문가능</div>
                <div className="OrderInput_balance2">
                    {balance.toLocaleString("ko-KR", {
                    maximumFractionDigits: 2})}
                </div>
                <div className="OrderInput_balance3">USDT</div>
            </div>
            <div className="input_wrapper">
                <div className="input_wrapper_1">
                    <div className="input_label">{'가격(USDT)'}</div>
                    <div style={{color:"#191919"}}>{entryPrice}</div>
                </div>
                <select className="input_wrapper_2">
                    <option>현재가</option>
                </select>
            </div>

            <div className="input_wrapper">
                <div className="input_wrapper_1">
                    <label className="input_label" htmlFor="quantity">수량</label>
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
                    <option>가능</option>
                    <option value={25}>25%</option>
                    <option value={50}>50%</option>
                    <option value={100}>100%</option>
                </select>
            </div>            
            
            <HorizontalLine/>

            <div className="orderInput_title_help">
                <div>{'수익 실현 가격 (Take Profit)'}</div>
                <img src="/images/help.png"/>
            </div>

            <div className="input_wrapper">
                <div className="input_wrapper_1">
                    <label className="input_label" htmlFor="profitPrice">{'익절 가격(USDT)'}</label>
                    <input 
                        id="profitPrice"
                        type={"number"}
                        step={"0.0001"}
                        value={profitPrice}
                        onChange={profitChange}
                    ></input>
                </div>
                <select 
                    className="input_wrapper_2"
                    value={profitRate}
                    onChange={profitRateChange}
                >
                    <option value={0}>현재가 대비%</option>
                    <option className="option_neg" value={-30}>-30%</option>
                    <option className="option_neg" value={-25}>-25%</option>
                    <option className="option_neg" value={-20}>-20%</option>
                    <option className="option_neg" value={-15}>-15%</option>
                    <option className="option_neg" value={-10}>-10%</option>
                    <option className="option_neg" value={-5}>-5%</option>
                    <option value={0}>0%</option>
                    <option className="option_pos" value={5}>5%</option>
                    <option className="option_pos" value={10}>10%</option>
                    <option className="option_pos" value={15}>15%</option>
                    <option className="option_pos" value={20}>20%</option>
                    <option className="option_pos" value={25}>25%</option>
                    <option className="option_pos" value={30}>30%</option>
                </select>
            </div>

            <div className="orderInput_title_help">
                <div>{'손실 감수 가격 (Stop loss)'}</div>
                <img src="/images/help.png" alt="help"/>
            </div>
            <div className="input_wrapper">
                <div className="input_wrapper_1">
                    <label className="input_label" htmlFor="stoplossprice">{'손절 가격(USDT)'}</label>
                    <input 
                        id="stoplossprice"
                        type={"number"}
                        step={"0.0001"}
                        value={lossPrice}
                        onChange={lossChange}
                        ></input>
                </div>
                <select
                    className="input_wrapper_2"
                    value={lossRate}
                    onChange={lossRateChange}
                >
                    <option value={0}>현재가 대비%</option>
                    <option className="option_neg" value={-30}>-30%</option>
                    <option className="option_neg" value={-25}>-25%</option>
                    <option className="option_neg" value={-20}>-20%</option>
                    <option className="option_neg" value={-15}>-15%</option>
                    <option className="option_neg" value={-10}>-10%</option>
                    <option className="option_neg" value={-5}>-5%</option>
                    <option value={0}>0%</option>
                    <option className="option_pos" value={5}>5%</option>
                    <option className="option_pos" value={10}>10%</option>
                    <option className="option_pos" value={15}>15%</option>
                    <option className="option_pos" value={20}>20%</option>
                    <option className="option_pos" value={25}>25%</option>
                    <option className="option_pos" value={30}>30%</option>
                </select>
            </div> 

            <div className="orderInput_title_help">
                <div>{'레버리지 (Leverage)'}</div>
                <img src="/images/help.png"/>
            </div>
            <div className="leverage">{`X${leverage}`}</div>
            <input
                className="leverage_range"
                type={"range"}
                value={leverage}
                min={1}
                max={50}
                step={"1"}
                onChange={leverageChange}
            ></input>

            <div className="input_wrapper">
                <button className="reset_btn">초기화</button>
                <button className={isLong?"order_long_btn":"order_short_btn"} onClick={submitOrder}>{isLong?"매수":"매도"}</button>
            </div>

            {
                errorMessage !== "" ?
                <div className="error_message">{errorMessage}</div>:
                null
            }

            <div className="commission">
                <div>수수료</div>
                <div>0.02%</div>
            </div>
        </div>
    )
}