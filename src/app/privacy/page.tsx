export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--gradient-subtle)" }}>
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <Section title="1. Information We Collect">
            <p>When you sign in with Google, we receive your name, email address, and profile picture. When you upload images for upscaling, those images are temporarily stored for processing.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2">
              <li>Your email is used to identify your account and track your free credits.</li>
              <li>Uploaded images are used solely for AI upscaling. They are not used for training, shared with third parties, or stored permanently.</li>
              <li>We do not sell, rent, or share your personal data with advertisers or third parties.</li>
            </ul>
          </Section>

          <Section title="3. Image Storage & Deletion">
            <p>Uploaded and processed images are automatically deleted from our servers within 30 days. You can request immediate deletion at any time by contacting us.</p>
          </Section>

          <Section title="4. Cookies">
            <p>We use essential cookies for authentication (session cookies) and anonymous user tracking. We do not use tracking cookies for advertising purposes.</p>
          </Section>

          <Section title="5. Data Security">
            <p>We implement industry-standard security measures to protect your data. Your images are transmitted over HTTPS and processed in secure cloud environments.</p>
          </Section>

          <Section title="6. Third-Party Services">
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Google OAuth</strong> — for account authentication</li>
              <li><strong>fal.ai</strong> — for AI-powered image upscaling</li>
              <li><strong>Vercel</strong> — for hosting and database services</li>
            </ul>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us.</p>
          </Section>

          <Section title="8. Contact">
            <p>If you have questions about this policy, email us at <strong>elaine20230910@gmail.com</strong>.</p>
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
