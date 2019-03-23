import * as _ from 'underscore'
import * as Backbone from 'backbone'
export class CurrentTimeView extends Backbone.View<Backbone.Model> {
    private template: any
    private currentTime: string
    initialize() {
        this.template = require("ejs-compiled-loader!./currentTimeView.ejs")
        this.currentTime = "00:00:00"
    }

    updateCurrentTime(currentTime: string) {
        this.currentTime = currentTime
        this.render()
    }
    render() {
        this.$el.html(this.template({currentTime: this.currentTime}))
        return this
    }
}