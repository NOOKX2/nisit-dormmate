interface PriceProps {
  price: number;
  deposit: number;
  serviceFee: number;
}

export const PriceDetails = ({ price, deposit, serviceFee }: PriceProps) => {
  const total = price + deposit + serviceFee;
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="font-bold mb-4">สรุปค่าใช้จ่าย</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">ค่าเช่าเดือนแรก</span>
          <span>฿{price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ค่าประกันความเสียหาย</span>
          <span>฿{deposit.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ค่าส่วนกลาง</span>
          <span>฿{serviceFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t pt-3 text-lg font-bold text-emerald-600">
          <span>ยอดรวมที่ต้องชำระ</span>
          <span>฿{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};