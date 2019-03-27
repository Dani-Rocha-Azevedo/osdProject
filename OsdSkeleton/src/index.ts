import {PlayerLayer} from './playerLayer'
import { OsdLayer } from './OsdLayer';
import * as $ from 'jquery'
import * as _ from 'underscore'
import * as Backbone from 'backbone'
import { PlayingAsset } from './playingAsset';
import { Button } from './models/button';
import { Video } from './models/assets/Video';
import { ConfigOSD, ConfigAdmin } from './models/config';
import { StateConst } from './utils/const';
export class LayerManager extends Backbone.View<Backbone.Model> {
    private _playerLayer: PlayerLayer
    private _osdLayer: OsdLayer
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _assets: any = [
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
        this._eventBus = _.extend({}, Backbone.Events)
        let configAdmin = new ConfigAdmin(true, true, true, true, true, true,true)
        this._playingAsset = new PlayingAsset( configAdmin, new Video(this._assets[0].description, this._assets[0].duration, this._assets[0].src), StateConst.STOPPED)
        let osdOptions = {
            eventBus: this._eventBus, 
            playingAsset: this._playingAsset
        }
        let playerLayerOptions = {
            eventBus: this._eventBus, 
            playingAsset: this._playingAsset,
            assets: this._assets
        }
        this._playerLayer = new PlayerLayer(playerLayerOptions)
        this._osdLayer = new OsdLayer(osdOptions)
        $('#osd').html(this._osdLayer.render().el)
    }
}
const layerManager = new LayerManager()

