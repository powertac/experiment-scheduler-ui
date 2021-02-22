const defaultMarkFunction = (haystack: string, needle: string) =>
    haystack.split(needle).join('<span class="marked">' + needle + '</span>');

export function matchAndMark(
    search: string,
    items: string[],
    minLength: number = 2, // using minLength < 2 might lead to display bugs
    markCallback?: (haystack: string, needle: string) => string): string[] {

    const terms = search.split(' ')
        .map((term) => term.toLowerCase())
        .filter((term) => /\S/.test(term))
        .filter((term) => term.length >= minLength);

    return items.map((item) => {

        const allMatches: string[] = [];

        for (const term of terms) {

            const termMatches = item.match(new RegExp(term, 'gi'));

            if (null === termMatches || termMatches.length < 1) {
                return null;
            }

            termMatches.forEach((match) => {
                if (allMatches.indexOf(match) === -1) {
                    allMatches.push(match);
                }
            });
        }

        return allMatches.reduce((result, match) =>
            (markCallback !== undefined ? markCallback : defaultMarkFunction)(result, match), item);
    })
    .filter((item) => item !== null) as string[];
}

export function removeHtml(string: string): string {
    const element = document.createElement('div');
    element.innerHTML = string;
    return element.textContent || element.innerText || '';
}
