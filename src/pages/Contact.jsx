import React, { useState } from "react";
import { Mail, MessageCircle, Phone, Send, ShieldCheck, Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.subject) errors.subject = "Subject is required.";
    if (!formData.message) errors.message = "Message is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setShowModal(true);
  };

  const subjectOptions = [
    { value: "Pet Adoption", label: "Pet Adoption" },
    { value: "Lost Pet", label: "Lost Pet" },
    { value: "General Inquiry", label: "General Inquiry" },
  ];

  // Format phone number for WhatsApp (adapted from PublicPetProfile)
  function formatPhoneNumberForWhatsApp(number) {
    if (!number) return "";
    const digits = number.replace(/\D/g, "");
    if (digits.length === 10 && digits.startsWith("0")) {
      return "27" + digits.slice(1);
    }
    if (digits.length >= 11 && digits.startsWith("27")) {
      return digits;
    }
    return digits;
  }

  // Construct WhatsApp message
  const whatsappMessage = `From: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
  const formattedNumber = formatPhoneNumberForWhatsApp("+27746588885"); // Hardcoded number from original code
  const whatsappLink = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleEmailSend = () => {
    setSending(true);
    const encodedSubject = encodeURIComponent(formData.subject);
    const encodedBody = encodeURIComponent(
      `From: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`
    );
    const mailtoLink = `mailto:danielmommsen2@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoLink;

    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => {
      setSending(false);
      setShowModal(false);
    }, 1000);
  };

  return (
    <main className="relative bg-background px-4 py-12 text-foreground sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(27,182,168,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#FFD66B]/40 via-[#FFB55C]/20 to-[#FF8E4A]/20" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/android-chrome-192x192.png"
                alt="Found Your Pet"
                className="h-12 w-12 rounded-xl border bg-card shadow-sm"
                loading="lazy"
              />
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Contact us
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Questions about tags, orders, or your pet profile? Send a message and we’ll help.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick options</CardTitle>
              <CardDescription>Choose the fastest way to reach us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background/60 ring-1 ring-primary/10">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">WhatsApp</div>
                    <div className="text-sm text-muted-foreground">
                      Best for quick questions and urgent updates.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background/60 ring-1 ring-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">
                      Great for order details and longer messages.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background/60 ring-1 ring-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Privacy</div>
                    <div className="text-sm text-muted-foreground">
                      We only use your details to respond to this message.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              WhatsApp number used: +27 74 658 8885
            </CardFooter>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>
                Fill in the details and choose WhatsApp or Email on the next step.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {submitted ? (
                <div className="rounded-xl border bg-primary/5 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-card shadow-sm ring-1 ring-primary/10">
                      <Send className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Message ready to send</div>
                      <p className="text-sm text-muted-foreground">
                        Thanks for reaching out. If you still need help, you can send another message.
                      </p>
                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSubmitted(false);
                            setFormErrors({});
                          }}
                        >
                          Send another message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                        placeholder="Your name"
                      />
                      {formErrors.name ? (
                        <div className="text-sm text-destructive">{formErrors.name}</div>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        placeholder="you@example.com"
                      />
                      {formErrors.email ? (
                        <div className="text-sm text-destructive">{formErrors.email}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        placeholder="+27 00 000 0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        Subject <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select a subject</option>
                          {subjectOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                          <span className="text-xs">▼</span>
                        </div>
                      </div>
                      {formErrors.subject ? (
                        <div className="text-sm text-destructive">{formErrors.subject}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what you need help with…"
                    />
                    {formErrors.message ? (
                      <div className="text-sm text-destructive">{formErrors.message}</div>
                    ) : null}
                    <div className="text-xs text-muted-foreground">
                      You’ll choose WhatsApp or Email on the next step.
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Button type="submit" size="lg" className="gap-2">
                      Continue <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog
          open={showModal}
          onOpenChange={(open) => {
            setShowModal(open);
            if (!open) setSending(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send message</DialogTitle>
              <DialogDescription>
                Choose how you’d like to send your message.
              </DialogDescription>
            </DialogHeader>

            {sending ? (
              <div className="flex items-center justify-center gap-3 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening application…
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto justify-start gap-3 rounded-xl p-4"
                >
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setSending(true);
                      setSubmitted(true);
                      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                      setTimeout(() => {
                        setSending(false);
                        setShowModal(false);
                      }, 800);
                    }}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background/60 ring-1 ring-primary/10">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-medium">WhatsApp</span>
                      <span className="block text-xs text-muted-foreground">
                        Opens in a new tab
                      </span>
                    </span>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto justify-start gap-3 rounded-xl p-4"
                  onClick={() => {
                    handleEmailSend();
                  }}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background/60 ring-1 ring-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-medium">Email</span>
                    <span className="block text-xs text-muted-foreground">
                      Opens your mail app
                    </span>
                  </span>
                </Button>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

export default Contact;
