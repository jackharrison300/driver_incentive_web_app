// returns true if contains html symbols
export const containsHtml = (testStr: string): boolean => /[&<>"']/.test(testStr);