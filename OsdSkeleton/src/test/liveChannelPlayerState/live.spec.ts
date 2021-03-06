import { assert, expect } from "chai";
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
            liveChannelPlayerState = new LiveChannelPlayerState(options, new MockStateMachine())
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
        let mockVideo: MockVideo
        sandbox = sinon.createSandbox()
        beforeEach(function () {
            playingAsset = new PlayingAsset(new FrontEndLiveChannel("fake", "fake", "fake", "fake", 0), states.STOPPED)
            options = {
                playingAsset: playingAsset,
                asset: asset
            }
            liveChannelPlayerState = new LiveChannelPlayerState(options, new MockStateMachine())
            mockStateMachine = new MockStateMachine()
            liveChannelPlayerState.postRender()
            mockVideo = new MockVideo()
            sandbox.replace<any, any>(liveChannelPlayerState, '_video', mockVideo)

        })
        afterEach(function () {
            liveChannelPlayerState.removeView()
            sandbox.restore()
        })
        //####################################### TEST PLAY #################################################
        /**
         * display a live
         */
        it("Play a live channel", function () {
            liveChannelPlayerState.play()
            assert.equal(playingAsset.state.label, states.PLAYING.label)
        })
        //####################################### TEST PAUSE #################################################
        it("Pause a live channel ", function () {
            let timeShiftPlayerState = liveChannelPlayerState.pause()
            assert.isTrue(timeShiftPlayerState instanceof TimeShiftPlayerState)
            assert.isTrue(playingAsset.asset instanceof FrontEndTimeShift)
        })
        //####################################### TEST Fast Backward #################################################
        it("Backward a live channel ", function () {
            let timeShiftPlayerState = liveChannelPlayerState.fastBackward()
            assert.isTrue(timeShiftPlayerState instanceof TimeShiftPlayerState)
            assert.isTrue(playingAsset.asset instanceof FrontEndTimeShift)
        })
        //####################################### TEST Fast Forward #################################################
        /**
         * Fast forward : KO 
         * We can't fast forward a live channel
         */
        it("Fast forward a live channel ", function () {
            expect(() => { liveChannelPlayerState.fastForward() }).to.throw()
            assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
        })
        //####################################### TEST jumpForward #################################################
        /**
         * Jump forward : KO 
         * We can't jump forward time a live channel
         */
        it("Jump forward a live channel ", function () {
            expect(() => { liveChannelPlayerState.jumpForwardTime() }).to.throw()
            assert.isTrue(playingAsset.asset instanceof FrontEndLiveChannel)
        })
        //####################################### TEST jump backward #################################################
        /**
         * Jump backward : OK 
         */
        it("Jump backward a live channel ", function () {
            mockVideo.currentTime = 30
            let timeShiftPlayerState = liveChannelPlayerState.jumpBackwardTime(15)
            assert.isTrue(timeShiftPlayerState instanceof TimeShiftPlayerState)
            assert.isTrue(playingAsset.asset instanceof FrontEndTimeShift)
            assert.equal((<FrontEndTimeShift>playingAsset.asset).getCurrentTime(), 15)
        })

    })

})