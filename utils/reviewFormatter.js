export const processReviewContent = (content) => {
    if (!content) return '';
    // Simple markdown-like processing
    let processed = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br/><br/>');
    return processed;
};
