import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/info/contact-form";
import { getInfoPage, infoPages } from "@/data/info-pages";

export function generateStaticParams() {
  return infoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);
  return page ? { title: page.title, description: page.description } : { title: "Page not found" };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-4 t-caption text-[#6b7280]">
        <Link href="/" className="hover:text-[#087f8c]">Home</Link> <span aria-hidden="true">/</span> <span className="text-[#111827]">{page.title}</span>
      </nav>
      <header className="mb-8 max-w-3xl">
        <h1 className="t-hero t-w-700 tracking-[-0.04em] text-[#111827]">{page.title}</h1>
        <p className="mt-3 t-body text-[#4b5563]">{page.intro}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,70ch)_260px] lg:justify-between">
        <div className="min-w-0 space-y-8">
          {page.slug === "contact" && <ContactForm />}
          {page.sections.map((section) => (
            <section key={section.heading} aria-labelledby={`h-${section.heading}`}>
              <h2 id={`h-${section.heading}`} className="t-title-block t-w-700 text-[#111827]">{section.heading}</h2>
              {section.paragraphs?.map((text) => <p key={text} className="mt-2 break-words t-body leading-7 text-[#374151]">{text}</p>)}
              {section.bullets && (
                <ul className="mt-2 list-disc space-y-1.5 pl-5 t-body leading-7 text-[#374151]">
                  {section.bullets.map((item) => <li key={item} className="break-words">{item}</li>)}
                </ul>
              )}
            </section>
          ))}
          {page.needsLegalReview && <p className="border-t border-[#e5e7eb] pt-4 t-caption text-[#6b7280]">This is sample wording. Have it reviewed by a legal adviser before you launch.</p>}
        </div>

        <aside aria-label="More help" className="h-fit rounded-none border border-[#e5e7eb] bg-white p-5 lg:sticky lg:top-28">
          <h2 className="t-title-section t-w-700 text-[#111827]">More help</h2>
          <ul className="mt-3 space-y-2 t-body">
            {infoPages.filter((p) => p.slug !== page.slug).map((p) => (
              <li key={p.slug}><Link href={`/info/${p.slug}`} className="text-[#087f8c] hover:underline">{p.title}</Link></li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
