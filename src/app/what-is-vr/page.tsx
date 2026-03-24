import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "What is Virtual Reality? The Complete Guide to VR | VR.org",
  description:
    "What is Virtual Reality? Learn how VR works, the different types of VR headsets, what you can do in VR, and where the technology is heading. VR explained clearly.",
  openGraph: {
    title: "What is Virtual Reality? The Complete Guide to VR | VR.org",
    description:
      "Everything you need to know about Virtual Reality: how it works, types of headsets, use cases, and the future of VR.",
    url: "https://vr.org/what-is-vr",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://vr.org/what-is-vr",
  },
};

export default function WhatIsVRPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What is Virtual Reality? The Complete Guide to VR",
    description:
      "Everything you need to know about Virtual Reality: how it works, types of headsets, use cases, history, and the future of VR technology.",
    url: "https://vr.org/what-is-vr",
    datePublished: "2026-03-23",
    dateModified: "2026-03-23",
    author: {
      "@type": "Organization",
      name: "VR.org",
      url: "https://vr.org",
    },
    publisher: {
      "@type": "Organization",
      name: "VR.org",
      url: "https://vr.org",
      logo: "https://vr.org/logo.png",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://vr.org/what-is-vr",
    },
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://vr.org" },
    { name: "What is VR?", url: "https://vr.org/what-is-vr" },
  ]);

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-8"
          style={{ letterSpacing: "-0.5px" }}
        >
          What is Virtual Reality? The Complete Guide to VR
        </h1>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Virtual Reality (VR) is a technology that immerses you in a
          computer-generated, three-dimensional environment that you can explore
          and interact with as though you were physically inside it. By wearing a
          headset that covers your eyes and ears, VR replaces the real world
          around you with a simulated one. Whether that&apos;s the surface of
          Mars, the cockpit of a fighter jet, or a fantastical game world that
          couldn&apos;t exist in real life. It&apos;s one of the most
          transformative technologies of the 21st century, reshaping how we play,
          learn, work, and connect.
        </p>

        {/* ── Virtual Reality Defined ── */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          Virtual Reality Defined
        </h2>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          At its core, Virtual Reality is the creation of an immersive digital
          environment that tricks your senses into believing you are somewhere
          else. A VR system typically consists of a head-mounted display (HMD)
          with high-resolution screens positioned close to your eyes, lenses that
          focus and warp the image to create a convincing sense of depth and
          scale, motion-tracking sensors that follow the position and rotation of
          your head in real time, and spatial audio that adjusts dynamically
          based on where you&apos;re looking. The result is a feeling of
          &quot;presence,&quot; the psychological sensation that you truly
          occupy the virtual space. When VR is done well, your brain responds to
          the simulated environment much the way it would to the real one:
          heights feel vertigo-inducing, close objects feel reachable, and spaces
          feel expansive or claustrophobic depending on their design.
        </p>

        {/* ── How Does VR Work? ── */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          How Does VR Work?
        </h2>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          A VR headset works by presenting a slightly different image to each eye
          using the same principle behind stereoscopic 3D, while filling as much of
          your peripheral vision as possible. Modern headsets typically use LCD
          or micro-OLED panels running at 90 Hz or higher, because lower refresh
          rates can cause discomfort and motion sickness. Pancake lenses or
          fresnel lenses bend the light from these displays so that your eyes can
          focus on screens that are only centimeters away.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          <strong>Tracking</strong> is what makes VR interactive rather than just
          a passive viewing experience. Most modern headsets use inside-out
          tracking, where cameras mounted on the headset itself scan your
          environment and determine your position and orientation. This is
          called six degrees of freedom (6DoF), meaning the headset tracks
          movement along three positional axes (forward/back, left/right,
          up/down) and three rotational axes (pitch, yaw, roll). Older systems
          like the original HTC Vive used outside-in tracking with external base
          stations placed around the room.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          <strong>Controllers and hand tracking</strong> let you interact with
          the virtual world. Dedicated VR controllers use a combination of IMU
          sensors, infrared LEDs, or camera-based tracking to map your hand
          movements into the simulation. Many headsets now also support bare hand
          tracking via onboard cameras, allowing you to point, grab, and
          gesture without holding anything at all.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          <strong>Audio and haptics</strong> round out the immersion. Spatial
          audio engines position sounds in 3D space around you, so a voice to
          your left actually sounds like it&apos;s coming from your left.
          Haptic feedback in controllers provides vibrations and resistance that
          simulate touch, and emerging accessories like haptic vests and gloves
          are pushing tactile feedback even further.
        </p>

        {/* ── Types of VR ── */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          Types of VR
        </h2>

        <h3 className="font-display text-xl font-semibold mb-3">
          Standalone VR
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Standalone headsets are self-contained, all-in-one devices that
          don&apos;t require a PC, console, or phone to operate. The processor,
          battery, storage, display, and tracking hardware are all built into the
          headset itself. Meta&apos;s Quest line is the most prominent example.
          the Quest 3 and Quest 3S brought mixed reality capabilities and
          improved processing power to a sub-$500 price point, making VR more
          accessible than ever. Standalone headsets are the dominant form factor
          in 2026 and account for the vast majority of consumer VR usage thanks
          to their ease of setup and wireless freedom.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          PC VR (Tethered)
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          PC VR headsets connect to a gaming desktop or laptop and offload all
          rendering to the computer&apos;s GPU. This allows for significantly
          higher graphical fidelity than standalone headsets can achieve.
          Products like the Valve Index, Bigscreen Beyond, and Pimax Crystal
          cater to enthusiasts who want the sharpest visuals, widest field of
          view, and highest refresh rates. The trade-off is cost (you need both
          the headset and a capable gaming PC) and the tethered cable, though
          wireless adapters and streaming solutions like Virtual Desktop and
          Steam Link have largely solved the cable issue for many users.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">Console VR</h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Sony&apos;s PlayStation VR2 is the primary console VR platform,
          connecting to the PS5 to deliver high-quality VR gaming with features
          like eye tracking, adaptive triggers, and OLED displays. Console VR
          benefits from a curated library of polished games and the existing
          install base of the host console. While it hasn&apos;t matched the
          market penetration of standalone headsets, PSVR2 has produced some of
          the most critically acclaimed VR titles available.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">Mobile VR</h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Mobile VR was a category where you slid a smartphone into a headset shell like
          Google Cardboard or Samsung Gear VR. It was many people&apos;s first
          taste of Virtual Reality in the mid-2010s. The experience was limited
          to three degrees of freedom (head rotation only, no positional
          tracking) and relied on the phone&apos;s processing power. The
          category has been almost entirely supplanted by affordable standalone
          headsets, but it played an important historical role in introducing
          millions of people to the concept of VR.
        </p>

        {/* ── What Can You Do in VR? ── */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          What Can You Do in VR?
        </h2>

        <h3 className="font-display text-xl font-semibold mb-3">Gaming</h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Gaming remains the most popular VR use case. Titles like{" "}
          <em>Half-Life: Alyx</em>, <em>Beat Saber</em>,{" "}
          <em>Asgard&apos;s Wrath 2</em>, <em>Resident Evil 4 VR</em>, and{" "}
          <em>Batman: Arkham Shadow</em> have shown that VR gaming can deliver
          experiences impossible on a flat screen. The physicality of VR, using
          your actual hands to reload a weapon, swing a sword, or duck behind
          cover, creates a level of immersion that traditional gaming
          can&apos;t match. The VR gaming library has grown enormously, spanning
          shooters, puzzle games, RPGs, rhythm games, simulators, and horror.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">Social VR</h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Social platforms like VRChat, Rec Room, and Meta Horizon Worlds let
          users hang out, play mini-games, attend events, and explore
          user-created worlds as customizable avatars. VRChat in particular has
          cultivated a massive community of creators who build intricate worlds
          and avatars. Social VR is where many people spend the most time in
          their headsets. It&apos;s less about a specific app and more about
          the emergent social experiences that arise when people share a virtual
          space.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">Fitness</h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          VR fitness has become a legitimate workout category. Games like{" "}
          <em>Beat Saber</em>, <em>Supernatural</em>, <em>Les Mills Bodycombat</em>,
          and <em>FitXR</em> provide high-intensity cardio workouts disguised as
          fun. Because you&apos;re focused on slashing blocks or dodging
          obstacles, the exercise feels less like a chore. Many users report
          burning 400-600 calories per hour in active VR games, and the Quest
          platform includes built-in fitness tracking that logs calories and
          active minutes across all apps.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Education &amp; Training
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          VR is transforming how people learn and train across industries.
          Medical students practice surgical procedures in risk-free virtual
          operating rooms. Pilots train in VR flight simulators before ever
          entering a real cockpit. Retail and manufacturing workers practice
          scenarios through companies like Strivr and Transfr. Military
          organizations use VR for combat training and situational awareness
          exercises. The ability to learn by doing, rather than by reading or
          watching, makes VR uniquely effective for skill-based training, with
          studies consistently showing improved retention rates compared to
          traditional methods.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Entertainment
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Beyond gaming, VR offers immersive entertainment experiences including
          360-degree films, virtual concerts, live sports in VR, and virtual
          tourism. Apps like Bigscreen let you watch movies on a massive virtual
          cinema screen, while platforms host live events and performances that
          you can attend from your living room. Virtual tourism apps let you
          explore destinations like the International Space Station, ancient
          Rome, or the ocean floor from anywhere in the world.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Creative Tools
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          VR has opened up new creative workflows. Apps like{" "}
          <em>Gravity Sketch</em> let industrial designers and artists sculpt 3D
          models with their hands in an intuitive way that traditional CAD
          software can&apos;t replicate. <em>Open Brush</em> (the open-source
          continuation of Google&apos;s Tilt Brush) lets you paint in 3D space
          with light, fire, and other fantastical brush strokes.{" "}
          <em>Vermillion</em> simulates oil painting with realistic brush
          physics, and <em>ShapesXR</em> enables collaborative spatial design
          for UX/UI and architectural prototyping.
        </p>

        {/* ── VR vs. AR vs. MR vs. XR ── */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          VR vs. AR vs. MR vs. XR
        </h2>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          These terms are related but describe different points on the immersion
          spectrum:
        </p>

        <ul
          className="text-[15px] leading-[1.7] mb-4 list-disc pl-6 flex flex-col gap-1"
          style={{ color: "var(--text-secondary)" }}
        >
          <li>
            <strong>Virtual Reality (VR)</strong> fully replaces your view of the
            real world with a digital environment. You are entirely inside the
            simulation.
          </li>
          <li>
            <strong>Augmented Reality (AR)</strong> overlays digital content onto
            the real world. You still see your actual surroundings, with virtual
            objects layered on top, such as smartphone AR apps or smart glasses.
          </li>
          <li>
            <strong>Mixed Reality (MR)</strong> blends virtual and real elements
            so that digital objects can interact with your physical environment.
            A virtual ball can bounce off your real table. Many modern headsets
            like the Quest 3 support both VR and MR modes using passthrough
            cameras.
          </li>
          <li>
            <strong>Extended Reality (XR)</strong> is the umbrella term that
            encompasses VR, AR, and MR. It is essentially any technology that alters
            your perception of reality with computer-generated content.
          </li>
        </ul>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The lines between these categories are blurring as headsets
          increasingly support multiple modes. For a deeper look at the AR side,
          see our{" "}
          <a
            href="/ar"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Augmented Reality page
          </a>
          .
        </p>

        {/* ── A Brief History of VR ── */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          A Brief History of VR
        </h2>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The idea of Virtual Reality is older than most people realize. In 1962,
          filmmaker Morton Heilig built the Sensorama, a mechanical device that
          combined 3D film, stereo sound, vibrations, and even scent to create
          an immersive experience. In the 1980s, Jaron Lanier&apos;s company VPL
          Research coined the term &quot;Virtual Reality&quot; and built some of
          the first commercial VR headsets and data gloves. The early 1990s
          brought a wave of VR hype. Nintendo released the ill-fated Virtual
          Boy in 1995, and VR arcades appeared in shopping malls. But the
          technology simply wasn&apos;t ready for mainstream adoption.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The modern VR era began in 2012 when Palmer Luckey launched the Oculus
          Rift Kickstarter, demonstrating that smartphone-grade screens and
          sensors could deliver convincing VR at consumer-friendly prices.
          Facebook acquired Oculus in 2014 for $2 billion, signaling serious
          corporate investment. The first consumer VR headsets shipped in 2016:
          the Oculus Rift CV1, HTC Vive, and PlayStation VR, launching what many
          consider the true beginning of consumer VR.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The next leap came in 2019 with the original Oculus Quest, which proved
          that standalone, wireless VR was not only viable but preferable for
          most users. The Quest 2 (2020) became the best-selling VR headset of
          all time, selling over 20 million units. Apple entered the space in
          2024 with the Vision Pro, a high-end spatial computing headset that
          blurred the line between VR and AR. By 2026, the VR industry has
          matured significantly. Headsets are lighter, displays are sharper,
          content libraries are deep, and the technology has found footing in
          both consumer and enterprise markets.
        </p>

        {/* ── The Future of VR ── */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          The Future of VR
        </h2>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          VR technology is advancing rapidly across multiple fronts. Headsets are
          getting dramatically lighter and more comfortable. The era of bulky,
          front-heavy goggles is giving way to slim, glasses-like form factors
          enabled by micro-OLED displays and pancake optics. Display resolution
          is approaching the point where individual pixels are imperceptible,
          reducing the &quot;screen door effect&quot; that plagued early
          headsets.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Eye tracking and foveated rendering, where the headset only renders
          full detail where you&apos;re actually looking, are becoming standard
          features, enabling better visuals with less processing power. AI is
          being integrated into VR experiences for smarter NPCs, real-time
          environment generation, and more natural avatar interactions. Neural
          interface research from companies like Neuralink and CTRL-labs (now
          part of Meta) hints at a future where you could interact with VR
          using thought alone, though practical consumer applications remain
          years away.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Enterprise VR continues to grow as companies adopt virtual training,
          remote collaboration, and digital twin simulations. The convergence of
          VR and AR into unified &quot;spatial computing&quot; platforms
          suggests a future where a single headset seamlessly transitions
          between full immersion and augmented overlays on the real world. While
          VR won&apos;t replace flat screens for every task, it&apos;s
          establishing itself as a fundamental new computing platform alongside
          phones, tablets, and PCs.
        </p>

        {/* ── Frequently Asked Questions ── */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>

        <h3 className="font-display text-xl font-semibold mb-3">
          Is VR bad for your eyes?
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          There is no scientific evidence that VR causes permanent eye damage in
          adults. The lenses in a VR headset focus the image at a distance of
          about 1.5 to 2 meters, so your eyes aren&apos;t straining to focus on
          a close-up screen the way they might with a phone. However, extended
          sessions can cause temporary eye strain, dry eyes, or fatigue, the
          same symptoms associated with prolonged use of any screen. Taking
          regular breaks (every 30-60 minutes) is recommended. For children,
          most manufacturers suggest age 13+ due to ongoing visual development.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Do you need a powerful PC for VR?
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Not anymore. Standalone headsets like the Meta Quest 3 and Quest 3S
          work entirely on their own with no PC required. You just put the headset
          on and go. However, if you want to use a PC VR headset (like the Valve
          Index or Bigscreen Beyond) or stream PC VR games wirelessly to a
          standalone headset, you&apos;ll need a gaming PC with a modern GPU. A
          mid-range graphics card like an NVIDIA RTX 4060 or above is typically
          sufficient for a good PC VR experience.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Can kids use VR?
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Most VR headset manufacturers, including Meta, Sony, and Apple,
          recommend their devices for users aged 13 and older. This is partly due
          to concerns about developing vision in younger children and partly
          because of content moderation and online safety considerations in
          social VR platforms. Some educational VR programs are designed for
          supervised use by younger children, but extended unsupervised VR use
          is generally not recommended for kids under 13. Parents who do allow
          younger children to use VR should set strict time limits and supervise
          the experience.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Is VR only for gaming?
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Absolutely not. While gaming is the most visible VR use case, the
          technology is widely used for fitness, social interaction, education,
          professional training, creative work, therapy, virtual tourism,
          architectural visualization, and enterprise collaboration. Many VR
          users spend more time in social apps, fitness apps, and media
          consumption than in traditional games. The enterprise VR market is
          growing particularly fast as companies find measurable ROI in
          VR-based training and simulation.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          How much does VR cost?
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          VR is more affordable than ever. The Meta Quest 3S starts at around
          $300, making it one of the most accessible entry points for
          high-quality VR. The Quest 3 runs around $500. PC VR headsets range
          from $400 to $1,000+ for the headset alone, plus the cost of a capable
          gaming PC ($800-$1,500+). The PlayStation VR2 is available for around
          $550 and requires a PS5. At the high end, Apple Vision Pro starts at
          $3,499. For most people, a standalone Quest headset offers the best
          balance of price, quality, and content library.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Does VR cause motion sickness?
        </h3>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Some people experience motion sickness (often called
          &quot;cybersickness&quot;) in VR, particularly in experiences that
          involve artificial locomotion, where your virtual body moves but your
          real body stays still. However, many VR apps use comfort features like
          teleportation movement, vignettes during motion, and snap turning to
          minimize this. Most users find that they build tolerance over time with
          short, gradual sessions. Stationary and room-scale experiences, where
          you physically walk around, rarely cause discomfort because your real
          and virtual movements match.
        </p>

        {/* ── Related ── */}
        <hr
          className="my-12"
          style={{ borderColor: "var(--border-primary)", opacity: 0.3 }}
        />

        <h2 className="font-display text-2xl font-semibold mb-4">
          Explore More on VR.org
        </h2>
        <ul
          className="text-[15px] leading-[1.7] mb-8 list-disc pl-6 flex flex-col gap-1"
          style={{ color: "var(--text-secondary)" }}
        >
          <li>
            <a
              href="/hardware"
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              VR Hardware News
            </a>{" "}
            - The latest on headsets, controllers, and accessories
          </li>
          <li>
            <a
              href="/best-vr-headsets"
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              Best VR Headsets
            </a>{" "}
            - Our guide to the top headsets you can buy right now
          </li>
          <li>
            <a
              href="/"
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              VR.org Home
            </a>{" "}
            - Real-time VR, AR, and XR news from around the web
          </li>
        </ul>
      </main>

      <Footer />
    </>
  );
}
