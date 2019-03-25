import * as Backbone from 'backbone'
import { ConfigOSD } from './config';
import { PlayingAsset } from './playingAsset';
import { RegularRenderer } from './renderer/regularRenderer';
export class OsdLayer extends Backbone.View<any> {
    private _template: any
    private _config ?: ConfigOSD
    private _eventBus: any
    private _playingAsset: PlayingAsset
    private _renderer: RegularRenderer
    constructor(options: any) {
        super(options)
    }
    initialize(options: any) {
        this._template = require("ejs-compiled-loader!./OsdLayer.ejs")
        this._playingAsset = options.playingAsset
        this._config = this._playingAsset.config
        this._renderer = new RegularRenderer(options)
        if(this._playingAsset) {
            this.listenTo(this._playingAsset, 'change:currentPosition', this.updateCurrentPosition)
        }
        this._eventBus.on("configChange", this._updateConfig, this)
    }   
    /**
     * Current position updated
     */
    updateCurrentPosition() {
        this._renderer.updateCurrentPosition(this._playingAsset.getCurrentPosition())
    }
}