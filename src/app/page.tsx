"use client"
import { Entrance } from './(pages)'

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col gap-8 items-center justify-center sm:items-start">
        <Entrance />
      </main>
    </div>
  );
}
