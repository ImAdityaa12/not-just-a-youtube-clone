import { HydrateClient, trpc } from "@/trpc/server";
import React, { Suspense } from "react";
import PageClient from "./client";
import { ErrorBoundary } from "react-error-boundary";

const page = async () => {
  void trpc.hello.prefetch({
    text: "Aditya",
  });
  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default page;
