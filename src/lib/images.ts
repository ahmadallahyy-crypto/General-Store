// Image address helpers.

/**
 * The same photo, uncropped, for the product page.
 * Card photos are square crops of the picture; here we ask the image server for the whole picture (fit=max).
 * Addresses that are not image-server links are returned unchanged.
 */
export function fullPhoto(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("h");
    u.searchParams.delete("crop");
    u.searchParams.set("fit", "max");
    u.searchParams.set("w", "1200");
    return u.toString();
  } catch {
    return url;
  }
}
