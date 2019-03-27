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
        this._playingAsset.state = states.PLAYING
    }
    render(){
        this.$el.html(this._template({src: this._playingAsset.asset.src}))
        return this
    }
    public play(): IPlayerState {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.play(myVideo).then(() => {
            this._playingAsset.state = states.PLAYING
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public stop(): IPlayerState {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.stop(myVideo).then(() => {
            this._playingAsset.state = states.STOPPED
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public pause(): IPlayerState {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.pause(myVideo).then(() => {
            this._playingAsset.state = states.PAUSED
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public fastForward(): IPlayerState {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.fastForward(myVideo).then(() => {
            this._playingAsset.state = states.FASTFORWARDING
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public fastBackward(): IPlayerState {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.backward(myVideo).then(() => {
            this._playingAsset.state = states.BACKWARDING
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public removeView(): void {
        this.remove()
    }


}