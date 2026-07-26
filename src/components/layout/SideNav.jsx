import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { cn } from "../../lib/cn";
import { logout } from "../../store/slices/authSlice";
import { NAV_ITEMS } from "./nav-items";

/* No local `activeLink` index any more — NavLink reads the URL, so the sidebar
   cannot disagree with what is on screen. */
const SideNav = ({ onNavigate }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="hidden h-topbar items-center border-b border-line px-5 lg:flex">
          <span className="text-[0.8125rem] font-medium uppercase tracking-[0.2em]">
            ShopMate
          </span>
        </div>

        <nav aria-label="Sections" className="p-3">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 border-l px-4 py-2.5 text-[0.8125rem] transition-colors ease-editorial",
                      isActive
                        ? "border-ink text-ink"
                        : "border-transparent text-muted hover:text-ink"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line p-5">
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="inline-flex items-center gap-2 text-xs text-muted transition-colors ease-editorial hover:text-danger"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default SideNav;
