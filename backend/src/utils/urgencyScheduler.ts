import { AppDataSource } from "../config/db";
import { MaintenanceRequest } from "../entities/MaintenanceRequest";

export const urgencyScheduler = async () => {
  const repository = AppDataSource.getRepository(MaintenanceRequest);
  const requests = await repository.find();

  const now = new Date();
  for (const request of requests) {
    if (request.urgency === "Less Urgent" && +now - +new Date(request.createdAt) > 3 * 24 * 60 * 60 * 1000) {
      request.urgency = "Urgent";
    } else if (request.urgency === "Urgent" && +now - +new Date(request.createdAt) > 6 * 60 * 60 * 1000) {
      request.urgency = "Emergency";
    }
  }

  await repository.save(requests);
};
