import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

// Scene
const scene = new THREE.Scene()

// Shape
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
    roughness: 0.5
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
console.log(mesh);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// light
const light = new THREE.PointLight(0xffffff, 1.25, 100)
light.position.set(0, 10, 10)
scene.add(light)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 3

// Resize
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight 
    // Update Camera
    camera.updateProjectionMatrix()
    camera.aspect = sizes.width / sizes.height
    renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()

// GSAP
const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"}) 
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

// Mouse Colors
let mouseDown = false
let rgb = []

window.addEventListener('mousedown', () => { mouseDown = true })
window.addEventListener('mouseup', () => { mouseDown = false })

const eyes = document.querySelector('.eyes')
const eyesss = document.querySelectorAll('.eyesss')

window.addEventListener('mousemove', (e) => {

    const mouseX = e.clientX
    const mouseY = e.clientY

    const rekt = eyes.getBoundingClientRect()

    const eyesX = rekt.left + rekt.width / 2;
    const eyesY = rekt.top + rekt.height / 2;

    const angleDeg = angle(mouseX, mouseY, eyesX, eyesY)

    console.log(angleDeg);

    eyesss.forEach(eye => {
        eye.style.transform = `rotate(${90 + angleDeg}deg)`
    })

    if(mouseDown) {
        rgb= [
            Math.round((mouseX / sizes.width)*255),
            Math.round((mouseY / sizes.height)*255),
            150
        ]
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
        gsap.to('.sphere', {color: `rgb(${rgb.join(",")})`})
        gsap.to('span', {color: `rgb(${rgb.join(",")})`})
    }
})

function angle(cx, cy, ex, ey) {
    const dx = ex - cx;  
    const dy = ey - cy;
    const rad = Math.atan2(dy, dx)
    const deg = rad * 180 / Math.PI
    return deg
}