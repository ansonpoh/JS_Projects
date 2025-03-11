import { setupCactus, updateCactus, getCactusRects } from "./cactus.js"
import { setupDino, updateDino, getDinoRect, setDinoLose } from "./dino.js"
import { setupGround, updateGround } from "./ground.js" 

const worldWidth = 100
const worldHeight = 30
const speedScaleIncrease = 0.00001

const worldElement = document.querySelector("[data-world]")
const scoreElement = document.querySelector("[data-score]")
const startScreenElement = document.querySelector("[data-startScreen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, {once:true})


let lastTime
let speedScale
let score
function update(time) {
    if(lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    // The term delta is commonly used when communicating changes in speed, position, or acceleration of a physical or virtual object. Refers to the difference between two values or states.
    const delta = time - lastTime

    updateGround(delta, speedScale)
    updateDino(delta, speedScale)
    updateCactus(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    if(checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function handleStart() {
    speedScale = 1
    lastTime = null
    score = 0
    startScreenElement.classList.add("hide")
    setupGround()
    setupDino()
    setupCactus()
    window.requestAnimationFrame(update)
}

function updateSpeedScale(delta) {
    speedScale += delta * speedScaleIncrease
}

function updateScore(delta) {
    score += delta * 0.01
    scoreElement.textContent = Math.floor(score)
}

function checkLose() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    return (
      rect1.left < rect2.right &&
      rect1.top < rect2.bottom &&
      rect1.right > rect2.left &&
      rect1.bottom > rect2.top
    )
}

function handleLose() {
    setDinoLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, {once:true})
        startScreenElement.classList.remove("hide")
    } ,100)
}

function setPixelToWorldScale() {
    let worldToPixelScale 
    if(window.innerWidth / window.innerHeight < worldWidth / worldHeight) {
        //if window wider than world ratio, scale based on width as width is limiting factor
        worldToPixelScale = window.innerWidth / worldWidth
    } else {
        worldToPixelScale = window.innerHeight / worldHeight
    }

    worldElement.style.width = `${worldWidth * worldToPixelScale}px `
    worldElement.style.height = `${worldHeight * worldToPixelScale}px `
}