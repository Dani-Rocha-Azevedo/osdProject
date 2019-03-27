import {FrontEndAsset} from './FrontEndAsset'
import { assetsType } from '../../utils/constants';
export class FrontEndLiveChannel extends FrontEndAsset {
    
    private startTime: string
    private endTime: string 
    constructor (description: string, startTime: string, endTime: string, src: string) {
        super(assetsType.LIVE_CHANNEL, description, src)
        this.endTime = endTime
        this.startTime = startTime
    }

    public getStartTime(): string {
        return this.startTime
    }

    public getEndTime(): string {
        return this.endTime
    }
  
    public toString(): string {
        return super.toString() + "\n start time:" + this.startTime + "\n end time:" + this.endTime + "]"
    }
}
