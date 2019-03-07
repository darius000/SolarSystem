
var Clock = new THREE.Clock(true);

class Application
{
    static m_Input = new Input();
    static m_AspectRatio  = window.innerWidth / window.innerHeight;

    constructor()
    {
        this.m_Scenes       = [];
        this.m_Renderer     = new THREE.WebGLRenderer({ antialias: true });
        this.m_CurrentScene = null;
        this.m_Composer     =  new THREE.EffectComposer(this.m_Renderer);
        
    }

    Init()
    {
        this.m_Renderer.setPixelRatio( window.devicePixelRatio );
        this.m_Renderer.setSize(window.innerWidth, window.innerHeight);

        this.m_Renderer.shadowMap.enabled = true;
        this.m_Renderer.shadowMap.type = THREE.BasicShadowMap;
        this.m_Renderer.toneMapping = THREE.ReinhardToneMapping;
        this.m_Renderer.toneMappingExposure = Math.pow( 1.10, 4.0 );

        document.body.appendChild(this.m_Renderer.domElement);

        this.AddEvents();
    }

    Render()
    {
        requestAnimationFrame(this.Render.bind(this));

        if(this.m_CurrentScene != null)
        {
            this.m_CurrentScene.OnUpdate(this.GetDeltaTime());

            //this.m_Renderer.render(this.m_CurrentScene, this.m_CurrentScene.m_Camera);

            this.m_Composer.render();
        }
    }

    AddEvents()
    {
        window.addEventListener('resize', this.OnWindowResize.bind(this), false);
    }

    AddScene(scene = new Scene)
    {
        if(this.m_CurrentScene == null)
        {
            this.m_CurrentScene = scene;
            this.m_CurrentScene.OnStart();
 
            var renderScene = new THREE.RenderPass(this.m_CurrentScene, this.m_CurrentScene.m_Camera);

            var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ),1.5,0.4, 0.85);
            bloomPass.renderToScreen = true;
            bloomPass.threshold = 0;
			bloomPass.strength = 1.5;
			bloomPass.radius = 0;
            
            this.m_Composer.setSize(window.innerWidth, window.innerHeight);
            this.m_Composer.addPass(renderScene);
            this.m_Composer.addPass(bloomPass);

        }
    }

    SetCurrentScene(index = 0)
    {
        if(index > 0 && index < this.m_Scenes.length)
        {
            this.m_CurrentScene = m_Scenes[index];
            this.m_CurrentScene.OnStart();
        }     
    }

    GetDeltaTime()
    {
        return Clock.getDelta();
    }

    Resize()
    {
        if(this)
        {
            this.OnWindowResize();
        }
    }

    OnWindowResize() 
    {
        Application.m_AspectRatio = window.innerWidth / window.innerHeight;

        if(this.m_CurrentScene != null)
        {
            this.m_CurrentScene.m_Camera.aspect = Application.m_AspectRatio;
            this.m_CurrentScene.m_Camera.updateProjectionMatrix();
        }

        this.m_Renderer.setSize(window.innerWidth, window.innerHeight);
        this.m_Composer.setSize(window.innerWidth, window.innerHeight);
    }
}