import {FrontEndAsset} from './FrontEndAsset'
import { assetsType } from '../../utils/constants';
export class FrontEndLiveChannel extends FrontEndAsset {
    
    private startTime: string
    private endTime: string 
    private realTime: number
    constructor (description: string, startTime: string, endTime: string, src: string, realTime: number) {
        super(assetsType.LIVE_CHANNEL, description, src)
        this.endTime = endTime
        this.startTime = startTime
        this.realTime = realTime
    }
    public getRealTime(): number {
        return this.realTime
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
