import * as Backbone from 'backbone'
import { LeftTimeView, RightTimeView, PauseButtonView, StopButtonView, PlayButtonView, FastForwardButtonView, FastBackwardButton, NextButtonView, PreviousButtonView, LiveView } from './view/view';
import { FrontEndAsset } from '../models/assets/FrontEndAsset';
import { FrontEndLiveChannel } from '../models/assets/FrontEndLiveChannel';
import { IRenderer } from './IRenderer';
import { Button } from '../models/button';
export class LiveChannelRenderer extends Backbone.View<Backbone.Model> implements IRenderer{
    private _template: any
    private _startTime: any
    private _endTime: any
    // VIEW
    private _startTimeView: LeftTimeView
    private _endTimeView: RightTimeView
    private _pauseButton: PauseButtonView
    private _stopButton: StopButtonView
    private _playButton: PlayButtonView
    private _fastForwardButton: FastForwardButtonView
    private _fastBackwardButton: FastBackwardButton
    private _nextButton: NextButtonView
    private _previousButton: PreviousButtonView
    private _liveView: LiveView
    constructor(asset: FrontEndAsset) {
        super()
        this._startTime = (<FrontEndLiveChannel> asset).getStartTime()
        this._endTime = (<FrontEndLiveChannel> asset).getEndTime()
        this.updateLeftTime(this._startTime)
        this.updateRightTime(this._endTime)
    }
    initialize() {
        this._template = require("ejs-compiled-loader!./liveChannelRenderer.ejs")
        this._startTimeView = new LeftTimeView()
        this._endTimeView = new RightTimeView()
        this._pauseButton = new PauseButtonView()
        this._playButton = new PlayButtonView()
        this._stopButton = new StopButtonView()
        this._fastBackwardButton = new FastBackwardButton()
        this._fastForwardButton = new FastForwardButtonView()
        this._nextButton = new NextButtonView()
        this._previousButton = new PreviousButtonView()
        this._liveView = new LiveView()
    }
    render() {
        this.$el.html(this._template())
        this.$("#endTime").html(this._endTimeView.render().el)
        this.$("#startTime").html(this._startTimeView.render().el)
        this.$("#pauseButton").html(this._pauseButton.render().el)
        this.$("#playButton").html(this._playButton.render().el)
        this.$("#stopButton").html(this._stopButton.render().el)
        this.$("#fastForwardButton").html(this._fastForwardButton.render().el)
        this.$("#fastBackwardButton").html(this._fastBackwardButton.render().el)
        this.$("#nextButton").html(this._nextButton.render().el)
        this.$("#previousButton").html(this._previousButton.render().el)
        this.$("#liveView").html(this._liveView.render().el)
        return this
    }
    updateLeftTime(value: string) {
        this._startTimeView.updateLeftTime(value)
    }  
    updateRightTime(value: string): void {
        this._endTimeView.updateRightTime(value)
    }
    public updatePauseButton(value: Button) {
        if(value.display) {
            this._pauseButton.showButton()
            //! TODO handle active button
        }
        else {
            this._pauseButton.hideButton()
        }
    }
    public updatePlayButton(value: Button) {
        if(value.display) {
            this._playButton.showButton()
                //! TODO handle active button
        }
        else {
            this._playButton.hideButton()
        }
    }
    public updateStopButton(value: Button) {
        if(value.display) {
            this._stopButton.showButton()
            //! TODO handle active button
        }
        else {
            this._stopButton.hideButton()
        }
    }
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
    public updateNextButton(value: Button) {
        if(value.display) {
            this._nextButton.showButton()
        }
        else {
            this._nextButton.hideButton()
        }
    }
    public updatePreviousButton(value: Button) {
        if(value.display) {
            this._previousButton.showButton()
        }
        else {
            this._previousButton.hideButton()
        }
    }
    removeView(): void {
        this.remove()
    }

}