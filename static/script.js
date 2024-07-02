let nodes = [];
let links = [];
let adjMatrix = [];

const COLORS = [
    [230, 230, 250],   // Lavender
    [240, 248, 255],   // Alice Blue
    [240, 255, 255],   // Azure
    [255, 240, 245],   // Lavender Blush
    [245, 245, 220],   // Beige
    [245, 255, 250],   // Mint Cream
    [240, 255, 240],   // Honeydew
    [255, 228, 225],   // Misty Rose
    [255, 250, 240],   // Floral White
    [255, 255, 240],   // Ivory
    [250, 240, 230],   // Linen
    [255, 245, 238],   // Seashell
    [255, 250, 250],   // Snow
    [240, 255, 255],   // Light Cyan
    [240, 248, 255],   // Light Sky Blue
    [245, 245, 245],   // White Smoke
    [248, 248, 255],   // Ghost White
    [245, 255, 250],   // Mint Cream
    [255, 240, 245],   // Gainsboro
    [250, 235, 215],   // Antique White
    [240, 255, 233],   // Aquamarine
    [255, 253, 208],   // Light Yellow
    [240, 248, 255],   // Light Blue
    [245, 222, 179],   // Wheat
    [245, 245, 245],   // Light Grey
    [240, 255, 240],   // Pale Green
    [255, 228, 196],   // Bisque
    [255, 239, 213],   // Papaya Whip
    [245, 245, 220],   // Beige
    [245, 245, 245],   // White Smoke
    [255, 240, 245],   // Lavender Blush
    [240, 248, 255],   // Alice Blue
    [240, 255, 255],   // Azure
    [230, 230, 250],   // Lavender
    [255, 250, 240],   // Floral White
    [255, 255, 240],   // Ivory
    [250, 240, 230],   // Linen
    [255, 245, 238],   // Seashell
    [255, 250, 250],   // Snow
    [240, 255, 255],   // Light Cyan
    [240, 248, 255],   // Light Sky Blue
    [245, 245, 245],   // White Smoke
    [248, 248, 255],   // Ghost White
    [245, 255, 250],  
];  
  
// const COLORS = [
//     [255, 0, 0],        // Red
//     [0, 255, 0],        // Lime
//     [0, 0, 255],        // Blue
//     [255, 255, 0],      // Yellow
//     [0, 255, 255],      // Cyan
//     [255, 0, 255],      // Magenta
//     [192, 192, 192],    // Silver
//     [128, 128, 128],    // Gray
//     [128, 0, 0],        // Maroon
//     [128, 128, 0],      // Olive
//     [0, 128, 0],        // Green
//     [128, 0, 128],      // Purple
//     [0, 128, 128],      // Teal
//     [0, 0, 128],        // Navy
//     [255, 165, 0],      // Orange
//     [210, 105, 30],     // Chocolate
//     [255, 192, 203],    // Pink
//     [255, 215, 0],      // Gold
//     [218, 112, 214],    // Orchid
//     [70, 130, 180]      // Steel Blue
//   ]
  

function setup() {
    let canvas = createCanvas(windowWidth * .5, windowHeight * .9);
    canvas.parent('app');
    canvas.style("border", "0px");
    // background("lavender");
    background(255)
    canvas.style("margin", 0);
    head = document.createElement("h1");
    head.className = "text-wrap";
    head.id = "triangle-count";
    document.querySelector("#app").appendChild(head);

}

function generateGraph() {
    let numVertices = parseInt(document.getElementById('vertices').value || 3 + Math.floor(Math.random() * 9));
    nodes = [];
    links = [];

    // Generate nodes in a circular layout
    for (let i = 0; i < numVertices; i++) {
        let angle = (TWO_PI / numVertices) * i;
        let x = 250 + 200 * cos(angle);
        let y = 250 + 200 * sin(angle);
        nodes.push({ id: i, x: x, y: y });
    }

    // Generate random edges
    let maxEdges = numVertices * (numVertices - 1) / 2; // Maximum possible edges for a simple graph
    let numEdges = floor(random(maxEdges)); // Random number of edges

    // Set the probability of an edge being a triangle edge
    let triangleProbability = 1 / 10000;

    for (let i = 0; i < numEdges; i++) {
        let source = floor(random(numVertices));
        let target = floor(random(numVertices));
        if (source !== target && random() > triangleProbability) { // Ensure the edge is not a self-loop and does not form a triangle
            links.push({ source: source, target: target });
        }
    }

    drawGraph();
}


