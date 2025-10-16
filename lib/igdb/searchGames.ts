const clientId = process.env.IGDB_CLIENT_ID;
const accessToken = process.env.IGDB_ACCESS_TOKEN;

export async function searchGames(
  search?: string,
  genre?: number,
  platform?: number,
  page?: number
) {
  if (!clientId || !accessToken) {
    throw new Error("Missing IGDB credentials in environment variables.");
  }

  let whereClause = "";

  if (genre && platform) {
    whereClause = `where genres = (${genre}) & platforms.platform_family = (${platform});`;
  } else if (genre) {
    whereClause = `where genres = (${genre});`;
  } else if (platform) {
    whereClause = `where platforms.platform_family = (${platform});`;
  }

  const offset = page ? (page - 1) * 36 : 0;

  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: `
      ${search ? `search "${search}";` : "sort rating desc;"}
      fields id,cover.image_id,name,slug;
      ${whereClause}
      limit 36;
      offset ${offset};
    `,
  });

  if (!gamesResponse.ok) {
    const errorText = await gamesResponse.text();
    throw new Error(`Failed to fetch game search results: ${errorText}`);
  }

  const gamesData = await gamesResponse.json();

  return gamesData;
}
