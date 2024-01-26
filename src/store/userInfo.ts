import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../types/types";

const initialState: UserInfo = {
  user_id: "",
  nickname: "",
  email: "",
  photo_url: "",
  metamask_address: "",
  password_changed_at: "",
  prac_balance: 0,
  comp_balance: 0,
  recommender_code: "",
  created_at: "",
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.user_id = action.payload.user_id;
      state.nickname = action.payload.nickname;
      state.email = action.payload.email;
      state.photo_url = action.payload.photo_url;
      state.metamask_address = action.payload.metamask_address;
      state.password_changed_at = action.payload.password_changed_at;
      state.prac_balance = action.payload.prac_balance;
      state.comp_balance = action.payload.comp_balance;
      state.recommender_code = action.payload.recommender_code;
      state.created_at = action.payload.created_at;
    },
  },
});

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
