import { get } from '../get';
import { merge } from '../merge';
const REPLACE_REGEX = /{([^}]*)}/g;
export class I18n {
    /**
     * @param translation A locale object or array of locale objects that overrides default translations. If specifying an array then your fallback language dictionaries should come first, followed by your primary language dictionary
     */
    constructor(translation) {
        this.translation = {};
        this.translation = Array.isArray(translation)
            ? merge(...translation)
            : translation;
    }
    translate(id, replacements) {
        const text = get(this.translation, id, '');
        if (!text) {
            return '';
        }
        if (replacements) {
            return text.replace(REPLACE_REGEX, (match) => {
                const replacement = match.substring(1, match.length - 1);
                if (replacements[replacement] === undefined) {
                    const replacementData = JSON.stringify(replacements);
                    throw new Error(`Error in translation for key '${id}'. No replacement found for key '${replacement}'. The following replacements were passed: '${replacementData}'`);
                }
                // This could be a string or a number, but JS doesn't mind which it gets
                // and can handle that cast internally. So let it, to save us calling
                // toString() on what's already a string in 90% of cases.
                return replacements[replacement];
            });
        }
        return text;
    }
    translationKeyExists(path) {
        return Boolean(get(this.translation, path));
    }
}
