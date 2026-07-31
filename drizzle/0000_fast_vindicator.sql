CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"product_name" text NOT NULL,
	"product_image" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'tiramisu' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"customer_name" text DEFAULT '' NOT NULL,
	"customer_phone" text DEFAULT '' NOT NULL,
	"occasion" text DEFAULT '' NOT NULL,
	"servings" text DEFAULT '' NOT NULL,
	"flavor" text DEFAULT '' NOT NULL,
	"theme" text DEFAULT '' NOT NULL,
	"event_date" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"type" text DEFAULT 'quick' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"short_desc" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"old_price" integer,
	"unit" text DEFAULT '250 ml box' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"tags" text DEFAULT '' NOT NULL,
	"price_on_request" boolean DEFAULT false NOT NULL,
	"is_bestseller" boolean DEFAULT false NOT NULL,
	"is_eggless" boolean DEFAULT true NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"rating" real DEFAULT 4.9 NOT NULL,
	"reviews" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"shop_name" text DEFAULT 'Vani''s Heavenly Cakes' NOT NULL,
	"tagline" text DEFAULT 'Freshly Made with Love' NOT NULL,
	"whatsapp_number" text DEFAULT '918660345846' NOT NULL,
	"instagram" text DEFAULT 'vani_heavenly_cakes' NOT NULL,
	"city" text DEFAULT 'Davanagere, Karnataka' NOT NULL,
	"pickup_note" text DEFAULT 'Pickup only. Fresh desserts are prepared after order confirmation.' NOT NULL,
	"announcement" text DEFAULT '100% Eggless Tiramisu & Premium Desserts • Freshly made after every order • Davanagere' NOT NULL,
	"advance_days" integer DEFAULT 3 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
