import * as _ from 'underscore'
import * as Backbone from 'backbone'
import {Video} from '../models/assets/Video'
import {LeftTimeView, StopButtonView, PlayButtonView, 
    FastForwardButtonView, FastBackwardButton, NextButtonView, PreviousButtonView, ProgressBarView} from './view'
import {RightTimeView} from './view'
import {PauseButtonView} from './view'
import { Asset } from '../models/assets/Asset';
import { Button } from '../models/button';
import * as moment from 'moment';
import 'moment-duration-format';

export class RegularRenderer extends Backbone.View<Backbone.Model> {
    private _template: any
    private _eventBus: any
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
    private _progressBar: ProgressBarView
    constructor(asset: Asset) {
        super()
        this._duration = (<Video>asset).getDuration()
    }
    initialize(options: any) {
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
        this._progressBar = new ProgressBarView()
    }
    /**
     * Current position updated
     */
    leftTime(value: string) {
        this._currentTimeView.updateCurrentTime(value)
        this._updateProgressBar(value)
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
            this._durationView.updateDuration(this._duration)
            this.$("#currentTime").html(this._currentTimeView.render().el)
            this.$("#pauseButton").html(this._pauseButton.render().el)
            this.$("#playButton").html(this._playButton.render().el)
            this.$("#stopButton").html(this._stopButton.render().el)
            this.$("#fastForwardButton").html(this._fastForwardButton.render().el)
            this.$("#fastBackwardButton").html(this._fastBackwardButton.render().el)
            this.$("#nextButton").html(this._nextButton.render().el)
            this.$("#previousButton").html(this._previousButton.render().el)
            this.$("#progressBar").html(this._progressBar.render().el)
        
        return this
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
   
    
    
}

