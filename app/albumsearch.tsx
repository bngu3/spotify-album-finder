"use client";

import { useState } from "react";
import Image from 'next/image';

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
const [error, setError] = useState("");

  const searchAlbum = async () => {
    setError("");
    setData(null);
    if (!query.trim()) return;
    const res = await fetch(
      `http://localhost:4000/album?q=${encodeURIComponent(query)}`
    );
    const result = await res.json();
    if (result.error) setError(result.error);
    else setData(result);
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div className="flex gap-2 mb-8">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="rounded p-2 text-black w-64"
          placeholder="Search by album..."
        />
        <button
          onClick={searchAlbum}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      {error && <div className="text-red-400 my-2">{error}</div>}
      {data && (
        <div className="bg-gray-800 p-6 rounded flex flex-col items-center w-full max-w-xl">
         <Image
  src={data.cover}
  alt={data.album}
  width={160} 
  height={160}
  className="w-40 h-40 object-cover rounded mb-3"
  unoptimized
/>


          <div className="font-bold text-xl mb-1">{data.album}</div>
          <div className="text-md text-gray-300 mb-1">
            by <span className="italic">{data.artist}</span> ({data.year})
          </div>
          <div>
            <h2 className="font-semibold mt-4 mb-2">Tracks:</h2>
            <ul className="list-disc list-inside">
              {data.tracks.map((track: string) => (
                <li key={track}>{track}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

       <Image
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDYwZjFheHp6bWhhaDhkcWVzbTVpcWVoOGc4MnUydXV4bHE3aWlrMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7zi5Y6ex0ViRodY5sA/giphy.gif"
        width={120}
        height={120}
        alt="Hello Kitty"
        style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: 1000,
        pointerEvents: "none",
      }}
      unoptimized
/>

    </div>
  );
}


