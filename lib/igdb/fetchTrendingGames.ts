const clientId = process.env.IGDB_CLIENT_ID;
const accessToken = process.env.IGDB_ACCESS_TOKEN;

export async function fetchTrendingGames() {
  if (!clientId || !accessToken) {
    throw new Error("Missing IGDB credentials in environment variables.");
  }

  // Step 1: Unix timestamp of 3 months ago
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  const unixTimestamp = Math.floor(threeMonthsAgo.getTime() / 1000);

  // Step 2: Fetch game details
  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: `
      fields id,name,slug,cover.image_id;
      sort aggregated_rating desc;
      limit 6;
      where first_release_date > ${unixTimestamp};
    `,
  });

  if (!gamesResponse.ok) {
    const errorText = await gamesResponse.text();
    throw new Error(`Failed to fetch recent hits: ${errorText}`);
  }

  const gamesData = await gamesResponse.json();

  return gamesData;
}
