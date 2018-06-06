/*
Author: Gionaldo Hartono
Date: November 25th, 2014
*/

//Create canvas
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var resetButton = document.getElementById("reset");

//game size
var gridNum = 10;
var gridX = canvas.width/gridNum;
var gridY = canvas.height/gridNum;


//event listeners
document.addEventListener("keypress", keyboardAction, false); //when press any button on keyboard
resetButton.addEventListener("click", startGame, false);


//time and scores
var timer = 0;
var score = 0;
var highScore = 0;


//bunch of intervals
var gameLoop = setInterval(doGameLoop, 16); //refresh canvas 
var timerInterval = setInterval(timeCount, 1000); //timer in seconds
var scoreInterval = setInterval(addScoreByTime, 50); //add score for time
var moveInterval = setInterval(moveLimit, 250); //limit the move of the players per second so that they will not cheat
var monsterInterval = setInterval(forceMonsterMove, 1000); //force monster to move every 1 second so that user will not waste time
var treasureInterval = setInterval(spawnTreasure, 3000); //chance to spawn treasure every 3 seconds

//boolean for state of the game
var canMove = true; //to limit movement
var monsterIsDead = false; //check if monster is dead
var treasureIsSpawned = false; //check if treasure exist
var gameIsOver = false; // to end game

//gameover screen
var gameover = new Image;
gameover.src = "gameover.jpg";

//background of canvas
var backgroundImg = new Image();
backgroundImg.onload = function () {
    "use strict";
    c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
};
backgroundImg.src = "background.jpg";

//character
var yourChar = new Image();
var mainChar = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor( Math.random() * gridNum ) * gridY, health: 3};
yourChar.onload = function () {
    "use strict";
	c.drawImage(yourChar, mainChar.x, mainChar.y, gridX, gridY);
};
yourChar.src = "character.bmp";


//object 1, flames
var objectImg = new Image();
var object1 = { x: Math.floor( Math.random () * (gridNum - 2) + 1) * gridX, y: Math.floor ( Math.random () * (gridNum-2) + 1) * gridY };
objectImg.onload = function () {
    "use strict";
	c.drawImage(objectImg, object1.x, object1.y, gridX, gridY);
};
objectImg.src = "flames.png";

//object 2, treasure chests
var object2Img = new Image();
var object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y:  Math.floor ( Math.random () * gridNum ) * gridY };
object2Img.src = "object2.png";

//monster 1
var enemyImg = new Image();
var enemy1 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY};
enemyImg.onload = function () {
	"use strict";
	c.drawImage(enemyImg, enemy1.x, enemy1.y, gridX, gridY);
};
//pick image randomly
if(Math.floor(Math.random () * 3) > 1)
	enemyImg.src = "enemy2.png";
else
	enemyImg.src = "enemy.png";


function doGameLoop()
{
	"use strict";
	$('#score').html(score);
	$('#timer').html(timer);
	
	if(!gameIsOver)
	{
		c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
		c.drawImage(objectImg, object1.x, object1.y, gridX, gridY);
		if(treasureIsSpawned)
		{
			c.drawImage(object2Img, object2.x, object2.y, gridX, gridY);
		}
		if(!monsterIsDead)
		{
			c.drawImage(enemyImg, enemy1.x, enemy1.y, gridX, gridY);
		}
		else
		{
			enemy1 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY};
			c.drawImage(enemyImg, enemy1.x, enemy1.y, gridX, gridY);
		}

		c.drawImage(yourChar, mainChar.x, mainChar.y, gridX, gridY);
	}
	
	//collision or interactions
	if(mainChar.x == enemy1.x && mainChar.y == enemy1.y)
		gameOver();
	if(mainChar.x == object2.x && mainChar.y == object2.y)
	{
		c.fillStyle = "#22B14C";
		c.fillRect(mainChar.x, mainChar.y, gridX, gridY);
		object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY};
		treasureIsSpawned = false;
		score += 10000;
	}
	if(object1.x == enemy1.x && object1.y == enemy1.y)
	{
		c.fillStyle = "#22B14C";
		c.fillRect(object1.x, object1.y, gridX, gridY);
		monsterIsDead = true;
		enemy1 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY};
		object1 = { x: Math.floor( Math.random () * (gridNum - 2) + 1) * gridX, y: Math.floor ( Math.random () * (gridNum-2) + 1) * gridY };
		score += 5000;
		monsterIsDead = false;
	}
	if(gameIsOver)
	{
		c.drawImage(gameover, 0, 0 ,canvas.width ,canvas.height);
		score = 0;
		timer = 0;
	}
}

