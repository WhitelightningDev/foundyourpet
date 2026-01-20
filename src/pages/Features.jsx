import React from "react";
import { Link } from "react-router-dom";

import { Check, CreditCard, QrCode, ShieldCheck, Sparkles, Tag, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function Features() {
  const subscriptionTiers = [
    { label: "Small pet", price: 50, hint: "Cats & small dogs" },
    { label: "Medium pet", price: 70, hint: "Most dogs", popular: true },
    { label: "Large pet", price: 100, hint: "Large breeds" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <img
          src="/android-chrome-192x192.png"
          alt="Found Your Pet"
          className="mx-auto mb-4 h-16 w-16 rounded-xl border bg-background shadow-sm"
          width="64"
          height="64"
        />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">Standard Tag</Badge>
          <Badge variant="outline">No battery</Badge>
          <Badge variant="outline">Scan-to-contact</Badge>
        </div>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Features</h1>
        <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
          A simple, durable tag that helps a finder reach you fast. GPS tracking tags are coming soon.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/dashboard">Add a pet</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link to="/prices">View pricing</Link>
          </Button>
        </div>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>How the Standard Tag works</CardTitle>
            <CardDescription>
              A physical tag + a QR code that links to your pet’s online profile (contact info, notes, and instructions).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex gap-3">
                <QrCode className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Scan in seconds</div>
                  <div className="text-sm text-muted-foreground">
                    Anyone who finds your pet can scan the code to open the profile.
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Always up to date</div>
                  <div className="text-sm text-muted-foreground">Update your pet’s details anytime from your dashboard.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Built for everyday life</div>
                  <div className="text-sm text-muted-foreground">No charging, no app required for a finder.</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center rounded-lg border bg-muted/30 p-6">
              <img
                src="/standard-dogtag.png"
                alt="Standard Dog Tag"
                className="h-auto w-full max-w-[240px] rounded-md"
                loading="lazy"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/NormalLearn">Learn more</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/select-tag/standard">Order tags</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Standard Tag pricing</CardTitle>
            <CardDescription>The flow is subscription first, then tag purchase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Monthly subscription (per pet)
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {subscriptionTiers.map((tier) => (
                  <div
                    key={tier.label}
                    className="flex items-start justify-between gap-3 rounded-md border bg-muted/20 px-3 py-2"
                  >
                    <div>
                      <div className="font-medium text-foreground">{tier.label}</div>
                      <div className="text-xs text-muted-foreground">{tier.hint}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">R{tier.price}</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                      {tier.popular ? <Badge className="mt-2">Most popular</Badge> : null}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Choose the tier when adding a pet. Subscriptions are billed monthly per pet.
              </div>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Tag className="h-4 w-4 text-primary" />
                  Normal tag (one-off)
                </div>
                <Badge variant="outline">per tag</Badge>
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">R250</div>
              <ul className="mt-3 space-y-2">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Custom engraving + QR code
                </li>
                <li className="flex gap-2">
                  <Truck className="mt-0.5 h-4 w-4 text-primary" />
                  Delivery (doorstep or PUDO)
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/prices">See full pricing details</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <Separator className="my-12" />

      <section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What you get</h2>
          <p className="mt-2 text-muted-foreground">
            Everything designed around one goal: make it easy for a finder to contact you quickly.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "No battery, no fuss",
              desc: "Works instantly — nothing to charge.",
              icon: Sparkles,
            },
            {
              title: "QR scan to profile",
              desc: "Open a pet profile with the details you choose to share.",
              icon: QrCode,
            },
            {
              title: "Update details anytime",
              desc: "Keep contacts and notes current from your dashboard.",
              icon: ShieldCheck,
            },
            {
              title: "Custom engraving",
              desc: "Clear and durable engraving on the physical tag.",
              icon: Tag,
            },
            {
              title: "Delivery included",
              desc: "Choose doorstep or PUDO delivery at checkout.",
              icon: Truck,
            },
            {
              title: "Built for everyday wear",
              desc: "Made to handle real life on collars and harnesses.",
              icon: Sparkles,
            },
          ].map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Features;
