import { configureStore } from "@reduxjs/toolkit";
import chartInfoReducer from "./chartInfo";
import scoreReducer from "./score";
import modeReducer from "./mode";
import chartLoadedReducer from "./chartLoaded";

export const store = configureStore({
  reducer: {
    chartInfo: chartInfoReducer,
    isChartLoaded: chartLoadedReducer,
    score: scoreReducer,
    mode: modeReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
