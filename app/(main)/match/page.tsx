import { getAuthUser } from '@/lib/auth'
import { getPotentialMatches } from '../../action/matching';
import MatchListClient from '@/components/match/MatchListClient';

export default async function MatchPage() {
  // 🟢 Fetch ข้อมูลที่ฝั่ง Server ทันที
  const [matches, currentUser] = await Promise.all([
    getPotentialMatches(),
    getAuthUser(),
  ]);


  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">ค้นหารูมเมทที่ใช่สำหรับคุณ</h1>
        <p className="text-gray-500">เปรียบเทียบไลฟ์สไตล์กับนิสิตที่ทำแบบทดสอบแล้ว</p>
      </header>

      {/* 🔵 ส่งข้อมูลลงไปให้ Client Component จัดการต่อ */}
      <MatchListClient
        initialMatches={matches}
        currentUser={currentUser}
      />
    </div>
  )
}