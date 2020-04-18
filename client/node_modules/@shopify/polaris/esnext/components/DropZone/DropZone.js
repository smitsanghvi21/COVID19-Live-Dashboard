import { __rest } from "tslib";
import React, { useState, useRef, useCallback, useMemo, useEffect, Component, } from 'react';
import debounce from 'lodash/debounce';
import { addEventListener, removeEventListener, } from '@shopify/javascript-utilities/events';
import { DragDropMajorMonotone, CircleAlertMajorMonotone, } from '@shopify/polaris-icons';
import { classNames, variationName } from '../../utilities/css';
import { capitalize } from '../../utilities/capitalize';
import { Icon } from '../Icon';
import { Stack } from '../Stack';
import { Caption } from '../Caption';
import { DisplayText } from '../DisplayText';
import { VisuallyHidden } from '../VisuallyHidden';
import { Labelled } from '../Labelled';
import { useI18n } from '../../utilities/i18n';
import { isServer } from '../../utilities/target';
import { useUniqueId } from '../../utilities/unique-id';
import { useComponentDidMount } from '../../utilities/use-component-did-mount';
import { useToggle } from '../../utilities/use-toggle';
import { useFeatures } from '../../utilities/features';
import { FileUpload } from './components';
import { DropZoneContext } from './context';
import { fileAccepted, getDataTransferFiles } from './utils';
import styles from './DropZone.scss';
// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.
export const DropZone = function DropZone({ dropOnPage, label, labelAction, labelHidden, children, disabled = false, outline = true, accept, active, overlay = true, allowMultiple = true, overlayText, errorOverlayText, id: idProp, type = 'file', onClick, error, openFileDialog, onFileDialogClose, customValidator, onDrop, onDropAccepted, onDropRejected, onDragEnter, onDragOver, onDragLeave, }) {
    const { newDesignLanguage } = useFeatures();
    const node = useRef(null);
    const dragTargets = useRef([]);
    const adjustSize = useCallback(debounce(() => {
        if (!node.current) {
            return;
        }
        let size = 'extraLarge';
        const width = node.current.getBoundingClientRect().width;
        if (width < 100) {
            size = 'small';
        }
        else if (width < 160) {
            size = 'medium';
        }
        else if (width < 300) {
            size = 'large';
        }
        setSize(size);
        measuring && setMeasuring(false);
    }, 50, { trailing: true }), []);
    const [dragging, setDragging] = useState(false);
    const [internalError, setInternalError] = useState(false);
    const { value: focused, setTrue: handleFocus, setFalse: handleBlur, } = useToggle(false);
    const [size, setSize] = useState('extraLarge');
    const [measuring, setMeasuring] = useState(true);
    const i18n = useI18n();
    const getValidatedFiles = useCallback((files) => {
        const acceptedFiles = [];
        const rejectedFiles = [];
        Array.from(files).forEach((file) => {
            !fileAccepted(file, accept) ||
                (customValidator && !customValidator(file))
                ? rejectedFiles.push(file)
                : acceptedFiles.push(file);
        });
        if (!allowMultiple) {
            acceptedFiles.splice(1, acceptedFiles.length);
            rejectedFiles.push(...acceptedFiles.slice(1));
        }
        return { files, acceptedFiles, rejectedFiles };
    }, [accept, allowMultiple, customValidator]);
    const handleDrop = useCallback((event) => {
        stopEvent(event);
        if (disabled)
            return;
        const fileList = getDataTransferFiles(event);
        const { files, acceptedFiles, rejectedFiles } = getValidatedFiles(fileList);
        dragTargets.current = [];
        setDragging(false);
        setInternalError(rejectedFiles.length > 0);
        onDrop && onDrop(files, acceptedFiles, rejectedFiles);
        onDropAccepted && acceptedFiles.length && onDropAccepted(acceptedFiles);
        onDropRejected && rejectedFiles.length && onDropRejected(rejectedFiles);
        event.target.value = '';
    }, [disabled, getValidatedFiles, onDrop, onDropAccepted, onDropRejected]);
    const handleDragEnter = useCallback((event) => {
        stopEvent(event);
        if (disabled)
            return;
        const fileList = getDataTransferFiles(event);
        if (event.target && !dragTargets.current.includes(event.target)) {
            dragTargets.current.push(event.target);
        }
        if (dragging)
            return;
        const { rejectedFiles } = getValidatedFiles(fileList);
        setDragging(true);
        setInternalError(rejectedFiles.length > 0);
        onDragEnter && onDragEnter();
    }, [disabled, dragging, getValidatedFiles, onDragEnter]);
    const handleDragOver = useCallback((event) => {
        stopEvent(event);
        if (disabled)
            return;
        onDragOver && onDragOver();
    }, [disabled, onDragOver]);
    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        if (disabled)
            return;
        dragTargets.current = dragTargets.current.filter((el) => {
            const compareNode = dropOnPage && !isServer ? document : node.current;
            return el !== event.target && compareNode && compareNode.contains(el);
        });
        if (dragTargets.current.length > 0)
            return;
        setDragging(false);
        setInternalError(false);
        onDragLeave && onDragLeave();
    }, [dropOnPage, disabled, onDragLeave]);
    useEffect(() => {
        const dropNode = dropOnPage ? document : node.current;
        if (!dropNode)
            return;
        addEventListener(dropNode, 'drop', handleDrop);
        addEventListener(dropNode, 'dragover', handleDragOver);
        addEventListener(dropNode, 'dragenter', handleDragEnter);
        addEventListener(dropNode, 'dragleave', handleDragLeave);
        addEventListener(window, 'resize', adjustSize);
        return () => {
            removeEventListener(dropNode, 'drop', handleDrop);
            removeEventListener(dropNode, 'dragover', handleDragOver);
            removeEventListener(dropNode, 'dragenter', handleDragEnter);
            removeEventListener(dropNode, 'dragleave', handleDragLeave);
            removeEventListener(window, 'resize', adjustSize);
        };
    }, [
        dropOnPage,
        handleDrop,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        adjustSize,
    ]);
    useComponentDidMount(() => {
        adjustSize();
    });
    const id = useUniqueId('DropZone', idProp);
    const suffix = capitalize(type);
    const overlayTextWithDefault = overlayText === undefined
        ? i18n.translate(`Polaris.DropZone.overlayText${suffix}`)
        : overlayText;
    const errorOverlayTextWithDefault = errorOverlayText === undefined
        ? i18n.translate(`Polaris.DropZone.errorOverlayText${suffix}`)
        : errorOverlayText;
    const inputAttributes = {
        id,
        accept,
        disabled,
        type: 'file',
        multiple: allowMultiple,
        onChange: handleDrop,
        onFocus: handleFocus,
        onBlur: handleBlur,
    };
    const classes = classNames(styles.DropZone, outline && styles.hasOutline, focused && styles.focused, (active || dragging) && styles.isDragging, disabled && styles.isDisabled, newDesignLanguage && styles.newDesignLanguage, (internalError || error) && styles.hasError, styles[variationName('size', size)], measuring && styles.measuring);
    const dragOverlay = (active || dragging) &&
        (!internalError || !error) &&
        overlay &&
        overlayMarkup(DragDropMajorMonotone, 'indigo', overlayTextWithDefault);
    const dragErrorOverlay = dragging &&
        (internalError || error) &&
        overlayMarkup(CircleAlertMajorMonotone, 'red', errorOverlayTextWithDefault);
    const labelValue = label || i18n.translate('Polaris.DropZone.FileUpload.label');
    const labelHiddenValue = label ? labelHidden : true;
    const context = useMemo(() => ({
        disabled,
        focused,
        size,
        type: type || 'file',
        measuring,
    }), [disabled, focused, measuring, size, type]);
    return (<DropZoneContext.Provider value={context}>
      <Labelled id={id} label={labelValue} action={labelAction} labelHidden={labelHiddenValue}>
        <div ref={node} className={classes} aria-disabled={disabled} onClick={handleClick} onDragStart={stopEvent}>
          {dragOverlay}
          {dragErrorOverlay}
          <div className={styles.Container}>{children}</div>
          <VisuallyHidden>
            <DropZoneInput {...inputAttributes} openFileDialog={openFileDialog} onFileDialogClose={onFileDialogClose}/>
          </VisuallyHidden>
        </div>
      </Labelled>
    </DropZoneContext.Provider>);
    function overlayMarkup(icon, color, text) {
        const overlayClass = classNames(styles.Overlay, newDesignLanguage && styles.newDesignLanguage);
        return (<div className={overlayClass}>
        <Stack vertical spacing="tight">
          <Icon source={icon} color={color}/>
          {size === 'extraLarge' && (<DisplayText size="small" element="p">
              {text}
            </DisplayText>)}
          {(size === 'medium' || size === 'large') && <Caption>{text}</Caption>}
        </Stack>
      </div>);
    }
    function open() {
        const fileInputNode = node.current && node.current.querySelector(`#${id}`);
        fileInputNode &&
            fileInputNode instanceof HTMLElement &&
            fileInputNode.click();
    }
    function handleClick(event) {
        if (disabled)
            return;
        return onClick ? onClick(event) : open();
    }
};
function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}
DropZone.FileUpload = FileUpload;
// Due to security reasons, browsers do not allow file inputs to be opened artificially.
// For example `useEffect(() => { ref.click() })`. Oddly enough react class-based components bi-pass this.
class DropZoneInput extends Component {
    constructor() {
        super(...arguments);
        this.fileInputNode = React.createRef();
        this.triggerFileDialog = () => {
            this.open();
            this.props.onFileDialogClose && this.props.onFileDialogClose();
        };
        this.open = () => {
            if (!this.fileInputNode.current)
                return;
            this.fileInputNode.current.click();
        };
    }
    componentDidMount() {
        this.props.openFileDialog && this.triggerFileDialog();
    }
    componentDidUpdate() {
        this.props.openFileDialog && this.triggerFileDialog();
    }
    render() {
        const _a = this.props, { openFileDialog, onFileDialogClose } = _a, inputProps = __rest(_a, ["openFileDialog", "onFileDialogClose"]);
        return (<input {...inputProps} ref={this.fileInputNode} autoComplete="off"/>);
    }
}
