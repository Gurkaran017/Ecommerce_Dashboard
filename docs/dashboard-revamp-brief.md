# ShopMate Admin — Dashboard Revamp Brief

Companion to the storefront brief. Same design system, dense dialect.

---

## Role

You are a senior product designer and frontend engineer redesigning and
rebuilding the **ShopMate admin dashboard**. It must read as the same product as
the storefront — same tokens, same fonts, same primitives — retuned for an
operator who is scanning rows and numbers, not browsing photography.

## The one rule that matters

**The backend is frozen.** Every screen must be buildable from the endpoints and
payloads listed in §2. No new API. If a design idea needs data that does not
exist, cut it.

---

## 1. Direction — the dashboard dialect

The storefront system is the parent. Inherit without argument:

- Colour tokens (`--bg`, `--surface`, `--plate`, `--ink`, `--muted`, `--line`,
  `--accent`, `--positive`, `--notice`, `--danger`) as space-separated RGB channels
- Instrument Serif for display, Inter for UI — self-hosted via `@fontsource`
- `border-radius: 0` (2px ceiling), hairline borders, no shadows except one
  portal elevation token
- 160ms `cubic-bezier(0.2, 0, 0, 1)` motion, opacity and transform only
- Uppercase 11px `letter-spacing: 0.08em` meta labels
- `prefers-reduced-motion` honoured globally
- Light and dark both finished

Then diverge where density demands it:

| | Storefront | Dashboard |
|---|---|---|
| Section rhythm | 96–128px | 40–56px |
| Body text | 14–16px | 13–14px |
| Display serif | Page titles and section heads | Page titles and **numbers only** |
| Page width | 1440px centred | Fluid, sidebar + fill |
| Dominant element | Photography | Tabular data |
| Table row height | n/a | 52px, hairline separated |

**Numbers are the hero.** Every figure — revenue, counts, prices, ratings — is
tabular-lining (`font-variant-numeric: tabular-nums`) so columns align. Large
KPI figures use the display serif; everything else uses Inter.

### Delete on sight

- `bg-dark-gradient`, `bg-red-gradient`, `bg-blue-gradient` — all three
- `rounded-xl` cards with `shadow-md`
- The Google Fonts `@import` in `index.css` (render-blocking)
- `* { overflow-x: hidden }` and `* { font-family }` — never style every element
- `#root { background: #f3f3f6 }` hardcoded hex
- Solid-blue and solid-red action buttons
- Emoji as data (`⭐ 4.7` in three separate tables)

---

## 2. Frozen API contract

Base `http://localhost:4000/api/v1`, cookie auth.

| Method | Endpoint | Payload |
|---|---|---|
| POST | `/auth/login` | FormData `email`, `password` |
| GET | `/auth/me` · `/auth/logout` | — |
| POST | `/auth/password/forgot?frontendUrl=<origin>` | FormData `email` |
| PUT | `/auth/password/reset/:token` | FormData `password`, `confirmPassword` |
| PUT | `/auth/profile/update` | FormData `name`, `email`, `avatar` |
| PUT | `/auth/password/update` | FormData `currentPassword`, `newPassword`, `confirmNewPassword` |
| GET | `/admin/fetch/dashboard-stats` | — |
| GET | `/admin/getallusers?page=` | — |
| DELETE | `/admin/delete/:id` | — |
| GET | `/product?page=` | — |
| POST | `/product/admin/create` | FormData `name`, `description`, `price`, `category`, `stock`, `images[]` |
| PUT | `/product/admin/update/:id` | same FormData |
| DELETE | `/product/admin/delete/:id` | — |
| GET | `/order/admin/getall` | — |
| PUT | `/order/admin/update/:id` | `{ status }` |
| DELETE | `/order/admin/delete/:id` | — |

### Payload shapes

