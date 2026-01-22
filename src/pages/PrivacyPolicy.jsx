import React from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function PrivacyPolicy() {
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
            <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
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
          <CardTitle className="text-base">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-foreground">
          <p className="text-muted-foreground">
            This Privacy Policy explains how Found Your Pet and its subsidiaries, affiliates, and
            related companies ("Found Your Pet", "we", "us", "our", and "Affiliates") collect, use,
            share, and protect information when you use our websites, apps, progressive web apps
            (PWA), QR-tag services, and related products and services (collectively, the
            "Service").
          </p>

          <Separator />

          <section className="space-y-2">
            <h2 className="text-base font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">We may collect:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Account information</span> (e.g.,
                name, surname, email, phone number, and login details).
              </li>
              <li>
                <span className="font-medium text-foreground">Pet information</span> (e.g., pet
                name, breed/species, photos, and profile details you choose to add).
              </li>
              <li>
                <span className="font-medium text-foreground">Report information</span> you submit
                to the public lost/found feed (e.g., location and description).
              </li>
              <li>
                <span className="font-medium text-foreground">Order and payment details</span>{" "}
                (e.g., tag type, shipping information, and transaction metadata). Payments are
                processed by third-party payment providers; we generally do not store full card
                numbers.
              </li>
              <li>
                <span className="font-medium text-foreground">Device and usage information</span>{" "}
                (e.g., browser type, device identifiers, pages visited, approximate session
                duration, and diagnostic logs).
              </li>
              <li>
                <span className="font-medium text-foreground">Notification data</span> (e.g., web
                push subscription details or tokens) if you opt in to notifications.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">2. Publicly Visible Information</h2>
            <p>
              Some information may be public by design, depending on what you choose to share. For
              example:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                When a QR code is scanned, your Pet Profile may display details you have chosen to
                make public (such as a pet photo and a contact method).
              </li>
              <li>
                Public Reports (lost/found posts), comments, and reactions may be visible to other
                users and site visitors.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Please avoid sharing sensitive personal information in public fields.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">3. How We Use Information</h2>
            <p className="text-muted-foreground">We use information to:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Provide and operate the Service (accounts, profiles, reports, and tag features).</li>
              <li>Process orders, deliver tags, and provide support.</li>
              <li>Send service-related messages and, if enabled, push notifications.</li>
              <li>Prevent fraud, abuse, and security incidents.</li>
              <li>Analyze usage to improve performance and user experience.</li>
              <li>Comply with legal obligations and enforce our terms.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">4. Cookies, Local Storage, and Similar Tech</h2>
            <p>
              We may use cookies, local storage, and similar technologies to keep you signed in,
              remember preferences, and help us understand how the Service is used. You can control
              cookies through your browser settings. Some features may not function properly if
              you disable storage or cookies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">5. Sharing and Disclosure</h2>
            <p className="text-muted-foreground">We may share information with:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Service providers</span> (e.g.,
                hosting, cloud storage, analytics, payment processing, email/notifications, and
                shipping/fulfillment), who process information on our behalf.
              </li>
              <li>
                <span className="font-medium text-foreground">Affiliates</span> where necessary to
                operate, support, or improve the Service.
              </li>
              <li>
                <span className="font-medium text-foreground">Legal and safety authorities</span>{" "}
                when required by law, to protect rights and safety, or to prevent fraud or abuse.
              </li>
            </ul>
            <p className="text-muted-foreground">
              We do not sell your personal information for monetary consideration.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">6. Data Security</h2>
            <p>
              We take reasonable administrative, technical, and organizational measures designed to
              protect information. However, no method of transmission or storage is 100% secure, so
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">7. Data Retention</h2>
            <p>
              We retain information for as long as needed to provide the Service, comply with legal
              obligations, resolve disputes, and enforce our agreements. Retention periods vary
              depending on the type of data and how it is used.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">8. Your Rights and Choices</h2>
            <p className="text-muted-foreground">Depending on your location, you may be able to:</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Access, correct, or update your account and pet profile information.</li>
              <li>Request deletion of certain information, subject to legal requirements.</li>
              <li>Opt out of push notifications via device settings and/or within the Service.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">9. Children’s Privacy</h2>
            <p>
              The Service is not intended for children. If you believe a child has provided us with
              personal information, please contact us so we can take appropriate steps.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page and the "Last updated" date will be revised. Continued use of the Service after
              changes means you accept the updated policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">11. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us via our{" "}
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

export default PrivacyPolicy;
