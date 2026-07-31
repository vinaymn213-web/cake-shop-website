import SettingsForm from "@/components/admin/settings-form";
import { getShopConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const config = await getShopConfig();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-cocoa-900">
          Shop Settings
        </h1>
        <p className="text-sm text-cocoa-500">
          Change the WhatsApp number, tagline, pickup note and announcement bar
          — the whole website updates instantly.
        </p>
      </header>
      <SettingsForm config={config} />
    </div>
  );
}
