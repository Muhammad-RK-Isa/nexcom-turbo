"use client";

import React from "react";
import { api } from "~/lib/trpc/react";

const ClientPage = () => {
  const { data, isLoading } = api.mirror.useQuery(
    "Mirror is workinggggg in the client!",
  );
  return (
    <div>
      Client
      <p>{isLoading ? "Loading..." : data}</p>
    </div>
  );
};

export default ClientPage;
