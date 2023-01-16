        precision mediump float;

        uniform vec2 u_resolution;
        uniform vec2 uv;
        uniform vec2 u_mouse;

        vec3 theSun(vec2 uv)
        {
            float sun =  distance(uv,u_mouse.xy /u_resolution.y );
            vec4 theSun = vec4(.042,0.048,0.1,0.7) / sun;
            
            return vec3(theSun);
        }
        
        void main()
        {            
                vec2 uv = gl_FragCoord.xy / u_resolution.y;
                vec3 sun = theSun(uv);
                gl_FragColor = vec4(sun,1.0);               
                
} 
        