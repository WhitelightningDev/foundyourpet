import React from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function TsAndCs() {
  const LAST_UPDATED = "January 22, 2026";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/android-chrome-192x192.png"
            alt="Found Your Pet"
            width="56"
            height="56"
            className="h-14 w-14 rounded-xl border bg-card object-cover shadow-sm"
          />
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Terms and Conditions</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-normal">
                Last updated: {LAST_UPDATED}
              </Badge>
              <span>Applies to Found Your Pet and its affiliates.</span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agreement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-foreground">
          <p className="text-muted-foreground">
            Welcome to Found Your Pet. These Terms and Conditions ("Terms") govern your access to
            and use of Found Your Pet’s websites, apps, progressive web apps (PWA), QR-tag
            services, and related products and services (collectively, the "Service"). By
            accessing or using the Service, creating an account, submitting content (including pet
            reports), or purchasing products, you agree to be bound by these Terms.
          </p>

          <Separator />

          <section className="space-y-2">
            <h2 className="text-base font-semibold">1. Who We Are (Including Affiliates)</h2>
            <p>
              "Found Your Pet", "we", "us", and "our" refer to Found Your Pet and its
              subsidiaries, affiliates, and related companies, as well as our officers, directors,
              employees, contractors, and agents (together, "Affiliates"). Our Service includes
              tools such as digital pet ID tags with dynamic QR codes, pet profiles, public
              lost/found pet reports, comments/reactions, and notification features designed to
              help connect pet owners and pet finders.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">2. Definitions</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">"Account"</span> means your user
                account for accessing parts of the Service.
              </li>
              <li>
                <span className="font-medium text-foreground">"Content"</span> means any text,
                photos, videos, comments, reports, and other materials you submit, post, or
                otherwise make available through the Service.
              </li>
              <li>
                <span className="font-medium text-foreground">"Pet Profile"</span> means a
                profile associated with your pet (including information you choose to display
                publicly).
              </li>
              <li>
                <span className="font-medium text-foreground">"Report"</span> means a lost or
                found pet report submitted to the public feed.
              </li>
              <li>
                <span className="font-medium text-foreground">"Tag"</span> means a physical
                product with a QR code or other identifier linked to a Pet Profile.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">3. Eligibility and Account Security</h2>
            <p>
              You must be able to form a legally binding contract to use the Service. If you are
              under the age of majority in your jurisdiction, you may only use the Service with
              the permission and supervision of a parent/guardian. You are responsible for
              maintaining the confidentiality of your login credentials and for all activity that
              occurs under your Account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">4. Pet Tags, QR Codes, and Profiles</h2>
            <p>
              Each Tag may include a dynamic QR code that links to a Pet Profile. When a Tag is
              scanned, the Service may display certain information you choose to make public (for
              example: pet name, photo, breed, location notes, and a contact method). You are
              solely responsible for:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Keeping Pet Profile information accurate and up to date.</li>
              <li>
                Choosing what personal information you make public and understanding that public
                information may be viewed, copied, or shared by others.
              </li>
              <li>Ensuring you have the rights/permissions to upload pet photos and other Content.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">
              5. Lost/Found Reports, Comments, Reactions, and Safety
            </h2>
            <p>
              The Service may allow users to post public Reports, comments, reactions, and other
              Content. You agree not to post Content that is false, misleading, defamatory,
              harassing, hateful, unlawful, invasive of privacy, or otherwise harmful. You also
              agree not to post sensitive personal data (for example, government ID numbers,
              payment details, or private addresses unless necessary for a safe reunification).
            </p>
            <p className="text-muted-foreground">
              Safety note: Always use good judgment when meeting someone in person. Consider
              meeting in a public place and involving local shelters, rescues, or authorities when
              appropriate.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">
              6. Content Moderation, Removal, and Enforcement
            </h2>
            <p>
              We may (but are not required to) monitor or review Content. We reserve the right to
              remove, restrict, or disable access to any Content, Report, or Account at any time
              for any reason, including to comply with law, enforce these Terms, or protect users
              and the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">7. Push Notifications</h2>
            <p>
              If you opt in, we may send push notifications or similar alerts (including via your
              browser, installed PWA, or mobile device) to inform you about new Reports or Service
              updates. Delivery is not guaranteed and can be affected by device settings, network
              connectivity, and third-party notification services. You can disable notifications
              at any time from your device settings and/or within the Service where available.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">8. Purchases, Memberships, and Payments</h2>
            <p>
              Some parts of the Service may require payment (for example, Tags, memberships, or
              upgrades). Prices, taxes, shipping, and other fees will be displayed at checkout.
              When you submit an order, you authorize us (and our third-party payment processors)
              to charge the payment method you provide. Unless otherwise required by law or
              explicitly stated at checkout, purchases are non-refundable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">9. Delivery and Fulfillment</h2>
            <p>
              Tags may be custom-made and shipped to the address you provide. Delivery times may
              vary due to manufacturing, carrier delays, customs, or other factors outside our
              control. We are not responsible for delays caused by third-party delivery providers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">10. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Use the Service for unlawful, abusive, or fraudulent purposes.</li>
              <li>Attempt to gain unauthorized access to any account, system, or data.</li>
              <li>Scrape, harvest, or mass-collect data from the Service without permission.</li>
              <li>Upload malware, or interfere with the operation or security of the Service.</li>
              <li>Impersonate others or misrepresent your affiliation with any person or entity.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">11. Intellectual Property</h2>
            <p>
              The Service, including its design, logos, software, and related materials, is owned
              by Found Your Pet or our licensors and is protected by applicable laws. You may not
              copy, modify, distribute, sell, or lease any part of the Service except as expressly
              permitted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">12. Third-Party Services</h2>
            <p>
              The Service may rely on third-party providers (for example, hosting, analytics,
              payments, mapping, cloud storage, or notifications). We are not responsible for
              third-party services and your use of them may be subject to their terms and
              policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">13. Disclaimers</h2>
            <p>
              The Service is provided on an "as is" and "as available" basis. To the maximum
              extent permitted by law, Found Your Pet and its Affiliates disclaim all warranties
              of any kind, whether express, implied, or statutory, including implied warranties of
              merchantability, fitness for a particular purpose, and non-infringement. We do not
              guarantee that the Service will be uninterrupted, secure, error-free, or that any
              pet will be located or returned.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">14. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Found Your Pet and its Affiliates will not
              be liable for any indirect, incidental, special, consequential, or punitive damages,
              or any loss of profits, data, goodwill, or other intangible losses, arising out of
              or related to your use of (or inability to use) the Service, even if we have been
              advised of the possibility of such damages.
            </p>
            <p className="text-muted-foreground">
              Found Your Pet is not responsible for the actions or omissions of pet finders, pet
              owners, third-party carriers, or other users. We provide tools intended to
              facilitate connections; we do not control or guarantee outcomes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">15. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Found Your Pet and its Affiliates
              from and against any claims, liabilities, damages, losses, and expenses (including
              reasonable legal fees) arising from or related to your use of the Service, your
              Content, your violation of these Terms, or your violation of any rights of a third
              party.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">16. Suspension and Termination</h2>
            <p>
              We reserve the right to suspend, terminate, or restrict your access to our services
              if we believe you are violating these Terms or acting in a harmful manner.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">17. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Service
              constitutes your acceptance of any modifications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">18. Privacy</h2>
            <p>
              Our collection and use of personal information is described in our{" "}
              <Link to="/privacy-policy" className="font-medium text-primary underline underline-offset-4">
                Privacy Policy
              </Link>
              . You acknowledge that some information you choose to share through the Service may
              be publicly visible.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">19. Contact</h2>
            <p>
              If you have questions about these Terms, please reach out via our{" "}
              <Link to="/contact" className="font-medium text-primary underline underline-offset-4">
                Contact
              </Link>{" "}
              page.
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}

export default TsAndCs;
