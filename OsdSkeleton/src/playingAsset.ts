import { Asset } from "./models/assets/Asset"
import { ConfigOSD } from "./models/config"
import * as Backbone from "backbone"
import * as moment from 'moment'
import 'moment-duration-format'
export class PlayingAsset extends Backbone.Model{
    
    constructor(config: ConfigOSD, asset: Asset) {
        super()
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
    public get config(): ConfigOSD  {
        return this.get('config');
    }
    public set config(value: ConfigOSD ) {
        this.set('config', value)
    }
    public getCurrentPosition(): string {
        let duration: moment.Duration = moment.duration(this.get('currentPosition'), 'seconds')
        return duration.format("hh:mm:ss", { trim: false })
    }
    public set currentPosition(value: number) {
        this.set('currentPosition', value)
    }

}