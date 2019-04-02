import { IPlayerState } from "../IPlayerState";
import { PlayingAsset } from "../../playingAsset";
import { FrontEndLiveChannel } from "../../models/assets/FrontEndLiveChannel";
import { StateMachine } from './liveChannelStateMachine'
import { states } from "../../utils/constants";
import * as Backbone from 'backbone'
import { FrontEndTimeShift } from "../../models/assets/FrontEndTimeShift";
import { TimeShiftPlayerState } from "../TimeShift/timeShiftPlayerState";
export class LiveChannelPlayerState extends Backbone.View<Backbone.Model>implements IPlayerState {
    private _stateMachine: StateMachine
    private _template: any
    private _playingAsset: PlayingAsset
    private _interval?: any
    private _eventBus: any
    constructor(options: any) {
        super()
        this._template = require("ejs-compiled-loader!./liveChannelPlayerState.ejs")
        this._playingAsset = options.playingAsset
        this._stateMachine = new StateMachine()
        //! get startTime, endTime by EPG
        let asset = new FrontEndLiveChannel(options.asset.description, options.asset.startTime, options.asset.endTime, options.asset.src, options.asset.realTime)
        this._playingAsset.asset = asset
        this._playingAsset.state = states.PAUSED
        this._eventBus = options.eventBus
        this._handleChangeState()
    }
    public render(){
        this.$el.html(this._template({src: this._playingAsset.asset.src}))
        return this
    }
    public postRender(): void{
        
    }
    public play(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
        try {
            this._stateMachine.play(domVideo, (<FrontEndLiveChannel>this._playingAsset.asset).getRealTime())
        }catch(err) {
            console.log(err)
        }
        return this
    }
    public stop(): IPlayerState {
        //TODO
        return this
    }
    public pause(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
            //Create a FrontEndTimeShift
            //Create a TimeShiftPlayerState
            //Return the timeShiftPlayerState
        let asset = <FrontEndLiveChannel>this._playingAsset.asset
        let timeShiftAsset = new FrontEndTimeShift(asset.description, asset.getStartTime(), asset.getEndTime(),
                asset.src, domVideo.currentTime)
        return new TimeShiftPlayerState({eventBus:this._eventBus, playingAsset: this._playingAsset, asset: timeShiftAsset, state: states.PAUSED})
    }
    public fastForward(): IPlayerState {
        // Not handled 
        return this
    }
    public fastBackward(): IPlayerState {
        let domVideo =<HTMLMediaElement>document.getElementById('playerVideo')
            //Create a FrontEndTimeShift
            //Create a TimeShiftPlayerState
            //Return the timeShiftPlayerState
        let asset = <FrontEndLiveChannel>this._playingAsset.asset
        let timeShiftAsset = new FrontEndTimeShift(asset.description, asset.getStartTime(), asset.getEndTime(),
                asset.src, domVideo.currentTime)
        return new TimeShiftPlayerState({playingAsset: this._playingAsset, asset: timeShiftAsset, state: states.BACKWARDING})
    }
    /**
     * Never used in a liveChannel asset
     */
    public jumpBackwardTime(): IPlayerState {
        console.log("backwardTime LiveChannel")
        return this
    }
    /**
     * Never used in a liveChannel asset
     */
    public jumpForwardTime(): IPlayerState {
        console.log("forwardTime LiveChannel")
        return this
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