```
user     { id, name, email, role, avatar{ url }, created_at }
product  { id, name, description, price, category, stock, ratings,
           created_at, images[{ url }] }
order    { id, order_status, total_price, created_at,
           shipping_info{ full_name, phone, address, city, state, pincode },
           order_items[{ order_item_id, product_id, title, image, quantity, price }] }

stats    { totalRevenueAllTime, todayRevenue, yesterdayRevenue, totalUsersCount,
           currentMonthSales, newUsersThisMonth, revenueGrowth: "+12.4%",
           lowStockProducts: [...], orderStatusCounts: { Processing: "2", ... },
           monthlySales: [{ month: "Jul 2026", totalsales }],
           topSellingProducts: [{ name, image, category, ratings, total_sold }] }
```

### Consequences you must design around

1. **`orderStatusCounts` values are strings.** Coerce with `Number()` before any
   arithmetic. This is the source of the live "Total orders placed: 02121" bug.
2. **`monthlySales[].totalsales` is lower-case `s`**, and `month` is formatted
   `"MMM yyyy"` — it must be matched against `getLastNMonths()` output exactly.
3. **`revenueGrowth` is a pre-formatted string**, not a number. Do not compute on it.
4. **Products and users paginate at 10.** Neither endpoint returns a page count —
   derive it from `totalProducts` / `totalUsers`.
5. **Orders have no pagination, no filter and no sort endpoint.** `getall` returns
   every order. Filtering and paging must be client-side, and must be labelled as
   such where it could mislead.
6. **There is no product search endpoint** on the admin listing.
7. **Currency is ₹ (INR).** No `$`, no `Rs`, no bare numbers.
8. **Only `role === "Admin"` may enter.** Non-admins are bounced to `/login`.

---

## 3. Architecture changes (approved, beyond restyling)

### Real routing

Retire `extraSlice.openedComponent` and the `switch` in `App.jsx`. Introduce:

```
/            → Overview
/orders      → Orders
/products    → Products
/users       → Users
/profile     → Profile
/login  /password/forgot  /password/reset/:token
```

All admin routes sit under one protected layout route. The sidebar becomes
`NavLink`s and drops its local `activeLink` index — the URL is the only source of
truth for what is active.

### Auth-checking state

`authSlice` needs a third state beyond `isAuthenticated` true/false. Today
`getUser()` is in flight while `isAuthenticated` is still `false`, so every
refresh flashes the login screen before landing. Add `isCheckingAuth` (start
`true`, cleared on both success and failure) and render a neutral shell — not a
redirect — while it is set.

### Destructive actions are uniform

Products and users currently delete on a single click. Every destructive action
goes through the same `ConfirmDialog`, naming the record being destroyed.

---

## 4. Screen-by-screen direction

### Shell

**Sidebar.** Fixed 240px, `--surface`, hairline right border, no floating rounded
card. Wordmark at top in letterspaced uppercase. Nav items are text with a small
icon, active state is ink text plus a left rule — no filled gradient pill.
Sign-out is a text link at the bottom, not a red gradient block. Below `lg` it
becomes a `Drawer` with focus trap and Esc.

**Topbar.** Hairline bottom border. Left: breadcrumb (`Admin / Orders`) in meta
type. Right: theme toggle and the admin's avatar with name. The current avatar is
a 56px circle floating with no alignment — bring it to 32px, aligned to the
breadcrumb baseline.

### Overview (`/`)

- **KPI row.** Four tiles, hairline separated, no cards: Today's revenue,
  All-time revenue, Total users, Low stock. Figure in display serif at ~40px,
  tabular. Label above in meta type. Delta below in `--positive` / `--danger`
  with a single arrow glyph — and worded **once**, not "…from yesterday than last
  period".
- **Revenue must render as ₹**, not `48.2K` with no unit. Keep the compact
  notation, prefix the symbol: `₹48.2K`.
