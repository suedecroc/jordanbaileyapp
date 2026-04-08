import { isStudioAuthed } from "@/lib/studio/auth";
import { StudioApp } from "@/components/studio/studio-app";
import { StudioLogin } from "@/components/studio/studio-login";
import { StudioShell } from "@/components/studio/studio-shell";

export const dynamic = "force-dynamic";

export default async function StudioMePage() {
  const authed = await isStudioAuthed();
  if (!authed) return <StudioLogin />;
  return (
    <StudioShell>
      <StudioApp account="personal_ig" />
    </StudioShell>
  );
}
