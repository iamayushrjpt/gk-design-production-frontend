import { Boxes, Layers, PenTool, MessagesSquare, Gem, ArrowRightLeft, Sparkles, Clock, Compass } from "lucide-react";

const offerings = [
  { icon: Boxes, text: "Custom 3D CAD models of luxury furniture and décor" },
  { icon: Layers, text: "High-quality renderings for presentations and catalogs" },
  { icon: PenTool, text: "Detailed technical drawings for manufacturing and construction" },
  { icon: MessagesSquare, text: "Design consultation and support for interior projects" },
];

const whyChooseUs = [
  { icon: Gem, title: "Luxury Focused", description: "We specialize in premium furniture and décor." },
  { icon: ArrowRightLeft, title: "Design to Execution", description: "From concept to technical precision." },
  { icon: Sparkles, title: "Photorealistic Quality", description: "Stunning renders that speak for your brand." },
  { icon: Clock, title: "Fast & Reliable", description: "Timely delivery with design consistency." },
  { icon: Compass, title: "2025-Ready Approach", description: "Latest design tools & global design trends." },
];

export default function About() {
  return (
    <div>
      {/* Hero image without text overlay */}
      <div className="h-72 md:h-96 overflow-hidden">
        <img
          src="/about-gk.jpeg"
          alt="GK Design studio"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* About heading follows the same centered layout as other sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-4 text-center">
        <span className="text-xs tracking-[0.2em] uppercase text-gold-deep">Since 2016</span>
        <h1 className="font-display text-3xl md:text-4xl text-ink mt-2">About GK Design</h1>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 flex flex-col gap-5">
        <p className="text-sm text-stone leading-relaxed">
          Since our beginning in 2016, GK Design is a creative design company specializing in
          luxury furniture and home decor solutions. We provide high-quality 3D CAD files,
          photorealistic renderings, and precise technical drawings tailored for designers,
          architects, and manufacturers. Our designs are crafted to bring innovation, elegance,
          and detail to every space.
        </p>
      </div>

      {/* Who We Are */}
      <div className="bg-ink-soft">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 flex flex-col gap-5">
          <h2 className="font-display text-2xl text-ivory text-center">Who We Are</h2>
          <p className="text-sm text-mist leading-relaxed">
            We are a team of passionate designers and CAD professionals dedicated to redefining
            luxury furniture design through digital precision. At GK Design, we combine
            creativity with technical expertise to deliver designs that are not only visually
            stunning but also production-ready.
          </p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <h2 className="font-display text-2xl text-ink mb-10 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {offerings.map((item) => (
            <div key={item.text} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold-mist flex items-center justify-center">
                <item.icon size={22} className="text-gold-deep" />
              </div>
              <p className="text-sm text-stone leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Vision */}
      <div className="bg-gold-mist/40">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 flex flex-col gap-5 text-center items-center">
          <h2 className="font-display text-2xl text-ink">Our Vision</h2>
          <p className="text-sm text-stone leading-relaxed">
            To become a trusted global partner for digital furniture design by delivering
            premium-quality CAD content and visuals that help brands, designers, and
            manufacturers bring their ideas to life with confidence and clarity.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-ink-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <h2 className="font-display text-2xl text-ivory text-center mb-12">Why Choose GK Design?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold-mist/10 border border-gold/30 flex items-center justify-center">
                  <item.icon size={22} className="text-gold" />
                </div>
                <h3 className="font-display text-lg text-ivory">{item.title}</h3>
                <p className="text-sm text-mist leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden bg-[#111722] p-4 flex items-center justify-center shrink-0 border border-gold/20">
            <img
              src="/gk-design-logo.jpeg"
              alt="GK Design logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col gap-3 text-center md:text-left">
            <div>
              <h2 className="font-display text-2xl text-ink">Founder</h2>
            </div>
            <p className="text-sm text-stone leading-relaxed">
              In his career, G K Rajput has hands-on experience in executing a number of
              projects of diverse sizes, budgets and variety of nature. He has hands-on
              experience in the luxury furniture and home decor industry from concept
              development to final production, with a deep understanding of design, materials,
              and technical execution. He founded GK Design out of a vision to support designers
              and manufacturers with precise and visually compelling design solutions.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
