

/**
 * Convert relative URL to absolute URL using base URL.
 * @param {string} base base url of the domain
 * @param {string} relative partial urls like ../images/image.jpg #hash
 * @returns {string} absolute URL
 * @example
 * var absoluteURL = convertURLToAbsoluteURL('https://example.com', 'images/image.jpg')
 * console.log(absoluteURL) // Returns: "https://example.com/images/image.jpg"
 * var absoluteURL = convertURLToAbsoluteURL('https://example.com', '//images/image.jpg')
 * console.log(absoluteURL) // Returns: "https:images/image.jpg"
 * @category HTML Utilities
* @author [ai-research-agent (2024)](https://airesearch.js.org)
 */
export function convertURLToAbsoluteURL(base, relative) {

  // remove the %20 codes like data:image/svg+xml,%3Csvg%20x 
  relative = decodeURI(relative);
  base = decodeURI(base);

  if (relative.includes("data:") 
    || relative.startsWith("#")
    || relative.startsWith("http"))
     return relative;

  // Remove hash from base URL
  base = base.replace(/#.*$/, "");

  // If relative URL starts with '//', add scheme from base
  if (relative.startsWith("//"))
    return base.split("://")[0] + ":" + relative;

  // If relative URL starts with '/', replace everything after the host in base
  if (relative[0] === "/") {
    const matchdomain = base.match(/^(https?:\/\/[^\/]+)/i);
      const domain = matchdomain ? matchdomain[1] : null;
    
    return domain + relative;
  }


  // Remove file part from base

  // Handle relative URLs

  if (relative.startsWith("../")) {
  base = base.replace(/\/[^\/]+$/, "");

      while (relative.substring(0, 3) === "../") {
      relative = relative.substring(3);
      base = base.replace(/\/[^\/]+$/, "");
    }
    relative = relative.replace(/^\.\//, "");
  }

  // Combine base and relative
  // 
  if (relative.startsWith("/")) {
  base = base.replace(/\/[^\/]+$/, "");

    return base.replace(/\/+$/, "") + relative;
  } else {

    return base.split('/')
      .slice(0, -1).join('/')   
      + "/" + relative;
  }
}



/**
 * Converts Markdown text to HTML. It handles the following Markdown elements:
 * - Headers (h1 to h6)
 * - Bold text
 * - Italic text
 * - Unordered lists
 * - Ordered lists
 * - Paragraphs
 * - Images
 * - Links
 * @param {string} content - The Markdown or HTML content to be converted.
 * @param {boolean} toHtml - default=true - If true, converts Markdown to HTML.
 *                          If false, converts HTML to Markdown.
 * @returns {string} The resulting HTML string.
 * @category HTML Utilities
 * @example
 * const markdown = "# Header\n\nThis is **bold** and *italic* text.\n\n* List item 1\n* List item 2";
 * const html = convertMarkdownToHTML(markdown);
 * console.log(html);
 * // Output:
 * // <h1>Header</h1>
 * // <p>This is <strong>bold</strong> and <em>italic</em> text.</p>
 * // <ul><li>List item 1</li><li>List item 2</li></ul>
 */
export function convertMarkdownToHTML(content, toHtml = true) {
  if (!toHtml) 
    return convertHTMLToMarkdown(content);

  var html = content
    // Convert headers
    .replace(/^(#{1,6})\s(.+)$/gm, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${content.trim()}</h${level}>`;
    })

    // Convert bold text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

    // Convert italic text
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

    // Convert unordered lists
    .replace(/^\s*\*\s(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

    // Convert ordered lists
    .replace(/^\s*\d+\.\s(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')

    // Convert paragraphs
    .split('\n\n').map(para => {
      if (!para.startsWith('<')) {
        return `<p>${para.trim()}</p>`;
      }
      return para;
    }).join('\n')

    // Convert images 
    .replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')

    // Convert links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  return html;
}

function convertHTMLToMarkdown(html) {
  var markdown = html
    // Convert headers
    .replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match, level, content) => {
      return '#'.repeat(parseInt(level)) + ' ' + content.trim() + '\n\n';
    })

    // Convert bold text
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')

    // Convert italic text
    .replace(/<em>(.*?)<\/em>/g, '*$1*')

    // Convert unordered lists
    .replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      return content.replace(/<li>(.*?)<\/li>/g, '* $1\n') + '\n';
    })

    // Convert ordered lists
    .replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
      let index = 1;
      return content.replace(/<li>(.*?)<\/li>/g, () => `${index++}. $1\n`) + '\n';
    })

    // Convert paragraphs
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')

    // Convert images
    .replace(/<img src="(.*?)" alt="(.*?)".*?\/>/g, '![$2]($1)')

    // Convert links
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')

    // Remove any remaining HTML tags
    .replace(/<[^>]*>/g, '')

    // Trim extra whitespace
    .trim();

  return markdown;
}



/**
 * Copy HTML to clipboard. When pasting into rich text field, 
 * pastes rich text. When pasting into plain text field, pastes: 
 * plain text, html, or markdown.
 * 
 * @param {string} html - The HTML content to be copied.
 * @param {object} options - The options object.
 * @param {boolean} options.pastePlainFormat -
 * default=0
 * 0 - plain text
 * 1 - markdown
 * 2 - html
 * @returns {Promise<void>} - A promise that resolves when 
 * the HTML is copied to the clipboard.
 * @category HTML Utilities
 * @author [ai-research-agent (2024)](https://airesearch.js.org)
 */
export async function copyHTMLToClipboard(html, options = {}) {
  var {
    pastePlainFormat = 0
  } = options;

  if (typeof window == "undefined" || !navigator?.clipboard) return;

  const htmlBlob = new Blob([html], { type: "text/html" });

  var plainText = pastePlainFormat == 0 ? 
    html.replace(/<[^>]*>?/g, "") : 
    pastePlainFormat == 1 ? 
    convertMarkdownToHTML(html, false) :
    html;
  
  const textBlob =  new Blob([plainText], { type: "text/plain" }) 

  const clipboardItem = new window.ClipboardItem({
    "text/html": htmlBlob,
    "text/plain": textBlob,
  });
  
  return await navigator.clipboard.write([clipboardItem]);

}