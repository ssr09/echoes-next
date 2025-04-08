# Echoes - Timeless Wisdom

A clean, mobile-friendly web application that showcases timeless quotes from history's greatest thinkers, philosophers, and authors.

## Features

- **Quote Feed**: Discover quotes in random order, trending by upvotes, or top by popularity
- **Author Pages**: View all quotes from specific authors
- **Search**: Find quotes by keyword or phrase matching
- **Share**: Share individual quotes with a direct link
- **Responsive Design**: Works on any device size
- **Infinite Scroll**: Seamlessly load more content as you browse

## Tech Stack

- **Next.js**: React framework with built-in routing and optimizations
- **React**: Component-based UI library
- **CSS**: Clean, mobile-first styling without external dependencies
- **Context API**: For global state management

## Getting Started

### Prerequisites

- Node.js 14+ and npm/yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/echoes-next.git
cd echoes-next
```

2. Install dependencies:
```
npm install
# or
yarn
```

3. Run the development server:
```
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application can be easily deployed to Vercel or Netlify:

### Vercel (Recommended)
```
npm install -g vercel
vercel
```

### Netlify
```
npm install -g netlify-cli
netlify deploy
```

## Project Structure

- `pages/`: Next.js pages and routing
- `components/`: Reusable React components
- `context/`: React Context for state management
- `public/`: Static assets and data
- `styles/`: Global CSS styles

## License

MIT 