const rectangularCollision = ({rectangle, rectangle2}) => {
    //console.log(rectangle);
    //console.log(rectangle2)
    return(
        rectangle.attackBox.position.x + rectangle.attackBox.width >= rectangle2.position.x &&
        rectangle.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle.attackBox.position.y + rectangle.attackBox.height >= rectangle2.position.y &&
        rectangle.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

const determineWinner = ({PLAYER, ENEMY, timerID}) => {
    clearTimeout(timerID);
    document.querySelector('#displayText').style.display = "flex";
    if(PLAYER.health === ENEMY.health){
        document.querySelector('#displayText').innerHTML = "Tie";
    } else if (PLAYER.health > ENEMY.health) {
        document.querySelector('#displayText').innerHTML = "Player 1 Wins";
    } else if (PLAYER.health < ENEMY.health) {
        document.querySelector('#displayText').innerHTML = "Player 2 Wins";
    }
}

let timer = 60;
let timerID;
const decreaseTimer = () => {
    if(timer>0) {
        timerID = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if(timer === 0){
        determineWinner({PLAYER, ENEMY, timerID});
    }
    
}