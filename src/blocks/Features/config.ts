import type { Block } from 'payload'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'WHY CHOOSE US',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'What Makes Us Special',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: false,
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Leaf', value: 'Leaf' },
            { label: 'Shield', value: 'Shield' },
            { label: 'Truck', value: 'Truck' },
            { label: 'Award', value: 'Award' },
            { label: 'Heart', value: 'Heart' },
            { label: 'Users', value: 'Users' },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Features Blocks',
    singular: 'Features Block',
  },
}
