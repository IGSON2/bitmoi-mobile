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
      state.created_at = action.payload.created_at;
      state.email = action.payload.email;
      state.metamask_address = action.payload.metamask_address;
      state.nickname = action.payload.nickname;
      state.password_changed_at = action.payload.password_changed_at;
      state.photo_url = action.payload.photo_url;
      state.user_id = action.payload.user_id;
    },
  },
});

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
