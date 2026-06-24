import { permanentRedirect } from "next/navigation";

export default function GuideRedirectPage() {
  permanentRedirect("/guides");
}
