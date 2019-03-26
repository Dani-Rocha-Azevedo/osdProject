import * as Backbone from 'backbone'
import { ConfigOSD } from './models/config';
import { PlayingAsset } from './playingAsset';
import { RegularRenderer } from './renderer/regularRenderer';
export class OsdLayer extends Backbone.View<any> {
    private _template: any
    private _config : ConfigOSD
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _renderer: RegularRenderer
    constructor(options: any) {
        super(options)
    }
    initialize(options: any) {
        this._template = require("ejs-compiled-loader!./OsdLayer.ejs")
        this._playingAsset = options.playingAsset
        this._config = this._playingAsset.config
        this._renderer = new RegularRenderer(this._playingAsset.asset)
        if(this._playingAsset) {
            this.listenTo(this._playingAsset, 'change:currentPosition', this._updateLeftTime)
        }
        this._eventBus = options.eventBus
        this._eventBus.on("configChange", this._updateConfig, this)
    }
    /**
     * Handle all actions
     */
    events():  Backbone.EventsHash {
        return { 
            'click #playButton': '_play',
            'click #pauseButton': '_pause',
            'click #stopButton': '_stop',
            'click #fastBackwardButton': '_backward',
            'click #fastForwardButton': '_forward',
            'click #previousButton': '_previous',
            'click #nextButton': '_next'
        }
    }
    
    render() {
        this.$el.html(this._template())
        this.$("#osdRenderer").html(this._renderer.render().el)
        return this
    }
     /**
     * Launch whe a use click on play button
     * Send a trigger "play"
     */
    private _play() {
        this._eventBus.trigger("play")
    }
    /**
     * Launch whe a use click on pause button
     * Send a trigger "pause"
     */
    private _pause() {
        this._eventBus.trigger("pause")
    }
    /**
     * Launch whe a use click on stop button
     * Send a trigger "stop"
     */
    private _stop() {
        this._eventBus.trigger("stop")
    /**
     * Launch whe a use click on backward button
     * Send a trigger "backward"
     */
    }
    private _backward() {
        this._eventBus.trigger("backward")
    }
    /**
     * Launch whe a use click on fast forward button
     * Send a trigger "fastForward"
     */
    private _forward() {
        this._eventBus.trigger("fastForward")
    }
    /**
     * Launch whe a use click on next button
     * Send a trigger "next"
     */
    private _next() {
        this._eventBus.trigger("next")
    }
    /**
     * Launch whe a use click on previous button
     * Send a trigger "previous"
     */
    private _previous() {
        this._eventBus.trigger("previous")
    }
     /**
     * Current position updated
     * Demand to renderer, to change the currentTime
     */
    private _updateLeftTime() {
        this._renderer.leftTime(this._playingAsset.getCurrentPosition())
    }
    // private _updateAssets() {
    //     this._renderer.rightTime(this._playingAsset.asset)
    // }
    /**
     * All config change
     */
    private _updateConfig() {
        this._config = this._playingAsset.config
        if(this._config) {

            this.listenTo(this._config.pauseButton, 'change:display', this._updatePauseButton)
            this.listenTo(this._config.playButton, 'change:display', this._updatePlayButton)
            this.listenTo(this._config.stopButton, 'change:display', this._updateStopButton)
            this.listenTo(this._config.fastForwardButton, 'change:display change:active', this._updateFastForwardButton)
            this.listenTo(this._config.fastBackwardButton, 'change:display change:active', this._updateFastBackwardButton)
            this.listenTo(this._config.nextButton, 'change:display', this._updateNextButton)
            this.listenTo(this._config.previousButton, 'change:display', this._updatePreviousButton)
            this._firstDisplay()
        }
        this.render()
    }
    private _firstDisplay() {
        this._updateFastBackwardButton()
        this._updateFastForwardButton()
        this._updateNextButton()
        this._updatePauseButton()
        this._updatePreviousButton()
        this._updatePlayButton()
        this._updateStopButton()
    }
 
     /**
     * hide or display pause button
     */
    private _updatePauseButton() {
        console.log("updatePauseButton")
        this._renderer.updatePauseButton(this._config.pauseButton)
    }
    /**
     * hide or display play button
     */
    private _updatePlayButton() {
       this._renderer.updatePlayButton(this._config.playButton)
    }
    /**
     * hide or display stop button
     */
    private _updateStopButton() {
        this._renderer.updateStopButton(this._config.stopButton)
    }
    /**
     * hide or display fastForward button
     */
    private _updateFastForwardButton() {
       this._renderer.updateFastForwardButton(this._config.fastForwardButton)
    }
    /**
     * hide or display fastBackward button
     */
    private _updateFastBackwardButton() {
       this._renderer.updateFastBackwardButton(this._config.fastBackwardButton)
    }
    /**
     * hide or display next button
     */
    private _updateNextButton() {
       this._renderer.updateNextButton(this._config.nextButton)
    }
    /**
     * hide or display previous button
     */
    private _updatePreviousButton() {
        this._renderer.updatePreviousButton(this._config.previousButton)
    }
}