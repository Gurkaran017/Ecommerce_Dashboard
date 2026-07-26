import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

const messageFrom = (error, fallback) =>
  error?.response?.data?.message || fallback;

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    users: [],
    totalUsers: 0,
    totalRevenueAllTime: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0,
    totalUsersCount: 0,
    monthlySales: [],
    orderStatusCounts: {},
    topSellingProducts: [],
    lowStockProducts: 0,
    revenueGrowth: "",
    newUsersThisMonth: 0,
    currentMonthSales: 0,
  },
  reducers: {
    getAllUsersRequest(state) {
      state.loading = true;
    },
    getAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload.users ?? [];
      state.totalUsers = action.payload.totalUsers ?? 0;
    },
    getAllUsersFailed(state) {
      state.loading = false;
    },
    deleteUserRequest(state) {
      state.loading = true;
    },
    deleteUserSuccess(state, action) {
      state.loading = false;
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.totalUsers = Math.max(0, state.totalUsers - 1);
      state.totalUsersCount = Math.max(0, state.totalUsersCount - 1);
    },
    deleteUserFailed(state) {
      state.loading = false;
    },
    getStatsRequest(state) {
      state.loading = true;
    },
    getStatsSuccess(state, action) {
      const payload = action.payload ?? {};
      state.loading = false;
      state.totalRevenueAllTime = payload.totalRevenueAllTime ?? 0;
      state.todayRevenue = payload.todayRevenue ?? 0;
      state.yesterdayRevenue = payload.yesterdayRevenue ?? 0;
      state.totalUsersCount = payload.totalUsersCount ?? 0;
      state.monthlySales = payload.monthlySales ?? [];
      state.orderStatusCounts = payload.orderStatusCounts ?? {};
      state.topSellingProducts = payload.topSellingProducts ?? [];
      state.lowStockProducts = payload.lowStockProducts?.length ?? 0;
      /* Arrives pre-formatted, e.g. "+12.4%". Default to empty, never undefined —
         the summary used to call .includes() straight on it. */
      state.revenueGrowth = payload.revenueGrowth ?? "";
      state.newUsersThisMonth = payload.newUsersThisMonth ?? 0;
      state.currentMonthSales = payload.currentMonthSales ?? 0;
    },
    getStatsFailed(state) {
      state.loading = false;
    },
  },
});

const actions = adminSlice.actions;

export const fetchAllUsers = (page) => async (dispatch) => {
  dispatch(actions.getAllUsersRequest());
  try {
    const res = await axiosInstance.get(`/admin/getallusers?page=${page || 1}`);
    dispatch(actions.getAllUsersSuccess(res.data));
  } catch {
    dispatch(actions.getAllUsersFailed());
  }
};

export const deleteUser = (id, page) => async (dispatch, getState) => {
  dispatch(actions.deleteUserRequest());
  try {
    const res = await axiosInstance.delete(`/admin/delete/${id}`);
    dispatch(actions.deleteUserSuccess(id));
    toast.success(res.data.message || "User deleted.");

    const { totalUsers } = getState().admin;
    const maxPage = Math.ceil(totalUsers / 10) || 1;
    dispatch(fetchAllUsers(Math.min(page, maxPage)));
  } catch (error) {
    dispatch(actions.deleteUserFailed());
    toast.error(messageFrom(error, "Could not delete the user."));
  }
};

export const getDashboardStats = () => async (dispatch) => {
  dispatch(actions.getStatsRequest());
  try {
    const res = await axiosInstance.get("/admin/fetch/dashboard-stats");
    dispatch(actions.getStatsSuccess(res.data));
  } catch {
    dispatch(actions.getStatsFailed());
  }
};

export default adminSlice.reducer;
