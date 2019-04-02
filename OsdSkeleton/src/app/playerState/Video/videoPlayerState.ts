import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'
import {StateMachine} from './videoStateMachine'
import { PlayingAsset } from '../../playingAsset';
import { FrontEndVideo } from '../../models/assets/FrontEndVideo';
import {FrontEndAsset} from '../../models/assets/FrontEndAsset';
import { states } from '../../utils/constants';
import { IPlayerState } from '../IPlayerState';
import { resolveCname } from 'dns';
export class VideoPlayerState extends Backbone.View<Backbone.Model> implements IPlayerState{
    private _stateMachine: StateMachine
    private _template: any
    private _playingAsset: PlayingAsset
    private _interval?: any
    private _speeds: Array<number>
    private _currentSpeedIndex: number
    /**
     * Constructor
     * Initialize the attributes and the state machine
     */
    constructor(options: any) {
        super(options)
        this._template = require("ejs-compiled-loader!./videoPlayerState.ejs")
        this._stateMachine = new StateMachine()
        this._speeds = [0, .05, .1, .15, .2, .25]
        this._currentSpeedIndex = 0
        this._playingAsset = options.playingAsset
        let asset: FrontEndAsset = new FrontEndVideo(options.asset.description , Math.round(options.asset.duration), options.asset.src)
        this._playingAsset.asset = asset
        this._playingAsset.state = states.PAUSED
        this._playingAsset.speed = this._currentSpeedIndex
        this._updateCurrentTime()
        this._handleChangeState()
    }

    private _updateCurrentTime() {
        this._interval = setInterval(() => {
            let domVideo =<HTMLMediaElement>document.getElementById('playerVideo');
            if(domVideo) {
                this._playingAsset.currentPosition = domVideo.currentTime;
            }
            if(domVideo.currentTime >= ((<FrontEndVideo>this._playingAsset.asset).duration)) {
                this._videoEnded()
            }
        }, 1000)
    }
    public postRender(): void {
        
    }
    public render() {
        if(this._playingAsset.asset) {
            this.$el.html(this._template({src: this._playingAsset.asset.src}))
        }
        
        return this
    }
    public play(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.play(domVideo)
        return this
    }
    public stop(): IPlayerState  {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.stop(domVideo)
        return this
    }
    public pause(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.pause(domVideo)
        return this
    }
    public fastForward(): IPlayerState {
       
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        //It's not a successive click
        if(this._stateMachine.state.label !== states.FASTFORWARDING.label) {
            this._currentSpeedIndex = 0
        }
        this._currentSpeedIndex = Math.min(this._currentSpeedIndex + 1, this._speeds.length - 1)
        this._stateMachine.fastForward(domVideo, this._speeds[this._currentSpeedIndex])
        return this
    }
    public fastBackward(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        //It's not a successive click
        if(this._stateMachine.state.label !== states.BACKWARDING.label) {
           this._currentSpeedIndex = 0
        }
        this._currentSpeedIndex = Math.min(this._currentSpeedIndex + 1, this._speeds.length - 1)
        this._stateMachine.backward(domVideo,this._speeds[this._currentSpeedIndex])
        return this
    }

    public jumpBackwardTime(time: number): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.jumpBackwardTime(domVideo, time)
        return this
    }

    public jumpForwardTime(time: number): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.jumpForwardTime(domVideo, time)
        return this
    }
    public removeView(): void {
        this._currentSpeedIndex = 0
        this._playingAsset.speed = this._currentSpeedIndex
        clearInterval(this._interval)
        this.remove()
    }
    public getPlayerState(): IPlayerState {
        return this
    }
    
    /**
     * Launch when the video's finished
     */
    private _videoEnded() {
        try {
            let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
            this._stateMachine.stop(domVideo)
        }catch(err) {
            console.log(err)
        } 
    }
    /**
     * public for testing
     */
    public _handleChangeState() {
        this._stateMachine.onEnterState(states.PAUSED, ()=> {
            this._playingAsset.state = states.PAUSED
            this._currentSpeedIndex = 0
            if(this._playingAsset.speed !== this._currentSpeedIndex) {
                this._playingAsset.speed = this._currentSpeedIndex
            }
        })
        this._stateMachine.onEnterState(states.STOPPED, ()=> {
            this._playingAsset.state = states.STOPPED
            this._currentSpeedIndex = 0
            if(this._playingAsset.speed !== this._currentSpeedIndex) {
                this._playingAsset.speed = this._currentSpeedIndex
            }
        })
        this._stateMachine.onEnterState(states.PLAYING, ()=> {
            this._playingAsset.state = states.PLAYING
            this._currentSpeedIndex = 0
            if(this._playingAsset.speed !== this._currentSpeedIndex) {
                this._playingAsset.speed = this._currentSpeedIndex
            }
        })
        this._stateMachine.onEnterState(states.FASTFORWARDING,()=> {
            this._playingAsset.state = states.FASTFORWARDING
            this._playingAsset.speed = this._currentSpeedIndex
        })
        this._stateMachine.onEnterState(states.BACKWARDING,()=> {
            this._playingAsset.state = states.BACKWARDING
            this._playingAsset.speed = this._currentSpeedIndex
        })
    }
    
    
   
}