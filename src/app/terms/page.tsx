export default function TermsPage() {
  return (
    <div style={{ background: "var(--gradient-subtle)" }}>
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <Section title="1. Acceptance of Terms">
            <p>By using ImageUpscaler, you agree to these Terms of Service. If you do not agree, please do not use our service.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>ImageUpscaler provides AI-powered image upscaling services. We offer a free tier with limited credits and paid plans with additional credits. Service features and pricing are subject to change.</p>
          </Section>

          <Section title="3. User Accounts">
            <p>You are responsible for maintaining the confidentiality of your account. You agree to provide accurate information and to not share your account with others. We reserve the right to suspend accounts that violate these terms.</p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Upload illegal, harmful, or abusive content</li>
              <li>Upload copyrighted material you do not own or have permission to use</li>
              <li>Use the service for generating deepfakes, adult content, or violent imagery</li>
              <li>Attempt to circumvent usage limits or abuse the free tier</li>
              <li>Reverse engineer or scrape the service</li>
            </ul>
          </Section>

          <Section title="5. Credits & Payments">
            <p>Free credits reset monthly and have no cash value. Paid credits and subscriptions are non-refundable unless required by law. We reserve the right to adjust pricing with advance notice.</p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>You retain all rights to the images you upload. The upscaled results are yours to use. We claim no ownership over your content. Our AI models, website code, and branding are our intellectual property.</p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>ImageUpscaler is provided "as is" without warranties. We are not liable for any damages arising from your use of the service, including but not limited to data loss, service interruptions, or unsatisfactory results.</p>
          </Section>

          <Section title="8. Service Availability">
            <p>We strive to maintain high availability but do not guarantee uninterrupted service. We may perform maintenance or updates at any time without prior notice.</p>
          </Section>

          <Section title="9. Termination">
            <p>We reserve the right to terminate or suspend accounts for violations of these terms. You may delete your account at any time by contacting us.</p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </Section>

          <Section title="11. Contact">
            <p>For questions about these terms, email us at <strong>elaine20230910@gmail.com</strong>.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-muted-foreground space-y-2">{children}</div>
    </div>
  );
}
