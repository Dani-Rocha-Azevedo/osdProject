import {PlayerLayer} from './playerLayer'
import { OsdLayer } from './osd/osdLayer';
import * as $ from 'jquery'
import * as _ from 'underscore'
import * as Backbone from 'backbone'
import { PlayingAsset } from './playingAsset';
import { FrontEndVideo } from './models/assets/FrontEndVideo';
import { ConfigAdmin } from './models/config';
import { states } from './utils/constants';
import { assetsType } from './utils/constants'
export class LayerManager extends Backbone.View<Backbone.Model> {
    private _playerLayer: PlayerLayer
    private _osdLayer: OsdLayer
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _assets: any 
    constructor(assets: any) {
        super()
        this._assets = assets
        this._eventBus = _.extend({}, Backbone.Events)
        let configAdmin = new ConfigAdmin(true, true, true, true, true, true,true, true, true, 35)
        this._playingAsset = new PlayingAsset(new FrontEndVideo(this._assets[0].description, this._assets[0].duration, this._assets[0].src), states.STOPPED)
        let osdOptions = {
            eventBus: this._eventBus, 
            playingAsset: this._playingAsset,
            config: configAdmin
        }
        let playerLayerOptions = {
            eventBus: this._eventBus, 
            playingAsset: this._playingAsset,
            assets: this._assets
        }
        this._playerLayer = new PlayerLayer(playerLayerOptions)
        this._osdLayer = new OsdLayer(osdOptions)
        $('#player').html(this._playerLayer.render().el)
        $('#osd').html(this._osdLayer.render().el)
        this._playerLayer.postRender()
    }
}
let assets = [
    {   duration: 155.000,
        description: "Ralph BD",
        src: "https://test.flowr.cloud/ozone/PURD7oFHye",
        type: assetsType.VIDEO
    },
    {   duration: 155.000,
        description: "Pokemon",
        src: "https://test.flowr.cloud/ozone/me0oHarrTJ",
        type: assetsType.VIDEO
    },
    {
        startTime: "09:10",
        endTime: "09:30",
        description: "LiveChannel",
        src: "https://test.flowr.cloud/ozone/W6isCSziBO",
        realTime: 30,
        type: assetsType.LIVE_CHANNEL
    },
   
]
const layerManager = new LayerManager(assets)

