import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { pageLabels } from "./components/SiteParts";
import type { BookingPrefill, PageName, SharedPageProps } from "./pages/types";

const HomePage = lazy(() => import("./pages/HomePage"));
const DestinationsPage = lazy(() => import("./pages/DestinationsPage"));
const ToursPage = lazy(() => import("./pages/ToursPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const navPages: PageName[] = ["home", "destinations", "tours", "about", "contact"];
const allPages: PageName[] = [...navPages, "booking"];

function pageFromHash(): PageName {
  const hash = window.location.hash.slice(1) as PageName;
  return allPages.includes(hash) ? hash : "home";
}

function Navbar({
  currentPage,
  navigate,
}: {
  currentPage: PageName;
  navigate: (page: PageName) => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (open && navRef.current && !navRef.current.contains(event.target as Node)) setOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const go = (page: PageName) => {
    setOpen(false);
    navigate(page);
  };

  return (
    <header className={`global-nav ${scrolled || currentPage !== "home" ? "solid" : ""}`}>
      <nav ref={navRef} className="nav-pill" aria-label="Navigation principale">
        <button className="brand-button" type="button" onClick={() => go("home")} aria-label="Tour — Accueil">TOUR</button>
        <div className="desktop-links">
          {navPages.map((page) => (
            <button
              key={page}
              type="button"
              className={currentPage === page ? "active" : ""}
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => go(page)}
            >
              {pageLabels[page]}
            </button>
          ))}
        </div>
        <button className="book-nav" type="button" onClick={() => go("booking")}>Réserver</button>
        <button
          className={`hamburger ${open ? "open" : ""}`}
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <i /><i /><i />
        </button>
        <div id="mobile-navigation" className={`mobile-panel ${open ? "open" : ""}`}>
          {navPages.map((page) => (
            <button
              key={page}
              type="button"
              className={currentPage === page ? "active" : ""}
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => go(page)}
            >
              {pageLabels[page]}
            </button>
          ))}
          <button className="mobile-book" type="button" onClick={() => go("booking")}>Réserver maintenant</button>
        </div>
      </nav>
    </header>
  );
}

function Footer({ navigate }: { navigate: (page: PageName) => void }) {
  return (
    <footer className="global-footer">
      <div className="footer-main">
        <div><button type="button" onClick={() => navigate("home")}>TOUR</button><p>Des voyages mémorables, pensés avec attention.</p></div>
        <nav aria-label="Navigation de pied de page">{navPages.map((page) => <button type="button" key={page} onClick={() => navigate(page)}>{pageLabels[page]}</button>)}</nav>
        <button className="footer-book" type="button" onClick={() => navigate("booking")}>Planifier mon voyage</button>
      </div>
      <div className="footer-bottom"><span>© 2026 Tour. Tous droits réservés.</span><span>Prix et disponibilités de démonstration.</span></div>
    </footer>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>(pageFromHash);
  const [prefill, setPrefill] = useState<BookingPrefill>({ destination: "", tourType: "" });
  const [bookingKey, setBookingKey] = useState(0);

  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, "", "#home");
    const onHashChange = () => setCurrentPage(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const navigate = (page: PageName) => {
    if (window.location.hash !== `#${page}`) window.location.hash = page;
    else {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const book: SharedPageProps["book"] = (values = {}) => {
    setPrefill((current) => ({ ...current, ...values }));
    setBookingKey((key) => key + 1);
    navigate("booking");
  };

  const props: SharedPageProps = { navigate, book };
  let page;
  if (currentPage === "destinations") page = <DestinationsPage {...props} />;
  else if (currentPage === "tours") page = <ToursPage {...props} />;
  else if (currentPage === "booking") page = <BookingPage key={bookingKey} {...props} prefill={prefill} />;
  else if (currentPage === "about") page = <AboutPage {...props} />;
  else if (currentPage === "contact") page = <ContactPage />;
  else page = <HomePage {...props} />;

  return (
    <div className="site-app">
      <Navbar currentPage={currentPage} navigate={navigate} />
      <Suspense fallback={<div className="page-loader"><i /><span>Chargement…</span></div>}>
        <div className="page-transition" key={currentPage}>{page}</div>
      </Suspense>
      <Footer navigate={navigate} />
    </div>
  );
}
