import { CreateList } from "@/lib/actions";
import ListForm from "@/components/ListForm";

export default function CreateListPage() {
  return <ListForm title="Create List" action={CreateList} />;
}
