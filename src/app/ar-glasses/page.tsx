import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
  productItemListSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AdZone } from "@/components/AdZone";
import { AD_SLOTS } from "@/lib/ads";

export const metadata: Metadata = {
  title:
    "Best AR Glasses 2026: Smart Glasses Comparison & Buyer's Guide | VR.org",
  description:
    "Best AR glasses 2026: Ray-Ban Meta ($379) for camera and audio, Rokid ($499) for a display, Xreal One Pro ($599) for a big screen. Every smart glasses pick compared.",
  openGraph: {
    title:
      "Best AR Glasses 2026: Smart Glasses Comparison & Buyer's Guide | VR.org",
    description:
      "The best AR glasses and smart glasses of 2026 compared. Which AR smart glasses are worth buying today.",
    url: "https://vr.org/ar-glasses",
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
    title: "Best AR Glasses 2026 | VR.org",
    description:
      "Ray-Ban Meta, Rokid, Xreal, Viture, Android XR glasses compared.",
  },
  alternates: {
    canonical: "https://vr.org/ar-glasses",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best AR Glasses 2026: Smart Glasses Comparison & Buyer's Guide",
  datePublished: "2026-04-20",
  dateModified: "2026-06-01",
  author: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
  },
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
    logo: {
      "@type": "ImageObject",
      url: "https://vr.org/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://vr.org/ar-glasses",
  },
  image: "https://vr.org/og-image.png",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "AR", url: "https://vr.org/ar" },
  { name: "Best AR Glasses", url: "https://vr.org/ar-glasses" },
]);

