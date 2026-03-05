// Ad creative HTML templates — redesigned with AI background image support
// Each function returns a complete self-contained HTML string ready for browser rendering

export interface BrandVars {
  primary_color: string
  secondary_color: string
  accent_color: string
  text_light: string
  text_dark: string
  bg_color: string
  heading_font: string
  body_font: string
  brand_name: string
  background_image_url?: string
}

export interface SlideData {
  slide_num: number
  type: string
  headline: string
  body: string
  cta: string
}

export interface SingleCopyData {
  headline: string
  subheadline?: string
  body: string
  cta: string
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function encFont(font: string): string {
  return encodeURIComponent(font)
}

function indicator(current: number, total: number): string {
  const dots = Array.from({ length: total }, (_, i) => {
    const cls = i + 1 === current ? "dot active" : "dot"
    return `<span class="${cls}"></span>`
  }).join("")
  return `<div class="slide-indicator">${dots}</div>`
}

function cssVars(v: BrandVars): string {
  return `--primary: ${v.primary_color};
            --secondary: ${v.secondary_color};
            --accent: ${v.accent_color};
            --text-light: ${v.text_light};
            --text-dark: ${v.text_dark};
            --bg: ${v.bg_color};
            --font-heading: '${v.heading_font}', 'Inter', sans-serif;
            --font-body: '${v.body_font}', 'Inter', sans-serif;`
}

// Returns inline style string for slide/ad background
function bgStyle(v: BrandVars): string {
  if (v.background_image_url) {
    const safeUrl = v.background_image_url.replace(/'/g, "%27")
    return `background-image: url('${safeUrl}'); background-size: cover; background-position: center;`
  }
  // Refined fallback: radial gradient mesh instead of flat gradient
  return `background: radial-gradient(ellipse at 30% 20%, ${v.primary_color} 0%, ${v.secondary_color} 50%, #080810 100%);`
}

function htmlHead(v: BrandVars, width: number, height: number, css: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${width}, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${encFont(v.heading_font)}:wght@400;600;700;800;900&family=${encFont(v.body_font)}:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            ${cssVars(v)}
        }
        html, body {
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
        }
        ${css}
    </style>
</head>`
}

// Shared base CSS used by all carousel templates
function sharedCSS(width: number, height: number): string {
  return `
        .slide {
            width: ${width}px; height: ${height}px;
            position: relative; overflow: hidden;
        }
        .scrim {
            position: absolute; inset: 0; pointer-events: none;
        }
        .content {
            position: relative; z-index: 2;
            width: 100%; height: 100%;
            display: flex; flex-direction: column; justify-content: center;
            padding: 72px 64px;
        }
        .content.center { align-items: center; text-align: center; }
        .content.left { align-items: flex-start; }
        .slide-indicator {
            position: absolute; bottom: 36px; left: 64px;
            display: flex; gap: 6px; z-index: 3;
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); }
        .dot.active { background: rgba(255,255,255,0.95); width: 24px; border-radius: 4px; }
        .brand-tag {
            position: absolute; bottom: 36px; right: 64px;
            font-family: var(--font-heading); font-weight: 700; font-size: 13px;
            letter-spacing: 0.12em; text-transform: uppercase;
            color: rgba(255,255,255,0.45); z-index: 3;
        }
        .headline {
            font-family: var(--font-heading); font-weight: 900;
            font-size: clamp(44px, 6.5vw, 68px); line-height: 1.05;
            color: #fff; text-transform: uppercase; letter-spacing: -0.02em;
        }
        .headline.normal {
            text-transform: none; letter-spacing: -0.01em;
            font-size: clamp(36px, 5vw, 52px);
        }
        .body {
            font-family: var(--font-body); font-weight: 400;
            font-size: clamp(18px, 2.4vw, 24px); line-height: 1.55;
            color: rgba(255,255,255,0.9); margin-top: 16px;
        }
        .tag {
            display: inline-flex; align-items: center;
            padding: 8px 20px; border-radius: 6px;
            font-family: var(--font-heading); font-weight: 700;
            font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;
            margin-bottom: 24px;
        }
        .tag.accent { background: var(--accent); color: #fff; }
        .tag.red { background: #dc3545; color: #fff; }
        .tag.green { background: #28a745; color: #fff; }
        .tag.outline { border: 1.5px solid rgba(255,255,255,0.55); color: rgba(255,255,255,0.9); background: transparent; }
        .accent-bar { width: 56px; height: 4px; background: var(--accent); border-radius: 2px; margin-top: 28px; }
        .cta-btn {
            display: inline-block; padding: 18px 48px;
            background: var(--accent); color: #fff;
            font-family: var(--font-heading); font-weight: 700; font-size: 17px;
            letter-spacing: 0.08em; text-transform: uppercase;
            border-radius: 6px; border: none; margin-top: 32px;
        }
        .cta-btn.outline {
            background: transparent;
            border: 2px solid rgba(255,255,255,0.8);
            color: #fff;
        }
  `
}

// ============================================================
// CAROUSEL: HOOK → PROBLEM → CTA
// ============================================================

export function carouselHookProblemCta(
  v: BrandVars, slide: SlideData, slideNum: number, totalSlides: number,
  width: number, height: number
): string {
  const ind = indicator(slideNum, totalSlides)
  const h = esc(slide.headline)
  const b = esc(slide.body)
  const c = esc(slide.cta)

  const bg = bgStyle(v)

  let scrimStyle: string
  let contentClass: string
  let content: string

  switch (slide.type) {
    case "hook":
      scrimStyle = "background: linear-gradient(160deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.58) 100%);"
      contentClass = "center"
      content = `<div class="headline">${h}</div><div class="accent-bar" style="margin: 28px auto 0;"></div>`
      break
    case "problem":
      scrimStyle = "background: linear-gradient(160deg, rgba(90,15,15,0.65) 0%, rgba(60,8,8,0.72) 100%);"
      contentClass = "left"
      content = `<div class="tag red">Problem</div><div class="headline normal">${h}</div><div class="body">${b}</div>`
      break
    case "solution":
      scrimStyle = "background: linear-gradient(160deg, rgba(10,55,20,0.60) 0%, rgba(8,45,15,0.68) 100%);"
      contentClass = "left"
      content = `<div class="tag green">Solution</div><div class="headline normal">${h}</div><div class="body">${b}</div>`
      break
    case "cta":
      scrimStyle = "background: rgba(0,0,0,0.70);"
      contentClass = "center"
      content = `<div class="headline">${h}</div><div class="body">${b}</div><div class="cta-btn">${c}</div>`
      break
    default:
      scrimStyle = "background: rgba(0,0,0,0.60);"
      contentClass = "left"
      content = `<div class="headline normal">${h}</div><div class="body">${b}</div>`
  }

  const css = sharedCSS(width, height)

  return `${htmlHead(v, width, height, css)}
<body>
    <div class="slide" style="${bg}">
        <div class="scrim" style="${scrimStyle}"></div>
        <div class="content ${contentClass}">${content}</div>
        <div class="brand-tag">${esc(v.brand_name)}</div>
        ${ind}
    </div>
</body>
</html>`
}

// ============================================================
// CAROUSEL: LISTICLE
// ============================================================

export function carouselListicle(
  v: BrandVars, slide: SlideData, slideNum: number, totalSlides: number,
  width: number, height: number
): string {
  const ind = indicator(slideNum, totalSlides)
  const h = esc(slide.headline)
  const b = esc(slide.body)
  const c = esc(slide.cta)
  const bg = bgStyle(v)

  let scrimStyle: string
  let contentClass: string
  let content: string

  switch (slide.type) {
    case "hook": {
      const numMatch = slide.headline.match(/\d+/)
      const bigNum = numMatch ? numMatch[0] : String(totalSlides - 1)
      scrimStyle = "background: rgba(0,0,0,0.52);"
      contentClass = "center"
      content = `
        <div style="font-family: var(--font-heading); font-weight: 900; font-size: 180px; line-height: 0.85; color: var(--accent); opacity: 0.92; margin-bottom: 12px;">${bigNum}</div>
        <div class="headline" style="font-size: clamp(32px, 5vw, 48px);">${h}</div>`
      break
    }
    case "list_item": {
      const itemNum = slideNum - 1
      scrimStyle = "background: rgba(0,0,0,0.65);"
      contentClass = "left"
      content = `
        <div style="width: 68px; height: 68px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-weight: 900; font-size: 32px; color: #fff; margin-bottom: 28px; flex-shrink: 0;">${itemNum}</div>
        <div class="headline normal">${h}</div>
        <div class="body">${b}</div>`
      break
    }
    case "cta":
      scrimStyle = "background: rgba(0,0,0,0.70);"
      contentClass = "center"
      content = `<div class="headline">${h}</div><div class="body">${b}</div><div class="cta-btn">${c}</div>`
      break
    default:
      scrimStyle = "background: rgba(0,0,0,0.60);"
      contentClass = "left"
      content = `<div class="headline normal">${h}</div><div class="body">${b}</div>`
  }

  const css = sharedCSS(width, height)

  return `${htmlHead(v, width, height, css)}
<body>
    <div class="slide" style="${bg}">
        <div class="scrim" style="${scrimStyle}"></div>
        <div class="content ${contentClass}">${content}</div>
        <div class="brand-tag">${esc(v.brand_name)}</div>
        ${ind}
    </div>
</body>
</html>`
}

// ============================================================
// CAROUSEL: BEFORE & AFTER
// ============================================================

export function carouselBeforeAfter(
  v: BrandVars, slide: SlideData, slideNum: number, totalSlides: number,
  width: number, height: number
): string {
  const ind = indicator(slideNum, totalSlides)
  const h = esc(slide.headline)
  const b = esc(slide.body)
  const c = esc(slide.cta)
  const bg = bgStyle(v)

  let scrimContent: string
  let contentClass: string
  let content: string

  switch (slide.type) {
    case "hook":
      // Split tinted overlay: red-left, green-right
      scrimContent = `
        <div style="position:absolute;top:0;left:0;width:50%;height:100%;background:rgba(90,15,15,0.65);"></div>
        <div style="position:absolute;top:0;right:0;width:50%;height:100%;background:rgba(10,60,20,0.62);"></div>
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.25);"></div>`
      contentClass = "center"
      content = `
        <div style="display:flex;width:100%;justify-content:space-around;margin-bottom:28px;">
          <span style="font-family:var(--font-heading);font-weight:900;font-size:22px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.7);">Before</span>
          <span style="font-family:var(--font-heading);font-weight:900;font-size:22px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.7);">After</span>
        </div>
        <div class="headline">${h}</div>`
      break
    case "before":
      scrimContent = `<div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(90,15,15,0.68) 0%,rgba(60,8,8,0.75) 100%);"></div>`
      contentClass = "left"
      content = `<div class="tag red">Before</div><div class="headline normal">${h}</div><div class="body">${b}</div>`
      break
    case "bridge":
      scrimContent = `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.65);"></div>`
      contentClass = "center"
      content = `<div class="headline normal">${h}</div><div class="body">${b}</div>`
      break
    case "after":
      scrimContent = `<div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(10,60,20,0.63) 0%,rgba(8,48,15,0.70) 100%);"></div>`
      contentClass = "left"
      content = `<div class="tag green">After</div><div class="headline normal">${h}</div><div class="body">${b}</div>`
      break
    case "cta":
      scrimContent = `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.70);"></div>`
      contentClass = "center"
      content = `<div class="headline">${h}</div><div class="body">${b}</div><div class="cta-btn">${c}</div>`
      break
    default:
      scrimContent = `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.60);"></div>`
      contentClass = "left"
      content = `<div class="headline normal">${h}</div><div class="body">${b}</div>`
  }

  const css = sharedCSS(width, height)

  return `${htmlHead(v, width, height, css)}
<body>
    <div class="slide" style="${bg}">
        ${scrimContent}
        <div class="content ${contentClass}" style="position:relative;z-index:2;">${content}</div>
        <div class="brand-tag">${esc(v.brand_name)}</div>
        ${ind}
    </div>
</body>
</html>`
}

// ============================================================
// CAROUSEL: TESTIMONIAL
// ============================================================

export function carouselTestimonial(
  v: BrandVars, slide: SlideData, slideNum: number, totalSlides: number,
  width: number, height: number
): string {
  const ind = indicator(slideNum, totalSlides)
  const h = esc(slide.headline)
  const b = esc(slide.body)
  const c = esc(slide.cta)
  const bg = bgStyle(v)

  let scrimStyle: string
  let contentClass: string
  let content: string

  switch (slide.type) {
    case "hook":
      scrimStyle = "background: rgba(0,0,0,0.58);"
      contentClass = "center"
      content = `
        <div style="font-family:Georgia,serif;font-size:160px;line-height:0.55;color:var(--accent);opacity:0.85;margin-bottom:20px;">&ldquo;</div>
        <div style="font-family:var(--font-body);font-weight:400;font-style:italic;font-size:clamp(26px,3.8vw,38px);line-height:1.45;color:#fff;margin-bottom:28px;">${h}</div>
        <div style="font-family:var(--font-heading);font-weight:600;font-size:15px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.6);">${b}</div>`
      break
    case "context":
      scrimStyle = "background: rgba(0,0,0,0.62);"
      contentClass = "left"
      content = `<div class="tag accent">Their Story</div><div class="headline normal">${h}</div><div class="body">${b}</div>`
      break
    case "challenge":
      scrimStyle = "background: linear-gradient(160deg,rgba(80,15,15,0.68) 0%,rgba(55,8,8,0.75) 100%);"
      contentClass = "left"
      content = `<div class="tag outline">The Challenge</div><div class="headline normal">${h}</div><div class="body">${b}</div>`
      break
    case "result":
      scrimStyle = "background: rgba(0,0,0,0.60);"
      contentClass = "center"
      content = `
        <div style="font-family:var(--font-heading);font-weight:900;font-size:clamp(64px,10vw,96px);line-height:1;color:var(--accent);margin-bottom:16px;">${h}</div>
        <div class="body">${b}</div>`
      break
    case "cta": {
      const stars = "&#9733;&#9733;&#9733;&#9733;&#9733;"
      scrimStyle = "background: rgba(0,0,0,0.70);"
      contentClass = "center"
      content = `
        <div style="font-size:30px;color:#FFD700;letter-spacing:5px;margin-bottom:28px;">${stars}</div>
        <div class="headline" style="font-size:clamp(36px,5.5vw,56px);">${h}</div>
        <div class="body">${b}</div>
        <div class="cta-btn outline">${c}</div>`
      break
    }
    default:
      scrimStyle = "background: rgba(0,0,0,0.62);"
      contentClass = "left"
      content = `<div class="headline normal">${h}</div><div class="body">${b}</div>`
  }

  const css = sharedCSS(width, height)

  return `${htmlHead(v, width, height, css)}
<body>
    <div class="slide" style="${bg}">
        <div class="scrim" style="${scrimStyle}"></div>
        <div class="content ${contentClass}">${content}</div>
        <div class="brand-tag">${esc(v.brand_name)}</div>
        ${ind}
    </div>
</body>
</html>`
}

// ============================================================
// CAROUSEL: EDUCATIONAL
// ============================================================

export function carouselEducational(
  v: BrandVars, slide: SlideData, slideNum: number, totalSlides: number,
  width: number, height: number
): string {
  const ind = indicator(slideNum, totalSlides)
  const h = esc(slide.headline)
  const b = esc(slide.body)
  const c = esc(slide.cta)
  const bg = bgStyle(v)

  let scrimStyle: string
  let contentClass: string
  let content: string

  switch (slide.type) {
    case "hook":
      scrimStyle = "background: rgba(0,0,0,0.55);"
      contentClass = "center"
      content = `<div class="tag accent">Framework</div><div class="headline">${h}</div><div class="body">${b}</div>`
      break
    case "step": {
      const stepNum = slideNum - 1
      scrimStyle = "background: rgba(0,0,0,0.65);"
      contentClass = "left"
      content = `
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-weight:900;font-size:30px;color:#fff;flex-shrink:0;">${stepNum}</div>
          <div style="font-family:var(--font-heading);font-weight:600;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.55);">Step ${stepNum}</div>
        </div>
        <div class="headline normal">${h}</div>
        <div class="body">${b}</div>
        <div style="width:100%;height:1px;background:rgba(255,255,255,0.12);margin-top:36px;"></div>`
      break
    }
    case "cta":
      scrimStyle = "background: rgba(0,0,0,0.70);"
      contentClass = "center"
      content = `<div class="headline">${h}</div><div class="body">${b}</div><div class="cta-btn">${c}</div>`
      break
    default:
      scrimStyle = "background: rgba(0,0,0,0.62);"
      contentClass = "left"
      content = `<div class="headline normal">${h}</div><div class="body">${b}</div>`
  }

  const css = sharedCSS(width, height)

  return `${htmlHead(v, width, height, css)}
<body>
    <div class="slide" style="${bg}">
        <div class="scrim" style="${scrimStyle}"></div>
        <div class="content ${contentClass}">${content}</div>
        <div class="brand-tag">${esc(v.brand_name)}</div>
        ${ind}
    </div>
</body>
</html>`
}

// ============================================================
// SINGLE: HERO OFFER
// ============================================================

export function singleHeroOffer(
  v: BrandVars, copy: SingleCopyData, width: number, height: number
): string {
  const bg = bgStyle(v)

  const css = `
        .ad {
            width: ${width}px; height: ${height}px;
            position: relative; overflow: hidden;
        }
        .scrim {
            position: absolute; inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.82) 100%);
            pointer-events: none;
        }
        .content {
            position: relative; z-index: 2;
            width: 100%; height: 100%;
            display: flex; flex-direction: column; justify-content: flex-end;
            padding: 72px 64px;
        }
        .headline {
            font-family: var(--font-heading); font-weight: 900;
            font-size: clamp(48px, 7vw, 72px); line-height: 1.02;
            color: #fff; text-transform: uppercase; letter-spacing: -0.02em; margin-bottom: 16px;
        }
        .subheadline {
            font-family: var(--font-body); font-weight: 400;
            font-size: clamp(18px, 2.6vw, 26px); line-height: 1.45;
            color: rgba(255,255,255,0.82); margin-bottom: 36px; max-width: 85%;
        }
        .cta-btn {
            display: inline-block; padding: 20px 52px;
            background: var(--accent); color: #fff;
            font-family: var(--font-heading); font-weight: 700; font-size: 17px;
            letter-spacing: 0.1em; text-transform: uppercase; border-radius: 6px;
        }
        .brand-tag {
            position: absolute; top: 40px; left: 64px; z-index: 3;
            font-family: var(--font-heading); font-weight: 800; font-size: 14px;
            letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.6);
        }
  `

  return `${htmlHead(v, width, height, css)}
<body>
    <div class="ad" style="${bg}">
        <div class="scrim"></div>
        <div class="brand-tag">${esc(v.brand_name)}</div>
        <div class="content">
            <div class="headline">${esc(copy.headline)}</div>
            <div class="subheadline">${esc(copy.subheadline || "")}</div>
            <div class="cta-btn">${esc(copy.cta)}</div>
        </div>
    </div>
</body>
</html>`
}

// ============================================================
// SINGLE: SOCIAL PROOF
// ============================================================

export function singleSocialProof(
  v: BrandVars, copy: SingleCopyData, width: number, height: number
): string {
  const bodyStr = copy.body || ""
  const parts = bodyStr.includes(",") ? bodyStr.split(",") : bodyStr.split("\n")
  const customerName = (parts[0] || "Happy Customer").trim()
  const customerTitle = (parts[1] || "").trim()
  const bg = bgStyle(v)

  const css = `
        .ad {
            width: ${width}px; height: ${height}px;
            position: relative; overflow: hidden;
        }
        .scrim {
            position: absolute; inset: 0;
            background: rgba(0,0,0,0.58);
            pointer-events: none;
        }
        .content {
            position: relative; z-index: 2;
            width: 100%; height: 100%;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            padding: 72px 64px; text-align: center;
        }
        .card {
            background: rgba(255,255,255,0.13);
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 20px;
            padding: 52px 48px;
            display: flex; flex-direction: column; align-items: center;
            width: 100%;
        }
        .quote-mark {
            font-family: Georgia, serif; font-size: 120px; line-height: 0.5;
            color: var(--accent); opacity: 0.9; margin-bottom: 20px;
        }
        .quote {
            font-family: var(--font-body); font-weight: 400; font-style: italic;
            font-size: clamp(22px, 3.2vw, 32px); line-height: 1.5;
            color: #fff; margin-bottom: 32px;
        }
        .stars { font-size: 26px; color: #FFD700; letter-spacing: 5px; margin-bottom: 24px; }
        .customer-name {
            font-family: var(--font-heading); font-weight: 700; font-size: 17px;
            color: #fff; letter-spacing: 0.04em;
        }
        .customer-title {
            font-family: var(--font-body); font-weight: 400; font-size: 14px;
            color: rgba(255,255,255,0.65); margin-top: 4px;
        }
        .divider {
            width: 36px; height: 2px; background: var(--accent);
            margin: 20px 0; opacity: 0.8;
        }
        .cta {
            font-family: var(--font-heading); font-weight: 600; font-size: 14px;
            letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent);
        }
  `

  return `${htmlHead(v, width, height, css)}
<body>
    <div class="ad" style="${bg}">
        <div class="scrim"></div>
        <div class="content">
            <div class="card">
                <div class="quote-mark">&ldquo;</div>
                <div class="quote">${esc(copy.headline)}</div>
                <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <div class="customer-name">${esc(customerName)}</div>
                <div class="customer-title">${esc(customerTitle)}</div>
                <div class="divider"></div>
                <div class="cta">${esc(copy.cta)}</div>
            </div>
        </div>
    </div>
</body>
</html>`
}

// ============================================================
// SINGLE: PRODUCT FEATURE
// ============================================================

export function singleProductFeature(
  v: BrandVars, copy: SingleCopyData, width: number, height: number
): string {
  const bodyStr = copy.body || ""
  let bullets: string[]
  if (bodyStr.includes("\n")) {
    bullets = bodyStr.split("\n").map(b => b.trim().replace(/^[-*]\s*/, "")).filter(Boolean)
  } else {
    bullets = [bodyStr]
  }
  if (bullets.length === 0) bullets = ["Feature 1"]

  const featuresHtml = bullets.slice(0, 5).map(b =>
    `<li class="feature-item">
      <div class="feature-check"></div>
      <span class="feature-text">${esc(b)}</span>
    </li>`
  ).join("")

  const bg = bgStyle(v)

  const css = `
        .ad {
            width: ${width}px; height: ${height}px;
            position: relative; overflow: hidden;
        }
        .scrim {
            position: absolute; inset: 0;
            background: rgba(0,0,0,0.60);
            pointer-events: none;
        }
        .content {
            position: relative; z-index: 2;
            width: 100%; height: 100%;
            display: flex; flex-direction: column; justify-content: center;
            padding: 72px 64px;
        }
        .card {
            background: rgba(0,0,0,0.50);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 20px;
            padding: 52px 48px;
        }
        .headline {
            font-family: var(--font-heading); font-weight: 900;
            font-size: clamp(34px, 4.8vw, 50px); line-height: 1.1;
            color: #fff; margin-bottom: 32px;
        }
        .features { list-style: none; margin-bottom: 36px; }
        .feature-item {
            display: flex; align-items: flex-start; gap: 16px; margin-bottom: 18px;
        }
        .feature-check {
            width: 28px; height: 28px; border-radius: 50%;
            background: #28a745;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; margin-top: 2px;
        }
        .feature-check::after { content: "\\2713"; color: white; font-size: 15px; font-weight: 700; }
        .feature-text {
            font-family: var(--font-body); font-weight: 500;
            font-size: clamp(16px, 2.1vw, 21px); line-height: 1.45; color: rgba(255,255,255,0.9);
        }
        .cta-btn {
            display: inline-block; padding: 18px 44px;
            background: var(--accent); color: #fff;
            font-family: var(--font-heading); font-weight: 700; font-size: 17px;
            letter-spacing: 0.08em; text-transform: uppercase; border-radius: 6px;
        }
        .brand-tag {
            position: absolute; bottom: 36px; right: 64px; z-index: 3;
            font-family: var(--font-heading); font-weight: 700; font-size: 13px;
            letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4);
        }
  `

  return `${htmlHead(v, width, height, css)}
<body>
    <div class="ad" style="${bg}">
        <div class="scrim"></div>
        <div class="content">
            <div class="card">
                <div class="headline">${esc(copy.headline)}</div>
                <ul class="features">${featuresHtml}</ul>
                <div class="cta-btn">${esc(copy.cta)}</div>
            </div>
        </div>
        <div class="brand-tag">${esc(v.brand_name)}</div>
    </div>
</body>
</html>`
}

// ============================================================
// TEMPLATE REGISTRY
// ============================================================

export type CarouselTemplate = "hook_problem_cta" | "listicle" | "before_after" | "testimonial" | "educational"
export type SingleTemplate = "hero_offer" | "social_proof" | "product_feature"
export type TemplateName = CarouselTemplate | SingleTemplate

export const CAROUSEL_TEMPLATES: Record<CarouselTemplate, typeof carouselHookProblemCta> = {
  hook_problem_cta: carouselHookProblemCta,
  listicle: carouselListicle,
  before_after: carouselBeforeAfter,
  testimonial: carouselTestimonial,
  educational: carouselEducational,
}

export const SINGLE_TEMPLATES: Record<SingleTemplate, typeof singleHeroOffer> = {
  hero_offer: singleHeroOffer,
  social_proof: singleSocialProof,
  product_feature: singleProductFeature,
}

export const TEMPLATE_INFO: Record<TemplateName, { label: string; type: "carousel" | "single"; description: string }> = {
  hook_problem_cta: { label: "Hook → Problem → CTA", type: "carousel", description: "Bold hook, pain points, solution, CTA" },
  listicle: { label: "Listicle", type: "carousel", description: "Numbered tips with big number hook" },
  before_after: { label: "Before & After", type: "carousel", description: "Contrast transformation story" },
  testimonial: { label: "Testimonial", type: "carousel", description: "Customer quote with results" },
  educational: { label: "Educational", type: "carousel", description: "Step-by-step framework" },
  hero_offer: { label: "Hero Offer", type: "single", description: "Bold headline + CTA button" },
  social_proof: { label: "Social Proof", type: "single", description: "Customer quote + star rating" },
  product_feature: { label: "Product Feature", type: "single", description: "Feature list with checkmarks" },
}
