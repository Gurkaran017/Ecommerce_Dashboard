import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Drawer from "../ui/Drawer";
import SideNav from "./SideNav";
import Topbar from "./Topbar";
import { closeNavbar } from "../../store/slices/extraSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isCheckingAuth, user } = useSelector(
    (state) => state.auth
  );
  const { isNavbarOpened } = useSelector((state) => state.extra);

  /* Hold the shell while /auth/me is in flight. Redirecting here is what made
     every refresh flash the login screen. */
  if (isCheckingAuth) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="meta">Checking session</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen lg:pl-sidebar">
      <aside className="fixed inset-y-0 left-0 hidden w-sidebar border-r border-line bg-surface lg:block">
        <SideNav />
      </aside>

      <Drawer
        open={isNavbarOpened}
        onClose={() => dispatch(closeNavbar())}
        title="Menu"
      >
        <SideNav onNavigate={() => dispatch(closeNavbar())} />
      </Drawer>

      <Topbar />

      <main className="shell py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
