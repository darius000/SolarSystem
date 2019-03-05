
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
    }

    Init()
    {
        this.m_Renderer.setSize(window.innerWidth, window.innerHeight);

        this.m_Renderer.shadowMap.enabled = true;
        this.m_Renderer.shadowMap.type = THREE.BasicShadowMap;

        document.body.appendChild(this.m_Renderer.domElement);

        this.AddEvents();
    }

    Render()
    {
        if(this.m_CurrentScene != null)
        {
            this.m_CurrentScene.OnUpdate(this.GetDeltaTime());

            this.m_Renderer.render(this.m_CurrentScene, this.m_CurrentScene.m_Camera);

            requestAnimationFrame(this.Render.bind(this));
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
    }
}