import type { Block } from 'payload'

export const Partnership: Block = {
  slug: 'partnership',
  interfaceName: 'PartnershipBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      defaultValue: 'Become a Partner',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
  labels: {
    plural: 'Partnership Blocks',
    singular: 'Partnership Block',
  },
}
