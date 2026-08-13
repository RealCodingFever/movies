/**
 * Formats TMDB review content by converting markdown-like syntax and HTML to proper HTML
 * Handles: **bold**, *italic*, bullet points, line breaks, and basic HTML tags
 */

export const formatReviewContent = (content) => {
    if (!content) return '';

    let formatted = content;

    // Convert markdown-style bold (**text**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert markdown-style italic (*text*)
    formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

    // Convert bullet points (- item or * item)
    formatted = formatted.replace(/^[\s]*[-*][\s]+(.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> elements in <ul>
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, (match) => {
        // Check if it's already wrapped in ul
        if (match.includes('<ul>')) return match;
        return `<ul>${match}</ul>`;
    });

    // Convert line breaks to <br> tags
    formatted = formatted.replace(/\n/g, '<br>');

    // Convert multiple consecutive <br> tags to paragraph breaks
    formatted = formatted.replace(/(<br>\s*){2,}/g, '</p><p>');

    // Wrap content in paragraphs if it contains <br> tags
    if (formatted.includes('<br>') || formatted.includes('<li>')) {
        formatted = `<p>${formatted}</p>`;
    }

    // Clean up empty paragraphs
    formatted = formatted.replace(/<p>\s*<\/p>/g, '');
    formatted = formatted.replace(/<p><\/p>/g, '');

    return formatted;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows only safe HTML tags and attributes
 */
export const sanitizeHtml = (html) => {
    if (!html) return '';

    // List of allowed tags
    const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'b', 'i'];

    // Remove any script tags and dangerous attributes
    let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // Remove any tags not in the allowed list
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    sanitized = sanitized.replace(tagRegex, (match, tagName) => {
        if (allowedTags.includes(tagName.toLowerCase())) {
            return match;
        }
        return '';
    });

    return sanitized;
};

/**
 * Main function to format and sanitize review content
 */
export const processReviewContent = (content) => {
    if (!content) return '';

    // First format the content
    const formatted = formatReviewContent(content);

    // Then sanitize it
    const sanitized = sanitizeHtml(formatted);

    return sanitized;
};
