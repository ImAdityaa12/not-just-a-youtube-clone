"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { PlusIcon } from "lucide-react";
import React from "react";

const StudioUploadModal = () => {
  const create = trpc.videos.create.useMutation();
  return (
    <Button variant={"secondary"}
      onClick={() => create.mutate()}
    >
      <PlusIcon />
      Create
    </Button>
  );
};

export default StudioUploadModal;
