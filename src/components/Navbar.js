import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCircle,
  Users,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/android-chrome-192x192.png";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import EnableNotificationsButton from "@/components/EnableNotificationsButton";
import { fetchPublicReports } from "@/services/reportsFeed";
import {
  ensureReportsLastSeenInitialized,
  getReportsLastSeenAt,
  setReportsLastLatestAt,
  setReportsLastSeenAt,
} from "@/lib/reportSeen";
import { clearLastPushMessage, getLastPushMessage } from "@/lib/pushInbox";

function NavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const [hasReportUpdates, setHasReportUpdates] = useState(false);
  const [latestReportAt, setLatestReportAt] = useState(null);
  const [lastAlert, setLastAlert] = useState(() => getLastPushMessage());

  const isAdmin = user?.isAdmin;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    toast.message("Logged out.");
    navigate("/");
  };

  useEffect(() => {
    ensureReportsLastSeenInitialized();

    let active = true;

    const check = async () => {
      const res = await fetchPublicReports({ page: 1, limit: 1 });
      if (!active) return;
      if (!res?.ok) return;

      const latest = res.items?.[0]?.createdAt ? String(res.items[0].createdAt) : null;
      setLatestReportAt(latest);
      if (latest) setReportsLastLatestAt(latest);

      const lastSeen = getReportsLastSeenAt();
      if (!latest || !lastSeen) {
        setHasReportUpdates(false);
        return;
      }

      const hasNew = new Date(latest).getTime() > new Date(lastSeen).getTime();
      setHasReportUpdates(hasNew && !location.pathname.startsWith("/reports"));
    };

    check();

    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [location.pathname]);

  useEffect(() => {
    const sync = () => setLastAlert(getLastPushMessage());
    window.addEventListener("storage", sync);
    window.addEventListener("pushMessageReceived", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("pushMessageReceived", sync);
    };
  }, []);

  const dashboardHref = isAdmin ? "/admin-dashboard?tab=users" : "/dashboard";

  const adminNav = [
    { label: "Users", href: "/admin-dashboard?tab=users", icon: Users },
    { label: "Reports", href: "/admin-dashboard?tab=reports", icon: FileText },
    { label: "Analytics", href: "/admin-dashboard?tab=analytics", icon: BarChart3 },
    { label: "Tags", href: "/admin-dashboard?tab=tags", icon: LayoutDashboard },
  ];

  const primaryNav = [
    { label: "Home", href: "/" },
    { label: "Reports", href: "/reports" },
    { label: "Prices", href: "/prices" },
    { label: "Features", href: "/features" },
    { label: "Contact", href: "/contact" },
  ];

  const navItems = isAdmin ? adminNav : primaryNav;

  const isActive = (href) =>
    href.includes("?")
      ? `${location.pathname}${location.search}`.toLowerCase() === href.toLowerCase()
      : location.pathname.toLowerCase() === href.toLowerCase();

  const navButtonClassName = (href) =>
    cn(
      "h-9 rounded-full px-4 no-underline",
      isActive(href)
        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <header className="relative sticky top-0 z-50 border-b bg-background/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-2 py-1 no-underline transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <img
            src={logo}
            alt="Found Your Pet Logo"
            width="40"
            height="40"
            className="h-9 w-9 rounded-md"
          />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Found Your Pet
          </span>
        </Link>

        <nav className="hidden items-center md:flex" aria-label="Primary">
          <div className="flex items-center rounded-full border bg-muted/30 p-1 shadow-sm">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="sm"
                className={navButtonClassName(item.href)}
              >
                <Link
                  to={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </Button>
            ))}

            {!isLoggedIn ? (
              <>
                <span className="ml-8 mr-3 select-none text-muted-foreground">|</span>
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-full bg-secondary/80 px-4 text-secondary-foreground no-underline shadow-sm hover:bg-secondary"
                  >
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="h-9 rounded-full px-4 no-underline shadow-sm"
                  >
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full border bg-background/50 shadow-sm hover:bg-accent"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {hasReportUpdates ? (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Updates</div>
                <div className="text-sm text-muted-foreground">
                  {hasReportUpdates ? "New reports since your last visit." : "No new reports right now."}
                </div>
                {lastAlert?.title ? (
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="text-sm font-medium">{lastAlert.title}</div>
                    {lastAlert.body ? (
                      <div className="mt-1 text-sm text-muted-foreground">{lastAlert.body}</div>
                    ) : null}
                    <div className="mt-2">
                      <Button
                        type="button"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setReportsLastSeenAt(latestReportAt || new Date().toISOString());
                          setHasReportUpdates(false);
                          clearLastPushMessage();
                          navigate(lastAlert.url || "/reports");
                        }}
                      >
                        Open reports
                      </Button>
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm">
                    <Link to="/reports">View reports</Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReportsLastSeenAt(latestReportAt || new Date().toISOString());
                      setHasReportUpdates(false);
                      clearLastPushMessage();
                      toast.message("Marked as read.");
                    }}
                  >
                    Mark as read
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Notifications</div>
                  <EnableNotificationsButton className="w-full justify-center" />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {isLoggedIn ? (
            <>
              {!isAdmin ? (
                <>
                  <div className="mx-1 hidden h-6 w-px bg-border md:block" />
                  <Button asChild variant="secondary" size="sm" className="gap-2 no-underline">
                    <Link to={dashboardHref}>
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                </>
              ) : null}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border bg-background/50 shadow-sm hover:bg-accent"
                    aria-label="Account"
                  >
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2">
                  <div className="flex items-start justify-between gap-2 px-2 py-1.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {user?.name || "Account"}
                      </div>
                      {user?.email ? (
                        <div className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      ) : null}
                    </div>
                    {isAdmin ? <Badge variant="secondary">Admin</Badge> : null}
                  </div>
                  <Separator className="my-1" />
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start gap-2 no-underline"
                  >
                    <Link to="/profile">
                      <UserCircle className="h-5 w-5" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {hasReportUpdates ? (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Updates</div>
                <div className="text-sm text-muted-foreground">
                  {hasReportUpdates ? "New reports since your last visit." : "No new reports right now."}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm">
                    <Link to="/reports">View reports</Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReportsLastSeenAt(latestReportAt || new Date().toISOString());
                      setHasReportUpdates(false);
                      clearLastPushMessage();
                      toast.message("Marked as read.");
                    }}
                  >
                    Mark as read
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Notifications</div>
                  <EnableNotificationsButton className="w-full justify-center" />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img
                    src={logo}
                    alt="Found Your Pet Logo"
                    width="32"
                    height="32"
                    className="h-8 w-8 rounded-md"
                  />
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        "h-10 w-full justify-start no-underline",
                        isActive(item.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Link to={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                        {item.label}
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </div>

              <Separator className="my-6" />

              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  {!isAdmin ? (
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="secondary"
                        className="justify-start gap-2 no-underline"
                      >
                        <Link to={dashboardHref}>
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                    </SheetClose>
                  ) : null}

                  <SheetClose asChild>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start gap-2 no-underline"
                    >
                      <Link to="/profile">
                        <UserCircle className="h-5 w-5" />
                        Profile
                      </Link>
                    </Button>
                  </SheetClose>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button
                      asChild
                      variant="secondary"
                      className="justify-start gap-2 no-underline"
                    >
                      <Link to="/login">Log in</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild className="justify-start gap-2 no-underline">
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </SheetClose>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default NavigationBar;
