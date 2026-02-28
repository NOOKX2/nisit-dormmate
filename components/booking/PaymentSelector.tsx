import { QrCode, CreditCard, Upload } from "lucide-react";

interface PaymentProps {
  method: "bank" | "qr";
  setMethod: (method: "bank" | "qr") => void;
}

export const PaymentSelector = ({ method, setMethod }: PaymentProps) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm">
    <h3 className="font-bold mb-4">ช่องทางชำระเงิน</h3>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <PaymentOption 
        active={method === 'qr'} 
        onClick={() => setMethod('qr')}
        icon={<QrCode size={24} />}
        label="QR PromptPay"
      />
      <PaymentOption 
        active={method === 'bank'} 
        onClick={() => setMethod('bank')}
        icon={<CreditCard size={24} />}
        label="โอนผ่านธนาคาร"
      />
    </div>
    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
      <Upload size={20} className="text-gray-400" />
      <span className="text-xs text-gray-500">อัปโหลดหลักฐานการโอนเงิน</span>
    </div>
  </div>
);

const PaymentOption = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${active ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'}`}
  >
    <div className={active ? 'text-emerald-600' : 'text-gray-400'}>{icon}</div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);