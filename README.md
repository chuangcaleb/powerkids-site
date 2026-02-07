# PowerKids Site

## Description

This is the official website for PowerKids Kindergarten.

## Features

* Fast performance with Astro.js
* Interactive components with Radix UI + React
* Responsive design with Tailwind CSS, with utopia fluid typography/spacing
* SEO friendly with sitemap and robots.txt generation
* Image optimization with Cloudinary

## Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

* npm / pnpm
* Node.js

### Setup

```bash
# Clone the repo
git clone https://github.com/chuangcaleb/powerkids-site.git
# Install PNPM packages
pnpm install
# Start the development server
pnpm dev
```

## Usage

```bash
# To build the project for production:
pnpm build
# To preview the production build locally:
pnpm preview
```

## File Structure

<details>
<summary>Click to expand</summary>

```filetree
.
├── README.md
├── ROADMAP.md
├── astro.config.mjs
├── components.json // shadcn components.json
├── lib
│   └── shadcn-plugin.ts
├── notes.md
├── package.json
├── pnpm-lock.yaml
├── public
│   ├── favicon
│   ├── fonts
│   ├── images
│   └── media
├── src
│   ├── assets // static assets
│   ├── components
│   │   ├── brand // brand-specific components
│   │   ├── common
│   │   ├── layout
│   │   │   ├── footer
│   │   │   └── nav
│   │   └── ui // shadcn components
│   ├── env.d.ts
│   ├── lib // utility files for services not specific to the project
│   │   ├── cloudinary.ts
│   │   └── utils.ts
│   ├── pages
│   └── styles
├── tailwind.config.ts
```

</details>
