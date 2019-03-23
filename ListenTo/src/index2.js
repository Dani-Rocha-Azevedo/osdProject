import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'

var model = Backbone.Model.extend({

})
var view = Backbone.View.extend({
    initialize : function() {
        this.listenTo(this.model, 'change', this.change)
    }

    change() {}
})