const app = require("./app");
const prismaClient = require("./utilities/prismaClient.utility");

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log("🚀 Server running on port", port);
});

process.on("unhandledRejection", async (reason, promise) => {
  console.group("Unhandled Rejection");
  console.error("reason:", reason);
  console.error("at:", promise);
  console.groupEnd();
  await prismaClient.$disconnect();
  process.exit(1);
});

process.on("uncaughtException", async (error, origin) => {
  console.group("Uncaught Exception");
  console.error("origin:", origin);
  console.error("error:", error);
  console.groupEnd();
  await prismaClient.$disconnect();
  process.exit(1);
});
