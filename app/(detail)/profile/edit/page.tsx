import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { ChevronLeft, Save, Sparkles, User as UserIcon, GraduationCap } from "lucide-react";
import Link from "next/link";
import { updateUserProfile } from "@/app/action/profile";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

// 🏫 Map รายชื่อคณะ (ปรับแต่งเพิ่ม/ลดได้ตามต้องการ)
const FACULTIES = [
  { id: "eng", name: "วิศวกรรมศาสตร์" },
  { id: "sci", name: "วิทยาศาสตร์" },
  { id: "bus", name: "บริหารธุรกิจ" },
  { id: "econ", name: "เศรษฐศาสตร์" },
  { id: "hum", name: "มนุษยศาสตร์" },
  { id: "edu", name: "ศึกษาศาสตร์" },
  { id: "soc", name: "สังคมศาสตร์" },
  { id: "agri", name: "เกษตร" },
  { id: "fish", name: "ประมง" },
  { id: "forestry", name: "วนศาสตร์" },
  { id: "vet", name: "สัตวแพทยศาสตร์" },
  { id: "archi", name: "สถาปัตยกรรมศาสตร์" },
  { id: "med", name: "แพทยศาสตร์" },
  { id: "nurse", name: "พยาบาลศาสตร์" },
];

export default async function EditProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  let user = null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    user = await prisma.user.findUnique({ where: { id: payload.userId as string } });
  } catch (e) { redirect("/login"); }
  if (!user) return null;

  const updateActionWithId = updateUserProfile.bind(null, user.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="font-bold text-lg text-gray-900">แก้ไขโปรไฟล์</h1>
          <div className="w-10" />
        </div>
      </div>

      <form action={updateActionWithId} className="max-w-md mx-auto p-6 space-y-6">
        {/* Section 1: ข้อมูลทั่วไป */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-bold flex items-center gap-2 text-gray-900 mb-2 text-base">
            <UserIcon size={18} className="text-emerald-600" /> ข้อมูลทั่วไป
          </h2>
          
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
            <input 
              name="name" 
              defaultValue={user.name} 
              className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
              required 
            />
          </div>

          <div className="space-y-4">
            {/* 🟢 คณะ (Dropdown จาก Map) */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">คณะ</label>
              <div className="relative group">
                <select 
                  name="faculty" 
                  defaultValue={user.faculty || ""} 
                  className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none font-medium text-sm text-gray-700"
                >
                  <option value="" disabled>เลือกคณะของคุณ</option>
                  {FACULTIES.map((fac) => (
                    <option key={fac.id} value={fac.name}>
                      {fac.name}
                    </option>
                  ))}
                </select>
                <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={18} />
              </div>
            </div>

            {/* ชั้นปี */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ชั้นปี</label>
              <select 
                name="year" 
                defaultValue={user.year || 1}
                className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none font-medium text-sm text-gray-700"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(y => <option key={y} value={y}>ปี {y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Lifestyle Quiz */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-8">
          <h2 className="font-bold flex items-center gap-2 text-gray-900 text-base">
            <Sparkles size={18} className="text-amber-500" /> Lifestyle ข้อมูลรูมเมท
          </h2>

          {/* Cleanliness Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ระดับความสะอาด</label>
              <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md">ระดับ 1-5</span>
            </div>
            <input 
              type="range" name="cleanliness" min="1" max="5" 
              defaultValue={user.cleanliness || 3}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase px-1">
              <span>ชิลล์ๆ</span>
              <span>ระเบียบจัด</span>
            </div>
          </div>

          {/* Sleep Habit */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">สไตล์การนอน</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {['Early Bird', 'Night Owl'].map((habit) => (
                <label key={habit} className="relative cursor-pointer group">
                  <input 
                    type="radio" name="sleepHabit" value={habit} 
                    defaultChecked={user.sleepHabit === habit}
                    className="peer sr-only" 
                  />
                  <div className="p-4 text-center bg-gray-50 rounded-2xl border-2 border-transparent peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 transition-all font-bold text-xs group-hover:bg-gray-100">
                    {habit === 'Early Bird' ? '☀️ ตื่นเช้า' : '🌙 นอนดึก'}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Smoking */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent focus-within:border-emerald-500 transition-all">
            <span className="font-bold text-xs text-gray-600 uppercase tracking-wider">สูบบุหรี่หรือไม่?</span>
            <select name="smoking" defaultValue={String(user.smoking)} className="bg-transparent font-bold text-emerald-600 text-sm outline-none cursor-pointer">
              <option value="false">ไม่สูบ 🚭</option>
              <option value="true">สูบ 🚬</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white p-5 rounded-[2rem] font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          <Save size={20} />
          บันทึกข้อมูลส่วนตัว
        </button>
      </form>
    </div>
  );
}