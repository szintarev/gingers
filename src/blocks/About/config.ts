import type { Block } from 'payload'

import { link } from '@/fields/link'

export const About: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'ABOUT OUR STORY',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Pure & Natural Since 2020',
    },
    {
      name: 'description1',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'description2',
      type: 'textarea',
      localized: true,
      required: false,
    },
    {
      name: 'benefits',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'benefit',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'badgeTextPrimary',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: '6+ Years',
    },
    {
      name: 'badgeTextSecondary',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Of Excellence',
    },
    {
      name: 'image2',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'image3',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'image3BadgePrimary',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: '100%',
    },
    {
      name: 'image3BadgeSecondary',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'NATURAL',
    },
    link({
      appearances: ['default', 'outline'],
    }),
  ],
  labels: {
    plural: 'About Blocks',
    singular: 'About Block',
  },
}
