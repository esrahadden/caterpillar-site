# Caterpillar AI Consulting Website

Your bold, innovative AI consulting website with a stunning dark theme is ready!

## 🚀 Getting Started

The development server is currently running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.68.78:3000

Open your browser and navigate to http://localhost:3000 to see your website!

## 📁 Project Structure

```
caterpillar-website/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles with your brand colors
│   │   ├── layout.tsx        # Root layout with metadata
│   │   └── page.tsx          # Main page combining all sections
│   └── components/
│       ├── Navigation.tsx    # Responsive navbar with mobile menu
│       ├── Hero.tsx          # Hero section with gradients
│       ├── Services.tsx      # Interactive service cards
│       ├── About.tsx         # About/Team section
│       ├── CaseStudies.tsx   # Success stories grid
│       ├── Blog.tsx          # Resources/Blog section
│       ├── Contact.tsx       # Contact form + booking
│       └── Footer.tsx        # Footer with links
├── public/
│   └── logos/                # Place your logo files here
└── package.json
```

## 🎨 Brand Colors

Your website uses the exact colors from your logo:
- **Purple**: `#7c3aed` (main brand purple)
- **Deep Purple**: `#4c1d95`
- **Blue**: `#3b82f6`
- **Cyan**: `#06b6d4`
- **Bright Cyan**: `#00e5cc`
- **Teal**: `#14b8a6`

## 🖼️ Adding Your Logos

**See detailed instructions in [HOW-TO-ADD-LOGO.md](HOW-TO-ADD-LOGO.md)**

Quick steps:
1. Copy your logo PNG to `public/logos/caterpillar-logo.png`
2. Update `src/components/Navigation.tsx` to use the real logo image
3. The site will automatically reload with your logo!

## ✏️ Customizing Content

### Update Company Information

**Contact Details** (src/components/Contact.tsx & Footer.tsx):
- Replace `hello@caterpillarai.com` with your email
- Replace `+1 (555) 123-4567` with your phone
- Update business hours if needed

**Team Members** (src/components/About.tsx):
- Edit the `team` array (lines 6-26)
- Replace placeholder names/bios with your actual team

**Case Studies** (src/components/CaseStudies.tsx):
- Edit the `caseStudies` array (lines 8-75)
- Replace with your actual client success stories

**Blog Articles** (src/components/Blog.tsx):
- Edit the `articles` array (lines 5-63)
- Add your actual blog posts

### Update Service Offerings

Edit the `services` array in [src/components/Services.tsx](src/components/Services.tsx#L8-L56) to match your exact offerings.

## 📅 Calendly Integration

To integrate actual booking functionality:

1. Sign up for Calendly (or similar service)
2. Get your scheduling link
3. Update [src/components/Contact.tsx](src/components/Contact.tsx#L127-L130):

```tsx
onClick={() => {
  window.open('YOUR_CALENDLY_LINK', '_blank');
}}
```

Or use the Calendly embed widget for inline scheduling.

## 📧 Contact Form Integration

The contact form currently shows a success message. To actually send emails:

### Option 1: Email Service (Recommended)
- Use services like SendGrid, AWS SES, or Resend
- Create an API route in `src/app/api/contact/route.ts`
- Update the form submission handler

### Option 2: Form Services
- Use Formspree, FormSubmit, or Web3Forms
- Update the form action in Contact.tsx

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (it's automatic!)

### Build for Production

```bash
npm run build
npm run start
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1024px+)
- ✅ Large screens (1920px+)

## ✨ Features Included

- ✅ Responsive navigation with mobile menu
- ✅ Animated gradient hero section
- ✅ Interactive service cards with hover effects
- ✅ About section with team profiles
- ✅ Expandable case studies
- ✅ Blog/resources section with newsletter signup
- ✅ Contact form with validation
- ✅ Booking integration placeholder
- ✅ SEO-optimized metadata
- ✅ Smooth scrolling between sections
- ✅ Modern animations and transitions

## 🎯 Next Steps

1. **Add Your Logos**: Copy logo files to `public/logos/`
2. **Update Content**: Replace placeholder text with your actual content
3. **Configure Calendly**: Add your booking link
4. **Set Up Email**: Configure contact form email delivery
5. **Add Analytics**: Set up Google Analytics or similar
6. **Test**: Review all sections and update as needed
7. **Deploy**: Push to Vercel for production

## 💡 Tips

- All colors can be customized in `src/app/globals.css`
- Components are modular - easy to rearrange or remove
- Use the brand gradient: `from-purple-600 via-blue-500 to-cyan-500`
- Images can replace emoji placeholders throughout

## 📞 Need Help?

All components are well-commented and easy to customize. If you need to make changes:
1. Components are in `src/components/`
2. Each section is self-contained
3. Update content directly in the component files

Enjoy your new website! 🎉
