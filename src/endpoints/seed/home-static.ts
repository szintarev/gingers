import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'highImpact',
    title: 'Premium Ginger Products',
    description:
      'Experience the pure, natural taste of our handcrafted ginger products. From fiery ginger shots to smooth ginger teas — crafted for your health and enjoyment.',
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'Shop Now',
          url: '#products',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'Learn More',
          url: '#about',
        },
      },
    ],
    features: [
      { title: '100% Natural', subtitle: 'No additives', icon: 'Leaf' },
      { title: 'Award Winning', subtitle: 'Best in class', icon: 'Award' },
      { title: 'Made with Love', subtitle: 'Handcrafted', icon: 'Heart' },
    ],
  },
  layout: [],
  meta: {
    description: 'Premium handcrafted ginger products — shots, teas, and more.',
    title: 'Gingers — Premium Ginger Products',
  },
  title: 'Home',
}
