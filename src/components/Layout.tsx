import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <main className="flex-1 py-4">
        <Outlet />
      </main>
      <footer className="py-4 text-center text-stone-600 text-lg border-t-2 border-stone-200 bg-white/60">
        Recept och veckoplan från Gun-Britt Andersson &amp; Åke Andersson
      </footer>
    </>
  );
}
