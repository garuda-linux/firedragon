export default abstract class Component {
    constructor() {
        document!.addEventListener('DOMContentLoaded', this.init.bind(this), { once: true });
    }

    init(): void {}
}
