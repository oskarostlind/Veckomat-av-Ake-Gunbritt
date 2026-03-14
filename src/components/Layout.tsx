import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        Recept och veckoplan från Gun-Britt Andersson &amp; Åke Andersson
      </footer>
    </>
  );
}
