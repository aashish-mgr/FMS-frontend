import {configureStore} from '@reduxjs/toolkit'
import authSlice from "./slices/authSlice"
import { authApi } from './api/authApi';
import { categoryApi } from './api/categoryApi';
import { incomeApi } from './api/incomeApi';
import { expenseApi } from './api/expenseApi';
import { dashboardApi } from './api/dashboardApi';
import { noteApi } from './api/notesApi';
import { reminderApi } from './api/remainderApi';
import { auditApi } from './api/auditApi';
import { reportApi } from './api/reportsApi';
const store = configureStore({
  reducer: {
   auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [incomeApi.reducerPath]: incomeApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [reminderApi.reducerPath]: reminderApi.reducer,
    [auditApi.reducerPath]: auditApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      incomeApi.middleware,
      expenseApi.middleware,
      dashboardApi.middleware,
      noteApi.middleware,
      reminderApi.middleware,
      auditApi.middleware,
      reportApi.middleware
    ),
})


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;