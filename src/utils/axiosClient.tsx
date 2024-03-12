import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL || "https://api.bitmoi.co.kr";

const axiosClient = axios.create({
  baseURL: apiURL,
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
  //왜 요청이 여섯 번 씩 갈까
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      if (originalRequest.url === "/basic/verifyToken") {
        return Promise.reject(error);
      }

      try {
        if (!refreshToken) {
          throw new Error("No refresh token.");
        }
        const newAxiosClient = axios.create({
          baseURL: apiURL,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const refResponse = await newAxiosClient.post("/basic/reissueAccess", {
          refresh_token: refreshToken,
        });
        if (refResponse && refResponse.status === 200) {
          localStorage.removeItem("accessToken");
          localStorage.setItem("accessToken", refResponse.data.access_token);
          console.log("access token updated by refresh token.");

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${refResponse.data.access_token}`;
          if (originalRequest.url === "/basic/verifyToken") {
            originalRequest.data = JSON.stringify({
              token: refResponse.data.access_token,
            });
          }

          return axiosClient(originalRequest);
        }
      } catch (reissueError) {
        console.error("Error while reissuing access token:", reissueError);
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        const reqUrl = originalRequest.headers["req-url"];
        window.location.href = `/login/${reqUrl}`;
        return Promise.reject(reissueError);
      }
    }
    // TODO: status === 429일 때, response가 undefined로 반환되는 문제 해결 필요
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        alert("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
