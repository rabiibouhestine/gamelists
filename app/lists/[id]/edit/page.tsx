import { EditList } from "@/lib/actions/editList";
import ListForm from "@/components/ListForm";
import { getGameListGames } from "@/lib/data/getGameListGames";
import { getGameListInfo } from "@/lib/data/getGameListInfo";

export default async function EditListPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const list_id = params.id;

  const gameList = await getGameListInfo(Number(list_id));
  const gameListGames = await getGameListGames(Number(list_id));

  return (
    <ListForm
      title="Edit List"
      cancelLink={`/lists/${list_id}`}
      action={EditList}
      gameList={gameList}
      gameListGames={gameListGames.games}
    />
  );
}
