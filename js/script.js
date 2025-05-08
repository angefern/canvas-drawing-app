// javascript file for canvas drawing app 

window.addEventListener("load", function () {
    let c = document.getElementById("testCanvas");
    let ctx = c.getContext("2d");
    let shapesList = [];
    let currentIndex = 0;
    let shapes = document.getElementById("shapes");
    let triangleParams = document.getElementById("triangleParams");
    let circleParams = document.getElementById("circleParams");
    let rectParams = document.getElementById("rectParams");
    let drawBtn = document.getElementById("draw");
    let color = document.getElementById("color");
    let undoBtn = document.getElementById("undo");

    let pt1X = document.getElementById("pt1X");
    let pt1Y = document.getElementById("pt1Y");

    let pt2X = document.getElementById("pt2X");
    let pt2Y = document.getElementById("pt2Y");

    let pt3X = document.getElementById("pt3X");
    let pt3Y = document.getElementById("pt3Y");

    shapes.addEventListener("change", function (event) {
        if (shapes.value == "triangle") {
            triangleParams.style.display = "block";
            circleParams.style.display = "none";
            rectParams.style.display = "none";
        }
        else if (shapes.value == "circle") {
            triangleParams.style.display = "none";
            circleParams.style.display = "block";
            rectParams.style.display = "none";
        }
        else if (shapes.value == "rectangle") {
            triangleParams.style.display = "none";
            circleParams.style.display = "none";
            rectParams.style.display = "block";
        }
    });

    class Point {
        constructor(x, y) {
            this.x = parseFloat(x);
            this.y = parseFloat(y);
        }
    }

    class Triangle {
        constructor(point1, point2, point3, colour) {
            this.point1 = new Point(point1.x, point1.y);
            this.point2 = new Point(point2.x, point2.y);
            this.point3 = new Point(point3.x, point3.y);
            this.colour = colour;
        }

        draw() {
            console.log("Drawing Triangle:", this);
            ctx.fillStyle = this.colour;
            ctx.beginPath();
            ctx.moveTo(this.point1.x, this.point1.y);
            ctx.lineTo(this.point2.x, this.point2.y);
            ctx.lineTo(this.point3.x, this.point3.y);
            ctx.closePath();
            ctx.fill();
        }
    }

    class Circle {
        constructor(center, radius, colour) {
            this.center = new Point(center.x, center.y);
            this.radius = radius;
            this.colour = colour;
        }

        draw() {
            ctx.fillStyle = this.colour;
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    class Rectangle {
        constructor(width, height, tLeft, colour) {
            this.width = parseFloat(width);
            this.height = parseFloat(height);
            this.tLeft = new Point(tLeft.x, tLeft.y);

            this.tRight = new Point(this.tLeft.x + this.width, this.tLeft.y);
            this.bRight = new Point(this.tLeft.x + this.width, this.tLeft.y + this.height);
            this.bLeft = new Point(this.tLeft.x, this.tLeft.y + this.height);
            this.colour = colour;

            console.log("tRight: " + this.tRight.x + ", " + this.tRight.y);
            console.log("bRight: " + this.bRight.x + ", " + this.bRight.y);
            console.log("tLeft: " + this.tLeft.x + ", " + this.tLeft.y);
            console.log("bLeft: " + this.bLeft.x + ", " + this.bLeft.y);
            
            console.log("width: " + this.width);
            console.log("height: " + this.height);
        }

        draw() {
            ctx.fillStyle = this.colour;
            ctx.beginPath();
            ctx.moveTo(this.tLeft.x, this.tLeft.y);
            ctx.lineTo(this.tRight.x, this.tRight.y);
            ctx.lineTo(this.bRight.x, this.bRight.y);
            ctx.lineTo(this.bLeft.x, this.bLeft.y);
            ctx.closePath();
            ctx.fill();
        }
    }

    // draw button
    drawBtn.addEventListener("click", function (event) {
        undoBtn.disabled = false;

        if (shapes.value == "triangle") {
            console.log(currentIndex);
            shapesList[currentIndex] = new Triangle(
                new Point(pt1X.value, pt1Y.value),
                new Point(pt2X.value, pt2Y.value),
                new Point(pt3X.value, pt3Y.value),
                color.value
            );

            shapesList[currentIndex].draw();

            localStorage.shapes = JSON.stringify(shapesList);
            console.log(localStorage.shapes);

            currentIndex += 1;

            console.log(shapesList);
            console.log(currentIndex);
        }

        if (shapes.value == "circle") {
            console.log(currentIndex);

            shapesList[currentIndex] = new Circle(
                new Point(centerX.value, centerY.value),
                radius.value,
                color.value
            );

            shapesList[currentIndex].draw();

            localStorage.shapes = JSON.stringify(shapesList);
            console.log(localStorage.shapes);

            console.log(shapesList[currentIndex]);
            currentIndex += 1;
        }

        if (shapes.value == "rectangle") {
            shapesList[currentIndex] = new Rectangle(
                width.value,
                height.value,
                new Point(tLeftX.value, tLeftY.value),
                color.value
            );

            shapesList[currentIndex].draw();

            localStorage.shapes = JSON.stringify(shapesList);
            console.log(localStorage.shapes);

            currentIndex += 1;
        }
    });

    // function converts parsed object back into class instances
    function convertToShape(obj) {
        if (obj.point1 && obj.point2 && obj.point3) {
            return new Triangle(obj.point1, obj.point2, obj.point3, obj.colour);
        } else if (obj.center && obj.radius) {
            return new Circle(obj.center, obj.radius, obj.colour);
        } else if (obj.width && obj.height && obj.tLeft) {
            return new Rectangle(obj.width, obj.height, obj.tLeft, obj.colour);
        }
        return null;
    }

    // Retrieve shapes from local storage and redraw them
    if (localStorage.shapes) {
        let retrieved = JSON.parse(localStorage.shapes);
        shapesList = retrieved.map(shape => convertToShape(shape));
        shapesList.forEach(shape => shape.draw());
        currentIndex = shapesList.length;
    }


    // undo button
    undoBtn.addEventListener("click", function (event) {
        if (currentIndex > 0) {
            shapesList.pop();
            currentIndex -= 1;
            ctx.clearRect(0, 0, c.width, c.height);
            shapesList.forEach(shape => shape.draw());
        }
        if (currentIndex <= 0) {
            undoBtn.disabled = true;
        }
        localStorage.shapes = JSON.stringify(shapesList);
    });

    document.getElementById("clear").addEventListener("click", function (event) {
        ctx.clearRect(0, 0, c.width, c.height);
        shapesList = [];
        currentIndex = 0;
        undoBtn.disabled = true;
        localStorage.clear()
    });
});