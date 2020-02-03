var SnailBait = function () {
   this.canvas = document.getElementById('game-canvas'),
   this.context = this.canvas.getContext('2d'),
   this.fpsElement = document.getElementById('fps'),
   
   // Time..............................................................

   this.timeSystem = new TimeSystem(); // See js/timeSystem.js

   this.timeRate = 1.0; // 1.0 is normal speed, 0.5 is 1/2 speed, etc.

   this.SHORT_DELAY = 50; // milliseconds
   this.TIME_RATE_DURING_TRANSITIONS = 0.2; // percent

   // Constants.........................................................

   this.LEFT = 1,
   this.RIGHT = 2,

   this.SHORT_DELAY = 50; // milliseconds

   this.TRANSPARENT = 0,
   this.OPAQUE = 1.0,

   this.BACKGROUND_VELOCITY = 42,
   this.RUN_ANIMATION_RATE = 30,

   this.PLATFORM_HEIGHT = 8,  
   this.PLATFORM_STROKE_WIDTH = 2,
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',

   // Background width and height.........................................

   this.BACKGROUND_WIDTH = 1102;
   this.BACKGROUND_HEIGHT = 400;

   // Velocities........................................................

   this.BUTTON_PACE_VELOCITY = 80;
   this.SNAIL_PACE_VELOCITY = 50;

   // Loading screen....................................................

   this.loadingElement = document.getElementById('loading');
   this.loadingTitleElement = document.getElementById('loading-title');
   this.runnerAnimatedGIFElement = 
      document.getElementById('loading-animated-gif');

   // Track baselines...................................................

   this.TRACK_1_BASELINE = 323,
   this.TRACK_2_BASELINE = 223,
   this.TRACK_3_BASELINE = 123,
   
   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35,

   this.STARTING_BACKGROUND_VELOCITY = 0,

   this.STARTING_BACKGROUND_OFFSET = 0,
   this.STARTING_SPRITE_OFFSET = 0,

   // States............................................................

   this.paused = false;
   this.PAUSED_CHECK_INTERVAL = 200;
   this.windowHasFocus = true;
   this.countdownInProgress = false;
   this.gameStarted = false;

   // Images............................................................
   
   this.spritesheet = new Image(),

   // Time..............................................................
   
   this.lastAnimationFrameTime = 0,
   this.lastFpsUpdateTime = 0,
   this.fps = 60,

   // Fps...............................................................

   this.fpsElement = document.getElementById('fps'),

   // Toast.............................................................

   this.toastElement = document.getElementById('toast'),

   // Instructions......................................................

   this.instructionsElement = document.getElementById('instructions');

   // Copyright.........................................................

   this.copyrightElement = document.getElementById('copyright');

   // Score.............................................................

   this.scoreElement = document.getElementById('score'),

   // Sound and music...................................................

   this.soundAndMusicElement = document.getElementById('sound-and-music');

   // Runner track......................................................

   this.runnerTrack = this.STARTING_RUNNER_TRACK,
   
   // Translation offsets...............................................
   
   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET,
   this.spriteOffset = this.STARTING_SPRITE_OFFSET;
   
   //this.platformOffset = this.STARTING_PLATFORM_OFFSET,

   // Velocities........................................................

   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY,
   this.platformVelocity,

     // Sprite sheet cells................................................

   this.RUNNER_CELLS_WIDTH = 50; // pixels
   this.RUNNER_CELLS_HEIGHT = 54;

   this.BAT_CELLS_HEIGHT = 34; // Bat cell width varies; not constant 

   this.BEE_CELLS_HEIGHT = 50;
   this.BEE_CELLS_WIDTH  = 50;

   this.BUTTON_CELLS_HEIGHT  = 20;
   this.BUTTON_CELLS_WIDTH   = 31;

   this.COIN_CELLS_HEIGHT = 30;
   this.COIN_CELLS_WIDTH  = 30;
   
   this.EXPLOSION_CELLS_HEIGHT = 62;

   this.RUBY_CELLS_HEIGHT = 30;
   this.RUBY_CELLS_WIDTH = 35;

   this.SAPPHIRE_CELLS_HEIGHT = 30;
   this.SAPPHIRE_CELLS_WIDTH  = 35;

   this.SNAIL_BOMB_CELLS_HEIGHT = 20;
   this.SNAIL_BOMB_CELLS_WIDTH  = 20;

   this.SNAIL_CELLS_HEIGHT = 34;
   this.SNAIL_CELLS_WIDTH  = 64;

   this.batCells = [
      { left: 3,   top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 41,  top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 93,  top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 132, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ];

   this.batRedEyeCells = [
      { left: 185, top: 0, 
        width: 36, height: this.BAT_CELLS_HEIGHT },

      { left: 222, top: 0, 
        width: 46, height: this.BAT_CELLS_HEIGHT },

      { left: 273, top: 0, 
        width: 36, height: this.BAT_CELLS_HEIGHT },

      { left: 313, top: 0, 
        width: 46, height: this.BAT_CELLS_HEIGHT },
   ];
   
   this.beeCells = [
      { left: 5,   top: 234, width: this.BEE_CELLS_WIDTH,
                            height: this.BEE_CELLS_HEIGHT },

      { left: 75,  top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT },

      { left: 145, top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT }
   ];
   
   this.blueCoinCells = [
      { left: 5, top: 540, width: this.COIN_CELLS_WIDTH, 
                           height: this.COIN_CELLS_HEIGHT },

      { left: 5 + this.COIN_CELLS_WIDTH, top: 540,
        width: this.COIN_CELLS_WIDTH, 
        height: this.COIN_CELLS_HEIGHT }
   ];

   this.explosionCells = [
      { left: 3,   top: 48, 
        width: 52, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 63,  top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 146, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 233, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 308, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 392, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 473, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT }
   ];

   // Sprite sheet cells................................................

   this.blueButtonCells = [
      { left: 10,   top: 192, width: this.BUTTON_CELLS_WIDTH,
                            height: this.BUTTON_CELLS_HEIGHT },

      { left: 53,  top: 192, width: this.BUTTON_CELLS_WIDTH, 
                            height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.goldCoinCells = [
      { left: 65, top: 540, width: this.COIN_CELLS_WIDTH, 
                            height: this.COIN_CELLS_HEIGHT },
      { left: 96, top: 540, width: this.COIN_CELLS_WIDTH, 
                            height: this.COIN_CELLS_HEIGHT },
      { left: 128, top: 540, width: this.COIN_CELLS_WIDTH, 
                             height: this.COIN_CELLS_HEIGHT },
   ];

   this.goldButtonCells = [
      { left: 90,   top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT },

      { left: 132,  top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.sapphireCells = [
      { left: 3,   top: 138, width: this.RUBY_CELLS_WIDTH,
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 39,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 76,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 112, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 148, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT }
   ];

   this.runnerCellsRight = [
      { left: 414, top: 385, 
        width: 47, height: this.RUNNER_CELLS_HEIGHT },

      { left: 362, top: 385, 
         width: 44, height: this.RUNNER_CELLS_HEIGHT },

      { left: 314, top: 385, 
         width: 39, height: this.RUNNER_CELLS_HEIGHT },

      { left: 265, top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 205, top: 385, 
         width: 49, height: this.RUNNER_CELLS_HEIGHT },

      { left: 150, top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 96,  top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 45,  top: 385, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },

      { left: 0,   top: 385, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT }
   ],

   this.runnerCellsLeft = [
      { left: 0,   top: 305, 
         width: 47, height: this.RUNNER_CELLS_HEIGHT },

      { left: 55,  top: 305, 
         width: 44, height: this.RUNNER_CELLS_HEIGHT },

      { left: 107, top: 305, 
         width: 39, height: this.RUNNER_CELLS_HEIGHT },

      { left: 152, top: 305, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 208, top: 305, 
         width: 49, height: this.RUNNER_CELLS_HEIGHT },

      { left: 265, top: 305, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 320, top: 305, 
         width: 42, height: this.RUNNER_CELLS_HEIGHT },

      { left: 380, top: 305, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },

      { left: 425, top: 305, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },
   ],

   this.rubyCells = [
      { left: 185,   top: 138, width: this.SAPPHIRE_CELLS_WIDTH,
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 220,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 258,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 294, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 331, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT }
   ];

   this.snailBombCells = [
      { left: 40, top: 512, width: 30, height: 20 },
      { left: 2, top: 512, width: 30, height: 20 }
   ];

   this.snailCells = [
      { left: 142, top: 466, width: this.SNAIL_CELLS_WIDTH,
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 75,  top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 2,   top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },
   ]; 

   // Sprite data.......................................................

   this.batData = [
      { left: 85,  
         top: this.TRACK_2_BASELINE - 1.5*this.BAT_CELLS_HEIGHT },

      { left: 620,  
         top: this.TRACK_3_BASELINE },

      { left: 904,  
         top: this.TRACK_3_BASELINE - 3*this.BAT_CELLS_HEIGHT },

      { left: 1150, 
         top: this.TRACK_2_BASELINE - 3*this.BAT_CELLS_HEIGHT },

      { left: 1720, 
         top: this.TRACK_2_BASELINE - 2*this.BAT_CELLS_HEIGHT },

      { left: 1960, 
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT }, 

      { left: 2200, 
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },

      { left: 2380, 
         top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT },
   ];
   
   this.beeData = [
      { left: 200,  
         top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT*1.5 },
      { left: 350,  
         top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT*1.5 },
      { left: 550,  
         top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 750,  
         top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT*1.5 },

      { left: 924,  
         top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT*1.75 },

      { left: 1500, top: 225 },
      { left: 1600, top: 115 },
      { left: 2225, top: 125 },
      { left: 2295, top: 275 },
      { left: 2450, top: 275 },
   ];
   
   this.buttonData = [
      { platformIndex: 2 },
      { platformIndex: 12 },
   ];

   this.coinData = [
      { left: 270,  
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 489,  
         top: this.TRACK_3_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 620,  
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 833,  
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1050, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1450, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1670, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1870, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1930, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2200, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2320, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2360, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
   ];  

   // Platforms.........................................................

   this.platformData = [
      // Screen 1.......................................................
      {
         left:      10,
         width:     230,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     1,
         pulsate:   true
      },

      {  left:      250,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   true
      },

      {  left:      400,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   true
      },

      {  left:      633,
         width:     300,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   true
      },

      // Screen 2.......................................................
               
      {  left:      810,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1025,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 3.......................................................
               
      {  left:      1625,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,80)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      2100,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },


      // Screen 4.......................................................

      {  left:      2269,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2500,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
         snail:     true
      },
   ];

   this.sapphireData = [
      { left: 70,  
         top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 880,  
         top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 1100, 
         top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT }, 

      { left: 1475, 
         top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 2400, 
         top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
   ];

   this.rubyData = [
      { left: 690,  
         top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 1700, 
         top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 2056, 
         top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },
   ];

   this.smokingHoleData = [
      { left: 248,  top: this.TRACK_2_BASELINE - 22 },
      { left: 688,  top: this.TRACK_3_BASELINE + 5 },
      { left: 1352,  top: this.TRACK_2_BASELINE - 18 },
   ];
   
   this.snailData = [
      { platformIndex: 3 },
   ];

   // Sprites...........................................................
  
   this.bats         = [];
   this.bees         = []; 
   this.buttons      = [];
   this.coins        = [];
   this.platforms    = [];
   this.rubies       = [];
   this.sapphires    = [];
   this.snails       = [];

   this.sprites = []; // For convenience, contains all of the sprites  
                      // from the preceding arrays

   // Sprite artists....................................................

   this.platformArtist = {
      draw: function (sprite, context) {
         var PLATFORM_STROKE_WIDTH = 1.0,
             PLATFORM_STROKE_STYLE = 'black',
             top;
         
         top = snailBait.calculatePlatformTop(sprite.track);

         context.lineWidth = PLATFORM_STROKE_WIDTH;
         context.strokeStyle = PLATFORM_STROKE_STYLE;
         context.fillStyle = sprite.fillStyle;

         context.strokeRect(sprite.left, top, 
                            sprite.width, sprite.height);

         context.fillRect  (sprite.left, top, 
                            sprite.width, sprite.height);
      }
   };

   // ------------------------Sprite behaviors-------------------------

   // Pacing on platforms...............................................

   this.runBehavior = {
      lastAdvanceTime: 0,
      
      execute: function (sprite, 
                         now, 
                         fps, 
                         context, 
                         lastAnimationFrameTime) {
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {  // skip first time
            this.lastAdvanceTime = now;
         }
         else if (now - this.lastAdvanceTime > 
                  1000 / sprite.runAnimationRate) {
            sprite.artist.advance();
            this.lastAdvanceTime = now;
         }
      }      
   };

   // Pacing on platforms...............................................

   this.paceBehavior = {
      setDirection: function (sprite) {
         var sRight = sprite.left + sprite.width,
             pRight = sprite.platform.left + sprite.platform.width;

         if (sprite.direction === undefined) {
            sprite.direction = snailBait.RIGHT;
         }

         if (sRight > pRight && sprite.direction === snailBait.RIGHT) {
            sprite.direction = snailBait.LEFT;
         }
         else if (sprite.left < sprite.platform.left &&
                  sprite.direction === snailBait.LEFT) {
            sprite.direction = snailBait.RIGHT;
         }
      },

      setPosition: function (sprite, now, lastAnimationFrameTime) {
         var pixelsToMove = sprite.velocityX * 
                            (now - lastAnimationFrameTime) / 1000;

         if (sprite.direction === snailBait.RIGHT) {
            sprite.left += pixelsToMove;
         }
         else {
            sprite.left -= pixelsToMove;
         }
      },

      execute: function (sprite, now, fps, context, 
                         lastAnimationFrameTime) {
         this.setDirection(sprite);
         this.setPosition(sprite, now, lastAnimationFrameTime);
      }
   };

   // Snail shoot behavior..............................................

   this.snailShootBehavior = { // sprite is the snail
      execute: function (sprite, now, fps, context, 
                         lastAnimationFrameTime) {
         var bomb = sprite.bomb,
                    MOUTH_OPEN_CELL = 2;

         if ( ! snailBait.isSpriteInView(sprite)) {
            return;
         }

         if ( ! bomb.visible && 
              sprite.artist.cellIndex === MOUTH_OPEN_CELL) {
            bomb.left = sprite.left;
            bomb.visible = true;
         }
      }
   };

   // Move the snail bomb...............................................

   this.snailBombMoveBehavior = {
      execute: function (sprite, now, fps, context, 
                         lastAnimationFrameTime) {
         var SNAIL_BOMB_VELOCITY = 550;
     
         if ( sprite.left + sprite.width > sprite.hOffset &&
              sprite.left + sprite.width < sprite.hOffset + sprite.width) {
            sprite.visible = false;
         }
         else {
            sprite.left -= SNAIL_BOMB_VELOCITY * 
                           ((now - lastAnimationFrameTime) / 1000);

         }
      }
   };

   this.jumpBehavior = {
      pause: function (sprite, now) {
         if (sprite.ascendTimer.isRunning()) {
            sprite.ascendTimer.pause(now);
         }
         else if (sprite.descendTimer.isRunning()) {
            sprite.descendTimer.pause(now);
         }
      },

      unpause: function (sprite, now) {
         if (sprite.ascendTimer.isRunning()) {
            sprite.ascendTimer.unpause(now);
         }         
         else if (sprite.descendTimer.isRunning()) {
            sprite.descendTimer.unpause(now);
         }
      },

      isAscending: function (sprite) {
         return sprite.ascendTimer.isRunning();
      },

      ascend: function (sprite, now) {
         var elapsed = sprite.ascendTimer.getElapsedTime(now),
             deltaY  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.verticalLaunchPosition - deltaY; // Moving up
      },

      isDoneAscending: function (sprite, now) {
         return sprite.ascendTimer.getElapsedTime(now) > 
                sprite.JUMP_DURATION/2;
      },

      finishAscent: function (sprite, now) {
         sprite.jumpApex = sprite.top;
         sprite.ascendTimer.stop(now);
         sprite.descendTimer.start(now);
      },

      isDescending: function (sprite) {
         return sprite.descendTimer.isRunning();
      },

      descend: function (sprite, now) {
         var elapsed = sprite.descendTimer.getElapsedTime(now),
             deltaY  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.jumpApex + deltaY; // Moving down
      },

      isDoneDescending: function (sprite, now) {
         return sprite.descendTimer.getElapsedTime(now) > 
                sprite.JUMP_DURATION/2;
      },

      finishDescent: function (sprite, now) {
         sprite.top = sprite.verticalLaunchPosition;
         sprite.stopJumping();
         sprite.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
      },

      execute: function (sprite, now, fps, context, 
                         lastAnimationFrameTime) {
         if ( ! sprite.jumping || sprite.track === 3) {
            return;
         }

         if (this.isAscending(sprite)) {
            if ( ! this.isDoneAscending(sprite, now)) this.ascend(sprite, now);
            else                                this.finishAscent(sprite, now);
         }
         else if (this.isDescending(sprite)) {
            if ( ! this.isDoneDescending(sprite, now)) this.descend(sprite, now);
            else                                 this.finishDescent(sprite, now);
         }
      }
   };
};

SnailBait.prototype = {
   createSprites: function () {
      this.createPlatformSprites(); 

      this.createBatSprites();
      this.createBeeSprites();
      this.createButtonSprites();
      this.createCoinSprites();
      this.createRunnerSprite(); 
      this.createRubySprites();
      this.createSapphireSprites();
      this.createSnailSprites();

      this.initializeSprites();

      // All sprites are also stored in a single array

      this.addSpritesToSpriteArray();
   },

   addSpritesToSpriteArray: function () {
      for (var i=0; i < this.platforms.length; ++i) {
         this.sprites.push(this.platforms[i]);
      }

      for (var i=0; i < this.bats.length; ++i) {
         this.sprites.push(this.bats[i]);
      }

      for (var i=0; i < this.bees.length; ++i) {
         this.sprites.push(this.bees[i]);
      }

      for (var i=0; i < this.buttons.length; ++i) {
         this.sprites.push(this.buttons[i]);
      }

      for (var i=0; i < this.coins.length; ++i) {
         this.sprites.push(this.coins[i]);
      }

      for (var i=0; i < this.rubies.length; ++i) {
         this.sprites.push(this.rubies[i]);
      }

      for (var i=0; i < this.sapphires.length; ++i) {
         this.sprites.push(this.sapphires[i]);
      }

      for (var i=0; i < this.snails.length; ++i) {
         this.sprites.push(this.snails[i]);
      }

      this.sprites.push(this.runner);
   },

   positionSprites: function (sprites, spriteData) {
      var sprite;

      for (var i = 0; i < sprites.length; ++i) {
         sprite = sprites[i];

         if (spriteData[i].platformIndex) { 
            this.putSpriteOnPlatform(sprite,
               this.platforms[spriteData[i].platformIndex]);
         }
         else {
            sprite.top  = spriteData[i].top;
            sprite.left = spriteData[i].left;
         }
      }
   },
  
   equipRunnerForJumping: function () {
      var INITIAL_TRACK = 1,
          RUNNER_JUMP_HEIGHT = 120,
          RUNNER_JUMP_DURATION = 1000;

      this.runner.JUMP_HEIGHT   = RUNNER_JUMP_HEIGHT;
      this.runner.JUMP_DURATION = RUNNER_JUMP_DURATION;

      this.runner.jumping = false;
      this.runner.track   = INITIAL_TRACK;

      this.runner.ascendTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseOutEasingFunction(1.1));
         
      this.runner.descendTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseInEasingFunction(1.1));

      this.runner.jump = function () {
         if (this.jumping) // 'this' is the runner
            return;

         this.jumping = true;
         this.runAnimationRate = 0; // Freeze the runner while jumping
         this.verticalLaunchPosition = this.top;
         this.ascendTimer.start(snailBait.timeSystem.calculateGameTime());
      };

      this.runner.stopJumping = function () {
         this.descendTimer.stop();
         this.jumping = false;
      };

   },

   equipRunner: function () {
      this.equipRunnerForJumping();
   },

   setTimeRate: function (rate) {
      this.timeRate = rate;

      this.timeSystem.setTransducer( function (now) {
         return now * snailBait.timeRate;
      });      
   },

   initializeSprites: function() {  
      this.positionSprites(this.bats,      this.batData);
      this.positionSprites(this.bees,      this.beeData);
      this.positionSprites(this.buttons,   this.buttonData);
      this.positionSprites(this.coins,     this.coinData);
      this.positionSprites(this.rubies,    this.rubyData);
      this.positionSprites(this.sapphires, this.sapphireData);
      this.positionSprites(this.snails,    this.snailData);

      this.armSnails();
      this.equipRunner();
   },

   createBatSprites: function () {
      var bat,
          BAT_FLAP_DURATION = 200,
          BAT_FLAP_INTERVAL = 50;

      for (var i = 0; i < this.batData.length; ++i) {
         bat = new Sprite('bat',
                          new SpriteSheetArtist(this.spritesheet, 
                                                this.batCells),

                            [ new CycleBehavior(BAT_FLAP_DURATION,
                                                BAT_FLAP_INTERVAL) ]);

         // bat cell width varies; batCells[1] is widest

         bat.width = this.batCells[1].width; 
         bat.height = this.BAT_CELLS_HEIGHT;

         this.bats.push(bat);
      }
   },

   createBeeSprites: function () {
      var bee,
          beeArtist,
          BEE_FLAP_DURATION = 100,
          BEE_FLAP_INTERVAL = 30;

      for (var i = 0; i < this.beeData.length; ++i) {
         bee = new Sprite('bee',
                          new SpriteSheetArtist(this.spritesheet, 
                                                this.beeCells),

                            [ new CycleBehavior(BEE_FLAP_DURATION,
                                                BEE_FLAP_INTERVAL) ]);

         bee.width = this.BEE_CELLS_WIDTH;
         bee.height = this.BEE_CELLS_HEIGHT;

         this.bees.push(bee);
      }
   },
   
   createButtonSprites: function () {
      var button;

      for (var i = 0; i < this.buttonData.length; ++i) {
         if (i !== this.buttonData.length - 1) {
            button = new Sprite('button',
                        new SpriteSheetArtist(this.spritesheet,
                                              this.blueButtonCells));

            button.behaviors = [ this.paceBehavior ];
         }
         else {
            button = new Sprite('button',
                        new SpriteSheetArtist(this.spritesheet,
                                              this.goldButtonCells));
         }
        
         button.width = this.BUTTON_CELLS_WIDTH;
         button.height = this.BUTTON_CELLS_HEIGHT;
         button.velocityX = this.BUTTON_PACE_VELOCITY;

         this.buttons.push(button);
      }
   },
   
   createCoinSprites: function () {
      var BLUE_THROB_DURATION = 100,
          GOLD_THROB_DURATION = 500,
          BOUNCE_DURATION_BASE = 800, // milliseconds
          BOUNCE_HEIGHT_BASE = 50,   // pixels
          coin;
   
      for (var i = 0; i < this.coinData.length; ++i) {
         if (i % 2 === 0) {
            coin = new Sprite('coin',
               new SpriteSheetArtist(this.spritesheet,
                                     this.goldCoinCells),
          
               [ new BounceBehavior(BOUNCE_DURATION_BASE +
                                    BOUNCE_DURATION_BASE * Math.random(),

                                    BOUNCE_HEIGHT_BASE +
                                    BOUNCE_HEIGHT_BASE * Math.random()),

                 new CycleBehavior(GOLD_THROB_DURATION) 
               ]
            );
         }
         else {
            coin = new Sprite('coin',
               new SpriteSheetArtist(this.spritesheet,
                                     this.blueCoinCells),

               [ new BounceBehavior(BOUNCE_DURATION_BASE +
                                    BOUNCE_DURATION_BASE * Math.random(),

                                    BOUNCE_HEIGHT_BASE +
                                    BOUNCE_HEIGHT_BASE * Math.random()),


                new CycleBehavior(BLUE_THROB_DURATION) ]);
         }
         
         coin.width = this.COIN_CELLS_WIDTH;
         coin.height = this.COIN_CELLS_HEIGHT;
         coin.value = 50;

         this.coins.push(coin);
      }
   },
   
   createPlatformSprites: function () {
      var sprite, pd,  // Sprite, Platform data
          PULSE_DURATION = 800,
          PULSE_OPACITY_THRESHOLD = 0.1;

      for (var i=0; i < this.platformData.length; ++i) {
         pd = this.platformData[i];

         sprite = new Sprite('platform', this.platformArtist);

         sprite.left = pd.left;
         sprite.width = pd.width;
         sprite.height = pd.height;
         sprite.fillStyle = pd.fillStyle;
         sprite.opacity = pd.opacity;
         sprite.track = pd.track;
         sprite.button = pd.button;
         sprite.pulsate = pd.pulsate;

         sprite.top = this.calculatePlatformTop(pd.track);

         if (sprite.pulsate) {
            sprite.behaviors = 
               [ new PulseBehavior(PULSE_DURATION, 
                                   PULSE_OPACITY_THRESHOLD) ];
         }

         this.platforms.push(sprite);
      }
   },
   
   createRubySprites: function () {
      var SPARKLE_DURATION = 100,
          BOUNCE_DURATION_BASE = 1000, // milliseconds
          BOUNCE_HEIGHT_BASE = 100,   // pixels
          ruby,
          rubyArtist = new SpriteSheetArtist(this.spritesheet,
                                             this.rubyCells);
   
      for (var i = 0; i < this.rubyData.length; ++i) {
         ruby = new Sprite('ruby', 
                            rubyArtist,
                            [ new CycleBehavior(SPARKLE_DURATION),

                              new BounceBehavior(BOUNCE_DURATION_BASE +
                                    BOUNCE_DURATION_BASE * Math.random(),

                                    BOUNCE_HEIGHT_BASE +
                                    BOUNCE_HEIGHT_BASE * Math.random()) ]);

         ruby.width = this.RUBY_CELLS_WIDTH;
         ruby.height = this.RUBY_CELLS_HEIGHT;
         ruby.value = 200;
         
         this.rubies.push(ruby);
      }
   },

   createRunnerSprite: function () {
      var RUNNER_LEFT = 50,
          RUNNER_HEIGHT = 53,
          STARTING_RUNNER_TRACK = 1,
          STARTING_RUN_ANIMATION_RATE = 0;

       this.runner = new Sprite('runner',
                        new SpriteSheetArtist(this.spritesheet,
                                              this.runnerCellsRight),
                        [ this.runBehavior,
                          this.jumpBehavior ]); 

       this.runner.runAnimationRate = STARTING_RUN_ANIMATION_RATE;

       this.runner.track = STARTING_RUNNER_TRACK;
       this.runner.left = RUNNER_LEFT;
       this.runner.top = this.calculatePlatformTop(this.runner.track) -
                            RUNNER_HEIGHT;

       this.sprites.push(this.runner);
   },

   createSapphireSprites: function () {
      var SPARKLE_DURATION = 100,
          BOUNCE_DURATION_BASE = 3000, // milliseconds
          BOUNCE_HEIGHT_BASE = 100,          // pixels
          sapphire,
          sapphireArtist = new SpriteSheetArtist(this.spritesheet,
                                                 this.sapphireCells);
   
      for (var i = 0; i < this.sapphireData.length; ++i) {
         sapphire = new Sprite('sapphire', 
                               sapphireArtist,
                               [ new CycleBehavior(SPARKLE_DURATION),


                                 new BounceBehavior(BOUNCE_DURATION_BASE +
                                    BOUNCE_DURATION_BASE * Math.random(),

                                    BOUNCE_HEIGHT_BASE +
                                    BOUNCE_HEIGHT_BASE * Math.random()) ]);

         sapphire.width = this.SAPPHIRE_CELLS_WIDTH;
         sapphire.height = this.SAPPHIRE_CELLS_HEIGHT;
         sapphire.value = 100;

         this.sapphires.push(sapphire);
      }
   },

   createSnailSprites: function () {
      var snail,
          snailArtist = new SpriteSheetArtist(this.spritesheet, 
                                              this.snailCells);
   
      for (var i = 0; i < this.snailData.length; ++i) {
         snail = new Sprite('snail',
                            snailArtist,
                            [ this.paceBehavior,
                              this.snailShootBehavior,
                              new CycleBehavior(300,  // 300ms per image
                                                1500) // 1.5 seconds interlude 
                            ]);

         snail.width  = this.SNAIL_CELLS_WIDTH;
         snail.height = this.SNAIL_CELLS_HEIGHT;
         snail.velocityX = snailBait.SNAIL_PACE_VELOCITY;

         this.snails.push(snail);
      }
   },

   armSnails: function () {
      var snail,
          snailBombArtist = new SpriteSheetArtist(this.spritesheet,
                                                  this.snailBombCells);

      for (var i=0; i < this.snails.length; ++i) {
         snail = this.snails[i];
         snail.bomb = new Sprite('snail bomb',
                                  snailBombArtist,
                                  [ this.snailBombMoveBehavior ]);

         snail.bomb.width  = snailBait.SNAIL_BOMB_CELLS_WIDTH;
         snail.bomb.height = snailBait.SNAIL_BOMB_CELLS_HEIGHT;

         snail.bomb.top = snail.top + snail.bomb.height/2;
         snail.bomb.left = snail.left + snail.bomb.width/2;
         snail.bomb.visible = false;
  
         // Snail bombs maintain a reference to their snail

         snail.bomb.snail = snail;

         this.sprites.push(snail.bomb);
      }      
   },

   isSpriteInView: function(sprite) {
      return sprite.left + sprite.width > sprite.hOffset &&
             sprite.left < sprite.hOffset + this.canvas.width;
   },

   updateSprites: function (now) {
      var sprite;

      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.isSpriteInView(sprite)) {
            sprite.update(now, 
             this.fps, 
             this.context,
             this.lastAnimationFrameTime);
         }
      }
   },

   drawSprites: function() {
      var sprite;

      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.isSpriteInView(sprite)) {
            this.context.translate(-sprite.hOffset, 0);
            sprite.draw(this.context);
            this.context.translate(sprite.hOffset, 0);
         }
      }
   },

   draw: function (now) {
      this.setPlatformVelocity();
      this.setOffsets(now);

      this.drawBackground();
      this.updateSprites(now);
      this.drawSprites();
   },

   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * 
      this.PLATFORM_VELOCITY_MULTIPLIER; 
   },

   setOffsets: function (now) {
      this.setBackgroundOffset(now);
      this.setSpriteOffsets(now);
   },

   setBackgroundOffset: function (now) {
      this.backgroundOffset +=
      this.bgVelocity * (now - this.lastAnimationFrameTime) / 1000;

      if (this.backgroundOffset < 0 || 
        this.backgroundOffset > this.BACKGROUND_WIDTH) {
         this.backgroundOffset = 0;
      }
   },

   setSpriteOffsets: function (now) {
      var sprite;
   
      // In step with platforms
      this.spriteOffset +=
         this.platformVelocity * (now - this.lastAnimationFrameTime) / 1000;

      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if ('runner' !== sprite.type) {
            sprite.hOffset = this.spriteOffset; 
         }
      }
   },

   /*

   setPlatformOffset: function (now) {
      this.platformOffset += 
      this.platformVelocity * (now - this.lastAnimationFrameTime) / 1000;

      if (this.platformOffset > 2*this.BACKGROUND_WIDTH) {
         this.turnLeft();
      }
      else if (this.platformOffset < 0) {
         this.turnRight();
      }
   },

   */

   drawBackground: function () {
      var BACKGROUND_TOP_IN_SPRITESHEET = 590;

      // Translate everything by the background offset
      this.context.translate(-this.backgroundOffset, 0);

      // 2/3 onscreen initially:
      this.context.drawImage(
         this.spritesheet, 0, BACKGROUND_TOP_IN_SPRITESHEET, 
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT,
         0, 0,
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);

      // Initially offscreen:
      this.context.drawImage(
         this.spritesheet, 0, BACKGROUND_TOP_IN_SPRITESHEET, 
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT,
         this.BACKGROUND_WIDTH, 0,
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);

      // Translate back to the original location
      this.context.translate(this.backgroundOffset, 0);
   },

   drawPlatform: function (data) {
      var platformTop = this.calculatePlatformTop(data.track);

      this.context.lineWidth = this.PLATFORM_STROKE_WIDTH;
      this.context.strokeStyle = this.PLATFORM_STROKE_STYLE;
      this.context.fillStyle = data.fillStyle;
      this.context.globalAlpha = data.opacity;

      this.context.strokeRect(data.left, platformTop, data.width, data.height);
      this.context.fillRect  (data.left, platformTop, data.width, data.height);
   },

   drawPlatforms: function () {
      var index;

      this.context.translate(-this.platformOffset, 0);

      for (index = 0; index < this.platformData.length; ++index) {
         this.drawPlatform(this.platformData[index]);
      }

      this.context.translate(this.platformOffset, 0);
   },

   calculateFps: function (now) {
      var fps = 1 / (now - this.lastAnimationFrameTime) * 1000 * this.timeRate;

      if (now - this.lastFpsUpdateTime > 1000) {
         this.lastFpsUpdateTime = now;
         this.fpsElement.innerHTML = fps.toFixed(0) + ' fps';
      }
      return fps; 
   },

   putSpriteOnPlatform: function(sprite, platformSprite) {
      sprite.top  = platformSprite.top - sprite.height;
      sprite.left = platformSprite.left;
      sprite.platform = platformSprite;
   },

   calculatePlatformTop: function (track) {
      if      (track === 1) { return this.TRACK_1_BASELINE; } // 323 pixels
      else if (track === 2) { return this.TRACK_2_BASELINE; } // 223 pixels
      else if (track === 3) { return this.TRACK_3_BASELINE; } // 123 pixels
   },

   turnLeft: function () {
      this.bgVelocity = -this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runner.artist.cells = this.runnerCellsLeft;
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runner.artist.cells = this.runnerCellsRight;
   },

   fadeInElements: function () {
      var args = arguments;

      for (var i=0; i < args.length; ++i) {
         args[i].style.display = 'block';
      }

      setTimeout( function () {
         for (var i=0; i < args.length; ++i) {
            args[i].style.opacity = snailBait.OPAQUE;
         }
      }, this.SHORT_DELAY);
   },

   fadeOutElements: function () {
      var args = arguments,
          fadeDuration = args[args.length-1]; // Last argument

          for (var i=0; i < args.length-1; ++i) {
            args[i].style.opacity = this.TRANSPARENT;
         }

         setTimeout(function() {
            for (var i=0; i < args.length-1; ++i) {
               args[i].style.display = 'none';
            }
         }, fadeDuration);
      },

   hideToast: function () {
      var TOAST_TRANSITION_DURATION = 450;

      this.fadeOutElements(this.toastElement, 
         TOAST_TRANSITION_DURATION); 
   },

   startToastTransition: function (text, duration) {
      this.toastElement.innerHTML = text;
      this.fadeInElements(this.toastElement);
   },

   revealToast: function (text, duration) {
      var DEFAULT_TOAST_DURATION = 1000;

      duration = duration || DEFAULT_TOAST_DURATION;

      this.startToastTransition(text, duration);

      setTimeout( function (e) {
         snailBait.hideToast();
      }, duration);
   },

   // Animation.........................................................

   animate: function (now) { 
      // Replace the time passed to this method by the browser
      // with the time from Snail Bait's time system

      now = snailBait.timeSystem.calculateGameTime();

      if (snailBait.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(snailBait.animate);
         }, snailBait.PAUSED_CHECK_INTERVAL);
      }
      else {
         snailBait.fps = snailBait.calculateFps(now); 
         snailBait.draw(now);
         snailBait.lastAnimationFrameTime = now;
         requestNextAnimationFrame(snailBait.animate);
      }
   },

   togglePausedStateOfAllBehaviors: function (now) {
      var behavior;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         for (var j=0; j < sprite.behaviors.length; ++j) {
            behavior = sprite.behaviors[j];

            if (this.paused) {
               if (behavior.pause) {
                  behavior.pause(sprite, now);
               }
            }
            else {
               if (behavior.unpause) {
                  behavior.unpause(sprite, now);
               }
            }
         }
      }
   },

   togglePaused: function () {
      var now = this.timeSystem.calculateGameTime();

      this.paused = !this.paused;

      this.togglePausedStateOfAllBehaviors(now);

      if (this.paused) {
         this.pauseStartTime = now;
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }
   },

   // ------------------------- INITIALIZATION ----------------------------

   backgroundLoaded: function () {
      var LOADING_SCREEN_TRANSITION_DURATION = 2000;

      this.fadeOutElements(this.loadingElement, 
         LOADING_SCREEN_TRANSITION_DURATION);

      setTimeout ( function () {
         snailBait.startGame();
      }, LOADING_SCREEN_TRANSITION_DURATION);
   },

   loadingAnimationLoaded: function () {
      if (!this.gameStarted) {
         this.fadeInElements(this.runnerAnimatedGIFElement,
          this.loadingTitleElement);
      }
   },

   initializeImages: function () {
      this.spritesheet.src = '../images/spritesheet.png';
      this.runnerAnimatedGIFElement.src = '../images/snail.gif';

      this.spritesheet.onload = function (e) {
         snailBait.backgroundLoaded();
      };

      this.runnerAnimatedGIFElement.onload = function () {
         snailBait.loadingAnimationLoaded();
      };
   },

   dimControls: function () {
      FINAL_OPACITY = 0.5;

      snailBait.instructionsElement.style.opacity = FINAL_OPACITY;
      snailBait.soundAndMusicElement.style.opacity = FINAL_OPACITY;
   },

   revealCanvas: function () {
      this.fadeInElements(this.canvas);
   },

   revealTopChrome: function () {
      this.fadeInElements(this.fpsElement,
       this.scoreElement);
   },

   revealTopChromeDimmed: function () {
      var DIM = 0.25;

      this.scoreElement.style.display = 'block';
      this.fpsElement.style.display = 'block';

      setTimeout( function () {
         snailBait.scoreElement.style.opacity = DIM;
         snailBait.fpsElement.style.opacity = DIM;
      }, this.SHORT_DELAY);
   },

   revealBottomChrome: function () {
      this.fadeInElements(this.soundAndMusicElement,
       this.instructionsElement,
       this.copyrightElement);
   },

   revealGame: function () {
      var DIM_CONTROLS_DELAY = 5000;

      this.revealTopChromeDimmed();
      this.revealCanvas();
      this.revealBottomChrome();

      setTimeout( function () {
         snailBait.dimControls();
         snailBait.revealTopChrome();
      }, DIM_CONTROLS_DELAY);
   },   

   revealInitialToast: function () {
      var INITIAL_TOAST_DELAY = 1500,
      INITIAL_TOAST_DURATION = 3000;

      setTimeout( function () {
         snailBait.revealToast('Collide with coins and jewels. ' +
           'Avoid bats and bees.', 
           INITIAL_TOAST_DURATION);
      }, INITIAL_TOAST_DELAY);
   },

   startGame: function () {
      this.revealGame();
      this.revealInitialToast();

      this.timeSystem.start();
      this.setTimeRate(0.1);

      this.gameStarted = true;

      requestNextAnimationFrame(this.animate);
   }
};

