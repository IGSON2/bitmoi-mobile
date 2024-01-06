import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../types/types";

const initialState: UserInfo = {
  user_id: "",
  nickname: "",
  email: "",
  photo_url: "",
  metamask_address: "",
  password_changed_at: "",
  created_at: "",
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state = action.payload;
    },
  },
});

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
