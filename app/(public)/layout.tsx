import { DemoBanner } from "@/components/DemoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyWa } from "@/components/StickyWa";
import { DEMO_MODE } from "@/lib/site";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {DEMO_MODE ? <DemoBanner /> : null}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <StickyWa />
    </>
  );
}
