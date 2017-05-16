export function strf(format, args) {
    args = args || [];
    return format.replace(/{(\d+)}/g, (match, i) => {
        return typeof args[i] !== 'undefined' ? args[i] : match;
    });
}
