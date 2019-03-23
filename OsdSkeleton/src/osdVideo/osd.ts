import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'
import {Video} from '../assets/Video'
import {ConfigOSD} from '../config'
import { PlayingAsset } from '../playingAsset';
import { CurrentTimeView } from '../renderer/videoView';
export class OSD extends Backbone.View<any> {
    private _template: any
    private config ?: ConfigOSD
    private _eventBus: any
    private _playingAsset: PlayingAsset
    // The views
    private _currentTimeView: CurrentTimeView
    constructor(options: any) {
        super(options)
    }
    initialize(options: any) {
        this._template = require("ejs-compiled-loader!./osd.ejs")
        this._playingAsset = options.playingAsset
        this.config = this._playingAsset.config
        if(this._playingAsset) {
            this.listenTo(this._playingAsset, 'change:asset', this.playingAssetChange)
            console.log("i'm here")
        }
        this._eventBus = options.eventBus
        this._currentTimeView = new CurrentTimeView()
        this._eventBus.on("configChange", this._updateConfig, this)
        $("#currentTime").html(this._currentTimeView.render().el)
    }
    playingAssetChange() {
        this._currentTimeView.updateCurrentTime(this._playingAsset.getCurrentPosition())
    }
    /**
     * Handle all actions
     */
    events():  Backbone.EventsHash {
        return { 
            'click #play': '_play',
            'click #pause': '_pause',
            'click #stop': '_stop',
            'click #backward': '_backward',
            'click #fastforward': '_forward',
            'click #previous': '_previous',
            'click #next': '_next'
        }
    }
    
  

    render() {
        if(this.config) {
            let options = {
                config: this.config,
                currentTime: this._playingAsset.asset ? this._playingAsset.getCurrentPosition() : "no Info",
                duration: this._playingAsset.asset ? (<Video> this._playingAsset.asset).getDuration() : "no Info"
            }
            this.$el.html(this._template(options))
        }
        return this
    }

    /**
     * Launch whe a use click on play button
     * Send a trigger "play"
     */
    _play() {
        this._eventBus.trigger("play")
    }
    /**
     * Launch whe a use click on pause button
     * Send a trigger "pause"
     */
    _pause() {
        this._eventBus.trigger("pause")
    }
    /**
     * Launch whe a use click on stop button
     * Send a trigger "stop"
     */
    _stop() {
        this._eventBus.trigger("stop")
    /**
     * Launch whe a use click on backward button
     * Send a trigger "backward"
     */
    }
    _backward() {
        this._eventBus.trigger("backward")
    }
    /**
     * Launch whe a use click on fast forward button
     * Send a trigger "fastForward"
     */
    _forward() {
        this._eventBus.trigger("fastForward")
    }
    /**
     * Launch whe a use click on next button
     * Send a trigger "next"
     */
    _next() {
        this._eventBus.trigger("next")
    }
    /**
     * Launch whe a use click on previous button
     * Send a trigger "previous"
     */
    _previous() {
        this._eventBus.trigger("previous")
    }

    /**
     * get new config on PlayingAsset
     * launch render
     */
    private _updateConfig() {
        this.config = this._playingAsset.config

        this.render()
    }
}

