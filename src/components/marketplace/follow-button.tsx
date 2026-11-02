"use client";

import { usePersistentState } from "@/lib/use-persistent-state";

// Follow / unfollow a seller. Front-end only for now: the list of followed
// seller ids is kept in this browser's localStorage (no account or backend yet).
export function FollowButton({ sellerId, sellerName }: { sellerId: string; sellerName: string }) {
  const [followed, setFollowed, isHydrated] = usePersistentState<string[]>("followed-sellers", []);

  // Show "Follow shop" until localStorage has been read, so the server HTML and first client render match.
  const isFollowing = isHydrated && followed.includes(sellerId);

  const toggle = () =>
    setFollowed((current) => (current.includes(sellerId) ? current.filter((id) => id !== sellerId) : [...current, sellerId]));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? `Unfollow ${sellerName}` : `Follow ${sellerName}`}
      className={
        isFollowing
          ? "min-h-11 border border-white bg-white px-5 t-body t-w-700 text-[#0b6e78] hover:bg-[#eaf9fa]"
          : "min-h-11 border border-white/70 bg-white/10 px-5 t-body t-w-700 text-white hover:bg-white/20"
      }
    >
      {isFollowing ? "Following" : "Follow shop"}
    </button>
  );
}
