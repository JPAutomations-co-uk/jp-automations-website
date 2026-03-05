// Client-side ad rendering: HTML string → PNG blob via hidden iframe + html-to-image

export async function renderAdToImage(
  html: string,
  width: number,
  height: number
): Promise<Blob> {
  const { toPng } = await import("html-to-image")

  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe")
    iframe.style.position = "fixed"
    iframe.style.left = "-9999px"
    iframe.style.top = "0"
    iframe.style.width = `${width}px`
    iframe.style.height = `${height}px`
    iframe.style.border = "none"
    iframe.style.overflow = "hidden"
    iframe.style.visibility = "hidden"
    document.body.appendChild(iframe)

    const cleanup = () => {
      try { document.body.removeChild(iframe) } catch { /* noop */ }
    }

    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error("Render timed out"))
    }, 20000)

    iframe.onload = async () => {
      try {
        const doc = iframe.contentDocument
        if (!doc) throw new Error("No iframe document")

        // Wait for fonts + background image to load
        if (doc.fonts) await doc.fonts.ready
        await new Promise(r => setTimeout(r, 800))

        const body = doc.body
        if (!body) throw new Error("No body in iframe")
        body.style.margin = "0"
        body.style.padding = "0"
        body.style.overflow = "hidden"

        const dataUrl = await toPng(body, {
          width,
          height,
          pixelRatio: 2,
          skipAutoScale: true,
          fetchRequestInit: { mode: "cors" },
        })

        clearTimeout(timeout)
        cleanup()

        const res = await fetch(dataUrl)
        const blob = await res.blob()
        resolve(blob)
      } catch (err) {
        clearTimeout(timeout)
        cleanup()
        reject(err)
      }
    }

    const doc = iframe.contentDocument
    if (doc) {
      doc.open()
      doc.write(html)
      doc.close()
    } else {
      clearTimeout(timeout)
      cleanup()
      reject(new Error("Cannot access iframe document"))
    }
  })
}

export async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadAllSlides(
  htmlStrings: string[],
  width: number,
  height: number,
  prefix: string
) {
  for (let i = 0; i < htmlStrings.length; i++) {
    const blob = await renderAdToImage(htmlStrings[i], width, height)
    await downloadBlob(blob, `${prefix}_slide_${i + 1}.png`)
    if (i < htmlStrings.length - 1) {
      await new Promise(r => setTimeout(r, 300))
    }
  }
}
