# MatchDay Copilot — Frontend

## Démarrage rapide

```bash
cd matchday-copilot-frontend
npm install
npm run dev
```

L'app tourne sur http://localhost:5173 avec un mockApi qui simule le backend.

## Conversation scriptée du mock

Quatre messages utilisateur déclenchent la carte. À chaque message, le mock pose la question suivante :
1. Vol → "Quelle équipe ?"
2. Équipe → "Combien de jours ?"
3. Jours → "Quel budget ?"
4. Budget → renvoie `map_ready` avec le plan de Los Angeles.

## Quand le backend est prêt

Dans `src/mockApi.js`, remplace le contenu de `mockSendMessage` par :

```js
export const mockSendMessage = async ({ messages, message }) => {
  const res = await fetch('http://BACKEND_URL/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, message })
  })
  return res.json()
}
```

Et si tu veux éviter les CORS pendant le dev, ajoute un proxy dans `vite.config.js` :

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

Puis dans `mockApi.js`, utilise simplement `fetch('/api/chat', ...)`.

## Structure

```
src/
├── main.jsx              Point d'entrée React + import CSS Leaflet
├── App.jsx               État global et orchestration des panneaux
├── App.css               Tous les styles (vanilla CSS)
├── mockApi.js            Mock backend - à remplacer par fetch réel
└── components/
    ├── ChatPanel.jsx     Panneau gauche - conversation
    ├── MapPanel.jsx      Panneau central - carte Leaflet
    └── DetailsPanel.jsx  Panneau droit - détails sur clic
```

## Flux d'état

Tout l'état vit dans `App.jsx` (cinq `useState`). Les enfants reçoivent les valeurs en props et déclenchent des callbacks pour remonter les événements.

```
ChatPanel  ──(onSendMessage)──►  App  ──(messages, isLoading)──►  ChatPanel
MapPanel   ──(onPointClick)───►  App  ──(mapData, currentDay)──►  MapPanel
DetailsPanel ──(onClose)──────►  App  ──(selectedPoint)──────►  DetailsPanel
```