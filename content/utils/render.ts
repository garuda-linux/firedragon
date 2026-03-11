export function h(tag: string, props: Record<string, any> = {}, children: any[] = []): Element {
    const el = tag.startsWith('xul:') ? document!.createXULElement(tag.substring(4)) : document!.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (key === 'on') {
            for (const [event, handler] of Object.entries(value)) {
                // @ts-ignore
                el.addEventListener(event, handler);
            }
        } else {
            el.setAttribute(key, value);
        }
    }
    el.append(...children);
    return el;
}

export function insertBefore(el: Node, target: Node | string) {
    if (typeof target === 'string') {
        target = document!.querySelector(target)!;
    }
    target.parentNode!.insertBefore(el, target);
}
