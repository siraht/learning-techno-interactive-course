"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "./icon";
import { useProgress } from "./progress";

interface SearchLesson {
  slug: string;
  title: string;
  part: string;
  sequence: number;
  kind: string;
}

const nav = [
  ["/", "Dashboard", "dashboard"],
  ["/course/", "Course map", "map"],
  ["/skills/", "Skills map", "skills"],
  ["/practice/", "Practice log", "practice"],
  ["/references/", "Reference library", "reference"],
  ["/glossary/", "Glossary", "glossary"],
  ["/design-system/", "Design system", "system"],
] as const;

export function AppShell({ children, lessonIndex }: { children: React.ReactNode; lessonIndex: SearchLesson[] }) {
  const pathname = usePathname();
  const { state } = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const percent = lessonIndex.length ? Math.round((state.completed.length / lessonIndex.length) * 100) : 0;
  const currentModule = lessonIndex.find((lesson) => pathname.includes(lesson.slug));

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return lessonIndex.slice(0, 8);
    return lessonIndex.filter((lesson) => `${lesson.title} ${lesson.part} ${lesson.kind}`.toLowerCase().includes(needle)).slice(0, 12);
  }, [lessonIndex, query]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to course content</a>
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`} id="course-navigation">
        <div className="brand-block">
          <Link href="/" className="brand">LIVING<br/>TECHNO</Link>
          <button className="sidebar-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><Icon name="close" /></button>
        </div>
        <div className="rail-label"><span>COURSE NAVIGATION</span><b>01</b></div>
        <nav aria-label="Course navigation">
          {nav.map(([href, label, icon], index) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} aria-current={active?"page":undefined} className={`nav-link ${active ? "is-active" : ""}`} onClick={() => setMenuOpen(false)}>
                <Icon name={icon}/><span>{label}</span><em>{String(index + 1).padStart(2, "0")}</em>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-progress">
          <div className="rail-label"><span>COURSE PROGRESS</span><b>02</b></div>
          <div className="progress-readout"><strong>{percent}%</strong><span>complete</span></div>
          <div className="progress-cells" role="progressbar" aria-label="Course completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            {Array.from({ length: 16 }, (_, index) => <i key={index} className={index < Math.round(percent / 6.25) ? "filled" : ""}/>) }
          </div>
          <dl><div><dt>LESSONS COMPLETE</dt><dd>{state.completed.length} / {lessonIndex.length}</dd></div><div><dt>BOOKMARKED</dt><dd>{state.bookmarked.length}</dd></div></dl>
        </div>
      </aside>

      <div className="main-frame">
        <header className="utility-header">
          <button className="mobile-menu" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="course-navigation" onClick={() => setMenuOpen(true)}><Icon name="menu"/></button>
          <div className="utility-cell module-cell"><span>MODULE</span><strong>{currentModule ? String(currentModule.sequence).padStart(3, "0") : "000"}</strong></div>
          <div className="utility-cell location-cell"><span>LOCATION</span><strong>{currentModule?.part || (pathname === "/" ? "Dashboard" : "Living Techno")}</strong></div>
          <div className="utility-cell status-cell"><span>STATUS</span><strong>{percent === 100 ? "COMPLETE" : percent ? "IN PROGRESS" : "READY"}</strong></div>
          <button className="search-button" onClick={() => setSearchOpen(true)}><Icon name="search"/><span>SEARCH</span><kbd>⌘K</kbd></button>
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
      </div>

      {menuOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)}/>} 
      {searchOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="course-search-title">
          <button className="modal-scrim" aria-label="Close search" onClick={() => setSearchOpen(false)}/>
          <section className="search-panel">
            <h2 className="sr-only" id="course-search-title">Search the Living Techno course</h2>
            <div className="search-input-wrap"><Icon name="search"/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search rhythm, modulation, an artist…"/><button onClick={() => setSearchOpen(false)}><Icon name="close"/></button></div>
            <p className="mono-label">{query ? `${results.length} MATCHES` : "JUMP TO A LESSON"}</p>
            <div className="search-results">
              {results.map((lesson) => <Link key={lesson.slug} href={`/course/${lesson.slug}/`} onClick={() => setSearchOpen(false)}><b>{String(lesson.sequence).padStart(3, "0")}</b><span><strong>{lesson.title}</strong><small>{lesson.part}</small></span><Icon name="arrow"/></Link>)}
              {!results.length && <p className="empty-state">No lesson matches that phrase. Try a broader concept.</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
