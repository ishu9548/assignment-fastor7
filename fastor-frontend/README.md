# Fastor frontend (React + Vite)

Screens: Sign Up (phone) -> 6-digit OTP -> Home -> Item detail.

## Run on Windows
1. Install Node.js 18+ from nodejs.org.
2. Open PowerShell in this folder:
   ```
   npm install
   copy .env.example .env
   npm run dev
   ```
3. Open http://localhost:5173 (on desktop it shows a 390px phone column).

## Configure the API
Edit `.env`: `VITE_API_BASE_URL` (server URL) and `VITE_CITY_ID`. Restart `npm run dev` after changes.
API paths and request fields are in `src/services/endpoints.js` and `src/services/authService.js`.
**They are assumptions and must be checked against your Postman collection.**
The Home screen falls back to the design's sample content if the list API fails or returns too little.

## Structure
- `src/pages` - the four screens
- `src/components` - BackButton, FoodImage, PhoneFrame, ProtectedRoute
- `src/services` - apiClient (fetch wrapper, token), endpoints, authService, restaurantService
- `src/context/AuthContext.jsx` - OTP flow and session token
- `src/styles` - global, auth, home, detail CSS
- `public/images` - optional food photos (pizza.jpg, sushi.jpg, thali.jpg, lasagna.jpg, cupcake.jpg, shake.jpg, burger.jpg). Missing files show a gradient with an emoji.

## Test
- An invalid phone (not 10 digits starting 6-9) shows an error.
- Get OTP opens the OTP screen. Type or paste 6 digits; the resend timer counts down from 00:30.
- Continue stores the token. A refresh keeps you logged in; Log out clears it.
- Item screen: stepper, portion radios, Add to cart (saved in localStorage, toast shown).
