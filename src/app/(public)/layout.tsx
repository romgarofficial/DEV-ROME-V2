import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PublicChrome } from "@/components/site/public-chrome";
import { SiteFooter } from "@/components/site/footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { ScrollDirProvider } from "@/lib/motion";
import { navSections } from "@/lib/nav";
import { getPortfolio } from "@/lib/portfolio";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const data = await getPortfolio();

  return (
    <div className="public-root">
      <ScrollDirProvider>
        <PublicChrome profile={data.profile} sections={navSections(data)} />
        <SmoothScroll>
          <div className="relative z-10">
            {children}
            <SiteFooter profile={data.profile} />
          </div>
        </SmoothScroll>
      </ScrollDirProvider>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  const title = data.profile?.seoTitle || data.profile?.name || "Portfolio";
  const description =
    data.profile?.seoDescription || data.profile?.headline || "Professional developer portfolio.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}
