import { isStudioAuthed } from "@/lib/studio/auth";
import { StudioApp } from "@/components/studio/studio-app";
import { StudioLogin } from "@/components/studio/studio-login";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const authed = await isStudioAuthed();
  return authed ? <StudioApp /> : <StudioLogin />;
}
