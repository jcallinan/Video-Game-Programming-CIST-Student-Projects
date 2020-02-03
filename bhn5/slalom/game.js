// =========================
//  -- Keyboard Handling --
// =========================
function keyboard (window) {
    var keyboard = window.keyboard || {};
 
    if (!('isPressed' in keyboard)) {
        keyboard._keys = {};
 
        var handler = function(e, flag) {
            var key = String.fromCharCode(e.which).toLowerCase();
 
            keyboard._keys[key] = flag;
        }
 
        window.onkeydown=function(e){
          handler(e,true);
        };
      window.onkeyup=function(e){
        handler(e,false);
      };
 
        keyboard.isPressed = function(key) {
            key = key.toLowerCase();
 
            if(key in keyboard._keys) {
                return keyboard._keys[key];
            }
 
            return false;
        }
    }
 
    return keyboard;
}
keyboard(window);

// ============
//  -- Game --
// ============
function Game(){
    this.scene = null;
    this.camera = null;
    this.player = null;
    this.renderer = null;
    this.clock = null;
    this.paused = false;
    this.obstacles = [];
    this.dumpInterval = 10;
    this.dumpTimer = 0;
    this.width = 400;
    this.height = 300;
    this.aspect = 16/9;
    this.camLookAt = new THREE.Vector3(0, 2, 0);
    this.camOffset = new THREE.Vector3(0, 2, 0);
}

Game.prototype.CreateObstacles = function (amount, color){
    // Create a shared material for memory and batching reasons
    for(var j = 0; j < 84 / this.dumpInterval; j++){
        var mat = new THREE.MeshBasicMaterial({color: color});
        var arr = [];
        
        for(var i = 0; i < amount; i++){
            var obj = new Obstacle();
            obj.init(mat);
            obj.position.x = Math.random() * 99 - 49.5;
            obj.position.z = -75 - (j * this.dumpInterval);
            obj.mesh.position = obj.position;
            
            this.scene.add(obj.mesh);
            
            arr.push(obj);
        }
        
        this.obstacles.push({z: -75 - (j * this.dumpInterval), obstacles: arr});
    }
};

Game.prototype.init = function(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.aspect, .1, 100);
    this.renderer = new THREE.WebGLRenderer();
    this.clock = new THREE.Clock();
    
    this.renderer.domElement.style.position = 'absolute';
    
    this.scene.fog = new THREE.Fog(0x2e2e2e, 10, 75);
    
    // Create Ground Plane
    this.createPlane();
    
    // Initialize Player
    this.player = new Player();
    this.player.init(0x00dd44);
    this.scene.add(this.player.mesh);
    
    // Initialize Camera
    this.camera.position.x = this.player.position.x;
    this.camera.position.y = this.player.position.y + 3;
    this.camera.position.z = this.player.position.z + 5;
    this.camLookAt.addVectors(this.player.position, this.camOffset);
    this.camera.lookAt(this.camLookAt);
    
    this.CreateObstacles(14, 0x880022);
    
    // Size Window
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.updateViewport();
    
    document.body.appendChild(this.renderer.domElement);
};

Game.prototype.createPlane = function(){
    var geometry = new THREE.Geometry();
    var verts = geometry.vertices;
    var faces = geometry.faces;
    
    verts.push(new THREE.Vector3(-50, 0,   10));
    verts.push(new THREE.Vector3( 50, 0,   10));
    verts.push(new THREE.Vector3( 50, 0, -100));
    verts.push(new THREE.Vector3(-50, 0, -100));
    
    verts.push(new THREE.Vector3(-75, 50,   10));
    verts.push(new THREE.Vector3(-75, 50, -100));
    
    verts.push(new THREE.Vector3( 75, 50,   10));
    verts.push(new THREE.Vector3( 75, 50, -100));
    
    faces.push(new THREE.Face3(0, 1, 2));
    faces.push(new THREE.Face3(2, 3, 0));
    faces.push(new THREE.Face3(0, 3, 5));
    faces.push(new THREE.Face3(5, 4, 0));
    faces.push(new THREE.Face3(1, 6, 2));
    faces.push(new THREE.Face3(2, 6, 7));
    
    var material = new THREE.MeshBasicMaterial({color: 0x008888});
    
    var mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
};

