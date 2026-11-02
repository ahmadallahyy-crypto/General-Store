"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { FormField } from "@/components/ui/form-field";
import { usePersistentState } from "@/lib/use-persistent-state";
import { validateMessage } from "@/lib/validation";

type Summary = { rating: number; count: number; breakdown: Record<1 | 2 | 3 | 4 | 5, number> };
type UserReview = { id: string; rating: number; title: string; body: string; author: string };

// Example reviews so the section is never empty in the demo. A back end supplies the real ones.
const SAMPLE_REVIEWS = [
  { title: "Great quality", rating: 5, body: "Well made and looks just like the product listing." },
  { title: "Good value", rating: 4, body: "A good everyday product with a nice finish." },
];

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

/**
 * Rating summary, reviews and a "Write a review" form.
 * Reviews written here are saved on THIS device only (demo). With a back end, `onSubmit` posts to the server and
 * the list comes from it; the form and layout stay as they are.
 */
export function ProductReviews({ handle, summary }: { handle: string; summary?: Summary }) {
  const { user } = useAuth();
  const [saved, setSaved] = usePersistentState<Record<string, UserReview[]>>("generalstore-reviews", {});
  const mine = saved[handle] ?? [];

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [thanks, setThanks] = useState(false);

  const bodyError = attempted ? validateMessage(body) : null;
  const ratingError = attempted && !rating ? "Choose a star rating." : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!rating || validateMessage(body)) return;
    const review: UserReview = { id: Math.random().toString(36).slice(2, 9), rating, title: title.trim(), body: body.trim(), author: user?.name ?? "You" };
    setSaved((prev) => ({ ...prev, [handle]: [review, ...(prev[handle] ?? [])] }));
    setRating(0);
    setTitle("");
    setBody("");
    setAttempted(false);
    setOpen(false);
    setThanks(true);
  };

  const remove = (id: string) => setSaved((prev) => ({ ...prev, [handle]: (prev[handle] ?? []).filter((r) => r.id !== id) }));

  return (
    <>
      {summary && (
        <div className="pd-reviews">
          <div>
            <strong>{summary.rating.toFixed(1)}<small>/5</small></strong>
            <span className="pd-stars" aria-label={`${summary.rating} out of 5`}>{stars(Math.round(summary.rating))}</span>
            <small>{summary.count.toLocaleString("en-US")} ratings</small>
          </div>
          <div>
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <div className="pd-rating-row" key={star}>
                <span>{star}★</span>
                <i><b style={{ width: `${summary.count ? Math.round((summary.breakdown[star] / summary.count) * 100) : 0}%` }} /></i>
                <span>{summary.breakdown[star]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pd-review-actions">
        {!open && <button type="button" className="pd-button pd-secondary pd-inline" onClick={() => { setOpen(true); setThanks(false); }}>Write a review</button>}
        {thanks && <p role="status" className="pd-note-ok">Thanks! Your review is saved on this device. It will show for everyone once reviews are connected.</p>}
      </div>

      {open && (
        <form className="pd-review-form" onSubmit={submit} noValidate>
          <h3>Write a review</h3>
          <div role="radiogroup" aria-label="Your rating" className="pd-star-input">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} className={rating >= n ? "is-on" : ""} onClick={() => setRating(n)}>★</button>
            ))}
          </div>
          {ratingError && <p role="alert" className="pd-error">{ratingError}</p>}
          <FormField id="review-title" label="Headline" required={false} placeholder="Sum it up in a few words" value={title} onChange={setTitle} autoComplete="off" />
          <FormField id="review-body" label="Your review" multiline rows={4} placeholder="What did you like or dislike?" value={body} onChange={setBody} error={bodyError} autoComplete="off" />
          <div className="pd-review-buttons">
            <button type="submit" className="pd-button pd-primary pd-inline">Submit review</button>
            <button type="button" className="pd-button pd-secondary pd-inline" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="pd-review-list">
        {mine.map((r) => (
          <article key={r.id} className="pd-review-card">
            <div className="pd-review-heading"><strong>{r.title || "My review"}</strong><span className="pd-stars" aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span></div>
            <p>{r.body}</p>
            <small>{r.author} · Your review, saved on this device · <button type="button" className="pd-clear" onClick={() => remove(r.id)}>Delete</button></small>
          </article>
        ))}
      </div>

      <p className="pd-review-note">Example reviews shown as demo content while customer reviews are not yet available.</p>
      <div className="pd-review-list">
        {SAMPLE_REVIEWS.map((r) => (
          <article key={r.title} className="pd-review-card">
            <div className="pd-review-heading"><strong>{r.title}</strong><span className="pd-stars" aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span></div>
            <p>{r.body}</p>
            <small>Sample customer · Demo review</small>
          </article>
        ))}
      </div>
    </>
  );
}
