
# 👟 Sneaker Outfit Matcher

## Unleash Your Style: AI-Powered Sneaker and Outfit Analysis

Welcome to the Sneaker Outfit Matcher! This application helps you discover the perfect outfit to complement your favorite sneakers using the power of AI. Simply upload a picture of your sneakers, and our intelligent system will analyze them, suggest matching outfits from your wardrobe, and even provide trending style insights.

Whether you're a sneakerhead looking to elevate your style or just need some inspiration, this app is your ultimate personal stylist.

## ✨ Features

-   **AI-Powered Sneaker Analysis**: Upload a sneaker image and get detailed insights on brand, model, colors, and style using Gemini AI.
-   **Personalized Outfit Suggestions**: Receive tailored outfit recommendations from your virtual wardrobe that perfectly match your analyzed sneakers.
-   **Trend Integration**: Stay ahead of the curve with real-time fashion trend data scraped from platforms like Pinterest.
-   **Wardrobe Management**: Easily manage and categorize your clothing items to get the best outfit suggestions.
-   **Secure Image Handling**: Robust validation and secure storage for all your uploaded images.
-   **Responsive Design**: A beautiful and intuitive user interface built with Next.js, React, and Tailwind CSS, accessible on any device.

## 🚀 Technologies Used

-   **Next.js 15.4**: A React framework for building full-stack web applications.
-   **React 19**: Frontend library for building user interfaces.
-   **TypeScript 5.5+**: Statically typed superset of JavaScript for enhanced code quality.
-   **Tailwind CSS v4**: A utility-first CSS framework for rapid UI development.
-   **Supabase**: An open-source Firebase alternative for database, authentication, and storage.
    -   **PostgreSQL**: Relational database for storing user data, wardrobe items, and analysis results.
    -   **Supabase Storage**: Securely store sneaker images.
    -   **Supabase Auth**: Handle user authentication.
-   **Google Gemini 2.5 Flash**: AI model for advanced sneaker image analysis.
-   **Puppeteer 24.3**: Headless browser for web scraping fashion trends.
-   **shadcn/ui**: Reusable UI components for a polished user experience.
-   **Framer Motion**: A production-ready motion library for React.

## 📁 Project Structure

```
sneaker-outfit-matcher/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── analyze/route.ts
│       └── wardrobe/route.ts
├── components/
│   ├── ui/ (shadcn components)
│   ├── ImageUpload.tsx
│   └── WardrobeManager.tsx
│   └── OutfitCard.tsx
│   └── ErrorNotification.tsx
│   └── SuccessNotification.tsx
│   └── ScrollReveal.tsx
├── lib/
│   ├── supabase-client.ts
│   ├── supabase-server.ts
│   ├── gemini.ts
│   ├── puppeteer-config.ts
│   ├── image-utils.ts
│   ├── animations.ts
│   └── utils.ts
└── utils/
    └── cn.ts
```

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js 20+
-   npm or yarn
-   A Supabase account (create one at [Supabase](https://supabase.com/))
-   A Google Gemini API Key (get one at [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sneaker-outfit-matcher.git
cd sneaker-outfit-matcher
cd sneaker-outfit-matcher # Navigate into the inner project directory
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the `sneaker-outfit-matcher` directory (the inner one) and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

-   You can find your Supabase URL and `anon` key in your Supabase project settings under `API`. Make sure to use the **Project API keys**.
-   The `SUPABASE_SERVICE_ROLE_KEY` can also be found in your Supabase project settings. Be careful not to expose this key in client-side code.
-   Get your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/).

### 4. Set up Supabase Database Schema

Refer to the `Database Schema` section in `rules.md` (or the `always_applied_workspace_rules` in the prompt you received) for the necessary SQL commands to set up your tables in Supabase. You can execute these commands directly in the Supabase SQL Editor.

```sql
-- Users (simple)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User's wardrobe
CREATE TABLE wardrobe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  item_type TEXT NOT NULL, -- 'top', 'bottom', 'outerwear', 'accessory'
  color TEXT NOT NULL,
  description TEXT NOT NULL, -- 'Black Nike hoodie', 'Blue Levi's jeans'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sneaker analyses + outfit suggestions
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  image_url TEXT NOT NULL, -- Supabase storage URL
  sneaker_data JSONB NOT NULL, -- { brand, model, colors, style, confidence }
  trend_data JSONB, -- Pinterest scraped data
  outfit_suggestions JSONB NOT NULL, -- Generated outfits
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_wardrobe_user_id ON wardrobe_items(user_id);
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 💡 Usage

1.  **Upload Sneaker Image**: On the homepage, upload a clear image of your sneakers.
2.  **Get Analysis**: The AI will analyze your sneakers and provide details.
3.  **Receive Outfit Suggestions**: Based on your analyzed sneakers and items in your wardrobe, you'll get personalized outfit recommendations.
4.  **Manage Wardrobe**: Add, edit, or remove clothing items from your virtual wardrobe to refine your outfit suggestions.

## 🚢 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Environment Variables on Vercel

Remember to add your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`) to your Vercel project settings.

## 🤝 Contributing

We welcome contributions to the Sneaker Outfit Matcher! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details. (Note: A `LICENSE` file would typically be created in the root of the repository.)

---

Made with ❤️ by [Nasif]
