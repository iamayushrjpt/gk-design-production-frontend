export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-gold-deep">Legal</span>
        <h1 className="font-display text-3xl md:text-4xl text-ink">Terms & Conditions</h1>
        <p className="text-xs text-stone">Last updated: July 2026</p>
      </div>

      <p className="text-sm text-stone leading-relaxed bg-gold-mist/40 rounded-gk-sm p-4">
        This is placeholder terms text generated as part of the site build, reflecting how the
        site actually functions today. It should be reviewed by a qualified professional before
        this business relies on it.
      </p>

      <Section title="How ordering works">
        <p>
          This site does not process payments or take orders directly online. Every product page
          includes a "Book on WhatsApp" option that opens a pre-filled message to our business
          WhatsApp number. An order is only confirmed once we've agreed on product, price,
          customization, and delivery details directly with you.
        </p>
      </Section>

      <Section title="Pricing">
        <p>
          Prices shown on the site are indicative and current at the time of listing but are
          confirmed at the point of inquiry, since material and customization costs can change.
          We'll always confirm final pricing with you before you're asked to pay anything.
        </p>
      </Section>

      <Section title="Customization and made-to-order items">
        <p>
          Many products are made to order once confirmed. Estimated delivery windows shown on
          product pages are estimates, not guarantees — we'll keep you updated if a specific
          order's timeline shifts.
        </p>
      </Section>

      <Section title="Delivery and damage">
        <p>
          Delivery methods vary by product and location and are confirmed at the time of
          ordering. Please inspect items on delivery; report any transit damage within 48 hours
          so we can arrange a resolution.
        </p>
      </Section>

      <Section title="Cancellations and returns">
        <p>
          Because many pieces are made or finished to order, cancellation and return terms are
          agreed on a per-order basis at the time of confirmation. Standard, in-stock items
          generally allow returns within 7 days of delivery if unused and in original condition —
          ask us to confirm this for your specific order.
        </p>
      </Section>

      <Section title="Product accuracy">
        <p>
          We aim for dimensions, materials, and photography on this site to be accurate. Natural
          materials like solid wood, jute, and hand-glazed ceramic vary piece to piece by design —
          slight variation from photos is expected, not a defect.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms as the business evolves. The version posted on this page at
          the time of your order is the one that applies.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms can be sent to <a href="mailto:hello@gkdesign.in" className="text-gold-deep hover:underline">hello@gkdesign.in</a> or via WhatsApp.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <div className="text-sm text-stone leading-relaxed flex flex-col gap-3">{children}</div>
    </div>
  );
}
