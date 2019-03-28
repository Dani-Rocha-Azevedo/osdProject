import { IPlayerState } from "../IPlayerState";
import { PlayingAsset } from "../../playingAsset";
import { FrontEndLiveChannel } from "../../models/assets/FrontEndLiveChannel";
import { StateMachine } from './liveChannelStateMachine'
import { states } from "../../utils/constants";
import * as Backbone from 'backbone'
export class LiveChannelPlayerState extends Backbone.View<Backbone.Model>implements IPlayerState {
    private _stateMachine: StateMachine
    private _template: any
    private _playingAsset: PlayingAsset
    private _interval?: any
    constructor(options: any) {
        super()
        this._template = require("ejs-compiled-loader!./liveChannelPlayerState.ejs")
        this._playingAsset = options.playingAsset
        this._stateMachine = new StateMachine()
        //! get startTime, endTime by EPG
        let asset = new FrontEndLiveChannel(options.asset.description, options.asset.startTime, options.asset.endTime, options.asset.src)
        this._playingAsset.asset = asset
        this._playingAsset.state = states.PAUSED
        this._handleChangeState()
    }
    render(){
        this.$el.html(this._template({src: this._playingAsset.asset.src}))
        return this
    }
    public play(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        try {
            this._stateMachine.play(domVideo)
        }catch(err) {
            console.log(err)
        }
        return this
    }
    public stop(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        try {
            //this._stateMachine.stop(domVideo)
        }catch(err) {
            console.log(err)
        }
        return this
    }
    public pause(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        try {
           // this._stateMachine.pause(domVideo)
        }catch(err) {
            console.log(err)
        }
        return this
    }
    public fastForward(): IPlayerState {
        // Not handled 
        return this
    }
    public fastBackward(): IPlayerState {
        //TODO change playerState
        return this
    }
    public removeView(): void {
        this._playingAsset.speed = 0
        clearInterval(this._interval)
        this.remove()
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
    private _handleChangeState() {
        this._stateMachine.onEnterState(states.PAUSED, ()=> {
            this._playingAsset.state = states.PAUSED
            
        })
        this._stateMachine.onEnterState(states.STOPPED, ()=> {
            this._playingAsset.state = states.STOPPED
        }) 
        this._stateMachine.onEnterState(states.PLAYING, ()=> {
            this._playingAsset.state = states.PLAYING
            
        })
        this._stateMachine.onEnterState(states.FASTFORWARDING,()=> {
            this._playingAsset.state = states.FASTFORWARDING
        })
        this._stateMachine.onEnterState(states.BACKWARDING,()=> {
            this._playingAsset.state = states.BACKWARDING
        })
    }


}