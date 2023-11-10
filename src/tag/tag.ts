import * as _idom from 'incremental-dom';
import { genUUID } from '../util/gen_uuid';


interface DinamicAttrs {
    [key: string]: any,
}

const stateGMap: {
    stateId: string,
    elementRef?: HTMLElement,
    render?: () => void,
}[] = [];


function useState<T>(startValue: T) {
    const state = {
        current: startValue,
        stateId: genUUID(),
    };

    stateGMap.push({
        stateId: state.stateId,
    });

    return [
        () => state.current,
        (pfn: (oldState: T) => T) => {
            state.current = pfn(state.current);
            const stateRef = stateGMap.find(stateItem => stateItem.stateId === state.stateId);
            if (stateRef?.elementRef && stateRef.render) {
                _idom.patchOuter(stateRef.elementRef, () => {
                    if (stateRef.render) {
                        stateRef?.render()
                    }
                });
            }
        },
    ] as [() => T, (fn: (currState: T) => T) => void]
}

const _tagTpl2Data = (tpl: TemplateStringsArray) => (attrs: DinamicAttrs) => {
    const [content] = tpl;
    const key = attrs.key || null;
    const allAttrs = Object.keys(attrs).filter(attr => attr !== 'key');
    const staticAttrs = allAttrs.reduce((prev, curr) => {
        if (typeof attrs[curr] === "string") {
            prev.push(curr);
            prev.push(attrs[curr]);
        }
        return prev;
    }, [] as string[]);

    const [tag, textContent] = content.split(" ");

    const dinamicAttrs = allAttrs.reduce((prev, curr) => {
        if (typeof attrs[curr] !== "string") {
            prev.push(curr);
            prev.push(attrs[curr]);
        }
        return prev;
    }, [] as any[]);

    return {
        tag,
        key,
        textContent,
        staticAttrs,
        dinamicAttrs,
    }
}

const tag = (tpl: TemplateStringsArray, ...otherParts: string[]) => (attrs: DinamicAttrs) => {
    const { key, staticAttrs, textContent, tag, dinamicAttrs } = _tagTpl2Data(tpl)(attrs);
    if (textContent) {
        _idom.elementOpen(tag, key, staticAttrs, ...dinamicAttrs);
        _idom.text(textContent);
        _idom.elementClose(tag);
    } else {
        _idom.elementVoid(tag, key, staticAttrs);
    }
}

const open = (tpl: TemplateStringsArray) => (children: () => void) => {
    // console.log('tmpl:', template);
    const { key, tag, staticAttrs } = _tagTpl2Data(tpl)({});
    const compId = genUUID();
    const stateItens = stateGMap.filter(stateItem => !stateItem.elementRef);
    const innerRender = () => {
        _idom.elementOpen(tag, key || compId, staticAttrs);
        const elementRef = _idom.currentElement();
        stateItens.forEach(stateItem => {
            stateItem.elementRef = elementRef as HTMLElement;
        })
        children();
        _idom.elementClose(tag);
    }
    stateItens.forEach(stateItem => {
        stateItem.render = innerRender;
    })
    innerRender();
};


const boot = (element: HTMLElement, wrapFn: () => void) => {
    _idom.patch(element, wrapFn);
}

export {
    boot, open, tag,
    useState
};

