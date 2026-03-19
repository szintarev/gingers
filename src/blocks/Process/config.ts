import type { Block } from 'payload'

export const Process: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',
  fields: [
    {
      name: 'processLabel',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'OUR PROCESS',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'From Farm to Door',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: true,
      defaultValue: 'Our process is simple, sustainable, and transparent.',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
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
          name: 'stepNumber',
          type: 'text',
          required: true,
          defaultValue: '01',
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
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
    plural: 'Process Blocks',
    singular: 'Process Block',
  },
}
