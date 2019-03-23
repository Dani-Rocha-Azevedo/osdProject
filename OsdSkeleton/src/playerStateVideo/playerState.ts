import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'
import {StateMachine} from './StateMachine'
import {states} from './StateMachine'
import {ConfigOSD} from '../config'
import { PlayingAsset } from '../playingAsset';
import { Video } from '../assets/Video';
import {Asset} from '../assets/Asset';
import * as moment from 'moment'
export class PlayerState extends Backbone.View<Backbone.Model> {
    private _stateMachine: StateMachine
    private _template: any
    private config: ConfigOSD
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _interval?: any
    /**
     * Constructor
     * Initialize the attributes and the state machine
     */
    constructor(options: any) {
        super(options)
        this._template = require("ejs-compiled-loader!./playerState.ejs")
        let playerVideo = <HTMLMediaElement> document.getElementById('playerVideo')
        this._stateMachine = new StateMachine()
        this.config = new ConfigOSD("glyphicon glyphicon-play-circle", false, true, true, true, true, true, true)
        this._playingAsset = options.playingAsset
        this._playingAsset.config = this.config
      //  let myVideo =<HTMLMediaElement>document.getElementById('playerVideo');
        let asset: Asset = new Video(options.asset.description , Math.round(options.asset.duration), options.asset.src)
        this._playingAsset.asset = asset
        this._eventBus.trigger("configChange")
        this._onEnterState()
        this._onLeaveState()
        this._updateCurrentTime()
    }

    _updateCurrentTime() {
        this._interval = setInterval(() => {
            let myVideo =<HTMLMediaElement>document.getElementById('playerVideo');
            if(myVideo) {
                this._playingAsset.currentPosition = myVideo.currentTime;
                (<Video>this._playingAsset.asset).duration = myVideo.duration
            }
        }, 1000)
    }
    initialize(options: any) {
        this._eventBus = options.eventBus
        this._initEvent()
    }
    /**
     * Init the events
     * Listens all triggers send
     */
    _initEvent() {
        this._eventBus.on("play", this._play, this)
        this._eventBus.on("stop", this._stop, this)
        this._eventBus.on("pause", this._pause, this)
        this._eventBus.on("backward", this._backward, this)
        this._eventBus.on("fastForward", this._fastFroward, this)
    }
    render() {
        if(this._playingAsset.asset) {
            this.$el.html(this._template({src: this._playingAsset.asset.src}))
        }
        return this
    }

    _play() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.play(myVideo).then(() => {
            this._eventBus.trigger("configChange")
        }).catch( (err) => {
            this._eventBus.trigger("configChange")
        })
    }    
    _pause() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.pause(myVideo).then(() => {
            this._eventBus.trigger("configChange")
        }).catch( (err) => {
            this._eventBus.trigger("configChange")
        })
    }
    _stop() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.stop(myVideo).then(() => {
            this._eventBus.trigger("configChange")
        }).catch( (err) => {
            this._eventBus.trigger("configChange")
        })
    }
    _fastFroward() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.fastForward(myVideo).then(() => {
            this._eventBus.trigger("configChange")
        }).catch( (err) => {
            this._eventBus.trigger("configChange")
        })
    }
    _backward() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.backward(myVideo).then(() => {
            this._eventBus.trigger("configChange")
        }).catch( (err) => {
            this._eventBus.trigger("configChange")
        })
    }
    /**
      * Diplay the adequate indicator/button
      */
 
     _onEnterState() {
        this._stateMachine.onEnterState(states.PAUSED, () => {
            this.config.indicatorClass = "glyphicon glyphicon-pause"
            this.config.pauseButton = false
            this.config.playButton = true
        })
        this._stateMachine.onEnterState(states.STOPPED, () => {
            this.config.indicatorClass = "glyphicon glyphicon-stop"
            this.config.playButton = false
        })
        this._stateMachine.onEnterState(states.PLAYING, () => {
            this.config.indicatorClass = "glyphicon glyphicon-play-circle"
            this.config.playButton = false
            this.config.pauseButton = true
        })
        this._stateMachine.onEnterState(states.BACKWARDING, () => {
            this.config.indicatorClass = "glyphicon glyphicon-fast-backward"
            this.config.pauseButton = false
        })
        this._stateMachine.onEnterState(states.FASTFORWARDING, () => {
            this.config.indicatorClass = "glyphicon glyphicon-fast-forward"
            this.config.pauseButton = false
        })
    }
    _onLeaveState() {
       this._stateMachine.onLeaveState(states.STOPPED, () => {
           this.config.stopButton = true
       })
       this._stateMachine.onLeaveState(states.PAUSED, () => {
           this.config.pauseButton = true
       })
       this._stateMachine.onLeaveState(states.PLAYING, () => {
           this.config.playButton = true
       })
       this._stateMachine.onLeaveState(states.BACKWARDING, () => {
           this.config.pauseButton = true
       })
       this._stateMachine.onLeaveState(states.FASTFORWARDING, () => {
           this.config.pauseButton = true
       })
   }
}