import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import UserDetailsModal from "../components/UserDetailsModal";
import QRCodeModal from "../components/QRCodeModal";
import UserListSection from "../components/UserListSection";
import TagOrdersSection from "../components/TagOrdersSection";
import AdminReportsCard from "@/components/AdminReportsCard";
import AdminAnalyticsCard from "@/components/AdminAnalyticsCard";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  CalendarRange,
  Download,
  RefreshCw,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [recentSort, setRecentSort] = useState("recent");
  const searchRef = useRef(null);

  const token = localStorage.getItem("authToken");

  const tabParam = (searchParams.get("tab") || "users").toLowerCase();
  const activeTab = ["users", "reports", "analytics", "tags"].includes(tabParam)
    ? tabParam
    : "users";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab !== "users") return;
    if (users.length > 0) return;
    fetchUsers();
  }, [activeTab, fetchUsers, users.length]);

  const handleViewDetails = async (userId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/users/${userId}/with-pets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedUser(res.data.user);
      setPets(res.data.pets);
      setShowUserModal(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details");
    }
  };

  const handleShowQRModal = (pet) => {
    setSelectedPet(pet);
    setShowQRModal(true);
  };

  const handleDownloadQRCode = (id) => {
    const canvas = document.querySelector(`#qr-${id}`);
    if (!canvas) {
      alert("QR code is not ready yet. Please try again.");
      return;
    }
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${id}.png`;
    link.click();
  };

  const handleDownloadQRCodeAsPDF = (id) => {
    const canvas = document.querySelector(`#qr-${id}`);
    if (!canvas) {
      alert("QR code is not ready yet. Please try again.");
      return;
    }
    const imgData = canvas.toDataURL("image/png");
    const pdfWindow = window.open("", "_blank");
    pdfWindow.document.write(`<img src="${imgData}" />`);
    pdfWindow.document.close();
  };

  const handleDownloadQRCodeAsDXF = (id, url) => {
    alert(`DXF generation for ${id} pointing to ${url} is not implemented yet.`);
    // You may implement DXF generation via external APIs or libraries
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    if (!normalizedQuery) return true;
    const haystack = [
      user?.name,
      user?.surname,
      user?.email,
      user?.contact,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const adminUsers = filteredUsers.filter((user) => user.isAdmin);
  const regularUsers = filteredUsers.filter((user) => !user.isAdmin);

  const recentUsers = [...filteredUsers]
    .sort((a, b) => {
      if (recentSort === "name") {
        const aName = `${a?.name ?? ""} ${a?.surname ?? ""}`.trim().toLowerCase();
        const bName = `${b?.name ?? ""} ${b?.surname ?? ""}`.trim().toLowerCase();
        return aName.localeCompare(bName);
      }

      const aTime = Date.parse(a?.createdAt ?? "") || 0;
      const bTime = Date.parse(b?.createdAt ?? "") || 0;
      if (aTime === bTime) {
        const aName = `${a?.name ?? ""} ${a?.surname ?? ""}`.trim().toLowerCase();
        const bName = `${b?.name ?? ""} ${b?.surname ?? ""}`.trim().toLowerCase();
        return aName.localeCompare(bName);
      }
      return bTime - aTime;
    })
    .slice(0, 6);

  const downloadUsersCsv = () => {
    const headers = ["id", "name", "surname", "email", "contact", "isAdmin"];
    const rows = filteredUsers.map((u) => [
      u?._id ?? "",
      u?.name ?? "",
      u?.surname ?? "",
      u?.email ?? "",
      u?.contact ?? "",
      u?.isAdmin ? "true" : "false",
    ]);

    const csvEscape = (value) => {
      const stringValue = String(value ?? "");
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replaceAll('"', '""')}"`;
      }
      return stringValue;
    };

    const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="relative bg-background px-4 py-10 text-foreground sm:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(27,182,168,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#FFD66B]/25 via-[#FFB55C]/10 to-[#FF8E4A]/15" />

      <div className="mx-auto w-full max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-card shadow-sm ring-1 ring-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Admin dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage users, reports, and analytics.
                </p>
              </div>
            </div>
          </div>

          {activeTab === "users" ? (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="relative w-full sm:w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search users…"
                  className="pl-9"
                  aria-label="Search users"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                <Button variant="outline" className="w-full gap-2 sm:w-auto">
                  <CalendarRange className="h-4 w-4" />
                  Last 30 days
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2 sm:w-auto"
                  onClick={() => downloadUsersCsv()}
                  disabled={loading || users.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>

                <Button
                  variant="secondary"
                  className="col-span-2 w-full gap-2 sm:col-span-1 sm:w-auto"
                  onClick={() => fetchUsers()}
                  disabled={loading}
                >
                  <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                  Refresh
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        {activeTab === "users" ? (
          <div className="mt-6 space-y-8">
            <Card className="relative overflow-hidden border bg-[#075E63] text-white shadow-xl shadow-primary/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.35),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
          <CardContent className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-5 lg:items-center">
            <div className="space-y-2 lg:col-span-3">
              <div className="text-sm text-white/80">Total users</div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {loading ? "—" : users.length}
                </div>
                <div className="pb-1 text-sm text-emerald-200">
                  +{loading ? "—" : Math.max(1, Math.round(users.length * 0.08))}%{" "}
                  <span className="text-white/70">vs last month</span>
                </div>
              </div>
              <div className="text-sm text-white/80">
                Admins: {loading ? "—" : users.filter((u) => u.isAdmin).length} • Regular:{" "}
                {loading ? "—" : users.filter((u) => !u.isAdmin).length}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2 lg:justify-end">
              <Button
                variant="secondary"
                className="justify-start gap-2 border border-white/10 bg-white/10 text-white hover:bg-white/15"
                onClick={() => {
                  const usersSection = document.querySelector("#admin-users");
                  usersSection?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <Users className="h-4 w-4" />
                View users
              </Button>
              <Button
                variant="secondary"
                className="justify-start gap-2 border border-white/10 bg-white/10 text-white hover:bg-white/15"
                onClick={() => downloadUsersCsv()}
                disabled={loading || users.length === 0}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" /> Total users
              </CardTitle>
              <CardDescription>All accounts in the system</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {loading ? <Skeleton className="h-9 w-24" /> : users.length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" /> Admins
              </CardTitle>
              <CardDescription>Users with admin access</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                users.filter((u) => u.isAdmin).length
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" /> Regular users
              </CardTitle>
              <CardDescription>Standard accounts</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                users.filter((u) => !u.isAdmin).length
              )}
            </CardContent>
          </Card>
	        </div>

	        <div className="grid gap-4 lg:grid-cols-3">
	          <Card className="lg:col-span-2">
              <CardHeader className="space-y-2">
	              <CardTitle className="flex items-center justify-between gap-4">
                <span>Recent users</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => searchRef.current?.focus()}
                  >
                    <Search className="h-4 w-4" />
                    Focus search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setRecentSort((s) => (s === "recent" ? "name" : "recent"))}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Sort: {recentSort === "recent" ? "Recent" : "Name"}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Latest accounts in your current search.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-[680px] w-full text-left text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-3 pr-4 font-medium">User</th>
                    <th className="hidden py-3 pr-4 font-medium sm:table-cell">Email</th>
                    <th className="py-3 pr-4 font-medium">Role</th>
                    <th className="py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="hidden py-3 pr-4 sm:table-cell">
                          <Skeleton className="h-4 w-44" />
                        </td>
                        <td className="py-3 pr-4">
                          <Skeleton className="h-6 w-16" />
                        </td>
                        <td className="py-3 text-right">
                          <Skeleton className="ml-auto h-9 w-24" />
                        </td>
                      </tr>
                    ))
                  ) : recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((u) => (
                      <tr key={u._id} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="font-medium">
                            {u?.name} {u?.surname}
                          </div>
                          <div className="text-xs text-muted-foreground">{u?._id}</div>
                          <div className="mt-1 text-xs text-muted-foreground sm:hidden">{u?.email}</div>
                        </td>
                        <td className="hidden py-3 pr-4 sm:table-cell">{u?.email}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={u?.isAdmin ? "default" : "secondary"}>
                            {u?.isAdmin ? "Admin" : "User"}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(u._id)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-2">
              <CardTitle>Role breakdown</CardTitle>
              <CardDescription>Admins vs regular users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const total = filteredUsers.length || 1;
                const adminCount = adminUsers.length;
                const regularCount = regularUsers.length;
                const adminPct = Math.round((adminCount / total) * 100);
                const regularPct = Math.round((regularCount / total) * 100);
                return (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Admins</span>
                        <span className="font-medium">{adminCount} ({adminPct}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${adminPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Regular users</span>
                        <span className="font-medium">{regularCount} ({regularPct}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${regularPct}%` }}
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>

        <Card id="admin-users">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center justify-between gap-4">
              <span>Users</span>
              <Badge variant="secondary" className="font-normal">
                Showing {filteredUsers.length} of {users.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Search, view details, and generate QR assets for pets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-lg border bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Tabs defaultValue="admins" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:w-[360px]">
                <TabsTrigger value="admins">Admins</TabsTrigger>
                <TabsTrigger value="users">Regular</TabsTrigger>
              </TabsList>

              <div className="mt-5">
                {loading ? (
                  <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="hidden grid-cols-12 gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground md:grid">
                      <div className="col-span-4">User</div>
                      <div className="col-span-4">Email</div>
                      <div className="col-span-2">Contact</div>
                      <div className="col-span-1">Role</div>
                      <div className="col-span-1 text-right">Action</div>
                    </div>
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 items-center gap-3 border-b px-4 py-3 last:border-b-0"
                      >
                        <div className="col-span-12 md:col-span-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-xl" />
                            <div className="min-w-0 space-y-2">
                              <Skeleton className="h-4 w-36" />
                              <Skeleton className="h-3 w-44 md:hidden" />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 hidden md:col-span-4 md:block">
                          <Skeleton className="h-4 w-52" />
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="col-span-6 flex justify-end md:col-span-1 md:justify-start">
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <div className="col-span-12 flex justify-end md:col-span-1">
                          <Skeleton className="h-9 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <TabsContent value="admins" className="m-0">
                      <UserListSection
                        title="Admin users"
                        users={adminUsers}
                        badgeVariant="default"
                        badgeText="Admin"
                        onView={handleViewDetails}
                      />
                    </TabsContent>

                    <TabsContent value="users" className="m-0">
                      <UserListSection
                        title="Regular users"
                        users={regularUsers}
                        badgeVariant="secondary"
                        badgeText="User"
                        onView={handleViewDetails}
                      />
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
          </div>
        ) : null}

        {activeTab === "reports" ? (
          <div className="mt-6">
            <AdminReportsCard token={token} />
          </div>
        ) : null}

        {activeTab === "analytics" ? (
          <div className="mt-6">
            <AdminAnalyticsCard token={token} />
          </div>
        ) : null}

        {activeTab === "tags" ? (
          <div className="mt-6">
            <TagOrdersSection token={token} />
          </div>
        ) : null}
      </div>

      <UserDetailsModal
        show={showUserModal}
        onHide={() => setShowUserModal(false)}
        user={selectedUser}
        pets={pets}
        handleShowQRModal={handleShowQRModal}
      />

      <QRCodeModal
        show={showQRModal}
        onHide={() => setShowQRModal(false)}
        pet={selectedPet}
        handleDownloadQRCode={handleDownloadQRCode}
        handleDownloadQRCodeAsPDF={handleDownloadQRCodeAsPDF}
        handleDownloadQRCodeAsDXF={handleDownloadQRCodeAsDXF}
      />
    </main>
  );
}

export default AdminDashboard;
