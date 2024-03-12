import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import "./OrderInput.css";
import HorizontalLine from "../../lines/HorizontalLine";
import axiosClient from "../../../utils/axiosClient";
import { OrderInit } from "../../../types/types";
import {
  ValidateOrderRequest,
  validateLossPrice,
} from "../../../utils/ValidateOrderRequest";
import {
  setOrderIsLong,
  setOrderLeverage,
  setOrderLossPrice,
  setOrderProfitPrice,
  setOrderQuantity,
} from "../../../store/order";
import { ModePrac } from "../../../types/const";
import { setStageSubmitState } from "../../../store/stageState";
import { SubmitState } from "../../../types/stageState";

interface Position {
  isLong: boolean;
}

const optionArray = [
  -100, -90, -80, -70, -60, -50, -40, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15,
  20, 25, 30, 40, 50, 60, 70, 80, 90, 100,
];

export function OrderInput({ isLong }: Position) {
  const [levClick, setLevClick] = useState(false);

  const order = useAppSelector((state) => state.order);
  const leverage = order.leverage;
  const entryPrice = order.entry_price;
  const pracBalance = useAppSelector((state) => state.userInfo.prac_balance);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setOrderIsLong(isLong));
  }, [isLong]);

  const [quantityRate, setQuantityRate] = useState(
    Math.floor(
      (10000 * order.quantity) / ((pracBalance * leverage) / entryPrice)
    ) / 100
  );
  const [profitRate, setProfitRate] = useState(0);
  const [lossRate, setLossRate] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const quanErr = "주문가능 금액을 초과하였습니다.";

  const quantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.valueAsNumber < 0) {
      dispatch(setOrderQuantity(0));
      setQuantityRate(0);
    } else {
      if ((event.target.valueAsNumber * entryPrice) / leverage > pracBalance) {
        setErrorMessage(quanErr);
        return;
      }
      dispatch(setOrderQuantity(event.target.valueAsNumber));
      setQuantityRate(
        Math.floor(
          (10000 * event.target.valueAsNumber) /
            ((pracBalance * leverage) / entryPrice)
        ) / 100
      );
      if (errorMessage === quanErr) setErrorMessage("");
    }
  };

  const quantityRateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const valueAsNumber = Number(event.target.value);
    const withCommission = order.mode === ModePrac ? 1 : 0.98;
    setQuantityRate(valueAsNumber);
    dispatch(
      setOrderQuantity(
        Math.floor(
          ((pracBalance * leverage * withCommission) / entryPrice) *
            (valueAsNumber / 100) *
            10000
        ) / 10000
      )
    );
    if (errorMessage === quanErr) setErrorMessage("");
  };

  const profitChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.valueAsNumber < 0) {
      dispatch(setOrderProfitPrice(0));
    } else {
      dispatch(setOrderProfitPrice(event.target.valueAsNumber));
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
    dispatch(
      setOrderProfitPrice(
        Math.floor(entryPrice * (1 + valueAsNumber / 100) * 10000) / 10000
      )
    );
  };

  const lossChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.valueAsNumber < 0) {
      dispatch(setOrderLossPrice(0));
    } else {
      dispatch(setOrderLossPrice(event.target.valueAsNumber));
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
      dispatch(
        setOrderLossPrice(
          Math.ceil(entryPrice * (1 + valueAsNumber / 100) * 10000) / 10000
        )
      );
    } else {
      dispatch(
        setOrderLossPrice(
          Math.floor(entryPrice * (1 + valueAsNumber / 100) * 10000) / 10000
        )
      );
    }
  };

  const leverageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const levErr = "레버리지는 X50 이하로 설정해주세요.";
    if (!event.target.valueAsNumber) {
      dispatch(setOrderLeverage(1));
    } else {
      if (event.target.valueAsNumber < 1 || event.target.valueAsNumber > 50) {
        setErrorMessage(levErr);
        return;
      }
      dispatch(setOrderLeverage(event.target.valueAsNumber));
      dispatch(
        setOrderQuantity(
          Math.floor(
            ((pracBalance * event.target.valueAsNumber) / entryPrice) *
              (quantityRate / 100) *
              10000
          ) / 10000
        )
      );
      if (errorMessage === levErr) setErrorMessage("");
    }
  };

  const submitOrder = async () => {
    const orderReq: OrderInit = {
      ...order,
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
    dispatch(setStageSubmitState(SubmitState.Submit));
  };

  const resetInput = () => {
    setQuantityRate(0);
    dispatch(setOrderQuantity(0));
    setProfitRate(0);
    dispatch(setOrderProfitPrice(0));
    setLossRate(0);
    dispatch(setOrderLossPrice(0));
    dispatch(setOrderLeverage(1));
  };

  useEffect(() => {
    document.addEventListener("focusout", () => {
      window.scrollTo(0, 1);
    });
  }, []);

  return (
    <div className="orderInput">
      <div className="orderInput_area_top">
        <div className="orderInput_leverage">
          <div className="orderInput_leverage_title">
            <div>{"레버리지 (Leverage)"}</div>
            <img
              className="orderInput_help_button"
              src="/images/help.png"
              alt="?"
              onClick={() => {
                alert(
                  "레버리지는 돈을 빌려서 포지션 수량을 늘리는 거래 기법입니다.\n레버리지를 통해 수익을 극대화 할 수도 있지만, 손실이 클 경우 보유 재산을 모두 잃어 청산 당할 위험 또한 있습니다."
                );
              }}
            />
          </div>
          <div
            className="orderInput_leverage_value"
            onClick={() => {
              setLevClick(true);
            }}
          >{`X${leverage}`}</div>
        </div>
        {levClick ? (
          <div className={`orderInput_leverage_modal fixed-component`}>
            <div className={`orderInput_leverage_blank fixed-component`}></div>
            <div className={`orderInput_leverage_range fixed-component`}>
              <div
                className="orderInput_leverage_range_value"
                onClick={() => {
                  const res = prompt(
                    "레버리지를 입력하세요 (1~50)",
                    leverage.toString()
                  );
                  if (!res || Number(res) < 1 || Number(res) > 50) {
                    alert("1~50 사이의 값을 입력하세요.");
                    return;
                  }
                  dispatch(setOrderLeverage(Number(res)));
                }}
              >{`X${leverage}`}</div>
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
            {pracBalance.toLocaleString("ko-KR", {
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="orderInput_balance3">USDP</div>
        </div>
        <div className="input_wrapper">
          <div
            className="input_wrapper_1"
            onClick={() => {
              alert("연습모드에서는 진입 시점 가격으로만 주문이 가능합니다.");
            }}
          >
            <div className="input_label">{"가격(USDP)"}</div>
            <div style={{ color: "#191919" }}>{entryPrice}</div>
          </div>
          {/* <select className="input_wrapper_2">
            <option>현재가</option>
          </select> */}
          <div
            className="input_wrapper_2"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            현재가
          </div>
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
              value={order.quantity}
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
        <div
          className="orderInput_balance"
          style={{ fontSize: "11px" }}
        >{`주문 총액 : ${
          (
            (order.quantity * order.entry_price) /
            order.leverage
          ).toLocaleString("en-US", {
            maximumFractionDigits: 4,
          }) + " USDP"
        }`}</div>

        <HorizontalLine />

        <div className="input_narrow_wrapper">
          <div className="orderInput_title_help">
            <div>{"수익 실현 가격 (Take Profit)"}</div>
            <img
              className="orderInput_help_button"
              src="/images/help.png"
              alt="?"
              onClick={() => {
                alert(
                  "미리 익절할 가격을 지정합니다.\n롱 포지션의 경우 현재가보다 높은 가격에서, 숏 포지션의 경우 현재가보다 낮은 가격에서 수익이 발생합니다."
                );
              }}
            />
          </div>

          <div className="input_title_wrapper">
            <div className="input_wrapper_1">
              <label className="input_label" htmlFor="profitPrice">
                {"익절 가격(USDP)"}
              </label>
              <input
                id="profitPrice"
                type={"number"}
                step={"0.0001"}
                value={order.profit_price}
                onChange={profitChange}
              ></input>
            </div>
            <select
              className="input_wrapper_2"
              value={profitRate}
              onChange={profitRateChange}
            >
              <option value={0}>현재가 대비%</option>
              {optionArray.map((i) => {
                return (
                  <option
                    className={
                      i > 0 ? "option_pos" : i === 0 ? "" : "option_neg"
                    }
                    value={i}
                    key={i}
                  >
                    {i}%
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="input_narrow_wrapper" style={{ marginTop: "10px" }}>
          <div className="orderInput_title_help">
            <div>{"손실 감수 가격 (Stop loss)"}</div>
            <img
              className="orderInput_help_button"
              src="/images/help.png"
              alt="?"
              onClick={() => {
                alert(
                  "미리 손절할 가격을 지정합니다.\n롱 포지션의 경우 현재가보다 낮은 가격에서, 숏 포지션의 경우 현재가보다 높은 가격에서 손실이 발생합니다."
                );
              }}
            />
          </div>
          <div className="input_title_wrapper">
            <div className="input_wrapper_1">
              <label className="input_label" htmlFor="stoplossprice">
                {"손절 가격(USDP)"}
              </label>
              <input
                id="stoplossprice"
                type={"number"}
                step={"0.0001"}
                value={order.loss_price}
                onChange={lossChange}
              ></input>
            </div>
            <select
              className="input_wrapper_2"
              value={lossRate}
              onChange={lossRateChange}
            >
              <option value={0}>현재가 대비%</option>
              {optionArray.map((i) => {
                return (
                  <option
                    className={
                      i > 0 ? "option_pos" : i === 0 ? "" : "option_neg"
                    }
                    value={i}
                    key={i}
                  >
                    {i}%
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="orderInput_area_bottom">
        {errorMessage !== "" ? (
          <div className="error_message">{errorMessage}</div>
        ) : null}

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

        {order.mode === ModePrac ? null : (
          <div className="commission">
            <div>수수료</div>
            <div>0.02%</div>
          </div>
        )}
      </div>
    </div>
  );
}
