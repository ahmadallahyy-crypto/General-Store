// The General-Store logo: a blue "G" monogram with a small amber corner, and a two-tone wordmark.
// GENERAL is bold and dark, the hyphen and STORE are blue (STORE in a lighter weight), so the name reads as two
// parts at a glance. One component is used everywhere, so the brand looks the same in the header and footer.
//
//  tone="default"  -> for white backgrounds (the header)
//  tone="onBlue"   -> for the blue footer
//  size="nav" | "footer"
//
// On narrow screens the header shows only the monogram so the wordmark and navigation controls have room.

type Props = { tone?: "default" | "onBlue"; size?: "nav" | "footer" };

export function BrandLogo({ tone = "default", size = "nav" }: Props) {
  const onBlue = tone === "onBlue";
  const nav = size === "nav";

  const mark = nav ? "h-10 w-10 text-[24px]" : "h-10 w-10 text-[24px] sm:h-[56px] sm:w-[56px] sm:text-[34px]";
  const corner = nav ? "h-2.5 w-2.5" : "h-2.5 w-2.5 sm:h-3.5 sm:w-3.5";
  const word = nav ? "text-[22px] tracking-[0.12em]" : "text-[22px] tracking-[0.12em] sm:text-[30px] sm:tracking-[0.14em]";

  return (
    <span className="inline-flex items-center gap-3">
      <span aria-hidden="true" className={`relative flex flex-none items-center justify-center font-bold leading-none ${mark} ${onBlue ? "bg-white text-[#087f8c]" : "bg-[#087f8c] text-white"}`}>
        G
        <span className={`absolute bottom-0 right-0 bg-[#f59e0b] ${corner}`} />
      </span>
      <span className={`${nav ? "nav-brand-wordmark" : "flex"} items-baseline uppercase leading-none`}>
        <span className={`font-bold ${word} ${onBlue ? "text-white" : "text-[#111827]"}`}>General</span>
        <span className={`font-bold ${word} ${onBlue ? "text-[#fde68a]" : "text-[#087f8c]"}`}>-</span>
        <span className={`font-medium ${word} ${onBlue ? "text-white" : "text-[#087f8c]"}`}>Store</span>
      </span>
    </span>
  );
}
