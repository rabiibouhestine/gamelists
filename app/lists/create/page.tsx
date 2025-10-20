import { CreateList } from "@/lib/actions/createList";
import ListForm from "@/components/forms/ListForm";

export default function CreateListPage() {
  return (
    <ListForm cancelLink="/lists" title="Create List" action={CreateList} />
  );
}
