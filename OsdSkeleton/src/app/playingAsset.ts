import { FrontEndAsset } from "./models/assets/FrontEndAsset"
import * as Backbone from "backbone"
import * as moment from 'moment'
import {states} from './utils/constants'
import 'moment-duration-format'
import { fsm } from 'typescript-state-machine'
import State = fsm.State
export class PlayingAsset extends Backbone.Model{
    
    constructor(asset: FrontEndAsset, state: State) {
        super()
        this.state = state 
        this.asset = asset 
        this.currentPosition = 0
        this.speed = 1
        
    }
    
    
    public get asset(): FrontEndAsset  {
        return this.get('asset');
    }
    public set asset(value: FrontEndAsset ) {
        // it's useful, the view can detect change
        this.set('asset', value)
    }
    public getCurrentPosition(): string {
        let duration: moment.Duration = moment.duration(this.get('currentPosition'), 'seconds')
        return duration.format("hh:mm:ss", { trim: false })
    }
    public set currentPosition(value: number) {
        this.set('currentPosition', value)
    }
    
    public set state(value: State) {
        this.set('state', value)
    }
    public get state(): State {
        return this.get('state')
    }
    public get speed(): number {
        return this.get('speed')
    }
    public set speed(value: number) {
        this.set('speed', value)
    }

}