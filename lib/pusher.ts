import PusherServer from "pusher";
import PusherClient from "pusher-js";

// 📡 ตัวนี้เอาไว้ให้ "หลังบ้าน" (Server Action) ตะโกนบอกว่ามีข้อความใหม่
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// 🎧 ตัวนี้เอาไว้ให้ "หน้าบ้าน" (React Component) แนบหูฟังรอรับข้อความ
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);