import {
  LayoutDashboard,
  ListOrdered,
  Package,
  User,
  Users,
} from "lucide-react";

/** Single definition of the admin sections, shared by the nav and the breadcrumb. */
export const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Orders", icon: ListOrdered },
  { to: "/products", label: "Products", icon: Package },
  { to: "/users", label: "Users", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];
