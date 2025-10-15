import { CreateList } from "@/lib/actions";
import ListForm from "@/components/ListForm";
import { fetchGameListAllGames, fetchGameListInfo } from "@/lib/data";

export default async function EditListPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const list_id = params.id;

  const gameList = await fetchGameListInfo(Number(list_id));
  const gameListGames = await fetchGameListAllGames(Number(list_id));

  return <ListForm action={CreateList} gameList={gameList} />;
}
