"use client"
import { Entrance } from './(pages)'

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8  sm:p-20 bg-slate-500">
      <main className="flex flex-col gap-8 items-center justify-center sm:items-start">
        <Entrance />
      </main>
    </div>
  );
}
