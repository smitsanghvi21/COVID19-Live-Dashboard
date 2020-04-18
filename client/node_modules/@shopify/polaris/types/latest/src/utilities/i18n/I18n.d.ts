interface TranslationDictionary {
    [key: string]: string | TranslationDictionary;
}
export declare class I18n {
    private translation;
    /**
     * @param translation A locale object or array of locale objects that overrides default translations. If specifying an array then your fallback language dictionaries should come first, followed by your primary language dictionary
     */
    constructor(translation: TranslationDictionary | TranslationDictionary[]);
    translate(id: string, replacements?: Record<string, string | number>): string;
    translationKeyExists(path: string): boolean;
}
export {};
