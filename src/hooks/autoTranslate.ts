import type { Block, CollectionAfterChangeHook, Field, Tab } from 'payload'

const TARGET_LOCALES = ['sr', 'hu', 'ru']

function collectBlockDefs(fields: Field[]): Block[] {
  const blocks: Block[] = []
  for (const field of fields) {
    if (field.type === 'blocks') {
      blocks.push(...field.blocks)
    } else if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        blocks.push(...collectBlockDefs(tab.fields))
      }
    } else if (field.type === 'group') {
      blocks.push(...collectBlockDefs(field.fields))
    } else if (field.type === 'array') {
      blocks.push(...collectBlockDefs(field.fields))
    }
  }
  return blocks
}

// Copies localized text/textarea fields from source into result,
// skipping any field that already has a value in `existing`.
function copyLocalizedFields(
  source: Record<string, any>,
  fields: Field[],
  existing: Record<string, any>,
  blockDefs: Block[],
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const field of fields) {
    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('name' in tab && tab.name) {
          const tabResult = copyLocalizedFields(
            source[tab.name] ?? {},
            tab.fields,
            existing[tab.name] ?? {},
            blockDefs,
          )
          if (Object.keys(tabResult).length > 0) {
            result[tab.name] = { ...(existing[tab.name] ?? {}), ...tabResult }
          }
        } else {
          Object.assign(
            result,
            copyLocalizedFields(source, (tab as Tab).fields, existing, blockDefs),
          )
        }
      }
      continue
    }

    if (!('name' in field)) continue
    const key = field.name
    const srcVal = source[key]
    const exVal = existing[key]

    if ((field.type === 'text' || field.type === 'textarea') && field.localized) {
      if (srcVal && !exVal) {
        result[key] = srcVal
      }
    } else if (field.type === 'richText') {
      // Skip — Lexical JSON structure is locale-independent in most cases
    } else if (field.type === 'group' && srcVal && typeof srcVal === 'object') {
      const groupResult = copyLocalizedFields(srcVal, field.fields, exVal ?? {}, blockDefs)
      if (Object.keys(groupResult).length > 0) {
        result[key] = { ...(exVal ?? {}), ...groupResult }
      }
    } else if (field.type === 'array' && Array.isArray(srcVal)) {
      const arrResults = srcVal.map((item, i) =>
        copyLocalizedFields(item, field.fields, exVal?.[i] ?? {}, blockDefs),
      )
      if (arrResults.some((r) => Object.keys(r).length > 0)) {
        result[key] = srcVal.map((item, i) => {
          const existingItem = exVal?.[i]
          // Use existing locale item as base to preserve its IDs — prevents Payload
          // from treating items as new rows and duplicating them.
          // For brand-new items (no existing locale counterpart), fall back to source.
          return existingItem
            ? { ...existingItem, ...arrResults[i] }
            : { ...item, ...arrResults[i] }
        })
      }
    } else if (field.type === 'blocks' && Array.isArray(srcVal)) {
      const blockResults = srcVal.map((blockData, i) => {
        const blockDef = blockDefs.find((b) => b.slug === blockData.blockType)
        if (!blockDef) return {}
        return copyLocalizedFields(blockData, blockDef.fields, exVal?.[i] ?? {}, blockDefs)
      })
      if (blockResults.some((r) => Object.keys(r).length > 0)) {
        result[key] = srcVal.map((item, i) => {
          const existingItem = exVal?.[i]
          return existingItem
            ? { ...existingItem, ...blockResults[i] }
            : { ...item, ...blockResults[i] }
        })
      }
    }
  }

  return result
}

export const autoTranslateHook: CollectionAfterChangeHook = async ({ doc, req, collection }) => {
  // Only trigger when saving the default (English) locale
  if (req.locale && req.locale !== 'en') return doc

  const blockDefs = collectBlockDefs(collection.fields)

  // Fire and forget — doesn't block the save response
  ;(async () => {
    for (const locale of TARGET_LOCALES) {
      try {
        const existing = (await req.payload.findByID({
          collection: collection.slug as Parameters<typeof req.payload.findByID>[0]['collection'],
          id: doc.id,
          locale: locale as 'en' | 'sr' | 'hu' | 'ru',
          overrideAccess: true,
        })) as Record<string, any>

        const data = copyLocalizedFields(doc, collection.fields, existing ?? {}, blockDefs)
        if (Object.keys(data).length === 0) continue

        await req.payload.update({
          collection: collection.slug as Parameters<typeof req.payload.update>[0]['collection'],
          id: doc.id,
          locale: locale as 'en' | 'sr' | 'hu' | 'ru',
          data,
          overrideAccess: true,
        })
      } catch (err) {
        req.payload.logger.error(`[copyLocales] ${locale} failed: ${err}`)
      }
    }
  })()

  return doc
}
