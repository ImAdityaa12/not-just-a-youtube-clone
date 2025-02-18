"use client";
import React from "react";
import { trpc } from "@/trpc/client";

const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "Aditya" });
  return <div>Page Client {data.greeting}</div>;
};

export default PageClient;
