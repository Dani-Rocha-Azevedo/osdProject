import {Asset} from './Asset'
import * as moment from 'moment';
import 'moment-duration-format';

export class Video extends Asset {
    
    constructor (description: string, duration: number, src: string) {
        super("Video", description, src)
        this.duration = duration
    }
    public toString(): string {
        return super.toString() + "\n duration: " + this.duration  
    }
    /**
     * Getters & setters
     */
    public getDuration(): string {
        let duration: moment.Duration = moment.duration(this.get('duration'), 'seconds')
        return duration.format("hh:mm:ss", { trim: false })
    }
    public set duration(value: number)  {
        this.set('duration', value)
    }
}