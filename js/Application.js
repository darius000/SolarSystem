var Clock = new THREE.Clock(true);

class Application {
    m_Input = new Input();
    m_AspectRatio = window.innerWidth / window.innerHeight;

    constructor() {
        this.m_Scenes = [];
        this.m_Renderer = new THREE.WebGLRenderer({ antialias: true });
        this.m_CurrentScene = null;
        this.m_Composer = null;
        //this.smallView = new THREE.WebGLRenderer({ antialias: true });
    }

    Init() {
        this.m_Renderer.setPixelRatio(window.devicePixelRatio);
        this.m_Renderer.setSize(window.innerWidth, window.innerHeight);

        this.m_Renderer.shadowMap.enabled = true;
        this.m_Renderer.shadowMap.type = THREE.BasicShadowMap;
        //this.m_Renderer.autoClear = false;

        document.body.appendChild(this.m_Renderer.domElement);


        //this.smallView.setPixelRatio(window.devicePixelRatio);
        //this.smallView.setSize(600, 400);
        //this.smallView.shadowMap.enabled = true;
        //this.smallView.shadowMap.type = THREE.BasicShadowMap;
        //document.getElementById("SmallViewport").appendChild(this.smallView.domElement);

        this.m_Composer = new THREE.EffectComposer(this.m_Renderer);

        this.AddEvents();
    }

    Render() {
        requestAnimationFrame(this.Render.bind(this));

        if (this.m_CurrentScene != null) {
            this.m_CurrentScene.OnUpdate(this.GetDeltaTime(), this.GetTime());

            //this.smallView.render(this.m_CurrentScene, this.m_CurrentScene.m_TestCamera);

            this.m_Composer.render();

            //console.log(this.GetTime());
        }
    }

    AddEvents() {
        window.addEventListener('resize', this.OnWindowResize.bind(this), false);
    }

    AddScene(scene = new Scene) {
        this.m_Scenes.push(scene);

        if (this.m_CurrentScene == null) {
            this.SetCurrentScene(0);
        }

        //console.log(this.m_Scenes);
    }

    SetCurrentScene(index = 0) {
        if (index > -1 && index < this.m_Scenes.length) {
            if (this.m_CurrentScene != this.m_Scenes[index]) {
                if (this.m_CurrentScene) {
                    this.m_CurrentScene.OnEnd();
                    console.log("Ended Scene")
                }

                this.m_CurrentScene = this.m_Scenes[index];
                this.m_CurrentScene.OnStart();

                var renderScene = new THREE.RenderPass(this.m_CurrentScene, this.m_CurrentScene.m_Camera);

                var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
                bloomPass.threshold = 0;
                bloomPass.strength = 1.5;
                bloomPass.radius = 0;

                this.m_Composer.setSize(window.innerWidth, window.innerHeight);
                this.m_Composer.addPass(renderScene);
            }
        }
    }

    GetDeltaTime() {
        return Clock.getDelta();
    }

    GetTime() {
        return Clock.getElapsedTime();
    }

    Resize() {
        if (this) {
            this.OnWindowResize();
        }
    }

    OnWindowResize() {
        Application.m_AspectRatio = window.innerWidth / window.innerHeight;

        if (this.m_CurrentScene != null) {
            this.m_CurrentScene.m_Camera.aspect = Application.m_AspectRatio;
            this.m_CurrentScene.m_Camera.updateProjectionMatrix();
        }

        this.m_Renderer.setSize(window.innerWidth, window.innerHeight);
        this.m_Composer.setSize(window.innerWidth, window.innerHeight);
    }
}