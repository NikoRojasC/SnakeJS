const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const par = document.getElementById("points");
let points = 0;

canvas.width = 600;
canvas.height = 600;

const snake = [];

const positions = [];

const MODES = {
	GAMEOVER: "gameover",
	MOVE: "move",
	GROW: "grow",
	START: "start",
};

let mode = MODES.MOVE;
const INITIAL_X = canvas.width / 2;
const INITIAL_Y = canvas.height / 2;
const BODYW = 20;
const BODYH = 20;

let bodyCount = 2;
let speedX = 0;
let speedY = 0;

let isMovingRight = false;
let isMovingLeft = false;
let isMovingUp = false;
let isMovingDown = false;

let food;

function randColor(current) {
	if (current === 0) return "white";
	const red = Math.floor(Math.random() * 255);
	const green = Math.floor(Math.random() * 255);
	const blue = Math.floor(Math.random() * 255);

	return `rgb(${red}, ${green}, ${blue})`;
}

function randPos(p) {
	const pos = Math.floor(Math.random() * p);
	return pos;
}

initialState();
function initialState() {
	snake[0] = {
		x: INITIAL_X,
		y: INITIAL_Y,
		bodyWidth: BODYW,
		bodyHeight: BODYH,
		color: "black",
	};

	addBody();
	newFood();
}

function addBody() {
	for (let i = 1; i < bodyCount; i++) {
		snake[i] = {
			x: snake[i - 1].x,
			y: snake[i - 1].y,
			bodyWidth: BODYW,
			bodyHeight: BODYH,
			color: randColor(i),
		};
	}
}
function newFood() {
	food = {
		x: randPos(canvas.width - 20),
		y: randPos(canvas.height - 20),
		width: BODYW / 2,
		height: BODYH / 2,
		color: randColor(1),
	};
}

function restart() {
	initialState();
	drawFood();
	draw();
}

function drawSnake() {
	snake.forEach((bodyC) => {
		ctx.fillStyle = bodyC.color;
		ctx.fillRect(bodyC.x, bodyC.y, bodyC.bodyWidth, bodyC.bodyHeight);
	});
}
function drawFood() {
	ctx.fillStyle = food.color;
	ctx.fillRect(food.x, food.y, food.width, food.height);
}

function resetFlags() {
	isMovingUp = false;
	isMovingDown = false;
	isMovingRight = false;
	isMovingLeft = false;
}
function moveSnake() {
	const head = snake[0];
	let prevX = head.x;
	let prevY = head.y;

	positions.unshift({ x: prevX, y: prevY });

	if (positions.length > snake.length * 30) {
		positions.pop();
	}

	head.x += speedX;
	head.y += speedY;

	const hitRight = head.x === canvas.width + head.bodyWidth;
	const hitUp = head.y === 0 - head.bodyHeight;
	const hitDown = head.y === canvas.height + head.bodyHeight;
	const hitLeft = head.x === 0 - head.bodyWidth;

	if (
		head.x < food.x + food.width &&
		head.x + head.bodyWidth > food.x &&
		head.y < food.y + food.height &&
		head.y + head.bodyHeight > food.y
	) {
		bodyCount++;
		points++;
		addBody();
		newFood();
	}

	// console.log(snake);
	if (hitUp) {
		head.y = canvas.height + head.bodyHeight / 2;
	}
	if (hitDown) {
		head.y = 0 - head.bodyHeight / 2;
	}
	if (hitLeft) {
		head.x = canvas.width + head.bodyWidth / 2;
	}
	if (hitRight) {
		head.x = 0 - head.bodyWidth / 2;
	}
	for (let i = snake.length - 1; i > 0; i--) {
		const targetPos = positions[i * 20];

		if (targetPos) {
			// const difX = targetPos.x - head.x;
			// const difY = targetPos.y - head.y;
			// console.log(targetPos);
			// console.log(head);
			// console.log(difX);
			// console.log(difY);

			// if (difX > BODYW && difY > BODYH) {
			// 	mode = MODES.GAMEOVER;
			// }
			snake[i].x = targetPos.x;
			snake[i].y = targetPos.y;
		}
	}
}

document.addEventListener("keydown", (e) => {
	// console.log("deberia moverse");
	if (e.code === "KeyW" && !isMovingDown) {
		speedX = 0;
		speedY = -1;
		resetFlags();
		isMovingUp = true;
	}
	if (e.code === "KeyA" && !isMovingRight) {
		speedX = -1;
		speedY = 0;
		resetFlags();
		isMovingLeft = true;
	}
	if (e.code === "KeyS" && !isMovingUp) {
		speedX = 0;
		speedY = 1;
		resetFlags();
		isMovingDown = true;
	}
	if (e.code === "KeyD" && !isMovingLeft) {
		speedX = 1;
		speedY = 0;
		resetFlags();
		isMovingRight = true;
	}
});

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawSnake();

	drawFood();
	if (mode === MODES.MOVE) {
		// speedX = 0;
		// speedY = -1;
		moveSnake();
	}

	par.textContent = "Points: " + points;

	window.requestAnimationFrame(draw);
}

restart();
