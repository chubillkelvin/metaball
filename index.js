"use strict";
// Point
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = 0;
        this.y = 0;
        this.update(x, y);
    }
    Point.prototype.getX = function () {
        return this.x;
    };
    Point.prototype.getY = function () {
        return this.y;
    };
    Point.prototype.update = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Point.prototype.dist = function (point) {
        return Math.sqrt(Math.pow(this.x - point.getX(), 2) + Math.pow(this.y - point.getY(), 2));
    };
    return Point;
}());
// Circle
var Circle = /** @class */ (function () {
    function Circle(x, y, radius) {
        this.xVel = 0;
        this.yVel = 0;
        this.center = new Point(x, y);
        this.radius = radius;
    }
    Circle.prototype.setVel = function (xVel, yVel) {
        this.xVel = xVel;
        this.yVel = yVel;
    };
    Circle.prototype.move = function (canvas) {
        var nextPoint = new Point(this.center.getX() + this.xVel, this.center.getY() + this.yVel);
        this.bounce(canvas, nextPoint);
        this.center.update(nextPoint.getX(), nextPoint.getY());
    };
    Circle.prototype.bounce = function (canvas, nextPoint) {
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
    };
    Circle.prototype.isPointInside = function (point) {
        return point.dist(this.center) <= this.radius;
    };
    return Circle;
}());
// main
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var gridNum = 300;
var gridSize = canvas.width / gridNum;
var NUM_OF_CIRCLES = 10;
function createCircle() {
    var radius = Math.min(Math.max(10, Math.round(Math.random() * 50)), 100);
    var x = Math.min(Math.max(radius, Math.round(Math.random() * canvas.width)), canvas.width - radius);
    var y = Math.min(Math.max(radius, Math.round(Math.random() * canvas.height)), canvas.height - radius);
    var circle = new Circle(x, y, radius);
    circle.setVel(Math.round(Math.random() * 10), Math.round(Math.random() * 10));
    return circle;
}
var circles = [];
for (var i = 0; i < NUM_OF_CIRCLES; i++) {
    circles.push(createCircle());
}
function drawMetaball() {
    var _a, _b, _c, _d, _e, _f;
    var vertices = new Array(canvas.width);
    for (var i = 0; i < gridNum; i++) {
        vertices[i] = new Array(canvas.height);
        var _loop_1 = function (j) {
            var point = new Point(i * gridSize, j * gridSize);
            vertices[i][j] = circles.some(function (circle) { return circle.isPointInside(point); });
        };
        for (var j = 0; j < gridNum; j++) {
            _loop_1(j);
        }
    }
    for (var i = 0; i < gridNum; i++) {
        for (var j = 0; j < gridNum; j++) {
            ctx.beginPath();
            ctx.arc(i * gridSize, j * gridSize, 1, 0, 2 * Math.PI);
            if (!vertices[i][j])
                continue;
            if (((_a = vertices[i - 1]) === null || _a === void 0 ? void 0 : _a[j]) && ((_b = vertices[i - 1]) === null || _b === void 0 ? void 0 : _b[j - 1]) && ((_c = vertices[i - 1]) === null || _c === void 0 ? void 0 : _c[j + 1]) && vertices[i][j - 1] && vertices[i][j + 1] && ((_d = vertices[i + 1]) === null || _d === void 0 ? void 0 : _d[j - 1]) && ((_e = vertices[i + 1]) === null || _e === void 0 ? void 0 : _e[j]) && ((_f = vertices[i + 1]) === null || _f === void 0 ? void 0 : _f[j + 1]))
                continue;
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
    circles.forEach(function (circle) { return circle.move(canvas); });
    window.requestAnimationFrame(main);
}
window.requestAnimationFrame(main);
