MemeVerse 🎭
MemeVerse is a multi-page, highly interactive meme platform where users can explore, create, and upload memes effortlessly.

🚀 Features
Meme Exploration: Browse trending memes from the Imgflip API.
Meme Creation: Add custom text to uploaded images.
Image Optimization: Uses next/image for faster loading.
State Management: Powered by Redux Toolkit.
Dark Mode Support: Seamless light/dark mode switching.
Cloud Upload: Upload memes to Cloudinary.
Performance Enhancements: Lazy loading, code splitting, and caching.

🛠️ Tech Stack
Frontend: Next.js (App Router), Tailwind CSS, Framer Motion
State Management: Redux Toolkit
Image Upload: Cloudinary
Backend API: Imgflip API (for meme fetching)
Deployment: Vercel

📂 Project Structure
src/
│── app/ # Next.js app directory
│ ├── upload/ # Upload meme page
│ ├── explore/ # Explore memes page
│ ├── profile/ # User profile page
│ ├── leaderboard/ # Leaderboard page
│ ├── meme/ # Meme details page
│── components/ # Reusable UI components
│── redux/ # Redux store and slices
│── utils/ # API calls and helper functions
│── constants/ # API URLs, categories, etc.
│── configs/ # Cloudinary settings

🏗️ Setup & Installation

Clone the repository
git clone https://github.com/your-username/MemeVerse.git
cd MemeVerse

Install dependencies
npm install

Set up environment variables
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
NEXT_PUBLIC_CLOUDINARY_API_BASE=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload

Run the development server
npm run dev

Deploy on Vercel
npm run build
vercel deploy
