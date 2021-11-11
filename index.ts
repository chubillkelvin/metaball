// Point
class Point {
    private x: number = 0;
    private y: number = 0;

    constructor(x: number, y: number) {
        this.update(x, y);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    update(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    dist(point: Point) {
        return Math.sqrt(Math.pow(this.x - point.getX(), 2) + Math.pow(this.y - point.getY(), 2));
    }
}

// Circle
class Circle {
    private center: Point;
    private radius: number;
    private xVel: number = 0;
    private yVel: number = 0;

    constructor(x: number, y: number, radius: number) {
        this.center = new Point(x, y);
        this.radius = radius;
    }

    setVel(xVel: number, yVel: number) {
        this.xVel = xVel;
        this.yVel = yVel;
    }

    move(canvas: HTMLCanvasElement) {
        const nextPoint = new Point(this.center.getX() + this.xVel, this.center.getY() + this.yVel);
        this.bounce(canvas, nextPoint);
        this.center.update(nextPoint.getX(), nextPoint.getY());
    }

    bounce(canvas: HTMLCanvasElement, nextPoint: Point) {
        // Bounce from left
        if (nextPoint.getX() - this.radius <= 0) {
            nextPoint.update(0 + this.radius, nextPoint.getY());
            this.xVel *= -1;
        }
        // Bounce from right
        if (nextPoint.getX() + this.radius >= canvas.width) {
            nextPoint.update(canvas.width - this.radius, nextPoint.getY());
            this.xVel *= -1;
        }
        // Bounce from top
        if (nextPoint.getY() - this.radius <= 0) {
            nextPoint.update(nextPoint.getX(), 0 + this.radius);
            this.yVel *= -1;
        }
        // Bounce from bottom
        if (nextPoint.getY() + this.radius >= canvas.height) {
            nextPoint.update(nextPoint.getX(), canvas.height - this.radius);
            this.yVel *= -1;
        }
    }

    isPointInside(point: Point) {
        return point.dist(this.center) <= this.radius;
    }
}

// main
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const gridNum = 300;
const gridSize = canvas.width / gridNum;
const NUM_OF_CIRCLES = 10;

function createCircle(): Circle {
    const radius = Math.min(Math.max(10, Math.round(Math.random() * 50)), 100);
    const x = Math.min(Math.max(radius, Math.round(Math.random() * canvas.width)), canvas.width - radius);
    const y = Math.min(Math.max(radius, Math.round(Math.random() * canvas.height)), canvas.height - radius);
    const circle = new Circle(x, y, radius);
    circle.setVel(Math.round(Math.random() * 10), Math.round(Math.random() * 10));
    return circle;
}

const circles: Circle[] = [];
for (let i = 0; i < NUM_OF_CIRCLES; i++) {
    circles.push(createCircle());
}

function drawMetaball() {
    const vertices: boolean[][] = new Array(canvas.width);
    for (let i = 0; i < gridNum; i++) {
        vertices[i] = new Array(canvas.height);
        for (let j = 0; j < gridNum; j++) {
            const point = new Point(i * gridSize, j * gridSize);
            vertices[i][j] = circles.some((circle) => circle.isPointInside(point));
        }
    }

    for (let i = 0; i < gridNum; i++) {
        for (let j = 0; j < gridNum; j++) {
            ctx.beginPath();
            ctx.arc(i * gridSize, j * gridSize, 1, 0, 2 * Math.PI);
            if (!vertices[i][j]) continue;
            if (vertices[i - 1]?.[j] && vertices[i - 1]?.[j - 1] && vertices[i - 1]?.[j + 1] && vertices[i][j - 1] && vertices[i][j + 1] && vertices[i + 1]?.[j - 1] && vertices[i + 1]?.[j] && vertices[i + 1]?.[j + 1]) continue;
            ctx.strokeStyle = "skyblue";
            ctx.stroke();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMetaball();
}

function main() {
    draw();
    circles.forEach((circle) => circle.move(canvas));
    window.requestAnimationFrame(main);
}

window.requestAnimationFrame(main);
