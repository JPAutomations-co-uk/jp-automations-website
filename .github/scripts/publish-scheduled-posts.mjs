import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "../..")

const today = new Date().toISOString().slice(0, 10)
const config = JSON.parse(readFileSync(resolve(__dirname, "publish-config.json"), "utf-8"))

let changed = false

for (const entry of config) {
  if (entry.publishDate > today) continue

  const layoutPath = resolve(root, `app/blog/${entry.slug}/layout.tsx`)
  if (!existsSync(layoutPath)) {
    console.log(`⚠ Layout not found: ${layoutPath}`)
    continue
  }

  const layout = readFileSync(layoutPath, "utf-8")

  // Check if already published (robots block already removed)
  if (!layout.includes("index: false")) {
    console.log(`✓ Already published: ${entry.slug}`)
    continue
  }

  // Remove the robots block from layout.tsx
  const updatedLayout = layout.replace(
    /\s*robots:\s*\{\s*\n?\s*index:\s*false,\s*\n?\s*follow:\s*false,\s*\n?\s*\},?/,
    ""
  )
  writeFileSync(layoutPath, updatedLayout)
  console.log(`✅ Published: ${entry.slug} (removed robots noindex)`)

  // Add to sitemap.ts
  const sitemapPath = resolve(root, "app/sitemap.ts")
  const sitemap = readFileSync(sitemapPath, "utf-8")

  if (!sitemap.includes(entry.slug)) {
    const sitemapEntry = `    {
      url: \`\${base}/blog/${entry.slug}\`,
      lastModified: new Date("${entry.publishDate}"),
      changeFrequency: "monthly",
      priority: ${entry.sitemapPriority},
    },
    // SCHEDULED-BLOG-MARKER`

    const updatedSitemap = sitemap.replace("// SCHEDULED-BLOG-MARKER", sitemapEntry)
    writeFileSync(sitemapPath, updatedSitemap)
    console.log(`✅ Added to sitemap: ${entry.slug}`)
  }

  changed = true
}

if (!changed) {
  console.log("No posts to publish today.")
}
