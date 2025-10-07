"use client";

import React, { useState } from "react";
import Image from "next/image";

type AlbumData = {
  album: string;
  artist: string;
  year: string;
  cover: string;
  tracks: string[];
};

export default function AlbumSearch() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAlbum = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/album?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch (e) {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("An unexpected error occurred.");
  }
} finally {
  setLoading(false);
}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") searchAlbum();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col items-center py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 tracking-tight">
          Spotify Album Finder
        </h1>
        <div className="flex gap-2 mb-8 w-full max-w-md">
          <label htmlFor="album-search" className="sr-only">
            Album Search
          </label>
          <input
            id="album-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-lg px-4 py-2 text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="Search by album…"
            autoComplete="off"
          />
          <button
            onClick={searchAlbum}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition disabled:bg-green-300"
            disabled={loading || !query.trim()}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-5 py-3 rounded shadow w-full max-w-md mb-6 text-center">
            {error}
          </div>
        )}

        {data && !error && (
          <div className="bg-white shadow-xl rounded-xl p-8 flex flex-col items-center w-full max-w-xl mx-auto mt-4 border border-gray-200">
            {/* Album Cover */}
            {data.cover && (
              <Image
                src={data.cover}
                alt={data.album}
                width={180}
                height={180}
                className="rounded shadow mb-5"
                style={{ objectFit: "cover" }}
                priority
              />
            )}

            {/* Album Info */}
            <h2 className="font-extrabold text-2xl text-gray-900 mb-1 text-center">{data.album}</h2>
            <p className="text-base text-gray-700 mb-1 text-center">{data.artist}</p>
            <p className="text-sm text-gray-400 mb-4">{data.year}</p>

            {/* Tracks List */}
            {Array.isArray(data.tracks) && (
              <>
                <h3 className="font-semibold text-lg mt-2 mb-2 text-gray-800">Tracks</h3>
                <ol className="list-decimal list-inside text-gray-700 w-full pl-3">
                  {data.tracks.map((track, idx) => (
                    <li key={track + idx} className="py-0.5">{track}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="text-gray-400 text-xs py-4 text-center opacity-70 mt-auto w-full">
        Made using Spotify API & Next.js
      </footer>
    </main>
  );
}
