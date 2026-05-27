
Expand the mock vendor dataset from 6 entries to ~200 (50 per category) so the listing feels like a real production marketplace.

## What I'll do

1. **Rewrite `src/data/vendors.js`** with ~200 vendors (50 each of Electrician, Plumber, Carpenter, Technician).
2. **Generate realistic, varied data** programmatically inside the file using arrays + a builder so it stays maintainable but reads as genuine:
   - Indian first/last names (Ravi Kumar, Anita Sharma, Mohammed Iqbal, Priya Nair, etc.) — mix across regions
   - 20+ Indian cities (Mumbai, Pune, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, Lucknow, Indore, Chandigarh, Kochi, Surat, Nagpur, Bhopal, Patna, Vadodara, Coimbatore, Visakhapatnam)
   - Category-specific skill pools (8–12 per category) — each vendor gets 3–5 skills
   - Realistic experience: 1–18 years
   - Realistic prices: ₹200–₹1200 (varied per service tier)
   - Ratings: 3.6–5.0 (one decimal)
   - Completed jobs: 15–520
   - Description templates that reference the vendor's top skill, experience and city — so each blurb feels written, not cloned
3. **Keep export shape identical** (`vendors`, `categories`) so `Vendors.jsx`, `VendorDetails.jsx`, `Compare.jsx`, `Home.jsx`, `VendorCard.jsx` all keep working with no other changes.
4. **Stable IDs 1–200** so vendor detail routes stay deterministic across reloads.

## Why this approach

- A flat 200-item literal would be ~1500 lines of noise. Building from realistic name/skill/city pools inside the same file keeps it readable, still 100% static (no API), and produces output that looks hand-curated.
- No component logic changes needed — sorting, filtering, search, and compare already scale.

## Small UX touch-up (same change)

- Default the listing page card grid stays 3-cols, but with 200 results I'll add a simple **client-side "Load more" (show 18 → +18)** in `Vendors.jsx` so the page doesn't render 200 cards at once and feel sluggish. Filters/sort reset the visible count.

## Files touched

- `src/data/vendors.js` — rewritten with ~200 generated vendors
- `src/pages/Vendors.jsx` — add "Load more" pagination (visible count state)

No other files change.
