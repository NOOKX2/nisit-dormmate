/**
 * One-off / maintenance: ซิงก์ Room.isAvailable กับความจริง
 * isAvailable = (จำนวน Booking SUCCESS ของห้องนั้น < room.capacity)
 *
 * รัน: bun run db:sync:room-availability
 */
import { prisma } from "../lib/db";

async function main() {
  const rooms = await prisma.room.findMany({
    select: { id: true, capacity: true, isAvailable: true, name: true },
  });

  let updated = 0;
  for (const room of rooms) {
    const occupied = await prisma.booking.count({
      where: { roomId: room.id, status: "SUCCESS" },
    });
    const cap = Math.max(1, room.capacity);
    const shouldBeAvailable = occupied < cap;

    if (room.isAvailable !== shouldBeAvailable) {
      await prisma.room.update({
        where: { id: room.id },
        data: { isAvailable: shouldBeAvailable },
      });
      updated++;
      console.log(
        `[update] ${room.name ?? room.id}: isAvailable ${room.isAvailable} -> ${shouldBeAvailable} | occupied=${occupied}/${cap}`,
      );
    }
  }

  console.log(`\nDone. Corrected ${updated} room(s). Total rooms: ${rooms.length}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
