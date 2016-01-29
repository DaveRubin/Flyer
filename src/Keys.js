/**
 * Created by David on 29/01/2016.
 */
var Keys = function() {
    var self = this;
    self.keyPressed = new Emitter();

    function init(){
        console.log("newwww!!!");
        window.addEventListener("keyup", onKeyUp, false);
        window.addEventListener("keydown", onKeyDown, false);
    }

    function onKeyUp(e){
        self.keyPressed.emit("up",getString(e));
    }
    function onKeyDown(e){
        self.keyPressed.emit("down",getString(e));
    }

    function getString(e){
        switch(e.keyCode) {
            case 37:
                return("left");
                break;
            case 38:
                return("up");
                break;
            case 39:
                return("right");
                break;
            case 40:
                return("down");
                break;
        }

    }

    init();

};

