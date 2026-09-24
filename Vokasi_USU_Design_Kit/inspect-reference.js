/**
 * Optional browser-console audit for a PUBLIC reference page.
 * Reads computed styles and image URLs; never reads form values, cookies,
 * storage, private APIs or stylesheet rule bodies. Makes no network requests.
 * This file has NOT been run on the live Vokasi website by this deliverable.
 * Run manually at each viewport and each opened menu/hover/scroll state.
 */
(async function auditPublicReference() {
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const round = (n) => Math.round(n * 100) / 100;
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.display !== 'none' &&
        s.visibility !== 'hidden' && Number(s.opacity) !== 0;
    };
    const selector = (el) => {
      if (el.id) return '#' + CSS.escape(el.id);
      const parts = [];
      let node = el;
      while (node && node.nodeType === 1 && parts.length < 5) {
        let part = node.localName;
        const parent = node.parentElement;
        if (parent) {
          const peers = [...parent.children].filter((x) => x.localName === node.localName);
          if (peers.length > 1) part += ':nth-of-type(' + (peers.indexOf(node) + 1) + ')';
        }
        parts.unshift(part);
        node = parent;
      }
      return parts.join(' > ');
    };
    const props = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight',
      'letterSpacing', 'color', 'backgroundColor', 'backgroundImage', 'display',
      'position', 'maxWidth', 'gridTemplateColumns', 'gap', 'padding', 'margin',
      'borderRadius', 'borderColor', 'borderWidth', 'boxShadow', 'objectFit',
      'objectPosition', 'zIndex', 'transitionDuration'];
    const inspect = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const styles = Object.fromEntries(props.map((p) => [p, s[p]]));
      const pseudo = {};
      for (const name of ['::before', '::after']) {
        const p = getComputedStyle(el, name);
        if (p.content && !['none', 'normal'].includes(p.content)) {
          pseudo[name] = {content: p.content, color: p.color,
            backgroundColor: p.backgroundColor, backgroundImage: p.backgroundImage};
        }
      }
      return {selector: selector(el), tag: el.localName,
        rect: {x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height)},
        styles, pseudo};
    };
    const root = getComputedStyle(document.documentElement);
    const customProperties = {};
    for (const name of root) {
      if (name.startsWith('--')) customProperties[name] = root.getPropertyValue(name).trim();
    }
    const candidates = [...new Set([
      document.body,
      ...document.querySelectorAll('header, nav, main, section, article, footer, h1, h2, h3, p, button, a, input, select, textarea')
    ])].filter(visible);
    const report = {
      schemaVersion: '1.0', measuredAt: new Date().toISOString(),
      sourceUrl: location.origin + location.pathname,
      title: document.title,
      viewport: {width: innerWidth, height: innerHeight, dpr: devicePixelRatio,
        scrollX, scrollY},
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      hasHorizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      captureLimit: 240, totalCandidateElements: candidates.length,
      customProperties,
      stylesheets: [...document.styleSheets].map((s) => s.href || '[inline]'),
      elements: candidates.slice(0, 240).map(inspect),
      images: [...document.images].map((img) => ({selector: selector(img),
        src: img.currentSrc || img.src, alt: img.alt, loading: img.loading,
        width: img.naturalWidth, height: img.naturalHeight,
        loaded: img.complete && img.naturalWidth > 0,
        visible: visible(img), style: inspect(img)})),
      limitations: ['Single viewport/state only.',
        'Computed font-family does not prove which font supplied every glyph.',
        'Pseudo-elements inspected only on captured elements.',
        'Iframe and shadow-root interiors are not traversed.',
        'Stylesheet URLs are listed; rule text is not inspected.',
        'No screenshot or accessibility certification is produced.']
    };
    const json = JSON.stringify(report, null, 2);
    console.log(json);
    const blobUrl = URL.createObjectURL(new Blob([json], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'reference-audit-' + innerWidth + 'x' + innerHeight + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    return report;
  } catch (error) {
    console.error('Reference audit failed:', error);
    throw error;
  }
})();
