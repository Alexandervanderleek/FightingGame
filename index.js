const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 0.7;

const BACKGROUND = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './artelements/background.png'
})



const SHOP = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './artelements/shop.png',
    scale: 2.75,
    framesMax: 6
})

const PLAYER = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0
    },
    color : "blue",
    imageSrc: './artelements/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './artelements/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './artelements/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './artelements/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './artelements/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './artelements/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './artelements/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './artelements/samuraiMack/Death.png',
            framesMax: 6
        }

    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})


const ENEMY = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color : 'red',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './artelements/samuraiMack/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './artelements/samuraiMack/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './artelements/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './artelements/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './artelements/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './artelements/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './artelements/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './artelements/kenji/Death.png',
            framesMax: 7
        }
        

    },
    attackBox: {
        offset: {
            x: -165,
            y: 50
        },
        width: 165,
        height: 50
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}



decreaseTimer();

const animate = () => {
    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width, canvas.height);
    BACKGROUND.update();
    SHOP.update();
    c.fillStyle = "rgba(255, 255, 255, 0.15)"
    c.fillRect(0,0,canvas.width, canvas.height);
    PLAYER.update();
    ENEMY.update();
    window.requestAnimationFrame(animate);
    PLAYER.velocity.x = 0;
    
    if(keys.a.pressed && PLAYER.lastKey==="a"){
        PLAYER.velocity.x = -5;
        PLAYER.switchSprite('run');
    }else if (keys.d.pressed && PLAYER.lastKey === "d") {
        PLAYER.velocity.x = 5;
        PLAYER.switchSprite('run');
    } else {
        PLAYER.switchSprite('idle');
    }

    if(PLAYER.velocity.y < 0){
        PLAYER.switchSprite('jump');
    } else if ( PLAYER.velocity.y > 0 ) {
        PLAYER.switchSprite('fall');
    }

    
    ENEMY.velocity.x = 0;
    if(keys.ArrowLeft.pressed && ENEMY.lastKey==="ArrowLeft"){
        ENEMY.velocity.x = -5;
        ENEMY.switchSprite('run');
    }else if (keys.ArrowRight.pressed && ENEMY.lastKey === "ArrowRight") {
        ENEMY.velocity.x = 5;
        ENEMY.switchSprite('run');
    } else {
        ENEMY.switchSprite('idle');
    }


    if(ENEMY.velocity.y < 0){
        ENEMY.switchSprite('jump');
    } else if ( ENEMY.velocity.y > 0 ) {
        ENEMY.switchSprite('fall');
    }



    //detect collision

    if(rectangularCollision({
        rectangle:PLAYER, 
        rectangle2: ENEMY
    }) && PLAYER.isAttacking && PLAYER.frameCurrent === 4){
        ENEMY.takeHit()
        PLAYER.isAttacking = false;
        document.querySelector('#enemyHealth').style.width = ENEMY.health + '%';
    
    }

    if(PLAYER.isAttacking && PLAYER.frameCurrent === 4){
        PLAYER.isAttacking = false;
    }

    if(rectangularCollision({
        rectangle:ENEMY, 
        rectangle2: PLAYER
    }) && ENEMY.isAttacking && ENEMY.frameCurrent === 2){
        ENEMY.isAttacking = false;
        PLAYER.takeHit()
        document.querySelector('#playerHealth').style.width = PLAYER.health + '%';
    }

    if(ENEMY.isAttacking && ENEMY.frameCurrent === 2){
        ENEMY.isAttacking = false;
    }

    //end game based health

    if(ENEMY.health <= 0 || PLAYER.health <= 0){
        determineWinner({PLAYER, ENEMY, timerID});

    }

    
}

animate();

window.addEventListener('keydown', (e) => {
    if(!PLAYER.dead){
        switch(e.key){
            case 'd':
                keys.d.pressed = true;
                PLAYER.lastKey = "d";
                break;
            case 'a':
                keys.a.pressed = true;
                PLAYER.lastKey = "a";
                break;
            case 'w':
                PLAYER.velocity.y = -20;
                break;
            case ' ':
                PLAYER.attack();
                break;
            }
    }

    if(!ENEMY.dead){
        switch(e.key){
            case 'ArrowDown':
                ENEMY.attack();
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                ENEMY.lastKey = "ArrowRight";
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                ENEMY.lastKey = "ArrowLeft";
                break;
            case 'ArrowUp':
                ENEMY.velocity.y -= 20;
                break;
        }
    } 
})

window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
}})