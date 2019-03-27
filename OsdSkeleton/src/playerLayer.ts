import * as $ from 'jquery'
import * as _ from 'underscore'

import { PlayerState } from './playerState/playerState';
import * as Backbone from 'backbone'
import { PlayingAsset } from './playingAsset';
import { ConfigOSD } from './models/config';
import { OsdLayer } from './OsdLayer';
import { Video } from './models/assets/Video';
import {Button} from './models/button'
export class PlayerLayer extends Backbone.View<Backbone.Model>{
    private osd: OsdLayer
    private player: PlayerState
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _assets: Array<any>
    constructor(options: any) {
        super()
        // a revoir
        this._eventBus = options.eventBus
        this._assets = options.assets
        this._playingAsset = options.playingAsset
        this.player = new PlayerState({playingAsset: this._playingAsset, asset: this._assets[0]})
        $('#player').html(this.player.render().el)
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
        this.player = new PlayerState({_eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets[1]})
        $("#player").html(this.player.render().el)
    }
    private _previous() {
        this.player = new PlayerState({_eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets[0]})
        $("#player").html(this.player.render().el)
    }
    private _play() {
        this.player.play()
    }
    private _stop() {
        this.player.stop()
    }
    private _pause() {
        this.player.pause()
    }
    private _fastBackward() {
        this.player.fastBackward()
    }
    private _fastForward() {
        this.player.fastForward()
    }

   
}