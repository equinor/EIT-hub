/* eslint-disable */
// @ts-nocheck
/**
 * Represent a set of RTC peering connection so that there are one presenter that stream to multiple viewers.
 * 
 * This is the only class that can talk to SimplePeer directly.
 */

const SimplePeer = require("simple-peer");
const wrtc = require("wrtc");


class VideoStream {

    /** Creates device peer connection on offer. Returns SDP answer, peer and stream in callback.
     * 
     * @param {string} DeviceSDP
     * @param {Function} callback     
     */

    createDevicePeer(DeviceSDP, callback) {

        let video;
        let sdp = null;
        let DataObj;
        
        let DevicePeer = new SimplePeer({
            trickle: false,
            wrtc: wrtc
        }); 

        DevicePeer.on('error', err => console.log('error', err));
        DevicePeer.on('stream', stream => { video = stream });

        DevicePeer.on('signal', data => {
            console.log("Generated SDP answer for device");
            sdp = JSON.stringify(data);
            DataObj = { stream: video, peer: DevicePeer, sdp: sdp };

            callback(DataObj);
        });

        DevicePeer.signal(JSON.parse(DeviceSDP));
        console.log("Submited device SDP");


        
    }


    /** Creates client peer on browser request. Returns SDP offer and peer in callback.  
     * 
     * @param {any} Stream
     * @param {Function} callback
     * @return {any} returns peer
     */

    createClientPeer(Stream, callback) {

        let sdp;
        let DataObj;

        let ClientPeer = new SimplePeer({
            stream: Stream,
            trickle: false,
            wrtc: wrtc
        });

        ClientPeer.on('error', err => console.log('error', err));

        ClientPeer.on('signal', data => {
            console.log("Generated client SDP");
            sdp = JSON.stringify(data); 
            DataObj = { peer: ClientPeer, sdp: sdp };
            callback(DataObj);
        });

        return ClientPeer;
    }


    /** Submits client SDP. 
     * 
     * @param {any} ClientPeer
     * @param {string} ClientSDP 
     */

    submitClientSDP(ClientPeer, ClientSDP) {
        ClientPeer.signal(ClientSDP);
        console.log("Submited client SDP");
    }


    /** Destroys selected peer conection.
     * 
     * @param {any} Peer 
     * @param {any} PeerId
     */

    PeerDestroy(Peer, PeerId){
        Peer.destroy();
        console.log(`${PeerId} peer connection destroyed`);
    }


}

module.exports = VideoStream; 