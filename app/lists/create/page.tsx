import { CreateList } from "@/lib/actions/createList";
import ListForm from "@/components/ListForm";

export default function CreateListPage() {
  return <ListForm title="Create List" action={CreateList} />;
}
