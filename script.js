// Game data
const gameData = {
    categories: [
        {
            name: "INNOVATION PIONEERS", /* [cite: 62] */
            description: "Speakers driving technological change", /* [cite: 62] */
            color: "yellow-category", /* [cite: 194] */
            items: [
                {
                    text: "Designed AI-powered learning experiences using game-based simulations", /* [cite: 63] */
                    speaker: "Page Durham" /* [cite: 63] */
                },
                {
                    text: "Created acquisition strategies for AI prototype delivery", /* [cite: 64, 195] */
                    speaker: "Bonnie Evangelista" /* [cite: 64, 195] */
                },
                {
                    text: "Oversees mechanical fabrication and R&D programs at a leading research lab", /* [cite: 65] */
                    speaker: "Jim Blessé" /* [cite: 65, 196] */
                },
                {
                    text: "Manages technology integration for military information warfare", /* [cite: 66] */
                    speaker: "MaryLou Moore" /* [cite: 67] */
                }
            ]
        },
        {
            name: "MISSION LEADERS", /* [cite: 68, 197] */
            description: "Speakers in key leadership positions", /* [cite: 68, 197] */
            color: "green-category", /* [cite: 68, 197] */
            items: [
                {
                    text: "Served as commanding officer of a Coast Guard air station", /* [cite: 69] */
                    speaker: "Marcus Canady" /* [cite: 69, 198] */
                },
                {
                    text: "Led efforts to overhaul outdated government procurement models", /* [cite: 70] */
                    speaker: "Bonnie Evangelista" /* [cite: 70] */
                },
                {
                    text: "Managed Afghan relocation efforts through strategic acquisition contracts", /* [cite: 71] */
                    speaker: "Mike Carroll" /* [cite: 72, 199] */
                },
                {
                    text: "Leads cybersecurity innovation within a national security training corps", /* [cite: 72] */
                    speaker: "Faith Jones" /* [cite: 73] */
                }
            ]
        },
        {
            name: "EDUCATIONAL JOURNEYS", /* [cite: 74, 200] */
            description: "Speakers with specialized educational backgrounds", /* [cite: 74] */
            color: "blue-category", /* [cite: 74] */
            items: [
                {
                    text: "Earned advanced degrees in systems engineering, political science, and public policy", /* [cite: 75] */
                    speaker: "Margaret Palmieri" /* [cite: 75] */
                },
                {
                    text: "Currently pursuing multiple graduate certificates, including entrepreneurship and data engineering", /* [cite: 76] */
                    speaker: "Ryan Hilger" /* [cite: 76] */
                },
                {
                    text: "Served in both the classroom and the Pentagon, managing classified military correspondence", /* [cite: 77] */
                    speaker: "Latanya Tidwell" /* [cite: 78] */
                },
                {
                    text: "Built cross-service innovation networks in military acquisition", /* [cite: 78] */
                    speaker: "Mike Carroll" /* [cite: 79] */
                }
            ]
        },
        {
            name: "TRANSFORMATION CHAMPIONS", /* [cite: 80] */
            description: "Speakers leading transformative initiatives", /* [cite: 80] */
            color: "purple-category", /* [cite: 80] */
            items: [
                {
                    text: "Founded a leadership development company focused on \"intrusive leadership\"", /* [cite: 81] */
                    speaker: "Marcus Canady" /* [cite: 81] */
                },
                {
                    text: "Developed submarine-launched autonomous systems programs", /* [cite: 82] */
                    speaker: "Ryan Hilger" /* [cite: 82] */
                },
                {
                    text: "Supports transition of warfighting networks through data science and AI integration", /* [cite: 83] */
                    speaker: "Margaret Palmieri" /* [cite: 84] */
                },
                {
                    text: "Manages education of 87,000 Airmen in continuous improvement initiatives", /* [cite: 84] */
                    speaker: "MaryLou Moore" /* [cite: 85] */
                }
            ]
        }
    ],
    hints: [ // Updated hints
        "One group features individuals known for their groundbreaking work with new technologies like AI or in R&D.",
        "Consider the speakers who have held significant command or directive roles within military or government bodies.",
        "Look for clues that highlight academic achievements, multiple degrees, or specialized learning paths.",
        "Some speakers are notable for initiating or leading major changes and overhauls in their respective fields or organizations."
    ]
};

