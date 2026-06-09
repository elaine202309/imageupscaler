export default function ContactPage() {
  return (
    <div style={{ background: "var(--gradient-subtle)" }}>
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Contact</span> Us
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Have a question or need help? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-muted-foreground">elaine20230910@gmail.com</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold mb-1">Response Time</h3>
            <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <input type="text" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-300" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input type="email" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-300" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Message</label>
              <textarea rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-300" placeholder="How can we help?" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: "var(--gradient-primary)" }}>
              Send Message
            </button>
            <p className="text-xs text-center text-muted-foreground">
              This form is for demonstration. For now, email us directly.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
