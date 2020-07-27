export default class VideoView {
    constructor(element) {
        this._rootElem = element;

        // Need this button to start watching the stream. Problems may arise with autoplay
        this._rootElem.querySelector("#play-button").style.visibility = "hidden";
    }

    setStream(stream) {
        let self = this;
        this._rootElem.querySelector("#video").srcObject = stream;
        self._rootElem.querySelector("#play-button").style.visibility = "visible";
        this._rootElem.querySelector("#play-button").onclick = function () { 
            self._rootElem.querySelector("video").play();
            self._rootElem.querySelector("#play-button").style.visibility = "hidden";
        };
    } 

    
    setStatus(status){
        this._rootElem.querySelector("#StreamStatus").innerText = status;
    }


    
}