- **Charts.** Three panels, hairline bordered, no shadows. Restyle Recharts onto
  the tokens: grid lines `--line`, axes and ticks `--muted` at 11px, series in
  ink with the accent for emphasis. Custom tooltip matching the app — bordered,
  square, `--surface`. Every chart needs a title, a one-line description, and an
  empty state for when the series is all zeroes.
  - *Monthly sales* — line, 4 months.
  - *Order status* — the pie is the weakest chart here; a horizontal stacked bar
    or a labelled breakdown list reads faster at this data size. Keep the four
    status colours semantic (`--notice`, ink, `--positive`, `--danger`).
  - *Top products* — horizontal bars. The Y axis currently renders **product
    images as tick labels**, which is unreadable and collides when two products
    share an image. Use product names, truncated, with the image in the tooltip.
- **Summary list.** Six metrics as a hairline-separated definition list, not
  icon-and-two-lines rows. Drop the coloured icons.
- **Top products table.** Uses the shared table primitive.

### Products (`/products`)

- Page header reads **Products** — it currently says "All Users".
- Shared data table: image (40px on a `--plate` tile), name, category, price (₹,
  tabular, right-aligned), stock with the three-state label from the storefront,
  rating as `4.7` numeric, actions.
- Row click opens View. Make the row keyboard-operable — a real `<button>` in the
  first cell, or `tabIndex` with Enter/Space handling. A bare `<tr onClick>` is
  unreachable without a mouse.
- Actions are text links (`Edit`, `Delete`), not filled gradient buttons. Delete
  goes through `ConfirmDialog`.
- The floating circular `+` becomes a **New product** button in the page header.
- Pagination shows `Page 2 of 4` and a total count, not a bare `Page 2`.
- Loading is a skeleton table, not a white spinner that is invisible on white.

### Users (`/users`)

Same table primitive. Avatar, name, email, registered date, delete. Confirmation
required. Empty and loading states designed.

### Orders (`/orders`)

The biggest structural change. Today every order is a full-width card listing
shipping info and items — six orders run several screens deep, and there is no
pagination because the endpoint returns all of them.

- Render orders as **table rows**: order id, date, customer, items count, total,
  status. One row per order.
- Expanding a row reveals shipping info and line items in place. Only one row
  expanded at a time.
- Status is an inline `<select>` styled to the system, changing it fires
  `updateOrderStatus` and shows a pending state on that row alone.
- Status filter as text links with a rule under the active one, matching the
  storefront's Orders page. Include counts per status.
- **Paginate client-side at 25** and state plainly that filtering and paging are
  client-side because the endpoint returns the full set.
- Delete keeps its confirmation, restyled.

### Profile (`/profile`)

Identity block, then two clearly separated sections (Profile, Password) with
labels above inputs and hairline underlines. Fix the avatar shadowing bug and
stop sending the string `"null"` when no file was chosen.

### Auth pages

Login, Forgot, Reset share one centred layout: `--bg` canvas, no purple-to-blue
gradient, a bordered panel max-width 400px, display-serif heading, labelled
fields, one ink CTA. The **"Remember me" checkbox does nothing — remove it.**

---

## 5. Bugs to fix during the rebuild

