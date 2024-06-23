let nodes = [];
let links = [];

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent('app');
    background(255);
}

function generateGraph() {
    let numVertices = parseInt(document.getElementById('vertices').value);
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
        ellipse(node.x, node.y, 20, 20);
    });
}

function detectTriangle() {
    let adjMatrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(0));
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
    let count = parseInt(document.getElementById('count').value);
    let adjMatrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(0));
    links.forEach(link => {
        adjMatrix[link.source][link.target] = 1;
        adjMatrix[link.target][link.source] = 1;
    });
    let actualCount = countTriangles(adjMatrix);
    let resultDiv = document.getElementById('result');
    if (count === actualCount) {
        resultDiv.textContent = `Correct! There are ${actualCount} triangles.`;
    } else {
        resultDiv.textContent = `Incorrect. There are actually ${actualCount} triangles.`;
    }
}
