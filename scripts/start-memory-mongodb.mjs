import { MongoMemoryServer } from "mongodb-memory-server";

const server = await MongoMemoryServer.create({
  instance: {
    port: 27017,
    dbName: "nextjs_assignment",
  },
});

console.log("Development MongoDB is ready at mongodb://127.0.0.1:27017");

async function stopServer() {
  await server.stop();
  process.exit(0);
}

process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);
await new Promise(() => {});
