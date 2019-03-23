import {Asset} from './Asset'
export class Live extends Asset {
    
    private startTime: string
    private endTime: string 
    constructor (description: string, startTime: string, endTime: string) {
        super("Live", description, "")
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
