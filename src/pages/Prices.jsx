import React from "react";
import { Link } from "react-router-dom";

import { Check, CreditCard, PawPrint, Tag, Truck } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function Prices() {
  const monthlyPrice = 100;

  const tagPrice = 250;

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
          <Badge variant="secondary">Per pet subscription</Badge>
          <Badge variant="outline">One-off tag purchase</Badge>
        </div>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Pricing that matches the flow
        </h1>
        <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
          Add your pet, start a monthly subscription per pet, then purchase a physical tag when you’re ready.
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="flex flex-wrap items-center gap-2">Monthly subscription (per pet)</CardTitle>
                <CardDescription>Flat monthly price per pet.</CardDescription>
              </div>
              <div className="rounded-lg border bg-muted/40 px-4 py-3 text-right">
                <div className="text-sm text-muted-foreground">Monthly</div>
                <div className="text-3xl font-semibold tracking-tight">R{monthlyPrice}</div>
                <div className="text-xs text-muted-foreground">per pet / month</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <PawPrint className="h-4 w-4 text-primary" />
                  Per pet subscription
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-semibold">R{monthlyPrice}</div>
                  <Badge variant="outline">per month</Badge>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Pet profile + QR scan page
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Update details anytime
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Support + ongoing improvements
                </li>
              </ul>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm">
                  <div className="font-medium">How the pricing works</div>
                  <div className="text-muted-foreground">
                    Your subscription is billed monthly per pet. After subscribing, you can purchase a physical tag for
                    that pet.
                  </div>
                </div>
                <Button asChild variant="secondary">
                  <Link to="/features">See what’s included</Link>
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/NormalLearn">Learn about the tag</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/select-tag/standard">Get Standard</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Normal tag (one-off)</CardTitle>
            <CardDescription>Purchase after subscribing a pet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Tag className="h-4 w-4 text-primary" />
                  Tag price
                </div>
                <Badge variant="outline">per tag</Badge>
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">R{tagPrice}</div>
              <div className="mt-1 text-xs text-muted-foreground">One-time purchase (not monthly)</div>
              <ul className="mt-3 space-y-2">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Custom engraving
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  QR code linked to your pet’s profile
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
              <Link to="/select-tag/standard">Purchase a tag</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <Separator className="my-12" />

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>1) Add your pet</CardTitle>
            <CardDescription>Create a pet profile in your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" />
              Name, breed, photo, and details
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2) Start the subscription</CardTitle>
            <CardDescription>Flat monthly price per pet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <CreditCard className="mt-0.5 h-4 w-4 text-primary" />
              R{monthlyPrice} / month, per pet
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3) Purchase a tag</CardTitle>
            <CardDescription>One-off purchase per pet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Tag className="mt-0.5 h-4 w-4 text-primary" />
              R{tagPrice} per tag (once-off)
            </div>
            <div className="flex items-start gap-2">
              <Truck className="mt-0.5 h-4 w-4 text-primary" />
              Delivered to you
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">FAQ</h2>
          <p className="mt-2 text-muted-foreground">
            The most common questions about pricing, delivery, and what happens when someone scans the tag.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What do I pay monthly vs once-off?</AccordionTrigger>
              <AccordionContent>
                The subscription is billed monthly per pet:{" "}
                <span className="font-medium text-foreground">R{monthlyPrice}</span>. The physical tag is a separate{" "}
                <span className="font-medium text-foreground">R{tagPrice}</span> one-off purchase per tag.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is the subscription per pet?</AccordionTrigger>
              <AccordionContent>
                Yes. Each pet has its own subscription billed monthly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What happens when someone finds my pet?</AccordionTrigger>
              <AccordionContent>
                They scan the QR code on the tag and land on your pet’s profile, where they can see the information you
                choose to share and use it to contact you quickly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How does delivery work?</AccordionTrigger>
              <AccordionContent>
                We offer doorstep delivery or PUDO delivery. Delivery options are shown during checkout.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Can I subscribe first and buy the tag later?</AccordionTrigger>
              <AccordionContent>
                Yes — that’s the intended flow. Start the monthly subscription for your pet, then purchase the physical
                tag when you’re ready.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link to="/contact">Ask a pricing question</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Prices;
