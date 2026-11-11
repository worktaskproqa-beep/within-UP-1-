import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

const STAGES = [
  { t: "تم استلام الطلب", s: "نراجع طلبك حالياً" },
  { t: "قيد التجهيز", s: "نجهّز طلبك بتغليف هدية" },
  { t: "تم الشحن", s: "طلبك في الطريق — راح نتواصل معك" },
];

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json(
      { ok: false, error: "أدخلي رقم الطلب أولاً" },
      { status: 400 }
    );
  }
  const rows = await db.select().from(orders).where(eq(orders.code, code));
  const o = rows[0];
  if (!o) {
    return NextResponse.json(
      { ok: false, error: "ما لقينا طلب بهذا الرقم، تحققِي منه" },
      { status: 404 }
    );
  }
  const hours = (Date.now() - o.createdAt.getTime()) / 36e5;
  const stage = hours < 1 ? 0 : hours < 24 ? 1 : 2;
  const itemCount = Array.isArray(o.items) ? o.items.length : 0;
  return NextResponse.json({
    ok: true,
    code: o.code,
    total: o.total,
    itemCount,
    stage,
    stages: STAGES,
  });
}
