import React, { useMemo, useState } from "react";
import { Eye, Flag, Heart, HelpingHand, MessageCircle, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/timeAgo";
import { fetchComments, flagReport, postComment, toggleReaction } from "@/services/reportsFeed";

function ReportCard({ report, onUpdate }) {
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [working, setWorking] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsHasMore, setCommentsHasMore] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagDetails, setFlagDetails] = useState("");

  const statusLabel = report.petStatus === "found" ? "Found" : "Lost";
  const statusVariant = report.petStatus === "found" ? "secondary" : "default";

  const photo = report.photoUrl || "/android-chrome-192x192.png";
  const timeAgo = useMemo(() => formatTimeAgo(report.createdAt), [report.createdAt]);
  const displayName = report.firstName || "Anonymous";
  const reactions = report.reactions || { like: 0, heart: 0, help: 0, seen: 0, helped: 0 };

  const updateOne = (nextReport) => {
    onUpdate((prev) => prev.map((r) => (r.id === report.id ? { ...r, ...nextReport } : r)));
  };

  const handleReaction = async (reactionType) => {
    setWorking(true);
    try {
      const res = await toggleReaction({ reportId: report.id, reactionType });
      if (!res?.ok) {
        toast.error("Couldn't update reaction.");
        return;
      }

      if (res.report) updateOne(res.report);
      else if (res.data?.reactions || res.data?.myReaction) {
        updateOne({
          reactions: res.data?.reactions ?? report.reactions,
          myReaction: res.data?.myReaction ?? report.myReaction,
        });
      } else {
        toast.success("Reaction updated.");
      }
    } finally {
      setWorking(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setWorking(true);
    try {
      const res = await postComment({
        reportId: report.id,
        name: commentName.trim(),
        text: commentText.trim(),
      });
      if (!res?.ok) {
        toast.error("Couldn't post comment.");
        return;
      }

      if (res.report) updateOne(res.report);
      else if (res.comment) {
        onUpdate((prev) =>
          prev.map((r) => {
            if (r.id !== report.id) return r;
            const nextComments = [...(Array.isArray(r.comments) ? r.comments : []), res.comment];
            return {
              ...r,
              comments: nextComments,
              commentsCount: Number.isFinite(r.commentsCount) ? r.commentsCount + 1 : nextComments.length,
            };
          })
        );
      } else if (res.data?.comment) {
        const nextComment = res.data.comment;
        onUpdate((prev) =>
          prev.map((r) => {
            if (r.id !== report.id) return r;
            const nextComments = [...(Array.isArray(r.comments) ? r.comments : []), nextComment];
            return {
              ...r,
              comments: nextComments,
              commentsCount: Number.isFinite(r.commentsCount) ? r.commentsCount + 1 : nextComments.length,
            };
          })
        );
      }
      setCommentText("");
      toast.success("Comment posted.");
    } finally {
      setWorking(false);
    }
  };

  const handleFlag = async () => {
    if (!flagReason.trim()) {
      toast.error("Please add a reason.");
      return;
    }

    setWorking(true);
    try {
      const res = await flagReport({
        reportId: report.id,
        reason: flagReason.trim(),
        details: flagDetails.trim(),
      });
      if (!res?.ok) {
        toast.error("Couldn't submit report.");
        return;
      }
      toast.success("Thanks — we’ll review it.");
      setFlagOpen(false);
      setFlagReason("");
      setFlagDetails("");
    } finally {
      setWorking(false);
    }
  };

  const comments = Array.isArray(report.comments) ? report.comments : [];
  const commentsCount = Number.isFinite(report.commentsCount) ? report.commentsCount : comments.length;

  const mergeComments = (incoming) => {
    const existing = new Map(comments.map((c) => [String(c.id), c]));
    incoming.forEach((c) => {
      existing.set(String(c.id), c);
    });
    return Array.from(existing.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const handleLoadComments = async ({ next = false } = {}) => {
    setLoadingComments(true);
    try {
      const pageToLoad = next ? commentsPage + 1 : 1;
      const res = await fetchComments({ reportId: report.id, page: pageToLoad, limit: 20 });
      if (!res?.ok) {
        toast.error("Couldn't load comments.");
        return;
      }

      const incoming = Array.isArray(res.items) ? res.items : [];
      const nextComments = next ? mergeComments(incoming) : mergeComments(incoming);

      onUpdate((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? {
                ...r,
                comments: nextComments,
                commentsCount,
              }
            : r
        )
      );

      setCommentsPage(pageToLoad);
      setCommentsHasMore(Boolean(res.nextPage));
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-5">
          <div className="relative md:col-span-2">
            <img
              src={photo}
              alt={`${statusLabel} pet`}
              className="h-56 w-full object-cover md:h-full"
              loading="lazy"
            />
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <Badge variant={statusVariant}>{statusLabel}</Badge>
              {timeAgo ? <Badge variant="outline">{timeAgo}</Badge> : null}
            </div>
          </div>

          <div className="md:col-span-3">
            <CardHeader className="space-y-2">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground">
                  Posted by <span className="font-medium text-foreground">{displayName}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Location:</span>{" "}
                  <span className="text-muted-foreground">{report.location || "—"}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={report.myReaction === "like" ? "default" : "outline"}
                  className="gap-2"
                  disabled={working}
                  onClick={() => handleReaction("like")}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Like
                  <span className={cn("ml-1 text-xs", report.myReaction === "like" && "opacity-90")}>
                    {reactions.like || 0}
                  </span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={report.myReaction === "heart" ? "default" : "outline"}
                  className="gap-2"
                  disabled={working}
                  onClick={() => handleReaction("heart")}
                >
                  <Heart className="h-4 w-4" />
                  Heart
                  <span className={cn("ml-1 text-xs", report.myReaction === "heart" && "opacity-90")}>
                    {reactions.heart || 0}
                  </span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={report.myReaction === "help" ? "default" : "outline"}
                  className="gap-2"
                  disabled={working}
                  onClick={() => handleReaction("help")}
                >
                  <HelpingHand className="h-4 w-4" />
                  Help
                  <span className={cn("ml-1 text-xs", report.myReaction === "help" && "opacity-90")}>
                    {reactions.help || 0}
                  </span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={report.myReaction === "seen" ? "default" : "outline"}
                  className="gap-2"
                  disabled={working}
                  onClick={() => handleReaction("seen")}
                >
                  <Eye className="h-4 w-4" />
                  Seen
                  <span className={cn("ml-1 text-xs", report.myReaction === "seen" && "opacity-90")}>
                    {reactions.seen || 0}
                  </span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={report.myReaction === "helped" ? "default" : "outline"}
                  className="gap-2"
                  disabled={working}
                  onClick={() => handleReaction("helped")}
                >
                  <HelpingHand className="h-4 w-4" />
                  Helped
                  <span className={cn("ml-1 text-xs", report.myReaction === "helped" && "opacity-90")}>
                    {reactions.helped || 0}
                  </span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setFlagOpen(true)}
                >
                  <Flag className="h-4 w-4" />
                  Report
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Comments
                  </div>
                  <div className="text-xs text-muted-foreground">{commentsCount}</div>
                </div>

                {comments.length ? (
                  <div className="max-h-36 space-y-2 overflow-auto rounded-md border bg-muted/20 p-3">
                    {comments.slice(-5).map((c) => (
                      <div key={c.id} className="text-sm">
                        <span className="font-medium">{c.name || "Anonymous"}:</span>{" "}
                        <span className="text-muted-foreground">{c.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {commentsCount > 0 ? "Comments available — load to view." : "No comments yet."}
                  </div>
                )}

                {commentsCount > comments.length ? (
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={loadingComments}
                      onClick={() => handleLoadComments({ next: false })}
                    >
                      {loadingComments ? "Loading…" : "Load comments"}
                    </Button>
                    {commentsHasMore ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={loadingComments}
                        onClick={() => handleLoadComments({ next: true })}
                      >
                        Load more
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                <form className="grid gap-2" onSubmit={handleSubmitComment}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor={`comment-name-${report.id}`}>Name (optional)</Label>
                      <Input
                        id={`comment-name-${report.id}`}
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor={`comment-text-${report.id}`}>Comment</Label>
                      <Input
                        id={`comment-text-${report.id}`}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a helpful comment…"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={working || !commentText.trim()}>
                      Post comment
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {report.description ? "Description included." : "No description."}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setFlagOpen(true)}>
                Report incorrect content
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      <Dialog open={flagOpen} onOpenChange={setFlagOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report incorrect content</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor={`flag-reason-${report.id}`}>Reason</Label>
              <Input
                id={`flag-reason-${report.id}`}
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="e.g. Spam, wrong location, abusive content…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`flag-details-${report.id}`}>Details (optional)</Label>
              <Textarea
                id={`flag-details-${report.id}`}
                value={flagDetails}
                onChange={(e) => setFlagDetails(e.target.value)}
                placeholder="Add any extra context to help moderation."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFlagOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={working} onClick={handleFlag}>
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReportCard;
