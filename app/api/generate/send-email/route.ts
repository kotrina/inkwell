import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userEmail = session.user.email;
  if (!userEmail) return NextResponse.json({ error: "No hay email de usuario" }, { status: 400 });

  const userId = (session.user as { id: string }).id;

  try {
    const { summary, summaryId } = await req.json();
    if (!summary) return NextResponse.json({ error: "Resumen requerido" }, { status: 400 });

    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = summary
      .split("\n")
      .map((line: string) => {
        if (line.startsWith("## ")) return `<h2 style="color:#1e293b;font-size:18px;margin-top:28px;margin-bottom:8px;font-family:Georgia,serif">${line.slice(3)}</h2>`;
        if (line.startsWith("# "))  return `<h1 style="color:#1e293b;font-size:22px;margin-top:32px;margin-bottom:10px;font-family:Georgia,serif">${line.slice(2)}</h1>`;
        if (line.startsWith("- ") || line.startsWith("* ")) return `<li style="margin:5px 0;color:#334155;line-height:1.6">${line.slice(2)}</li>`;
        if (line.startsWith("**") && line.endsWith("**")) return `<strong style="color:#1e293b">${line.slice(2, -2)}</strong>`;
        if (line.trim() === "") return "<br/>";
        return `<p style="margin:8px 0;line-height:1.7;color:#334155">${line}</p>`;
      })
      .join("\n");

    await resend.emails.send({
      from: `Klipwise <${process.env.RESEND_FROM_EMAIL || "noreply@klipwise.app"}>`,
      to: userEmail,
      subject: `Klipwise — Resumen de artículos`,
      html: `
        <div style="background:#f0ebe3;padding:32px 0;font-family:Georgia,serif">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0">
            <div style="background:#f8f7f4;padding:24px 32px;border-bottom:1px solid #e2e8f0">
              <p style="margin:0;font-size:20px;font-weight:bold;color:#6366f1;font-family:Georgia,serif">✒ Klipwise</p>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:13px">Tu resumen editorial</p>
            </div>
            <div style="padding:32px;color:#334155;font-size:15px;line-height:1.7">
              ${htmlContent}
            </div>
            <div style="background:#f8f7f4;padding:16px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">
              Generado con Klipwise ·
              <a href="${process.env.NEXTAUTH_URL}" style="color:#6366f1;text-decoration:none">Abrir app</a>
            </div>
          </div>
        </div>
      `,
    });

    // Marcar el resumen como enviado
    if (summaryId) {
      await prisma.emailSummary.updateMany({
        where: { id: summaryId, userId },
        data: { sentAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al enviar el email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
