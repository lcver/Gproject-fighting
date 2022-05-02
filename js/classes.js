/** Drawing sprite blueprint */
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0} }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if(this.framesElapsed % this.framesHold === 0)
        {
            if(this.framesCurrent < this.framesMax - 1)
            {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {

    constructor({ 
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackbox = { offset: {}, width: undefined, height: undefined }
    }) {

        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackbox.offset,
            width: attackbox.width,
            height: attackbox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.isJump
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 50
        this.sprites = sprites

        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image()
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
        }
    }

    // draw() {
    //     c.fillStyle = this.color
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //     // attack box
    //     if(this.isAttacking)
    //     {
    //         c.fillStyle = 'green'
    //         c.fillRect(
    //             this.attackbox.position.x,
    //             this.attackbox.position.y,
    //             this.attackbox.width,
    //             this.attackbox.height
    //         )
    //     }
    // }

    update() {
        this.draw()
        this.animateFrames(0)

        this.attackbox.position.x = this.position.x + this.attackbox.offset.x
        this.attackbox.position.y = this.position.y

        c.fillStyle = 'transparent'
        c.fillRect(
            this.attackbox.position.x,
            this.attackbox.position.y,
            this.attackbox.width,
            this.attackbox.height
        )

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // grafity function
        let isBottom = this.position.y + this.height + this.velocity.y >= canvas.height - 96
        if(isBottom)
        {
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity

        // set once jump
        if (this.isJump && isBottom)
        {
            this.velocity.y = -15
        }
    }

    attack() {
        this.isAttacking = true
        this.switchSprite('attack')

        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }

    jump() {
        this.isJump = true

        setTimeout(() => {
            this.isJump = false
        }, 100);
    }

    switchSprite(sprite) {
        if(
            this.image === this.sprites.attack.image &&
            this.framesCurrent < this.sprites.attack.framesMax -1
        ) return

        switch (sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image)
                {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                    this.framesHold = this.sprites.idle.framesHold
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image)
                {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                    this.framesHold = this.sprites.run.framesHold
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image)
                {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                    this.framesHold = this.sprites.jump.framesHold
                }
                break;
            case 'attack':
                if(this.image !== this.sprites.attack.image)
                {
                    this.image = this.sprites.attack.image
                    this.framesMax = this.sprites.attack.framesMax
                    this.framesCurrent = 0
                    this.framesHold = this.sprites.attack.framesHold
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image)
                {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                    this.framesHold = this.sprites.fall.framesHold
                }
                break;
        }
    }

}