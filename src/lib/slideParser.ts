export interface Slide {
  id: string;
  content: string;
  children?: Slide[];
}

export interface ParseResult {
  title: string;
  globalStyle: string;
  slides: Slide[];
}

let slideIdCounter = 0;

function generateId(): string {
  return `slide-${++slideIdCounter}`;
}

export function parseSlideTxt(content: string): ParseResult {
  // Reset counter for each parse
  slideIdCounter = 0;

  // 1. Extract global style
  const globalStyle = extractGlobalStyle(content);

  // 2. Remove style block
  const cleanContent = removeStyleBlock(content);

  // 3. Split by --- for horizontal slides
  const sections = cleanContent.split(/^---$/m).filter(s => s.trim());

  // 4. Parse each slide
  const slides = sections.map(section => parseSlide(section));

  // 5. Extract title from first slide
  const title = extractTitle(slides[0]?.content || '');

  return { title, globalStyle, slides };
}

function extractGlobalStyle(content: string): string {
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  return styleMatch ? styleMatch[1].trim() : '';
}

function removeStyleBlock(content: string): string {
  return content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').trim();
}

function parseSlide(content: string): Slide {
  const trimmed = content.trim();

  // Split by -- for vertical slides
  const parts = trimmed.split(/^--$/m).filter(s => s.trim());

  if (parts.length === 1) {
    return {
      id: generateId(),
      content: processElementStyles(parts[0].trim()),
    };
  }

  return {
    id: generateId(),
    content: processElementStyles(parts[0].trim()),
    children: parts.slice(1).map(part => ({
      id: generateId(),
      content: processElementStyles(part.trim()),
    })),
  };
}

function processElementStyles(content: string): string {
  // Convert <!-- .element: style="..." --> to inline style markers
  // Also handle <!-- .element style="..." --> (without colon)
  return content
    .replace(/<!--\s*\.element:?\s*style="([^"]+)"\s*-->/g, (match, style) => {
      // Store style for later processing
      return `{:style="${style}"}`;
    })
    .trim();
}

export function extractTitle(content: string): string {
  // Try to find h1
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Try to find h2
  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match) {
    return h2Match[1].trim();
  }

  return 'Untitled';
}

// Re-export processStyles for use in renderer
export function processStylesForRender(content: string): string {
  // Remove our style markers (they'll be handled by the markdown renderer)
  return content.replace(/\{:style="[^"]+"\}/g, '');
}

export function extractInlineStyles(content: string): Map<string, string> {
  const styles = new Map<string, string>();
  const regex = /\{:style="([^"]+)"\}/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Generate a unique key for this element
    const key = `style-${styles.size}`;
    styles.set(key, match[1]);
  }

  return styles;
}
