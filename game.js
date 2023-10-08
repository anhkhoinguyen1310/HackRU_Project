const username = localStorage.getItem('username');
const displplayUsername = document.getElementById('displayUsername');
displayUsername.innerHTML = 'Hello ' + username;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.getElementById('canvas').appendChild(canvas);
const applicationState = {
	isGameOver: false,
	isPaused: false,
	currentUser: "",
	highScore: {
	  score: 0,
	  user: null,
	},
	gameHistory: [{ user: null, score: 0}],
  };

  
let bg = {};  

let hero = { x: canvas.width / 2, y: canvas.height / 2 };
let monsters = [
	{ x: 100, y: 100 },
	{ x: 200, y: 200 },
	{ x: 300, y: 300 },
	{x: 200, y: 100 },
	{x: 100, y: 200 },
];

let startTime = Date.now();
const SECONDS_PER_ROUND = 10;
let elapsedTime = 0;

function loadImages() {
	bg.image = new Image();

	bg.image.onload = function () {
		// show the background image
		bg.ready = true;
	};
	bg.image.src = 'images/background.png';
	hero.image = new Image();
	hero.image.onload = function () {
		// show the hero image
		hero.ready = true;
	};
	hero.image.src = 'images/hero.png';

	monsters.forEach((monster, i) => {
		monster.image = new Image();
		monster.image.onload = function () {
			// show the monster image
			monster.ready = true;
		};
		monster.image.src = `images/monster_${i + 1}.png`;
	});
}
let keysPressed = {};
function setupKeyboardListeners() {
	document.addEventListener(
		'keydown',
		function (e) {
			keysPressed[e.key] = true;
		},
		false
	);

	document.addEventListener(
		'keyup',
		function (e) {
			keysPressed[e.key] = false;
		},
		false
	);
}


  applicationState.highScore.user = username;
function checkIfHeroGoOffCanvas () {
	if(hero.x <= 0 ) hero.x = canvas.width - 32;
	if(hero.x >= canvas.width) hero.x = 0; 
	if(hero.y <= 0) hero.y = canvas.height -32;
	if(hero.y >= canvas.height) hero.y = 0;
}
//random place Monster
function randomlyPlace(axis)
{
	const maximum = axis === 'x' ? canvas.width : canvas.height
	var randomNumber  = Math.floor(Math.random() * (maximum - 0 + 1)) + 0;
	return randomNumber
}

function showModal() {
    $('#countdownModal').modal('show');
}
let update = function () {
	// Update the time.
	if (!applicationState.isPaused) {
		{
			elapsedTime = Math.floor((Date.now() - startTime) / 1000);
			if (SECONDS_PER_ROUND - elapsedTime <= 0 && !applicationState.isGameOver) {
				applicationState.isGameOver = true; 
				showModal();
			}
		}
	}
	if (keysPressed['ArrowUp']|| keysPressed['w']) {
		hero.y -= 5;
	}
	if (keysPressed['ArrowDown'] || keysPressed['s']) {
		hero.y += 5;
	}
	if (keysPressed['ArrowLeft']|| keysPressed['a']) {
		hero.x -= 5;
	}
	if (keysPressed['ArrowRight']|| keysPressed['d']) {
		hero.x += 5;
	}

	monsters.forEach((monster) => {
		if (hero.x <= monster.x + 32 && monster.x <= hero.x + 32 && hero.y <= monster.y + 32 && monster.y <= hero.y + 32) {
			monster.x = randomlyPlace('x');
			monster.y = randomlyPlace('y');
			applicationState.highScore.score++;
		}
	});
	checkIfHeroGoOffCanvas();
};


//render
function render() {
	if (bg.ready) {
		ctx.drawImage(bg.image, 0, 0);
	}
	if (hero.ready) {
		ctx.drawImage(hero.image, hero.x, hero.y);
	}
	monsters.forEach((monster) => {
		if (monster.ready) {
			ctx.drawImage(monster.image, monster.x, monster.y);
		}
	});
	ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 10, 60);
	ctx.fillText(`Score: ${applicationState.highScore.score}`, 10, 50)
}

$('#countdownModal').on('hidden.bs.modal', function () {
    applicationState.isPaused = false;
});
$('#countdownModal').on('shown.bs.modal', function () {
    applicationState.isPaused = true;
});
function resetGame() {
    // Reset elapsedTime
    elapsedTime = 0;
    startTime = Date.now();

    // Reset score
    applicationState.highScore.score = 0;
	applicationState.isGameOver = false;
}

document.getElementById('Save').addEventListener('click', function()
{
	const storeApplicastionState = JSON.stringify(applicationState);
	localStorage.setItem('class', storeApplicastionState);
	const getTheInfoFromClass = localStorage.getItem('class');
	
	//store in the
	const storeTheScore = JSON.parse(getTheInfoFromClass).highScore.score;
	const storeTheName = localStorage.getItem('username');

	const putTheNamenToLeaderBoard = document.getElementById('firstName');
	putTheNamenToLeaderBoard.innerHTML = storeTheName;
	
	const putTheScoreToLeaderBoard = document.getElementById('firstScore');
	const displayGoldMedal = document.getElementsByClassName('gold-medal')[0];
	putTheScoreToLeaderBoard.innerHTML = storeTheScore + displayGoldMedal.outerHTML;
	$('#countdownModal').modal('hide');
	applicationState.isPaused = false;
	resetGame();
})

function updateGameHistory() {
    const currentUser = username;
    const currentScore = applicationState.highScore.score;
    applicationState.gameHistory.push({ user: currentUser, score: currentScore });
	console.log("Updated Game History: ", applicationState.gameHistory); // Debug statement
	localStorage.setItem('class', JSON.stringify(applicationState));

}

document.getElementById('Exit').addEventListener('click', function()
{
	
	updateGameHistory();
	//window.location.href = "index.html";

})

document.getElementById('sign-out-button').addEventListener('click', signOut)
function signOut(e)
{
	updateGameHistory();
	window.location.href = "index.html";
}

function main() {
	update();
	render();
	// Request to do this again ASAP. This is a special method
	// for web browsers.
	requestAnimationFrame(main);
}

loadImages();
setupKeyboardListeners();
main();