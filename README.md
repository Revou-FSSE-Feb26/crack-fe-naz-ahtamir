# OHS Nickel Smelter - Next.js Website

This is a Next.js website for the Occupational Health & Safety Department of Nickel Smelter, PT. QMB New Energy Materials.

## Features

- **Background Video**: Video background on the homepage related to K3 (Keselamatan dan Kesehatan Kerja) implementation
- **Tailwind CSS**: Using Tailwind CSS v4 for styling
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode Navigation**: Navigation bar with dark theme and orange accents
- **KPI Dashboard**: Visualizations of safety performance data
- **Multi-language Support**: Content in Indonesian and English

## Tech Stack

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS framework
- **Bun**: Fast JavaScript runtime

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) - Fast JavaScript runtime
- Node.js 18+ (if using npm instead of Bun)

### Installation

1. Navigate to the project directory:
```bash
cd nextjs-app
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
bun build
```

### Start Production Server

```bash
bun start
```

## Project Structure

```
nextjs-app/
├── public/
│   ├── fonts/          # Custom fonts (century-gothic, grotesk, moderniz)
│   └── videos/         # Video files (Video.mp4)
├── src/
│   ├── app/
│   │   ├── components/ # Reusable components (Navbar, Footer, Section)
│   │   ├── layouts/    # Layout components
│   │   ├── ui/         # UI components
│   │   ├── about/      # About page
│   │   ├── contact/    # Contact page
│   │   ├── dashboard/  # KPI Dashboard page
│   │   ├── gallery/    # Gallery page
│   │   ├── programs/   # Programs page
│   │   ├── fonts.css   # Custom font-face declarations
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Homepage
│   └── lib/            # Utility functions
├── package.json
└── tsconfig.json
```

## Pages

- **Home** (`/`): Homepage with hero section, stats, programs preview, and CTA
- **About** (`/about`): About OHS and policy documents
- **Programs** (`/programs`): Safety programs and initiatives
- **Gallery** (`/gallery`): Photo gallery and resources
- **Dashboard** (`/dashboard`): KPI dashboard with charts
- **Contact** (`/contact`): Contact information and report form

## Customization

### Changing the Video Background

1. Place your video file in `public/videos/`
2. Update the `src` attribute in `src/app/page.tsx`:
```tsx
<source src="/videos/your-video.mp4" type="video/mp4" />
```

### Updating KPI Data

Edit the static data in `src/app/dashboard/page.tsx` and replace with API calls as needed.

### Modifying Colors

Update the CSS variables in `src/app/globals.css`:
```css
:root {
  --orange-primary: #f15a22;
  --orange-secondary: #f7941d;
  --dark: #231f20;
  /* ... */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
