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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-lg font-semibold mb-2">Email Us</h3>
            <p className="text-sm text-muted-foreground mb-1">elaine20230910@gmail.com</p>
          </div>
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🕐</div>
            <h3 className="text-lg font-semibold mb-2">Response Time</h3>
            <p className="text-sm text-muted-foreground">Within 48 hours on business days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
