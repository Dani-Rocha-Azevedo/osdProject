import { assert, expect } from "chai";
import { TimeShiftPlayerState } from "../../app/playerState/TimeShift/timeShiftPlayerState"
import { PlayingAsset } from "../../app/playingAsset";
import { FrontEndTimeShift } from "../../app/models/assets/FrontEndTimeShift";
import { states } from "../../app/utils/constants";
import { MockStateMachine } from './mockTimeShiftStateMachine'
import sinon from "sinon";
import { MockVideo } from "./mockVideo";
import { LiveChannelPlayerState } from "../../app/playerState/LiveChannel/liveChannelPlayerState";
import { FrontEndLiveChannel } from "../../app/models/assets/FrontEndLiveChannel";
import { mockEvent } from "./mockEvent";

describe('Test the timeShift playerState', function () {
    let asset = {
        description: "Description",
        startTime: "09:00",
        endTime: "09:30",
        currentTime: 30,
        src: "fakeSrc"
    }
    let playingAsset: PlayingAsset
    let options: any
    let sandbox: sinon.SinonSandbox
    let timeShiftPlayerState: TimeShiftPlayerState
    let mockVideo: MockVideo
    let mockStateMachine: MockStateMachine
    sandbox = sinon.createSandbox()

    beforeEach(function () {

        let timeShiftAsset = new FrontEndTimeShift(asset.description, asset.startTime, asset.endTime, asset.src, 30)
        playingAsset = new PlayingAsset(timeShiftAsset, states.PAUSED)
        options = {
            playingAsset: playingAsset,
            asset: timeShiftAsset,
            eventBus: new mockEvent()
        }
        mockVideo = new MockVideo()
        mockStateMachine = new MockStateMachine()
        timeShiftPlayerState = new TimeShiftPlayerState(options, new MockStateMachine())
        timeShiftPlayerState.postRender()
        sandbox.replace<any, any>(timeShiftPlayerState, '_video', mockVideo)
        timeShiftPlayerState['_handleCurrentTime']() // private function
    })
    afterEach(function () {
        timeShiftPlayerState.removeView()
        sandbox.restore()
    })
    /**
     * Create a timeShiftPlayerState
     */
    it('Create a timeShiftPlayerState', function () {
        assert.equal(playingAsset.asset.description, asset.description)
        assert.equal(playingAsset.state.label, states.PAUSED.label) // when we create a timeShiftPlayerState, the state don't change
    })
    //####################################### TEST PLAY #################################################
    /**
     * Play after pause: ok
     */
    it('Play a timeShiftAsset after pause', function () {
        // the playerState is paused
        timeShiftPlayerState.play()
        assert.equal(playingAsset.state.label, states.PLAYING.label)
    })
    /**
     * Play after forwarding: ok
     */
    it('Play a timeShiftAsset after fast forwarding', function () {
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.play()
        assert.equal(playingAsset.state.label, states.PLAYING.label)
    })
    /**
     * Play after fast backward: ok
     */
    it('Play a timeshiftAsset after fast backward', function () {
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.play()
        assert.equal(playingAsset.state.label, states.PLAYING.label)
    })
    /**
     * Play after play : KO
     */
    it('Play a timeShiftAsset after play', function () {
        timeShiftPlayerState.play()
        expect(() => { timeShiftPlayerState.play() }).to.throw()
        assert.equal(playingAsset.state.label, states.PLAYING.label)
    })
    /**
     * play after stop : KO
     * Return to live
     */
    it('Play a timeShiftAsset after stop', function () {
        //! can't test this, after a stop, the timeShiftPlayerState is replaced by liveChannelPlayerState
    })
    //####################################### TEST PAUSE #################################################
    /**
    * Pause a content at the beginning before play, KO 
    * A content is paused at the beginning
    * expect a error, a timeShift is paused at the beginning
    */
    it('Paused a timeShiftAsset', function () {
        expect(() => {
            timeShiftPlayerState.pause()
        }).to.throw()
        // state in playingSate is always paused 
        assert.equal(playingAsset.state.label, states.PAUSED.label)
    })
    /**
     * Pause a content after play: OK
     */
    it('Pause a timeShiftAsset after play', function () {
        timeShiftPlayerState.play()
        timeShiftPlayerState.pause()
        //the state in playingState is Paused 
        assert.equal(playingAsset.state.label, states.PAUSED.label)

    })
    /**
     * Pause a content after fast forward: OK
     */
    it('Pause a timeShiftAsset after fast forward', function () {
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.pause()
        assert.equal(playingAsset.state.label, states.PAUSED.label)
    })
    /**
     * Pause a content after fast backward: OK
     */
    it('Pause a timeShiftAsset after fast backward', function () {
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.pause()
        assert.equal(playingAsset.state.label, states.PAUSED.label)

    })
    /**
     * Pause a content after fast stop: KO
     * expect a error, can't pause a content after stop the content
     */
    it('Pause a timeShiftAsset after stop', function () {
        timeShiftPlayerState.stop()
        expect(() => {
            timeShiftPlayerState.pause()
        }).to.throw()
    })
    /**
     * Stop a content at the beginning: OK 
     */
    it('Stop a content', function () {
        let returnValue = timeShiftPlayerState.stop()
        assert.isTrue(returnValue instanceof LiveChannelPlayerState)
        assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
        // it's the playerLayer that start live in the prototype 
        assert.equal(playingAsset.state.label, states.PAUSED.label)
    })

    //####################################### TEST FAST BACKWARD #################################################

    /**
     * Backward a content , x2: OK
     * The user click on backward button 1 time
     */
    it('Backward a timeShiftAsset , X2', function () {
        timeShiftPlayerState.fastBackward()
        assert.equal(playingAsset.state.label, states.BACKWARDING.label)
        assert.equal(playingAsset.speed, 1)
    })
    /**
     * Backward a content, x10 
     * The user click on backward button 5 times
     */
    it('Backward a timeShiftAsset, X10', function () {
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        assert.equal(playingAsset.state.label, states.BACKWARDING.label)
        assert.equal(playingAsset.speed, 5)
    })
    /**
     * Backward a content, x10 
     * The user click on backward button more than 5 times
     */
    it('Backward a timeShiftAsset, X10', function () {
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        timeShiftPlayerState.fastBackward()
        assert.equal(playingAsset.state.label, states.BACKWARDING.label)
        assert.equal(playingAsset.speed, 5)
    })
    /**
     * Backward a content after pause : OK
     * The user click on backward button 1 time
     */
    it('Backward a timeShiftAsset after pause', function () {
        timeShiftPlayerState.play() // need play before pause
        timeShiftPlayerState.pause()
        timeShiftPlayerState.fastBackward()
        assert.equal(playingAsset.state.label, states.BACKWARDING.label)
        assert.equal(playingAsset.speed, 1)
    })
    /**
    * Backward a content after play : OK
    * The user click on backward button 1 time
    */
    it('Backward a timeShiftAsset after play', function () {
        timeShiftPlayerState.play()
        timeShiftPlayerState.fastBackward()
        assert.equal(playingAsset.state.label, states.BACKWARDING.label)
        assert.equal(playingAsset.speed, 1)
    })
    /**
    * Backward a content after stop : KO
    * expect a error, can't fast backward a content after stop the content
    */
    it('Backward a timeShiftAsset after stop', function () {
        //! can't test this, after a stop, the timeShiftPlayerState is replaced by liveChannelPlayerState

    })
    //####################################### TEST FAST FORWARD #################################################
    /**
     * fast Forward a content , x2: OK
     * The user click on fast forward button 1 time
     */
    it('Fast forward a timeShiftAsset , X2', function () {
        timeShiftPlayerState.fastForward()
        assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
        assert.equal(playingAsset.speed, 1)
    })
    /**
     * Fast forward a content, x10 
     * The user click on fast forward button 5 times
     */
    it('Fast forward a timeShiftAsset, X10', function () {
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
        assert.equal(playingAsset.speed, 5)
    })
    /**
     * Fast forward a content, x10 
     * The user click on fast forward button more than 5 times
     * The speed on playingAsset stay in 5 
     */
    it('Fast forward a timeShiftAsset, X10', function () {
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        timeShiftPlayerState.fastForward()
        assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
        assert.equal(playingAsset.speed, 5)
    })
    /**
     * Fast forward a content after pause : OK
     * The user click on fast forward button 1 time
     */
    it('Fast forward a timeShiftAsset after pause', function () {
        timeShiftPlayerState.play() // need play before pause
        timeShiftPlayerState.pause()
        timeShiftPlayerState.fastForward()
        assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
        assert.equal(playingAsset.speed, 1)

    })
    /**
    * Fast forward a content after play : OK
    * The user click on fast forward button 1 time
    */
    it('Fast forward a timeShiftAsset after play', function () {
        timeShiftPlayerState.play()
        timeShiftPlayerState.fastForward()
        assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
        assert.equal(playingAsset.speed, 1)
    })
    /**
    * Fast forward a content after stop : KO
    * expect a error, can't fast forward a content after stop the content
    */
    it('Fast forward a timeShiftAsset after stop', function () {
        //! can't test this, after a stop, the timeShiftPlayerState is replaced by liveChannelPlayerState

    })
    //####################################### TEST STOP #################################################
    /**
    * Stop a content after pause : OK
    */
    it('Stop a timeShiftAsset after pause', function () {
        timeShiftPlayerState.play()// need before pause a content
        timeShiftPlayerState.pause()
        let returnValue = timeShiftPlayerState.stop()
        assert.isTrue(returnValue instanceof LiveChannelPlayerState)
        assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
        // it's the playerLayer that start live in the prototype 
        assert.equal(playingAsset.state.label, states.PAUSED.label)
    })
    /**
     * Stop a content after play : OK
     */
    it('Stop a timeShiftAsset after play', function () {
        timeShiftPlayerState.play()// need before pause a content
        let returnValue = timeShiftPlayerState.stop()
        assert.isTrue(returnValue instanceof LiveChannelPlayerState)
        assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
        // it's the playerLayer that start live in the prototype 
        assert.equal(playingAsset.state.label, states.PAUSED.label)
    })
    /**
     * Stop a content after fast backward : OK
     */
    it('Stop a timeShiftAsset after fast backward', function () {
        timeShiftPlayerState.fastBackward()// need before pause a content
        let returnValue = timeShiftPlayerState.stop()
        assert.isTrue(returnValue instanceof LiveChannelPlayerState)
        assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
        // it's the playerLayer that start live in the prototype 
        assert.equal(playingAsset.state.label, states.PAUSED.label)
    })
    /**
     * Stop a content after fast forward : OK
     */
    it('Stop a timeShiftAsset after fast forward', function () {
        timeShiftPlayerState.fastForward()// need before pause a content
        let returnValue = timeShiftPlayerState.stop()
        assert.isTrue(returnValue instanceof LiveChannelPlayerState)
        assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
        // it's the playerLayer that start live in the prototype 
        assert.equal(playingAsset.state.label, states.PAUSED.label)
    })
    /**
     * Stop a content after stop : KO
     * expect a error, can't stop a content after stop the content
     */
    it('Stop a timeShiftAsset after stop', function () {
        //! can't test this, after a stop, the timeShiftPlayerState is replaced by liveChannelPlayerState
    })
    //####################################### TEST JUMP FORWARD ########################################
    /**
     * Jump forward a content after play : OK
     */
    it('Jump forward a timeShitfAsset after play', function (done) {
        this.timeout(3000)
        // at this moment, the movie's at 30s 
        timeShiftPlayerState.play()
        timeShiftPlayerState.jumpForwardTime(20)
        timeShiftPlayerState.jumpForwardTime(20)
        setTimeout(() => {
            assert.equal(mockVideo.currentTime, 70)
            assert.equal(playingAsset.state.label, states.PLAYING.label)
            done()
        }, 2000)
    })
    /**
     * Jump forward a content after pause : OK
     */
    it('Jump forward a timeShitfAsset after pause', function (done) {
        this.timeout(3000)
        try {
            timeShiftPlayerState.play()
            timeShiftPlayerState.pause()
            timeShiftPlayerState.jumpForwardTime(20)
            timeShiftPlayerState.jumpForwardTime(20)
        }
        catch (err) {
            console.log(err.message)
            assert.isTrue(false)
        }
        setTimeout(() => {
            assert.equal(mockVideo.currentTime, 70)
            assert.equal(playingAsset.state.label, states.PAUSED.label)
            done()
        }, 2000)
    })
    /**
     * Jump forward a content after fast backward : KO
     */
    it('Jump forward a timeShitfAsset after fast backward', function () {
        try {
            timeShiftPlayerState.fastBackward()
            timeShiftPlayerState.jumpForwardTime(20)
            timeShiftPlayerState.jumpForwardTime(20)
        }
        catch (err) {
            assert.equal(err.message, "you can't jumpForward content in stopped/Forwarding/backwarding state")
            assert.equal(playingAsset.state.label, states.BACKWARDING.label)
        }
    })
    /**
    * Jump forward a content after fast forward : KO
    */
    it('Jump forward a timeShitfAsset after fast forward', function () {
        try {
            timeShiftPlayerState.fastForward()
            timeShiftPlayerState.jumpForwardTime(20)
            timeShiftPlayerState.jumpForwardTime(20)
        }
        catch (err) {
            assert.equal(err.message, "you can't jumpForward content in stopped/Forwarding/backwarding state")
            assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
        }
    })
    /**
     * Jump forward a content after STOP : KO
     */
    it('Jump forward a timeShitfAsset after fast STOP', function () {
        //! can't test this, after a stop, the timeShiftPlayerState is replaced by liveChannelPlayerState
    })
    //####################################### TEST JUMP Backward ########################################
    /**
            * Jump Backward a content after play : OK
            */
    it('Jump Backward a timeShitfAsset after play', function (done) {
        this.timeout(3000)

        timeShiftPlayerState.play()
        timeShiftPlayerState.jumpBackwardTime(10)
        timeShiftPlayerState.jumpBackwardTime(10)
        setTimeout(() => {
            assert.equal(mockVideo.currentTime, 10)
            assert.equal(playingAsset.state.label, states.PLAYING.label)
            done()
        }, 2000)
    })
    /**
     * Jump backward a content after pause : OK
     */
    it('Jump backward a timeShitfAsset after pause', function (done) {
        this.timeout(3000)
        timeShiftPlayerState.play()
        timeShiftPlayerState.pause()
        timeShiftPlayerState.jumpBackwardTime(10)
        timeShiftPlayerState.jumpBackwardTime(10)
        setTimeout(() => {
            assert.equal(mockVideo.currentTime, 10)
            assert.equal(playingAsset.state.label, states.PAUSED.label)
            done()
        }, 2000)
    })
    /**
     * Jump backward a content after fast backward : KO
     */
    it('Jump backward a timeShitfAsset after fast backward', function () {
        timeShiftPlayerState.fastBackward()
        expect(() => { timeShiftPlayerState.jumpBackwardTime(20) }).to.throw()
    })
    /**
    * Jump backward a content after fast forward : KO
    */
    it('Jump backward a timeShitfAsset after fast forward', function () {
        timeShiftPlayerState.fastForward()
        expect(() => { timeShiftPlayerState.jumpBackwardTime(20) }).to.throw()
    })
    /**
     * Jump backward a content after STOP : KO
     */
    it('Jump backward a timeShitfAsset after  STOP', function () {
        //! can't test this, after a stop, the timeShiftPlayerState is replaced by liveChannelPlayerState
    })

})