import axiosClient from "./axiosClient";

export async function checkAttendance() {
  try {
    const response = await axiosClient.get("/auth/checkAttendance");
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
}
