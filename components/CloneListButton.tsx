"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export default function CloneListButton({ list_id }: { list_id: number }) {
  return (
    <form>
      <input
        type="number"
        name="list_id"
        defaultValue={list_id}
        className="hidden"
      />
      <Button type="submit" variant="outline">
        <Copy /> Clone List
      </Button>
    </form>
  );
}
