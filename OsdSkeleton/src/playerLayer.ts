import * as $ from 'jquery'
import * as _ from 'underscore'

import { VideoPlayerState } from './playerState/Video/videoPlayerState';
import * as Backbone from 'backbone'
import { PlayingAsset } from './playingAsset';
import { OsdLayer } from './osd/osdLayer';
import { IPlayerState } from './playerState/IPlayerState';
import { PlayerStateFactory } from './playerState/playerStateFactory';
import { Stack } from './utils/stack';
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
        $('#player').html(this.playerState.render().el)
        this._initEvent()
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
    private _next() {
        this.playerState.removeView()
        this.playerState = this.playerStateFactory.makePlayer({eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getNext()})
        $("#player").html(this.playerState.render().el)
    }
    private _previous() {
        this.playerState.removeView()
        this.playerState = this.playerStateFactory.makePlayer({eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getPrevious()})
        $("#player").html(this.playerState.render().el)
    }
    private _play() {
        this.playerState.play()
    }
    private _stop() {
        this.playerState.stop()
    }
    private _pause() {
        this.playerState.pause()
    }
    private _fastBackward() {
        this.playerState.fastBackward()
    }
    private _fastForward() {
        this.playerState.fastForward()
    }

   
}