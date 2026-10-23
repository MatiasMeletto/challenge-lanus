import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.movement.deleteMany();
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

  const now = Date.now();
  const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000); 

  const user = await prisma.user.create({
    data: {
      email: "soygranate@clublanus.com",
      password: "GRANATE1@",
      name: "Granate",
      cards: {
        create: [
          {
            issuer: "MASTERCARD",
            balance: 978.85,
            lastFour: "1234",
            expiry: "02/30",
            createdAt: hoursAgo(48),
          },
          {
            issuer: "VISA",
            balance: 450.0,
            lastFour: "9876",
            expiry: "12/28",
            createdAt: hoursAgo(24),
          },
        ],
      },
      movements: {
        create: [
          {
            title: "Adobe",
            description: "Pago de suscripción",
            amount: 125.0,
            type: "SUS",
            createdAt: hoursAgo(1),
          },
          {
            title: "Ronaldo",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
            createdAt: hoursAgo(2),
          },
          {
            title: "Figma",
            description: "Pago de suscripción",
            amount: 125.0,
            type: "SUS",
            createdAt: hoursAgo(3),
          },
          {
            title: "Juan Perez",
            description: "Pago enviado",
            amount: 95.0,
            type: "CASH_OUT",
            createdAt: hoursAgo(4),
          },
          {
            title: "José Suárez",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
            createdAt: hoursAgo(5),
          },
          {
            title: "Juan Rodríguez",
            description: "Pago enviado",
            amount: 95.0,
            type: "CASH_OUT",
            createdAt: hoursAgo(6),
          },
          {
            title: "Julio César",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
            createdAt: hoursAgo(7),
          },
          {
            title: "Mariano Martinez",
            description: "Pago enviado",
            amount: 95.0,
            type: "CASH_OUT",
            createdAt: hoursAgo(8),
          },
          {
            title: "Martin Bozzini",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
            createdAt: hoursAgo(9),
          },
          {
            title: "Juan Cabrera",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
            createdAt: hoursAgo(10),
          },
          {
            title: "Jorge Álvarez",
            description: "Pago enviado",
            amount: 95.0,
            type: "CASH_OUT",
            createdAt: hoursAgo(11),
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });