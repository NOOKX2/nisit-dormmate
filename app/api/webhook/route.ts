import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // ดึงเฉพาะข้อมูล source (ที่มาของข้อความ) มาโชว์
        const source = body.events?.[0]?.source;
        
        console.log("=============================");
        console.log("🟢 จับสัญญาณจาก LINE ได้แล้ว!");
        if (source?.type === "group") {
            console.log("🎯 GROUP ID ของคุณคือ 👉:", source.groupId);
        } else {
            console.log("ประเภทแชท:", source?.type);
            console.log("USER ID:", source?.userId);
        }
        console.log("=============================");

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}