# How to Add Your Caterpillar Logo

Your website currently has an SVG logo placeholder in the navigation. Here's how to replace it with your actual logo files:

## Step 1: Save Your Logo Files

1. Save one of your logo PNG files to the `public/logos/` directory
2. Recommended: Use the version with the gradient background (not the outline version)
3. Name it something simple like `caterpillar-logo.png`

```bash
# From your terminal, in the project directory:
cp path/to/your/logo.png caterpillar-website/public/logos/caterpillar-logo.png
```

## Step 2: Update the Navigation Component

Open the file: `src/components/Navigation.tsx`

Find lines 35-54 (the logo section) and replace with:

```tsx
<Link href="/" className="flex items-center space-x-3">
  <Image
    src="/logos/caterpillar-logo.png"
    alt="Caterpillar AI Consulting"
    width={50}
    height={50}
    className="rounded-lg"
  />
  <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
    caterpillar
  </div>
</Link>
```

Don't forget to add the Image import at the top of the file:

```tsx
import Image from 'next/image';
```

## Step 3: Optional - Use Logo in Hero Section

You can also add your logo to the hero section for extra branding. Open `src/components/Hero.tsx` and add your logo above the main heading (around line 21):

```tsx
<div className="mb-8 animate-fade-in-up">
  <div className="flex justify-center mb-8">
    <Image
      src="/logos/caterpillar-logo.png"
      alt="Caterpillar AI"
      width={120}
      height={120}
      className="rounded-2xl"
    />
  </div>
  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
    ...
```

## Alternative: Use SVG Version

If you have an SVG version of your logo (recommended for best quality):

1. Save it as `caterpillar-logo.svg` in `public/logos/`
2. You can use it directly in an `<img>` tag or import it:

```tsx
<img
  src="/logos/caterpillar-logo.svg"
  alt="Caterpillar AI"
  className="h-12 w-auto"
/>
```

## Logo Color Variations

Based on your brand files, you have multiple variations. Here's where to use each:

- **Gradient version** (full color): Use in navigation on the dark background
- **White/outline version**: Keep as fallback for any light backgrounds
- **Solid cyan version**: Could use for footer

## Quick Reference: Your Logo Files Location

All logo files should go in:
```
caterpillar-website/public/logos/
```

They'll be accessible in your code at:
```
/logos/filename.png
```

Once you add the files and update the code, the changes will appear immediately in your browser at http://localhost:3000!
