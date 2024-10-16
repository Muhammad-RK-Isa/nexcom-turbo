"use client";

import React from "react";
import { TRPCReactProvider } from "~/lib/trpc/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
};

export default Providers;
