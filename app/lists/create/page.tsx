"use client";

import { useActionState } from "react";
import { CreateList } from "@/lib/actions";
import ListForm from "@/components/ListForm";

const initialState = {
  validationErrors: {
    errors: [],
    properties: undefined,
  },
};

export default function CreateListPage() {
  const [state, formAction, pending] = useActionState(CreateList, initialState);

  return <ListForm state={state} formAction={formAction} pending={pending} />;
}
