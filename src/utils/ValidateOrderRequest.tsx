import { Order } from "../types/types";

export function ValidateOrderRequest(order:Order):Error|null{
    console.log(order)
    const limit = Math.pow(order.leverage,-1)
    let decimal:number = 4;
    if (typeof order.entry_price === "number"&&order.entry_price.toString().includes(".")){
        decimal = order.entry_price.toString().split(".")[1].length;
    }
    if (order.is_long){
        if (order.entry_price > order.profit_price){
			return new Error("매수 포지션에선 수익 실현가가 진입가보다 높아야 합니다.");
		}
        if (order.loss_price > order.entry_price){
            return new Error("매수 포지션에선 손실 감수가가 진입가보다 낮아야 합니다.");
        }
		if ((order.entry_price-order.loss_price)/order.entry_price > limit) {
			return new Error(`현재 레버리지 X${order.leverage}의 최대 손실 감수가격은 ${Math.ceil(order.entry_price*(1-limit)*Math.pow(10,decimal))/Math.pow(10,decimal)}입니다.`)
		}
    }else{
        if (order.entry_price < order.profit_price){
			return new Error("매도 포지션에선 수익 실현가가 진입가보다 낮아야 합니다.");
		}
        if (order.loss_price < order.entry_price){
            return new Error("매도 포지션에선 손실 감수가가 진입가보다 높아야 합니다.");
        }
		if ((order.loss_price-order.entry_price)/order.entry_price > limit) {
			return new Error(`현재 레버리지 X${order.leverage}의 최대 손실 감수가격은 ${Math.floor(order.entry_price*(1+limit)*Math.pow(10,decimal))/Math.pow(10,decimal)}입니다.`)
		}
    }
    return null;
}