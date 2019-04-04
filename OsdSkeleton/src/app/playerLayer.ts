import * as $ from 'jquery'
import * as _ from 'underscore'

import * as Backbone from 'backbone'
import { PlayingAsset } from './playingAsset';
import { IPlayerState } from './playerState/IPlayerState';
import { PlayerStateFactory } from './playerState/playerStateFactory';
import { Stack } from './utils/stack';
import { states } from './utils/constants';
export class PlayerLayer extends Backbone.View<Backbone.Model>{
    private _template: any
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
        this.playerState = this.playerStateFactory.makePlayer({ eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getNext() })
        this._template = require("ejs-compiled-loader!./playerLayer.ejs")
        this.listenTo(this._playingAsset, 'change:state', this._stateUpdated)
        this._initEvent()

    }
    render() {
        this.$el.html(this._template())
        this.$("#playerLayer").html(this.playerState.render().el)
        return this
    }
    postRender() {
        this.playerState.postRender()
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
        this._eventBus.on("jumpBackwardTime", this._jumpBackwardTime, this)
        this._eventBus.on("jumpForwardTime", this._jumpForwardTime, this)
        this._eventBus.on("refreshPlayerState", this._refreshPlayerState, this)
    }
    /**
     * Demand to playerStateFactory a new PlayerState and give the next asset to play
     */
    private _next() {
        try {
            this.playerState.removeView()
            this.playerState = this.playerStateFactory.makePlayer({ eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getNext() })
            this.$("#playerLayer").html(this.playerState.render().el)
            this.playerState.postRender()
            this.playerState.play()
        }catch(err) {
            console.log(err.message)
        }
        
    }
    /**
    * Demand to playerStateFactory a new PlayerState and give the previous asset to play
    */
    private _previous() {
        try {
            this.playerState.removeView()
            this.playerState = this.playerStateFactory.makePlayer({ eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getPrevious() })
            this.$("#playerLayer").html(this.playerState.render().el)
            this.playerState.postRender()
            this.playerState.play()
        }catch(err) {
            console.log(err.message)
        }

    }
    /**
    * Demand to playerState to play the asset 
    */
    private _play() {
        try {
            this.playerState = this.playerState.play()
        } catch (err) {
            console.log(err)
        }
    }
    /**
     * Remove the playerView and return in the previous menu
     */
    private _stop() {
        try {
            let playerStateTemp = this.playerState.stop()
            if (playerStateTemp.constructor.name !== this.playerState.constructor.name) {
                this.playerState.removeView()
                this.playerState = playerStateTemp
                $("#playerLayer").html(this.playerState.render().el)
                this.playerState.postRender()
                //pass to liveChannel
                this.playerState.play()
            }
            else {
                this.playerState = playerStateTemp
            }
        } catch (err) {
            console.log(err)
        }

    }
    /**
     * Demand to playerState to pause the asset
     */
    private _pause() {
        try {
            let playerStateTemp = this.playerState.pause()
            if (playerStateTemp.constructor.name !== this.playerState.constructor.name) {
                this.playerState.removeView()
                this.playerState = playerStateTemp
                $("#playerLayer").html(this.playerState.render().el)
                this.playerState.postRender()
                this.playerState.pause()
            }
            else {
                this.playerState = playerStateTemp
            }
        } catch (err) {
            console.log(err)
        }


    }
    /**
     * Demand to playerState to rewind the asset
     */
    private _fastBackward() {
        try {
            let playerStateTemp = this.playerState.fastBackward()
            if (playerStateTemp.constructor.name !== this.playerState.constructor.name) {
                this.playerState.removeView()
                this.playerState = playerStateTemp
                this.$("#playerLayer").html(this.playerState.render().el)
                this.playerState.postRender()
                this.playerState.fastBackward()
            }
            else {
                this.playerState = playerStateTemp
            }
        } catch (err) {
            console.log(err)
        }
    }
    /**
     * Demand to playerState to forward the asset 
     */
    private _fastForward() {
        try {
            this.playerState = this.playerState.fastForward()
        } catch (err) {
            console.log(err)
        }
    }
    /**
     * Demand to player to jump on asset
     */
    private _jumpBackwardTime(time: number) {
        try {
            this.playerState = this.playerState.jumpBackwardTime(time)
        } catch (err) {
            console.log(err)
        }
    }
    /**
     * Demand to player to jump on asset
     */
    private _jumpForwardTime(time: number) {
        try {
            this.playerState = this.playerState.jumpForwardTime(time)
        } catch (err) {
            console.log(err)
        }
    }
    /**
     * Launch when the state is updated
     * The state is stopped, launch the function "next"
     * The state isn't stopped, do nothing
     */
    private _stateUpdated() {
        if (this._playingAsset.state == states.STOPPED) {
            //TODO if the playlist is in loop mode
            this._next()
        }
    }
    /**
     * Create a new player state with the current asset
     */
    private _refreshPlayerState() {
        this.playerState.removeView()
        this.playerState = this.playerStateFactory.makePlayer({ eventBus: this._eventBus, playingAsset: this._playingAsset, asset: this._assets.getCurrentAsset() })
        this.$("#playerLayer").html(this.playerState.render().el)
        this.playerState.postRender()
        this.playerState.play()
    }


}