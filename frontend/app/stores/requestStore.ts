import { makeAutoObservable } from "mobx";
import client from "../lib/apolloClient";
import { gql } from "@apollo/client";
import { runInAction } from "mobx";

export interface MaintenanceRequest {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Resolved";
  urgency: "Non Urgent" | "Less Urgent" | "Urgent" | "Emergency" | "High" | "Low";
  createdAt: string;
  description: string;
  resolvedAt?: string;
}

class RequestStore {
  requests: MaintenanceRequest[] = [];
  openRequestsCount = 0;
  urgentRequestsCount = 0;
  averageResolutionTime = 0;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch all requests
  async fetchRequests() {
    const { data } = await client.query({
      query: gql`
        query GetRequests {
          getAllRequests {
            id
            title
            status
            urgency
            description
            createdAt
            resolvedAt
          }
        }
      `,
    });

    this.setRequests(data.getAllRequests);
  }

  // Add a new maintenance request
  async addRequest(
    title: string,
    urgency: "Non Urgent" | "Less Urgent" | "Urgent" | "Emergency" | "High" | "Low",
    status: "Open" | "In Progress" | "Resolved",
    description: string) 
    {
    const { data } = await client.mutate({
      mutation: gql`
        mutation AddRequest($title: String!, $urgency: String!, $status: String!, $description: String!) {
          addRequest(title: $title, urgency: $urgency, status: $status, description: $description) {
            id
            title
            status
            urgency
            description
            createdAt
            resolvedAt
          }
        }
      `,
      variables: {
        title,
        urgency,
        status,
        description,
      },
    });

    this.requests.push(data.addRequest);
    this.updateMetrics();
  }

  resolveRequest = async (id: string) => { 
    const request = this.requests.find((req) => req.id === id);
    if (request && request.status !== "Resolved") {
      request.status = "Resolved";
      request.resolvedAt = new Date().toISOString();
      try {
        const { data } = await client.mutate({
          mutation: gql`
            mutation UpdateRequestStatus($id: String!, $status: String!) {
              updateRequestStatus(id: $id, status: $status) {
                id
                status
                resolvedAt
              }
            }
          `,
          variables: {
            id,
            status: "Resolved",
          },
        });

        runInAction(() => {
          this.updateMetrics();
          console.log("Request resolved:", data.updateRequestStatus);
        });
      } catch (error) {
        console.error("Error updating request status:", error);
        runInAction(() => {
          request.status = "Open";
        });
      }
    }
  };

  // Resolve a request (change status to 'Resolved')
  /* resolveRequest = (id: string) => {
    const request = this.requests.find((req) => req.id === id);
    if (request && request.status !== "Resolved") {
      request.status = "Resolved";
      request.resolvedAt = new Date().toISOString();
      this.updateMetrics();
    }
  } */

  // Set requests and update metrics
  setRequests = (requests: MaintenanceRequest[]) => {
    this.requests = requests;
    this.updateMetrics();
  }

  // Update the metrics
  updateMetrics = () => {
    const resolvedRequests = this.requests.filter((req) => req.status === "Resolved");
    const openRequests = this.requests.filter((req) => req.status === "Open");
    const urgentRequests = this.requests.filter((req) =>
      ["Urgent", "Emergency", "High"].includes(req.urgency)
    );
    
    this.openRequestsCount = openRequests.length;
    this.urgentRequestsCount = urgentRequests.length;
    this.averageResolutionTime =
      resolvedRequests.length > 0
        ? resolvedRequests.reduce((sum, req) => {
            const createdAt = new Date(req.createdAt).getTime();
            const resolvedAt = new Date(req.resolvedAt!).getTime();
            const timeToResolve = resolvedAt - createdAt;
            console.log('Time to resolve (miliseconds):', timeToResolve);
            return sum + timeToResolve;
          }, 0) / resolvedRequests.length
        : 0;
  
    this.averageResolutionTime = this.averageResolutionTime / (1000 * 60 * 60 * 24);
    console.log('Average Resolution Time (in days):', this.averageResolutionTime);
  };
}

const requestStore = new RequestStore();
export default requestStore;
