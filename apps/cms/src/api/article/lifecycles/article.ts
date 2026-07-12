function extractTextFromBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  let text = '';
  for (const block of blocks) {
    if (block.children && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child.text) {
          text += child.text + ' ';
        }
      }
    }
    if (block.type === 'code' && block.children) {
      for (const child of block.children) {
        if (child.text) {
          text += child.text + ' ';
        }
      }
    }
  }
  return text.trim();
}

function calculateReadingTime(content: any): number {
  const text = extractTextFromBlocks(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function extractSearchableText(title: string, description: string, content: any): string {
  const contentText = extractTextFromBlocks(content);
  return [title, description, contentText].filter(Boolean).join(' ');
}

export default {
  beforeCreate(event) {
    const { data } = event.params;

    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (data.content) {
      data.reading_time = calculateReadingTime(data.content);
      data.searchable_text = extractSearchableText(data.title, data.description, data.content);
    }
  },

  beforeUpdate(event) {
    const { data } = event.params;

    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (data.content) {
      data.reading_time = calculateReadingTime(data.content);
      data.searchable_text = extractSearchableText(data.title, data.description, data.content);
    }
  },
};
