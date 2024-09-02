// Code Starts here 
var isRaceStarted = false;
var distance = 0;
var score = 0;
var gameInterval;
var blockerInterval;
var collisionInterval; 

const startButton = document.querySelector(".start-btn"); 
const gameTitle = document.querySelector(".game-title");
const speedText = document.querySelector(".speed");
const distanceText = document.querySelector(".distance");
const scoreText = document.querySelector(".score");
const road = document.querySelector(".road");


// Initial Logic 
function showCar() {
    const car = document.createElement('div');
    car.classList.add('player-car');
    road.children[1].appendChild(car);
}

showCar();

startButton.addEventListener("click", startRace)

function startRace() {
    if(!isRaceStarted){
        setTimeout(() => {
            distance = 0;
            startButton.style.display = 'none';
            gameTitle.style.color = 'azure'
            gameTitle.textContent = 'On Your Mark,';
            isRaceStarted = true;
            updateTitle();
            document.querySelectorAll('.road_blocker').forEach(blocker => blocker.remove());
        }, 1000);

        setTimeout(() => {
            gameInterval = setInterval(gameLoop,1500);
            blockerInterval = setInterval(roadBlocker,4500)
            collisionInterval = setInterval(detectCollision,100);
        },4000)
    }
}

function updateTitle() {
    const colours = ['red', 'yellow', 'green']
    const text = ['Get.', 'Set.', 'Go!'];
    let index = 0;

    const intervalID = setInterval(() => {
        gameTitle.textContent = text[index];
        gameTitle.style.color = colours[index];
        index++;

        if(index == colours.length) {
            clearInterval(intervalID);
            setTimeout(() => {
                gameTitle.textContent = "Get. Set. Go!"
                gameTitle.style.color = 'azure';
            }, 1000);
        }
    }, 1000);
}

// Game Logic 
function gameLoop() {
    updateUI();
    roadBlocker();
}

function updateUI() {
    distance += .1;
    distanceText.textContent = `Distance : ${distance.toFixed(1)} km`;
    scoreText.textContent = `Driving Points: ${score}`;
}

function roadBlocker() {
    const laneIndex = Math.floor(Math.random() * 3);
    const newBlocker = document.createElement('div');
    newBlocker.classList.add('road_blocker');
    road.children[laneIndex].appendChild(newBlocker);
    newBlocker.style.top = '-10%';

    newBlocker.addEventListener('animationend', () => {
        newBlocker.remove();
        score += 1; 
    });
}

// Game-play Logic 
const playerCar = document.querySelector(".player-car");

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", (e) => {
        if(isRaceStarted){
            let currentLeft = parseInt(window.getComputedStyle(playerCar).left) || 0;
            let roadWidth = road.offsetWidth;
            let laneWidth = roadWidth / 3; 
    
            switch(e.key) {
                case 'ArrowRight':
                    if (currentLeft < laneWidth) {  
                        playerCar.style.left = `${currentLeft + laneWidth}px`;
                    }
                    break;
                case 'ArrowLeft':
                    if (currentLeft > 0) { 
                        playerCar.style.left = `${currentLeft - laneWidth}px`;
                    }
                    break;
            }
        }
    })  
})

function detectCollision() {
    if (!isRaceStarted) return; 

    const playerCarRect = playerCar.getBoundingClientRect();
    const blockers = document.querySelectorAll('.road_blocker');

    blockers.forEach(blocker => {
        const blockerRect = blocker.getBoundingClientRect();

        const isCollision = !(playerCarRect.right < blockerRect.left || 
                              playerCarRect.left > blockerRect.right || 
                              playerCarRect.bottom < blockerRect.top || 
                              playerCarRect.top > blockerRect.bottom);

        if (isCollision) endgame();
    });
}

// End race and restart Logic
function endgame() {
    clearInterval(gameInterval);
    clearInterval(blockerInterval);
    clearInterval(collisionInterval); 

    updateUI();
    pauseBlockers();

    isRaceStarted = false;
    gameTitle.textContent = 'Game Over!'
    gameTitle.style.color = 'red'
    startButton.style.display = 'inline';
    
    resetGame();
}

function pauseBlockers() {
    document.querySelectorAll('.road_blocker').forEach(blocker => blocker.classList.add('paused'));
    document.querySelectorAll('.marking').forEach(blocker => blocker.classList.add('paused'));
}

function resetGame() {
    score = 0;
    distance = 0; 
    
    setTimeout(() => {
        document.querySelectorAll('.marking').forEach(blocker => blocker.classList.remove('paused'));
        updateUI();
    },10000)
}
