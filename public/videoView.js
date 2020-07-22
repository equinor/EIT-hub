export default class VideoView {
    constructor(element) {
        this._rootElem = element;

        this._usedElements = {};
        this._counter = {cnt: 1};

        // Need this button to start watching the stream. Problems may arise with autoplay
        this._rootElem.querySelector("#play-button").style.visibility = "hidden";

    }

    setStream(stream, i) {
        let self = this;
        let id = "#" + i;
    

        if (i === -1) {
            console.log("Can't write, add element")
        } else {
            this._rootElem.querySelector(id).srcObject = stream;

            // Activates the button when every stream has loaded. Need to add or condition (aka if one device is off now the stream will never start) 
            if (self._counter.num === self._counter.cnt){
                self._rootElem.querySelector("#play-button").style.visibility = "visible";
            } else {
                self._counter.cnt += 1;
            } 
            

            this._rootElem.querySelector("#play-button").onclick = function () {
                for(var i = 0; i< self._rootElem.querySelectorAll(".video").length; i++){
                    self._rootElem.querySelector("#"+self._rootElem.querySelectorAll(".video").item(i).id).play();
                }
                self._rootElem.querySelector("#play-button").style.visibility = "hidden";
            };
        }
    }


    setStatus(status, i) {
        let id = "#" + i;
        if (i === -1) {
            console.log("Can't write, add element");
        } else {
            this._rootElem.querySelector(id).innerText = status;
        }
    }

    getFreeTag(tagType) {
        let self = this;
        let tagClass = this._rootElem.querySelectorAll(tagType);
        self._counter.num = tagClass.length;
        for (var i = 0; i < tagClass.length; i++) {
            if (tagClass.item(i).id !== self._usedElements[tagClass.item(i).id]) {
                self._usedElements[tagClass.item(i).id] = tagClass.item(i).id;
                return tagClass.item(i).id;
            } else if (i + 1 === tagClass.length) {
                return -1;
            }
        }

    }


}