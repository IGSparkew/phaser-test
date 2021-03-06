//Config phaser
var config = {
    type:Phaser.AUTO,
    width:800,
    height:600,
        physics:{
            default:'arcade',
            arcade : {
                gravity : {y : 300},
                debug:false
            }
        },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
};

var game = new Phaser.Game(config);
//Loading Graphics 
function preload(){
    //load image
    this.load.image('sky','res/sky.png');
    this.load.image('ground','res/platform.png');
    this.load.image('star','res/star.png');
    this.load.image('bomb','res/bomb.png');
    this.load.spritesheet('dude','res/dude.png',{frameWidth:32,frameHeight: 48});

   
}
//Add Some Score ! 
var score = 0;
var scoreText;

//init all thing in game 
function create(){
    //Background
    this.add.image(400,300,'sky');
    //Platforms:
    platforms = this.physics.add.staticGroup();
    platforms.create(400,568,'ground').setScale(2).refreshBody();
    platforms.create(600,400,'ground');
    platforms.create(50,250,'ground');
    platforms.create(750,220,'ground');

    //Player physics:
    player = this.physics.add.sprite(100,450,'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //animation of Player
    this.anims.create({
        key:'left',
        frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        frameRate:10,
        repeat:-1
    });

    this.anims.create({
        key:'turn',
        frames:[{key:'dude',frame:4}],
        frameRate:20
    });
    
    this.anims.create({
        key:'right',
        frames:this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        frameRate:10,
        repeat:-1
    });
    //Collision between player and platforms
    this.physics.add.collider(player,platforms);
    //create and initiamise 11 Star 
    stars = this.physics.add.group({
        key:'star',
        repeat:11,
        setXY:{x:12,y:0,stepX : 70}
    });
    //Create Star in World
    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
    });
    //Add physic between Star and platform
    this.physics.add.collider(stars,platforms);
    //Collect Star
    this.physics.add.overlap(player,stars,collectstar,null,this);

    
    //Draw Score
    scoreText = this.add.text(16,16,'score : 0' , {fontSize:'32px',fill:'#000'});

}
//function for collect Star 
function collectstar(player,star){
    star.disableBody(true,true);
    score+=10;
    scoreText.setText('Score: '+score);
}
//Update Game
function update()
{
    //init keyboard
    cursors = this.input.keyboard.createCursorKeys();
    //use for move Player
    if(cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left',true);

    }else if(cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right',true);

    }else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if(cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }


}