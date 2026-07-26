import axios from "axios";

/* Was hardcoded to localhost with no environment switch, so a production build
   pointed at the developer's machine. */
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "/api/v1",
  withCredentials: true,
});