// Event handlers.......................................................
window.onkeydown = function (e) {
   var key = e.keyCode;

   if (key === 68 || key === 37) { // 'd' or left arrow
      snailBait.turnLeft();
   }
   else if (key === 75 || key === 39) { // 'k' or right arrow
      snailBait.turnRight();
   }
   else if (key === 80) { // 'p'
      snailBait.togglePaused();
   }
   else if (key === 74) { // 'j'
      snailBait.runner.jump();
   }
};

window.onblur = function (e) {  // pause if unpaused
   snailBait.windowHasFocus = false;
   
   if ( ! snailBait.paused) {
      snailBait.togglePaused();
   }
};

window.onfocus = function (e) {  // unpause if paused
   var originalFont = snailBait.toastElement.style.fontSize,
       DIGIT_DISPLAY_DURATION = 1000; // milliseconds

       snailBait.windowHasFocus = true;
       snailBait.countdownInProgress = true;

       if (snailBait.paused) {
         snailBait.toastElement.style.font = '128px fantasy'; // Large font

      if (snailBait.windowHasFocus && snailBait.countdownInProgress)
         snailBait.revealToast('3', 500); // Display 3 for 0.5 seconds

      setTimeout(function (e) {
         if (snailBait.windowHasFocus && snailBait.countdownInProgress)
            snailBait.revealToast('2', 500); // Display 2 for 0.5 seconds

         setTimeout(function (e) {
            if (snailBait.windowHasFocus && snailBait.countdownInProgress)
               snailBait.revealToast('1', 500); // Display 1 for 0.5 seconds

            setTimeout(function (e) {
               if ( snailBait.windowHasFocus && snailBait.countdownInProgress)
                  snailBait.togglePaused();

               if ( snailBait.windowHasFocus && snailBait.countdownInProgress)
                  snailBait.toastElement.style.fontSize = originalFont;

               snailBait.countdownInProgress = false;

            }, DIGIT_DISPLAY_DURATION);

         }, DIGIT_DISPLAY_DURATION);

      }, DIGIT_DISPLAY_DURATION);
   }
};

// Launch game.........................................................

var snailBait = new SnailBait();

snailBait.initializeImages();
snailBait.createSprites();
