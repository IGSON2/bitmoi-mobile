import { configureStore } from "@reduxjs/toolkit";
import scoreHistoryReducer from "./scoreHistory";
import scoreReducer from "./score";
import modeReducer from "./mode";
import chartLoadedReducer from "./chartLoaded";
import currentChartReducer from "./currentChart";
import stageStateReducer from "./stageState";
import userInfoReducer from "./userInfo";
import intervalChartsReducer from "./intervalCharts";
import orderReducer from "./order";
import submitReducer from "./submit";
import positionClosedReducer from "./positionClosed";

export const store = configureStore({
  reducer: {
    isChartLoaded: chartLoadedReducer,
    score: scoreReducer,
    scoreHistory: scoreHistoryReducer,
    mode: modeReducer,
    currentChart: currentChartReducer,
    stageState: stageStateReducer,
    userInfo: userInfoReducer,
    intervalCharts: intervalChartsReducer,
    order: orderReducer,
    submit: submitReducer,
    positionClosed: positionClosedReducer,
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
