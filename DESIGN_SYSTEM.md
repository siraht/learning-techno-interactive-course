# Design system — Club Manual / Dark Signal

## Design intent

The interface is a serious instrument manual crossed with a disciplined club flyer. It uses nearly square ruled surfaces, bold condensed hierarchy, compact mono labels, and acid signal states. It should feel energetic at first glance and calm during a long lesson.

## Core tokens

| Token | Value | Function |
|---|---|---|
| Canvas | `#0A0B09` | page and reading field |
| Surface | `#131512` | cards and panels |
| Raised | `#1A1D18` | controls and nested fields |
| Paper | `#F3F0E6` | primary text |
| Muted | `#9C9D94` | supporting labels |
| Signal | `#D4FF32` | active, progress, success, focus |
| Warning | `#FF5A1F` | exceptions, numbering, attention |
| Rule | `#343730` | structure and separation |

Spacing uses `4, 8, 12, 16, 24, 32, 48, 64, 96px`. Corners are `0–4px`. Minimum interaction targets are 44px.

## Typography

- Display: Barlow Condensed 700/800/900
- Body and UI: IBM Plex Sans 400/500/600
- Data, grids, metadata: IBM Plex Mono 400/500

## Visual grammar

The course deliberately avoids generic studio photography, decorative equalizers, nightclub stock imagery, and unlicensed artist portraits. Educational visuals are code-native diagrams tied to the content:

- rhythm: sixteen-step cells, beat roles, and subdivision coordinates;
- meter: four-beat orbit and metric gravity;
- sound: envelopes, spectra, signal-flow plates;
- systems: modulation networks and machine-affordance comparisons;
- arrangement: multi-axis energy curves.

This makes every visual responsive, accessible, stylistically consistent, and directly useful to the lesson.

## Motion and accessibility

- 140ms micro-interactions, 220ms state changes, 320ms page transitions
- no neon glow, bounce, flicker, or continuous decorative sequencer animation
- 3px signal focus indicator with a 2px canvas offset
- reduced-motion mode removes transforms and interpolation
- state is never communicated by color alone
