"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
class Model extends Backbone.Model {
    constructor() {
        super(...arguments);
        this.name = "test";
    }
}
class View extends Backbone.View {
    initialize(options) {
        this.model = options.model;
        this.listenTo(this.model, 'change', this.update);
    }
    update() {
        console.log("view: model change");
    }
}
let model = new Model();
let view = new View({ model: model });
model.name = "name";
//# sourceMappingURL=index.js.map