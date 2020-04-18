import React, { useCallback } from 'react';
import { VisuallyHidden } from '../VisuallyHidden';
import { useI18n } from '../../utilities/i18n';
export function Form({ acceptCharset, action, autoComplete, children, encType, implicitSubmit = true, method = 'post', name, noValidate, preventDefault = true, target, onSubmit, }) {
    const i18n = useI18n();
    const handleSubmit = useCallback((event) => {
        if (!preventDefault) {
            return;
        }
        event.preventDefault();
        onSubmit(event);
    }, [onSubmit, preventDefault]);
    const autoCompleteInputs = normalizeAutoComplete(autoComplete);
    const submitMarkup = implicitSubmit ? (<VisuallyHidden>
      <button type="submit" aria-hidden="true" tabIndex={-1}>
        {i18n.translate('Polaris.Common.submit')}
      </button>
    </VisuallyHidden>) : null;
    return (<form acceptCharset={acceptCharset} action={action} autoComplete={autoCompleteInputs} encType={encType} method={method} name={name} noValidate={noValidate} target={target} onSubmit={handleSubmit}>
      {children}
      {submitMarkup}
    </form>);
}
function normalizeAutoComplete(autoComplete) {
    if (autoComplete == null) {
        return autoComplete;
    }
    return autoComplete ? 'on' : 'off';
}
