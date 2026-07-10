# Living Techno Course

A complete static course application generated from `content/living-techno-curriculum.md`.

## What is included

- 112 statically generated lesson pages containing every second-level lesson plus previously easy-to-drop first-level overview and appendix material
- dashboard with completion, time-left, streak, bookmarks, and current-lesson state
- five-domain skills dashboard with lesson coverage, exercise practice, tagged sessions, prerequisites, and self-evidence
- searchable/filterable course map
- local lesson completion, exercise checks, notes, and practice sessions
- JSON progress export/import
- searchable glossary and artist/reference library
- contextual glossary links, lesson-to-skill links, skill-to-lesson links, prerequisites, and related-lesson paths
- responsive educational diagrams for meter, rhythm, envelopes, machines, signal flow, modulation, spectrum, and arrangement energy
- dark Club Manual design system documented at `/design-system/`

All learner state stays in browser `localStorage`; the course has no database, authentication, analytics, or server requirement. See `SKILL_MODEL.md` for why section completion and capability progress are tracked separately.

## Local development

```bash
npm install
npm run dev
```

The `predev` hook regenerates the course data from the Markdown source.

## Netlify deployment

The repository includes `netlify.toml`. Connect the repository in Netlify; it will run:

```text
npm run build:netlify
```

and publish the generated `out/` directory. The result is static HTML, CSS, JavaScript, and fonts.

For a manual drag-and-drop deployment, build locally and upload the contents of `out/`.

## Updating the curriculum

1. Edit or replace `content/living-techno-curriculum.md`.
2. Run `npm run generate:course`.
3. Run `npm test`.

Every second-level Markdown heading (`##`) becomes a lesson. First-level headings (`#`) become course parts. Third-level headings become the on-page table of contents; exercise/lab/recipe headings are also surfaced in the lesson exercise tracker.

## Validation

`npm test` checks both the Sites/Vinext build and the Netlify static export, confirms all 112 lessons exist, verifies the skills map and accessibility landmarks, and checks that every internal HTML link resolves.
