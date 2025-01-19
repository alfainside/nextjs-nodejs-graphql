import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { AppDataSource } from "./config/db";
import { createSchema } from "./schema";
import { urgencyScheduler } from "./utils/urgencyScheduler";

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to the database");

    const schema = await createSchema();
    const server = new ApolloServer({ schema });

    server.listen({ port: 4000 }, () =>
      console.log("Server running at http://localhost:4000/graphql")
    );

    setInterval(urgencyScheduler, 60 * 1000);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();
