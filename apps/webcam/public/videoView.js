/* eslint-disable */
// @ts-nocheck
/* istanbul ignore file */
export default class VideoView {
    constructor(element) {
        this._rootElem = element;

        this._usedElements = {};

        // Need this button to start watching the stream. Problems may arise with autoplay
        

        let self = this;

        this._rootElem.querySelector("#play-button").onclick = function () {
            for(var i = 0; i< self._rootElem.querySelectorAll(".video").length; i++){
                self._rootElem.querySelector("#"+self._rootElem.querySelectorAll(".video").item(i).id).play();
                self._rootElem.querySelector("#play-button").style.visibility = "hidden";
            }
            
        };

    }

    setStream(stream, i) {
        let id = "#" + i;
    

        if (i === -1) {
            console.log("Can't write, add element")
        } else {
            this._rootElem.querySelector(id).srcObject = stream;
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