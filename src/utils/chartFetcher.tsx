import { useAppDispatch } from "../hooks/hooks";
import { setChartInfo } from "../store/chartInfo";
import { setChartLoaded } from "../store/chartLoaded";
import axiosClient from "./axiosClient";

export async function GetChart(mode:string,titleArray:string[]){
    // const dispatch = useAppDispatch();
    // try{
    //     const response = await axiosClient.get(`/${mode}?names=${titleArray}`);
    //     dispatch(setChartInfo(response.data));
    //     dispatch(setChartLoaded(true));
    // }catch(error){
    //     console.error(error);
    // }
}

export async function FetchInterval (interval:string,identifier:string,stage:string){

}
