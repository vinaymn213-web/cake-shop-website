import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** Everything the shop sells: tiramisu tubs, cakes, brownies, custom orders. */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // tiramisu | cakes | brownies | healthy | custom
  shortDesc: text("short_desc").notNull().default(""),
  description: text("description").notNull().default(""),
  price: integer("price").notNull().default(0),
  oldPrice: integer("old_price"),
  unit: text("unit").notNull().default("250 ml box"),
  image: text("image").notNull().default(""),
  tags: text("tags").notNull().default(""), // comma separated
  priceOnRequest: boolean("price_on_request").notNull().default(false),
  isBestseller: boolean("is_bestseller").notNull().default(false),
  isEggless: boolean("is_eggless").notNull().default(true),
  isAvailable: boolean("is_available").notNull().default(true),
  rating: real("rating").notNull().default(4.9),
  reviews: integer("reviews").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Every "Book on WhatsApp" click + every custom cake quote lands here. */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  productName: text("product_name").notNull(),
  productImage: text("product_image").notNull().default(""),
  category: text("category").notNull().default("tiramisu"),
  quantity: integer("quantity").notNull().default(1),
  amount: integer("amount").notNull().default(0),
  customerName: text("customer_name").notNull().default(""),
  customerPhone: text("customer_phone").notNull().default(""),
  occasion: text("occasion").notNull().default(""),
  servings: text("servings").notNull().default(""),
  flavor: text("flavor").notNull().default(""),
  theme: text("theme").notNull().default(""),
  eventDate: text("event_date").notNull().default(""),
  notes: text("notes").notNull().default(""),
  type: text("type").notNull().default("quick"), // quick | custom | bulk
  status: text("status").notNull().default("new"), // new | confirmed | completed | cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Single-row store config so the owner can change the WhatsApp number herself. */
export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  shopName: text("shop_name").notNull().default("Cake Delight"),
  tagline: text("tagline").notNull().default("Freshly Made with Love"),
  whatsappNumber: text("whatsapp_number").notNull().default("918660345846"),
  instagram: text("instagram").notNull().default("vani_heavenly_cakes"),
  city: text("city").notNull().default("Davanagere, Karnataka"),
  pickupNote: text("pickup_note")
    .notNull()
    .default("Pickup only. Fresh desserts are prepared after order confirmation."),
  announcement: text("announcement")
    .notNull()
    .default("100% Eggless Tiramisu & Premium Desserts • Freshly made after every order • Davanagere"),
  advanceDays: integer("advance_days").notNull().default(3),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Settings = typeof settings.$inferSelect;
