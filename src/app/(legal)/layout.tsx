import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalSubnav } from "@/components/content/LegalSubnav";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <LegalSubnav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
