import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Moon, Sun } from "lucide-react";
import avatarFallback from "../../assets/avatar.jpg";
import { useTheme } from "../../contexts/theme-context";
import { toggleNavbar } from "../../store/slices/extraSlice";
import { NAV_ITEMS } from "./nav-items";

const Topbar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);

  const current =
    NAV_ITEMS.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))
      ?.label ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-topbar items-center justify-between border-b border-line bg-bg px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(toggleNavbar())}
          aria-label="Open menu"
          className="-ml-2 grid h-9 w-9 place-items-center text-ink lg:hidden"
        >
          <Menu className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <nav aria-label="Breadcrumb" className="meta">
          Admin <span aria-hidden="true">/</span>{" "}
          <span className="text-ink">{current}</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="grid h-9 w-9 place-items-center text-ink transition-colors ease-editorial hover:text-muted"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Moon className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>

        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatar?.url || avatarFallback}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="hidden text-xs text-muted sm:inline">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
