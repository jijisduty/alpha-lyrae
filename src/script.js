import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { SphereGeometry } from 'three'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const partyText = textureLoader.load('/textures/particles/1.png')

/**
 * Galaxy
 */
 const createStars = () =>
 {
     /**
      * Geometry
      */
      const parameters = {}
      parameters.count = 1000000
      parameters.size = 0.009
      parameters.size2 = 0.009
      parameters.radius = 0.005
      parameters.insideColor = '#6978fb'
      parameters.outsideColor = '#f7b866'
      parameters.texture = partyText

      console.log(parameters.size)
  
      const starsGeometry = new THREE.CapsuleBufferGeometry(14, 0.1, 50, 50)
    // const ringGeometry = new THREE.RingGeometry(2, 3, 80)
      const vertices = new Float32Array(parameters.count *3)
      const colors = new Float32Array(parameters.count *3)
 
     const insideColor = new THREE.Color(parameters.insideColor)
     const outsideColor = new THREE.Color(parameters.outsideColor)
   
     for (let i=0; i< parameters.count *3; i++)
     {
         const i3 = i * 3

         const radius = Math.random() * parameters.radius
         vertices[i3] = (Math.random() -0.5) *10
         vertices[i3 +1] = (Math.random() -0.5) *40
         vertices[i3 +2] = (Math.random() -0.5) *10
         //console.log(vertices[i])

         const mixColor = insideColor.clone()
         mixColor.lerp(outsideColor, radius / parameters.radius)
         
 
         colors[i3] = mixColor.r
         colors[i3 +1] = mixColor.g
         colors[i3 +2] = mixColor.b
     }
 
     starsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
     starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

 
     /**
      * Material
      */
     const starsMaterial = new THREE.PointsMaterial( { 
         color: parameters.color,
         size: parameters.size,
         sizeAttenuation: true,
         transparent: true,
         depthTest: false,  //make object transparent
       //  depthWrite: false,
         //blending: THREE.AdditiveBlending,
         vertexColors: true,
         alphaMap: partyText
     } )

     const starsMaterial2 = new THREE.PointsMaterial( { 
       // color: parameters.color,
        size: parameters.size2,
        sizeAttenuation: true,
        transparent: true,
        depthTest: false,  //make object transparent
      //  depthWrite: false,
        //blending: THREE.AdditiveBlending,
        vertexColors: true,
        alphaMap: partyText
    } )


     const points = new THREE.Points(starsGeometry, starsMaterial)
     const points2 = new THREE.Points(starsGeometry, starsMaterial2)
     scene.add(points, points2)
 }
 createStars()


/**
 *  mesh
 */

const geometry = new SphereGeometry( 5, 10, 10)

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const mouseCoords = {
    x: window.innerWidth /2,
    y: window.innerHeight /2
}

let moved = false;

let downListener = () => {
        let mouseCoords = { 
            x:  window.event.clientX,
            y:   -(window.event.clientY - window.innerHeight)
        }
        material.uniforms.u_mouse.value = mouseCoords
        
        //console.log(mouseCoords)
        
    }
        
addEventListener('mousemove', (event) => {
    console.log(moved)
    if (moved) {
        downListener()
    }
   //else (console.log(moved))
}) 

addEventListener('mouseup', (event) => {
    moved = false;
    console.log(moved)
})

addEventListener('mousedown', (event) => {

    if (moved = true) {
        downListener()
    }
    else (console.log(moved))
 });
 
// Material
const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms:
    {
        u_time: { value: 0 },
        v_time: { value: 0 },
        u_resolution: { value: [sizes.width, sizes.height] },
        u_texture: { value: partyText },
        u_mouse: {value: [mouseCoords.x, mouseCoords.y]},
    }
    })

    console.log('umouse: ' + material.uniforms.u_mouse.value.y)
    console.log('ures: ' + material.uniforms.u_resolution.value)

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
})


// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()