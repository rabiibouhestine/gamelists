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
  genre?: string,
  platform?: number
) {
  if (!clientId || !accessToken) {
    throw new Error("Missing IGDB credentials in environment variables.");
  }

  let whereClause = "";

  if (genre && platform) {
    whereClause = `where genres.slug = ("${genre}") & platforms.platform_family = (${platform});`;
  } else if (genre) {
    whereClause = `where genres.slug = ("${genre}");`;
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
      ${search ? `search "${search}";` : ""}
      fields id,cover.image_id,name;
      ${whereClause}
      limit 36;
    `,
  });
  console.log(
    `
      ${search ? `search "${search}";` : ""}
      fields id,cover.image_id,name;
      ${whereClause}
      limit 36;
    `
  );
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
