"use client";
import { trpc } from "@/trpc/client";
import React from "react";

const page = () => {
  const greeting = trpc.hello.useQuery({
    text: "world",
  });
  if (!greeting.data) return <div>Loading...</div>;
  return <div>I will show some videos here! {greeting.data?.greeting}</div>;
};

export default page;
