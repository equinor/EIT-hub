/**
 * Represent a set of RTC peering connection so that there are one presenter that stream to multiple viewers.
 * 
 * This is the only class that can talk to SimplePeer directly.
 */

const SimplePeer = require("simple-peer");
const wrtc = require("wrtc");


class VideoStream {

    /** Creates device peer connection on offer. Returns SDP answer, peer and stream.
     * 
     * @param {string} DeviceSDP
     * @returns {any} json object that contains SDP answer, peer and stream 
     */

    createDevicePeer(DeviceSDP) {

        var video;
        var sdp;
        var returnObj;
        
        var DevicePeer = new SimplePeer({
            trickle: false,
            wrtc: wrtc
        }); 

        DevicePeer.on('error', err => console.log('error', err));
        DevicePeer.on('stream', stream => { video = stream });

        DevicePeer.on('signal', data => {
            console.log("Generated SDP answer for device");
            sdp = JSON.stringify(data);
        });

        DevicePeer.signal(JSON.parse(DeviceSDP));
        console.log("Submited device SDP");

        returnObj = { stream: video, peer: DevicePeer, sdp: sdp };

        return returnObj;
        
    }


    /** Creates client peer on browser request. Returns SDP offer and peer.  
     * 
     * @param {any} Stream
     * @returns {any} json object that contains SDP offer and peer
     */

    createClientPeer(Stream) {

        var sdp;
        var returnObj;

        ClientPeer = new SimplePeer({
            initiator: true,
            stream: Stream,
            trickle: false,
            wrtc: wrtc
        });

        ClientPeer.on('error', err => console.log('error', err));

        ClientPeer.on('signal', data => {
            console.log("Generated client SDP");
            sdp = JSON.stringify(data); 
        });

        returnObj = { peer: ClientPeer, sdp: sdp };

        return returnObj;
        
    }


    /** Submits client SDP. 
     * 
     * @param {any} ClientPeer
     * @param {string} ClientSDP 
     */

    submitClientSDP(ClientPeer, ClientSDP) {
        ClientPeer.signal(JSON.parse(ClientSDP));
        console.log("Submited client SDP");
    }


    /** Destroys selected peer conection.
     * 
     * @param {any} Peer 
     */

    PeerDestroy(Peer){
        Peer.destroy();
        console.log("Peer connection destroyed");
    }


}

module.exports = VideoStream; 