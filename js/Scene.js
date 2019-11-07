class Scene extends THREE.Scene {
    constructor() {
        super();
        this.m_CameraAim = this.GetCameraAim();
        this.m_Camera = this.GetCamera();
        this.GetCamera();
        this.m_Controls = this.GetControls();

        // console.log(this.m_Controls);
    }

    GetCameraAim() {
        return new CameraAim(75.0, Application.m_AspectRatio, .0001, 20000);
    }

    GetCamera() {
        return this.m_CameraAim.mCamera;
    }

    GetControls() {
        return new Controls(this.m_CameraAim);
    }

    OnStart() {
        this.add(this.m_CameraAim);

        this.background = new THREE.Color(.5, .5, .5);

        this.m_Controls.Construct();
    }

    OnUpdate(deltaTime, time) {

    }

    OnEnd() {
        this.m_Controls.DeConstruct();
    }
}

class Controls {
    constructor(camera = new CameraAim(75, 16 / 9, .01, 1000)) {
        this.m_Camera = camera;
        this.m_Controls;
        this.m_Gui;
    }

    Construct() {
        this.CreateGUI();
        document.getElementById('Controls').appendChild(this.m_Gui.domElement);
        console.log("Constructed");
    }

    DeConstruct() {
        document.getElementById('Controls').removeChild(this.m_Gui.domElement);
        this.RemoveGUI();
        console.log("DeConstructed");
    }

    CreateGUI() {
        this.m_Gui = new dat.GUI({ load: JSON });
        this.m_Controls = this.m_Gui.addFolder("Camera Controls");
        //this.m_Controls.add(this.m_Camera, "m_PanSpeed", 0.00001, 10.0).name("Pan Speed");
        this.m_Controls.add(this.m_Camera, "m_ZoomSpeed", 0.00001, 1.0).name("Zoom Speed");
        this.m_Controls.add(this.m_Camera, "mRotationSteps", 0.001, 1.0).name("RotationSteps");
        this.m_Controls.add(this.m_Camera, "mResetButton").name("Reset");
        //this.m_Controls.add(this.m_Camera, "mPanMouseButton", { MMB: 1 }).name("Pan");
        this.m_Controls.add(this.m_Camera, "mZoom", { ScrollWheel: "ScrollWheel" }).name("Zoom");
        this.m_Controls.add(this.m_Camera, "mRotateMouseButton", { LMB: 0, MMB: 1, RMB: 2 }).name("Rotate");
        this.m_Controls.open();
        console.log("Created GUI");
    }

    RemoveGUI() {
        //this.m_Gui.destroy();
        //this.m_Controls.destroy();
    }
}