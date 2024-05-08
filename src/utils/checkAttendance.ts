import axios from "axios";
import { apiURL } from "./axiosClient";

export async function checkAttendance() {
  const newAxiosClient = axios.create({
    baseURL: apiURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  newAxiosClient.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  try {
    const res = await newAxiosClient.get("/auth/checkAttendance");
    if (res.status === 200) {
      alert(
        `출석 체크 완료!\n연습모드 계좌로 ${Number(
          res.data.attendanceReward
        ).toLocaleString()} USDP가 지급되었습니다.`
      );
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(`[check attendance] ${err.response?.data}`);
    }
  }
}
