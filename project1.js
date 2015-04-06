/*
	Donald Disha
	Project 1
*/

var canvas;
var gl;

var c1 = randomIntpos(255)/255;
var c2 = randomIntpos(255)/255;
var c3 = randomIntpos(255)/255; 
var c4 = randomIntpos(255)/255;

var b1 = randomIntpos(255)/255;
var b2 = randomIntpos(255)/255;
var b3 = randomIntpos(255)/255; 

var ynewpos;

var score = 0;
var scored = false;

var winMessage = false;

var NumVertices  = 3;
var NumVerticesObject  = 4;

var points = [];
var colors = [];

var xpos = 0;
var ypos = 0;

var xO = [];
var yO = [];
var tmpX;
var tmpY;
var xTimer = -1;

var d = new Date();
var n = d.getTime();

var pressCounter = 0;
var pressCounterMax = 8;

var targets = 4;

var RocketBuffer;
var ObjBuffer;

var cBuffer
var cBuffer2

var program;

var translationPlayerMatrix = mat4(); 
var translationObjectMatrix = mat4(); 

var r1 = randomIntpos(255)/255;
var r2 = randomIntpos(255)/255;
var r3 = randomIntpos(255)/255; 
var r4 = randomIntpos(255)/255;


window.onload = function init() 
{
	// Retrieve <canvas> element
	canvas = document.getElementById( "gl-canvas" );

	// Get Rendering context for WebGL
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( b1,b2, b3, 1.0 );	
	
	startTimer();
	
	
	translationPlayerMatrix = translate(xpos,ypos,0);
	
	// up, left, right, down arrow keys are pressed to move rocket ship
	document.onkeydown = checkKey;
	function checkKey(event){
	event = event || window.event;
	switch(event.keyCode) {
		case 37:
		if(xpos > -.25){
		xpos -= .1;
		}
		break;
		case 38:
		if(ypos < .80){
		ypos+=.1;
		}
		break;
		case 39:
		if(xpos <1.15){
		xpos += 0.1;
		}
		break;
		case 40:
		if(ypos > -.80){
		ypos-=.1;
		}
		break;
		case 49:
		xpos =-.25;
		ypos = -.25;
		break;
	}
    }
	

	
	//Triangle and Colors
    points = new Float32Array([
			-.7, .1,0,1,
			-.7, -.1, 0,1,
			-.4, 0.0,0,1
	]);

	colors = new Float32Array([
			r1,r2,0,r4,
			0,r2,r3,0,
			0,r2,r3,0
	]);
	
	//Obstacle
	var pointsObj = new Float32Array([			
		-1/12, -1/12,0,1,
		1/12,-1/12, 0,1,
		1/12, 1/12,0,1,
		-1/12,1/12,0,1
	]);
	
	var colorsObj = new Float32Array([
			c1,c2,0,c4,
			0,c2,c3,0,
			0,c2,c3,0
	]);
	
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	//Rocket
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    RocketBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, RocketBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	
	//Obstacle
    cBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsObj), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    ObjBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ObjBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsObj), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	translationMat4z = gl.getUniformLocation(program, "translationMatrix");
	
	ynewpos = randomInt(500)/500;
	
	render();
};

function render() 
{
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	
	
	//Rocket
	translationPlayerMatrix = translate(xpos,ypos,0);
	gl.uniformMatrix4fv(translationMat4z,false,flatten(translationPlayerMatrix));
	gl.bindBuffer( gl.ARRAY_BUFFER, RocketBuffer );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
	
	//Obstacle
	translationObjectMatrix = translate(1-xTimer,ynewpos,0);
	gl.uniformMatrix4fv(translationMat4z,false,flatten(translationObjectMatrix));
	gl.bindBuffer( gl.ARRAY_BUFFER, ObjBuffer );
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer2 );
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	
	gl.drawArrays( gl.TRIANGLE_FAN, 0, NumVerticesObject );	
	
	document.getElementById("score").innerHTML = "Score: " + score;
	
	//detects collision
	hitDetection();

	//detects if object is offscreen
	objOffScreen();
	
	//projects win message if score is 50000
	if (score == 50000){
	if (winMessage == false){
		alert("Congratulations, you won!\nHit 'OK' to continue and try and get a highscore!");
		winMessage = true;
	}
	}
	
	requestAnimFrame( render );
}

function startTimer () 
{
    setTimeout(stopTimer,10);
}

function stopTimer () 
{
	xTimer += .010;
	startTimer();
}

function hitDetection()
{
	if(
	   (((((-1/12)+ynewpos) < (.1 + ypos)) && (((-1/12)+ynewpos) > (-.1 + ypos))) || ((((1/12)+ynewpos) > (-.1 + ypos)) && (((1/12)+ynewpos) < (.1 + ypos)))) && 
	   ((((-1/12)+(1-xTimer)) < (-.4+xpos) && (((-1/12)+(1-xTimer)) > (-.7+xpos))) || (((1/12)+(1-xTimer) > (-.7+xpos)) && (((1/12)+(1-xTimer)) < (-.4+xpos)))))
	{
	xTimer = 0;
	score = 0;
	ynewpos = randomInt(500)/500;
	}
}



function objOffScreen()
{
	if ((1-xTimer) <= -1.5){
	score+=2500;
	ynewpos = randomInt(500)/500;
	xTimer = 0;
	}
}

function randomInt(range)
{
	var num = Math.floor(Math.random()*range) + 1; 
	num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	return num;
}

function randomIntpos(range)
{
	var num = Math.floor(Math.random()*range); 
	return num;
}
