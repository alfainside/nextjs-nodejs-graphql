"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";  // Pastikan ini benar
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import requestStore from "../stores/requestStore";

type FormData = {
  urgency: string;
  status: string;
  title: string;
  description: string;
};

const ADD_MAINTENANCE_REQUEST = gql`
  mutation addRequest(
    $title: String!
    $urgency: String!
    $status: String!
    $description: String!
  ) {
    addRequest(
      title: $title
      urgency: $urgency
      status: $status
      description: $description
    ) {
      id
      title
      status
      urgency
      createdAt
      resolvedAt
    }
  }
`;

const MaintenanceAddPage: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();

  // Use the mutation hook
  const [addRequest, { loading, error }] = useMutation(ADD_MAINTENANCE_REQUEST);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      const { data: responseData } = await addRequest({
        variables: {
          title: data.title,
          urgency: data.urgency,
          status: data.status,
          description: data.description || ""
        },
      });      
      await requestStore.fetchRequests();
      console.log("Maintenance request added:", responseData.addRequest);
      router.push("/");
    } catch (err) {
      console.log("Error adding maintenance request:", err);
    }
  };
  
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <button className="back-btn" onClick={() => router.back()}>
          ←
        </button>
        <h1>Add Maintenance Request</h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Urgency */}
        <div className="form-group">
          <label>Urgency *</label>
          <Controller
            name="urgency"
            control={control}
            defaultValue=""
            rules={{ required: "Urgency is required" }}
            render={({ field }) => (
              <select {...field} className={`form-control ${errors.urgency ? "error" : ""}`}>
                <option value="">Select urgency</option>
                <option value="Emergency">Emergency</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
                <option value="Urgent">Urgent</option>
                <option value="Non Urgent">Non Urgent</option>
                <option value="Less Urgent">Less Urgent</option>
              </select>
            )}
          />
          {errors.urgency && <p className="error-text">{errors.urgency.message}</p>}
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status *</label>
          <Controller
            name="status"
            control={control}
            defaultValue=""
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <select {...field} className={`form-control ${errors.status ? "error" : ""}`}>
                <option value="">Select status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            )}
          />
          {errors.status && <p className="error-text">{errors.status.message}</p>}
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter title"
                className={`form-control ${errors.title ? "error" : ""}`}
              />
            )}
          />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Enter description"
                className="form-control"
              />
            )}
          />
        </div>

        {/* Save Button */}
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>

        {error && <p className="error-text">{error.message}</p>}
      </form>
    </div>
  );
};

export default MaintenanceAddPage;
