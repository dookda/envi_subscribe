import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.upsert({
    where: { lineUserId: "test_line_user_001" },
    update: {
      name: "Test User",
      email: "test@example.com",
    },
    create: {
      lineUserId: "test_line_user_001",
      name: "Test User",
      email: "test@example.com",
    },
  });

  const equipment = await Promise.all([
    prisma.equipmentItem.upsert({
      where: { id: "equip_001" },
      update: {
        equipmentName: "AQI Monitor Alpha",
        model: "AM-100",
        customerName: "BKK Smart City",
        location: "Ratchathewi, Bangkok",
      },
      create: {
        id: "equip_001",
        userId: user.id,
        equipmentName: "AQI Monitor Alpha",
        model: "AM-100",
        customerName: "BKK Smart City",
        location: "Ratchathewi, Bangkok",
      },
    }),
    prisma.equipmentItem.upsert({
      where: { id: "equip_002" },
      update: {
        equipmentName: "PM2.5 Sensor Station",
        model: "PS-500",
        customerName: "Ministry of Environment",
        location: "Chatuchak Park, Bangkok",
      },
      create: {
        id: "equip_002",
        userId: user.id,
        equipmentName: "PM2.5 Sensor Station",
        model: "PS-500",
        customerName: "Ministry of Environment",
        location: "Chatuchak Park, Bangkok",
      },
    }),
  ]);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const existingRecord = await prisma.serviceRecord.findFirst({
    where: {
      equipmentId: equipment[0].id,
      userId: user.id,
      serviceDate: today,
    },
  });

  if (!existingRecord) {
    await prisma.serviceRecord.create({
      data: {
        equipmentId: equipment[0].id,
        userId: user.id,
        serviceDate: today,
        status: "SCHEDULED",
        notes: "Monthly calibration check",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
