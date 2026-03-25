'use client'

import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export type MetricsData = {
  kpis: { totalOrders: number; totalRevenue: number; avgOrderValue: number; ordersThisMonth: number }
  dailyOrders: { date: string; orders: number; revenue: number }[]
  statusCounts: { status: string; count: number }[]
  topProducts: { name: string; revenue: number; qty: number }[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
}

function EChart({
  option,
  height = 260,
}: {
  option: echarts.EChartsOption
  height?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current, undefined, { renderer: 'svg' })
    chart.setOption(option)
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(ref.current)
    return () => {
      ro.disconnect()
      chart.dispose()
    }
  }, [option])
  return <div ref={ref} style={{ width: '100%', height }} />
}

export default function MetricsCharts({ data }: { data: MetricsData }) {
  const { kpis, dailyOrders, statusCounts, topProducts } = data

  const dates = dailyOrders.map((d) => d.date)

  const ordersOverTime: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 16, top: 16, bottom: 40 },
    xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        name: 'Orders',
        type: 'bar',
        data: dailyOrders.map((d) => d.orders),
        itemStyle: { color: '#8B1538', borderRadius: [4, 4, 0, 0] },
      },
    ],
  }

  const revenueOverTime: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', valueFormatter: (v: unknown) => `€${Number(v).toFixed(2)}` },
    grid: { left: 56, right: 16, top: 16, bottom: 40 },
    xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => `€${v}` } },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        smooth: true,
        data: dailyOrders.map((d) => d.revenue),
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(139,21,56,0.25)' }, { offset: 1, color: 'rgba(139,21,56,0)' }] } },
        lineStyle: { color: '#8B1538', width: 2 },
        itemStyle: { color: '#8B1538' },
        symbol: 'none',
      },
    ],
  }

  const statusPie: echarts.EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center', textStyle: { fontSize: 11 } },
    series: [
      {
        type: 'pie',
        radius: ['40%', '68%'],
        center: ['50%', '44%'],
        data: statusCounts.map((s) => ({
          name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
          value: s.count,
          itemStyle: { color: STATUS_COLORS[s.status] ?? '#94a3b8' },
        })),
        label: { show: false },
      },
    ],
  }

  const topProductsChart: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', valueFormatter: (v: unknown) => `€${Number(v).toFixed(2)}` },
    grid: { left: 140, right: 16, top: 8, bottom: 32 },
    xAxis: { type: 'value', axisLabel: { formatter: (v: number) => `€${v}` } },
    yAxis: { type: 'category', data: topProducts.map((p) => p.name).reverse(), axisLabel: { fontSize: 11, width: 120, overflow: 'truncate' } },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: topProducts.map((p) => p.revenue).reverse(),
        itemStyle: { color: '#8B1538', borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', formatter: (p: unknown) => `€${Number((p as { value: number }).value).toFixed(0)}`, fontSize: 11 },
      },
    ],
  }

  const card = (label: string, value: string, sub?: string) => (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 22px', flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
    </div>
  )

  const panel = (title: string, children: React.ReactNode) => (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '18px 22px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  )

  return (
    <div style={{ padding: '4px 0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Order Metrics</div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {card('Total Orders', String(kpis.totalOrders))}
        {card('Total Revenue', `€${kpis.totalRevenue.toFixed(2)}`)}
        {card('Avg Order Value', `€${kpis.avgOrderValue.toFixed(2)}`)}
        {card('This Month', String(kpis.ordersThisMonth), 'orders')}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {panel('Orders (last 30 days)', <EChart option={ordersOverTime} />)}
        {panel('Revenue (last 30 days)', <EChart option={revenueOverTime} />)}
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
        {panel('Orders by Status', <EChart option={statusPie} height={240} />)}
        {panel('Top Products by Revenue', <EChart option={topProductsChart} height={topProducts.length > 0 ? Math.max(180, topProducts.length * 40) : 180} />)}
      </div>
    </div>
  )
}
