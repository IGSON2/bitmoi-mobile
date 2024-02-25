import { useEffect, useState } from "react";
import "./OrderBox.css";
import { OrderBox_Menu } from "../../types/types";
import { History } from "./History/History";
import { OrderInput } from "./OrderInput/OrderInput";
import { useAppSelector } from "../../hooks/hooks";

export function OrderBox() {
  const closed = useAppSelector((state) => state.positionClosed.closed);
  const [orderBoxMenu, setOrderBoxMenu] = useState<OrderBox_Menu>(
    OrderBox_Menu.None
  );
  const [componentToRender, setComponentToRender] = useState<JSX.Element>(
    <div></div>
  );
  const OnLongClick = () => {
    setOrderBoxMenu(OrderBox_Menu.Long);
    setComponentToRender(<OrderInput isLong={true} />);
  };
  const OnShortClick = () => {
    setOrderBoxMenu(OrderBox_Menu.Short);
    setComponentToRender(<OrderInput isLong={false} />);
  };
  const OnHistoryClick = () => {
    setOrderBoxMenu(OrderBox_Menu.History);
    setComponentToRender(<History />);
  };

  const OnBlankClick = () => {
    setOrderBoxMenu(OrderBox_Menu.None);
    setComponentToRender(<div></div>);
  };

  useEffect(() => {
    if (closed) {
      setComponentToRender(<div></div>); // 왜 안바뀌는가?
    }
  }, [closed]);

  return (
    <div className="orderBox">
      {orderBoxMenu !== OrderBox_Menu.None ? (
        <div
          className={`orderBox_blank fixed-component`}
          onClick={OnBlankClick}
        ></div>
      ) : (
        <div className="orderBox_menu_box">
          <div
            className="orderBox_menu"
            onClick={OnLongClick}
          >{`매수 (Long)`}</div>
          <div
            className="orderBox_menu"
            onClick={OnShortClick}
          >{`매도 (Short)`}</div>
          <div
            className="orderBox_menu"
            onClick={OnHistoryClick}
          >{`거래내역`}</div>
        </div>
      )}

      {orderBoxMenu !== OrderBox_Menu.None ? (
        <div className={`orderBox_router fixed-component`}>
          <div className="orderBox_menu_box">
            <div
              className={
                orderBoxMenu === OrderBox_Menu.Long
                  ? "orderBox_menu long_active"
                  : "orderBox_menu"
              }
              onClick={OnLongClick}
            >{`매수 (Long)`}</div>
            <div
              className={
                orderBoxMenu === OrderBox_Menu.Short
                  ? "orderBox_menu short_active"
                  : "orderBox_menu"
              }
              onClick={OnShortClick}
            >{`매도 (Short)`}</div>
            <div
              className={
                orderBoxMenu === OrderBox_Menu.History
                  ? "orderBox_menu history_active"
                  : "orderBox_menu"
              }
              onClick={OnHistoryClick}
            >{`거래내역`}</div>
          </div>
          {componentToRender}
        </div>
      ) : null}
    </div>
  );
}
