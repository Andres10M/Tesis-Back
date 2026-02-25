import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const username = "cooperativa@sanjuan";
  const password = "pablosari123";

  const exists = await prisma.user.findUnique({
    where: { username },
  });

  if (exists) {
    console.log("✅ Usuario admin ya existe");
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      password: hashed,
      role: "ADMIN",
      enabled: true,
      locked: false,
    },
  });

  console.log("🔥 Usuario ADMIN creado");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
