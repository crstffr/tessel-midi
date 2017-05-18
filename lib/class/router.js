class RouterClass {

    constructor () {
        this.view = '';
        this.views = {};
    }

    onSwitchViewEvent(topic, name) {
        this.switchView(name);
    }

    registerView(name, view) {
        view.name = name;
        this.views[name] = view;
    }

    switchView(name, ...args) {
        let curr = this.getView();
        let next = this.getView(name);
        if (!next) { return; }
        if (curr) { curr.deactivate(); }
        next.activate(...args);
        this.view = name;
    }

    getView(name) {
        return this.views[name || this.view];
    }

}

export let Router = new RouterClass();