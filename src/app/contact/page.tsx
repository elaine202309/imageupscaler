export default function ContactPage() {
  return (
    <div style={{ background: "var(--gradient-subtle)" }}>
      {/* Header */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-pink-300/15 rounded-full blur-3xl animate-float-delay" />
        <div className="container mx-auto max-w-3xl px-4 py-20 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Contact</span> Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            We're here to help. Whether it's a question about upscaling, billing, or just feedback — reach out anytime.
          </p>
        </div>
        <div className="relative">
          <svg viewBox="0 0 1440 60" fill="var(--background)"><path d="M0 60V30C240 0 480 0 720 15C960 30 1200 45 1440 30V60H0Z" /></svg>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="glass rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #faf5ff, #fce7f3)" }}>
                📧
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground text-sm mb-3">Drop us a message anytime</p>
              <a href="mailto:elaine20230910@gmail.com" className="text-primary font-semibold hover:underline">
                elaine20230910@gmail.com
              </a>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:shadow-lg transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #faf5ff, #fce7f3)" }}>
                🕐
              </div>
              <h3 className="text-lg font-semibold mb-2">Response Time</h3>
              <p className="text-muted-foreground text-sm mb-3">We reply as quickly as we can</p>
              <p className="text-primary font-semibold">Within 48 hours on business days</p>
            </div>
          </div>

          {/* Common Topics */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Common Questions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TopicCard icon="🖼" title="Image Upscaling" desc="Questions about quality, formats, or upscale factors" />
              <TopicCard icon="💳" title="Billing & Plans" desc="Pricing, credits, upgrades, and cancellations" />
              <TopicCard icon="🔒" title="Privacy & Security" desc="How we handle your images and personal data" />
              <TopicCard icon="🐛" title="Bug Report" desc="Found something not working? Let us know" />
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="rounded-3xl p-10 relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Prefer to figure it out yourself?</h3>
                <p className="text-white/80 mb-6">Check out our FAQ or try upscaling for free</p>
                <div className="flex gap-4 justify-center">
                  <a href="/" className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-all">Upscale for Free →</a>
                  <a href="/pricing" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all">View Plans</a>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TopicCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-5 hover:shadow-md transition-all">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
