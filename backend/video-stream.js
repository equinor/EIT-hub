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
     * @param {function} callback     
     */

    createDevicePeer(DeviceSDP, callback) {

        let video;
        let sdp;
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
        });

        DevicePeer.signal(JSON.parse(DeviceSDP));
        console.log("Submited device SDP");

        DataObj = { stream: video, peer: DevicePeer, sdp: sdp };

        callback(DataObj);
        
    }


    /** Creates client peer on browser request. Returns SDP offer and peer in callback.  
     * 
     * @param {any} Stream
     * @param {function} callback
     */

    createClientPeer(Stream, callback) {

        let sdp;
        let DataObj;

        let ClientPeer = new SimplePeer({
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

        DataObj = { peer: ClientPeer, sdp: sdp };

        callback(DataObj);
        
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
     * @param {any} PeerId
     */

    PeerDestroy(Peer, PeerId){
        Peer.destroy();
        console.log(`Peer ${PeerId} connection destroyed`);
    }


}

module.exports = VideoStream; 