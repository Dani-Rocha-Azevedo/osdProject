import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'
class Model extends Backbone.Model {
    name : string = "test"
}
class View extends Backbone.View<any> {
    model : Model
    initialize(options: any) {
        this.model = options.model
        this.listenTo(this.model, 'change', this.update)
    }

    update() {
        console.log("view: model change")
    }
}
let model: Model = new Model()
let view: View = new View({model: model})

model.name = "name"
