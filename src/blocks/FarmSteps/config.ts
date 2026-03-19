import type { Block } from 'payload'

export const FarmSteps: Block = {
  slug: 'farmSteps',
  interfaceName: 'FarmStepsBlock',
  fields: [
    {
      name: 'label',
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
      defaultValue:
        "We're committed to providing the highest quality ginger products with exceptional service and care",
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
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
          defaultValue: 'Leaf',
          options: [
            { label: 'Leaf (Organic)', value: 'Leaf' },
            { label: 'Shield (Quality)', value: 'ShieldCheck' },
            { label: 'Truck (Delivery)', value: 'Truck' },
            { label: 'Award (Winning)', value: 'Award' },
            { label: 'Heart (Health)', value: 'Heart' },
            { label: 'Users (Support)', value: 'Users' },
            { label: 'Sprout', value: 'Sprout' },
            { label: 'Flask', value: 'FlaskConical' },
            { label: 'Package', value: 'Package' },
            { label: 'Star', value: 'Star' },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Farm Steps Blocks',
    singular: 'Farm Steps Block',
  },
}
