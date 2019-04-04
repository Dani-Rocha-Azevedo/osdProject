import { IPlayerState } from "./IPlayerState";
import {assetsType} from '../utils/constants'
import { VideoPlayerState } from "./Video/videoPlayerState";
import { LiveChannelPlayerState } from "./LiveChannel/liveChannelPlayerState";
import { VideoStateMachine } from "./Video/videoStateMachine";
import { LiveStateMachine } from "./LiveChannel/liveChannelStateMachine";
export class  PlayerStateFactory {
    constructor(){}
    public makePlayer(options: any): IPlayerState {
        switch(options.asset.type) {
            case assetsType.VIDEO: 
                return new VideoPlayerState(options, new VideoStateMachine())
            // Live channel
            default:
                return new LiveChannelPlayerState(options, new LiveStateMachine())
        }
    }
}