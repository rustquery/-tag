import * as _idom from 'incremental-dom';
import { _createTag } from '../util/_create_tag';
import { DynamicAttrs } from '../util/_extract_attrs';

const render = (tpl: TemplateStringsArray, ...otherParts: (string | number)[]) => (attrs?: () => DynamicAttrs, children?: () => void) => {
    _createTag(tpl, ...otherParts)(true, attrs, children);
}

const tag = (tpl: TemplateStringsArray, ...otherParts: (string | number)[]) => (attrs?: () => DynamicAttrs, children?: () => void) => {
    _createTag(tpl, ...otherParts)(false, attrs, children);
}

const boot = (element: HTMLElement, wrapFn: () => void) => {
    _idom.patch(element, wrapFn);
}

export {
    boot, render, tag
};

