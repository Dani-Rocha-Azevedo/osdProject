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
    private eventBus: any
    private playingAsset: PlayingAsset
    private asset: any = [
        {
            duration : 157.000,
            description: "Pokemon",
            src: "https://test.flowr.cloud/ozone/caw18fZLa9"
        },
        {   duration: 157.000,
            description: "Ralph BD",
            src: "https://test.flowr.cloud/ozone/PURD7oFHye"
        }
    ]
    constructor() {
        super()
        // a revoir
        this.playingAsset = new PlayingAsset(new ConfigOSD("glyphicon glyphicon-play-circle", new Button(false, false), 
        new Button(true, false), new Button(true, false), new Button(true, false), 
        new Button(true, false), new Button(true, false), new Button(true, false))
            , new Video(this.asset[0].description, this.asset[0].duration, this.asset[0].src))
        this.eventBus = _.extend({}, Backbone.Events);
        this.osd = new OsdLayer({eventBus: this.eventBus, playingAsset: this.playingAsset})
        this.player = new PlayerState({eventBus: this.eventBus, playingAsset: this.playingAsset, asset: this.asset[0]})
        $('#player').html(this.player.render().el)
        $('#osd').html(this.osd.render().el)
        this._initEvent()
    }
    _initEvent() {
        this.eventBus.on("next", this._next, this)
        this.eventBus.on("previous", this._previous, this)
    }
    _next() {
        this.player = new PlayerState({eventBus: this.eventBus, playingAsset: this.playingAsset, asset: this.asset[1]})
        $("#player").html(this.player.render().el)
    }
    _previous() {
        this.player = new PlayerState({eventBus: this.eventBus, playingAsset: this.playingAsset, asset: this.asset[0]})
        $("#player").html(this.player.render().el)
    }
}