# FitAI — Plateforme santé & performance

App PWA complète avec 5 modules :
- **Dashboard** — Score forme, composition corporelle, macros, sommeil, insights IA
- **Journal de séance** — Saisie exercices/séries/charges, 1RM, PR, progression
- **Coach IA** — Chat contextuel alimenté par Claude (API Anthropic)
- **Programme** — Planning hebdomadaire PPL avec détail des séances
- **Sync & Insights** — Statut Apple Health, corrélations croisées, volume musculaire

---

## Installation

```bash
npm install
npm run dev       # dev sur http://localhost:3000
npm run build     # build production dans /dist
npm run preview   # preview du build
```

---

## Déploiement

### Vercel (recommandé)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag & drop le dossier /dist sur netlify.com/drop
```

---

## Installer sur iPhone (PWA)

1. Déploie sur Vercel ou Netlify (URL HTTPS requise)
2. Ouvre l'URL dans **Safari** sur iPhone
3. Appuie sur le bouton **Partager** (⬆ en bas)
4. Sélectionne **"Sur l'écran d'accueil"**
5. Appuie sur **"Ajouter"**

L'app apparaît comme une vraie app native avec :
- Icône sur l'écran d'accueil
- Plein écran sans barre Safari
- Support Safe Area (notch iPhone)
- Fonctionne hors ligne (Service Worker)

---

## Coach IA — Configuration API

Le Coach IA utilise l'API Anthropic. L'app appelle directement l'API depuis le navigateur.

> ⚠️ Pour la production, proxy les appels API via ton backend pour ne pas exposer la clé.

Backend FastAPI minimal :
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import anthropic, os

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

@app.post("/chat")
async def chat(body: dict):
    msg = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=body.get("system", ""),
        messages=body["messages"]
    )
    return {"content": msg.content[0].text}
```

---

## Connexion Apple Health (app native)

Pour la sync automatique HealthKit, une app iOS native Swift est requise :

```swift
import HealthKit

let healthStore = HKHealthStore()

// Types de données à lire
let readTypes: Set<HKObjectType> = [
    HKObjectType.quantityType(forIdentifier: .bodyMass)!,
    HKObjectType.quantityType(forIdentifier: .dietaryEnergyConsumed)!,
    HKObjectType.quantityType(forIdentifier: .dietaryProtein)!,
    HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
    HKObjectType.workoutType()
]

// Demander les autorisations
healthStore.requestAuthorization(toShare: nil, read: readTypes) { success, error in
    if success { /* lire les données */ }
}
```

---

## Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | React 18 + Vite |
| PWA | vite-plugin-pwa + Service Worker |
| Charts | Recharts |
| IA | Claude API (Anthropic) |
| Déploiement | Vercel |
| Backend (optionnel) | FastAPI + Python |
| Base de données (optionnel) | PostgreSQL + Prisma |

---

## Structure des fichiers

```
src/
├── App.jsx              # Router principal + layout
├── index.css            # Design system CSS
├── main.jsx             # Entry point React
├── components/
│   └── UI.jsx           # Card, Badge, MetricTile, ScoreRing, BottomNav...
├── data/
│   └── mockData.js      # Données simulées (remplacer par API HealthKit)
└── pages/
    ├── Dashboard.jsx    # Tableau de bord général
    ├── Workout.jsx      # Journal de séance + progression
    ├── Coach.jsx        # Chat IA avec Claude
    ├── Program.jsx      # Planificateur hebdomadaire
    └── Sync.jsx         # Sync Apple Health + corrélations
```
