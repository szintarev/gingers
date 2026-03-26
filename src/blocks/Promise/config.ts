import type { Block } from 'payload'

export const PromiseBlock: Block = {
  slug: 'promise',
  interfaceName: 'PromiseBlock',
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
      defaultValue: 'QUALITY PROMISE',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Crafted with Care, Delivered with Excellence',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: false,
    },
  ],
  labels: {
    plural: 'Promise Blocks',
    singular: 'Promise Block',
  },
}
