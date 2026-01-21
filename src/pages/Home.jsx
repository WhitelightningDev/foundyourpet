import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Info,
  Mail,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  UserPlus,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function Home() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTagId, setActiveTagId] = useState("standard");
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const homeThemeVars = useMemo(
    () => ({
      "--background": "45 100% 97%",
      "--foreground": "222.2 47.4% 11.2%",

      "--card": "0 0% 100%",
      "--card-foreground": "222.2 47.4% 11.2%",

      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 47.4% 11.2%",

      "--primary": "174 72% 38%",
      "--primary-foreground": "0 0% 100%",

      "--secondary": "42 100% 93%",
      "--secondary-foreground": "222.2 47.4% 11.2%",

      "--muted": "40 100% 95%",
      "--muted-foreground": "215.4 16.3% 38%",

      "--accent": "174 56% 90%",
      "--accent-foreground": "222.2 47.4% 11.2%",

      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 100%",

      "--border": "34 55% 82%",
      "--input": "34 55% 82%",
      "--ring": "174 72% 38%",
    }),
    []
  );

  const standardTagFeatures = useMemo(
    () => [
      { title: "Basic Identification", description: "A simple ID for your pet." },
      { title: "Durable", description: "Made from high-quality materials." },
      { title: "Instant Scan", description: "Works with any smartphone camera." },
    ],
    []
  );

  const samsungTagFeatures = useMemo(
    () => [
      {
        title: "Smart Tracking",
        description: "Works with Samsung devices for real-time tracking.",
      },
      {
        title: "Battery Life",
        description: "Long-lasting battery for your peace of mind.",
      },
    ],
    []
  );

  const appleTagFeatures = useMemo(
    () => [
      {
        title: "iOS Compatibility",
        description: "Works seamlessly with Apple devices.",
      },
      {
        title: "Advanced Location Tracking",
        description: "Track your pet with the Found My app.",
      },
    ],
    []
  );

  const tags = useMemo(
    () => [
      {
        id: "standard",
        title: "Standard Tag",
        status: "Available",
        description:
          "Personalized QR tag for fast identification. Simple, reliable, and easy to use.",
        image: "/Standad-tagwithqrcode.png",
        modalTitle: "Standard Tag",
        modalDescription:
          "A basic dog tag used for pet identification with a unique QR code linked to your pet’s profile.",
        features: standardTagFeatures,
        primaryCta: { label: "Get Standard", to: "/prices" },
      },
      {
        id: "samsung",
        title: "Samsung SmartTag",
        status: "Coming soon",
        description:
          "Smart tracking integration for Samsung devices for even more peace of mind.",
        image: "/samsungsmarttagrebg.png",
        modalTitle: "Samsung SmartTag",
        modalDescription:
          "A smart tag that works with Samsung devices for tracking and proximity finding.",
        features: samsungTagFeatures,
      },
      {
        id: "apple",
        title: "Apple AirTag",
        status: "Coming soon",
        description:
          "Seamless iOS integration using Apple’s Find My ecosystem for advanced location tracking.",
        image: "/apple-airtag.png",
        modalTitle: "Apple AirTag",
        modalDescription:
          "Apple’s smart tracking tag designed for iOS devices via the Find My app.",
        features: appleTagFeatures,
      },
    ],
    [appleTagFeatures, samsungTagFeatures, standardTagFeatures]
  );

  const activeTag = tags.find((t) => t.id === activeTagId) ?? tags[0];

  const howItWorks = useMemo(
    () => [
      {
        title: "Sign up & add your pet",
        description:
          "Create an account, register your pet, and choose what contact details are shown if scanned.",
        icon: UserPlus,
      },
      {
        title: "We generate the QR code",
        description:
          "Each tag gets a unique QR code linked to your pet profile and recovery contact info.",
        icon: QrCode,
      },
      {
        title: "Engraved & delivered",
        description:
          "We engrave your tag and deliver it to your door or your nearest PUDO locker.",
        icon: Truck,
      },
      {
        title: "Scan → reunite quickly",
        description:
          "Anyone who finds your pet can scan the tag and contact you instantly.",
        icon: ShieldCheck,
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: "What happens when someone scans the QR code?",
        a: "They’ll see the recovery info you choose to share and can contact you to reunite you with your pet.",
      },
      {
        q: "Do I need an app for the tag to work?",
        a: "No. The finder just uses their phone camera to scan the QR code.",
      },
      {
        q: "Can I change my pet details later?",
        a: "Yes — you can update your pet profile anytime in your dashboard.",
      },
      {
        q: "Are GPS tags available?",
        a: "Not yet. We’re building GPS options for Apple/Samsung ecosystems — you can join the notify list to hear first.",
      },
    ],
    []
  );

  const openTagDetails = (tagId) => {
    setActiveTagId(tagId);
    setDetailsOpen(true);
  };

  return (
    <main className="bg-background text-foreground" style={homeThemeVars}>
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#FFD66B]/55 via-[#FFB55C]/40 to-[#FF8E4A]/45" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(27,182,168,0.16),transparent_55%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Found Your Pet</Badge>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  QR Tags
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  GPS coming soon
                </Badge>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                  A modern pet tag that helps them get home faster.
                </h1>
                <p className="max-w-prose text-base text-muted-foreground sm:text-lg">
                  Register your pet, choose what recovery info to share, and get an engraved
                  QR tag delivered. If your pet is found, a scan gives the finder a fast
                  way to contact you.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 shadow-md shadow-primary/15 ring-1 ring-primary/10 hover:shadow-primary/20"
                >
                  <Link to="/dashboard">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/prices">View Pricing</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <a href="#how-it-works">How it works</a>
                </Button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-card">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Instant scan</div>
                    <div className="text-sm text-muted-foreground">No app required</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-card">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Privacy-first</div>
                    <div className="text-sm text-muted-foreground">You control visibility</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-card">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Delivered</div>
                    <div className="text-sm text-muted-foreground">Door or PUDO</div>
                  </div>
                </div>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="link" className="h-auto p-0 text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      What does a scan show?
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[340px]">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Scan preview</div>
                    <p className="text-sm text-muted-foreground">
                      A finder sees the recovery contact details you choose to share, plus
                      your pet’s basic info. You can update it anytime in your dashboard.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-[#1BB6A8]/25 via-[#FFB55C]/15 to-transparent blur-2xl" />
              <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-72 w-72 rounded-full border border-primary/20 bg-[radial-gradient(circle_at_center,rgba(27,182,168,0.18),transparent_65%)]" />
              <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-96 w-96 rounded-full border border-primary/10" />
              <div className="relative overflow-hidden rounded-3xl border bg-card shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent" />
                <img
                  src="/ChatGPT Image Apr 14, 2025, 09_14_41 AM.png"
                  alt="Pet tag preview"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className={cn(
                      "group flex w-full items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:shadow-md hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      activeTagId === tag.id && "border-primary/40 shadow-primary/10"
                    )}
                    aria-pressed={activeTagId === tag.id}
                    onClick={() => openTagDetails(tag.id)}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{tag.title}</div>
                      <div className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block lg:hidden xl:block">
                        {tag.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={tag.status === "Available" ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {tag.status}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/prices">See pricing</Link>
                </Button>
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setNotifySubmitted(false);
                    setNotifyEmail("");
                    setNotifyOpen(true);
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Notify me
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            A simple flow designed for the quickest recovery.
          </p>
        </div>

        <Separator className="my-10" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.title}
                className="group transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10"
              >
                <CardHeader className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background/60 shadow-sm ring-1 ring-primary/10 group-hover:border-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Packages
              </h2>
              <p className="mt-2 text-muted-foreground">
                Start with Standard today, or join the list for GPS smart tags.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/prices">See pricing</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <Card
                key={tag.id}
                className={cn(
                  "group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                  activeTagId === tag.id && "border-primary/40"
                )}
              >
                <div className="relative border-b bg-gradient-to-b from-background to-muted/40">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(27,182,168,0.12),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex h-56 items-center justify-center px-6 py-6">
                    <img
                      src={tag.image}
                      alt={tag.title}
                      className="h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute left-3 top-3">
                    <Badge
                      variant={tag.status === "Available" ? "default" : "secondary"}
                    >
                      {tag.status}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="space-y-2 pb-4">
                  <CardTitle className="text-xl">{tag.title}</CardTitle>
                  <CardDescription>{tag.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-2">
                  {(tag.features ?? []).slice(0, 2).map((f) => (
                    <div key={f.title} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <div className="text-sm">
                        <span className="font-medium">{f.title}:</span>{" "}
                        <span className="text-muted-foreground">{f.description}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="mt-auto flex items-center justify-between gap-3">
                  <Button variant="outline" onClick={() => openTagDetails(tag.id)}>
                    Details
                  </Button>

                  {tag.status === "Available" ? (
                    <Button asChild>
                      <Link to={tag.primaryCta?.to ?? "/prices"}>
                        {tag.primaryCta?.label ?? "Choose"}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setNotifySubmitted(false);
                        setNotifyEmail("");
                        setNotifyOpen(true);
                      }}
                    >
                      Notify me
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Effortless pet tracking
            </h2>
            <p className="text-muted-foreground">
              After you purchase a package, we generate a unique QR code for your pet,
              engrave your tag, and ship it to you. If your pet is found, scanning the
              tag instantly shows your contact information.
            </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="space-y-1">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background/60 shadow-sm ring-1 ring-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Privacy-first</CardTitle>
                <CardDescription>
                  Share only what you choose to share.
                </CardDescription>
                </CardHeader>
              </Card>
            <Card>
              <CardHeader className="space-y-1">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background/60 shadow-sm ring-1 ring-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Always ready</CardTitle>
                <CardDescription>
                  Works even if the finder has no app.
                </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/10 via-transparent to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
              <img
                src="/ChatGPT Image Apr 13, 2025, 03_20_00 PM.png"
                alt="Pet tracking illustration"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">FAQ</h2>
            <p className="mt-3 text-muted-foreground">
              Quick answers about QR tags, privacy, and what’s next.
            </p>
          </div>

          <div className="mt-10 rounded-xl border bg-card px-6">
            <Accordion type="single" collapsible>
              {faqs.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
          <Card className="bg-background">
            <CardContent className="flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-semibold">Ready to protect your pet?</h3>
                <p className="mt-1 text-muted-foreground">
                  Create an account, register your pet, and get your QR tag delivered.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/signup">Sign up</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link to="/contact">Contact</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeTag?.modalTitle}</DialogTitle>
            <DialogDescription>{activeTag?.modalDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {(activeTag?.features ?? []).map((f) => (
              <div key={f.title} className="rounded-md border bg-card p-3">
                <div className="text-sm font-medium">{f.title}</div>
                <div className="text-sm text-muted-foreground">{f.description}</div>
              </div>
            ))}
          </div>

          <DialogFooter>
            {activeTag?.status === "Available" ? (
              <Button asChild>
                <Link to={activeTag?.primaryCta?.to ?? "/prices"}>
                  {activeTag?.primaryCta?.label ?? "View pricing"}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setDetailsOpen(false);
                  setNotifySubmitted(false);
                  setNotifyEmail("");
                  setNotifyOpen(true);
                }}
              >
                Notify me
              </Button>
            )}
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={notifyOpen}
        onOpenChange={(open) => {
          setNotifyOpen(open);
          if (!open) setNotifySubmitted(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get notified</DialogTitle>
            <DialogDescription>
              We’ll email you when GPS-enabled tag options are available.
            </DialogDescription>
          </DialogHeader>

          {notifySubmitted ? (
            <div className="rounded-md border bg-card p-4">
              <div className="text-sm font-medium">You’re on the list.</div>
              <div className="mt-1 text-sm text-muted-foreground">
                We’ll notify <span className="font-medium">{notifyEmail}</span> when
                updates go live.
              </div>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!notifyEmail.trim()) return;
                setNotifySubmitted(true);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="notify-email">Email</Label>
                <Input
                  id="notify-email"
                  type="email"
                  placeholder="you@example.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                You can unsubscribe at any time.
              </div>
              <DialogFooter>
                <Button type="submit" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Notify me
                </Button>
                <Button type="button" variant="outline" onClick={() => setNotifyOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          )}

          {notifySubmitted ? (
            <DialogFooter>
              <Button onClick={() => setNotifyOpen(false)}>Done</Button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Home;
