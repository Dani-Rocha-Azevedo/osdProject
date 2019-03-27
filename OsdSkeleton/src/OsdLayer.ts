import * as Backbone from 'backbone'
import { ConfigOSD, ConfigAdmin } from './models/config';
import { PlayingAsset } from './playingAsset';
import { RegularRenderer } from './renderer/regularRenderer';
import { Button } from './models/button';
import { StateConst } from './utils/const';
export class OsdLayer extends Backbone.View<any> {
    private _template: any
    private _configAdmin : ConfigAdmin
    private _configOSD: ConfigOSD
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _renderer: RegularRenderer
    private state: string
    constructor(options: any) {
        super(options)
    }
    initialize(options: any) {
        this._template = require("ejs-compiled-loader!./OsdLayer.ejs")
        this._playingAsset = options.playingAsset
        this._configAdmin = this._playingAsset.config
        this._createConfigOSD()
        this._renderer = new RegularRenderer(this._playingAsset.asset)
        if(this._playingAsset) {
            this.listenTo(this._playingAsset, 'change:currentPosition', this._updateLeftTime)
            this.listenTo(this._playingAsset, 'change:state', this._updateConfig)

        }
        this._eventBus = options.eventBus
        this.state = this._playingAsset.state
        this._configOsdUpdated()
        this._firstDisplay()
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
     * Create the config of OSD
     * Display the button choose by admin
     */
    private _createConfigOSD() {
        this._configOSD = new ConfigOSD(
            new Button(this._configAdmin.playButton, false),
            new Button(this._configAdmin.stopButton, false), 
            new Button(this._configAdmin.pauseButton, false),
            new Button(this._configAdmin.fastBackwardButton, false),
            new Button(this._configAdmin.fastForwardButton, false),
            new Button(this._configAdmin.nextButton, false),
            new Button(this._configAdmin.previousButton, false)
        )
    }
    /**
     * state change
     */
    private _updateConfig() {
        this._onEnterState()
        this._onLeaveState()
        this.state = this._playingAsset.state
    }
    private _firstDisplay() {
        this._updateFastBackwardButton()
        this._updateFastForwardButton()
        this._updateNextButton()
        this._updatePauseButton()
        this._updatePreviousButton()
        this._updatePlayButton()
        this._updateStopButton()
        this._onEnterState()
        this.render()
    }
    private _onLeaveState() {
        switch(this.state) {
            case(StateConst.PLAYING) :
                this._configOSD.playButton.display = true
                break
            case(StateConst.PAUSED) :
                this._configOSD.pauseButton.display = true
                break
            case(StateConst.BACKWARDING) :
                this._configOSD.fastBackwardButton.active = false
                break
            case(StateConst.FORWARDING) :
                this._configOSD.fastForwardButton.active = false
                break
            case(StateConst.STOPPED) :
                this._configOSD.stopButton.display = true
                break    
        }
    }
    private _onEnterState() {
        switch(this._playingAsset.state) {
            case(StateConst.PLAYING) :
                this._configOSD.diplayAllButtons()
                this._configOSD.playButton.display = false
                if(this._configAdmin.pauseButton) {
                    this._configOSD.pauseButton.display = true
                }
                break
            case(StateConst.PAUSED) :
                this._configOSD.pauseButton.display = false
                if(this._configAdmin.playButton) {
                    this._configOSD.playButton.display = true
                }
                break
            case(StateConst.BACKWARDING) :
                this._configOSD.pauseButton.display = false
                if(this._configAdmin.playButton) {
                    this._configOSD.playButton.display = true
                }
                break
            case(StateConst.FORWARDING) :
                this._configOSD.pauseButton.display = false
                if(this._configAdmin.playButton) {
                    this._configOSD.playButton.display = true
                }
                break
            case(StateConst.STOPPED) :
                this._configOSD.hideAllButtons()
                this._configOSD.playButton.display = true
                break    
        }
    }
    private _configOsdUpdated() {
        this.listenTo(this._configOSD.playButton, 'change', this._updatePlayButton)
        this.listenTo(this._configOSD.pauseButton, 'change', this._updatePauseButton)
        this.listenTo(this._configOSD.stopButton, 'change', this._updateStopButton)
        this.listenTo(this._configOSD.fastBackwardButton, 'change', this._updateFastBackwardButton)
        this.listenTo(this._configOSD.fastForwardButton, 'change', this._updateFastForwardButton)
        this.listenTo(this._configOSD.nextButton, 'change', this._updateNextButton)
        this.listenTo(this._configOSD.previousButton, 'change', this._updatePreviousButton)
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
     /**
     * hide or display pause button
     */
    private _updatePauseButton() {
        this._renderer.updatePauseButton(this._configOSD.pauseButton)
    }

    /**
     * hide or display play button
     */
    private _updatePlayButton() {
       this._renderer.updatePlayButton(this._configOSD.playButton)
    }
    /**
     * hide or display stop button
     */
    private _updateStopButton() {
        this._renderer.updateStopButton(this._configOSD.stopButton)
    }
    /**
     * hide or display fastForward button
     */
    private _updateFastForwardButton() {
       this._renderer.updateFastForwardButton(this._configOSD.fastForwardButton)
    }
    /**
     * hide or display fastBackward button
     */
    private _updateFastBackwardButton() {
       this._renderer.updateFastBackwardButton(this._configOSD.fastBackwardButton)
    }
    /**
     * hide or display next button
     */
    private _updateNextButton() {
       this._renderer.updateNextButton(this._configOSD.nextButton)
    }
    /**
     * hide or display previous button
     */
    private _updatePreviousButton() {
        this._renderer.updatePreviousButton(this._configOSD.previousButton)
    }
}