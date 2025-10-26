import { HeroSection } from "@/components/mvp/hero-section"
import { MissionSection } from "@/components/mvp/mission-section"
import { ArchitectureSection } from "@/components/mvp/architecture-section"
import { FeaturesSection } from "@/components/mvp/features-section"
import { RoadmapSection } from "@/components/mvp/roadmap-section"
// import { TeamSection } from "@/components/mvp/team-section"
import { CTASection } from "@/components/mvp/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-veritas-dark" role="main" aria-label="Landing page">
      <HeroSection />
      <MissionSection />
      <ArchitectureSection />
      <FeaturesSection />
      <RoadmapSection />
      {/* <TeamSection /> */}
      <CTASection />
    </main>
  )
}
