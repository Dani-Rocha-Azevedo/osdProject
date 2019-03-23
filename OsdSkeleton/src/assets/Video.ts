import {Asset} from './Asset'
import * as moment from 'moment';
import 'moment-duration-format';

export class Video extends Asset {
    private _duration: number
    
    constructor (description: string, duration: number, src: string) {
        super("Video", description, src)
        this._duration = duration  
    }
    public toString(): string {
        return super.toString() + "\n duration: " + this._duration  
    }
    /**
     * Getters & setters
     */
    public getDuration(): String {
        let duration: moment.Duration = moment.duration(this._duration, 'seconds')
        return duration.format("hh:mm:ss", { trim: false })
    }
    public set duration(value: number) {
        this._duration = value;
    }
}