import * as Backbone from 'backbone'
import { ConfigToDisplay, ConfigAdmin } from '../models/config';
import { PlayingAsset } from '../playingAsset';
import { RegularRenderer } from '../renderer/regularRenderer';
import { Button } from '../models/button';
import { states } from '../utils/constants';
import { fsm } from 'typescript-state-machine'
import State = fsm.State
import { StateMachine } from './osdStateMachine';
import { RendererFactory } from './rendererFactory';
import { IRenderer } from '../renderer/IRenderer';
export class OsdLayer extends Backbone.View<any> {
    private _template: any
    private _configAdmin : ConfigAdmin
    private _configToDisplay: ConfigToDisplay
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _rendererFactory : RendererFactory
    private _renderer: IRenderer
    private _stateMachine: StateMachine
    constructor(options: any) {
        super(options)
    }
    initialize(options: any) {
        this._template = require("ejs-compiled-loader!./osdLayer.ejs")
        this._playingAsset = options.playingAsset
        this._configAdmin = options.config
        this._stateMachine = new StateMachine(this._playingAsset.state)
        this._rendererFactory = new RendererFactory()
        this._renderer = this._rendererFactory.makeRenderer(this._playingAsset.asset)
        this._createConfigOSD()

        if(this._playingAsset) {
            this.listenTo(this._playingAsset, 'change:currentPosition', this._updateLeftTime)
            this.listenTo(this._playingAsset, 'change:speed', this._speedUpdated)
            this.listenTo(this._playingAsset, 'change:state', this._stateUpdated)
            this.listenTo(this._playingAsset, 'change:asset', this._assetUpdated)
        }
        this._onEnterState()
        this._onLeaveState()
        // first update
        this._stateUpdated()
        this._eventBus = options.eventBus
        this._configToDisplayUpdated()
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
        this._configToDisplay = new ConfigToDisplay(
            new Button(this._configAdmin.playButton, false),
            new Button(this._configAdmin.stopButton, false), 
            new Button(this._configAdmin.pauseButton, false),
            new Button(this._configAdmin.fastBackwardButton, false),
            new Button(this._configAdmin.fastForwardButton, false),
            new Button(this._configAdmin.nextButton, false),
            new Button(this._configAdmin.previousButton, false)
        )
    }
    private _assetUpdated(){
        this._renderer.removeView()
        this._renderer = this._rendererFactory.makeRenderer(this._playingAsset.asset)
        this._firstDisplay()
    }
    /**
     * state change
     */
    private _stateUpdated() {
        this._stateMachine.setState(this._playingAsset.state)
    }
    /**
     * The speed has been updated
     */
    private _speedUpdated() {
        this._renderer.updateSpeedIndicator(this._playingAsset.speed)
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
        this._stateMachine.onLeaveState(states.PLAYING, ()=> {
            this._configToDisplay.playButton.display = true
        })
        this._stateMachine.onLeaveState(states.PAUSED, ()=> {
            this._configToDisplay.pauseButton.display = true
        })
        this._stateMachine.onLeaveState(states.FASTFORWARDING, ()=> {
            this._configToDisplay.fastForwardButton.active = false
        })
        this._stateMachine.onLeaveState(states.BACKWARDING, ()=> {
            this._configToDisplay.fastBackwardButton.active = false
        })
        // this._stateMachine.onLeaveState(states.STOPPED, ()=> {
        //     this._configToDisplay.stopButton.display = true
        // })
    }
    private _onEnterState() {
        this._stateMachine.onEnterState(states.PLAYING, ()=> {
            //this._configToDisplay.diplayAllButtons()// when the user click on stop 
            this._configToDisplay.playButton.display = false
            if(this._configAdmin.pauseButton) {
                this._configToDisplay.pauseButton.display = true
            }
        })
        this._stateMachine.onEnterState(states.PAUSED, ()=> {
            this._configToDisplay.pauseButton.display = false
            if(this._configAdmin.playButton) {
                this._configToDisplay.playButton.display = true
            }
        })
        this._stateMachine.onEnterState(states.FASTFORWARDING, ()=> {
            this._configToDisplay.pauseButton.display = false
            this._configToDisplay.fastForwardButton.active = true
            if(this._configAdmin.playButton) {
                this._configToDisplay.playButton.display = true
            }
        })
        this._stateMachine.onEnterState(states.BACKWARDING, ()=> {
            this._configToDisplay.pauseButton.display = false
            this._configToDisplay.fastBackwardButton.active = true
            if(this._configAdmin.playButton) {
                this._configToDisplay.playButton.display = true
            }
        })
        // this._stateMachine.onEnterState(states.STOPPED, ()=> {
        //     this._configToDisplay.hideAllButtons()
        //     this._configToDisplay.playButton.display = true
        // })
    }
    private _configToDisplayUpdated() {
        this.listenTo(this._configToDisplay.playButton, 'change', this._updatePlayButton)
        this.listenTo(this._configToDisplay.pauseButton, 'change', this._updatePauseButton)
        this.listenTo(this._configToDisplay.stopButton, 'change', this._updateStopButton)
        this.listenTo(this._configToDisplay.fastBackwardButton, 'change', this._updateFastBackwardButton)
        this.listenTo(this._configToDisplay.fastForwardButton, 'change', this._updateFastForwardButton)
        this.listenTo(this._configToDisplay.nextButton, 'change', this._updateNextButton)
        this.listenTo(this._configToDisplay.previousButton, 'change', this._updatePreviousButton)
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
        this._renderer.updateLeftTime(this._playingAsset.getCurrentPosition())
    }
     /**
     * hide or display pause button
     */
    private _updatePauseButton() {
        this._renderer.updatePauseButton(this._configToDisplay.pauseButton)
    }

    /**
     * hide or display play button
     */
    private _updatePlayButton() {
       this._renderer.updatePlayButton(this._configToDisplay.playButton)
    }
    /**
     * hide or display stop button
     */
    private _updateStopButton() {
        this._renderer.updateStopButton(this._configToDisplay.stopButton)
    }
    /**
     * hide or display fastForward button
     */
    private _updateFastForwardButton() {
       this._renderer.updateFastForwardButton(this._configToDisplay.fastForwardButton)
    }
    /**
     * hide or display fastBackward button
     */
    private _updateFastBackwardButton() {
       this._renderer.updateFastBackwardButton(this._configToDisplay.fastBackwardButton)
    }
    /**
     * hide or display next button
     */
    private _updateNextButton() {
       this._renderer.updateNextButton(this._configToDisplay.nextButton)
    }
    /**
     * hide or display previous button
     */
    private _updatePreviousButton() {
        this._renderer.updatePreviousButton(this._configToDisplay.previousButton)
    }
}