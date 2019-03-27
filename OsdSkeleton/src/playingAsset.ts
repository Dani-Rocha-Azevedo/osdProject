import { Asset } from "./models/assets/Asset"
import { ConfigOSD, ConfigAdmin } from "./models/config"
import * as Backbone from "backbone"
import * as moment from 'moment'
import 'moment-duration-format'
export class PlayingAsset extends Backbone.Model{
    
    constructor(config: ConfigAdmin, asset: Asset, state: string) {
        super()
        this.state = state 
        this.asset = asset 
        this.config = config
        this.currentPosition = 0
        
    }
    
    
    public get asset(): Asset  {
        return this.get('asset');
    }
    public set asset(value: Asset ) {
        // it's useful, the view can detect change
        this.set('asset', value)
    }
    public get config(): ConfigAdmin  {
        return this.get('config');
    }
    public set config(value: ConfigAdmin ) {
        this.set('config', value)
    }
    public getCurrentPosition(): string {
        let duration: moment.Duration = moment.duration(this.get('currentPosition'), 'seconds')
        return duration.format("hh:mm:ss", { trim: false })
    }
    public set currentPosition(value: number) {
        this.set('currentPosition', value)
    }
    public set state(value: string) {
        this.set('state', value)
    }
    public get state(): string {
        return this.get('state')
    }

}