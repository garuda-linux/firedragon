import { ref } from '@vue/reactivity';
import { type RouterHistory } from 'vue-router';

enum NavigationType {
    pop = "pop",
    push = "push",
}
enum NavigationDirection {
    back = "back",
    forward = "forward",
    unknown = "",
}
type HistoryLocation = string;
interface NavigationInformation {
    type: NavigationType;
    direction: NavigationDirection;
    delta: number;
}
interface NavigationCallback {
    (to: HistoryLocation, from: HistoryLocation, information: NavigationInformation): void;
}

export function createHashHistory(): RouterHistory {
    const location = ref(window.location.hash.substring(1));

    let pauseListeners = false;
    const listeners = new Set<NavigationCallback>;

    function listener(e: HashChangeEvent) {
        const newLocation = new URL(e.newURL).hash.substring(1);
        const oldLocation = new URL(e.oldURL).hash.substring(1);

        location.value = newLocation;

        if (!pauseListeners) {
            for (const listener of listeners) {
                listener(newLocation, oldLocation, {
                    type: NavigationType.push,
                    direction: NavigationDirection.unknown,
                    delta: 1,
                });
            }
        }
        pauseListeners = true;
    }
    window.addEventListener('hashchange', listener);

    return {
        get base() {
            return '';
        },

        get location() {
            return location.value;
        },

        get state() {
            return {};
        },

        push(to: string) {
            window.location.hash = to;
        },

        replace(to: string) {
            window.location.hash = to;
        },

        go(delta: number, triggerListeners: boolean = false) {
            pauseListeners = !triggerListeners;
            history.go(delta);
        },

        listen(callback: NavigationCallback): () => void {
            listeners.add(callback);
            return () => {
                listeners.delete(callback);
            };
        },

        createHref(location: HistoryLocation): string {
            return '#' + location;
        },

        destroy() {
            window.removeEventListener('hashchange', listener);
        },
    };
}
