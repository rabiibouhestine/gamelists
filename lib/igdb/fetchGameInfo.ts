import { redirect } from "next/navigation";

const clientId = process.env.IGDB_CLIENT_ID;
const accessToken = process.env.IGDB_ACCESS_TOKEN;

export async function fetchGameInfo(slug: string) {
  if (!clientId || !accessToken) {
    throw new Error("Missing IGDB credentials in environment variables.");
  }

  const gameResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: `
      fields id,cover.image_id,name,first_release_date,involved_companies.company.name,involved_companies.developer,summary,genres.name,platforms.name,url;
      where slug="${slug}";
    `,
  });

  if (!gameResponse.ok) {
    const errorText = await gameResponse.text();
    console.log("error fetching game info from igdb: ", errorText);
    redirect("/error");
  }

  const gameData = await gameResponse.json();

  if (gameData.length) {
    return gameData[0];
  } else {
    console.log("wrong game slug while fetching game info from igdb");
    redirect("/error");
  }
}
