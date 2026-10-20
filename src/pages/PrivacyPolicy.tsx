export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-gold-deep">Legal</span>
        <h1 className="font-display text-3xl md:text-4xl text-ink">Privacy Policy</h1>
        <p className="text-xs text-stone">Last updated: July 2026</p>
      </div>

      <p className="text-sm text-stone leading-relaxed bg-gold-mist/40 rounded-gk-sm p-4">
        This is placeholder policy text generated as part of the site build. It reflects how the
        site actually functions today (no accounts, no online payments, WhatsApp-based inquiries)
        but should be reviewed by a qualified professional before this business relies on it.
      </p>

      <Section title="What we collect">
        <p>
          Gk Design does not require an account to browse or inquire about products. We collect
          information only when you choose to provide it:
        </p>
        <ul>
          <li>Contact details you share when messaging us on WhatsApp or through the contact form (name, email, phone number, message content)</li>
          <li>Email address if you subscribe to our newsletter</li>
          <li>Basic, non-identifying analytics about how the site is used (pages visited, general location by IP, device type) to understand what's working</li>
          <li>Recently viewed products and wishlist selections, stored locally in your browser — not on our servers, and not tied to your identity</li>
        </ul>
      </Section>

      <Section title="What we don't collect">
        <p>
          Since the site has no shopping cart or online checkout, we never collect or store
          payment card details, billing addresses, or any financial information through the
          website itself. Any payment arrangements happen directly between you and Gk Design
          outside this site (in person, over call, or via WhatsApp), following whatever payment
          method is agreed at the time.
        </p>
      </Section>

      <Section title="How we use it">
        <p>
          Information you share is used to respond to your inquiry, arrange delivery of products
          you order, and — only if you've opted in — send occasional newsletter updates. We don't
          sell or rent your information to third parties.
        </p>
      </Section>

      <Section title="WhatsApp">
        <p>
          When you tap "Book on WhatsApp," you're taken to WhatsApp with a pre-filled message.
          That conversation is subject to WhatsApp's own privacy policy, not just this one, since
          it happens on WhatsApp's platform.
        </p>
      </Section>

      <Section title="Cookies and local storage">
        <p>
          We use your browser's local storage (not cookies) to remember your wishlist and recently
          viewed products, purely for your convenience across visits. This data stays in your
          browser and isn't transmitted to us unless you explicitly submit an inquiry.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You can ask us to tell you what information we hold about you, correct it, or delete it,
          by messaging us directly. Since we don't require accounts, most of what we hold is
          whatever you've told us directly in a conversation.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy can be sent to <a href="mailto:hello@gkdesign.in" className="text-gold-deep hover:underline">hello@gkdesign.in</a> or via WhatsApp.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <div className="text-sm text-stone leading-relaxed flex flex-col gap-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_li]:list-disc">
        {children}
      </div>
    </div>
  );
}
