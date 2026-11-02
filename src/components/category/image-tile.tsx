import Image from "@/components/ui/safe-image";
import Link from "next/link";

export function ImageTile({ href, title, image }: { href: string; title: string; image: string }) {
  return (
    <Link href={href} className="group relative block aspect-[4/3] w-full overflow-hidden border-b border-r border-[#e5e7eb] bg-[#1f2937]">
      <Image src={image} alt="" fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 17vw" className="object-cover object-center transition-transform duration-300 group-hover:scale-105" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden="true" />
      <span className="absolute inset-x-0 bottom-0 p-3 t-body t-w-700 text-white">{title}</span>
    </Link>
  );
}