Game.prototype.lerp = function(t, a, b){
    return a + t * (b - a);
};
     
Game.prototype.update = function(){
    var time = this.clock.getDelta();
    if(!this.paused){        
        // Handle Input
        this.handleInput(time);
		
        // Do Collision Checks
        this.handleCollisions(time);
        
        // Update Player
        this.player.update(time);
        
        // Deal with obstacles
        this.handleObstacles(time);
        
        // Update Camera Position
        this.camera.position.x = this.lerp(time * 12, this.camera.position.x, this.player.position.x);
    }
};

Game.prototype.handleCollisions = function(time){
    // Handle room collision
    if(this.player.position.x + this.player.bounds.center.x + (this.player.bounds.size.x / 2) > 50)
        this.player.position.x = 50 - this.player.bounds.center.x - (this.player.bounds.size.x / 2);
    if(this.player.position.x + this.player.bounds.center.x - (this.player.bounds.size.x / 2) < -50)
        this.player.position.x = -50 - this.player.bounds.center.x + (this.player.bounds.size.x / 2);
};

Game.prototype.handleInput = function(time){
    var left = .1;
    var right = -.1;
    var camSpeed = 1.5;
    var playerSpeed = 4;

    if(keyboard.isPressed('%')){
        this.player.velocity.x = this.lerp(time * playerSpeed, this.player.velocity.x, -this.player.maxAbsVelocity.x);
        this.player.rotation.z = this.lerp(time * playerSpeed, this.player.rotation.z, left);
        this.camera.rotation.z = this.lerp(time * camSpeed, this.camera.rotation.z, left);
    }
    else if(keyboard.isPressed('\'')){
        this.player.velocity.x = this.lerp(time * playerSpeed, this.player.velocity.x, this.player.maxAbsVelocity.x);
        this.player.rotation.z = this.lerp(time * playerSpeed, this.player.rotation.z, right);
        this.camera.rotation.z = this.lerp(time * camSpeed, this.camera.rotation.z, right);
    }
    else{
        this.player.velocity.x = this.lerp(time * playerSpeed, this.player.velocity.x, 0);
        this.player.rotation.z = this.lerp(time * playerSpeed, this.player.rotation.z, 0);
        this.camera.rotation.z = this.lerp(time * camSpeed, this.camera.rotation.z, 0);
    }
    
    this.player.velocity.y += time * 0.5;
    if(this.player.velocity.y > this.player.maxAbsVelocity.y)
        this.player.velocity.y = this.player.maxAbsVelocity.y;
};



Game.prototype.handleObstacles = function(time){
    for(var i = 0; i < this.obstacles.length; i++){
        if(this.obstacles[i].z >= 9){
            this.obstacles[i].z = this.obstacles[i].z - 84;
            for(var j = 0; j < this.obstacles[i].obstacles.length; j++){
                this.obstacles[i].obstacles[j].position.z = this.obstacles[i].z;
                this.obstacles[i].obstacles[j].position.x = Math.random() * 99 - 49.5;
           // console.log("obstacle:" + this.obstacles[i].obstacles[j].position.x);
		   // console.log("player:" + this.player.position.x);



}

        }
        else{
            // Update Obstacles and row position
            for(var k = 0; k < this.obstacles[i].obstacles.length; k++){
                this.obstacles[i].obstacles[k].update(time, this.player.velocity.y);
				var intObstacle;
var intPlayer;
intObstacle = parseInt(this.obstacles[i].obstacles[k].position.x);
intPlayer = parseInt(this.player.position.x);
intObstacleZ = parseInt(this.obstacles[i].obstacles[k].position.z);
intPlayerZ = parseInt(this.player.position.z);
console.log("obs x:" + intObstacle);
console.log("player x:" +intPlayer);
//console.log("obstacle X:" + i +":" +this.obstacles[i].obstacles[j].position.x);
//console.log("player X:" + this.player.position.x);
console.log("obstacle z:"  +intObstacleZ);
console.log("player Z:" + intPlayerZ);

if (intPlayer == intObstacle) {
if (intPlayerZ == intObstacleZ){
alert('Game Over! \nConnection Made.');
location = location;
}
	}
            }
            this.obstacles[i].z += this.player.velocity.y * time;
        }
		
    }
};


Game.prototype.render = function(){
    this.renderer.render(this.scene, this.camera);
};

