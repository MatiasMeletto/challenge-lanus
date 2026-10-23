import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.movement.deleteMany();
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "soygranate@clublanus.com",
      password: "GRANATE1@", 
      name: "Usuario Granate",
      cards: {
        create: [
          {
            issuer: "MASTERCARD",
            balance: 978.85,
            lastFour: "1234",
            expiry: "02/30",
          },
          {
            issuer: "VISA",
            balance: 450.00,
            lastFour: "9876",
            expiry: "12/28",
          }
        ]
      },
      movements: {
        create: [
          {
            title: "Adobe",
            description: "Pago de suscripción",
            amount: 125.0,
            type: "SUS",
          },
          {
            title: "José Suárez",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
          },
          {
            title: "Figma",
            description: "Pago de suscripción",
            amount: 125.0,
            type: "SUS",
          },
          {
            title: "Juan Rodríguez",
            description: "Pago enviado",
            amount: 95.0,
            type: "CASH_OUT",
          },
          {
            title: "Julio César",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
          },
          {
            title: "Mariano Martinez",
            description: "Pago enviado",
            amount: 95.0,
            type: "CASH_OUT",
          },
          {
            title: "Martin Bozzini",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
          },
          {
            title: "Juan Cabrera",
            description: "Pago recibido",
            amount: 95.0,
            type: "CASH_IN",
          },
          {
            title: "Jorge Álvarez",
            description: "Pago enviado",
            amount: 95.0,
            type: "CASH_OUT",
          }
        ]
      }
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