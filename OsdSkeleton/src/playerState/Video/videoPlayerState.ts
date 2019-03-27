import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'
import {StateMachine} from './videoStateMachine'
import { PlayingAsset } from '../../playingAsset';
import { FrontEndVideo } from '../../models/assets/FrontEndVideo';
import {FrontEndAsset} from '../../models/assets/FrontEndAsset';
import { states } from '../../utils/constants';
import { IPlayerState } from '../IPlayerState';
export class VideoPlayerState extends Backbone.View<Backbone.Model> implements IPlayerState{ 
    private _stateMachine: StateMachine
    private _template: any
    private _playingAsset: PlayingAsset
    private _interval?: any
    /**
     * Constructor
     * Initialize the attributes and the state machine
     */
    constructor(options: any) {
        super(options)
        this._template = require("ejs-compiled-loader!./videoPlayerState.ejs")
        this._stateMachine = new StateMachine()
        this._playingAsset = options.playingAsset
        let asset: FrontEndAsset = new FrontEndVideo(options.asset.description , Math.round(options.asset.duration), options.asset.src)
        this._playingAsset.asset = asset
        this._playingAsset.state = states.PLAYING
        this._updateCurrentTime()
    }

    _updateCurrentTime() {
        this._interval = setInterval(() => {
            let myVideo =<HTMLMediaElement>document.getElementById('playerVideo');
            if(myVideo) {
                this._playingAsset.currentPosition = myVideo.currentTime;
            }
        }, 1000)
    }
    render() {
        if(this._playingAsset.asset) {
            this.$el.html(this._template({src: this._playingAsset.asset.src}))
        }
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
        clearInterval(this._interval)
        this.remove()
    }

   
}