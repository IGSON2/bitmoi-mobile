import { configureStore } from "@reduxjs/toolkit";
import scoreReducer from "./score";
import modeReducer from "./mode";
import chartLoadedReducer from "./chartLoaded";
import chartInfoReducer from "./chartInfo";
import pracStateReducer from "./pracState";

export const store = configureStore({
  reducer: {
    isChartLoaded: chartLoadedReducer,
    score: scoreReducer,
    mode: modeReducer,
    chartInfo: chartInfoReducer,
    pracState: pracStateReducer,
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
