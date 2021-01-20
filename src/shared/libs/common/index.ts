/**
 * Replace params into the template.
 */
export function mapTemplate(template: string, ...params): string {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return params[number] || match;
    });
}