const glassesList = productItemListSchema("Best AR Glasses 2026", [
  {
    name: "Ray-Ban Meta (Gen 2)",
    brand: "Meta",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Ray-Ban_Stories.jpg",
    description:
      "The best mainstream smart glasses, camera and audio built into Ray-Ban frames with Meta AI and no visible display.",
    url: "https://vr.org/ar-glasses#ray-ban-meta",
    offers: [
      { price: 379, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://www.meta.com/smart-glasses/" },
    ],
  },
  {
    name: "Rokid Glasses",
    brand: "Rokid",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/COP30_-_Rokid_01.jpg/1280px-COP30_-_Rokid_01.jpg",
    description:
      "The best display smart glasses, 49 grams with a micro-LED monocular display and native Google Gemini.",
    url: "https://vr.org/ar-glasses#rokid-glasses",
    offers: [
      { price: 499, priceCurrency: "USD", availability: "https://schema.org/InStock" },
    ],
  },
  {
    name: "Xreal One Pro",
    brand: "Xreal",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Tokyo-Game-Show-2024-Day4---2024-09-29_252.jpg/1280px-Tokyo-Game-Show-2024-Day4---2024-09-29_252.jpg",
    description:
      "The best AR glasses for media and gaming, a tethered 1080p micro-OLED display with a 57 degree field of view.",
    url: "https://vr.org/ar-glasses#xreal-one-pro",
    offers: [
      { price: 599, priceCurrency: "USD", availability: "https://schema.org/InStock" },
    ],
  },
  {
    name: "Viture Pro",
    brand: "Viture",
    description:
      "Best for prescription wearers and portability, 1080p micro-OLED glasses with built-in myopia adjustment.",
    url: "https://vr.org/ar-glasses#viture-pro",
    offers: [
      { price: 499, priceCurrency: "USD", availability: "https://schema.org/InStock" },
    ],
  },
  {
    name: "Apple Vision Pro",
    brand: "Apple",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Apple_Vision_Pro_with_Solo_Knit_Band.jpg",
    description:
      "The benchmark for passthrough mixed reality, dual 4K micro-OLED displays running visionOS. Not glasses form factor.",
    url: "https://vr.org/ar-glasses#apple-vision-pro",
    offers: [
      { price: 3699, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://www.apple.com/apple-vision-pro/" },
    ],
  },
  {
    name: "Meta Orion",
    brand: "Meta",
    description:
      "A developer preview of true holographic AR, 70 degree field of view with a wireless compute puck and neural wristband. Not for sale.",
    url: "https://vr.org/ar-glasses#meta-orion",
  },
  {
    name: "Google Android XR Glasses",
    brand: "Google",
    description:
      "The Android platform for smart glasses, with first audio-and-camera models from Gentle Monster and Warby Parker due fall 2026.",
    url: "https://vr.org/ar-glasses#android-xr-glasses",
  },
]);

const glassesFaq = faqPageSchema([
  {
    question: "What are the best AR glasses in 2026?",
    answer:
      "The Ray-Ban Meta (Gen 2) is the best mainstream smart glasses you can buy off the shelf in 2026 if you do not need a display. For a visible display in a fashion frame, the Meta Ray-Ban Display ($799) and the Rokid Glasses lead the category. Xreal One Pro and the Viture line are the top picks for a large virtual screen tethered to a phone or console. Apple Vision Pro remains the most powerful mixed-reality device but is not strictly glasses-form-factor.",
  },
  {
    question: "What is the difference between AR glasses and VR headsets?",
    answer:
      "VR headsets fully replace your view of the real world with a digital environment. AR glasses overlay digital content on top of what you actually see, so you remain aware of your physical surroundings. AR glasses are usually lighter, often lack controllers, and prioritize all-day wearability over immersion.",
  },
  {
    question: "Do AR glasses work with iPhone?",
    answer:
      "Yes. Ray-Ban Meta, Xreal, Viture, and most consumer AR glasses work with iPhone via Bluetooth or USB-C tethering. Apple has not yet launched its own AR glasses product, but third-party glasses that pair with iPhone are widely available.",
  },
  {
    question: "What are smart glasses vs AR glasses?",
    answer:
      "Smart glasses is the broader category. It includes both simple audio-and-camera models like Ray-Ban Meta and glasses with visible displays like Rokid, Xreal, and Viture. AR glasses specifically refers to smart glasses that overlay digital visuals on top of the real world. Not all smart glasses are AR glasses.",
  },
  {
    question: "When are Google's Android XR glasses coming out?",
    answer:
      "Google and Samsung revealed their joint Android XR smart glasses at Google I/O in May 2026. The first-generation glasses are audio-only (no display) and are confirmed for a fall 2026 launch in styles from Gentle Monster and Warby Parker. Xreal's Project Aura, the first Android XR display glasses, is also due before the end of 2026, with display-only Samsung models expected in 2027.",
  },
  {
    question: "How much do AR glasses cost?",
    answer:
      "AR glasses prices in 2026 range from about $269 (RayNeo Air) and $379 (Ray-Ban Meta) up through $499 to $599 (Rokid Glasses, Xreal One Pro, Viture) and $799 (Meta Ray-Ban Display), to $2,500 (Snap Specs) and $3,699 (Apple Vision Pro). Most mainstream smart glasses sit in the $300 to $600 range. Developer-grade prototypes like Meta Orion are not priced for consumers yet.",
  },
]);

export default function ARGlassesPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={glassesList} />
      <StructuredData data={glassesFaq} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          Best AR Glasses 2026
        </h1>
        <p
          className="text-sm mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Last updated: June 2026
        </p>

        <p
          className="text-[13px] mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          Part of our{" "}
          <a
            href="/best-of"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Best Of 2026
          </a>{" "}
          guide collection.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The AR glasses market in 2026 is in a genuinely interesting place.
          Ray-Ban Meta has proven that millions of people will wear a camera
          and a microphone on their face if you hide the tech inside a pair
          of Wayfarers. Rokid's 49-gram display glasses just hit number one
          globally in the display-AI category. Xreal and Viture are selling
          enough units to prove there is real demand for a virtual screen you
          can clip to your phone. And Google, Samsung, and Meta are all about
          to fire the serious shots with Android XR and Orion. This guide
          breaks down which AR smart glasses are actually worth your money
          right now, plus what is coming next.
        </p>

        {/* Direct-sold buyer-guide banner. Dormant until activated in data/ad-placements.json. */}
        <AdZone slot="buyer-guide-banner" variant="banner" />

        <h2 className="font-display text-2xl font-semibold mb-4">
          Which AR glasses should you buy?
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          If you want mainstream, socially-acceptable smart glasses right now,
          get the{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            Ray-Ban Meta (Gen 2)
          </strong>
          . For smart glasses with a visible display that still look like
          normal glasses, the{" "}
          <strong style={{ color: "var(--text-primary)" }}>Rokid Glasses</strong>{" "}
          are the current global category leader at 49 grams. If you want the
          largest virtual screen possible for movies, gaming, or coding on the
          go, the <strong style={{ color: "var(--text-primary)" }}>Xreal One Pro</strong>{" "}
          or <strong style={{ color: "var(--text-primary)" }}>Viture Pro</strong>{" "}
          are the picks. For the most capable mixed reality experience money
          can buy, the{" "}
          <strong style={{ color: "var(--text-primary)" }}>Apple Vision Pro</strong>{" "}
          is still in a class of its own.
        </p>

        {/* Ad: after quick recommendation, before product reviews */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="auto" />
        </div>

        {/* Ray-Ban Meta */}
        <h2 id="ray-ban-meta" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          Ray-Ban Meta (Gen 2): Best mainstream smart glasses
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Ray-Ban_Stories.jpg"
            alt="Ray-Ban Meta smart glasses by EssilorLuxottica"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Made by Meta and EssilorLuxottica | Price: ~$379 | Display: None
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Ray-Ban Meta is the only smart glasses product anyone has ever
          successfully sold at scale. The second generation improves the camera
          (now 12MP with ultrawide video), adds better battery life, and
          integrates Meta AI for hands-free queries. There is no visible
          display, which is the trade-off that keeps the form factor normal.
          If you want glasses you can wear to dinner without anyone noticing
          they are smart, this is the obvious pick. Meta has since added a
          separate, pricier product, the Meta Ray-Ban Display ($799), which
          builds in a small in-lens display and a Neural Band wristband for
          input. It is a different device from the standard Ray-Ban Meta, but
          it is Meta&apos;s first fashion-frame glasses with a real display.
        </p>

        {/* Rokid Glasses */}
        <h2 id="rokid-glasses" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          Rokid Glasses: Best display smart glasses
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/COP30_-_Rokid_01.jpg/1280px-COP30_-_Rokid_01.jpg"
            alt="Rokid Glasses with built-in micro-LED display"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Made by Rokid | Price: ~$499 | Display: Micro-LED monocular
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          At 49 grams and packing a visible micro-LED display, the Rokid
          Glasses have quietly taken the global lead in the display-AI smart
          glasses category. A March 2026 software update made them the first
          smart glasses to natively run Google Gemini, ahead of Google's own
          branded glasses. If you want a real-time info overlay (notifications,
          translations, navigation cues) without committing to a full headset,
          Rokid is the current champion. Rokid also offers a screenless model,
          the AI Glasses Style ($299), that drops the display for a lighter
          38.5-gram frame aimed squarely at Ray-Ban Meta.
        </p>

        {/* Xreal One Pro */}
        <h2 id="xreal-one-pro" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          Xreal One Pro: Best AR glasses for media & gaming
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Tokyo-Game-Show-2024-Day4---2024-09-29_252.jpg/1280px-Tokyo-Game-Show-2024-Day4---2024-09-29_252.jpg"
            alt="Xreal AR glasses on display at Tokyo Game Show 2024"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Made by Xreal | Price: ~$599 | Display: 1080p micro-OLED, 57 degree FOV
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Xreal makes the best tethered display glasses on the market. The
          One Pro pairs with your phone, Steam Deck, or console via USB-C and
          throws a massive virtual screen in front of you. The custom X1 chip
          handles stabilization and 3DoF tracking locally, so the image stays
          anchored in space even when you turn your head. Used heavily by
          frequent flyers and WFH developers who want a second monitor on the
          road.
        </p>

        {/* Viture Pro */}
        <h2 id="viture-pro" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          Viture Pro: Best for prescription and portability
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://www.viture.com/opengraph-image?376fa9d8052ebb8e"
            alt="Viture Pro XR glasses with built-in myopia adjustment"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Made by Viture | Price: ~$499 | Display: 1080p micro-OLED, 46 degree FOV
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Viture Pro's headline feature is built-in myopia adjustment, so
          prescription wearers can dial in a corrected image without paying
          extra for custom inserts. The form factor is slightly slimmer than
          Xreal, and the Mobile Dock accessory adds a self-contained Android
          XR mode so the glasses can run without a tethered device. A great
          alternative to Xreal if glasses ergonomics matter to you. Viture&apos;s
          2026 lineup has since expanded with the Beast XR ($549), which adds a
          brighter Sony micro-OLED panel and a 174-inch virtual screen, plus
          the more affordable Luma line starting at $399.
        </p>

        {/* Ad: between Viture Pro (4th) and Meta Orion (5th) */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        {/* Meta Orion */}
        <h2 id="meta-orion" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          Meta Orion: The developer preview of true AR
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://about.fb.com/wp-content/uploads/2024/09/Connect-24_Introducing-Orion_Header.jpg"
            alt="Meta Orion AR glasses developer preview revealed at Connect 2024"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Made by Meta | Price: Not available for consumers | Display: Custom micro-LED waveguide
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Orion is the glimpse of the future Meta showed off in late 2024.
          Full-color holographic displays, 70-degree field of view, a wireless
          compute puck, and a neural wristband for input. Not for sale, but
          important as a signal. Meta is telegraphing that its consumer AR
          glasses are a few hardware generations away. Any serious AR buyer
          should be watching Orion closely because whatever Meta ships for
          real will draw from it.
        </p>

        {/* Google Android XR */}
        <h2 id="android-xr-glasses" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          Google Android XR Glasses: The Android of smart glasses
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/0098-ARVR-XR-Blog-Header-2096x1182-v2.width-1300.png"
            alt="Google Android XR platform header from the Google Keyword blog"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Made by Google with Samsung, Xreal, and partners | Price: TBA | Display: Varies by OEM
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Android XR is Google's answer to visionOS and Horizon OS, built
          specifically for AR and MR devices. Partner hardware is rolling out
          through 2026 and 2027, with Samsung's headset already in market and
          dedicated Android XR smart glasses on the roadmap. Expect tight
          Gemini integration, access to Google Maps, Translate, and Workspace,
          and the usual Android ecosystem openness. The platform that is most
          likely to commoditize smart glasses over the next five years.
        </p>

        {/* Apple Vision Pro */}
        <h2 id="apple-vision-pro" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          Apple Vision Pro: Not glasses, still the benchmark
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Apple_Vision_Pro_with_Solo_Knit_Band.jpg"
            alt="Apple Vision Pro mixed-reality headset with the Solo Knit Band"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Made by Apple | Price: $3,699 | Display: Dual 4K+ micro-OLED
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Vision Pro is not a pair of glasses, but any AR buyers guide has to
          include it. The passthrough AR experience is the best in consumer
          hardware by a wide margin, the micro-OLED displays are the sharpest
          available, and visionOS is purpose-built for spatial computing
          workflows. The price keeps it in early-adopter territory. A lighter,
          cheaper Vision successor is now reported for no earlier than 2028,
          with Apple shifting focus toward its own smart glasses.
        </p>

        {/* What's coming in AR */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          What is coming in AR glasses
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The next two years are going to reset the smart glasses market.
          Google I/O on May 19 to 20, 2026 delivered the biggest public moment
          for Android XR yet. Samsung and Google gave the first official look
          at their joint Android XR smart glasses, shown in two styles made
          with Gentle Monster and Warby Parker, with an audio-and-camera first
          generation (no display) confirmed for a fall 2026 launch and a
          display version on the 2027 roadmap. Xreal also revealed Project
          Aura, the first Android XR display glasses, due before the end of
          2026. Meta is expected to ship a consumer Orion successor in the 2027
          to 2028 window, while Apple has reportedly pushed its lighter, cheaper
          Vision device toward 2028 and shifted resources to its own smart
          glasses. Snap has confirmed its standalone Specs for fall 2026 at
          around $2,500. Pico&apos;s Project Swan remains the wildcard. The
          market will consolidate quickly once these platforms land.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          In the meantime, the smart play in 2026 is to pick one of the
          current mature devices (Ray-Ban Meta for camera-and-audio, Rokid for
          a display, Xreal or Viture for a big virtual screen) and enjoy it
          without trying to future-proof. The technology is moving too fast to
          buy for 2028.
        </p>

        {/* Latest AR coverage */}
        <RecentArticles
          tags={["ar", "xr"]}
          heading="Latest AR & Smart Glasses Coverage"
          limit={5}
        />

        {/* Cross-link to other pillar pages */}
        <AllPillarGuides exclude="ar-glasses" />
      </main>

      <Footer />
    </>
  );
}
