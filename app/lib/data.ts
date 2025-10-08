type Popularity = {
  id: number;
  game_id: number;
  popularity_type: number;
  value: number;
};

const clientId = process.env.IGDB_CLIENT_ID;
const accessToken = process.env.IGDB_ACCESS_TOKEN;

export async function fetchTrendingGames() {
  if (!clientId || !accessToken) {
    throw new Error("Missing IGDB credentials in environment variables.");
  }

  // Step 1: Get popular game IDs
  const popularityResponse = await fetch(
    "https://api.igdb.com/v4/popularity_primitives",
    {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "text/plain",
      },
      body: `
      fields game_id, value, popularity_type;
      sort value desc;
      limit 6;
      where popularity_type = 1;
    `,
    }
  );

  if (!popularityResponse.ok) {
    const errorText = await popularityResponse.text();
    throw new Error(`Failed to fetch popularity data: ${errorText}`);
  }

  const popularityData = await popularityResponse.json();
  const gameIds = popularityData.map((item: Popularity) => item.game_id);

  if (gameIds.length === 0) {
    return [];
  }

  // Step 2: Fetch game details
  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: `
      fields id, name, cover.image_id;
      where id = (${gameIds.join(",")});
    `,
  });

  if (!gamesResponse.ok) {
    const errorText = await gamesResponse.text();
    throw new Error(`Failed to fetch game details: ${errorText}`);
  }

  const gamesData = await gamesResponse.json();

  return gamesData;
}

export async function searchGames(search?: string, genre?: string) {
  if (!clientId || !accessToken) {
    throw new Error("Missing IGDB credentials in environment variables.");
  }

  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: `
      ${search ? `search "${search}";` : ""}
      fields id,cover.image_id,name;
      ${genre ? `where genres.slug = ("${genre}");` : ""}
      limit 36;
    `,
  });

  if (!gamesResponse.ok) {
    const errorText = await gamesResponse.text();
    throw new Error(`Failed to fetch game details: ${errorText}`);
  }

  const gamesData = await gamesResponse.json();

  return gamesData;
}

export const gameGenres = [
  {
    value: "",
    label: "All Genres",
  },
  {
    value: "point-and-click",
    label: "Point-and-click",
  },
  {
    value: "fighting",
    label: "Fighting",
  },
  {
    value: "shooter",
    label: "Shooter",
  },
  {
    value: "music",
    label: "Music",
  },
  {
    value: "platform",
    label: "Platform",
  },
  {
    value: "puzzle",
    label: "Puzzle",
  },
  {
    value: "racing",
    label: "Racing",
  },
  {
    value: "real-time-strategy-rts",
    label: "Real Time Strategy (RTS)",
  },
  {
    value: "role-playing-rpg",
    label: "Role-playing (RPG)",
  },
  {
    value: "simulator",
    label: "Simulator",
  },
];
