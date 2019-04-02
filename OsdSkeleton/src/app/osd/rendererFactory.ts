import { FrontEndAsset } from "../models/assets/FrontEndAsset";
import { assetsType } from "../utils/constants";
import { RegularRenderer } from "../renderer/regularRenderer";
import { LiveChannelRenderer } from "../renderer/liveChannelRenderer";
import { TimeShiftRenderer } from "../renderer/timeShiftRenderer";
import { ConfigToDisplay } from "../models/config";

export class RendererFactory {
    makeRenderer(asset: FrontEndAsset, configToDisplay: ConfigToDisplay) {
        switch(asset.type) {
            case assetsType.VIDEO: 
                return new RegularRenderer(asset, configToDisplay)
            case assetsType.LIVE_CHANNEL:
                return new LiveChannelRenderer(asset, configToDisplay)
            default:
                return new TimeShiftRenderer(asset, configToDisplay)
        }
    }
}