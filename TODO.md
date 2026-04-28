# KickZone — Shared TODO

> Living task list for Johnny + Claude. Update anytime — just say "update the TODO" or "mark X as done".
> Stored in git so it persists across every session.

---

## 🔥 High Priority

- [ ] **Penalty Shootout polish** — test all 9 zones on real device, confirm keeper photo loads (Schmeichel etc.), check sound on iOS Safari
- [ ] **Score Predictor** — confirm live fixtures are showing (not fallback) on mykickzone.vercel.app
- [ ] **Mobile responsiveness audit** — walk through all pages on a phone, fix any layout issues

---

## 🎮 Games — Next Up

- [ ] **#1 Stadium Builder** — drag-and-drop your dream stadium, share as image
- [ ] **#2 Transfer Rumour Machine** — generate silly/funny AI transfer rumours
- [ ] **#3 Tactic Board** — drag players onto a pitch, save your formation
- [ ] **#4 Boot Room** — rate/vote on the best football boots
- [ ] **#5 Player of the Week vote** — community poll, resets weekly
- [ ] **Penalty Shootout leaderboard** — top scores stored server-side (needs DB/auth)
- [ ] **Wordle — expand player pool** — currently ~40 players, ideally 200+ so daily seed doesn't repeat
- [ ] **Wordle — share result** — copy emoji grid to clipboard (like real Wordle)
- [ ] **Quiz — daily question streak** — reward XP for consecutive daily completions

---

## 📰 Content & Data

- [ ] **Live match scores on homepage** — show today's scores updating in real time (currently shows upcoming only)
- [ ] **Player search** — global search bar that works across players, leagues, teams
- [ ] **More leagues** — Champions League, Eredivisie, Primeira Liga
- [ ] **Team pages** — click a team badge to see their squad, fixtures, table position
- [ ] **Transfer news feed** — pull from a free RSS/API source

---

## 🐛 Bugs / Improvements

- [ ] **Player images** — some still showing initials SVG fallback; improve Wikipedia search accuracy
- [ ] **Wordle** — if player pool has duplicate names (ICON variants), dedupe more robustly
- [ ] **Diary** — add ability to edit an existing entry (currently delete-only)
- [ ] **Card Battle** — cards need more players added (currently 50, could be 100+)
- [ ] **Golden Boot** — pull live top scorer data if API allows

---

## 💬 Community

- [ ] **Discussions** — add upvote/like on posts
- [ ] **Discussions** — add image upload support
- [ ] **User profiles** — show XP total, badges earned, predictions record
- [ ] **XP leaderboard page** — global rankings (needs server-side XP storage)
- [ ] **Badges system** — earn badges for milestones (first goal, 5/5 penalty, quiz streak)

---

## ⚙️ Tech / Infrastructure

- [ ] **Server-side XP** — currently localStorage only; move to DB so XP persists across devices
- [ ] **PWA / install prompt** — make site installable on phone home screen
- [ ] **VS Code Remote Tunnel** — set up so Johnny can develop from phone (run `code tunnel` on laptop)
- [ ] **Push notifications** — notify users when a match they predicted is about to kick off

---

## ✅ Recently Done

- [x] Penalty Shootout — 9-zone grid, vs CPU + 2-player pass-and-play
- [x] Jeopardy reveal — whistle → ball shown → keeper dives → crowd/save sound
- [x] Real goalkeeper photos — Schmeichel, Buffon, Casillas, Neuer, De Gea, Kahn
- [x] Football Diary — log personal match stats, W/D/L bar, localStorage
- [x] Footie Wordle — daily mystery player, 6 guesses, colour-coded hints
- [x] Score Predictor — league filter pills, 10 fixtures per league (50 total)
- [x] Player images fixed — Wikipedia + TheSportsDB + SVG initials fallback
- [x] League tables — EL + UECL + relegation colour spots
- [x] Europa League tab added to /leagues
- [x] Homepage hero badges made clickable (all link to correct pages)
- [x] GOAT page — 25 all-time legends voting grid
- [x] Cards library expanded to 50 cards
