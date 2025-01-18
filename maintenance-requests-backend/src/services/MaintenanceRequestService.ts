import { AppDataSource } from "../config/db";
import { MaintenanceRequest } from "../entities/MaintenanceRequest";

export class MaintenanceRequestService {
  private repository = AppDataSource.getRepository(MaintenanceRequest);

  async getAll(): Promise<MaintenanceRequest[]> {
    return await this.repository.find();
  }

  async add(data: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    const request = this.repository.create(data);
    return await this.repository.save(request);
  }

  async updateStatus(id: string, status: "Open" | "Resolved"): Promise<MaintenanceRequest> {
    const request = await this.repository.findOneBy({ id });
    if (!request) throw new Error("Request not found");
    request.status = status;
    request.resolvedAt = status === "Resolved" ? new Date() : null;
    return await this.repository.save(request);
  }
}
