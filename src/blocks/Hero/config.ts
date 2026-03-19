import type { Block } from 'payload'

import { link } from '@/fields/link'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Premium Ginger Products',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: true,
      defaultValue: 'Experience the pure, natural taste of our handcrafted ginger products...',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        link({
          appearances: ['default', 'outline'],
        }),
      ],
    },
    {
      name: 'features',
      type: 'array',
      maxRows: 3,
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
          required: false,
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Award', value: 'Award' },
            { label: 'Leaf', value: 'Leaf' },
            { label: 'Heart', value: 'Heart' },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Hero Blocks',
    singular: 'Hero Block',
  },
}
