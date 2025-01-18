import { buildSchema } from "type-graphql";
import { MaintenanceRequestResolver } from "./resolvers/MaintenanceRequestResolver";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [MaintenanceRequestResolver],
  });
};
