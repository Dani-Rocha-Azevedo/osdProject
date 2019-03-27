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
            let domVideo =<HTMLMediaElement>document.getElementById('playerVideo');
            if(domVideo) {
                this._playingAsset.currentPosition = domVideo.currentTime;
            }
            if(domVideo.currentTime >= ((<FrontEndVideo>this._playingAsset.asset).duration)) {
                this._videoEnded()
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
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.play(domVideo).then(() => {
            this._playingAsset.state = states.PLAYING
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public stop(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.stop(domVideo).then(() => {
            this._playingAsset.state = states.STOPPED
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public pause(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.pause(domVideo).then(() => {
            this._playingAsset.state = states.PAUSED
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public fastForward(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.fastForward(domVideo).then(() => {
            this._playingAsset.state = states.FASTFORWARDING
        }).catch((err) => {
            console.log(err)
        })
        return this
    }
    public fastBackward(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.backward(domVideo).then(() => {
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
    /**
     * Launch when the video's finished
     */
    private _videoEnded() {
        this._playingAsset.state = states.STOPPED
    }

   
}