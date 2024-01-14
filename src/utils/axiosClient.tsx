import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.bitmoi.co.kr",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
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

const refreshToken = localStorage.getItem("refreshToken");
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refResponse = await axiosClient.post("/reissueAccess", {
          refresh_token: refreshToken,
        });
        if (refResponse.status === 200) {
          localStorage.removeItem("accessToken");
          localStorage.setItem("accessToken", refResponse.data.access_token);
          console.log("access token updated by refresh token.");
        } else {
          throw Error("refresh token is expired.");
        }
        axiosClient(originalRequest);
      } catch (reissueError) {
        console.error("Error while reissuing access token:", reissueError);
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
        return null;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;