/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Game Programming, published by Prentice-Hall in 2014.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

var SnailBait = function () {
   // Game canvas and its context.......................................

   this.canvas = document.getElementById('snailbait-game-canvas');
   this.context = this.canvas.getContext('2d');
   this.fpsElement = document.getElementById('snailbait-fps');
   
   // Pixels and meters.................................................

   this.CANVAS_WIDTH_IN_METERS = 13;  // Proportional to sprite sizes

   this.PIXELS_PER_METER = this.canvas.width / 
                           this.CANVAS_WIDTH_IN_METERS;

   // Time..............................................................

   this.timeSystem = new TimeSystem(); // See js/timeSystem.js

   this.timeRate = 1.0; // 1.0 is normal speed, 0.5 is 1/2 speed, etc.
   this.SHORT_DELAY = 50; // milliseconds
   this.TIME_RATE_DURING_TRANSITIONS = 0.2; // 20%
   this.NORMAL_TIME_RATE = 1.0; // 100%
   this.MAX_TIME_RATE = 2.0; // 200%

   // Music.............................................................

   this.musicElement = document.getElementById('snailbait-music');
   this.musicElement.volume = 0.1;

   this.musicCheckboxElement = 
      document.getElementById('snailbait-music-checkbox');

   this.musicOn = this.musicCheckboxElement.checked;

   // Sound effects.....................................................

   this.soundCheckboxElement = 
      document.getElementById('snailbait-sound-checkbox');

   this.audioSprites = 
      document.getElementById('snailbait-audio-sprites');

   this.soundOn = this.soundCheckboxElement.checked;

   // Sounds............................................................
   this.cannonSound = {
      position: 7.7, // seconds
      duration: 1031, // milliseconds
      volume: 0.5
   };

   this.coinSound = {
      position: 7.1, // seconds
      duration: 588, // milliseconds
      volume: 0.5
   };

   this.electricityFlowingSound = {
      position: 1.03, // seconds
      duration: 1753, // milliseconds
      volume: 0.5
   };

   this.explosionSound = {
      position: 4.3, // seconds
      duration: 760, // milliseconds
      volume: 1.0
   };

   this.pianoSound = {
      position: 5.6, // seconds
      duration: 395, // milliseconds
      volume: 0.5
   };

   this.thudSound = {
      position: 3.1, // seconds
      duration: 809, // milliseconds
      volume: 1.0
   };

   this.audioChannels = [ // 4 channels (see createAudioChannels())
      { playing: false, audio: this.audioSprites, },
      { playing: false, audio: null, },
      { playing: false, audio: null, },
      { playing: false, audio: null  }
   ];

   this.audioSpriteCountdown = this.audioChannels.length - 1;
   this.graphicsReady = false;

   // Constants.........................................................

   this.LEFT = 1,
   this.RIGHT = 2,

   this.GRAVITY_FORCE = 9.81; // m/s/s

   this.SHORT_DELAY = 50; // milliseconds

   this.TRANSPARENT = 0,
   this.OPAQUE = 1.0,

   this.BACKGROUND_VELOCITY = 25,
   this.RUN_ANIMATION_RATE = 30,

   this.PLATFORM_HEIGHT = 8,  
   this.PLATFORM_STROKE_WIDTH = 2,
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',

   this.RUNNER_EXPLOSION_DURATION = 500,
   this.RUNNER_LEFT = 50,
   this.BAD_GUYS_EXPLOSION_DURATION = 1500,

   // Background width and height.......................................

   this.BACKGROUND_WIDTH = 1102;
   this.BACKGROUND_HEIGHT = 400;

   // Running slowly warning............................................

   this.FPS_SLOW_CHECK_INTERVAL = 2000; // Only check every 2 seconds
   this.DEFAULT_RUNNING_SLOWLY_THRESHOLD = 40; // fps
   this.MAX_RUNNING_SLOWLY_THRESHOLD = 60; // fps
   this.RUNNING_SLOWLY_FADE_DURATION = 2000; // seconds

   this.runningSlowlyElement = 
      document.getElementById('snailbait-running-slowly');

   this.slowlyOkayElement = 
      document.getElementById('snailbait-slowly-okay');

   this.slowlyDontShowElement = 
      document.getElementById('snailbait-slowly-dont-show');

   this.slowlyWarningElement = 
      document.getElementById('snailbait-slowly-warning');

   this.runningSlowlyThreshold = this.DEFAULT_RUNNING_SLOWLY_THRESHOLD;

   // Slow frame rate detection and warning.............................

   this.lastSlowWarningTime = 0;
   this.showSlowWarning = false;

   this.lastFpsCheckTime = 0;
   
   this.speedSamples = [60,60,60,60,60,60,60,60,60,60];
   this.speedSamplesIndex = 0;

   this.NUM_SPEED_SAMPLES = this.speedSamples.length;

   // Credits...........................................................

   this.creditsElement = 
      document.getElementById('snailbait-credits');

   this.playAgainLink = 
      document.getElementById('snailbait-play-again-link');

   // Velocities........................................................

   this.BUTTON_PACE_VELOCITY = 80;
   this.SNAIL_PACE_VELOCITY = 50;

   // Loading screen....................................................

   this.loadingElement = document.getElementById('snailbait-loading');

   this.loadingTitleElement = 
      document.getElementById('snailbait-loading-title');

   this.loadingAnimatedGIFElement = 
      document.getElementById('snailbait-loading-animated-gif');

   // Track baselines...................................................

   this.TRACK_1_BASELINE = 323;
   this.TRACK_2_BASELINE = 223;
   this.TRACK_3_BASELINE = 123;
   
   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35;

   this.STARTING_BACKGROUND_VELOCITY = 0;

   this.STARTING_BACKGROUND_OFFSET = 0;
   this.STARTING_SPRITE_OFFSET = 0;

   // States............................................................

   this.paused = false;
   this.PAUSED_CHECK_INTERVAL = 200;
   this.windowHasFocus = true;
   this.countdownInProgress = false;
   this.gameStarted = false;
   this.playing = false;
   this.stalled = false;

   // Images............................................................
   
   this.spritesheet = new Image();

   // Time..............................................................
   
   this.lastAnimationFrameTime = 0;
   this.lastFpsUpdateTime = 0;
   this.fps = 60;

   // Toast.............................................................

   this.toastElement = document.getElementById('snailbait-toast');
   this.originalFont = this.toastElement.style.font;

   // Instructions......................................................

   this.instructionsElement = 
      document.getElementById('snailbait-instructions');

   // Copyright.........................................................

   this.copyrightElement = 
      document.getElementById('snailbait-copyright');

   // Score.............................................................

   this.scoreElement = document.getElementById('snailbait-score');

   // Sound and music...................................................

   this.soundAndMusicElement = 
      document.getElementById('snailbait-sound-and-music');

   // Tweet score.......................................................

   this.tweetElement = document.getElementById('snailbait-tweet');

   TWEET_PREAMBLE = 'https://twitter.com/intent/tweet?text=' +
                    'I scored ';

   TWEET_EPILOGUE = ' playing this HTML5 Canvas platform game: ' +
                    'http://bit.ly/1oiASlY &hashtags=html5';

   // Translation offsets...............................................
   
   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET;
   this.spriteOffset = this.STARTING_SPRITE_OFFSET;
   
   //this.platformOffset = this.STARTING_PLATFORM_OFFSET,

   // Velocities........................................................

   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY,
   this.platformVelocity,

     // Sprite sheet cells................................................

   this.RUNNER_CELLS_WIDTH = 50; // pixels
   this.RUNNER_CELLS_HEIGHT = 52;

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
      { left: 132, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT }
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
                             height: this.COIN_CELLS_HEIGHT }
   ];

   this.goldButtonCells = [
      { left: 90,   top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT },

      { left: 132,  top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.sapphireCells = [
      { left: 3,   top: 138, width: this.SAPPHIRE_CELLS_WIDTH,
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 39,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 76,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 112, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 148, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT }
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
         width: 35, height: this.RUNNER_CELLS_HEIGHT }
   ],

   this.rubyCells = [
      { left: 185,   top: 138, width: this.RUBY_CELLS_WIDTH,
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 220,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 258,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 294, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 331, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT }
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
                             height: this.SNAIL_CELLS_HEIGHT }
   ]; 

   // Sprite data.......................................................

   this.batData = [
      { left: 95,  
         top: this.TRACK_2_BASELINE - 1.5*this.BAT_CELLS_HEIGHT },

      { left: 614,  
         top: this.TRACK_3_BASELINE },

      { left: 904,  
         top: this.TRACK_3_BASELINE - 3*this.BAT_CELLS_HEIGHT },

      { left: 1180, 
         top: this.TRACK_2_BASELINE - 2.5*this.BAT_CELLS_HEIGHT },

      { left: 1720, 
         top: this.TRACK_2_BASELINE - 2*this.BAT_CELLS_HEIGHT },

      { left: 1960, 
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT }, 

      { left: 2200, 
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },

      { left: 2380, 
         top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT }
   ];
   
   this.beeData = [
      { left: 225,  
         top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT*1.25 },
      { left: 355,  
         top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT*1.25 },
      { left: 520,  
         top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 780,  
         top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT*1.25 },

      { left: 924,  
         top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT*1.25 },

      { left: 1500, top: 225 },
      { left: 1600, top: 115 },
      { left: 2225, top: 125 },
      { left: 2195, top: 275 },
      { left: 2450, top: 275 }
   ];
   
   this.buttonData = [
      { platformIndex: 7 },
      { platformIndex: 12 }
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
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }
   ];  

   // Platforms.........................................................

   this.platformData = [
      // Screen 1.......................................................
      {
         left:      10,
         width:     210,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200, 200, 60)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      {  left:      240,
         width:     110,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(110,150,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      603,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(255,255,0)',
         opacity:   0.8,
         track:     1,
         pulsate:   false,
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

      {  left:      1005,
         width:     150,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     105,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 3.......................................................
               
      {  left:      1625,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'cornflowerblue',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     200,
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
         pulsate:   true
      },

      {  left:      2500,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         pulsate:   true
      }
   ];

   this.sapphireData = [
      { left: 155,  
         top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 880,  
         top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 1100, 
         top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT }, 

      { left: 1475, 
         top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 2400, 
         top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT }
   ];

   this.rubyData = [
      { left: 690,  
         top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 1700, 
         top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 2056, 
         top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT }
   ];

   this.snailData = [
      { platformIndex: 13 },
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

   this.sprites = []; // For convenience, contains all the sprites  
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

            snailBait.playSound(snailBait.cannonSound);
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

   // Runner explosions.................................................

   this.runnerExplodeBehavior = new CellSwitchBehavior(
      this.explosionCells,
      this.RUNNER_EXPLOSION_DURATION,

      function (sprite, now, fps, lastAnimationFrameTime) { // Trigger
         return sprite.exploding;
      },

      function (sprite, animator) { // Callback
         sprite.exploding = false;
      }
   );

   // Detonate buttons..................................................

   this.blueButtonDetonateBehavior = {
      execute: function(sprite, now, fps, context,
                        lastAnimationFrameTime) {
         var BUTTON_REBOUND_DELAY = 1000,
             SECOND_BEE_EXPLOSION_DELAY = 400; // milliseconds

         if ( ! sprite.detonating) { // trigger
            return;
         }

         sprite.artist.cellIndex = 1; // flatten the button

         snailBait.explode(snailBait.bees[5]);

         setTimeout( function () {
            snailBait.explode(snailBait.bees[6]);
         }, SECOND_BEE_EXPLOSION_DELAY);

         sprite.detonating = false; // reset trigger

         setTimeout( function () {
            sprite.artist.cellIndex = 0; // rebound
         }, BUTTON_REBOUND_DELAY);
      }
   };

   this.goldButtonDetonateBehavior = {
      execute: function(sprite, now, fps, lastAnimationFrameTime) {
         var BUTTON_REBOUND_DELAY = 1000;
      
         if ( ! sprite.detonating) { // trigger
            return;
         }

         sprite.artist.cellIndex = 1; // flatten the button

         snailBait.revealWinningAnimation();
         sprite.detonating = false;

         setTimeout( function () {
            sprite.artist.cellIndex = 0; // rebound
         }, BUTTON_REBOUND_DELAY);
      }
   };

   // Bad guy explosions................................................

   this.badGuyExplodeBehavior = new CellSwitchBehavior(
      this.explosionCells,
      this.BAD_GUYS_EXPLOSION_DURATION,

      function (sprite, now, fps) { // Trigger
         return sprite.exploding;
      },
                                                
      function (sprite, animator) { // Callback
         sprite.exploding = false;
      }
   );

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
             deltaY  = elapsed / (sprite.JUMP_DURATION/2) * 
                       sprite.JUMP_HEIGHT;

         sprite.top = sprite.verticalLaunchPosition - deltaY; // up
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
         sprite.stopJumping();

         if (snailBait.platformUnderneath(sprite)) {
            sprite.top = sprite.verticalLaunchPosition;
         }
         else {
            sprite.fall(snailBait.GRAVITY_FORCE *
               (sprite.descendTimer.getElapsedTime(now)/1000) *
               snailBait.PIXELS_PER_METER);
         }
      },

      execute: function (sprite, now, fps, context, 
                         lastAnimationFrameTime) {
         if ( ! sprite.jumping || sprite.falling) {
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

   // Runner's fall behavior............................................

   this.fallBehavior = {
      pause: function (sprite, now) {
         sprite.fallTimer.pause(now);
      },

      unpause: function (sprite, now) {
         sprite.fallTimer.unpause(now);
      },
      
      isOutOfPlay: function (sprite) {
         return sprite.top > snailBait.canvas.height;
      },

      setSpriteVelocity: function (sprite, now) {
         sprite.velocityY = 
            sprite.initialVelocityY + snailBait.GRAVITY_FORCE *
            (sprite.fallTimer.getElapsedTime(now)/1000) *
            snailBait.PIXELS_PER_METER;
      },

      calculateVerticalDrop: function (sprite, now, 
                                       lastAnimationFrameTime) {
         return sprite.velocityY * (now - lastAnimationFrameTime) / 1000;
      },

      willFallBelowCurrentTrack: function (sprite, dropDistance) {
         return sprite.top + sprite.height + dropDistance >
                snailBait.calculatePlatformTop(sprite.track);
      },

      fallOnPlatform: function (sprite) {
         sprite.stopFalling();
         snailBait.putSpriteOnTrack(sprite, sprite.track);
         snailBait.playSound(snailBait.thudSound);
      },

      moveDown: function (sprite, now, lastAnimationFrameTime) {
         var dropDistance;

         this.setSpriteVelocity(sprite, now);

         dropDistance = this.calculateVerticalDrop(
                           sprite, now, lastAnimationFrameTime);

         if ( ! this.willFallBelowCurrentTrack(sprite, dropDistance)) {
            sprite.top += dropDistance; 
         }
         else { // will fall below current track
            if (snailBait.platformUnderneath(sprite)) { // collision detection
               this.fallOnPlatform(sprite);
               sprite.stopFalling();
            }
            else {
               sprite.track--;
               sprite.top += dropDistance;
            }
         }
      },         

      execute: function (sprite, now, fps, context, 
                         lastAnimationFrameTime) {
         if (sprite.falling) {
            if (! this.isOutOfPlay(sprite) && !sprite.exploding) {
               this.moveDown(sprite, now, lastAnimationFrameTime);
            }
            else { // Out of play or exploding               
               sprite.stopFalling();

               if (this.isOutOfPlay(sprite)) {
                  snailBait.loseLife();
                  snailBait.playSound(snailBait.electricityFlowingSound);
                  snailBait.runner.visible = false;
               }
            }
         }
         else { // Not falling
            if ( ! sprite.jumping && 
                 ! snailBait.platformUnderneath(sprite)) {
               sprite.fall();
            }
         }
      }
   };

   this.collideBehavior = {
      isCandidateForCollision: function (sprite, otherSprite) {
         var s, o;

         if (! sprite.calculateCollisionRectangle ||
             ! otherSprite.calculateCollisionRectangle) {
            return false;
         }

         s = sprite.calculateCollisionRectangle(),
         o = otherSprite.calculateCollisionRectangle();
         
         return o.left < s.right &&
                sprite !== otherSprite &&
                sprite.visible && otherSprite.visible &&
                !sprite.exploding && !otherSprite.exploding;
      },

      didCollide: function (sprite, otherSprite, context) {
         var o = otherSprite.calculateCollisionRectangle(),
             r = sprite.calculateCollisionRectangle();

         if (otherSprite.type === 'snail bomb') {
            return this.didRunnerCollideWithSnailBomb(r, o, context);
         }
         else {
            return this.didRunnerCollideWithOtherSprite(r, o, context);
         }
      },
      
      didRunnerCollideWithSnailBomb: function (r, o, context) {
         // Determine if the center of the snail bomb lies
         // within the runner's bounding box.

         context.beginPath();
         context.rect(r.left + snailBait.spriteOffset, 
                      r.top, r.right - r.left, r.bottom - r.top);

         return context.isPointInPath(o.centerX, o.centerY);
      },

      didRunnerCollideWithOtherSprite: function (r, o, context) {
         // Determine if either of the runner's four corners or its
         // center lie within the other sprite's bounding box.

         context.beginPath();
         context.rect(o.left, o.top, o.right - o.left, o.bottom - o.top);

         return context.isPointInPath(r.left,  r.top)       ||
                context.isPointInPath(r.right, r.top)       ||

                context.isPointInPath(r.centerX, r.centerY) ||

                context.isPointInPath(r.left,  r.bottom)    ||
                context.isPointInPath(r.right, r.bottom);
      },
     
      processPlatformCollisionDuringJump: function (sprite, platform) {
         var isDescending = sprite.descendTimer.isRunning();

         sprite.stopJumping();

         if (isDescending) {
            snailBait.putSpriteOnTrack(sprite, platform.track);
         }
         else {
            sprite.fall();
            snailBait.playSound(snailBait.thudSound);
         }
      },

      processBadGuyCollision: function (sprite) {
         snailBait.runner.stopFalling();
         snailBait.runner.stopJumping();
         snailBait.explode(sprite);
         snailBait.shake();
         snailBait.loseLife();
         },

      processAssetCollision: function (sprite) {
         sprite.visible = false; // sprite is the asset

         if (sprite.type === 'coin') {
            snailBait.playSound(snailBait.coinSound);
         }
         else {
            snailBait.playSound(snailBait.pianoSound);
         }
      },

      processCollision: function (sprite, otherSprite) {
         if (sprite.jumping && 'platform' === otherSprite.type) {
            this.processPlatformCollisionDuringJump(
               sprite, otherSprite);
         }
         else if ('coin'  === otherSprite.type      || 
                  'sapphire' === otherSprite.type   ||
                  'ruby' === otherSprite.type) {
            this.processAssetCollision(otherSprite);
         }
         else if ('bat' === otherSprite.type        || 
             'bee' === otherSprite.type        ||
             'snail bomb' === otherSprite.type) {
            this.processBadGuyCollision(sprite);
         }
         else if ('button' === otherSprite.type) {
            if (sprite.jumping && sprite.descendTimer.isRunning() ||
                sprite.falling) {
               otherSprite.detonating = true;
            }
         }
      },

      execute: function (sprite, now, fps, context, 
                         lastAnimationFrameTime) {
         var otherSprite; // other than the runner

         if ( ! snailBait.playing) {
            return;
         }

         for (var i=0; i < snailBait.sprites.length; ++i) {
            otherSprite = snailBait.sprites[i];

            if (this.isCandidateForCollision(sprite, otherSprite)) {
               if (this.didCollide(sprite, otherSprite, context)) { 
                  this.processCollision(sprite, otherSprite);
               }
            }
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

      // All sprites are also stored in a single array

      this.addSpritesToSpriteArray();
      this.initializeSprites();
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
      var INITIAL_TRACK = 1;

      this.runner.JUMP_HEIGHT   = 120;  // pixels
      this.runner.JUMP_DURATION = 1000; // milliseconds

      this.runner.jumping = false;
      this.runner.track   = INITIAL_TRACK;

      this.runner.ascendTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseOutEasingFunction(1.15));
         
      this.runner.descendTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseInEasingFunction(1.15));

      this.runner.jump = function () {
         if (this.jumping) // 'this' is the runner
            return;

         this.jumping = true;

         this.runAnimationRate = 0; // Freeze the runner while jumping
         this.verticalLaunchPosition = this.top;
         this.ascendTimer.start(snailBait.timeSystem.calculateGameTime());
      };

      this.runner.stopJumping = function () {
         this.ascendTimer.stop(snailBait.timeSystem.calculateGameTime());
         this.descendTimer.stop(snailBait.timeSystem.calculateGameTime());
         this.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
         this.jumping = false;
      };
   },

   equipRunnerForFalling: function () {
      this.runner.fallTimer = new AnimationTimer();
      this.runner.falling   = false;

      this.runner.fall = function (initialVelocity) {
         this.falling = true;
         this.velocityY = initialVelocity || 0;
         this.initialVelocityY = initialVelocity || 0;
         this.fallTimer.start(
            snailBait.timeSystem.calculateGameTime());
      };

      this.runner.stopFalling = function () {
         this.falling = false;
         this.velocityY = 0;
         this.fallTimer.stop(
            snailBait.timeSystem.calculateGameTime());
      };
   },

   equipRunner: function () {
      this.equipRunnerForJumping();
      this.equipRunnerForFalling();
      this.runner.direction = snailBait.LEFT;
   },

   setTimeRate: function (rate) {
      this.timeRate = rate;

      this.timeSystem.setTransducer( function (percent) {
         return percent * snailBait.timeRate;
      });      
   },

   setSpriteValues: function() {  
      var sprite,
          COIN_VALUE = 100,
          SAPPHIRE_VALUE = 500,
          RUBY_VALUE = 1000;

      for (var i = 0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.type === 'coin') {
            sprite.value = COIN_VALUE;
         }
         else if (sprite.type === 'ruby') {
            sprite.value = RUBY_VALUE;
         }
         else if (sprite.type === 'sapphire') {
            sprite.value = SAPPHIRE_VALUE;
         }
      }
   },

   initializeSprites: function() {  
      this.positionSprites(this.bats,      this.batData);
      this.positionSprites(this.bees,      this.beeData);
      this.positionSprites(this.buttons,   this.buttonData);
      this.positionSprites(this.coins,     this.coinData);
      this.positionSprites(this.rubies,    this.rubyData);
      this.positionSprites(this.sapphires, this.sapphireData);
      this.positionSprites(this.snails,    this.snailData);

      this.setSpriteValues();

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

         bat.collisionMargin = {
            left: 6, top: 11, right: 4, bottom: 8,
         };

         this.bats.push(bat);
      }
   },

   createBeeSprites: function () {
      var bee,
          beeArtist,
          explodeBehavior,
          BEE_FLAP_DURATION = 100,
          BEE_FLAP_INTERVAL = 30;

      explodeBehavior = new CellSwitchBehavior(
         this.explosionCells,
         this.BAD_GUYS_EXPLOSION_DURATION,

         function (sprite, now, fps, lastAnimationFrameTime) { // Trigger
            return sprite.exploding;
         },
                                                
         function (sprite, animator) { // Callback
            sprite.exploding = false;
         }
      ); 

      for (var i = 0; i < this.beeData.length; ++i) {
         bee = new Sprite(
            'bee',

            new SpriteSheetArtist(this.spritesheet, 
                                  this.beeCells),

            [ new CycleBehavior(BEE_FLAP_DURATION, 
                                BEE_FLAP_INTERVAL),

              explodeBehavior // flyweight
            ]
         );

         bee.width = this.BEE_CELLS_WIDTH;
         bee.height = this.BEE_CELLS_HEIGHT;

         bee.collisionMargin = {
            left: 10, top: 10, right: 5, bottom: 10,
         };

         this.bees.push(bee);
      }
   },

   createButtonSprites: function () {
      var button;

      for (var i = 0; i < this.buttonData.length; ++i) {
         if (i !== this.buttonData.length - 1) {
            button = new Sprite('button',
                        new SpriteSheetArtist(this.spritesheet,
                                              this.blueButtonCells),
                        [ this.paceBehavior,
                          this.blueButtonDetonateBehavior ]);
         }
         else {
            button = new Sprite('button',
                        new SpriteSheetArtist(this.spritesheet,
                                              this.goldButtonCells),
                        [ this.paceBehavior,
                          this.goldButtonDetonateBehavior ]);
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

               [  new BounceBehavior(BOUNCE_DURATION_BASE +
                                    BOUNCE_DURATION_BASE * Math.random(),

                                    BOUNCE_HEIGHT_BASE +
                                    BOUNCE_HEIGHT_BASE * Math.random()),


                  new CycleBehavior(BLUE_THROB_DURATION) 
               ]);
         }
         
         coin.width = this.COIN_CELLS_WIDTH;
         coin.height = this.COIN_CELLS_HEIGHT;
         coin.value = 50;

         coin.collisionMargin = {
            left:   coin.width/8, top:    coin.height/8,
            right:  coin.width/8, bottom: coin.height/4
         };
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

         ruby.collisionMargin = {
            left: ruby.width/5,
            top: ruby.height/8,
            right: 0,
            bottom: ruby.height/4
         };
         
         this.rubies.push(ruby);
      }
   },
   
   createRunnerSprite: function () {
      var RUNNER_LEFT = 50,
          RUNNER_HEIGHT = 53,
          STARTING_RUNNER_TRACK = 1,
          STARTING_RUN_ANIMATION_RATE = this.RUN_ANIMATION_RATE;

       this.runner = new Sprite('runner',
                        new SpriteSheetArtist(this.spritesheet,
                                              this.runnerCellsRight),
                        [ this.runBehavior,
                          this.jumpBehavior,
                          this.collideBehavior,
                          this.runnerExplodeBehavior,
                          this.fallBehavior ]); 

       this.runner.runAnimationRate = STARTING_RUN_ANIMATION_RATE;

       this.runner.track = STARTING_RUNNER_TRACK;

       this.runner.left = RUNNER_LEFT;
       this.runner.width = this.RUNNER_CELLS_WIDTH;
       this.runner.height = this.RUNNER_CELLS_HEIGHT;

       this.putSpriteOnTrack(this.runner, STARTING_RUNNER_TRACK);
         
       this.runner.collisionMargin = {
          left: 15,
          top: 10, 
          right: 10,
          bottom: 10,
       };

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

         sapphire.collisionMargin = {
            left:   sapphire.width/8, top:    sapphire.height/8,
            right:  sapphire.width/8, bottom: sapphire.height/4
         }; 

         this.sapphires.push(sapphire);
      }
   },

   createSnailSprites: function () {
      var snail,
          snailArtist = new SpriteSheetArtist(this.spritesheet, 
                                              this.snailCells),
          SNAIL_CYCLE_DURATION = 300,
          SNAIL_CYCLE_INTERVAL = 1500;
   
      for (var i = 0; i < this.snailData.length; ++i) {
         snail = new Sprite('snail',
                            snailArtist,
                            [ this.paceBehavior,
                              this.snailShootBehavior,
                              new CycleBehavior(SNAIL_CYCLE_DURATION,
                                                SNAIL_CYCLE_INTERVAL)
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
         this.platformVelocity * 
         (now - this.lastAnimationFrameTime) / 1000;

      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if ('runner' !== sprite.type) {
            sprite.hOffset = this.spriteOffset; 
         }
      }
   },

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
      var fps = 1 / (now - this.lastAnimationFrameTime) * 1000 
                * this.timeRate;

      if (now - this.lastFpsUpdateTime > 1000) {
         this.lastFpsUpdateTime = now;
      }
      return fps; 
   },
   
   // Frame rate monitoring.............................................

   checkFps: function (now) {
      var averageSpeed;

      this.updateSpeedSamples(snailBait.fps);

      averageSpeed = this.calculateAverageSpeed();

      if (averageSpeed < 40) {
         this.fpsElement.style.color = 'red';
      }
      else {
         this.fpsElement.style.color = 'yellow';
      }

      this.fpsElement.innerHTML = this.fps.toFixed(0) + ' fps';

      if (averageSpeed < this.runningSlowlyThreshold) {
         this.revealRunningSlowlyWarning(now, averageSpeed);
      }
   },

   resetSpeedSamples: function () {
      snailBait.speedSamples = [60,60,60,60,60,60,60,60,60,60]; // reset
   },

   advanceSpeedSamplesIndex: function () {
      if (this.speedSamplesIndex !== this.NUM_SPEED_SAMPLES-1) {
         this.speedSamplesIndex++;
      }
      else {
         this.speedSamplesIndex = 0;
      }
   },

   updateSpeedSamples: function (fps) {
      this.speedSamples[this.speedSamplesIndex] = fps;
      this.advanceSpeedSamplesIndex();
   },

   calculateAverageSpeed: function () {
      var i,
          total = 0;

      for (i=0; i < this.NUM_SPEED_SAMPLES; i++) {
         total += this.speedSamples[i];
      }

      return total/this.NUM_SPEED_SAMPLES;
   },
   
   revealRunningSlowlyWarning: function (now, averageSpeed) {
      this.slowlyWarningElement.innerHTML =
         "Snail Bait is running at <i><b>"   +
         averageSpeed.toFixed(0) + "</i></b>"             +
         " frames/second (fps), but it needs more than " +
         this.runningSlowlyThreshold                     +
         " fps to work correctly."

      this.fadeInElements(this.runningSlowlyElement);
      this.lastSlowWarningTime = now;
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

   putSpriteOnTrack: function(sprite, track) {
      var SPACE_BETWEEN_SPRITE_AND_TRACK = 2;

      sprite.track = track;
      sprite.top = this.calculatePlatformTop(sprite.track) - 
                   sprite.height - SPACE_BETWEEN_SPRITE_AND_TRACK;
   },

   platformUnderneath: function (sprite, track) {
      var platform,
          platformUnderneath,
          sr = sprite.calculateCollisionRectangle(), // sprite rect
          pr; // platform rectangle

      if (track === undefined) {
         track = sprite.track; // Look on sprite track only
      }

      for (var i=0; i < snailBait.platforms.length; ++i) {
         platform = snailBait.platforms[i];
         pr = platform.calculateCollisionRectangle();

         if (track === platform.track) {
            if (sr.right > pr.left  && sr.left < pr.right) {
               platformUnderneath = platform;
               break;
            }
         }
      }
      return platformUnderneath;
   },

   turnLeft: function () {
      this.bgVelocity = -this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runner.artist.cells = this.runnerCellsLeft;
      this.runner.direction = snailBait.LEFT;
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runner.artist.cells = this.runnerCellsRight;
      this.runner.direction = snailBait.RIGHT;
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

   startToastTransition: function (text) {
      this.toastElement.innerHTML = text;
      this.fadeInElements(this.toastElement);
   },

   revealToast: function (text, duration) {
      var DEFAULT_TOAST_DURATION = 1000;

      duration = duration || DEFAULT_TOAST_DURATION;

      this.startToastTransition(text);

      setTimeout( function (e) {
         snailBait.hideToast();
      }, duration);
   },

   hideCredits: function () {
      var FADE_DURATION = 1000;

      this.fadeOutElements(this.creditsElement, FADE_DURATION);
   },

   revealCredits: function () {
      this.fadeInElements(this.creditsElement);
      this.tweetElement.href = TWEET_PREAMBLE + this.score +
                               TWEET_EPILOGUE;
   },

   updateRunningSlowlySlider: function () {
      this.runningSlowlySlider.knobPercent =
         this.runningSlowlyThreshold / this.MAX_RUNNING_SLOWLY_THRESHOLD;

      this.runningSlowlySlider.erase();
      this.runningSlowlySlider.draw(this.runningSlowlyThreshold /
                                 this.MAX_RUNNING_SLOWLY_THRESHOLD);
   },

   updateTimeRateSlider: function () {
      this.timeRateSlider.knobPercent =
         this.timeRate * this.MAX_TIME_RATE;

      this.timeRateSlider.erase();
      this.timeRateSlider.draw(this.timeRate / this.MAX_TIME_RATE);
   },

   // High scores.......................................................  
   
   revealHighScores: function () {
      this.highScoreNameElement.value = '';
      this.fadeInElements(snailBait.highScoreElement);
      this.highScoreNameElement.focus();
   },

   hideHighScores: function () {
      var HIGH_SCORE_TRANSITION_DURATION = 1000;

      snailBait.fadeOutElements(snailBait.highScoreElement,
                                HIGH_SCORE_TRANSITION_DURATION);
   },

   checkHighScores: function () {
      this.serverSocket.emit('get high score');
   },

   // Effects..........................................................

   explode: function (sprite) {
      if ( ! sprite.exploding) {
         if (sprite.runAnimationRate === 0) {
            sprite.runAnimationRate = this.RUN_ANIMATION_RATE;
         }

         sprite.exploding = true;
         this.playSound(this.explosionSound);
      }
   },

   shake: function () {
      var NUM_SHAKES = 12,
          SHAKE_INTERVAL = 80, // milliseconds
          velocity = snailBait.BACKGROUND_VELOCITY*1.5,
          originalVelocity = snailBait.bgVelocity,
          i = 0;

      reverseDirection = function () {
         snailBait.bgVelocity = i % 2 ? velocity : -velocity;

         if (i < NUM_SHAKES) {
            setTimeout(reverseDirection, SHAKE_INTERVAL);
            ++i;
         }
         else {
            snailBait.bgVelocity = originalVelocity;
         }
      };

      reverseDirection();      
   },

/*   
      // The non-recursive version is commented out

      this.bgVelocity = -v;

      setTimeout( function (e) {
       snailBait.bgVelocity = v;
       setTimeout( function (e) {
          snailBait.bgVelocity = -v;
          setTimeout( function (e) {
             snailBait.bgVelocity = v;
             setTimeout( function (e) {
                snailBait.bgVelocity = -v;
                setTimeout( function (e) {
                   snailBait.bgVelocity = v;
                   setTimeout( function (e) {
                      snailBait.bgVelocity = -v;
                      setTimeout( function (e) {
                         snailBait.bgVelocity = v;
                         setTimeout( function (e) {
                            snailBait.bgVelocity = -v;
                            setTimeout( function (e) {
                               snailBait.bgVelocity = v;
                               setTimeout( function (e) {
                                  snailBait.bgVelocity = -v;
                                  setTimeout( function (e) {
                                     snailBait.bgVelocity = v;
                                     setTimeout( function (e) {
                                        snailBait.bgVelocity = ov;
                                     }, SHAKE_INTERVAL);
                                  }, SHAKE_INTERVAL);
                               }, SHAKE_INTERVAL);
                            }, SHAKE_INTERVAL);
                         }, SHAKE_INTERVAL);
                      }, SHAKE_INTERVAL);
                   }, SHAKE_INTERVAL);
                }, SHAKE_INTERVAL);
             }, SHAKE_INTERVAL);
          }, SHAKE_INTERVAL);
       }, SHAKE_INTERVAL);
     }, SHAKE_INTERVAL);
*/

   revealWinningAnimation: function () {
      var WINNING_ANIMATION_FADE_TIME = 5000,
          SEMI_TRANSPARENT = 0.25;

      this.bgVelocity = 0;
      this.playing = false;
      this.loadingTitleElement.style.display = 'none';

      this.fadeInElements(this.loadingAnimatedGIFElement,
                          this.loadingElement);

      this.scoreElement.innerHTML = 'Winner!';
      this.canvas.style.opacity = SEMI_TRANSPARENT;

      setTimeout( function () {
         snailBait.loadingAnimatedGIFElement.style.display = 'none';
         snailBait.fadeInElements(snailBait.canvas);
         snailBait.gameOver();
      }, WINNING_ANIMATION_FADE_TIME);
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

         if (snailBait.windowHasFocus  && 
             snailBait.playing         && 
             snailBait.showSlowWarning &&
             now - snailBait.lastFpsCheckTime > 
             snailBait.FPS_SLOW_CHECK_INTERVAL) {

            snailBait.checkFps(now); 
            snailBait.lastFpsCheckTime = now;
         }

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
         this.revealToast('paused');
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }

      if (this.musicOn) {
         if (this.paused) {
            this.musicElement.pause(); 
         }
         else {
            this.musicElement.play();
         }
      }
   },

   // ------------------------- INITIALIZATION ----------------------------

   spritesheetLoaded: function () {
      var LOADING_SCREEN_TRANSITION_DURATION = 2000;

      this.graphicsReady = true;

      this.fadeOutElements(this.loadingElement, 
         LOADING_SCREEN_TRANSITION_DURATION);

      setTimeout ( function () {
         if (! snailBait.gameStarted) {
            snailBait.startGame();
         }
      }, LOADING_SCREEN_TRANSITION_DURATION);
   },

   loadingAnimationLoaded: function () {
      if (!this.gameStarted) {
         this.fadeInElements(this.loadingAnimatedGIFElement,
                             this.loadingTitleElement);
      }
   },

   initializeImages: function () {
      this.spritesheet.src = '../images/spritesheet.png';
      this.loadingAnimatedGIFElement.src = '../images/snail.gif';

      this.spritesheet.onload = function (e) {
         snailBait.spritesheetLoaded();
      };

      this.loadingAnimatedGIFElement.onload = function () {
         snailBait.loadingAnimationLoaded();
      };
   },

   // Sounds............................................................

   createAudioChannels: function () {
      var channel;

      for (var i=0; i < this.audioChannels.length; ++i) {
         channel = this.audioChannels[i];

         if (i !== 0) {
            channel.audio = document.createElement('audio');
            channel.audio.addEventListener('loadeddata',     // event
               //'progress',
                                           this.soundLoaded, // callback
                                           false);           // use capture

            channel.audio.src = this.audioSprites.currentSrc;
         }

         channel.audio.autobuffer = true;
      }
   },

   seekAudio: function (sound, audio) {
      try {
         audio.pause();
         audio.currentTime = sound.position;
      }
      catch (e) {
         if (console) {
            console.error('Cannot seek audio');
         }
      }
   },

   playAudio: function (audio, channel) {
      try {
         audio.play();
         channel.playing = true;
      }
      catch (e) {
         if (console) {
            console.error('Cannot play audio');
         }
      }
   },

   soundLoaded: function () {

      snailBait.audioSpriteCountdown--;

      if (snailBait.audioSpriteCountdown === 0) {
         if (!snailBait.gameStarted && snailBait.graphicsReady) {
            snailBait.startGame();
         }
      }
   },

   getFirstAvailableAudioChannel: function () {
      for (var i=0; i < this.audioChannels.length; ++i) {
         if (!this.audioChannels[i].playing) {
            return this.audioChannels[i];
         }
      }

      return null;
   },
               
   playSound: function (sound) {
      var channel,
          audio;

      if (this.soundOn) {
         channel = this.getFirstAvailableAudioChannel();

         if (!channel) {
            if (console) {
               console.warn('All audio channels are busy. ' +
                            'Cannot play sound');
            }
         }
         else { 
            audio = channel.audio;
            audio.volume = sound.volume;

            this.seekAudio(sound, audio);
            this.playAudio(audio, channel);

            setTimeout(function () {
               channel.playing = false;
               snailBait.seekAudio(sound, audio);
            }, sound.duration);
         }
      }
   },

   dimControls: function () {
      FINAL_OPACITY = 0.5;

      snailBait.instructionsElement.style.opacity = FINAL_OPACITY;
      snailBait.soundAndMusicElement.style.opacity = FINAL_OPACITY;
   },

   revealCanvas: function () {
      this.fadeInElements(this.canvas);
   },

   revealBottomChrome: function () {
      this.fadeInElements(this.soundAndMusicElement,
                          this.copyrightElement,
                          this.instructionsElement);
   },

   revealGame: function () {
      var DIM_CONTROLS_DELAY = 5000;

      this.revealCanvas();
      this.revealBottomChrome();

      setTimeout( function () {
         snailBait.dimControls();
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

   processRightTap: function () {
      if (snailBait.runner.direction === snailBait.LEFT ||
          snailBait.bgVelocity === 0) {
         snailBait.turnRight();
      }
      else {
         snailBait.runner.jump();
      }
   },

   processLeftTap: function () {
      if (snailBait.runner.direction === snailBait.RIGHT) {
         snailBait.turnLeft();
      }
      else {
         snailBait.runner.jump();
      }
   },

   pollMusic: function () {
      var POLL_INTERVAL = 500,     // Poll every 1/2 second
          SOUNDTRACK_LENGTH = 132, // seconds
          timerID;

      timerID = setInterval( function () {
         if (snailBait.musicElement.currentTime > SOUNDTRACK_LENGTH) {
            clearInterval(timerID);   // Stop polling
            snailBait.restartMusic(); // Restarts music and polling
         } 
      }, POLL_INTERVAL);
   },

   restartMusic: function () {
      snailBait.musicElement.pause();
      snailBait.musicElement.currentTime = 0;

      snailBait.startMusic(); // Calls pollMusic() after 1s delay
   },

   startMusic: function () {
      var MUSIC_DELAY = 1000;

      setTimeout( function () {
         if (snailBait.musicCheckboxElement.checked) {
            snailBait.musicElement.play();
         }

         snailBait.pollMusic();

      }, MUSIC_DELAY);
   },

   startGame: function () {
      this.revealGame();

      this.revealInitialToast();
      this.playing = true;

      this.startMusic();
      this.timeSystem.start();
      this.gameStarted = true;

      this.showSlowWarning = true;

      requestNextAnimationFrame(this.animate);
   },

   restartGame: function () {
      this.hideCredits();
      this.resetScore();
      this.resetLives();
      this.dimControls();

      this.restartLevel();
   },
  
   restartLevel: function () {
      this.resetOffsets();
      this.resetRunner();
      this.makeAllSpritesVisible();

      this.playing = true;
   },

   resetOffsets: function () {
      this.bgVelocity       = 0;
      this.backgroundOffset = 0;
      this.platformOffset   = 0;
      this.spriteOffset     = 0;
   },

   resetRunner: function () {
      this.runner.left      = snailBait.RUNNER_LEFT;
      this.runner.track     = 3;
      this.runner.hOffset   = 0;
      this.runner.visible   = true;
      this.runner.exploding = false;
      this.runner.jumping   = false;
      this.runner.falling   = false;
      this.runner.top       = this.calculatePlatformTop(3) -
                              this.runner.height;

      this.runner.artist.cells     = this.runnerCellsRight;
      this.runner.artist.cellIndex = 0;
   },

   makeAllSpritesVisible: function () {
      for (var i=0; i < this.sprites.length; ++i) {
         this.sprites[i].visible = true; 
      }
   },

   resetLives: function () {
      this.lives = this.MAX_NUMBER_OF_LIVES;
   },

   gameOver: function () {
      this.instructionsElement.style.opacity = 0.2; 
      this.soundAndMusicElement.style.opacity = 0.2;

      this.bgVelocity = this.BACKGROUND_VELOCITY / 20;
      this.playing = false;
   },
  
   startLifeTransition: function (delay) {
      var CANVAS_TRANSITION_OPACITY = 0.05,
          SLOW_MOTION_RATE = 0.1;

      if (delay === undefined) {
         delay = 0;
      }

      this.canvas.style.opacity = CANVAS_TRANSITION_OPACITY;
      this.playing = false;

      setTimeout( function () {
         snailBait.setTimeRate(SLOW_MOTION_RATE);
         snailBait.runner.visible = false;
      }, delay);
   },

   endLifeTransition: function () {
      var TIME_RESET_DELAY = 1000,
          RUN_DELAY = 500;

      this.canvas.style.opacity = this.OPAQUE;

      if (this.lives === 0) this.gameOver();
      else                  this.restartLevel();

      setTimeout( function () { // Reset the time
         snailBait.setTimeRate(1.0);

         setTimeout( function () { // Stop running
            snailBait.runner.runAnimationRate = 0;
         }, RUN_DELAY);
      }, TIME_RESET_DELAY);
   },

   loseLife: function () {
      var transitionDuration = 3000; // Same as canvas's transition time

      if (this.runner.exploding) {
         this.startLifeTransition(snailBait.RUNNER_EXPLOSION_DURATION);
         transitionDuration += snailBait.RUNNER_EXPLOSION_DURATION;
      }
      else {
         this.startLifeTransition();
      }

      setTimeout( function () { // After the canvas's transition
         snailBait.endLifeTransition();
      }, transitionDuration);
   },

   getViewportSize: function () {
      return { 
        width: Math.max(document.documentElement.clientWidth ||
               window.innerWidth || 0),  
               
        height: Math.max(document.documentElement.clientHeight ||
                window.innerHeight || 0)
      };
   },

   resizeElement: function (element, w, h) {
      element.style.width  = w + 'px';
      element.style.height = h + 'px';
   },
};

// Event handlers.......................................................

window.addEventListener('keydown', function (e) {
   var key = e.keyCode,
       SLOW_MOTION_RATE = 0.2;

   if ( ! snailBait.playing || snailBait.runner.exploding) {
      return;
   }
   
   if (key === 83 && e.shiftKey) { // 'S' key
      if (snailBait.timeRate === snailBait.NORMAL_TIME_RATE) {
         snailBait.setTimeRate(SLOW_MOTION_RATE);
      }
      else if (snailBait.timeRate === SLOW_MOTION_RATE) {
         snailBait.setTimeRate(snailBait.NORMAL_TIME_RATE);
      }
   }
   else if (key === 83) { // 's' key
      if ( ! snailBait.stalled) {
         snailBait.previousBgVelocity = snailBait.bgVelocity;
         snailBait.bgVelocity = 0;
         snailBait.stalled = true;
      }
      else {
         snailBait.stalled = false;
         snailBait.bgVelocity = snailBait.previousBgVelocity;
      }
   }
   else if (key === 68 || key === 37) { // 'd' or left arrow
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
});

window.addEventListener(
   'blur', 

   function (e) {
      if (!snailBait.gameStarted) return;

      snailBait.windowHasFocus = false;

      if ( ! snailBait.paused) {
         snailBait.togglePaused(); // pause if not paused
      }
   }
);

window.addEventListener(
   'focus', 

   function (e) {
      var DIGIT_DISPLAY_DURATION = 1000, // milliseconds
          takeAction = function () { 
             return snailBait.windowHasFocus && 
                    snailBait.countdownInProgress; 
             };
             
      if (!snailBait.gameStarted) return;

      snailBait.windowHasFocus = true;

      if (!snailBait.playing) {
        snailBait.togglePaused();
      }
      else if (snailBait.paused) {
         snailBait.countdownInProgress = true;
         snailBait.toastElement.style.font = '128px fantasy';

         if (takeAction()) {
            snailBait.revealToast('3', 500);
      
            setTimeout(function (e) {
               if (takeAction()) {
                  snailBait.revealToast('2', 500);
               }

               setTimeout(function (e) {
                  if (takeAction()) {
                     snailBait.revealToast('1', 500);
                  }

                  setTimeout(function (e) {
                     if (takeAction()) {
                        snailBait.togglePaused();
                        snailBait.toastElement.style.font = 
                           snailBait.originalFont;
                     }

                     snailBait.countdownInProgress = false;

                  }, DIGIT_DISPLAY_DURATION);
               }, DIGIT_DISPLAY_DURATION);
            }, DIGIT_DISPLAY_DURATION);
         }
      }
   }
);

// Game object.........................................................

var snailBait = new SnailBait();

// Sound and music checkbox event handlers.............................

snailBait.musicCheckboxElement.addEventListener(
   'change',
   
   function (e) {
      snailBait.musicOn = snailBait.musicCheckboxElement.checked;

      if (snailBait.musicOn) {
         snailBait.musicElement.play();
      }
      else {
         snailBait.musicElement.pause();
      }
   }
);

snailBait.soundCheckboxElement.addEventListener(
   'change',
   
   function (e) {
      snailBait.soundOn = snailBait.soundCheckboxElement.checked;
   }
);

// Launch game.........................................................

snailBait.initializeImages();
snailBait.createSprites();
snailBait.createAudioChannels();
