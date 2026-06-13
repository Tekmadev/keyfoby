import { NextResponse } from "next/server";
import { getIntakeStore } from "@/automation/services/intakeStore";

// API routes are not served from the static export — required for build compatibility
export const dynamic = "force-static";
export function generateStaticParams() { return []; }

function getOwnerToken(): string | undefined {
  const v = process.env.AUTOMATION_OWNER_TOKEN;
  return v && v.trim() ? v.trim() : undefined;
}

function isAuthorizedOwner(req: Request): boolean {
  const token = getOwnerToken();
  if (!token) return false;
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${token}`;
  return auth === expected;
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!getOwnerToken()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Owner API is not configured. Set AUTOMATION_OWNER_TOKEN to enable owner-only endpoints.",
      },
      { status: 501 }
    );
  }

  if (!isAuthorizedOwner(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const found = getIntakeStore().get(id);
  if (!found) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item: found }, { status: 200 });
}

