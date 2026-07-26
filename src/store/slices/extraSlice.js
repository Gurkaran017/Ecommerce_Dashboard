import { createSlice } from "@reduxjs/toolkit";

/* `openedComponent` is gone: the router owns which section is showing, so the
   URL is now the single source of truth for navigation. What remains here is
   genuinely ephemeral UI state. */
const extraSlice = createSlice({
  name: "extra",
  initialState: {
    isNavbarOpened: false,
    isViewProductModalOpened: false,
    isCreateProductModalOpened: false,
    isUpdateProductModalOpened: false,
  },
  reducers: {
    toggleNavbar(state) {
      state.isNavbarOpened = !state.isNavbarOpened;
    },
    closeNavbar(state) {
      state.isNavbarOpened = false;
    },
    toggleCreateProductModal(state) {
      state.isCreateProductModalOpened = !state.isCreateProductModalOpened;
    },
    toggleViewProductModal(state) {
      state.isViewProductModalOpened = !state.isViewProductModalOpened;
    },
    toggleUpdateProductModal(state) {
      state.isUpdateProductModalOpened = !state.isUpdateProductModalOpened;
    },
  },
});

export const {
  toggleNavbar,
  closeNavbar,
  toggleCreateProductModal,
  toggleViewProductModal,
  toggleUpdateProductModal,
} = extraSlice.actions;

export default extraSlice.reducer;