function drawGraph() {
    background(255);
    stroke(0);
    links.forEach(link => {
        let source = nodes[link.source];
        let target = nodes[link.target];
        line(source.x, source.y, target.x, target.y);
    });
    fill('skyblue');
    nodes.forEach(node => {
        ellipse(node.x, node.y, 12.5, 12.5);
    });
    stroke(0);
    head = document.querySelector("#triangle-count");
    head.innerText = null;
    document.querySelector(".incorrect").style.visibility = "hidden";
}

function detectTriangle() {
    adjMatrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(0));
    links.forEach(link => {
        adjMatrix[link.source][link.target] = 1;
        adjMatrix[link.target][link.source] = 1;
    });
    return countTriangles(adjMatrix) > 0;
}

function countTriangles(adjMatrix) {
    let n = adjMatrix.length;
    let count = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                if (i != j && j != k && k != i && adjMatrix[i][j] && adjMatrix[j][k] && adjMatrix[k][i]) {
                    count++;
                }
            }
        }
    }
    return count / 6;
}

function checkTriangle() {
    let triangle = document.getElementById('triangle').value;
    let triangleExists = detectTriangle();
    let resultDiv = document.getElementById('result');
    if ((triangleExists && triangle === 'yes') || (!triangleExists && triangle === 'no')) {
        resultDiv.textContent = "Correct!";
        if (triangleExists) {
            document.getElementById('triangle-count').style.display = 'block';
        }
    } else {
        resultDiv.textContent = "Incorrect.";
    }
}

function checkTriangleCount() {
    document.querySelector(".incorrect").style.visibility = "hidden";
    let count = parseInt(document.getElementById('count').value);
    let adjMatrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(0));
    links.forEach(link => {
        adjMatrix[link.source][link.target] = 1;
        adjMatrix[link.target][link.source] = 1;
    });
    let actualCount = countTriangles(adjMatrix);
    let resultDiv = document.getElementById('result');
    if (count === actualCount) {
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }
        for(i=0; i<50; i++)
              confetti({
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                particleCount: randomInRange(50, 100),
                origin: { y: 0.6 },
              });

    } else {
        document.querySelector(".incorrect").style.visibility = "visible";
    }
}

let check = []
async function drawTriangles(){
     check = [];
    detectTriangle();
    let n = adjMatrix.length;
    let count = 0;
    cords = null;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                if (i != j && j != k && k != i && adjMatrix[i][j] && adjMatrix[j][k] && adjMatrix[k][i]) {
                    let c = color(...COLORS[Math.floor(Math.random() * COLORS.length)]);


                    cords = [nodes[i].x, nodes[i].y, 
                            nodes[j].x, nodes[j].y, 
                            nodes[k].x, nodes[k].y
                    ]
                    if (check.filter(x => (x[0] == cords[0] && x[1] == cords[1] && x[2] == cords[2]
                        && x[3] == cords[3] && x[4] == cords[4] && x[5] == cords[5]
                    )).length > 0)
                        continue

                    count++;
                    head = document.querySelector("#triangle-count");
                    head.innerText = `${count} Triangles.`;
                    fill(c);
                    // noStroke();
                    triangle(nodes[i].x, nodes[i].y, 
                        nodes[j].x, nodes[j].y, 
                        nodes[k].x, nodes[k].y
                    )
                    check.push([nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, nodes[k].x, nodes[k].y])
                    check.push([nodes[i].x, nodes[i].y, nodes[k].x, nodes[k].y, nodes[j].x, nodes[j].y])
                    check.push([nodes[j].x, nodes[j].y, nodes[i].x, nodes[i].y, nodes[k].x, nodes[k].y])
                    check.push([nodes[j].x, nodes[j].y, nodes[k].x, nodes[k].y, nodes[i].x, nodes[i].y])
                    check.push([nodes[k].x, nodes[k].y, nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y])
                    check.push([nodes[k].x, nodes[k].y, nodes[j].x, nodes[j].y, nodes[i].x, nodes[i].y])

                    await sleep(500)
                }
            }
        }
    }

    stroke(2);
    links.forEach(link => {
        let source = nodes[link.source];
        let target = nodes[link.target];
        line(source.x, source.y, target.x, target.y);
    });
    console.log(count);
}


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
  