const clientId = process.env.IGDB_CLIENT_ID;
const accessToken = process.env.IGDB_ACCESS_TOKEN;

export async function GET(req: Request) {
  if (!clientId || !accessToken) {
    throw new Error("Missing IGDB credentials in environment variables.");
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return new Response(JSON.stringify({ error: "Missing search query." }), {
      status: 400,
    });
  }

  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: `
      search "${search}";
      fields id,cover.image_id,name,slug,first_release_date,involved_companies.company.name,involved_companies.developer,platforms.name;
      limit 12;
    `,
  });

  if (!gamesResponse.ok) {
    const errorText = await gamesResponse.text();
    throw new Error(`Failed to fetch game search results: ${errorText}`);
  }

  const gamesData = await gamesResponse.json();

  return new Response(JSON.stringify(gamesData), {
    headers: { "Content-Type": "application/json" },
  });
}
