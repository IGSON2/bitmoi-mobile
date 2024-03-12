import axiosClient from "./axiosClient";

export async function checkAccessTokenValidity(reqUrl: string) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken) {
    return null;
  }
  try {
    const response = await axiosClient.post("/basic/verifyToken", {
      token: accessToken,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw response.data;
    }
  } catch (error) {
    try {
      const refResponse = await axiosClient.post(
        "/basic/reissueAccess",
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            "req-url": reqUrl,
          },
        }
      );
      if (refResponse.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", refResponse.data.access_token);
        return refResponse.data.user;
      } else {
        return null;
      }
    } catch (reissueError) {
      console.error("Error while reissuing access token:", reissueError);
      return null;
    }
  }
}
