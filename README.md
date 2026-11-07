# Melted-Bean ☕

A static coffee-shop website, ready for GitHub Pages. No build step, no dependencies.

## Deploy to GitHub Pages
1. Create a repo (e.g. `melted-bean`) and upload everything in this folder to the root.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
3. Your site goes live at `https://<you>.github.io/melted-bean/` in about a minute.

## Adding your AI videos & images
The site works without them (animated placeholders are built in). Drop files in a `media/` folder with these names and they appear automatically:

| File | Where it shows |
|---|---|
| `media/hero.mp4` (+ optional `hero-poster.jpg`) | Full-screen looping hero background |
| `media/reel-pour.mp4`, `reel-latte.mp4`, `reel-roast.mp4` | The three vertical showreel cards |
| `media/gallery-1.webp` … `gallery-8.webp` | Photo gallery (square, 800×800) |

Keep videos muted, under ~8 MB each, H.264 MP4.

### Prompts to generate them (Sora, Veo, Runway, Kling, Midjourney, etc.)
- **hero.mp4** (16:9, 8s loop): "Slow cinematic macro of dark chocolate melting into a swirl of espresso in a ceramic cup, warm amber light, drifting steam, shallow depth of field, cosy café background, seamless loop."
- **reel-pour.mp4** (9:16): "Pour-over coffee, gooseneck kettle spiralling water over fresh grounds, golden-hour window light, slow motion, steam curling."
- **reel-latte.mp4** (9:16): "Overhead shot of a barista pouring a rosetta latte art, milk blooming into crema, smooth top-down motion."
- **reel-roast.mp4** (9:16): "Glossy coffee beans tumbling in a copper roaster, orange glow, smoke wisps, warm cinematic tones."
- **gallery-N.webp**: "Editorial photo of [latte on marble / croissant on linen / cold brew in tall glass / cosy café corner / pour-over setup / cookie with melted chocolate / night-time café window / coffee beans in a scoop], warm film grain, soft natural light, square crop."

## Make it yours
- Name, address, phone, hours: `index.html` (Visit section) and `HOURS` in `script.js`
- Menu items, prices, promo codes (`PROMOS`): top of `script.js`
- Colours: CSS variables at the top of `style.css`
- Checkout is a demo (no payments). Connect Stripe Payment Links, Formspree, or Netlify Forms for real orders and emails.

## Features (60)
**Look & motion** 1 animated preloader · 2 canvas hero with steam and floating beans · 3 AI hero-video slot with fallback · 4 melting-text animation · 5 scrolling marquee · 6 scroll-reveal · 7 animated stat counters · 8 parallax hero · 9 custom bean cursor · 10 scroll progress bar · 11 3 animated showreel cards (AI video slots) · 12 procedural animated SVG artwork for every item · 13 reduced-motion support
**Navigation** 14 sticky shrinking nav · 15 active-section highlighting · 16 mobile hamburger · 17 back-to-top · 18 skip link · 19 keyboard shortcuts · 20 shortcuts help dialog
**Theming** 21 dark/light toggle (remembered, follows system) · 22 seasonal banner by month (Halloween today) · 23 print-friendly menu
**Menu** 24 category tabs · 25 live search · 26 dietary filters · 27 sort · 28 favourites (saved) · 29 item detail modal with size · 30 daily special by weekday · 31 calorie/caffeine info
**Ordering** 32 cart drawer · 33 quantity controls · 34 saved cart · 35 promo codes · 36 tip picker · 37 GST + totals · 38 pickup/dine-in/delivery checkout · 39 order confirmation with confetti · 40 live order tracker
**Interactive tools** 41 Build-a-Brew with live cup preview and pricing · 42 "Find your brew" quiz · 43 pour-over timer with animation · 44 ratio calculator · 45 caffeine tracker
**Commerce & loyalty** 46 bean subscription builder · 47 gift-card designer · 48 stamp-card rewards · 49 free-drink unlock celebration
**Content** 50 photo gallery + lightbox · 51 coffee origins cards · 52 flip-card barista team · 53 events with .ics add-to-calendar · 54 auto testimonial carousel · 55 FAQ accordion
**Visit & contact** 56 live open/closed badge (Calgary time) + today's hours · 57 embedded map · 58 table reservations · 59 newsletter + contact forms · 60 Web Share / copy link
**Plus** installable PWA with offline cache · generated café-ambience audio · cookie notice · SEO, Open Graph, JSON-LD · custom 404 · Konami-code easter egg
