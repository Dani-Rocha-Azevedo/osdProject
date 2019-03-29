import { fsm } from 'typescript-state-machine'
import State = fsm.State
/**
* The differents States
*/
export const states = {
     STOPPED: new State("STOPPED"),
     PLAYING: new State("PLAYING"),
     PAUSED: new State("PAUSED"),
     BACKWARDING: new State("BACKWARDING"),
     FASTFORWARDING: new State("FASTFORWARDING")
 }
 /**
  * The differents types of assets
  */
export const assetsType = {
    LIVE_CHANNEL: "liveChannel",
    VIDEO: "video",
    IMAGE: "image", 
    TIME_SHIFT: "timeShift"
}