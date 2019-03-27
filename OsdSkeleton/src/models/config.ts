import * as Backbone from 'backbone'
import { Button } from './button';
import { timingSafeEqual } from 'crypto';
export class ConfigOSD extends Backbone.Model{

    constructor(playButton: Button, stopButton: Button, pauseButton: Button,
         fastBackwardButton: Button, fastfrowardButton: Button, nextButton: Button, previousButton: Button ) {
             super()
        this.playButton = playButton
        this.pauseButton = pauseButton
        this.stopButton = stopButton
        this.fastBackwardButton = fastBackwardButton
        this.fastForwardButton = fastfrowardButton
        this.nextButton = nextButton
        this.previousButton = previousButton
    }
    /**
     * Getters and setters
     */
    public get fastForwardButton(): Button {
        return this.get('fastForwardButton')
    }
    public set fastForwardButton(value: Button) {
        this.set('fastForwardButton', value)
    }
    public get fastBackwardButton(): Button {
        return this.get('fastBackwardButton')
    }
    public set fastBackwardButton(value: Button) {
        this.set('fastBackwardButton', value)
    }
    public get pauseButton(): Button {
        return this.get('pauseButton')
    }
    public set pauseButton(value: Button) {
        this.set('pauseButton', value)
    }
    public get stopButton(): Button {
        return this.get('stopButton')
    }
    public set stopButton(value: Button) {
        this.set('stopButton', value)
    }
    public get playButton(): Button {
        return this.get('playButton')
    }
    public set playButton(value: Button) {
        this.set('playButton', value)
    }
    public get nextButton(): Button {
        return this.get('nextButton');
    }
    public set nextButton(value: Button) {
        this.set('nextButton', value)
    }
    public get previousButton(): Button {
        return this.get('previousButton')
    }
    public set previousButton(value: Button) {
        this.set('previousButton', value)
    }

    /**
     * utilitarian functions
     */
    public getConfig(): { [name: string]: any } {
        var config = {
            indicatorClass : this.get('indicatorClass'),
            playButton : this.get('playButton'),
            stopButton : this.get('stopButton'),
            pauseButton : this.get('pauseButton'),
            fastBackwardButton : this.get('fastBackwardButton'),
            fastForwardButton : this.get('fastForwardButton'),
            nextButton: this.get('nextButton'), 
            previousButton: this.get('previousButton'),
        }
        return config
    }
    /**
     * Hide all buttons
     */
    public hideAllButtons() {
        this.get('playButton').display = false
        this.get('pauseButton').display = false
        this.get('stopButton').display = false
        this.get('fastBackwardButton').display = false
        this.get('fastForwardButton').display = false
        this.get('nextButton').display = false
        this.get('previousButton').display = false
    }
    /**
     * display all buttons
     */
    // TODO display the button according to configAdmin
    public diplayAllButtons() {
        this.get('playButton').display = true
        this.get('pauseButton').display = true
        this.get('stopButton').display = true
        this.get('fastBackwardButton').display = true
        this.get('fastForwardButton').display = true
        this.get('nextButton').display = true
        this.get('previousButton').display = true
    }
}
export class ConfigAdmin {
    private _playButton: boolean
    private _pauseButton: boolean
    private _stopButton: boolean
    private _fastBackwardButton: boolean
    private _fastForwardButton: boolean
    private _nextButton: boolean
    private _previousButton: boolean
    constructor(playButton: boolean, stopButton: boolean, pauseButton: boolean,
        fastBackwardButton: boolean, fastfrowardButton: boolean, nextButton: boolean, previousButton: boolean ) {
       this._playButton = playButton
       this._pauseButton = pauseButton
       this._stopButton = stopButton
       this._fastBackwardButton = fastBackwardButton
       this._fastForwardButton = fastfrowardButton
       this._nextButton = nextButton
       this._previousButton = previousButton
   }
   /**
    * Getters and setters
    */
   public get fastForwardButton(): boolean {
       return this._fastForwardButton
   }
   public set fastForwardButton(value: boolean) {
       this.fastForwardButton = value
   }
   public get fastBackwardButton(): boolean {
       return this._fastBackwardButton
   }
   public set fastBackwardButton(value: boolean) {
       this._fastBackwardButton = value
   }
   public get pauseButton(): boolean {
       return this._pauseButton
   }
   public set pauseButton(value: boolean) {
       this._pauseButton = value
   }
   public get stopButton(): boolean {
       return this._stopButton
   }
   public set stopButton(value: boolean) {
       this.stopButton = value
   }
   public get playButton(): boolean {
       return this._playButton
   }
   public set playButton(value: boolean) {
       this._playButton = value 
   }
   public get nextButton(): boolean {
       return this._nextButton
   }
   public set nextButton(value: boolean) {
       this._nextButton = value
   }
   public get previousButton(): boolean {
       return this._previousButton
   }
   public set previousButton(value: boolean) {
       this._previousButton = value
   }
}