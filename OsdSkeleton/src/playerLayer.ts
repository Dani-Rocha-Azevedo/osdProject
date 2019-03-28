import * as $ from 'jquery'
import * as _ from 'underscore'

import { VideoPlayerState } from './playerState/Video/videoPlayerState';
import * as Backbone from 'backbone'
import { PlayingAsset } from './playingAsset';
import { OsdLayer } from './osd/osdLayer';
import { IPlayerState } from './playerState/IPlayerState';
import { PlayerStateFactory } from './playerState/playerStateFactory';
import { Stack } from './utils/stack';
import { states } from './utils/constants';
import { LiveChannelPlayerState } from './playerState/LiveChannel/liveChannelPlayerState';
export class PlayerLayer extends Backbone.View<Backbone.Model>{
    private osd: OsdLayer
    private playerState: IPlayerState
    private playerStateFactory: PlayerStateFactory
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _assets: Stack
    constructor(options: any) {
        super()
        // a revoir
        this._eventBus = options.eventBus
        this._assets = options.assets
        this._assets = new Stack(this._assets)
        this._playingAsset = options.playingAsset
        this.playerStateFactory = new PlayerStateFactory()
        this.playerState = this.playerStateFactory.makePlayer({eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getNext()})
        this.listenTo(this._playingAsset,'change:state', this._stateUpdated)
        this._initEvent()
        $('#player').html(this.playerState.render().el)
        this.playerState.play()
    }
    _initEvent() {
        this._eventBus.on("next", this._next, this)
        this._eventBus.on("previous", this._previous, this)
        this._eventBus.on("play", this._play, this)
        this._eventBus.on("stop", this._stop, this)
        this._eventBus.on("pause", this._pause, this)
        this._eventBus.on("backward", this._fastBackward, this)
        this._eventBus.on("fastForward", this._fastForward, this)
    }
    /**
     * Demand to playerStateFactory a new PlayerState and give the next asset to play
     */
    private _next() {
        this.playerState.removeView()
        this.playerState = this.playerStateFactory.makePlayer({eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getNext()})
        $("#player").html(this.playerState.render().el)
        this.playerState.play()
    }
     /**
     * Demand to playerStateFactory a new PlayerState and give the previous asset to play
     */
    private _previous() {
        this.playerState.removeView()
        this.playerState = this.playerStateFactory.makePlayer({eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getPrevious()})
        $("#player").html(this.playerState.render().el)
        this.playerState.play()

    }
     /**
     * Demand to playerState to play the asset 
     */
    private _play() {
        this.playerState.play()
    }
    /**
     * Remove the playerView and return in the previous menu
     */
    private _stop() {
        this.playerState.removeView()
        //this.playerState.stop()
    }
    /**
     * Demand to playerState to pause the asset
     */
    private _pause() {
        this.playerState.pause()
    }
    /**
     * Demand to playerState to rewind the asset
     */
    private _fastBackward() {
        this.playerState.fastBackward()
    }
    /**
     * Demand to playerState to forward the asset 
     */
    private _fastForward() {
        this.playerState.fastForward()
    }
    /**
     * Launch when the state is updated
     * The state is stopped, launch the function "next"
     * The state isn't stopped, do nothing
     */
    private _stateUpdated() {
        if(this._playingAsset.state == states.STOPPED) {
            //TODO if the playlist is in loop mode
            this._next()
        }
    }
   
}