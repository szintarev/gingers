import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import MetricsCharts, { type MetricsData } from './MetricsCharts'
import './index.scss'

async function fetchMetrics(): Promise<MetricsData> {
  const payload = await getPayload({ config })

  const { docs: orders } = await payload.find({
    collection: 'orders',
    limit: 10000,
    overrideAccess: true,
    select: { orderNumber: true, total: true, status: true, createdAt: true, items: true },
  })

  // KPIs
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((s, o) => s + (o.total ?? 0), 0)
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const ordersThisMonth = orders.filter((o) => new Date(o.createdAt) >= monthStart).length

  // Daily breakdown — last 30 days
  const days: Record<string, { orders: number; revenue: number }> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days[key] = { orders: 0, revenue: 0 }
  }
  for (const o of orders) {
    const key = new Date(o.createdAt).toISOString().slice(0, 10)
    if (days[key]) {
      days[key].orders++
      days[key].revenue += o.total ?? 0
    }
  }
  const dailyOrders = Object.entries(days).map(([date, v]) => ({ date: date.slice(5), ...v }))

  // Status counts
  const statusMap: Record<string, number> = {}
  for (const o of orders) {
    const s = o.status ?? 'pending'
    statusMap[s] = (statusMap[s] ?? 0) + 1
  }
  const statusCounts = Object.entries(statusMap).map(([status, count]) => ({ status, count }))

  // Top 5 products by revenue
  const productMap: Record<string, { revenue: number; qty: number }> = {}
  for (const o of orders) {
    if (!Array.isArray(o.items)) continue
    for (const item of o.items as { productName: string; subtotal: number; quantity: number }[]) {
      if (!productMap[item.productName]) productMap[item.productName] = { revenue: 0, qty: 0 }
      productMap[item.productName].revenue += item.subtotal ?? 0
      productMap[item.productName].qty += item.quantity ?? 0
    }
  }
  const topProducts = Object.entries(productMap)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return { kpis: { totalOrders, totalRevenue, avgOrderValue, ordersThisMonth }, dailyOrders, statusCounts, topProducts }
}

const BeforeDashboard: React.FC = async () => {
  const metrics = await fetchMetrics()
  return <MetricsCharts data={metrics} />
}

export default BeforeDashboard
