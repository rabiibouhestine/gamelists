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
    throw new Error(`Failed to fetch trending games: ${errorText}`);
  }

  const gamesData = await gamesResponse.json();

  return gamesData;
}

export async function searchGames(
  search?: string,
  genre?: number,
  platform?: number
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

  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: `
      ${search ? `search "${search}";` : "sort rating desc;"}
      fields id,cover.image_id,name;
      ${whereClause}
      limit 36;
    `,
  });

  if (!gamesResponse.ok) {
    const errorText = await gamesResponse.text();
    throw new Error(`Failed to fetch game search results: ${errorText}`);
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
    value: "2",
    label: "Point-and-click",
  },
  {
    value: "4",
    label: "Fighting",
  },
  {
    value: "5",
    label: "Shooter",
  },
  {
    value: "7",
    label: "Music",
  },
  {
    value: "8",
    label: "Platform",
  },
  {
    value: "9",
    label: "Puzzle",
  },
  {
    value: "10",
    label: "Racing",
  },
  {
    value: "11",
    label: "Real Time Strategy (RTS)",
  },
  {
    value: "12",
    label: "Role-playing (RPG)",
  },
  {
    value: "13",
    label: "Simulator",
  },
  {
    value: "14",
    label: "Sport",
  },
  {
    value: "15",
    label: "Strategy",
  },
  {
    value: "16",
    label: "Turn-based strategy (TBS)",
  },
  {
    value: "24",
    label: "Tactical",
  },
  {
    value: "25",
    label: "Hack and slash/Beat 'em up",
  },
  {
    value: "26",
    label: "Quiz/Trivia",
  },
  {
    value: "30",
    label: "Pinball",
  },
  {
    value: "31",
    label: "Adventure",
  },
  {
    value: "32",
    label: "Indie",
  },
  {
    value: "33",
    label: "Arcade",
  },
  {
    value: "34",
    label: "Visual Novel",
  },
  {
    value: "35",
    label: "Card & Board Game",
  },
  {
    value: "36",
    label: "MOBA",
  },
];

export const platform_families = [
  {
    label: "All Platforms",
    value: "",
  },
  {
    label: "Nintendo",
    value: "5",
  },
  {
    label: "Linux",
    value: "4",
  },
  {
    label: "Xbox",
    value: "2",
  },
  {
    label: "Sega",
    value: "3",
  },
  {
    label: "PlayStation",
    value: "1",
  },
];
