import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

async function getSpotifyToken(): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Spotify token error");
  const data = await res.json();
  return data.access_token as string;
}

type SpotifyAlbum = {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  release_date: string;
};

type SpotifyTrack = {
  name: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 });
  }

  try {
    const access_token = await getSpotifyToken();

    // Search for albums matching the query
    const albumRes = await fetch(
      `https://api.spotify.com/v1/search?type=album&q=${encodeURIComponent(q)}&limit=1`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    if (!albumRes.ok) throw new Error("Spotify album search error");
    const albumData: {
      albums: { items: SpotifyAlbum[] };
    } = await albumRes.json();

    const album = albumData.albums.items[0];
    if (!album) {
      return NextResponse.json({ error: "Album not found." }, { status: 404 });
    }

    // Get tracks for the album
    const tracksRes = await fetch(
      `https://api.spotify.com/v1/albums/${album.id}/tracks`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    if (!tracksRes.ok) throw new Error("Spotify tracks fetch error");
    const tracksData: {
      items: SpotifyTrack[];
    } = await tracksRes.json();

    return NextResponse.json({
      album: album.name,
      artist: album.artists.map((a) => a.name).join(", "),
      year: album.release_date.split("-")[0],
      cover: album.images[0]?.url || "",
      tracks: tracksData.items.map((t) => t.name),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
