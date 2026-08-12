# 🍰  Cake Delight— Website + Owner Dashboard

A complete cake-shop website (IGP-style browsing experience) where **Book Now opens WhatsApp
directly** with the cake photo, name, size, quantity and price already typed out — plus a
private dashboard for the owner.

---

## 1. Technologies used (and why)

| Layer | Technology | Why it is needed |
|---|---|---|
| Frontend | **Next.js 16 (App Router) + React 19 + TypeScript** | Pages, SEO metadata, fast image-heavy product grids |
| Styling | **Tailwind CSS v4** | Bakery theme (cocoa / gold / cream) without writing CSS files |
| Backend | **Next.js Route Handlers (`/src/app/api/**`)** | No separate Express server needed — same project, same deploy |
| Database | **PostgreSQL + Drizzle ORM** | Stores the menu, every booking request and the shop settings |
| Ordering | **WhatsApp Click-to-Chat (`https://wa.me/<number>?text=...`)** | Free, no WhatsApp Business API approval, works on mobile + desktop |
| Auth | Hashed-password cookie session | Protects `/admin` |
| Hosting | Vercel / any Node host + Neon/Supabase Postgres | Cheapest production setup |

**Do you need a database?** Strictly, a WhatsApp-only shop can be pure frontend — but then you
cannot change prices without a developer and you never see how many people tried to book.
With Postgres you get: editable menu, sold-out toggles, booking analytics, and settings
(WhatsApp number, announcement) editable from the dashboard. That is why this build uses
frontend + backend + database.

---

## 2. How the "Book Now → WhatsApp" flow works

1. Customer taps **Book Now** on any cake card (`src/components/book-now-button.tsx`).
2. The browser builds a message with `buildBookingMessage()` (`src/lib/shop.ts`):
   item name, size, quantity, price × quantity = total, photo URL, product link, pickup city.
3. `https://wa.me/918660345846?text=<encoded message>` opens the owner's WhatsApp chat.
4. In parallel a `POST /api/bookings` records the attempt so it shows in the dashboard —
   even if the customer never presses send.

---

## 3. Project structure

```
src/
├─ app/
│  ├─ page.tsx                  # Home (hero, bestsellers, story, bulk orders, custom CTA)
│  ├─ menu/page.tsx             # Full menu with category chips, search, sort, eggless filter
│  ├─ cakes/[slug]/page.tsx     # Product detail + quantity/date/notes booking panel
│  ├─ custom-cake/page.tsx      # Price-quote form (occasion, servings, flavour, theme, date)
│  ├─ about, contact            # Our story, why choose us, pickup info, FAQ
│  ├─ admin/login               # Password login
│  ├─ admin/(dash)/…            # Dashboard, bookings, menu items, shop settings
│  └─ api/…                     # products, bookings, settings, admin login, health
├─ components/                  # header, footer, cards, WhatsApp button, admin widgets
├─ db/                          # Drizzle schema + seeded menu data
└─ lib/                         # shop helpers (WhatsApp messages), data access, auth
```

---

## 4. Running it

```bash
npm install
npx drizzle-kit push      # create tables
npm run dev               # http://localhost:3000
```

The menu seeds itself on first run (12 items from the handwritten menu).

**Dashboard:** `/admin` → password `vani123` (override with `ADMIN_PASSWORD` in `.env`).

---

## 5. Everyday tasks for the owner

* **Change a price** → Dashboard → Menu Items → tap the price → type → ✓
* **Sold out today** → tap the green *Available* pill (turns red, hides the Book button state)
* **New flavour** → Menu Items → *+ Add new item*
* **Change WhatsApp number** → Shop Settings (updates every button on the site)
* **See enquiries** → Bookings (filter New / Confirmed / Completed / Cancelled, reply on WhatsApp)
