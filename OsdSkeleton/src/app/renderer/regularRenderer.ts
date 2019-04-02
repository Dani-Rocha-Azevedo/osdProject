import * as _ from 'underscore'
import * as Backbone from 'backbone'
import { FrontEndVideo } from '../models/assets/FrontEndVideo'
import {LeftTimeView, StopButtonView, PlayButtonView, 
    FastForwardButtonView, FastBackwardButton, NextButtonView, PreviousButtonView, ProgressBarView, SpeedIndicator, JumpForwardTimeView, JumpBackwardTimeView} from './view/view'
import {RightTimeView} from './view/view'
import {PauseButtonView} from './view/view'
import { FrontEndAsset } from '../models/assets/FrontEndAsset';
import { Button } from '../models/button';
import * as moment from 'moment';
import 'moment-duration-format';
import { IRenderer } from './IRenderer';
import { ConfigToDisplay } from '../models/config';

export class RegularRenderer extends Backbone.View<Backbone.Model> implements IRenderer {
    private _template: any
    private _duration: string
    // The views
    private _currentTimeView: LeftTimeView
    private _durationView: RightTimeView
    private _pauseButton: PauseButtonView
    private _stopButton: StopButtonView
    private _playButton: PlayButtonView
    private _fastForwardButton: FastForwardButtonView
    private _fastBackwardButton: FastBackwardButton
    private _nextButton: NextButtonView
    private _previousButton: PreviousButtonView
    private _jumpBackwardTimeButton: JumpBackwardTimeView
    private _jumpForwardTimeButton: JumpForwardTimeView
    private _progressBar: ProgressBarView
    private _speedInidicator: SpeedIndicator
    constructor(asset: FrontEndAsset, configToDisplay: ConfigToDisplay) {
        super()
        this._template = require("ejs-compiled-loader!./regularRenderer.ejs")
        this._currentTimeView = new LeftTimeView()
        this._durationView = new RightTimeView()
        this._pauseButton = new PauseButtonView()
        this._playButton = new PlayButtonView()
        this._stopButton = new StopButtonView()
        this._fastBackwardButton = new FastBackwardButton()
        this._fastForwardButton = new FastForwardButtonView()
        this._nextButton = new NextButtonView()
        this._previousButton = new PreviousButtonView()
        this._jumpBackwardTimeButton = new JumpBackwardTimeView(configToDisplay.jumpTime)
        this._jumpForwardTimeButton = new JumpForwardTimeView(configToDisplay.jumpTime)
        this._progressBar = new ProgressBarView()
        this._speedInidicator = new SpeedIndicator()
        this._duration = (<FrontEndVideo>asset).getDuration()
        this._durationView.updateRightTime(this._duration)
    }
    private _updateProgressBar(currentTime: string){
        let current = moment.duration(currentTime).asSeconds()
        let duration = moment.duration(this._duration).asSeconds()
        let percent = current * 100 / duration
        this._progressBar.updatePercent(percent)
    }
    render() {
        this.$el.html(this._template())
        this.$("#duration").html(this._durationView.render().el)
        this.$("#currentTime").html(this._currentTimeView.render().el)
        this.$("#pauseButton").html(this._pauseButton.render().el)
        this.$("#playButton").html(this._playButton.render().el)
        this.$("#stopButton").html(this._stopButton.render().el)
        this.$("#fastForwardButton").html(this._fastForwardButton.render().el)
        this.$("#fastBackwardButton").html(this._fastBackwardButton.render().el)
        this.$("#nextButton").html(this._nextButton.render().el)
        this.$("#previousButton").html(this._previousButton.render().el)
        this.$("#jumpBackwardTimeButton").html(this._jumpBackwardTimeButton.render().el)
        this.$("#jumpForwardTimeButton").html(this._jumpForwardTimeButton.render().el)
        this.$("#progressBar").html(this._progressBar.render().el)
        this.$("#speedIndicator").html(this._speedInidicator.render().el)
        return this
    }
    /**
     * Current position updated
     * @param value: the new current position
     */
    public updateLeftTime(value: string) {
        this._currentTimeView.updateLeftTime(value)
        this._updateProgressBar(value)
    }
    /**
     * update the duration
     * @param value: the duration
     */  
    public updateRightTime(value: string): void {
        // Not necessary on regular Renderer
    }
    /**
     * Update the speed indicator, with new speed
     * @param value: the new speed
     */
    public updateSpeedIndicator(value: number) {
        this._speedInidicator.updateSpeedIndicator(value)
    }
    /**
     * hide or display pause button
     */
    public updatePauseButton(value: Button) {
        if(value.display) {
            this._pauseButton.showButton()
            //! TODO handle active button
        }
        else {
            this._pauseButton.hideButton()
        }
    }
    /**
     * hide or display play button
     */
    public updatePlayButton(value: Button) {
        if(value.display) {
            this._playButton.showButton()
                //! TODO handle active button
        }
        else {
            this._playButton.hideButton()
        }
    }
    /**
     * hide or display stop button
     */
    public updateStopButton(value: Button) {
        if(value.display) {
            this._stopButton.showButton()
            //! TODO handle active button
        }
        else {
            this._stopButton.hideButton()
        }
    }
    /**
     * hide or display fastForward button
     */
    public updateFastForwardButton(value: Button) {
        if(value.display) {
            this._fastForwardButton.showButton()
            if(value.active) {
                this._fastForwardButton.activeButton()
            }
            else {
                this._fastForwardButton.desactivateButton()
            }
        }
        else {
            this._fastForwardButton.hideButton()
        }
    }
   
    /**
     * hide or display fastBackward button
     */
    public updateFastBackwardButton(value: Button) {
        if(value.display) {
            this._fastBackwardButton.showButton()
            if(value.active) {
                this._fastBackwardButton.activeButton()
            }
            else {
                this._fastBackwardButton.desactivateButton()
            }
        }
        else {
            this._fastBackwardButton.hideButton()
        }
    }
    /**
     * hide or display next button
     */
    public updateNextButton(value: Button) {
        if(value.display) {
            this._nextButton.showButton()
        }
        else {
            this._nextButton.hideButton()
        }
    }
    /**
     * hide or display previous button
     */
    public updatePreviousButton(value: Button) {
        if(value.display) {
            this._previousButton.showButton()
        }
        else {
            this._previousButton.hideButton()
        }
    }
    public updateJumpBackwardTimeButton(value: Button): void {
        if(value.display) {
            this._jumpBackwardTimeButton.showButton()
        }
        else {
            this._jumpBackwardTimeButton.hideButton()
        }
    }
    public updateJumpForwardTimeButton(value: Button): void {
        if(value.display) {
            this._jumpForwardTimeButton.showButton()
        }
        else {
            this._jumpForwardTimeButton.hideButton()
        }
    }
    removeView(): void {
        this.remove()
    }
    
}

