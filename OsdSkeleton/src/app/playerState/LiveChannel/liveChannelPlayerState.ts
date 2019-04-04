import { IPlayerState } from "../IPlayerState";
import { PlayingAsset } from "../../playingAsset";
import { FrontEndLiveChannel } from "../../models/assets/FrontEndLiveChannel";
import { LiveStateMachine } from './liveChannelStateMachine'
import { states } from "../../utils/constants";
import * as Backbone from 'backbone'
import { FrontEndTimeShift } from "../../models/assets/FrontEndTimeShift";
import { TimeShiftPlayerState } from "../TimeShift/timeShiftPlayerState";
import { fsm } from 'typescript-state-machine'
import StateMachineImpl = fsm.StateMachineImpl
import State = fsm.State
export class LiveChannelPlayerState extends Backbone.View<Backbone.Model>implements IPlayerState {
    private _stateMachine: StateMachineImpl<State>
    private _template: any
    private _playingAsset: PlayingAsset
    private _interval?: any
    private _eventBus: any
    private _video: any
    constructor(options: any, stateMachine: StateMachineImpl<State>) {
        super()
        this._template = require("ejs-compiled-loader!./liveChannelPlayerState.ejs")
        this._playingAsset = options.playingAsset
        this._stateMachine = stateMachine
        //! get startTime, endTime by EPG
        let asset = new FrontEndLiveChannel(options.asset.description, options.asset.startTime, options.asset.endTime, options.asset.src, options.asset.realTime)
        this._playingAsset.asset = asset
        this._playingAsset.state = states.PAUSED
        this._eventBus = options.eventBus
    }
    public render(){
        this.$el.html(this._template({src: this._playingAsset.asset.src}))
        return this
    }
    public postRender(): void{
        this._video = <HTMLMediaElement>document.getElementById('playerVideo')
        this._handleChangeState()
    }
    public play(): IPlayerState {
        (this._stateMachine as LiveStateMachine).play(this._video, (<FrontEndLiveChannel>this._playingAsset.asset).getRealTime())
        return this
    }
    public stop(): IPlayerState {
        return this
    }
    public pause(): IPlayerState {
        //Create a FrontEndTimeShift
            //Create a TimeShiftPlayerState
            //Return the timeShiftPlayerState
        let asset = <FrontEndLiveChannel>this._playingAsset.asset
        let timeShiftAsset = new FrontEndTimeShift(asset.description, asset.getStartTime(), asset.getEndTime(),
                asset.src, this._video.currentTime)
        return new TimeShiftPlayerState({eventBus:this._eventBus, playingAsset: this._playingAsset, asset: timeShiftAsset, state: states.PAUSED})
    }
    public fastForward(): IPlayerState {
        throw new Error("You can't fast forward a live channel")
    }
    public fastBackward(): IPlayerState {
            //Create a FrontEndTimeShift
            //Create a TimeShiftPlayerState
            //Return the timeShiftPlayerState
        let asset = <FrontEndLiveChannel>this._playingAsset.asset
        let timeShiftAsset = new FrontEndTimeShift(asset.description, asset.getStartTime(), asset.getEndTime(),
                asset.src, this._video.currentTime)
        return new TimeShiftPlayerState({eventBus:this._eventBus, playingAsset: this._playingAsset, asset: timeShiftAsset, state: states.BACKWARDING})
    }
    /**
     * Jump backward
     */
    public jumpBackwardTime(time: number): IPlayerState {
        let asset = <FrontEndLiveChannel>this._playingAsset.asset
        let timeShiftAsset = new FrontEndTimeShift(asset.description, asset.getStartTime(), asset.getEndTime(),
                asset.src, this._video.currentTime - time)
        return new TimeShiftPlayerState({eventBus:this._eventBus, playingAsset: this._playingAsset, asset: timeShiftAsset, state: states.PLAYING})
    }
    /**
     * Never used in a liveChannel asset
     */
    public jumpForwardTime(): IPlayerState {
        throw new Error("You can't fast jump forward a live channel")
    }
    public removeView(): void {
        clearInterval(this._interval)
        this.remove()
    }
    public getPlayerState(): IPlayerState {
        return this
    }
    
    private _handleChangeState() {
        this._stateMachine.onEnterState(states.PAUSED, ()=> {
            this._playingAsset.state = states.PAUSED
            
        })
        this._stateMachine.onEnterState(states.STOPPED, ()=> {
            this._playingAsset.state = states.STOPPED
        }) 
        this._stateMachine.onEnterState(states.PLAYING, ()=> {
            this._playingAsset.state = states.PLAYING
            
        })
        this._stateMachine.onEnterState(states.FASTFORWARDING,()=> {
            this._playingAsset.state = states.FASTFORWARDING
        })
        this._stateMachine.onEnterState(states.BACKWARDING,()=> {
            this._playingAsset.state = states.BACKWARDING
        })
    }


}