| File:line | Bug |
|---|---|
| `MiniSummary.jsx:23` | `orderStatusCounts` values are strings — `reduce((a,c) => a+c)` concatenates. "Total orders placed: 02121". Coerce to `Number`. |
| `MiniSummary.jsx:35` | Typo: "TOtal orders placed". |
| `Orders.jsx:22,32` | `selectedStatus` starts as `{}` but is set to a bare string, then read as `selectedStatus[order.id]`. |
| `Orders.jsx:46` | Early `if (loading) return` makes the later `loading ?` branch dead code. |
| `Orders.jsx:69` | Status filter `<select>` has no `value` — uncontrolled. |
| `Orders.jsx:98,172` | `$` on INR amounts. |
| `Profile.jsx:16` | `const [avatar]` shadows the imported avatar asset, so the fallback resolves to `null`. |
| `Profile.jsx:44` | Appends the string `"null"` as the avatar when no file was chosen. |
| `Profile.jsx:79` | `user.name` unguarded. |
| `ViewProductModal.jsx:17` | `selectedProduct.title` — the field is `name`. |
| `ViewProductModal.jsx:44` | `price.toLocaleString()` throws when price is a string. Also "Rs" not ₹. |
| `Products.jsx:54` | Heading reads "All Users" on the Products page. |
| `Products.jsx:68`, `Users.jsx:56` | Spinner is `border-white` on white — invisible. |
| `Stats.jsx:38` | Doubled suffix: "+12% from yesterday than last period". Deps `[yesterdayRevenue]` go stale. |
| `Stats.jsx:36` | `yesterdayRevenue === 0` hardcodes +100% even when today is also 0. |
| `authSlice.js:110,135,152,168,181,194` | `error.response.data.message` with no optional chaining. |
| `authSlice.js:115` | `getUser` dispatches `loginRequest`. |
| `authSlice.js:90` | `resetAuthSlice` assigns state to itself. |
| `authSlice.js:144` | `frontendUrl` hardcoded to `localhost:5174` — use `window.location.origin`. |
| `authSlice.js:2` | Unused `axios` import. |
| `lib/axios.js:4` | Base URL hardcoded with no environment switch. |
| `SideBar.jsx:19` | Local `activeLink` duplicates `openedComponent`; two items appear active mid-switch. Removed by routing. |
| `SideBar.jsx:1-16` | Unused imports: `Bell`, `Menu`, `useEffect`, `useNavigate`, `Navigate`. |
| `Login.jsx:71` | "Remember me" does nothing. |
| `CreateProductModal.jsx` | No `required` on name/price/stock, no validation, submit not disabled while loading. |
| All modals | No focus trap, no Esc, no scroll lock, no click-outside. |
| All tables | `<tr onClick>` is not keyboard reachable; no `scope` on headers. |

---

## 6. Engineering standards

Identical to the storefront brief. React 19, Vite, Tailwind 3, RTK, react-router 7.
No new dependency beyond `@fontsource`. Recharts stays. Tokens defined once in
`index.css`, exposed through `tailwind.config.js`, **zero hardcoded hex in
component files** — including chart series colours, which read from CSS custom
properties at runtime.

Shared primitives, ported from the storefront and extended:
`Button`, `Field`, `Modal`, `Drawer`, `Skeleton`, `EmptyState`, `Spinner`,
plus dashboard additions: `DataTable`, `StatTile`, `ConfirmDialog`, `StatusDot`,
`Pagination`, `PageHeader`, `ChartPanel`.

Accessibility is not optional: visible `:focus-visible`, labelled controls,
focus-trapped portals, `aria-live` on row-level updates, keyboard-operable rows,
WCAG AA contrast in both themes.

---

## 7. Order of work

1. Tokens and Tailwind theme
2. Primitives
3. Routing and shell (sidebar, topbar, protected layout, auth-checking state)
4. Overview and charts
5. Products, Users, Orders
6. Profile, auth pages, product modals
7. Bug sweep (§5)
8. Accessibility and responsive pass at 375 / 768 / 1440

Run the app after each step and confirm the screen renders in both themes.

---

## 8. Acceptance criteria

- [ ] `grep -rE "gradient|rounded-xl|shadow-md" src/` returns nothing
- [ ] No hardcoded hex in any component file, chart colours included
- [ ] No `$` or `Rs` anywhere; every figure renders ₹ and is tabular
- [ ] `/orders`, `/products`, `/users`, `/profile` are real, refreshable, linkable URLs
- [ ] A refresh on any admin route does not flash the login screen
- [ ] Every delete is behind a confirmation naming the record
- [ ] Every table row is reachable and operable by keyboard
- [ ] Every portal traps focus, closes on Esc, locks body scroll
- [ ] Loading states are visible against the background they sit on
- [ ] Both themes complete and passing WCAG AA
- [ ] Every bug in §5 fixed
- [ ] No API call outside §2
- [ ] `npm run build` succeeds and `npm run lint` is clean

## 9. Out of scope

Backend changes. Server-side sort, search, filter or order pagination. Bulk
actions. Role management. Any endpoint not listed in §2.
