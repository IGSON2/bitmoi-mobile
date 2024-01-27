import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import "./OrderInput.css";
import HorizontalLine from "../../lines/HorizontalLine";
import axiosClient from "../../../utils/axiosClient";
import { OrderInit } from "../../../types/types";
import {
  ValidateOrderRequest,
  validateLossPrice,
} from "../../../utils/ValidateOrderRequest";
import order, {
  setOrderIsLong,
  setOrderLeverage,
  setOrderLossPrice,
  setOrderMaxTimestamp,
  setOrderMinTimestamp,
  setOrderProfitPrice,
  setOrderQuantity,
  setOrderReqInterval,
} from "../../../store/order";
import { ModePrac, oneH } from "../../../types/const";
import { setSubmit } from "../../../store/submit";

interface Position {
  isLong: boolean;
}

export function OrderInput({ isLong }: Position) {
  const [levClick, setLevClick] = useState(false);

  const entryTimestamp = useAppSelector((state) => state.stageState.entrytime);

  const order = useAppSelector((state) => state.order);
  const entryPrice = order.entry_price;
  const balance = order.balance;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setOrderIsLong(isLong));
  }, [isLong]);

  const [quantity, setQuantity] = useState(0);
  const [quantityRate, setQuantityRate] = useState(0);
  const [profitPrice, setProfitPrice] = useState(0);
  const [profitRate, setProfitRate] = useState(0);
  const [lossPrice, setLossPrice] = useState(0);
  const [lossRate, setLossRate] = useState(1);
  const [leverage, setLeverage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const quantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.valueAsNumber < 0) {
      setQuantity(0);
    } else {
      setQuantity(event.target.valueAsNumber);
    }
  };

  const quantityRateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const valueAsNumber = Number(event.target.value);
    const withCommission = order.mode === ModePrac ? 1 : 0.98;
    setQuantityRate(valueAsNumber);
    setQuantity(
      Math.floor(
        ((balance * leverage * withCommission) / entryPrice) *
          (valueAsNumber / 100) *
          10000
      ) / 10000
    );
  };

  const profitChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const profitRateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const valueAsNumber = Number(event.target.value);
    setProfitRate(valueAsNumber);
    setProfitPrice(
      Math.floor(entryPrice * (1 + valueAsNumber / 100) * 10000) / 10000
    );
  };

  const lossChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const lossRateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const valueAsNumber = Number(event.target.value);
    const err = validateLossPrice(
      order.is_long,
      entryPrice,
      Math.ceil(entryPrice * (1 + valueAsNumber / 100) * 10000) / 10000,
      leverage
    );
    if (err) {
      setErrorMessage(err.message);
      return;
    }
    setLossRate(valueAsNumber);
    if (isLong) {
      setLossPrice(
        Math.ceil(entryPrice * (1 + valueAsNumber / 100) * 10000) / 10000
      );
    } else {
      setLossPrice(
        Math.floor(entryPrice * (1 + valueAsNumber / 100) * 10000) / 10000
      );
    }
  };

  const leverageChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    // 주문제출 -> OneChart interval 변경 및 Min, Max timestamp 설정 -> result Chart append

    dispatch(setOrderQuantity(quantity));
    dispatch(setOrderProfitPrice(profitPrice));
    dispatch(setOrderLossPrice(lossPrice));
    dispatch(setOrderLeverage(leverage));

    dispatch(setOrderReqInterval(oneH));
    dispatch(setOrderMinTimestamp(entryTimestamp));
    dispatch(setOrderMaxTimestamp(entryTimestamp + 1));

    const orderReq: OrderInit = {
      mode: order.mode,
      user_id: order.user_id,
      score_id: order.score_id,
      name: order.name,
      stage: order.stage,
      is_long: order.is_long,
      entry_price: entryPrice,
      quantity: quantity,
      profit_price: profitPrice,
      loss_price: lossPrice,
      leverage: leverage,
      balance: order.balance,
      identifier: order.identifier,
    };

    const err = ValidateOrderRequest(orderReq);
    if (err) {
      setErrorMessage(err.message);
      return;
    }
    try {
      await axiosClient.post("/intermediate/init", orderReq);
    } catch (error) {
      console.error(error);
    }
    dispatch(setSubmit(true));
  };

  const resetInput = () => {
    setQuantityRate(0);
    setQuantity(0);
    setProfitRate(0);
    setProfitPrice(0);
    setLossRate(0);
    setLossPrice(0);
    setLeverage(1);
  };

  return (
    <div className="orderInput">
      <div className="orderInput_leverage">
        <div className="orderInput_leverage_title">
          <div>{"레버리지 (Leverage)"}</div>
          <img src="/images/help.png" alt="?" />
        </div>
        <div
          className="orderInput_leverage_value"
          onClick={() => {
            setLevClick(true);
          }}
        >{`X${leverage}`}</div>
      </div>
      {levClick ? (
        <div className="orderInput_leverage_modal">
          <div
            className="orderInput_leverage_blank"
            // onClick={() => {
            //   setLevClick(false);
            // }}
          ></div>
          <div className="orderInput_leverage_range">
            <div className="orderInput_leverage_range_value">{`X${leverage}`}</div>
            <input
              type={"range"}
              value={leverage}
              min={1}
              max={50}
              step={"1"}
              onChange={leverageChange}
            ></input>
            <div
              className="orderInput_leverage_range_buttons"
              onClick={() => {
                setLevClick(false);
              }}
            >
              <button className="orderInput_leverage_range_buttons_cancel">
                취소
              </button>
              <button className="orderInput_leverage_range_buttons_select">{`${leverage}배 선택`}</button>
            </div>
          </div>
        </div>
      ) : null}
      <HorizontalLine />
      <div className="orderInput_balance">
        <div className="orderInput_balance1">주문가능</div>
        <div className="orderInput_balance2">
          {order.balance.toLocaleString("ko-KR", {
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="orderInput_balance3">USDT</div>
      </div>
      <div className="input_wrapper">
        <div className="input_wrapper_1">
          <div className="input_label">{"가격(USDT)"}</div>
          <div style={{ color: "#191919" }}>{entryPrice}</div>
        </div>
        <select className="input_wrapper_2">
          <option>현재가</option>
        </select>
      </div>

      <div className="input_wrapper">
        <div className="input_wrapper_1">
          <label className="input_label" htmlFor="quantity">
            수량
          </label>
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

      <HorizontalLine />
      <div className="input_narrow_wrapper">
        <div className="orderInput_title_help">
          <div>{"수익 실현 가격 (Take Profit)"}</div>
          <img src="/images/help.png" alt="?" />
        </div>

        <div className="input_title_wrapper">
          <div className="input_wrapper_1">
            <label className="input_label" htmlFor="profitPrice">
              {"익절 가격(USDT)"}
            </label>
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
            <option className="option_neg" value={-30}>
              -30%
            </option>
            <option className="option_neg" value={-25}>
              -25%
            </option>
            <option className="option_neg" value={-20}>
              -20%
            </option>
            <option className="option_neg" value={-15}>
              -15%
            </option>
            <option className="option_neg" value={-10}>
              -10%
            </option>
            <option className="option_neg" value={-5}>
              -5%
            </option>
            <option value={0}>0%</option>
            <option className="option_pos" value={5}>
              5%
            </option>
            <option className="option_pos" value={10}>
              10%
            </option>
            <option className="option_pos" value={15}>
              15%
            </option>
            <option className="option_pos" value={20}>
              20%
            </option>
            <option className="option_pos" value={25}>
              25%
            </option>
            <option className="option_pos" value={30}>
              30%
            </option>
          </select>
        </div>
      </div>
      <div className="input_narrow_wrapper">
        <div className="orderInput_title_help">
          <div>{"손실 감수 가격 (Stop loss)"}</div>
          <img src="/images/help.png" alt="?" />
        </div>
        <div className="input_title_wrapper">
          <div className="input_wrapper_1">
            <label className="input_label" htmlFor="stoplossprice">
              {"손절 가격(USDT)"}
            </label>
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
            <option className="option_neg" value={-30}>
              -30%
            </option>
            <option className="option_neg" value={-25}>
              -25%
            </option>
            <option className="option_neg" value={-20}>
              -20%
            </option>
            <option className="option_neg" value={-15}>
              -15%
            </option>
            <option className="option_neg" value={-10}>
              -10%
            </option>
            <option className="option_neg" value={-5}>
              -5%
            </option>
            <option value={0}>0%</option>
            <option className="option_pos" value={5}>
              5%
            </option>
            <option className="option_pos" value={10}>
              10%
            </option>
            <option className="option_pos" value={15}>
              15%
            </option>
            <option className="option_pos" value={20}>
              20%
            </option>
            <option className="option_pos" value={25}>
              25%
            </option>
            <option className="option_pos" value={30}>
              30%
            </option>
          </select>
        </div>
      </div>

      <div className="input_wrapper" style={{ minHeight: "40px" }}>
        <button className="reset_btn" onClick={resetInput}>
          초기화
        </button>
        <button
          className={isLong ? "order_long_btn" : "order_short_btn"}
          onClick={submitOrder}
        >
          {isLong ? "매수" : "매도"}
        </button>
      </div>

      {errorMessage !== "" ? (
        <div className="error_message">{errorMessage}</div>
      ) : null}

      {order.mode === ModePrac ? null : (
        <div className="commission">
          <div>수수료</div>
          <div>0.02%</div>
        </div>
      )}
    </div>
  );
}
