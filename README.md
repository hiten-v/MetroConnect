# MetroConnect – Metro Booking Service

## Quick Start (5 steps)

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Install dependencies
```bash
npm install       # root
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment
Edit `server/.env` if needed:
```
MONGO_URI=mongodb://localhost:27017/metro-booking
PORT=5000
```

### 3. Seed the database
```bash
npm run seed
```
This inserts 3 metro lines (Yellow, Blue, Pink), 70+ stations, interchange detection, and compatibility matrix.

### 4. Run dev servers
```bash
npm run dev
```
Starts both Express (`:5000`) and Vite (`:5173`) concurrently.

### 5. Open browser
- **Passenger App:** https://metro-connect-hiten.vercel.app/
- **Admin Panel:** https://metro-connect-hiten.vercel.app/admin

---

## Features

### Passenger
- Station autocomplete with line color badges and interchange indicators
- Animated swap button for source/destination
- Last 5 recent searches saved in localStorage
- BFS route finding with transfer penalty (runs client-side, instant results)
- Route cards with segment timeline, color-coded by line
- Interchange markers in route steps
- QR ticket generation with canvas animation
- Download ticket as JSON

### Map
- Full SVG metro network diagram
- Zoom (scroll wheel or +/- buttons) and pan (drag)
- Station labels on hover
- Interchange stations shown with color rings
- Journey path animates (draws itself) when route selected
- Non-journey lines dim automatically
- Click any station → side panel with facilities + book shortcuts

### Admin
- Line management with drag-and-drop reordering
- Remove stations, with auto-save
- CSV/JSON bulk import with drag-and-drop upload zone
- Client-side validation (duplicates, missing fields)
- Preview table before committing
- Version compatibility matrix with color-coded cells and hover tooltips

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/stations` | All stations |
| GET | `/api/lines` | Full network (populated) |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:ref` | Get ticket by reference |
| PUT | `/api/lines/:id/stations` | Update/reorder stations |
| POST | `/api/import/commit` | Bulk import stations |
| GET | `/api/matrix` | Compat matrix |

---

## Architecture Notes
- Route finding (BFS) runs entirely client-side on the fetched network data
- Fare formula: ₹10 base + ₹2/stop + ₹5/transfer, capped at ₹60
- QR string = JSON `{ ref, from, to, ts }` rendered via `qrcode` canvas
- Map uses pure SVG with CSS `transform` for pan/zoom (no heavy library)
- DnD uses `react-beautiful-dnd`
