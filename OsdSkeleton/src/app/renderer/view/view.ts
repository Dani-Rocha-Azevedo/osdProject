import * as _ from 'underscore'
import * as Backbone from 'backbone'
/**
 * View which diplays the currentTime
 */
export class LeftTimeView extends Backbone.View<Backbone.Model> {
    private template: any
    private currentTime: string
    initialize() {
        this.template = require("ejs-compiled-loader!./leftTime.ejs")
        this.currentTime = "00:00:00"
    }

    updateLeftTime(currentTime: string) {
        this.currentTime = currentTime
        this.render()
    }
    render() {
        this.$el.html(this.template({ currentTime: this.currentTime }))
        return this
    }
}
/**
 * View which displays the duration
 */
export class RightTimeView extends Backbone.View<Backbone.Model> {
    private template: any
    private duration: string

    initialize() {
        this.template = require("ejs-compiled-loader!./rightTime.ejs")
        this.duration = "00:00:00"
    }
    /**
     *Update the right time
     *OSD calls this function to update the right time
     */
    updateRightTime(duration: string) {
        this.duration = duration
        this.render()
    }
    render() {
        this.$el.html(this.template({ duration: this.duration }))
        return this
    }
}
/**
 * View which diplays the play button
 */
export class PlayButtonView extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string

    initialize() {
        this.template = require("ejs-compiled-loader!./playButton.ejs")
        this.display = "none"
    }


    /**
     *display the play button 
     *OSD calls this function to display the button
     */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the play button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }
    render() {
        this.$el.html(this.template({ display: this.display }))
        return this
    }
}
/**
 * View which diplays the stop button
 */
export class StopButtonView extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string

    initialize() {
        this.template = require("ejs-compiled-loader!./stopButton.ejs")
        this.display = "none"
    }

    /**
     *display the stop button 
     *OSD calls this function to display the button
     */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the stop button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }

    render() {
        this.$el.html(this.template({ display: this.display }))
        return this
    }
}
/**
 * View which diplays the pause button
 */
export class PauseButtonView extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string
    initialize() {
        this.template = require("ejs-compiled-loader!./pauseButton.ejs")
        this.display = "none"
    }

    /**
     *display the pause button 
     *OSD callss this function to display the button
     */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the pause button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }
    activeButton() {
        console.log("active backward")
    }
    desactivateButton() {
        console.log("desactivate backward")
    }
    render() {
        this.$el.html(this.template({ display: this.display }))
        return this
    }
}
/**
 * View which diplays the fastBackward button
 */
export class FastBackwardButton extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string
    private active: string
    initialize() {
        this.template = require("ejs-compiled-loader!./fastBackwardButton.ejs")
        this.display = "none"
        this.active = "btn-primary"
    }

    /**
     *display the fastBackward button 
     *OSD calls this function to display the button
     */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the fastBackward button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }

    /**
     * add a style from the button
     */
    activeButton() {
        this.active = "btn-warning"
        this.render()
    }
    /**
     * remove a style from the button
     */
    desactivateButton() {
        this.active = "btn-primary"
        this.render()
    }
    render() {
        this.$el.html(this.template({ active: this.active, display: this.display }))
        return this
    }
}
/**
 * View which diplays the fastForwardButton button
 */
export class FastForwardButtonView extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string
    private active: string
    initialize() {
        this.template = require("ejs-compiled-loader!./fastForwardButton.ejs")
        this.display = "none"
        this.active = "btn-primary"
    }

    /**
     *display the fastForwardButton button 
     *OSD calls this function to display the button
     */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the fastForward button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }
    /**
     * add a style from the button
     */
    activeButton() {
        this.active = "btn-warning"
        this.render()
    }
    /**
     * remove a style from the button
     */
    desactivateButton() {
        this.active = "btn-primary"
        this.render()
    }
    render() {
        this.$el.html(this.template({ active: this.active, display: this.display }))
        return this
    }
}
/**
 * View which diplays the NextButton button
 */
export class NextButtonView extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string

    initialize() {
        this.template = require("ejs-compiled-loader!./nextButton.ejs")
        this.display = "none"
    }

    /**
     *display the NextButton button 
     *OSD calls this function to display the button
     */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the next button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }
    render() {
        this.$el.html(this.template({ display: this.display }))
        return this
    }
}
/**
 * View which diplays the previous button
 */
export class PreviousButtonView extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string

    initialize() {
        this.template = require("ejs-compiled-loader!./previousButton.ejs")
        this.display = "none"
    }

    /**
     *display the previous button 
     *OSD calls this function to display the button
     */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the previous button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }
    render() {
        this.$el.html(this.template({ display: this.display }))
        return this
    }
}
export class JumpBackwardTimeView extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string
    private time?: number
    constructor(time?: number) {
        super()
        this.template = require("ejs-compiled-loader!./jumpBackwardTime.ejs")
        this.display = "none"
        this.time = time
    }
    /**
    *display the jumpBackwardTime button 
    *OSD calls this function to display the button
    */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the jumpBackwardTime button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }
    render() {
        this.$el.html(this.template({ display: this.display, time: this.time || 0}))
        return this
    }
}
export class JumpForwardTimeView extends Backbone.View<Backbone.Model> {
    private template: any
    private display: string
    private time?: number
    constructor(time?: number) {
        super()
        this.template = require("ejs-compiled-loader!./jumpForwardTime.ejs")
        this.time = time
        this.display = "none"
    }
    /**
    *display the jumpForwardTime button 
    *OSD calls this function to display the button
    */
    showButton() {
        this.display = "show"
        this.render()
    }
    /**
     * Hide the jumpForwardTime button
     * OSD callss this function to hide the button
     */
    hideButton() {
        this.display = "none"
        this.render()
    }
    render() {

        this.$el.html(this.template({ display: this.display, time: this.time || 0}))
        return this
    }
}
export class ProgressBarView extends Backbone.View<Backbone.Model> {
    private _template: any
    private percent: number
    initialize() {
        this._template = require("ejs-compiled-loader!./progressBar.ejs")
        this.percent = 0
    }
    /**
     * update the percentage
     */
    public updatePercent(value: number) {
        this.percent = value
        this.render()
    }
    render() {
        this.$el.html(this._template({ percent: this.percent }))
        return this
    }

}
export class IndicatorLive extends Backbone.View<Backbone.Model> {
    private _template: any
    private _valueText: string
    private _classCss: string
    constructor(live: boolean) {
        super()
        if (live) {
            this._valueText = "Live"
            this._classCss = "label-success"
        }
        else {
            this._valueText = "No live"
            this._classCss = "label-danger"
        }
    }
    initialize(options: any) {
        this._template = require("ejs-compiled-loader!./liveIndicator.ejs")
    }
    render() {
        this.$el.html(this._template({ classCss: this._classCss, valueText: this._valueText }))
        return this
    }
}
export class SpeedIndicator extends Backbone.View<Backbone.Model> {
    private _template: any
    private _speed: string
    initialize() {
        this._template = require("ejs-compiled-loader!./speedIndicator.ejs")
        this._speed = ''
    }
    public updateSpeedIndicator(value: number) {
        if (value === 0) {
            this._speed = ''
        }
        else {
            this._speed = (value * 2) + 'x'
        }
        this.render()
    }
    render() {
        this.$el.html(this._template({ speed: this._speed }))
        return this
    }
}