//resets all the intervals and re-draws the canvas
function startGame()
{
	"use strict";
	if(gameIsOver)
	{
		treasureIsSpawned = false;
		clearInterval(gameLoop);
		clearInterval(timerInterval);
		clearInterval(scoreInterval);
		clearInterval(moveInterval);
		clearInterval(monsterInterval);
		clearInterval(treasureInterval);
		gameIsOver = false;
		mainChar = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor( Math.random() * gridNum ) * gridY, health: 3};
		enemy1 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY}
		object1 = { x: Math.floor( Math.random () * (gridNum - 2) + 1) * gridX, y: Math.floor ( Math.random () * (gridNum-2) + 1) * gridY };
		object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y: Math.floor ( Math.random () * gridNum ) * gridY};
		c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
		c.drawImage(objectImg, object1.x, object1.y, gridX, gridY);
		c.drawImage(yourChar, mainChar.x, mainChar.y, gridX, gridY);
		c.drawImage(enemyImg, enemy1.x, enemy1.y, gridX, gridY);
		gameLoop = setInterval(doGameLoop, 16);
		timerInterval = setInterval(timeCount, 1000);
		scoreInterval = setInterval(addScoreByTime, 50);
		moveInterval = setInterval(moveLimit, 250);
		monsterInterval = setInterval(forceMonsterMove, 1000);
		treasureInterval = setInterval(spawnTreasure, 3000);
		if(Math.floor(Math.random () * 3) > 1)
			enemyImg.src = "enemy2.png";
		else
			enemyImg.src = "enemy.png";
	}
	else
	{
		alert("Game is not over");
	}
}

function timeCount()
{
	"use strict";
	timer += 1;
}
function forceMonsterMove()
{
	"use strict";
	monsterMove();
}

function spawnTreasure()
{
	"use strict";
	var decideTreasure = Math.floor(Math.random() * 6) + 1;	
	if(decideTreasure > 4)
	{
		object2 = { x: Math.floor( Math.random () * gridNum ) * gridX, y:  Math.floor ( Math.random () * gridNum ) * gridY };
		treasureIsSpawned = true;
	}
}
function addScoreByTime()
{
	"use strict";
	score += 2;
}

function moveLimit()
{
	"use strict";
	canMove = true;
}

function keyboardAction(event)
{
	"use strict";
	var key = event.which;
	if(!gameIsOver)
	{
		if(canMove)
		{
		switch(key)
		{
			case 119: //move up
			case 87: 
				if(mainChar.y!= 0)
					mainChar.y -= gridY;
					monsterMove();
					canMove = false;
				break;
			
			case 97: //move left
				if(mainChar.x != 0)
					mainChar.x -= gridX;
					monsterMove();
					canMove = false;
				break;
			
			case 100: //move right
			case 68:
				if(mainChar.x != canvas.width - gridX)
					mainChar.x += gridX;
					monsterMove();
					canMove = false;
				break;
			
			case 115: //move down
				if(mainChar.y != canvas.height - gridY)
					mainChar.y += gridY;
					monsterMove();
					canMove = false;
				break;
			}
		}
	}
}

function monsterMove()
{
	"use strict";
	if(canMove)
	{
		score += 100;
		var randomX = randomizeSteps(),
		randomY = randomizeSteps();
		if(enemy1.x > mainChar.x)
			enemy1.x -= randomX * gridX;
		else if(enemy1.x < mainChar.x)
			enemy1.x += randomX * gridX;
		if(enemy1.y > mainChar.y)
			enemy1.y -= randomY * gridY;
		else if(enemy1.y < mainChar.y)
			enemy1.y += randomY * gridY;
	}
}

function randomizeSteps()
{
	"use strict";
	var random = Math.floor(Math.random() * 6);	
	if(random > 2)
		return 1;
	else 
		return 0;
	
}

function gameOver()
{
	"use strict";
	treasureIsSpawned = false;
	c.drawImage(gameover, 0, 0 ,canvas.width ,canvas.height);
	clearInterval(gameLoop);
	clearInterval(scoreInterval);
	clearInterval(timerInterval);
	clearInterval(moveInterval);
	clearInterval(monsterInterval);
	clearInterval(treasureInterval);
	if(score > highScore)
	{
		highScore = score;
		$('#highScore').html(highScore + ", with time " + timer );
	}
	score = 0;
	timer = 0;
	gameIsOver = true;
}
