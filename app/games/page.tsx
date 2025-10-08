import GameSearchResults from "@/app/ui/GameSearchResults";
import SearchInput from "@/app/ui/SearchInput";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Browse Games</h1>
      <div className="flex justify-between items-center border-b py-2">
        <SearchInput placeholder="Search Game" />
        <p>Filters</p>
      </div>
      <GameSearchResults searchParams={searchParams} />
    </>
  );
}
