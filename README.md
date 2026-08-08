# Anchor Mapper

Build a React application named "Hyper-Mapper", an accessibility-first educational web app designed for neurodivergent learners. Hyper-Mapper translates complex K-12 academic concepts into personalized "cognitive anchors" (systemic analogies defined by the student, such as Minecraft Redstone, City Transit Systems, or Computer Logic).

STRICT ARCHITECTURE & TECHNICAL RULES:

1. NO AUTHENTICATION / NO LOGIN: Do NOT create login screens, sign-up forms, user accounts, or auth middleware. The app must be 100% stateless and immediately usable without signing in.

2. SUPABASE EDGE FUNCTION INVOCATION: To generate mappings, call the Supabase Edge Function using:

   const { data, error } = await supabase.functions.invoke('map-concept', {

     body: { raw_concept, cognitive_anchor }

   });

   The function returns { error: false, data: { concept_summary, mappings, comprehension_check } }. Extract the nested payload from `data.data`.

3. DATABASE OPERATIONS:

   - On map generation: Insert { raw_concept, cognitive_anchor, structured_output: data.data } into the 'mapping_sessions' table.

   - On quiz completion: Update the corresponding row in 'mapping_sessions' with 'comprehension_score'.

   - On tester feedback: Insert into 'tester_feedback' table.

4. ERROR HANDLING: If the Edge Function returns an error or fails, display an honest, soft-red Error Card with the error message and a "Retry" button. NEVER render fake or mock fallback mapping data.

DESIGN & ACCESSIBILITY SYSTEM (Dribbble Warm Editorial Style):

- Default Background: Warm Alabaster / Off-white (#FDFBF7)

- Surface Cards: Pure White (#FFFFFF) with subtle border (#E2E8F0) and soft shadow

- Primary Text: Deep Slate (#1E293B)

- Primary Accent: Eucalyptus Teal (#0D9488)

- Highlight Accent: Warm Amber (#D97706)

- Typography: Clear sans-serif with generous inter-line spacing (leading-relaxed / 1.6+) for high legibility.

- High-Contrast Dark Mode: Include a toggle button in the navbar that switches the theme to Dark Slate (#0F172A background, #F8FAFC text, high-contrast borders).

APPLICATION PAGES & ROUTES:

1. MAIN LEARNER DASHBOARD (Route: '/')

   - Header:

     * Logo & Title: "Hyper-Mapper"

     * Subtitle: "Translate abstract concepts into your cognitive framework"

     * Read-Only Badge: "Designed & Tested with NNEA Self-Advocates" (soft teal pill badge)

     * High-Contrast Mode Toggle Button

   

   - Step 1: Input Card (Centered, max-width 700px):

     * Label 1: "Academic Concept to Learn" -> Textarea (placeholder: "e.g., Photosynthesis, Electromagnetism, Cell Division...")

     * Label 2: "Your Preferred Cognitive Anchor" -> Text input (placeholder: "e.g., Computer Logic Gates, City Transit Maps, Minecraft Redstone, Music Theory...")

     * Action Button: "Generate Concept Map" (Large Eucalyptus Teal button with loading spinner state)

   - Step 2: Loading State:

     * While waiting for Edge Function response, show a clean, accessible Skeleton Loader card with animated pulsing placeholders.

   - Step 3: Concept Map Results (Rendered upon receiving JSON data):

     * Summary Card: Displays 'concept_summary' in a prominent amber-bordered callout box.

     * Analogy Mapping Cards Grid: Renders an array of step cards from 'mappings'. Each card displays:

       - Step Number Badge

       - Academic Component Name ('concept_element')

       - Anchor Equivalent ('anchor_equivalent')

       - Plain-Language Systemic Explanation ('explanation')

   - Step 4: Quick Comprehension Check:

     * Renders 3 multiple-choice questions from 'comprehension_check'.

     * Interactive option selection with instant feedback (green highlight for correct answer, soft red for incorrect).

     * Score Summary: Displays final score (e.g., "3/3 Correct!").

     * Database Action: Update 'mapping_sessions' row with 'comprehension_score'.

2. PRIVATE TESTER FEEDBACK PAGE (Route: '/tester-feedback')

   - Header: "NNEA Tester Feedback Portal"

   - Subtitle: "Help us measure impact and improve Hyper-Mapper for neurodivergent youth."

   - Form Fields:

     * Tester Identifier: Select dropdown ("Autistic Self-Advocate", "NNEA Volunteer", "Educator / Mentor", "Student")

     * Clarity Rating: 1 to 5 Star Rating ("How clear were the analogies?")

     * Friction Reduction Rating: 1 to 5 Star Rating ("Did this reduce cognitive friction compared to standard textbooks?")

     * Qualitative Notes: Textarea for feedback and suggestions.

     * Submit Button: Writes directly to Supabase 'tester_feedback' table and displays a "Thank You for Validating Our Design!" success message.

Build the application completely with clean, production-ready React components, Tailwind CSS, Lucide icons, and full Supabase integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/398cb655-aa5b-47b1-b3c7-30c7a948ab05).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
