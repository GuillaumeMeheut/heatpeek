import { NextResponse } from "next/server";
import { createServerSupabaseClientWithServiceRole } from "@/lib/supabase/server";
import { corsHeaders } from "@/lib/utils";

// Store verification status in memory (will be cleared on server restart)
interface VerificationData {
  verified: boolean;
  expiresAt: number;
}

const verificationStatus = new Map<string, VerificationData>();

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(
  request: Request,
  { params }: { params: { trackingId: string } }
) {
  try {
    const { trackingId } = await params;
    const supabase = createServerSupabaseClientWithServiceRole();

    const origin = request.headers.get("origin");
    if (!origin) {
      return NextResponse.json(
        { error: "Missing origin header" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const { data: project, error } = await supabase
      .from("projects")
      .select("tracking_id, base_url")
      .eq("tracking_id", trackingId)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: "Invalid tracking ID" },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (origin + "/" !== project.base_url) {
      return NextResponse.json(
        { error: "Invalid origin" },
        { status: 403, headers: corsHeaders() }
      );
    }

    // Store verification status with expiration
    const expiresAt = Date.now() + 30000; // 30 seconds from now
    verificationStatus.set(trackingId, { verified: true, expiresAt });

    return NextResponse.json({ verified: true }, { headers: corsHeaders() });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { trackingId: string } }
) {
  try {
    const { trackingId } = await params;

    const verificationData = verificationStatus.get(trackingId);
    const isVerified =
      (verificationData?.verified && verificationData.expiresAt > Date.now()) ||
      false;

    // Clean up expired entries or incomplete verifications
    if (
      verificationData &&
      (verificationData.expiresAt <= Date.now() || !verificationData.verified)
    ) {
      verificationStatus.delete(trackingId);
    }

    return NextResponse.json({ verified: isVerified });
  } catch (error) {
    console.error("Verification check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
