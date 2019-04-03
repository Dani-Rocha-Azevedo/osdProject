
import { assert } from "chai";
import { assetsType } from "../../app/utils/constants";
import { VideoPlayerState } from "../../app/playerState/Video/videoPlayerState"
import { PlayingAsset } from "../../app/playingAsset";
import { FrontEndVideo } from "../../app/models/assets/FrontEndVideo";
import { states } from "../../app/utils/constants";
import { MockStateMachine } from './mockVideoStateMachine'
import sinon from "sinon";
import { MockVideo } from "./mockVideo";

describe('Tests a VOD', function () {
    let asset =
    {
        duration: 157.000,
        description: "Ralph BD",
        src: "https://test.flowr.cloud/ozone/PURD7oFHye",
        type: assetsType.VIDEO
    }
    let playingAsset: PlayingAsset
    let options: any
    let sandbox: sinon.SinonSandbox
    let videoPlayerState: VideoPlayerState

    describe('Test a VOD without mock ', function () {
        beforeEach(function () {
            playingAsset = new PlayingAsset(new FrontEndVideo("fake", 0, "fake"), states.STOPPED)
            options = {
                asset: asset,
                playingAsset: playingAsset
            }
            videoPlayerState = new VideoPlayerState(options)
            videoPlayerState.postRender()
        })
        afterEach(function () {

            videoPlayerState.removeView()
        })
        /**
         * Create a videoPlayerState, OK
         * When we create a object, the constructor update playingAsset
         */
        it('Create a videoPlayerState', function () {
            //Verify if asset in PlayingAsset has been updated
            assert.equal(playingAsset.asset.description, asset.description)
            //Verify the state in playingAsset, the state must be PAUSED
            assert.equal(playingAsset.state.label, states.PAUSED.label)
        })
    })
    describe('Test a VOD, with mock', function () {
        let mockStateMachine: MockStateMachine
        sandbox = sinon.createSandbox()
        beforeEach(function () {
            playingAsset = new PlayingAsset(new FrontEndVideo("fake", 0, "fake"), states.STOPPED)
            options = {
                asset: asset,
                playingAsset: playingAsset
            }
            videoPlayerState = new VideoPlayerState(options)
            mockStateMachine = new MockStateMachine()
            sandbox.replace<any, any>(videoPlayerState, "_stateMachine", mockStateMachine)
            videoPlayerState._handleChangeState()
            videoPlayerState.postRender()

        })
        afterEach(function () {

            sandbox.restore()
            videoPlayerState.removeView()
        })
        //####################################### TEST PLAY #################################################
        /**
         * Play a content, OK
         */
        it('Play a video', function () {

            try {
                videoPlayerState.play()
                assert.equal(playingAsset.state.label, states.PLAYING.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Play a content after a pause, OK
         */
        it('Play a video after a pause', function () {
            try {
                videoPlayerState.play() // need play a video before pause
                videoPlayerState.pause()
                videoPlayerState.play()
                assert.equal(playingAsset.state.label, states.PLAYING.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Play a content after a fast Forward , OK
         * The speed on playingAsset = 0 
         */
        it('Play a video after a fast forward', function () {
            try {
                videoPlayerState.fastForward()
                videoPlayerState.play()
                assert.equal(playingAsset.state.label, states.PLAYING.label)
                assert.equal(playingAsset.speed, 0)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Play a content after a fast backward , OK
         * The speed on playingAsset = 0 
         */
        it('Play a video after a fast backward', function () {
            try {
                videoPlayerState.fastBackward()
                videoPlayerState.play()
                assert.equal(playingAsset.state.label, states.PLAYING.label)
                assert.equal(playingAsset.speed, 0)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Play a content after a fast backward , OK
         * The speed on playingAsset = 0 
         */
        it('Play a video after a stop', function () {
            try {
                videoPlayerState.stop()
                videoPlayerState.play()
                assert.equal(playingAsset.state.label, states.PLAYING.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Play a content after a play , KO
         * expect a error, can't click 2 times on play button
         */
        it('Play a video after a stop', function () {
            try {
                videoPlayerState.play() // firt play 
                videoPlayerState.play() // second play -> KO
            }
            catch (err) {
                assert.equal(err.message, "you can't launch content in playing state")
            }
        })

        //####################################### TEST PAUSE #################################################
        /**
         * Pause a content at the beginning before play, KO 
         * A content is paused at the beginning
         * expect a error, a video is paused at the beginning
         */
        it('Paused a video', function () {

            try {
                videoPlayerState.pause()
            }
            catch (err) {
                assert.equal(err.message, "you can't pause content in stopped/paused state")
                // state in playingSate is always paused 
                assert.equal(playingAsset.state.label, states.PAUSED.label)
            }
        })
        /**
         * Pause a content after play: OK
         */
        it('Pause a video after play', function () {

            try {
                videoPlayerState.play()
                videoPlayerState.pause()
                //the state in playingState is Paused 
                assert.equal(playingAsset.state.label, states.PAUSED.label)

            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Pause a content after fast forward: OK
         */
        it('Pause a video after fast forward', function () {

            try {
                videoPlayerState.fastForward()
                videoPlayerState.pause()
                assert.equal(playingAsset.state.label, states.PAUSED.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Pause a content after fast backward: OK
         */
        it('Pause a video after fast backward', function () {

            try {
                videoPlayerState.fastBackward()
                videoPlayerState.pause()
                assert.equal(playingAsset.state.label, states.PAUSED.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Pause a content after fast stop: KO
         * expect a error, can't pause a content after stop the content
         */
        it('Pause a video after stop', function () {

            try {
                videoPlayerState.stop()
                videoPlayerState.pause()
            }
            catch (err) {
                assert.equal(err.message, "you can't pause content in stopped/paused state")
                // the state on playingAsset is always stopped
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
        })
        /**
         * Stop a content at the beginning: OK 
         */
        it('Stop a content', function () {
            try {
                videoPlayerState.stop()
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })

        //####################################### TEST FAST BACKWARD #################################################

        /**
         * Backward a content , x2: OK
         * The user click on backward button 1 time
         */
        it('Backward a VOD , X2', function () {
            try {
                videoPlayerState.fastBackward()
                assert.equal(playingAsset.state.label, states.BACKWARDING.label)
                assert.equal(playingAsset.speed, 1)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Backward a content, x10 
         * The user click on backward button 5 times
         */
        it('Backward a VOD, X10', function () {
            try {
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                assert.equal(playingAsset.state.label, states.BACKWARDING.label)
                assert.equal(playingAsset.speed, 5)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Backward a content, x10 
         * The user click on backward button more than 5 times
         */
        it('Backward a VOD, X10', function () {
            try {
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                videoPlayerState.fastBackward()
                assert.equal(playingAsset.state.label, states.BACKWARDING.label)
                assert.equal(playingAsset.speed, 5)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Backward a content after pause : OK
         * The user click on backward button 1 time
         */
        it('Backward a VOD after pause', function () {
            try {
                videoPlayerState.play() // need play before pause
                videoPlayerState.pause()
                videoPlayerState.fastBackward()
                assert.equal(playingAsset.state.label, states.BACKWARDING.label)
                assert.equal(playingAsset.speed, 1)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
        * Backward a content after play : OK
        * The user click on backward button 1 time
        */
        it('Backward a VOD after play', function () {
            try {
                videoPlayerState.play()
                videoPlayerState.fastBackward()
                assert.equal(playingAsset.state.label, states.BACKWARDING.label)
                assert.equal(playingAsset.speed, 1)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
        * Backward a content after stop : KO
        * expect a error, can't fast backward a content after stop the content
        */
        it('Backward a VOD after stop', function () {
            try {
                videoPlayerState.stop()
                videoPlayerState.fastBackward()
            }
            catch (err) {
                assert.equal(err.message, "you can't rewind content in stopped state")
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
        })
        //####################################### TEST FAST FORWARD #################################################
        /**
         * fast Forward a content , x2: OK
         * The user click on fast forward button 1 time
         */
        it('Fast forward a VOD , X2', function () {
            try {
                videoPlayerState.fastForward()
                assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
                assert.equal(playingAsset.speed, 1)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Fast forward a content, x10 
         * The user click on fast forward button 5 times
         */
        it('Fast forward a VOD, X10', function () {
            try {
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()

                assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
                assert.equal(playingAsset.speed, 5)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Fast forward a content, x10 
         * The user click on fast forward button more than 5 times
         * The speed on playingAsset stay in 5 
         */
        it('Fast forward a VOD, X10', function () {
            try {
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()
                videoPlayerState.fastForward()

                assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
                assert.equal(playingAsset.speed, 5)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Fast forward a content after pause : OK
         * The user click on fast forward button 1 time
         */
        it('Fast forward a VOD after pause', function () {
            try {
                videoPlayerState.play() // need play before pause
                videoPlayerState.pause()
                videoPlayerState.fastForward()
                assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
                assert.equal(playingAsset.speed, 1)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
        * Fast forward a content after play : OK
        * The user click on fast forward button 1 time
        */
        it('Fast forward a VOD after play', function () {
            try {
                videoPlayerState.play()
                videoPlayerState.fastForward()
                assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
                assert.equal(playingAsset.speed, 1)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
        * Fast forward a content after stop : KO
        * expect a error, can't fast forward a content after stop the content
        */
        it('Fast forward a VOD after stop', function () {
            try {
                videoPlayerState.stop()
                videoPlayerState.fastForward()
            }
            catch (err) {
                assert.equal(err.message, "you can't fast forward content in stopped state")
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
        })
        //####################################### TEST STOP #################################################
        /**
        * Stop a content after pause : OK
        */
        it('Stop a VOD after pause', function () {
            try {
                videoPlayerState.play()// need before pause a content
                videoPlayerState.pause()
                videoPlayerState.stop()
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Stop a content after play : OK
         */
        it('Stop a VOD after play', function () {
            try {
                videoPlayerState.play()
                videoPlayerState.stop()
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Stop a content after fast backward : OK
         */
        it('Stop a VOD after fast backward', function () {
            try {
                videoPlayerState.fastBackward()
                videoPlayerState.stop()
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Stop a content after fast forward : OK
         */
        it('Stop a VOD after fast forward', function () {
            try {
                videoPlayerState.fastForward()
                videoPlayerState.stop()
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        /**
         * Stop a content after stop : KO
         * expect a error, can't stop a content after stop the content
         */
        it('Stop a VOD after stop', function () {
            try {
                videoPlayerState.stop()
                videoPlayerState.stop()
            }
            catch (err) {
                assert.equal(err.message, "you can't stop content in stopped state")
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
        })
        //####################################### TEST JUMP FORWARD ########################################
        /**
         * Jump forward a content after play : OK
         */
        it('Jump forward a VOD after play', function (done) {
            this.timeout(3000)
            let video = new MockVideo()
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.play()
                videoPlayerState.jumpForwardTime(20)
                videoPlayerState.jumpForwardTime(20)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
            setTimeout(() => {
                assert.equal(playingAsset.currentPosition, 40)
                assert.equal(playingAsset.state.label, states.PLAYING.label)
                done()
            }, 2000)
        })
        /**
         * Jump forward a content after pause : OK
         */
        it('Jump forward a VOD after pause', function (done) {
            this.timeout(3000)
            let video = new MockVideo()
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.play()
                videoPlayerState.pause()
                videoPlayerState.jumpForwardTime(20)
                videoPlayerState.jumpForwardTime(20)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
            setTimeout(() => {
                assert.equal(playingAsset.currentPosition, 40)
                assert.equal(playingAsset.state.label, states.PAUSED.label)
                done()
            }, 2000)
        })
        /**
         * Jump forward a content after fast backward : KO
         */
        it('Jump forward a VOD after fast backward', function () {
            let video = new MockVideo()
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.fastBackward()
                videoPlayerState.jumpForwardTime(20)
                videoPlayerState.jumpForwardTime(20)
            }
            catch (err) {
                assert.equal(err.message, "you can't jumpForward content in stopped/Forwarding/backwarding state")
                assert.equal(playingAsset.state.label, states.BACKWARDING.label)
            }
        })
        /**
        * Jump forward a content after fast forward : KO
        */
        it('Jump forward a VOD after fast forward', function () {
            let video = new MockVideo()
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.fastForward()
                videoPlayerState.jumpForwardTime(20)
                videoPlayerState.jumpForwardTime(20)
            }
            catch (err) {
                assert.equal(err.message, "you can't jumpForward content in stopped/Forwarding/backwarding state")
                assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
            }
        })
        /**
         * Jump forward a content after STOP : KO
         */
        it('Jump forward a VOD after fast STOP', function () {
            let video = new MockVideo()
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.stop()
                videoPlayerState.jumpForwardTime(20)
                videoPlayerState.jumpForwardTime(20)
            }
            catch (err) {
                assert.equal(err.message, "you can't jumpForward content in stopped/Forwarding/backwarding state")
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
        })
        //####################################### TEST JUMP Backward ########################################
        /**
                * Jump Backward a content after play : OK
                */
        it('Jump Backward a VOD after play', function (done) {
            this.timeout(3000)
            let video = new MockVideo()
            video.currentTime = 60
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.play()
                videoPlayerState.jumpBackwardTime(20)
                videoPlayerState.jumpBackwardTime(20)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
            setTimeout(() => {
                assert.equal(playingAsset.currentPosition, 20)
                assert.equal(playingAsset.state.label, states.PLAYING.label)
                done()
            }, 2000)
        })
        /**
         * Jump backward a content after pause : OK
         */
        it('Jump backward a VOD after pause', function (done) {
            this.timeout(3000)
            let video = new MockVideo()
            video.currentTime = 60
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.play()
                videoPlayerState.pause()
                videoPlayerState.jumpBackwardTime(20)
                videoPlayerState.jumpBackwardTime(20)
            }
            catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
            setTimeout(() => {
                assert.equal(playingAsset.currentPosition, 20)
                assert.equal(playingAsset.state.label, states.PAUSED.label)
                done()
            }, 2000)
        })
        /**
         * Jump backward a content after fast backward : KO
         */
        it('Jump backward a VOD after fast backward', function () {
            let video = new MockVideo()
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.fastBackward()
                videoPlayerState.jumpBackwardTime(20)
                videoPlayerState.jumpBackwardTime(20)
            }
            catch (err) {
                assert.equal(err.message, "you can't jumpBackward content in stopped/Forwarding/backwarding state")
                assert.equal(playingAsset.state.label, states.BACKWARDING.label)
            }
        })
        /**
        * Jump backward a content after fast forward : KO
        */
        it('Jump backward a VOD after fast forward', function () {
            let video = new MockVideo()
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.fastForward()
                videoPlayerState.jumpBackwardTime(20)
                videoPlayerState.jumpBackwardTime(20)
            }
            catch (err) {
                assert.equal(err.message, "you can't jumpBackward content in stopped/Forwarding/backwarding state")
                assert.equal(playingAsset.state.label, states.FASTFORWARDING.label)
            }
        })
        /**
         * Jump backward a content after STOP : KO
         */
        it('Jump backward a VOD after  STOP', function () {
            let video = new MockVideo()
            sandbox.replace<any, any>(videoPlayerState, "_video", video)
            try {
                videoPlayerState.stop()
                videoPlayerState.jumpBackwardTime(20)
                videoPlayerState.jumpBackwardTime(20)
            }
            catch (err) {
                assert.equal(err.message, "you can't jumpBackward content in stopped/Forwarding/backwarding state")
                assert.equal(playingAsset.state.label, states.STOPPED.label)
            }
        })
    })

});