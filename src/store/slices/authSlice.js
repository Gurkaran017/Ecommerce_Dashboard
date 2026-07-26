import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

/* Network failures have no `error.response`, so every handler reads it
   defensively — the previous version threw a TypeError inside its own catch. */
const messageFrom = (error, fallback) =>
  error?.response?.data?.message || fallback;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    /* Distinct from `loading`. The session check is in flight on first paint,
       and without this the app redirected to /login before it resolved —
       every refresh flashed the login screen. */
    isCheckingAuth: true,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFailed(state) {
      state.loading = false;
    },
    getUserRequest(state) {
      state.isCheckingAuth = true;
    },
    getUserSuccess(state, action) {
      state.isCheckingAuth = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.isCheckingAuth = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFailed(state) {
      state.loading = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
    },
    forgotPasswordSettled(state) {
      state.loading = false;
    },
    resetPasswordRequest(state) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    resetPasswordFailed(state) {
      state.loading = false;
    },
    updateProfileRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFailed(state) {
      state.loading = false;
    },
    updatePasswordRequest(state) {
      state.loading = true;
    },
    updatePasswordSettled(state) {
      state.loading = false;
    },
  },
});

const actions = authSlice.actions;

export const login = (data) => async (dispatch) => {
  dispatch(actions.loginRequest());
  try {
    const res = await axiosInstance.post("/auth/login", data);
    if (res.data.user?.role === "Admin") {
      dispatch(actions.loginSuccess(res.data.user));
      toast.success(res.data.message || "Signed in.");
    } else {
      dispatch(actions.loginFailed());
      toast.error("This account does not have admin access.");
    }
  } catch (error) {
    dispatch(actions.loginFailed());
    toast.error(messageFrom(error, "Sign in failed."));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(actions.getUserRequest());
  try {
    const res = await axiosInstance.get("/auth/me");
    dispatch(actions.getUserSuccess(res.data.user));
  } catch {
    dispatch(actions.getUserFailed());
  }
};

export const logout = () => async (dispatch) => {
  dispatch(actions.logoutRequest());
  try {
    const res = await axiosInstance.get("/auth/logout");
    dispatch(actions.logoutSuccess());
    toast.success(res.data.message || "Signed out.");
  } catch (error) {
    dispatch(actions.logoutFailed());
    toast.error(messageFrom(error, "Sign out failed."));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(actions.forgotPasswordRequest());
  try {
    /* The reset link must point back at wherever this app is actually served
       from, not a hardcoded dev port. */
    const res = await axiosInstance.post(
      `/auth/password/forgot?frontendUrl=${encodeURIComponent(
        window.location.origin
      )}`,
      email
    );
    toast.success(res.data.message || "Reset link sent.");
  } catch (error) {
    toast.error(messageFrom(error, "Could not send the reset link."));
  } finally {
    dispatch(actions.forgotPasswordSettled());
  }
};

export const resetPassword = (newData, token) => async (dispatch) => {
  dispatch(actions.resetPasswordRequest());
  try {
    const res = await axiosInstance.put(
      `/auth/password/reset/${token}`,
      newData
    );
    dispatch(actions.resetPasswordSuccess(res.data.user));
    toast.success(res.data.message || "Password updated.");
  } catch (error) {
    dispatch(actions.resetPasswordFailed());
    toast.error(messageFrom(error, "Could not reset the password."));
  }
};

export const updateAdminProfile = (data) => async (dispatch) => {
  dispatch(actions.updateProfileRequest());
  try {
    const res = await axiosInstance.put("/auth/profile/update", data);
    dispatch(actions.updateProfileSuccess(res.data.user));
    toast.success(res.data.message || "Profile updated.");
  } catch (error) {
    dispatch(actions.updateProfileFailed());
    toast.error(messageFrom(error, "Could not update the profile."));
  }
};

export const updateAdminPassword = (data) => async (dispatch) => {
  dispatch(actions.updatePasswordRequest());
  try {
    const res = await axiosInstance.put("/auth/password/update", data);
    toast.success(res.data.message || "Password updated.");
  } catch (error) {
    toast.error(messageFrom(error, "Could not update the password."));
  } finally {
    dispatch(actions.updatePasswordSettled());
  }
};

export default authSlice.reducer;