Game.prototype.updateViewport = function(){
    var w = this.width;
    var h = this.height;
    
    if(this.width < this.height * this.aspect){
        h = (w / this.aspect) | 0;
    }
    else if(this.width > this.height * this.aspect){
        w = (h * this.aspect) | 0;
    }
    
    var hDiff = (this.height - h) / 2;
    var wDiff = (this.width - w) / 2;
    
    this.renderer.setSize(w, h);
    this.renderer.domElement.style.top = hDiff + 'px';
    this.renderer.domElement.style.left = wDiff + 'px';
};

Game.prototype.pause = function(){
    this.paused = true;
};

Game.prototype.resume = function(){
    this.paused = false;
};

// ==============
//  -- Player --
// ==============
function Player(){
    this.mesh = null;
    this.geometry = null;
    this.material = null;
    this.bounds = {
        center: new THREE.Vector3(0,0,0),
        size: new THREE.Vector3(1,1,1)
    };
    this.position = new THREE.Vector3(0,0,0);
    this.rotation = new THREE.Vector3(0,0,0);
    this.velocity = {x: 0, y: 100};
    this.maxAbsVelocity = {x: 25, y: 20};
    this.score = 0;
}

Player.prototype.init = function(color){
    if(!this.mesh){
        this.material = new THREE.MeshBasicMaterial({color: color});
        
        this.geometry = new THREE.Geometry();
        var verts = this.geometry.vertices;
        var faces = this.geometry.faces;
        
        verts.push(new THREE.Vector3( 0, 0.5, -1));
        verts.push(new THREE.Vector3( 0, 0.5,  0));
        verts.push(new THREE.Vector3( 1, 0.25, 1));
        verts.push(new THREE.Vector3(-1, 0.25, 1));
        verts.push(new THREE.Vector3( 0, 0.25, 0));
        
        faces.push(new THREE.Face3(0, 1, 2));
        faces.push(new THREE.Face3(0, 2, 4));
        faces.push(new THREE.Face3(0, 3, 1));
        faces.push(new THREE.Face3(0, 4, 3));
        faces.push(new THREE.Face3(1, 4, 2));
        faces.push(new THREE.Face3(1, 3, 4));
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        this.bounds.size.set(2, 0.25, 2);
        this.bounds.center.set(0, 0.375, 0);
    }
};

Player.prototype.update = function(gameTime){
    this.position.x += gameTime * this.velocity.x;
    
    if(this.mesh){
        this.mesh.position = this.position;
        this.mesh.rotation = this.rotation;
    }
};

// ================
//  -- Obstacle --
// ================
function Obstacle(){
    this.mesh = null;
    this.geometry = null;
    this.material = null;
    this.bounds = {
        center: new THREE.Vector3(0,0,0),
        size: new THREE.Vector3(1,1,1)
    };
    this.position = new THREE.Vector3(0,0,0);
}

Obstacle.prototype.init = function(material){
    if(!this.mesh){
        this.material = material;
        
        this.geometry = new THREE.Geometry();
        var verts = this.geometry.vertices;
        var faces = this.geometry.faces;
        
        verts.push(new THREE.Vector3(   0, 5,  0));
        verts.push(new THREE.Vector3(-0.5, 0,  0.5));
        verts.push(new THREE.Vector3( 0.5, 0,  0.5));
        verts.push(new THREE.Vector3( 0.5, 0, -0.5));
        verts.push(new THREE.Vector3(-0.5, 0, -0.5));
        
        faces.push(new THREE.Face3(0, 1, 2));
        faces.push(new THREE.Face3(0, 2, 3));
        faces.push(new THREE.Face3(0, 4, 1));
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = true;
        
        this.bounds.center.set(0, 2.5, 0);
        this.bounds.size.set(1, 5, 1);
    }
}

Obstacle.prototype.update = function(gameTime, velocity){
    this.position.z += gameTime * velocity;
    this.mesh.position = this.position;
};

// =====================
//  -- Setup and Run --
// =====================
var game = new Game();
game.init();

window.onresize = function(){
    game.width = window.innerWidth;
    game.height = window.innerHeight;
    game.updateViewport();
};

function GameLoop(){
    requestAnimationFrame(GameLoop);
    game.update();
    game.render();
}

GameLoop();