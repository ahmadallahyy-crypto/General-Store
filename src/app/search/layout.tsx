export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-14 pt-10 text-[#111827] lg:pt-12">
      {children}
    </div>
  );
}
