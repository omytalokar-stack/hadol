<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/81da3c50-c18e-4a8d-ac6b-40e566169dba

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Copy `.env.example` to `.env` and set `MONGODB_URI`, `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID`, `JWT_SECRET`, and `ADMIN_EMAIL`. Keep `.env` private; never commit credentials.
4. Run the app:
   `npm run dev`

Open `/admin` for the admin panel. The main app's **Save Kundli** action creates a record that appears in the Saved Kundlis tab.
