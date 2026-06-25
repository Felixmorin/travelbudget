import { normalizeLeadCapturePayload, saveLeadCapture } from "@/lib/leads/lead-capture";

export async function POST(request: Request) {
  try {
    const payload = normalizeLeadCapturePayload(await request.json());
    const lead = await saveLeadCapture(payload);

    return Response.json({
      ok: true,
      leadId: lead.id,
      timestamp: lead.timestamp,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save this email request.";
    const status = message.includes("valid") || message.includes("Invalid") || message.includes("Choose") ? 400 : 500;

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status }
    );
  }
}
