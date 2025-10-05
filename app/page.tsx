import { redirect } from "next/navigation";

export default function HomePage() {
  // Rediriger vers la landing page en français
  redirect("/fr/landing");
}