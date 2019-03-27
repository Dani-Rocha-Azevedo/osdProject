import {FrontEndAsset} from './FrontEndAsset'
import * as moment from 'moment';
import 'moment-duration-format';
import { assetsType } from '../../utils/constants';

export class FrontEndVideo extends FrontEndAsset {
    
    constructor (description: string, duration: number, src: string) {
        super(assetsType.VIDEO, description, src)
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
    public get duration(): number {
        return this.get('duration')
    }
    public set duration(value: number)  {
        this.set('duration', value)
    }
}