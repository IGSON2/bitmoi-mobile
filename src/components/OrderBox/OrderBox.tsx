import { useState } from "react";
import "./OrderBox.css"
import { OrderBox_Menu } from "../../types/types";
import { History } from "./History/History";
import { OrderInput } from "./OrderInput/OrderInput";

export function OrderBox(){
    const [orderBoxMenu,setOrderBoxMenu]=useState<OrderBox_Menu>(OrderBox_Menu.None)
    const [componentToRender,setComponentToRender]=useState<JSX.Element>(<div></div>)
    const OnLongClick = () => {
        setOrderBoxMenu(OrderBox_Menu.Long);
        setComponentToRender(<OrderInput isLong={true}/>)
    }
    const OnShortClick = () => {
        setOrderBoxMenu(OrderBox_Menu.Short);
        setComponentToRender(<OrderInput isLong={false}/>)
    }
    const OnHistoryClick = () => {
        setOrderBoxMenu(OrderBox_Menu.History);
        setComponentToRender(<History/>) // TODO: 유저 기록 추가 안됨 -> 외래키 문제
    }

    const OnBlankClick = () => {
        setOrderBoxMenu(OrderBox_Menu.None);
        setComponentToRender(<div></div>)
    }
    return (
        <div className="orderBox">
            {orderBoxMenu !== OrderBox_Menu.None?
                <div className="orderBox_blank" onClick={OnBlankClick}></div>
            : null}
            <div className="orderBox_menu_box">
                <div className="orderBox_menu" onClick={OnLongClick}>{`매수 (Long)`}</div>
                <div className="orderBox_menu" onClick={OnShortClick}>{`매도 (Short)`}</div>
                <div className="orderBox_menu" onClick={OnHistoryClick}>{`거래내역`}</div>
            </div>
            {orderBoxMenu !== OrderBox_Menu.None?
                <div className="orderBox_active">
                    <div className="orderBox_router">
                        <div className="orderBox_menu_box">
                            <div className={orderBoxMenu === OrderBox_Menu.Long?"orderBox_menu long_active" :"orderBox_menu"} onClick={OnLongClick}>{`매수 (Long)`}</div>
                            <div className={orderBoxMenu === OrderBox_Menu.Short?"orderBox_menu short_active" :"orderBox_menu"} onClick={OnShortClick}>{`매도 (Short)`}</div>
                            <div className={orderBoxMenu === OrderBox_Menu.History?"orderBox_menu history_active" :"orderBox_menu"} onClick={OnHistoryClick}>{`거래내역`}</div>
                        </div>
                        {componentToRender}
                    </div>
                </div>
            :null}
        </div>
    )
}