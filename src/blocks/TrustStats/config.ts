import type { Block } from 'payload'

export const TrustStatsBlock: Block = {
  slug: 'trustStats',
  interfaceName: 'TrustStatsBlock',
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
      defaultValue: 'BY THE NUMBERS',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Trusted by Thousands Worldwide',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'quoteText',
      type: 'textarea',
      localized: true,
      required: false,
    },
    {
      name: 'quotePersonName',
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'quotePersonTitle',
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'stats',
      type: 'array',
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
  ],
  labels: {
    plural: 'Trust Stats Blocks',
    singular: 'Trust Stats Block',
  },
}
