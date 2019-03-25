import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'
import {Video} from '../assets/Video'
import {ConfigOSD} from '../config'
import {PlayingAsset} from '../playingAsset'
import {LeftTimeView, StopButtonView, PlayButtonView, 
    FastForwardButtonView, FastBackwardButton, NextButtonView, PreviousButtonView} from './view'
import {RightTimeView} from './view'
import {PauseButtonView} from './view'
export class RegularRenderer extends Backbone.View<any> {
    private _template: any
    private _config ?: ConfigOSD
    private _eventBus: any
    private _playingAsset: PlayingAsset
    // The views
    private _currentTimeView: LeftTimeView
    private _durationView: RightTimeView
    private _pauseButton: PauseButtonView
    private _stopButton: StopButtonView
    private _playButton: PlayButtonView
    private _fastForwardButton: FastForwardButtonView
    private _fastBackwardButton: FastBackwardButton
    private _nextButton: NextButtonView
    private _previousButton: PreviousButtonView
    constructor(options: any) {
        super(options)
    }
    initialize(options: any) {
        this._template = require("ejs-compiled-loader!./regularRenderer.ejs")
        this._playingAsset = options.playingAsset
        this._config = this._playingAsset.config
        if(this._playingAsset) {
            this.listenTo(this._playingAsset, 'change:currentPosition', this.updateCurrentPosition)
        }
       
        this._eventBus = options.eventBus
        this._currentTimeView = new LeftTimeView()
        this._durationView = new RightTimeView()
        this._pauseButton = new PauseButtonView()
        this._playButton = new PlayButtonView()
        this._stopButton = new StopButtonView()
        this._fastBackwardButton = new FastBackwardButton()
        this._fastForwardButton = new FastForwardButtonView()
        this._nextButton = new NextButtonView()
        this._previousButton = new PreviousButtonView()
        this._eventBus.on("configChange", this._updateConfig, this)
    }
    /**
     * Current position updated
     */
    updateCurrentPosition() {
        this._currentTimeView.updateCurrentTime(this._playingAsset.getCurrentPosition())
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
        if(this._config) {
            let options = {
                config: this._config,
                duration: this._playingAsset.asset ? (<Video> this._playingAsset.asset).getDuration() : "no Info"
            }
            this.$el.html(this._template(options))
            this.$("#duration").html(this._durationView.render().el)
            this._durationView.updateDuration((<Video>this._playingAsset.asset).getDuration())
            this.$("#currentTime").html(this._currentTimeView.render().el)
            this.$("#pauseButton").html(this._pauseButton.render().el)
            this.$("#playButton").html(this._playButton.render().el)
            this.$("#stopButton").html(this._stopButton.render().el)
            this.$("#fastForwardButton").html(this._fastForwardButton.render().el)
            this.$("#fastBackwardButton").html(this._fastBackwardButton.render().el)
            this.$("#nextButton").html(this._nextButton.render().el)
            this.$("#previousButton").html(this._previousButton.render().el)
        }
        return this
    }

    /**
     * Launch whe a use click on play button
     * Send a trigger "play"
     */
    _play() {
        this._eventBus.trigger("play")
    }
    /**
     * Launch whe a use click on pause button
     * Send a trigger "pause"
     */
    _pause() {
        this._eventBus.trigger("pause")
    }
    /**
     * Launch whe a use click on stop button
     * Send a trigger "stop"
     */
    _stop() {
        this._eventBus.trigger("stop")
    /**
     * Launch whe a use click on backward button
     * Send a trigger "backward"
     */
    }
    _backward() {
        this._eventBus.trigger("backward")
    }
    /**
     * Launch whe a use click on fast forward button
     * Send a trigger "fastForward"
     */
    _forward() {
        this._eventBus.trigger("fastForward")
    }
    /**
     * Launch whe a use click on next button
     * Send a trigger "next"
     */
    _next() {
        this._eventBus.trigger("next")
    }
    /**
     * Launch whe a use click on previous button
     * Send a trigger "previous"
     */
    _previous() {
        this._eventBus.trigger("previous")
    }

    /**
     * hide or display pause button
     */
    private _updatePauseButton() {
        if(this._config && this._config.pauseButton) {
            this._pauseButton.showButton()
        }
        else {
            this._pauseButton.hideButton()
        }
    }
    /**
     * hide or display play button
     */
    private _updatePlayButton() {
        if(this._config && this._config.playButton) {
            this._playButton.showButton()
        }
        else {
            this._playButton.hideButton()
        }
    }
    /**
     * hide or display stop button
     */
    private _updateStopButton() {
        if(this._config && this._config.stopButton) {
            this._stopButton.showButton()
        }
        else {
            this._stopButton.hideButton()
        }
    }
    /**
     * hide or display fastForward button
     */
    private _updateFastForwardButton() {
        if(this._config && this._config.fastForwardButton) {
            this._fastForwardButton.showButton()
        }
        else {
            this._fastForwardButton.hideButton()
        }
    }
    /**
     * hide or display fastBackward button
     */
    private _updateFastBackwardButton() {
        if(this._config && this._config.fastBackwardButton) {
            this._fastBackwardButton.showButton()
        }
        else {
            this._fastBackwardButton.hideButton()
        }
    }
    /**
     * hide or display next button
     */
    private _updateNextButton() {
        if(this._config && this._config.nextButton) {
            this._nextButton.showButton()
        }
        else {
            this._nextButton.hideButton()
        }
    }
    /**
     * hide or display previous button
     */
    private _updatePreviousButton() {
        if(this._config && this._config.previousButton) {
            this._previousButton.showButton()
        }
        else {
            this._previousButton.hideButton()
        }
    }
    private _updateConfig() {
        this._config = this._playingAsset.config
        if(this._config) {
            this.listenTo(this._config, 'change:pauseButton', this._updatePauseButton)
            this.listenTo(this._config, 'change:playButton', this._updatePlayButton)
            this.listenTo(this._config, 'change:stopButton', this._updateStopButton)
            this.listenTo(this._config, 'change:fastForwardButton', this._updateFastForwardButton)
            this.listenTo(this._config, 'change:backwardButton', this._updateFastBackwardButton)
            this.listenTo(this._config, 'change:nextButton', this._updateNextButton)
            this.listenTo(this._config, 'change:previousButton', this._updatePreviousButton)

        }
        this._firstDisplay()
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
}

