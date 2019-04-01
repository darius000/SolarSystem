//Class that takes care of all input
class Input {
    static m_InDocument = false;
    static m_KeyPressed = '';
    static m_MouseButtonDown = -1;
    static m_MousePosition = new THREE.Vector2();
    static m_MouseZoom = 0.0;

    constructor() {
        document.onkeydown = function(keyBoardEvent) {
            if (Input.m_InDocument) {
                Input.m_KeyPressed = keyBoardEvent.key;

                OnKeyDown(Input.m_KeyPressed);
            }
        }

        document.onkeyup = function(keyBoardEvent) {
            if (Input.m_InDocument) {
                Input.m_KeyPressed = "";
            }
        }

        document.onkeypress = function(keyBoardEvent) {
            if (Input.m_InDocument) {
                Input.m_KeyPressed = keyBoardEvent.key;

                OnKeyPressed(Input.m_KeyPressed);
            }

        }

        document.onmouseover = function() {
            Input.m_InDocument = true;
            //console.log(this.m_InDocument);
        }
        document.onmouseout = function() {
            Input.m_InDocument = false;
            //console.log(this.m_InDocument);
        }

        document.onmousedown = function(mouseDownEvent) {
            if (Input.m_InDocument) {
                Input.m_MouseButtonDown = mouseDownEvent.button;

                OnMouseButtonDown(Input.m_MouseButtonDown);
            }
        }
        document.onmouseup = function(mouseUpEvent) {
            if (Input.m_InDocument) {
                Input.m_MouseButtonDown = -1;
            }
        }

        document.onmousemove = function(mouseMoveEvent) {
            if (Input.m_InDocument) {
                Input.m_MousePosition = new THREE.Vector2(mouseMoveEvent.movementX, mouseMoveEvent.movementY);

                OnMouseMoved(Input.m_MousePosition);
            }
        }

        document.onmousewheel = function(mouseWheelEvent) {
            if (Input.m_InDocument) {
                Input.m_MouseZoom = mouseWheelEvent.wheelDelta;
                //mouseWheelEvent.preventDefault();

                OnMouseScrolled(Input.m_MouseZoom);
            }
        }
    }

    static GetKey() {
        return Input.m_KeyPressed;
    }

    static IsInDocument() {
        return Input.m_InDocument;
    }

    //0 = left, 1 = middle, 2 = right
    static GetMouseButtonDown() {
        return Input.m_MouseButtonDown;
    }

    static GetMouseWheel() {
        return Input.m_MouseZoom;
    }

    static GetMousePosition() {
        return Input.m_MousePosition;
    }
}

//Input Events
function OnMouseButtonDown(n) {
    const event = new CustomEvent('OnMouseButtonDown', {
        detail: {
            button: n
        }
    });

    document.dispatchEvent(event);
}

function OnMouseMoved(pos) {
    const event = new CustomEvent('OnMouseMoved', {
        detail: {
            position: pos
        }
    });

    document.dispatchEvent(event);
}

function OnMouseScrolled(d) {
    const event = new CustomEvent('OnMouseScrolled', {
        detail: {
            delta: d
        }
    });

    document.dispatchEvent(event);
}

function OnKeyDown(k) {
    const event = new CustomEvent('OnKeyDown', {
        detail: {
            key: k
        }
    });

    document.dispatchEvent(event);
}

function OnKeyPressed(k) {
    const event = new CustomEvent('OnKeyPressed', {
        detail: {
            key: k
        }
    });

    document.dispatchEvent(event);
}