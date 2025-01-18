"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import requestStore from "./stores/requestStore";
import Metrics from "./components/Metrics";
import RequestList from "./components/RequestList";

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    requestStore.fetchRequests();
  }, []);

  return (
    <div className="container">
      <h1>Maintenance Request</h1>
      <Metrics />
      <RequestList />
      <button
        className="add-btn"
        onClick={() => router.push("/maintener")}
      >
        +
      </button>
    </div>
  );
};

export default HomePage;
