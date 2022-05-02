console.log('index js')

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
})
const shop = new Sprite({
    position: {
        x: 620,
        y: 127
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity : {
        x: 0,
        y: 0
    },
    attackbox: {
        width: 100,
        height: 150,
        offset: {
            x: 23,
            y: 0
        },
    },
    imageSrc: './assets/adventurer/idle.png',
    framesMax: 8,
    scale: 4,
    offset: {
        x: 50,
        y: -5
    },
    sprites: {
        idle: {
            imageSrc: './assets/adventurer/idle.png',
            framesMax: 4,
            framesHold: 10,
        },
        run: {
            imageSrc: './assets/adventurer/run.png',
            framesMax: 6,
            framesHold: 7,
        },
        jump: {
            imageSrc: './assets/adventurer/jump.png',
            framesMax: 2,
            framesHold: 10,
        },
        fall: {
            imageSrc: './assets/adventurer/fall.png',
            framesMax: 2,
            framesHold: 10,
        },
        attack: {
            imageSrc: './assets/adventurer/attack.png',
            framesMax: 5,
            framesHold: 5,
        },
        // die: {
        //     imageSrc: './assets/adventurer/die.png',
        //     framesMax: 7,
        //     framesHold: 10,
        // },
        // hurt: {
        //     imageSrc: './assets/adventurer/hurt.png',
        //     framesMax: 3,
        //     framesHold: 10,
        // },
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity : {
        x: 0,
        y: 0
    },
    attackbox: {
        width: 100,
        height: 150,
        offset: {
            x: -44,
            y: 0
        },
    },
    imageSrc: './assets/cat/idleX.png',
    framesMax: 8,
    scale: 0.7,
    offset: {
        x: 50,
        y: -5
    },
    flip: {
        x: -1,
        y: 1
    },
    sprites: {
        idle: {
            imageSrc: './assets/cat/idleX.png',
            framesMax: 2,
            framesHold: 100,
        },
        run: {
            imageSrc: './assets/cat/walkX.png',
            framesMax: 8,
            framesHold: 5,
        },
        jump: {
            imageSrc: './assets/cat/jumpX.png',
            framesMax: 4,
            framesHold: 10,
        },
        fall: {
            imageSrc: './assets/cat/fallX.png',
            framesMax: 2,
            framesHold: 10,
        },
        attack: {
            imageSrc: './assets/cat/attackX.png',
            framesMax: 4,
            framesHold: 5,
        },
        // die: {
        //     imageSrc: './assets/cat/die.png',
        //     framesMax: 7,
        //     framesHold: 10,
        // },
        // hurt: {
        //     imageSrc: './assets/cat/hurt.png',
        //     framesMax: 3,
        //     framesHold: 10,
        // },
    }
})

console.log(player)

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -3
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 3
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0)
    {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -3
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 3
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0)
    {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        console.log("player2 attacking")
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0)
    {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'd':
            if(keys.isEnable)
            {
                keys.d.pressed = true
                player.lastKey = 'd'
            }
            break;
        case 'a':
            if(keys.isEnable)
            {
                keys.a.pressed = true
                player.lastKey = 'a'
            }
            break;
        case 'w':
            if(keys.isEnable)
            {
                player.jump()
            }
            break;
        case 's':
            if(keys.isEnable)
            {
                player.attack()
            }
            break;
            
        case 'ArrowRight':
            if(keys.isEnable)
            {
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
            }
            break;
        case 'ArrowLeft':
            if(keys.isEnable)
            {
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
            }
            break;
        case 'ArrowUp':
            if(keys.isEnable)
            {
                enemy.jump()
            }
            break;
        case 'ArrowDown':
            if(keys.isEnable)
            {
                enemy.attack()
            }
            break;
        default:
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
    
        default:
            break;
    }

    // Enemy
    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    
        default:
            break;
    }
})