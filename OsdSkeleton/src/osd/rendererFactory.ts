import { FrontEndAsset } from "../models/assets/FrontEndAsset";
import { assetsType } from "../utils/constants";
import { RegularRenderer } from "../renderer/regularRenderer";
import { LiveChannelRenderer } from "../renderer/liveChannelRenderer";

export class RendererFactory {
    makeRenderer(asset: FrontEndAsset) {
        switch(asset.type) {
            case assetsType.VIDEO: 
                return new RegularRenderer(asset)
            default: 
                return new LiveChannelRenderer(asset)
        }
    }
}