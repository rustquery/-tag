import * as _idom from 'incremental-dom';
import { genUUID } from "../util/gen_uuid";
import { _stateDic } from "./_global_state";


// function _renderTemplate(template: HTMLTemplateElement) {
//     // Incremental DOM currently requires you have an extra container for rendering
//     // content into.
//     const el = _idom.elementOpen('div', '<use a key to avoid conflicts>');
//     // If already rendered the template, skip this part and just reuse it.
//     if (!(el as any)['_templateRendered']) {
//       el.appendChild(document.importNode(template.content, true));
//       (el as any)._templateRendered = true;
//     }
//     // Tell Incremental DOM to ignore all the content of the element so it isn't
//     // removed.
//     _idom.skip();
//     _idom.elementClose('div');
// }

function useMutate<T>(startValue: T) {
    const state = {
        current: startValue,
        stateId: genUUID(),
    };

    _stateDic.push({
        stateId: state.stateId,
    });

    return [
        () => state.current,
        (pfn: (oldState: T) => T) => {
            state.current = pfn(state.current);
            const stateRef = _stateDic.find(stateItem => stateItem.stateId === state.stateId);
            if (stateRef?.elementRef) {
                // const frag = new DocumentFragment();
                // _idom.patch(frag, () => {
                //     if (stateRef.render) {
                //         stateRef?.render();
                //     }
                // });


                // stateRef.elementRef.appendChild(frag);

                // _renderTemplate(frag.)


                _idom.patchOuter(stateRef.elementRef, () => {
                    if (stateRef.render) {
                        stateRef?.render();
                    }
                });

            }
        },
    ] as [() => T, (fn: (currState: T) => T) => void]
}


export { useMutate };

