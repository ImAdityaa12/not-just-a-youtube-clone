"use client";
import React from "react";
import { trpc } from "@/trpc/client";

const PageClient = () => {
  const [data] = trpc.categories.getMany.useSuspenseQuery();
  return <div>Page Client {JSON.stringify(data, null, 2)}</div>;
};

export default PageClient;
