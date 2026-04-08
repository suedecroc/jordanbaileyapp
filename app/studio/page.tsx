import { isStudioAuthed } from "@/lib/studio/auth";
import { StudioLogin } from "@/components/studio/studio-login";
import { StudioOverview } from "@/components/studio/studio-overview";
import { StudioShell } from "@/components/studio/studio-shell";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const authed = await isStudioAuthed();
  if (!authed) return <StudioLogin />;
  return (
    <StudioShell>
      <StudioOverview />
    </StudioShell>
  );
}
