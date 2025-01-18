import { DataSource } from "typeorm";
import { MaintenanceRequest } from "../entities/MaintenanceRequest";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "maintenance.db",
  synchronize: true,
  logging: true, // Enable logging
  entities: [MaintenanceRequest],
});
