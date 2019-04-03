import { assert } from "chai";
import { assetsType } from "../../app/utils/constants";
import { FrontEndLiveChannel } from "../../app/models/assets/FrontEndLiveChannel"
import { LiveChannelPlayerState } from "../../app/playerState/LiveChannel/liveChannelPlayerState"
import { states } from "../../app/utils/constants"
import { PlayingAsset } from "../../app/playingAsset";
import { MockStateMachine } from "./mockLiveChannelStateMachine";
import sinon from "sinon";
import { TimeShiftPlayerState } from "../../app/playerState/TimeShift/timeShiftPlayerState";
import { MockVideo } from "./mockVideo";
import { FrontEndTimeShift } from "../../app/models/assets/FrontEndTimeShift";

describe('Tests a live channel', function () {
    let asset =
    {
        startTime: "09:10",
        endTime: "09:30",
        description: "LiveChannel",
        src: "https://test.flowr.cloud/ozone/W6isCSziBO",
        realTime: 30,
        type: assetsType.LIVE_CHANNEL
    }
    let playingAsset: PlayingAsset
    let options: any
    let sandbox: sinon.SinonSandbox
    let liveChannelPlayerState: LiveChannelPlayerState

    describe('Test a live channel without mock', function () {
        beforeEach(function () {
            playingAsset = new PlayingAsset(new FrontEndLiveChannel("fake", "fake", "fake", "fake", 0), states.STOPPED)
            options = {
                playingAsset: playingAsset,
                asset: asset
            }
            liveChannelPlayerState = new LiveChannelPlayerState(options)
            liveChannelPlayerState.postRender()
        })
        afterEach(function () {
            liveChannelPlayerState.removeView()
        })
        it('Create a liveChannelPlayerState', function () {
            assert.equal(playingAsset.asset.description, asset.description)
            assert.equal(playingAsset.state.label, states.PAUSED.label)
        })
    })
    describe('Test a live channel with mocks', function () {
        let mockStateMachine: MockStateMachine
        let mockVideo : MockVideo
        sandbox = sinon.createSandbox()
        beforeEach(function () {
            playingAsset = new PlayingAsset(new FrontEndLiveChannel("fake", "fake", "fake", "fake", 0), states.STOPPED)
            options = {
                playingAsset: playingAsset,
                asset: asset
            }
            liveChannelPlayerState = new LiveChannelPlayerState(options)
            mockStateMachine = new MockStateMachine()
            
            sandbox.replace<any, any>(liveChannelPlayerState, '_stateMachine', mockStateMachine)
            liveChannelPlayerState._handleChangeState()
            liveChannelPlayerState.postRender()
            mockVideo = new MockVideo()
            sandbox.replace<any, any>(liveChannelPlayerState, '_video', mockVideo)

        })
        afterEach(function () {
            liveChannelPlayerState.removeView()
        })
        //####################################### TEST PLAY #################################################
        /**
         * display a live
         */
        it("Play a live channel", function () {
            try {
                liveChannelPlayerState.play()
                assert.equal(playingAsset.state.label, states.PLAYING.label)
            } catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        //####################################### TEST PAUSE #################################################
        it("Pause a live channel ", function () {
            try {
                let timeShiftPlayerState = liveChannelPlayerState.pause()
                assert.isTrue(timeShiftPlayerState instanceof TimeShiftPlayerState)
                assert.isTrue(playingAsset.asset instanceof FrontEndTimeShift)
            } catch (err) {
                console.log(err)
                assert.isTrue(false)
            }
        })
        //####################################### TEST Fast Backward #################################################
        it("Backward a live channel ", function () {
            try {
                let timeShiftPlayerState = liveChannelPlayerState.fastBackward()
                assert.isTrue(timeShiftPlayerState instanceof TimeShiftPlayerState)
                assert.isTrue(playingAsset.asset instanceof FrontEndTimeShift)
            } catch (err) {
                console.log(err)
                assert.isTrue(false)
            }
        })
        //####################################### TEST Fast Forward #################################################
        /**
         * Fast forward : KO 
         * We can't fast forward a live channel
         */
        it("Fast forward a live channel ", function () {
            try {
                liveChannelPlayerState.fastForward()

            } catch (err) {
                assert.equal(err.message, "You can't fast forward a live channel")
                assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
            }
        })
        //####################################### TEST jumpForward #################################################
        /**
         * Jump forward : KO 
         * We can't jump forward time a live channel
         */
        it("Jump forward a live channel ", function () {
            try {
                liveChannelPlayerState.jumpForwardTime()

            } catch (err) {
                assert.equal(err.message, "You can't fast jump forward a live channel")
                assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
            }
        })
        //####################################### TEST jump backward #################################################
        /**
         * Jump backward : OK 
         */
        it("Jump backward a live channel ", function () {
            try {
                mockVideo.currentTime = 30
                let timeShiftPlayerState = liveChannelPlayerState.jumpBackwardTime(15)
                assert.isTrue(timeShiftPlayerState instanceof TimeShiftPlayerState)
                assert.isTrue(playingAsset.asset instanceof FrontEndTimeShift)
                assert.equal((<FrontEndTimeShift>playingAsset.asset).getCurrentTime(), 15) 
            } catch (err) {
                console.log(err.message)
                assert.isTrue(false)
            }
        })
        
    })

})