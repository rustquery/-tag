import * as _idom from 'incremental-dom';
import { _stateDic } from "../tag/_global_state";
import { DynamicAttrs, _extract_attrs } from "./_extract_attrs";
import { genUUID } from "./gen_uuid";

_idom.attributes.value = function (el: Node, name: any, value: any) {
    // el[name] = value
    // el.value = value;
    (el as any)[name] = value;
    // el[`${name}`] = value;
}

const _createTag = (tpl: TemplateStringsArray, ...otherParts: (string | number)[]) => (isRoot: boolean, attrs?: () => DynamicAttrs, children?: () => void) => {
    const { key, staticAttrs, textContent, tag, dynamicAttrs } = _extract_attrs(tpl, ...otherParts)(!!attrs ? attrs() : {});
    const stateItensWithoutRef = _stateDic.filter(stateItem => !stateItem.elementRef);
    const compKey = key || genUUID();

    stateItensWithoutRef.forEach(stateItem => {
        stateItem.elementKey = compKey;
    });

    console.log('content:', textContent);

    const innerRender = () => {
        if (isRoot) {
            console.log('root:', isRoot, textContent);
            // _idom.elementOpen('div');
            const elementRef = _idom.elementOpen('fragment', compKey);
            stateItensWithoutRef.forEach(stateItem => {
                stateItem.elementRef = elementRef;
            })
        }
        _idom.elementOpen(tag, isRoot ? null : compKey, staticAttrs, ...dynamicAttrs);
        // console.log('content-2:', textContent);
        if (textContent) {
            _idom.text(textContent);
        } else if (children) {
            children();
        }
        _idom.elementClose(tag);
        if (isRoot) {
            _idom.elementClose('fragment');
        }
    }

    _stateDic
        .filter(stateItem => stateItem.elementKey === compKey)
        .forEach(stateItem => {
            stateItem.render = innerRender;
        });

    innerRender();
};

export { _createTag };

