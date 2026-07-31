import OrdersTable from "@/components/admin/orders-table";
import { getBookings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const bookings = await getBookings(200);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-cocoa-900">
          Booking Requests
        </h1>
        <p className="text-sm text-cocoa-500">
          Every &ldquo;Book Now&rdquo; tap and custom cake quote lands here —
          even before the customer sends the WhatsApp message.
        </p>
      </header>
      <OrdersTable bookings={bookings} />
    </div>
  );
}
