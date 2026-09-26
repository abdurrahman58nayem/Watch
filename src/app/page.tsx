import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedWatches } from "@/components/home/FeaturedWatches";
import { PremiumCollection } from "@/components/home/PremiumCollection";
import { SocialProof } from "@/components/home/SocialProof";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <FeaturedWatches />
      <PremiumCollection />
      <SocialProof />
      <Newsletter />
    </div>
  );
}
