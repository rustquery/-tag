export interface DynamicAttrs {
    [key: string]: any,
}

const _extract_attrs = (tpl: TemplateStringsArray, ...otherParts: (string | number)[]) => (attrs: DynamicAttrs) => {
    const key = attrs.key || null;
    const allAttrs = Object.keys(attrs).filter(attr => attr !== 'key');

    const staticAttrs = allAttrs.reduce((prev, curr) => {
        if (typeof attrs[curr] === "string") {
            prev.push(curr);
            prev.push(attrs[curr]);
        }
        return prev;
    }, [] as string[]);

    const [tagSelector, ...textContent] = tpl.reduce((prev, curr, index) => {
        const hasValue = ['string', 'number'].includes(typeof otherParts[index]);
        return prev + curr + (hasValue ? otherParts[index] : ' ');
    }, '').split(" ");



    const dynamicAttrs = allAttrs.reduce((prev, curr) => {
        if (typeof attrs[curr] !== "string") {
            prev.push(curr);
            prev.push(attrs[curr]);
        }
        return prev;
    }, [] as any[]);

    let tag = tagSelector || 'div';


    if (tag.includes('.')) {
        const [pretag, ...classNames] = tag.split('.');
        tag = pretag === '' ? 'div' : pretag;
        if (classNames?.length && classNames[0] !== '') {
            const staticClassIndex = staticAttrs.findIndex(staticAttr => staticAttr === 'class');
            if (staticClassIndex > -1) {
                const oldClassName = staticAttrs[staticClassIndex + 1];
                staticAttrs[staticClassIndex + 1] = `${classNames.join(' ')} ${oldClassName}`;
            } else {
                staticAttrs.push(...['class', classNames.join(' ')]);
            }
        }
    }

    return {
        tag,
        key,
        textContent: textContent.join(" "),
        staticAttrs,
        dynamicAttrs,
    }
}

export { _extract_attrs };

