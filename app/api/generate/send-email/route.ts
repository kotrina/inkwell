import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userEmail = session.user.email;
  if (!userEmail) return NextResponse.json({ error: "No hay email de usuario" }, { status: 400 });

  try {
    const { summary } = await req.json();
    if (!summary) return NextResponse.json({ error: "Resumen requerido" }, { status: 400 });

    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = summary
      .split("\n")
      .map((line: string) => {
        if (line.startsWith("## ")) return `<h2 style="color:#e2e8f0;margin-top:24px">${line.slice(3)}</h2>`;
        if (line.startsWith("# ")) return `<h1 style="color:#f8fafc;margin-top:32px">${line.slice(2)}</h1>`;
        if (line.startsWith("- ") || line.startsWith("* ")) return `<li style="margin:4px 0">${line.slice(2)}</li>`;
        if (line.startsWith("**") && line.endsWith("**")) return `<strong>${line.slice(2, -2)}</strong>`;
        if (line.trim() === "") return "<br/>";
        return `<p style="margin:8px 0;line-height:1.6">${line}</p>`;
      })
      .join("\n");

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@inkwell.app",
      to: userEmail,
      subject: `Inkwell — Resumen de artículos`,
      html: `
        <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;background:#1a1a2e;color:#e2e8f0;padding:40px;border-radius:8px">
          <div style="border-bottom:1px solid #334155;padding-bottom:16px;margin-bottom:24px">
            <h1 style="margin:0;font-size:24px;color:#818cf8">✒ Inkwell</h1>
            <p style="margin:4px 0 0;color:#94a3b8;font-size:14px">Tu resumen editorial</p>
          </div>
          ${htmlContent}
          <div style="border-top:1px solid #334155;padding-top:16px;margin-top:32px;font-size:12px;color:#64748b">
            Generado con Inkwell · <a href="${process.env.NEXTAUTH_URL}" style="color:#818cf8">Abrir app</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al enviar el email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
