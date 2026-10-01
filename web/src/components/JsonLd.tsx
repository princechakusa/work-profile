import { jsonLd } from "@/lib/seo";

/** Structured data rendered into the static HTML, so crawlers read it without running any script. */
export default function JsonLd({ blocks }: { blocks: object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(...blocks) }} />;
}
