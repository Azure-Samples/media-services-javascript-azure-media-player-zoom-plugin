// The MIT License
//
// Copyright (c) 2016 Southworks
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files 
// (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do 
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function (mediaPlayer) {
    "use strict";

    mediaPlayer.plugin('zoom', function (options) {
        var mouseTracker = { x: 0, y: 0 },
            zoomTracker = { scale: 1, panX: 0, panY: 0, panActive: false },
            playerContainer = this.el(),
            getPlayerElement = function () {
                var element = playerContainer.querySelector("video");
                if (!element) {
                    element = playerContainer.querySelector("object");
                }

                return element;
            };

        // Initialize zoom slider and append to player
        var zoomSlider = mediaPlayer.createEl('input', { "type": "range", "min": 1, "max": 4, "step": 0.1, "value": 1, "className": "amp-zoom-slider" });
        playerContainer.appendChild(zoomSlider);

        zoomSlider.addEventListener("change", function () {
            var playerElement = getPlayerElement();

            playerElement.style.transform = "scale(" + this.value + ")";
            zoomTracker.scale = this.value;
        });

        // Configure panning events
        playerContainer.addEventListener("mousemove", function (ev) {
            var playerElement = getPlayerElement();

            var dx = mouseTracker.x - ev.clientX;
            var dy = mouseTracker.y - ev.clientY;
            mouseTracker.x -= dx;
            mouseTracker.y -= dy;

            if (zoomTracker.scale == 1) {
                zoomTracker.panX = playerContainer.clientWidth / 2;
                zoomTracker.panY = playerContainer.clientHeight / 2;
            } else if (zoomTracker.panActive) {
                zoomTracker.panX = Math.round(Math.min(playerContainer.clientWidth, Math.max(zoomTracker.panX + dx * 2 / zoomTracker.scale, 0)) * 100) / 100;
                zoomTracker.panY = Math.round(Math.min(playerContainer.clientHeight, Math.max(zoomTracker.panY + dy * 2 / zoomTracker.scale, 0)) * 100) / 100;
            }

            playerElement.style.transformOrigin = zoomTracker.panX + "px " + zoomTracker.panY + "px";
        });

        playerContainer.addEventListener("mousedown", function (ev) {
            if (zoomTracker.scale > 1) {
                zoomTracker.panActive = true;


                // To avoid pausing playback. Has some issues with the 
                //ev.stopPropagation();
            }

        }, true);

        playerContainer.addEventListener("mouseup", function (ev) {
            zoomTracker.panActive = false;
        });

        playerContainer.addEventListener("mouseout", function () {
            zoomTracker.panActive = false;
        });
    });
}(window.amp));