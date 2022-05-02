const keys = {
    isEnable: true,
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft : {
        pressed: false
    },
    ArrowRight : {
        pressed: false
    },
}

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackbox.position.x + rectangle1.attackbox.width >= rectangle2.position.x &&
        rectangle1.attackbox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackbox.position.y + rectangle1.attackbox.height >= rectangle2.position.y &&
        rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({ player, enemy, timerId })
{
    keys.isEnable = false
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if(player.health === enemy.health)
    {
        document.querySelector('#displayText span').innerHTML = 'tie'
    } else if(player.health > enemy.health)
    {
        document.querySelector('#displayText span').innerHTML = 'adventurer won'
    } else if(player.health < enemy.health)
    {
        document.querySelector('#displayText span').innerHTML = 'cat won'
    }
}

let timer = 60
let timerId
function decreaseTimer() {
    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if(timer === 0)
    {
        determineWinner({player, enemy, timerId})
    }
}