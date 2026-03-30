import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

/*==================================================================
    ORDERS COLLECTION
    Stores customer orders. Created publicly via /api/order route.
    Read/update/delete restricted to authenticated admins.
==================================================================*/
export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'customerEmail', 'total', 'status', 'createdAt'],
    group: 'Shop',
  },
  timestamps: true,
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'idempotencyKey',
      type: 'text',
      index: true,
      unique: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Customer',
      fields: [
        { type: 'row', fields: [
          { name: 'customerName', type: 'text', required: true, admin: { readOnly: true, width: '50%' } },
          { name: 'customerEmail', type: 'email', required: true, admin: { readOnly: true, width: '50%' } },
        ]},
        { type: 'row', fields: [
          { name: 'customerPhone', type: 'text', admin: { readOnly: true, width: '50%' } },
          { name: 'customerCountry', type: 'text', admin: { readOnly: true, width: '50%' } },
        ]},
        { type: 'row', fields: [
          { name: 'customerCity', type: 'text', admin: { readOnly: true, width: '33%' } },
          { name: 'customerState', type: 'text', admin: { readOnly: true, width: '33%' } },
          { name: 'customerPostal', type: 'text', admin: { readOnly: true, width: '33%' } },
        ]},
        { name: 'customerAddress', type: 'text', admin: { readOnly: true } },
        { name: 'customerNotes', type: 'textarea', admin: { readOnly: true } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        { name: 'productName', type: 'text', required: true },
        { name: 'productImage', type: 'text' },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'unitPrice', type: 'number', required: true },
        { name: 'subtotal', type: 'number', required: true },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
  ],
}
