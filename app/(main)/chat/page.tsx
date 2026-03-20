import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { ChatClient } from "@/app/(main)/chat/_components/ChatClient";
import { getChatContacts } from "@/app/action/chat";


export default async function ChatPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  // ดึงรายชื่อคนที่เราเคยคุยด้วย
  const contacts = await getChatContacts(user.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* โยนข้อมูลไปให้ Client วาดหน้าจอ */}
      <ChatClient currentUserId={user.id} initialContacts={contacts} />
    </div>
  );
}