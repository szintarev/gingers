import type { Block } from 'payload'

export const Process: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',
  labels: {
    singular: 'Process Block',
    plural: 'Process Blocks',
  },
  fields: [
    {
      name: 'processLabel',
      type: 'text',
      label: 'Section Label',
      localized: true,
      defaultValue: 'OUR PROCESS',
      admin: {
        description: 'Small label shown above the title (e.g. "OUR PROCESS")',
        placeholder: 'OUR PROCESS',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
      required: true,
      defaultValue: 'From Farm to Door',
      admin: {
        placeholder: 'From Farm to Door',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
      admin: {
        description: 'Short paragraph shown below the title.',
        placeholder: 'Our process is simple, sustainable, and transparent.',
        rows: 3,
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Background Image',
      relationTo: 'media',
      admin: {
        description: 'Optional background image. Displayed at low opacity behind the content.',
      },
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      required: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        description: 'Add up to 4 process steps. Each step shows an icon, title and short description.',
        initCollapsed: false,
      },
      labels: {
        singular: 'Step',
        plural: 'Steps',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: true,
          options: [
            { label: '🌱 Sprout', value: 'Sprout' },
            { label: '🧪 Flask', value: 'FlaskConical' },
            { label: '📦 Package', value: 'Package' },
            { label: '⭐ Star', value: 'Star' },
          ],
        },
        {
          name: 'stepNumber',
          type: 'text',
          label: 'Step Number',
          defaultValue: '01',
          admin: {
            placeholder: '01',
            description: 'e.g. 01, 02, 03...',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Step Title',
          localized: true,
          required: true,
          admin: {
            placeholder: 'e.g. Harvesting',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Step Description',
          localized: true,
          required: true,
          admin: {
            placeholder: 'Brief description of this step...',
            rows: 2,
          },
        },
      ],
    },
  ],
}
