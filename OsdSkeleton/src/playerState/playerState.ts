import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'
import {StateMachine} from './StateMachine'
import {states} from './StateMachine'
import {ConfigOSD} from '../models/config'
import { PlayingAsset } from '../playingAsset';
import { Video } from '../models/assets/Video';
import {Asset} from '../models/assets/Asset';
import { Button } from '../models/button';
import { StateConst } from '../utils/const';
export class PlayerState extends Backbone.View<Backbone.Model> {
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
        this._template = require("ejs-compiled-loader!./playerState.ejs")
        this._stateMachine = new StateMachine()
        this._playingAsset = options.playingAsset
        let asset: Asset = new Video(options.asset.description , Math.round(options.asset.duration), options.asset.src)
        this._playingAsset.asset = asset
        // this._onEnterState()
        // this._onLeaveState()
        this._playingAsset.state = StateConst.PLAYING
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

    public play() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.play(myVideo).then(() => {
            this._playingAsset.state = StateConst.PLAYING
        }).catch((err) => {
            console.log(err)
        })
    }    
    public pause() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.pause(myVideo).then(() => {
            this._playingAsset.state = StateConst.PAUSED
        }).catch((err) => {
            console.log(err)
        })
    }
    public stop() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.stop(myVideo).then(() => {
            this._playingAsset.state = StateConst.STOPPED
        }).catch((err) => {
            console.log(err)
        })
    }
    public fastForward() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.fastForward(myVideo).then(() => {
            this._playingAsset.state = StateConst.FORWARDING
        }).catch((err) => {
            console.log(err)
        })
    }
    public fastBackward() {
        let myVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        this._stateMachine.backward(myVideo).then(() => {
            this._playingAsset.state = StateConst.BACKWARDING
        }).catch((err) => {
            console.log(err)
        })
    }
}