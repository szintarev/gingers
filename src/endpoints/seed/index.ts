import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { image1 } from './image-1'
import { imageHero1 } from './image-hero-1'

const collections: CollectionSlug[] = ['media', 'pages']
const globals: GlobalSlug[] = ['header', 'footer']

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  for (const collection of collections) {
    await payload.delete({
      collection: collection as CollectionSlug,
      where: { id: { exists: true } },
      req,
    })
  }

  for (const global of globals) {
    await payload.updateGlobal({
      slug: global as GlobalSlug,
      data: {},
      req,
    })
  }

  payload.logger.info('Seeding media...')

  const fetchFile = async (url: string): Promise<File> => {
    const data = await fetch(url)
    const blob = await data.blob()
    const name = url.split('/').pop() ?? 'file'
    return {
      name,
      data: Buffer.from(await blob.arrayBuffer()),
      mimetype: blob.type,
      size: blob.size,
    }
  }

  const [image1Doc, imageHero1Doc] = await Promise.all([
    payload.create({ collection: 'media', data: image1, file: await fetchFile(image1.url!), req }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: await fetchFile(imageHero1.url!),
      req,
    }),
  ])

  payload.logger.info('Seeding home page...')

  await payload.create({
    collection: 'pages',
    data: {
      slug: 'home',
      _status: 'published',
      title: 'Home',
      hero: {
        type: 'highImpact',
        title: 'Premium Ginger Products',
        description:
          'Experience the pure, natural taste of our handcrafted ginger products. From fiery ginger shots to smooth ginger teas — crafted for your health and enjoyment.',
        media: imageHero1Doc.id,
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
      layout: [
        {
          blockType: 'about',
          blockName: 'About',
          subtitle: 'ABOUT OUR STORY',
          title: 'Our Story',
          description1:
            'We source the finest ginger roots and craft them into premium products using traditional methods combined with modern quality standards.',
          mainImage: image1Doc.id,
          image2: image1Doc.id,
          image3: image1Doc.id,
          badgeTextPrimary: '15+',
          badgeTextSecondary: 'Years',
          image3BadgePrimary: '100%',
          image3BadgeSecondary: 'NATURAL',
          benefits: [
            { benefit: 'Sustainably sourced ingredients' },
            { benefit: 'No artificial preservatives' },
            { benefit: 'Cold-pressed extraction' },
            { benefit: 'Small-batch crafted' },
          ],
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Learn More',
            url: '#',
          },
        },
        {
          blockType: 'features',
          blockName: 'Features',
          subtitle: 'WHY CHOOSE US',
          title: 'Why Choose Gingers',
          features: [
            {
              icon: 'Leaf',
              title: '100% Natural',
              description: 'Only the finest natural ingredients, no fillers or additives.',
            },
            {
              icon: 'Shield',
              title: 'Quality Tested',
              description: 'Every batch is rigorously tested for purity and potency.',
            },
            {
              icon: 'Truck',
              title: 'Fresh Delivery',
              description: 'Delivered fresh to your door, preserving all the benefits.',
            },
          ],
        },
        {
          blockType: 'stats',
          blockName: 'Stats',
          subtitle: 'BY THE NUMBERS',
          title: 'Numbers Speak',
          stats: [
            { value: '15+', label: 'Years of Experience' },
            { value: '50K+', label: 'Customers Served' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '30+', label: 'Countries Shipped' },
          ],
          image: image1Doc.id,
          floatingQuote: {
            quoteText: 'The best ginger products I have ever tasted.',
            authorName: 'Jane Doe',
            authorRole: 'Loyal Customer',
            authorInitials: 'JD',
          },
        },
      ],
      meta: {
        description: 'Premium handcrafted ginger products — shots, teas, and more.',
        title: 'Gingers — Premium Ginger Products',
      },
    },
    req,
  })

  payload.logger.info('Seeding header...')

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { link: { type: 'custom', url: '/', label: 'Home' } },
        { link: { type: 'custom', url: '#products', label: 'Products' } },
        { link: { type: 'custom', url: '#about', label: 'About' } },
        { link: { type: 'custom', url: '#contact', label: 'Contact' } },
      ],
    },
    req,
  })

  payload.logger.info('Seed complete.')
}
