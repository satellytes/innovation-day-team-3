# React Abonnementpläne Anwendung

Eine moderne React-Anwendung zur Darstellung von Abonnementplänen mit simulierter Stripe-Integration.

## Features

- 📱 Vollständig responsive Design
- 🎨 Tailwind CSS Styling
- 💳 Simulierte Zahlungsabwicklung
- 🔄 Umschaltung zwischen monatlicher/jährlicher Zahlung
- ✨ Moderne UI/UX mit Animationen
- 📦 NPM-basierte Dependencies (kein CDN)
- ⚡ Webpack Dev Server mit Hot Reload

## Installation & Setup

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Erste Schritte

```bash
# Repository klonen (falls noch nicht geschehen)
git clone <your-repo-url>
cd <your-repo-name>

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start
```

Die Anwendung öffnet sich automatisch unter `http://localhost:3000`.

## Verfügbare Scripts

```bash
# Entwicklungsserver starten (mit automatischem Browser-Öffnen)
npm start

# Entwicklungsserver ohne automatisches Öffnen
npm run dev

# Production Build erstellen
npm run build

# Alternative: Node.js Server starten
npm run serve
```

## Projektstruktur

```
.
├── src/
│   ├── index.html          # HTML-Template
│   ├── index.js           # React-Einstiegspunkt
│   ├── App.js             # Haupt-React-Komponente
│   └── styles.css         # Tailwind CSS Imports
├── dist/                  # Build-Output (generiert)
├── node_modules/          # NPM Dependencies (ignoriert)
├── .gitignore             # Git-Ignore-Regeln
├── package.json           # NPM-Konfiguration
├── webpack.config.js      # Webpack-Konfiguration
├── tailwind.config.js     # Tailwind-Konfiguration
├── postcss.config.js      # PostCSS-Konfiguration
├── server.js              # Alternative Node.js Server
└── README.md              # Diese Datei
```

## Technologien

- **React 18** - UI-Framework (NPM-Paket)
- **Tailwind CSS** - Utility-first CSS Framework (NPM-Paket)
- **Webpack 5** - Module Bundler
- **Babel** - JavaScript Transpiler
- **PostCSS** - CSS-Verarbeitung
- **Inter Font** - Moderne Schriftart (Google Fonts)

## Entwicklung

Die Anwendung verwendet NPM-Pakete statt CDN-Links für bessere Performance und Offline-Entwicklung. Webpack Dev Server bietet Hot Reload für eine optimale Entwicklungserfahrung.

### Build-Prozess

- **Development**: `npm start` - Startet Webpack Dev Server mit Hot Reload
- **Production**: `npm run build` - Erstellt optimierten Build in `dist/`
- **Styling**: Tailwind CSS wird über PostCSS verarbeitet
- **JavaScript**: Babel transpiliert JSX und moderne JavaScript-Features

## Git-Integration

Das Projekt ist Git-ready mit einer konfigurierten `.gitignore`-Datei, die folgende Dateien/Ordner ausschließt:
- `node_modules/` - NPM Dependencies
- `dist/` - Build-Output
- `.env*` - Environment-Variablen
- IDE/Editor-spezifische Dateien
- OS-generierte Dateien

### Git-Workflow

```bash
# Änderungen hinzufügen
git add .

# Commit erstellen
git commit -m "Add subscription plans frontend"

# Zu Remote-Repository pushen
git push origin main
```

## Deployment

Für Production-Deployment:

```bash
# Production Build erstellen
npm run build

# dist/ Ordner enthält alle statischen Dateien für Deployment
```

Die generierten Dateien im `dist/`-Ordner können auf jedem statischen Hosting-Service (Netlify, Vercel, GitHub Pages, etc.) deployed werden.
