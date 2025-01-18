import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { AppDataSource } from "../config/db";
import { MaintenanceRequest } from "../entities/MaintenanceRequest";
import { MaintenanceRequestService } from "../services/MaintenanceRequestService";

@Resolver()
export class MaintenanceRequestResolver {
  private service = new MaintenanceRequestService();

  @Query(() => [MaintenanceRequest])
  async getAllRequests(): Promise<MaintenanceRequest[]> {
    return await this.service.getAll();
  }

  @Mutation(() => MaintenanceRequest)
  async addRequest(
    @Arg("title") title: string,
    @Arg("urgency") urgency: "Non Urgent" | "Less Urgent" | "Urgent" | "Emergency" | "High" | "Low",
    @Arg("status") status: "Open" | "In Progress" | "Resolved",
    @Arg("description", { nullable: true }) description: string | null
  ): Promise<MaintenanceRequest> {
    if (!description) {
      description = "";
    }
    return await this.service.add({ title, urgency, status, description });
  }

  @Mutation(() => MaintenanceRequest)
  async updateRequestStatus(
    @Arg("id") id: string,
    @Arg("status") status: "Open" | "Resolved"
  ): Promise<MaintenanceRequest> {
    return await this.service.updateStatus(id, status);
  }
}