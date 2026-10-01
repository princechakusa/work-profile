import Home from "@/components/Home";
import JsonLd from "@/components/JsonLd";
import { PROFILE } from "@/lib/profile";
import { pageMeta, profilePageSchema } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/",
  title: `${PROFILE.name} | ${PROFILE.currentRole}, Hospitality Operations and Software`,
  description: `${PROFILE.name} is a ${PROFILE.short}`,
});

export default function Page() {
  return (
    <>
      <JsonLd blocks={[profilePageSchema]} />
      <Home />
    </>
  );
}
