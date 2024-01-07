import { useEffect } from "react"
import "./History.css"
import axiosClient from "../../../utils/axiosClient"
export const History = () => {
    useEffect(() => {
        async function GetHistory(){
            const res = await axiosClient.get("/myscore/1")
            console.log(res.data)
        }
        GetHistory();
    },[])
    return (
        <div className="history">History</div>
    )
}