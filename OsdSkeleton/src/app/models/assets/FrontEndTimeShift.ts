import { FrontEndAsset } from "./FrontEndAsset";
import { assetsType } from "../../utils/constants";

export class FrontEndTimeShift extends FrontEndAsset{
    private startTime: string
    private endTime: string 
    private currentTime: number
    private realTime: number
    constructor (description: string, startTime: string, endTime: string, src: string, currentTime: number) {
        super(assetsType.TIME_SHIFT, description, src)
        this.endTime = endTime
        this.startTime = startTime
        this.currentTime = currentTime
        this.realTime = currentTime
    }
    public getCurrentTime(): number {
        return this.currentTime
    }
    public getStartTime(): string {
        return this.startTime
    }
    public setRealTime(value: number): void {
        this.realTime = value
    }
    public getRealTime(): number {
        return this.realTime
    }
    public getEndTime(): string {
        return this.endTime
    }
  
    public toString(): string {
        return super.toString() + "\n start time:" + this.startTime + "\n end time:" + this.endTime + "]"
    }
}