// Game state
let gameState = {
    selectedItems: [],
    solvedCategories: [],
    hintsUsed: 0,
    maxHints: gameData.hints.length
}; // [cite: 87]

// DOM Elements
const gameGrid = document.getElementById('gameGrid'); /* [cite: 88] */
const submitButton = document.getElementById('submitButton'); /* [cite: 88] */
const hintButton = document.getElementById('hintButton'); /* [cite: 89] */
const feedbackElement = document.getElementById('feedback'); /* [cite: 89] */
const solvedGroupsElement = document.getElementById('solvedGroups'); /* [cite: 89] */
const completionMessage = document.getElementById('completionMessage'); /* [cite: 89] */
const hintArea = document.getElementById('hintArea'); /* [cite: 89] */
const hintContent = document.getElementById('hintContent'); /* [cite: 90] */
const registerLink = document.getElementById('registerLink'); /* [cite: 90] */

// Update the registration link - replace with your actual registration URL
registerLink.href = "https://www.dau.edu/tedxdau"; /* [cite: 90] */
registerLink.textContent = "Register for TEDxDAU 2025: Driving Change"; /* [cite: 91] */

// Initialize the game
function initGame() {
    // Flatten all items into a single array
    let allItems = []; /* [cite: 91] */
    gameData.categories.forEach(category => { /* [cite: 92] */
        category.items.forEach(item => {
            allItems.push({
                ...item,
                categoryName: category.name,
                categoryColor: category.color /* [cite: 93] */
            });
        });
    });
    // Shuffle the items
    allItems = shuffleArray(allItems); /* [cite: 94] */
    // Create the grid items
    allItems.forEach((item, index) => { /* [cite: 95] */
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.textContent = item.text;
        itemElement.dataset.index = index;
        itemElement.dataset.category = item.categoryName; /* [cite: 96] */
        itemElement.dataset.color = item.categoryColor; /* [cite: 96] */
        itemElement.dataset.speaker = item.speaker; /* [cite: 96] */
        
        itemElement.addEventListener('click', () => handleItemClick(itemElement));
        
        gameGrid.appendChild(itemElement); /* [cite: 97] */
    });
    // Add event listeners
    submitButton.addEventListener('click', checkSelection); /* [cite: 98] */
    hintButton.addEventListener('click', showHint); /* [cite: 98] */
}

// Handle clicking on an item
function handleItemClick(item) {
    // Ignore clicks on solved items
    if (item.classList.contains('solved')) { /* [cite: 99] */
        return; /* [cite: 99] */
    }
    
    // Toggle selection
    if (item.classList.contains('selected')) { /* [cite: 100] */
        item.classList.remove('selected'); /* [cite: 100] */
        gameState.selectedItems = gameState.selectedItems.filter(i => i !== item.dataset.index); /* [cite: 101] */
    } else {
        // Only allow selecting up to 4 items
        if (gameState.selectedItems.length < 4) { /* [cite: 101] */
            item.classList.add('selected'); /* [cite: 101] */
            gameState.selectedItems.push(item.dataset.index); /* [cite: 102] */
        }
    }
    
    // Update the submit button
    updateSubmitButton(); /* [cite: 102] */
}

// Update the submit button state
function updateSubmitButton() {
    submitButton.disabled = gameState.selectedItems.length !== 4; /* [cite: 103] */
    submitButton.textContent = `Check Selection (${gameState.selectedItems.length}/4)`; /* [cite: 104] */
}

