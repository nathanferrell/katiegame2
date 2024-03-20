document.addEventListener('DOMContentLoaded', (event) => {
    console.log('questionnaireForm:', document.getElementById('questionnaireForm'));
    console.log('gameInstructionsSection:', document.getElementById('gameInstructionsSection'));
    console.log('gameSection:', document.getElementById('gameSection'));
    console.log('startGameButton:', document.getElementById('startGameButton'));
    console.log('gameCanvas:', document.getElementById('gameCanvas'));
    console.log('infoDiv:', document.getElementById('info'));
    // Survey form elements
    const questionnaireSection = document.getElementById('questionnaireSection');
    const questionnaireForm = document.getElementById('questionnaireForm');
    const gameInstructionsSection = document.getElementById('gameInstructionsSection');
    const gameSection = document.getElementById('gameSection');
    const startGameButton = document.getElementById('startGameButton');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const infoDiv = document.getElementById('info');
    const img = new Image();
    let foundDifferences = [];
    let timer = null;
    let gameComplete = false;

    // Difference areas
    const differenceAreas = [
        [92, 308, 111, 332], [296, 297, 360, 332], [422, 371, 422, 386],
        [422, 370, 475, 410], [441, 440, 466, 487], [432, 512, 451, 534],
        [411, 483, 438, 507], [347, 415, 368, 438], [233, 398, 264, 428],
        [240, 375, 252, 387], [144, 542, 204, 570], [79, 496, 104, 506],
        [71, 423, 98, 453], [134, 464, 159, 494], [310, 500, 341, 534],
        [291, 496, 304, 516], [390, 540, 413, 567], [292, 452, 307, 466],
        [248, 429, 262, 444], [59, 335, 80, 368], [130, 423, 150, 442],
        [200, 424, 223, 446], [150, 414, 170, 430], [229, 485, 248, 506]
    ];

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    img.src = 'https://nathanferrell.github.io/katiegame2/images/cropkatietest.png';

    // Handle questionnaire submission
    questionnaireForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            sleepTime: document.getElementById('sleepTime').value,
            wakeTime: document.getElementById('wakeTime').value,
            sleepHours: document.getElementById('sleepHours').value,
        };
        
        // Save the form data to Firestore
        /*try {
            const docRef = await db.collection('surveyResponses').add(formData);
            console.log("Survey response saved with ID: ", docRef.id);
        } catch (error) {
            console.error("Error saving survey response: ", error);
        } */

        // Hide questionnaire and show game instructions
        questionnaireSection.style.display = 'none';
        gameInstructionsSection.style.display = 'block';
    });

    // Handle "Start Game" button click
    startGameButton.addEventListener('click', function() {
        // Hide instructions and show the game
        gameInstructionsSection.style.display = 'none';
        gameSection.style.display = 'block';
        initializeGame();
    });

    // Check for differences on canvas click
    canvas.addEventListener('click', function(event) {
        if (gameComplete) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        checkDifference(x, y);
    });

    function checkDifference(x, y) {
        for (let i = 0; i < differenceAreas.length; i++) {
            const [x1, y1, x2, y2] = differenceAreas[i];
            if (x >= x1 && x <= x2 && y >= y1 && y <= y2 && !foundDifferences.includes(i)) {
                foundDifferences.push(i);
                drawHighlight(x1, y1, x2 - x1, y2 - y1);
                infoDiv.textContent = `Difference found! Total found: ${foundDifferences.length}`;
                if (foundDifferences.length === 23) {
                    clearInterval(timer);
                    gameComplete = true;
                    infoDiv.textContent += " | All differences found!";
                }
                return;
            }
        }
    }

    function drawHighlight(x, y, width, height) {
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 5;
        ctx
        ctx.strokeRect(x, y, width, height); // Draw highlight rectangle around found difference
    }

    function startTimer() {
        const startTime = Date.now();
        timer = setInterval(() => {
            if (gameComplete) {
                clearInterval(timer);
                return;
            }
            const elapsedTime = Date.now() - startTime;
            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);
            infoDiv.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }

    function initializeGame() {
        foundDifferences = [];
        gameComplete = false;
        // Clear any previous game state
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw the image for a new game
        ctx.drawImage(img, 0, 0);
        // Reset and start the timer
        if (timer) {
            clearInterval(timer);
        }
        startTimer();
    }
});
