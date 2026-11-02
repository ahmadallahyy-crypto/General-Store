import clsx from "clsx";

export function ProductMeta({
  title,
  amount,
  currencyCode = "USD",
}: {
  title: string;
  amount: string;
  currencyCode?: string;
}) {
  return (
    <>
      <h3 className="truncate t-caption t-w-500 text-[#241d1b]">{title}</h3>
      <p className="mt-1 t-caption t-w-500 text-[var(--accent-strong)]">
        ${amount} {currencyCode}
      </p>
    </>
  );
}

export default function Label({
  title,
  amount,
  currencyCode = "USD",
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode?: string;
  position?: "bottom" | "center";
}) {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-3 pb-3",
        {
          "lg:px-16 lg:pb-[30%]": position === "center",
        }
      )}
    >
      <div className="flex max-w-full items-center gap-1 rounded-none border border-[#eadcc9] bg-[#fffaf5]/90 p-1 t-badge t-w-500 text-[#1f1a18] shadow-[0_6px_14px_rgba(34,28,25,0.07)] backdrop-blur-md">
        <div className="mr-auto min-w-0 max-w-[13rem] grow pl-2 leading-tight tracking-tight">
          <h3 className="truncate">{title}</h3>
        </div>
        <div className="flex-none rounded-none bg-[var(--accent-strong)] px-2 py-1 t-badge text-white shadow-sm">
          <p>
            ${amount}
            <span className="ml-1 inline">{currencyCode}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
