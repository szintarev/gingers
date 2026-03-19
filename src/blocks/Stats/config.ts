import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'BY THE NUMBERS',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Trusted By Thousands',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: false,
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'floatingQuote',
      type: 'group',
      fields: [
        {
          name: 'quoteText',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'authorName',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'authorRole',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'authorInitials',
          type: 'text',
          localized: true,
          required: true,
          maxLength: 2,
        },
      ],
    },
  ],
  labels: {
    plural: 'Stats Blocks',
    singular: 'Stats Block',
  },
}