// Check if the current selection forms a valid category
function checkSelection() {
    // Get all selected items
    const selectedElements = gameState.selectedItems.map(index => 
        document.querySelector(`.item[data-index="${index}"]`)
    ); /* [cite: 104] */
    // Get the categories of selected items
    const selectedCategories = selectedElements.map(el => el.dataset.category); /* [cite: 105] */
    // Check if all selected items belong to the same category
    const allSameCategory = selectedCategories.every(cat => cat === selectedCategories[0]); /* [cite: 106] */
    // Check if this category has already been solved
    const categoryAlreadySolved = gameState.solvedCategories.includes(selectedCategories[0]); /* [cite: 107] */
    if (allSameCategory && !categoryAlreadySolved) { /* [cite: 108] */
        // Success!
        // Mark as solved
        const category = gameData.categories.find(cat => cat.name === selectedCategories[0]); /* [cite: 109] */
        // Mark items as solved
        selectedElements.forEach(el => { /* [cite: 110] */
            el.classList.remove('selected');
            el.classList.add('solved');
            el.classList.add(el.dataset.color);
        });
        // Add to solved categories
        gameState.solvedCategories.push(selectedCategories[0]); /* [cite: 111] */
        // Display feedback
        feedbackElement.textContent = `Great job! You found the "${selectedCategories[0]}" category.`; /* [cite: 112] */
        feedbackElement.style.color = "#28a745"; /* [cite: 113] */
        
        // Add to solved groups display
        addSolvedGroup(category); /* [cite: 113] */
        // Check if game is complete
        if (gameState.solvedCategories.length === gameData.categories.length) { /* [cite: 114] */
            gameComplete(); /* [cite: 114] */
        }
    } else if (categoryAlreadySolved) { /* [cite: 115] */
        // Already solved this category
        feedbackElement.textContent = `You've already found the "${selectedCategories[0]}" category!`; /* [cite: 115] */
        feedbackElement.style.color = "#ffc107"; /* [cite: 116] */
        
        // Deselect items
        selectedElements.forEach(el => { /* [cite: 116] */
            el.classList.remove('selected');
        });
    } else { /* [cite: 117] */
        // Not a valid category
        feedbackElement.textContent = "These items don't form a category. Try again!"; /* [cite: 117] */
        feedbackElement.style.color = "#dc3545"; /* [cite: 118] */
        
        // Shake animation for feedback
        selectedElements.forEach(el => { /* [cite: 118] */
            el.classList.add('shake');
            setTimeout(() => {
                el.classList.remove('shake');
            }, 500); /* [cite: 119] */
        });
    } /* [cite: 119] */
    
    // Reset selection state
    gameState.selectedItems = []; /* [cite: 120] */
    updateSubmitButton(); /* [cite: 121] */
}

// Add a solved group to the display
function addSolvedGroup(category) {
    const groupElement = document.createElement('div'); /* [cite: 121] */
    groupElement.className = 'group'; /* [cite: 122] */
    
    const groupHeader = document.createElement('div');
    groupHeader.className = 'group-header';
    
    const colorCircle = document.createElement('div');
    colorCircle.className = `group-color ${category.color}`; /* [cite: 122] */
    const groupTitle = document.createElement('h3'); /* [cite: 123] */
    groupTitle.textContent = category.name; /* [cite: 123] */
    
    groupHeader.appendChild(colorCircle);
    groupHeader.appendChild(groupTitle);
    
    const groupDescription = document.createElement('p');
    groupDescription.textContent = category.description;
    
    const groupItems = document.createElement('div'); /* [cite: 123] */
    groupItems.className = 'group-items'; /* [cite: 124] */
    
    category.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'group-item';
        itemElement.innerHTML = `<strong>${item.text}</strong> - <span class="speaker-link">${item.speaker}</span>`;
        groupItems.appendChild(itemElement);
    });
    groupElement.appendChild(groupHeader); /* [cite: 125] */
    groupElement.appendChild(groupDescription); /* [cite: 125] */
    groupElement.appendChild(groupItems); /* [cite: 125] */
    
    solvedGroupsElement.appendChild(groupElement);
}

// Show a hint
function showHint() {
    if (gameState.hintsUsed < gameState.maxHints) {
        const hint = gameData.hints[gameState.hintsUsed]; /* [cite: 125] */
        hintContent.textContent = hint; /* [cite: 126] */
        hintArea.classList.remove('hidden'); /* [cite: 126] */
        gameState.hintsUsed++;
        
        if (gameState.hintsUsed >= gameState.maxHints) { /* [cite: 126] */
            hintButton.disabled = true; /* [cite: 126] */
            hintButton.textContent = "No More Hints"; /* [cite: 127] */
        }
    }
}

// Game complete
function gameComplete() {
    completionMessage.classList.remove('hidden'); /* [cite: 127] */
    // Scroll to completion message
    setTimeout(() => { /* [cite: 128] */
        completionMessage.scrollIntoView({ behavior: 'smooth' });
    }, 1000); /* [cite: 128] */
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) { /* [cite: 129] */
        const j = Math.floor(Math.random() * (i + 1)); /* [cite: 129] */
        [array[i], array[j]] = [array[j], array[i]]; /* [cite: 130] */
    }
    return array; /* [cite: 131] */
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame); /* [cite: 131] */
