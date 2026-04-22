// Stamp an approved paper PDF with an "APPROVED" mark + date + IRP logo text.
// Uses pdf-lib (Deno-compatible) to overlay a stamp on the first page.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { PDFDocument, rgb, StandardFonts, degrees } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is an admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const paperId: string | undefined = body.paperId;
    if (!paperId) {
      return new Response(JSON.stringify({ error: "paperId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: paper, error: paperErr } = await admin
      .from("papers")
      .select("id, file_path, title")
      .eq("id", paperId)
      .maybeSingle();

    if (paperErr || !paper?.file_path) {
      return new Response(
        JSON.stringify({ error: "Paper or file not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Download original PDF
    const { data: fileBlob, error: dlErr } = await admin.storage
      .from("papers")
      .download(paper.file_path);
    if (dlErr || !fileBlob) {
      return new Response(JSON.stringify({ error: "Download failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pdfBytes = new Uint8Array(await fileBlob.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Stamp first page (top-right corner)
    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();
    const stampW = 200;
    const stampH = 90;
    const x = width - stampW - 30;
    const y = height - stampH - 30;
    const red = rgb(0.78, 0.07, 0.13);

    // Outer double border
    page.drawRectangle({
      x, y, width: stampW, height: stampH,
      borderColor: red, borderWidth: 3,
    });
    page.drawRectangle({
      x: x + 5, y: y + 5, width: stampW - 10, height: stampH - 10,
      borderColor: red, borderWidth: 1,
    });

    // "IRP" logo text
    page.drawText("IRP", {
      x: x + 14, y: y + stampH - 28,
      size: 18, font: helvBold, color: red,
    });
    page.drawText("PUBLICATION", {
      x: x + 14, y: y + stampH - 42,
      size: 7, font: helvBold, color: red,
    });

    // APPROVED text
    page.drawText("APPROVED", {
      x: x + 70, y: y + stampH - 32,
      size: 18, font: helvBold, color: red,
      rotate: degrees(-4),
    });

    // Date
    page.drawText(dateStr, {
      x: x + 70, y: y + 18,
      size: 9, font: helv, color: red,
    });
    page.drawText("Date of Approval", {
      x: x + 70, y: y + 8,
      size: 6, font: helv, color: red,
    });

    const stampedBytes = await pdfDoc.save();

    // Upload stamped version to a new path
    const stampedPath = paper.file_path.replace(/(\.pdf)?$/i, "") +
      `_approved_${Date.now()}.pdf`;

    const { error: upErr } = await admin.storage
      .from("papers")
      .upload(stampedPath, stampedBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (upErr) {
      return new Response(JSON.stringify({ error: upErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update paper to point to stamped version
    const { error: updErr } = await admin
      .from("papers")
      .update({ file_path: stampedPath })
      .eq("id", paperId);

    if (updErr) {
      return new Response(JSON.stringify({ error: updErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, file_path: stampedPath }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
