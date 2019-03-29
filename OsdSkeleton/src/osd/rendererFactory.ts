import { FrontEndAsset } from "../models/assets/FrontEndAsset";
import { assetsType } from "../utils/constants";
import { RegularRenderer } from "../renderer/regularRenderer";
import { LiveChannelRenderer } from "../renderer/liveChannelRenderer";
import { TimeShiftRenderer } from "../renderer/timeShiftRenderer";

export class RendererFactory {
    makeRenderer(asset: FrontEndAsset) {
        switch(asset.type) {
            case assetsType.VIDEO: 
                return new RegularRenderer(asset)
            case assetsType.LIVE_CHANNEL:
                return new LiveChannelRenderer(asset)
            default:
                return new TimeShiftRenderer(asset)
        }
    }
}