# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Run the Electron app (development)
npm run build      # Package into a Windows installer via electron-builder → dist/
```

There is no lint or test setup. There is no transpilation step — source files are loaded directly by Electron.

## Architecture

This is a single-window **Electron** desktop app. The entire UI lives in one self-contained file:

- **[main.js](main.js)** — Electron main process. Opens a `BrowserWindow` (1400×900), loads `index.html`, and enables `webSecurity: false` so the renderer can call the Roboflow API cross-origin.
- **[index.html](index.html)** — Renderer process: all CSS, HTML markup, and JavaScript in one file (~1,800 lines). No external JS bundles or CSS frameworks.

### index.html internals

The script section (from `<script>` near line ~1020) is organized into named sections:

| Section | Responsibility |
|---|---|
| `AppState` | Single global object holding current page, projects array, selected ID, edit mode, and AI scan state |
| `Router` | `Router.navigate(page)` toggles `.active` on `.nav-item` and `.page-view` elements; updates topbar title/subtitle |
| `Projects` | localStorage CRUD — `load()`, `persist()`, `render()`, `select(id)` — for saving inspection records |
| `InspectionPanel` | Right-panel form state: `setMode(edit)`, `setResultBadge(verdict, conf)`, `readForm()`, `fillForm(proj)` |
| Charts | Three Chart.js instances (bar, doughnut, line) initialized inline with hardcoded demo data |
| AI Inspect | `callRoboflow(base64)` POSTs to Roboflow detect API; `drawBoxes()` renders bounding boxes on a `<canvas>` overlaid on `<img>`; `renderResults()` maps predictions to `WELD_STANDARD` entries |
| `WELD_STANDARD` | Lookup table mapping defect class names → ISO codes, severity, verdict, and corrective action text (EN ISO 5817:2023 / Tetra Pak B 2310.64) |

### AI / Roboflow

- Model: `joint-welding-detection` v2 on Roboflow hosted inference (`detect.roboflow.com`)
- API key is hardcoded in `index.html` as `RF_API_KEY`
- Verdict logic: any prediction whose class is `fail`, `defect`, `porosity`, or `crack` → overall result = FAIL

### Data persistence

Projects (inspection records) are stored in **`localStorage`** under the key `wqis_projects` as a JSON array. There is no backend or database.

### Theme

Light/dark theme is toggled via `data-theme` on `<html>`. The chosen theme is persisted to `localStorage` under `wqis_theme`. All colours are CSS custom properties defined in `:root`/`[data-theme]` blocks.

## Key identifiers

DOM IDs that wire up the AI flow: `uploadButton`, `imageUpload`, `uploadZone`, `previewImg`, `bboxCanvas`, `analyzeButton`, `detectResultsPanel`, `exportPdfButton`.

Right-panel form fields use the prefix `f-`: `f-date`, `f-defects`, `f-project`, `f-joint-id`, etc.
