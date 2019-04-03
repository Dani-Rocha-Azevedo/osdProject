import * as _ from 'underscore'
import * as $ from 'jquery'
import * as Backbone from 'backbone'
import { StateMachine } from './timeShiftStateMachine'
import { PlayingAsset } from '../../playingAsset';
import { states } from '../../utils/constants';
import { IPlayerState } from '../IPlayerState';
import { FrontEndTimeShift } from '../../models/assets/FrontEndTimeShift';
import { FrontEndLiveChannel } from '../../models/assets/FrontEndLiveChannel';
import { LiveChannelPlayerState } from '../LiveChannel/liveChannelPlayerState';
export class TimeShiftPlayerState extends Backbone.View<Backbone.Model> implements IPlayerState {

    private _stateMachine: StateMachine
    private _template: any
    private _playingAsset: PlayingAsset
    private _interval?: any
    private _speeds: Array<number>
    private _currentSpeedIndex: number
    private _intervalRealTime: any
    private _intervalCurrentTime: any
    private _eventBus: any


    /**
     * Constructor
     * Initialize the attributes and the state machine
     */
    constructor(options: any) {
        super(options)
        this._template = require("ejs-compiled-loader!./timeShiftPlayerState.ejs")
        this._stateMachine = new StateMachine()
        this._speeds = [0, .1, .2, .25, .3, .35]
        this._currentSpeedIndex = 0
        this._playingAsset = options.playingAsset
        this._playingAsset.asset = options.asset
        this._playingAsset.speed = this._currentSpeedIndex
        this._eventBus = options.eventBus
        this._handleChangeState()
    }

    public render() {
        if (this._playingAsset.asset) {
            this.$el.html(this._template({ src: this._playingAsset.asset.src }))
        }
        return this
    }
    public postRender(): void {
        let domVideo = <HTMLMediaElement>document.getElementById('playerVideo')
        domVideo.currentTime = (<FrontEndTimeShift>this._playingAsset.asset).getCurrentTime()
        this._intervalCurrentTime = setInterval(() => {
            let realTime: number = (<FrontEndTimeShift>this._playingAsset.asset).getRealTime();
            (<FrontEndTimeShift>this._playingAsset.asset).setRealTime(realTime + 1)
        }, 1000)
        this._intervalRealTime = setInterval(() => {

            this._bufferFinished()
        }, 10)



    }
    public play(): IPlayerState {
        let domVideo = <HTMLMediaElement>document.getElementById('playerVideo')
        try {
            this._stateMachine.play(domVideo)
        } catch (err) {
            console.log(err)
        }
        return this
    }
    public stop(): IPlayerState {
        let asset = this._playingAsset.asset
        let liveChannelPlayerState = new LiveChannelPlayerState({
            playingAsset: this._playingAsset,
            asset: {
                description: asset.description,
                startTime: (<FrontEndLiveChannel>asset).getStartTime(),
                endTime: (<FrontEndLiveChannel>asset).getEndTime(),
                src: asset.src,
                realTime: (<FrontEndLiveChannel>asset).getRealTime()
            }
        })
        return liveChannelPlayerState
    }
    public pause(): IPlayerState {
        let domVideo = <HTMLMediaElement>document.getElementById('playerVideo')
        try {
            this._stateMachine.pause(domVideo)
        } catch (err) {
            console.log(err)
        }
        return this
    }
    public fastForward(): IPlayerState {

        try {
            let domVideo = <HTMLMediaElement>document.getElementById('playerVideo')
            //It's not a successive click
            if (this._stateMachine.state.label !== states.FASTFORWARDING.label) {
                this._currentSpeedIndex = 0
            }
            this._currentSpeedIndex = Math.min(this._currentSpeedIndex + 1, this._speeds.length - 1)
            this._stateMachine.fastForward(domVideo, this._speeds[this._currentSpeedIndex])
        } catch (err) {
            console.log(err)
        }
        return this
    }
    public fastBackward(): IPlayerState {
        try {
            let domVideo = <HTMLMediaElement>document.getElementById('playerVideo')
            //It's not a successive click
            if (this._stateMachine.state.label !== states.BACKWARDING.label) {
                this._currentSpeedIndex = 0
            }
            this._currentSpeedIndex = Math.min(this._currentSpeedIndex + 1, this._speeds.length - 1)
            this._stateMachine.backward(domVideo, this._speeds[this._currentSpeedIndex])
        } catch (err) {
            console.log(err)
        }
        return this
    }
    public jumpBackwardTime(): IPlayerState {
        try {
            let domVideo = <HTMLMediaElement>document.getElementById('playerVideo')
            this._stateMachine.jumpBackwardTime(domVideo, 15)
        } catch (err) {
            console.log(err)
        }
        return this
    }
    public jumpForwardTime(): IPlayerState {
        try {
            let domVideo = <HTMLMediaElement>document.getElementById('playerVideo')
            this._stateMachine.jumpForwardTime(domVideo, 15)
        } catch (err) {
            console.log(err)
        }
        return this
    }
    public removeView(): void {
        this._currentSpeedIndex = 0
        this._playingAsset.speed = this._currentSpeedIndex
        clearInterval(this._interval)
        clearInterval(this._intervalRealTime)
        clearInterval(this._intervalCurrentTime)
        this.remove()
    }
    public getPlayerState(): IPlayerState {
        return this.stop()
    }

    private _handleChangeState() {
        this._stateMachine.onEnterState(states.PAUSED, () => {
            this._playingAsset.state = states.PAUSED
            this._currentSpeedIndex = 0
            if (this._playingAsset.speed !== this._currentSpeedIndex) {
                this._playingAsset.speed = this._currentSpeedIndex
            }
        })
        this._stateMachine.onEnterState(states.STOPPED, () => {
            this._playingAsset.state = states.STOPPED
            this._currentSpeedIndex = 0
            if (this._playingAsset.speed !== this._currentSpeedIndex) {
                this._playingAsset.speed = this._currentSpeedIndex
            }
        })
        this._stateMachine.onEnterState(states.PLAYING, () => {
            this._playingAsset.state = states.PLAYING
            this._currentSpeedIndex = 0
            if (this._playingAsset.speed !== this._currentSpeedIndex) {
                this._playingAsset.speed = this._currentSpeedIndex
            }
        })
        this._stateMachine.onEnterState(states.FASTFORWARDING, () => {
            this._playingAsset.state = states.FASTFORWARDING
            this._playingAsset.speed = this._currentSpeedIndex
        })
        this._stateMachine.onEnterState(states.BACKWARDING, () => {
            this._playingAsset.state = states.BACKWARDING
            this._playingAsset.speed = this._currentSpeedIndex
        })

    }
    private _bufferFinished() {
        let domVideo = <HTMLMediaElement>document.getElementById('playerVideo')
        if (domVideo.currentTime - 1 >= (<FrontEndTimeShift>this._playingAsset.asset).getRealTime()) {
            this._eventBus.trigger('refreshPlayerState')
        }
    }



}