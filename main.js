// AI Drink Mixer - Interactive JavaScript with Enhanced Display

class DrinkMixer {
    constructor() {
        this.selectedIngredients = new Set();
        this.selectedMood = '';
        this.selectedType = '';
        this.currentRecipe = null;
        this.selectedModalRecipe = null;
        this.initializeEventListeners();
        this.initializeStorage();
        this.updateCounts();
    }

    initializeEventListeners() {
        // Category tab switching
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchCategory(e));
        });

        // Ingredient selection
        document.querySelectorAll('.ingredient-option').forEach(option => {
            option.addEventListener('click', (e) => this.toggleIngredient(e));
        });

        // Custom ingredient addition
        document.getElementById('add-custom-btn').addEventListener('click', () => {
            this.addCustomIngredient();
        });

        // Enter key for custom ingredients
        document.getElementById('custom-ingredients').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addCustomIngredient();
            }
        });

        // Clear all ingredients
        document.getElementById('clear-all-ingredients').addEventListener('click', () => {
            this.clearAllIngredients();
        });

        // Mood selection
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectMood(e));
        });

        // Drink type selection
        document.querySelectorAll('.drink-type-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectDrinkType(e));
        });

        // Form submission
        document.getElementById('drink-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateDrink();
        });
    }

    switchCategory(event) {
        const clickedTab = event.currentTarget;
        const category = clickedTab.dataset.category;

        // Remove active class from all tabs and content
        document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.category-content').forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        clickedTab.classList.add('active');
        document.querySelector(`.category-content[data-category="${category}"]`).classList.add('active');
    }

    toggleIngredient(event) {
        const option = event.currentTarget;
        const ingredient = option.dataset.ingredient;
        
        if (option.classList.contains('selected')) {
            option.classList.remove('selected');
            this.selectedIngredients.delete(ingredient);
        } else {
            option.classList.add('selected');
            this.selectedIngredients.add(ingredient);
        }
        
        this.updateSelectedIngredientsDisplay();
    }

    addCustomIngredient() {
        const input = document.getElementById('custom-ingredients');
        const customIngredient = input.value.trim();
        
        if (customIngredient && !this.selectedIngredients.has(customIngredient)) {
            this.selectedIngredients.add(customIngredient);
            input.value = '';
            this.updateSelectedIngredientsDisplay();
        }
    }

    clearAllIngredients() {
        this.selectedIngredients.clear();
        document.querySelectorAll('.ingredient-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.getElementById('custom-ingredients').value = '';
        this.updateSelectedIngredientsDisplay();
    }

    updateSelectedIngredientsDisplay() {
        const countElement = document.getElementById('ingredient-count');
        const listElement = document.getElementById('selected-list');
        
        countElement.textContent = this.selectedIngredients.size;
        listElement.innerHTML = '';
        
        this.selectedIngredients.forEach(ingredient => {
            const tag = document.createElement('div');
            tag.className = 'selected-ingredient-tag';
            tag.innerHTML = `
                ${ingredient}
                <span class="remove-ingredient" data-ingredient="${ingredient}">×</span>
            `;
            
            tag.querySelector('.remove-ingredient').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeIngredient(ingredient);
            });
            
            listElement.appendChild(tag);
        });
    }

    removeIngredient(ingredient) {
        this.selectedIngredients.delete(ingredient);
        const option = document.querySelector(`.ingredient-option[data-ingredient="${ingredient}"]`);
        if (option) {
            option.classList.remove('selected');
        }
        this.updateSelectedIngredientsDisplay();
    }

    selectMood(event) {
        document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
        const option = event.currentTarget;
        option.classList.add('selected');
        this.selectedMood = option.dataset.mood;
    }

    selectDrinkType(event) {
        document.querySelectorAll('.drink-type-option').forEach(opt => opt.classList.remove('selected'));
        const option = event.currentTarget;
        option.classList.add('selected');
        this.selectedType = option.dataset.type;
    }

    async generateDrink() {
        console.log('generateDrink called');
        console.log('Selected mood:', this.selectedMood);
        console.log('Selected type:', this.selectedType);
        console.log('Selected ingredients:', [...this.selectedIngredients]);

        if (!this.selectedMood || !this.selectedType) {
            alert('Please select both a mood and drink type!');
            return;
        }

        const allIngredients = [...this.selectedIngredients];
        if (allIngredients.length === 0) {
            alert('Please select at least one ingredient!');
            return;
        }

        this.showLoading();

        try {
            console.log('Generating AI recipe...');
            const recipe = await this.generateAIRecipe(allIngredients, this.selectedMood, this.selectedType);
            console.log('Recipe generated successfully:', recipe);
            this.displayRecipe(recipe);
        } catch (error) {
            console.error('Error generating recipe:', error);
            this.showError();
        }
    }

    showLoading() {
        const button = document.getElementById('generate-btn');
        button.classList.add('loading');
        button.textContent = '🔮 Mixing Magic...';
        
        document.getElementById('output-placeholder').style.display = 'none';
        document.getElementById('recipe-container').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">🔮</div>
                <h3>Creating Your Perfect Drink...</h3>
                <p>Our AI mixologist is crafting something special just for you!</p>
            </div>
        `;
        document.getElementById('recipe-container').classList.add('show');
    }

    async generateAIRecipe(ingredients, mood, type) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const isAlcoholic = type === 'cocktail';
        const drinkColor = this.analyzeDrinkColor(ingredients, mood);
        const name = this.generateCreativeDrinkName(ingredients, mood, type);

        const recipeIngredients = [];
        
        if (isAlcoholic && ingredients.some(ing => ['vodka', 'rum', 'gin', 'tequila', 'whiskey', 'brandy', 'champagne'].includes(ing))) {
            const spirit = ingredients.find(ing => ['vodka', 'rum', 'gin', 'tequila', 'whiskey', 'brandy', 'champagne'].includes(ing));
            recipeIngredients.push({ name: spirit, amount: '2 oz' });
        }

        ingredients.forEach(ing => {
            if (!['vodka', 'rum', 'gin', 'tequila', 'whiskey', 'brandy', 'champagne'].includes(ing)) {
                if (['lime', 'lemon', 'orange', 'cranberry', 'pineapple', 'apple', 'strawberry', 'peach'].includes(ing)) {
                    recipeIngredients.push({ name: `${ing} juice`, amount: '1 oz' });
                } else {
                    recipeIngredients.push({ name: ing, amount: 'to taste' });
                }
            }
        });

        if (!isAlcoholic) {
            recipeIngredients.push({ name: 'sparkling water', amount: '4 oz' });
        }
        recipeIngredients.push({ name: 'ice', amount: 'as needed' });

        return {
            name,
            description: `A ${mood} ${type} crafted with your selected ingredients`,
            ingredients: recipeIngredients,
            instructions: this.generateInstructions(recipeIngredients, isAlcoholic),
            glassType: this.selectGlassType(ingredients, isAlcoholic),
            color: drinkColor.name,
            colorDescription: drinkColor.description,
            colorIntensity: drinkColor.intensity,
            flavorProfile: this.getFlavorProfile(ingredients, mood),
            mood: [mood],
            type: isAlcoholic ? 'alcoholic' : 'non-alcoholic',
            garnish: this.getGarnish(mood, ingredients)
        };
    }

    analyzeDrinkColor(ingredients, mood) {
        const colorProfiles = {
            cranberry: { name: 'ruby', description: 'Deep ruby red with crimson highlights', intensity: 'vibrant' },
            strawberry: { name: 'rose', description: 'Soft rose pink with berry undertones', intensity: 'medium' },
            lime: { name: 'mint', description: 'Fresh mint green with citrus brightness', intensity: 'light' },
            lemon: { name: 'sunshine', description: 'Bright sunshine yellow with golden glow', intensity: 'medium' },
            orange: { name: 'sunset', description: 'Warm sunset orange with amber depths', intensity: 'vibrant' },
            pineapple: { name: 'golden', description: 'Rich golden yellow with tropical warmth', intensity: 'medium' },
            rum: { name: 'amber', description: 'Classic amber with caramel undertones', intensity: 'medium' },
            whiskey: { name: 'copper', description: 'Deep copper with bronze reflections', intensity: 'dark' },
            vodka: { name: 'crystal', description: 'Crystal clear with pristine transparency', intensity: 'light' },
            gin: { name: 'clear', description: 'Pure clear with subtle botanical hints', intensity: 'light' },
            mint: { name: 'emerald', description: 'Fresh emerald green with herbal essence', intensity: 'light' }
        };

        for (const ingredient of ingredients) {
            if (colorProfiles[ingredient]) {
                return colorProfiles[ingredient];
            }
        }

        const moodColors = {
            relaxed: { name: 'ocean', description: 'Calming ocean blue with peaceful depths', intensity: 'medium' },
            party: { name: 'tropical', description: 'Vibrant tropical blue-green with energy', intensity: 'vibrant' },
            romantic: { name: 'blush', description: 'Soft blush pink with romantic warmth', intensity: 'light' },
            sad: { name: 'caramel', description: 'Comforting caramel with golden comfort', intensity: 'medium' },
            stress: { name: 'ice', description: 'Cool ice blue with soothing clarity', intensity: 'light' },
            energetic: { name: 'tangerine', description: 'Bright tangerine with electric energy', intensity: 'vibrant' }
        };

        return moodColors[mood] || { name: 'golden', description: 'Warm golden with mysterious allure', intensity: 'medium' };
    }

    generateCreativeDrinkName(ingredients, mood, type) {
        const moodAdjectives = {
            relaxed: ['Serene', 'Tranquil', 'Peaceful', 'Zen', 'Mellow'],
            party: ['Electric', 'Vibrant', 'Wild', 'Festive', 'Explosive'],
            romantic: ['Passionate', 'Enchanting', 'Elegant', 'Divine', 'Silky'],
            sad: ['Comforting', 'Warm', 'Healing', 'Gentle', 'Soothing'],
            stress: ['Calming', 'Restorative', 'Balancing', 'Pure', 'Centering'],
            energetic: ['Dynamic', 'Powerful', 'Invigorating', 'Bold', 'Charged']
        };
        
        const nouns = ['Elixir', 'Fusion', 'Bliss', 'Dream', 'Escape', 'Harmony', 'Splash', 'Twist', 'Potion', 'Nectar'];
        
        const adj = moodAdjectives[mood][Math.floor(Math.random() * moodAdjectives[mood].length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${adj} ${noun}`;
    }

    generateInstructions(ingredients, isAlcoholic) {
        const instructions = [];
        
        if (isAlcoholic) {
            instructions.push('Add all liquid ingredients to a cocktail shaker filled with ice');
            instructions.push('Shake vigorously for 15 seconds until well chilled');
            instructions.push('Strain into your chilled glass');
            instructions.push('Add fresh ice if needed');
        } else {
            instructions.push('Fill your glass with fresh ice cubes');
            instructions.push('Add all ingredients in order');
            instructions.push('Stir gently to combine all flavors');
            instructions.push('Top with sparkling water if desired');
        }
        
        instructions.push('Garnish beautifully and serve immediately');
        
        return instructions;
    }

    selectGlassType(ingredients, isAlcoholic) {
        if (!isAlcoholic) {
            return ingredients.some(ing => ['mint', 'lime', 'ginger'].includes(ing)) 
                ? 'Highball Glass' : 'Mason Jar';
        }
        
        if (ingredients.includes('champagne')) return 'Champagne Flute';
        if (ingredients.includes('whiskey')) return 'Old Fashioned Glass';
        if (ingredients.some(ing => ['gin', 'vodka'].includes(ing))) return 'Martini Glass';
        
        return 'Cocktail Glass';
    }

    getFlavorProfile(ingredients, mood) {
        const profiles = [];
        
        if (ingredients.some(ing => ['lime', 'lemon', 'orange'].includes(ing))) {
            profiles.push('Citrusy');
        }
        if (ingredients.some(ing => ['strawberry', 'pineapple', 'cranberry'].includes(ing))) {
            profiles.push('Fruity');
        }
        if (ingredients.some(ing => ['mint', 'basil'].includes(ing))) {
            profiles.push('Herbal');
        }
        if (ingredients.some(ing => ['ginger', 'cinnamon'].includes(ing))) {
            profiles.push('Spicy');
        }
        
        const moodFlavors = {
            relaxed: ['Smooth', 'Mellow'],
            party: ['Bold', 'Energizing'],
            romantic: ['Sweet', 'Elegant'],
            sad: ['Comforting', 'Rich'],
            stress: ['Calming', 'Soothing'],
            energetic: ['Zesty', 'Invigorating']
        };
        
        profiles.push(...moodFlavors[mood] || ['Balanced']);
        
        return [...new Set(profiles)].slice(0, 4);
    }

    getGarnish(mood, ingredients) {
        const garnishes = {
            relaxed: 'cucumber slice and mint sprig',
            party: 'colorful fruit skewer',
            romantic: 'rose petal and cherry',
            sad: 'orange peel and cinnamon stick',
            stress: 'lavender sprig and lemon twist',
            energetic: 'lime wheel and jalapeño slice'
        };
        
        return garnishes[mood] || 'fresh fruit garnish';
    }

    generateDrinkImage(recipe) {
        const glassShape = this.getGlassShape(recipe.glassType);
        
        return `
            <div class="drink-image-container">
                <svg class="drink-svg" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        ${this.getSVGGradients(recipe.color, recipe.colorIntensity)}
                    </defs>
                    
                    <!-- Glass shadow -->
                    <ellipse cx="100" cy="280" rx="35" ry="6" fill="rgba(0,0,0,0.2)"/>
                    
                    <!-- Glass outline -->
                    ${glassShape.outline}
                    
                    <!-- Ice cubes -->
                    ${this.getIceEffect()}
                    
                    <!-- Liquid -->
                    ${glassShape.liquid}
                    
                    <!-- Bubbles for mocktails -->
                    ${recipe.type === 'non-alcoholic' ? this.getBubbleEffect() : ''}
                    
                    <!-- Garnish -->
                    ${this.getGarnishElements(recipe.garnish)}
                    
                    <!-- Glass highlight -->
                    ${glassShape.highlight}
                </svg>
            </div>
        `;
    }

    getGlassShape(glassType) {
        const shapes = {
            'Cocktail Glass': {
                outline: `<path d="M60 100 L140 100 L120 200 L80 200 Z M90 200 L110 200 L110 250 L90 250 Z M80 250 L120 250" 
                         fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>`,
                liquid: `<path d="M65 105 L135 105 L118 195 L82 195 Z" fill="url(#liquidGradient)" opacity="0.9"/>`,
                highlight: `<path d="M70 110 L80 110 L78 180 L72 180 Z" fill="rgba(255,255,255,0.3)"/>`
            },
            'Highball Glass': {
                outline: `<path d="M70 80 L130 80 L130 220 L70 220 Z" 
                         fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>`,
                liquid: `<path d="M75 85 L125 85 L125 215 L75 215 Z" fill="url(#liquidGradient)" opacity="0.9"/>`,
                highlight: `<path d="M75 90 L85 90 L85 210 L75 210 Z" fill="rgba(255,255,255,0.3)"/>`
            },
            'Martini Glass': {
                outline: `<path d="M50 80 L150 80 L100 180 Z M95 180 L105 180 L105 240 L95 240 Z" 
                         fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>`,
                liquid: `<path d="M55 85 L145 85 L100 175 Z" fill="url(#liquidGradient)" opacity="0.9"/>`,
                highlight: `<path d="M60 90 L70 90 L65 150 L60 150 Z" fill="rgba(255,255,255,0.3)"/>`
            },
            'Old Fashioned Glass': {
                outline: `<path d="M60 120 L140 120 L140 220 L60 220 Z" 
                         fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>`,
                liquid: `<path d="M65 125 L135 125 L135 215 L65 215 Z" fill="url(#liquidGradient)" opacity="0.9"/>`,
                highlight: `<path d="M65 130 L75 130 L75 210 L65 210 Z" fill="rgba(255,255,255,0.3)"/>`
            },
            'Mason Jar': {
                outline: `<path d="M70 100 L130 100 L130 220 L70 220 Z M65 100 L135 100 L135 110 L65 110 Z" 
                         fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>`,
                liquid: `<path d="M75 110 L125 110 L125 215 L75 215 Z" fill="url(#liquidGradient)" opacity="0.9"/>`,
                highlight: `<path d="M75 115 L85 115 L85 210 L75 210 Z" fill="rgba(255,255,255,0.3)"/>`
            }
        };
        
        return shapes[glassType] || shapes['Cocktail Glass'];
    }

    getSVGGradients(color, intensity) {
        const colorMap = {
            ruby: ['#dc2626', '#b91c1c'],
            rose: ['#f43f5e', '#e11d48'],
            mint: ['#10b981', '#059669'],
            sunshine: ['#eab308', '#ca8a04'],
            sunset: ['#f97316', '#ea580c'],
            golden: ['#f59e0b', '#d97706'],
            amber: ['#f97316', '#ea580c'],
            copper: ['#92400e', '#78350f'],
            crystal: ['#f8fafc', '#e2e8f0'],
            clear: ['#ffffff', '#f1f5f9'],
            emerald: ['#059669', '#047857'],
            ocean: ['#0ea5e9', '#0284c7'],
            tropical: ['#06b6d4', '#0891b2'],
            blush: ['#fb7185', '#f43f5e'],
            caramel: ['#a16207', '#92400e'],
            ice: ['#e0f2fe', '#bae6fd'],
            tangerine: ['#fb923c', '#f97316']
        };
        
        const colors = colorMap[color] || colorMap.golden;
        const opacity = intensity === 'light' ? '0.7' : intensity === 'vibrant' ? '1' : '0.85';
        
        return `
            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:${opacity}" />
                <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:${opacity}" />
            </linearGradient>
        `;
    }

    getIceEffect() {
        return `
            <rect x="80" y="130" width="12" height="12" rx="2" fill="rgba(255,255,255,0.6)" opacity="0.8"/>
            <rect x="110" y="145" width="10" height="10" rx="2" fill="rgba(255,255,255,0.6)" opacity="0.7"/>
            <rect x="95" y="160" width="8" height="8" rx="1" fill="rgba(255,255,255,0.6)" opacity="0.6"/>
        `;
    }

    getBubbleEffect() {
        return `
            <circle cx="90" cy="180" r="2" fill="rgba(255,255,255,0.6)" opacity="0.6">
                <animate attributeName="cy" values="180;120;180" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="110" cy="190" r="1.5" fill="rgba(255,255,255,0.6)" opacity="0.5">
                <animate attributeName="cy" values="190;130;190" dur="4s" repeatCount="indefinite"/>
            </circle>
        `;
    }

    getGarnishElements(garnish) {
        if (garnish.includes('mint')) {
            return `
                <g transform="translate(120, 80)">
                    <path d="M0 0 Q5 -5 10 0 Q5 5 0 0" fill="#22c55e"/>
                    <line x1="5" y1="0" x2="5" y2="15" stroke="#15803d" stroke-width="1"/>
                </g>
            `;
        }
        
        if (garnish.includes('lime')) {
            return `
                <g transform="translate(130, 90)">
                    <circle cx="0" cy="0" r="8" fill="#65a30d"/>
                    <path d="M-6 0 L6 0" stroke="#365314" stroke-width="1"/>
                </g>
            `;
        }
        
        return `
            <g transform="translate(125, 85)">
                <circle cx="0" cy="0" r="3" fill="#fbbf24"/>
            </g>
        `;
    }

    displayRecipe(recipe) {
        try {
            console.log('Displaying recipe:', recipe);
            
            if (!recipe) {
                throw new Error('Recipe is null or undefined');
            }

            const button = document.getElementById('generate-btn');
            if (button) {
                button.classList.remove('loading');
                button.textContent = '✨ Generate My Perfect Drink';
            }

            const placeholder = document.getElementById('output-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // Apply matching color swatch background to the entire output section
            this.applyColorSwatchBackground(recipe.color, recipe.colorIntensity);

        const drinkImageHTML = this.generateDrinkImage(recipe);
        const colorSwatchHTML = this.generateColorSwatch(recipe.color, recipe.colorIntensity, recipe.colorDescription);

        const recipeHTML = `
            <div class="recipe-display">
                <!-- Hero Section with Drink Image and Name -->
                <div class="recipe-hero">
                    <div class="hero-content">
                        <div class="drink-showcase">
                            ${drinkImageHTML}
                            <div class="drink-type-badge ${recipe.type}">
                                ${recipe.type === 'alcoholic' ? '🍸 Cocktail' : '🥤 Mocktail'}
                            </div>
                        </div>
                        <div class="hero-text">
                            <div class="recipe-title-section">
                                <h1 class="recipe-name">${recipe.name}</h1>
                                <div class="recipe-subtitle">${recipe.description}</div>
                                <div class="recipe-mood-tag">
                                    <span class="mood-indicator">${this.getMoodEmoji(recipe.mood[0])}</span>
                                    <span class="mood-text">Perfect for ${recipe.mood[0]} moments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Color Swatch Display -->
                ${colorSwatchHTML}

                <!-- Recipe Overview Cards -->
                <div class="recipe-overview">
                    <div class="overview-header">
                        <h2>🍹 Recipe Overview</h2>
                        <div class="overview-divider"></div>
                    </div>
                    <div class="overview-grid">
                        <div class="overview-card glass-card">
                            <div class="card-icon">🥃</div>
                            <div class="card-title">Glassware</div>
                            <div class="card-value">${recipe.glassType}</div>
                            <div class="card-description">Perfectly chosen for optimal presentation</div>
                        </div>
                        <div class="overview-card color-card">
                            <div class="card-icon">🎨</div>
                            <div class="card-title">Color Profile</div>
                            <div class="card-value">${recipe.color.charAt(0).toUpperCase() + recipe.color.slice(1)}</div>
                            <div class="card-description">${recipe.colorDescription}</div>
                        </div>
                        <div class="overview-card flavor-card">
                            <div class="card-icon">👅</div>
                            <div class="card-title">Primary Flavor</div>
                            <div class="card-value">${recipe.flavorProfile[0]}</div>
                            <div class="card-description">Dominant taste experience</div>
                        </div>
                        <div class="overview-card mood-card">
                            <div class="card-icon">${this.getMoodEmoji(recipe.mood[0])}</div>
                            <div class="card-title">Mood Match</div>
                            <div class="card-value">${recipe.mood[0].charAt(0).toUpperCase() + recipe.mood[0].slice(1)}</div>
                            <div class="card-description">Crafted for your current vibe</div>
                        </div>
                    </div>
                </div>

                <!-- Step-by-Step Instructions -->
                <div class="recipe-instructions-section">
                    <div class="instructions-header">
                        <h2>📋 Step-by-Step Instructions</h2>
                        <div class="instructions-subtitle">Follow these steps for the perfect drink</div>
                        <div class="instructions-divider"></div>
                    </div>
                    <div class="instructions-timeline">
                        ${recipe.instructions.map((instruction, index) => `
                            <div class="instruction-item" data-step="${index + 1}">
                                <div class="step-indicator">
                                    <div class="step-number">${index + 1}</div>
                                    <div class="step-connector"></div>
                                </div>
                                <div class="step-content">
                                    <div class="step-title">Step ${index + 1}</div>
                                    <div class="step-description">${instruction}</div>
                                    <div class="step-icon">${this.getStepIcon(instruction, index)}</div>
                                </div>
                            </div>
                        `).join('')}
                        <div class="final-step">
                            <div class="step-indicator">
                                <div class="step-number final">🌟</div>
                            </div>
                            <div class="step-content">
                                <div class="step-title">Enjoy!</div>
                                <div class="step-description">Garnish with ${recipe.garnish} and serve immediately</div>
                                <div class="step-icon">🎉</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Flavor Profile Showcase -->
                <div class="flavor-showcase">
                    <div class="flavor-header">
                        <h2>👅 Flavor Journey</h2>
                        <div class="flavor-subtitle">Experience these delightful taste notes</div>
                        <div class="flavor-divider"></div>
                    </div>
                    <div class="flavor-wheel">
                        <div class="flavor-center">
                            <div class="flavor-center-icon">✨</div>
                            <div class="flavor-center-text">Taste Profile</div>
                        </div>
                        <div class="flavor-segments">
                            ${recipe.flavorProfile.map((flavor, index) => `
                                <div class="flavor-segment" style="--segment-delay: ${index * 0.2}s">
                                    <div class="flavor-tag-enhanced">
                                        <span class="flavor-icon">${this.getFlavorIcon(flavor)}</span>
                                        <span class="flavor-name">${flavor}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Recipe Footer -->
                <div class="recipe-footer">
                    <div class="footer-content">
                        <div class="recipe-stats">
                            <div class="stat-item">
                                <span class="stat-icon">⏱️</span>
                                <span class="stat-value">2-3 min</span>
                                <span class="stat-label">Prep Time</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-icon">🎯</span>
                                <span class="stat-value">${recipe.type === 'alcoholic' ? 'Medium' : 'Easy'}</span>
                                <span class="stat-label">Difficulty</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-icon">👥</span>
                                <span class="stat-value">1 serving</span>
                                <span class="stat-label">Serves</span>
                            </div>
                        </div>
                        <div class="recipe-signature">
                            <div class="signature-text">Crafted by AI Mixologist</div>
                            <div class="signature-icon">🤖✨</div>
                        </div>
                    </div>
                </div>

                <!-- Print & Share Actions -->
                <div class="recipe-actions">
                    <button class="action-btn favorite-btn" id="current-favorite-btn" onclick="drinkMixer.toggleCurrentFavorite()">
                        <span class="btn-icon">❤️</span>
                        <span class="btn-text">Add to Favorites</span>
                        <div class="btn-ripple"></div>
                    </button>
                    <button class="action-btn print-btn" onclick="drinkMixer.printRecipe()">
                        <span class="btn-icon">🖨️</span>
                        <span class="btn-text">Print Recipe</span>
                        <div class="btn-ripple"></div>
                    </button>
                    <button class="action-btn save-btn" onclick="drinkMixer.saveRecipe()">
                        <span class="btn-icon">💾</span>
                        <span class="btn-text">Save Recipe</span>
                        <div class="btn-ripple"></div>
                    </button>
                    <button class="action-btn share-btn" onclick="drinkMixer.shareRecipe()">
                        <span class="btn-icon">📤</span>
                        <span class="btn-text">Share Recipe</span>
                        <div class="btn-ripple"></div>
                    </button>
                </div>
            </div>
        `;

        const container = document.getElementById('recipe-container');
        if (!container) {
            throw new Error('Recipe container not found');
        }
        container.innerHTML = recipeHTML;
        container.classList.add('show');
        
        // Store current recipe for printing/sharing
        this.currentRecipe = recipe;
        
        // Add to history
        this.addToHistory(recipe);
        
        // Update favorite button state
        this.updateCurrentFavoriteButton();
        
        // Add enhanced animations
        this.addEnhancedAnimations();
        } catch (error) {
            console.error('Error displaying recipe:', error);
            this.showError();
        }
    }

    addEnhancedAnimations() {
        // Animate recipe cards with staggered entrance
        const cards = document.querySelectorAll('.overview-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('card-entrance');
        });

        // Animate flavor tags with floating effect
        const flavorTags = document.querySelectorAll('.flavor-tag-enhanced');
        flavorTags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.2}s`;
            tag.classList.add('flavor-float');
        });

        // Add ripple effect to action buttons
        this.addRippleEffect();

        // Animate drink image with enhanced floating
        const drinkImage = document.querySelector('.drink-svg');
        if (drinkImage) {
            drinkImage.classList.add('enhanced-float');
        }

        // Add sparkle effects
        this.addSparkleEffects();
    }

    addRippleEffect() {
        const buttons = document.querySelectorAll('.action-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = button.querySelector('.btn-ripple');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-animate');
                
                setTimeout(() => {
                    ripple.classList.remove('ripple-animate');
                }, 600);
            });
        });
    }

    addSparkleEffects() {
        const hero = document.querySelector('.recipe-hero');
        if (hero) {
            for (let i = 0; i < 5; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.animationDelay = Math.random() * 3 + 's';
                hero.appendChild(sparkle);
            }
        }
    }

    printRecipe() {
        if (!this.currentRecipe) return;
        
        const printContent = this.generatePrintableRecipe(this.currentRecipe);
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${this.currentRecipe.name} - Recipe Card</title>
                <style>
                    ${this.getPrintStyles()}
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Auto-print after content loads
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    generatePrintableRecipe(recipe) {
        return `
            <div class="print-recipe-card">
                <div class="print-header">
                    <h1 class="print-title">${recipe.name}</h1>
                    <div class="print-subtitle">${recipe.description}</div>
                    <div class="print-badges">
                        <span class="print-badge type-badge">${recipe.type === 'alcoholic' ? '🍸 Cocktail' : '🥤 Mocktail'}</span>
                        <span class="print-badge mood-badge">${this.getMoodEmoji(recipe.mood[0])} ${recipe.mood[0].charAt(0).toUpperCase() + recipe.mood[0].slice(1)}</span>
                    </div>
                </div>

                <div class="print-content">
                    <div class="print-section">
                        <h2>📋 Instructions</h2>
                        <ol class="print-instructions">
                            ${recipe.instructions.map(instruction => `
                                <li>${instruction}</li>
                            `).join('')}
                            <li><strong>Garnish with ${recipe.garnish} and serve immediately</strong></li>
                        </ol>
                    </div>

                    <div class="print-details">
                        <div class="print-detail-grid">
                            <div class="print-detail-item">
                                <strong>🥃 Glass Type:</strong><br>
                                ${recipe.glassType}
                            </div>
                            <div class="print-detail-item">
                                <strong>🎨 Color:</strong><br>
                                ${recipe.colorDescription}
                            </div>
                            <div class="print-detail-item">
                                <strong>⏱️ Prep Time:</strong><br>
                                2-3 minutes
                            </div>
                            <div class="print-detail-item">
                                <strong>👥 Serves:</strong><br>
                                1 person
                            </div>
                        </div>
                    </div>

                    <div class="print-section">
                        <h2>👅 Flavor Profile</h2>
                        <div class="print-flavors">
                            ${recipe.flavorProfile.map(flavor => `
                                <span class="print-flavor-tag">${this.getFlavorIcon(flavor)} ${flavor}</span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="print-footer">
                        <div class="print-signature">
                            <p>Crafted by AI Mixologist 🤖✨</p>
                            <p class="print-date">Generated on ${new Date().toLocaleDateString()}</p>
                        </div>
                        <div class="print-qr">
                            <div class="qr-placeholder">
                                <div class="qr-text">Scan to recreate<br>this recipe online</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPrintStyles() {
        return `
            @page {
                margin: 0.5in;
                size: letter;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Georgia', serif;
                line-height: 1.6;
                color: #333;
                background: white;
            }
            
            .print-recipe-card {
                max-width: 100%;
                margin: 0 auto;
                background: white;
                border: 2px solid #667eea;
                border-radius: 15px;
                overflow: hidden;
            }
            
            .print-header {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .print-title {
                font-size: 2.5rem;
                font-weight: bold;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .print-subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
                margin-bottom: 20px;
                font-style: italic;
            }
            
            .print-badges {
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .print-badge {
                background: rgba(255,255,255,0.2);
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 600;
                border: 1px solid rgba(255,255,255,0.3);
            }
            
            .print-content {
                padding: 30px;
            }
            
            .print-section {
                margin-bottom: 30px;
            }
            
            .print-section h2 {
                font-size: 1.5rem;
                color: #667eea;
                margin-bottom: 15px;
                border-bottom: 2px solid #667eea;
                padding-bottom: 5px;
            }
            
            .print-instructions {
                list-style: none;
                counter-reset: step-counter;
            }
            
            .print-instructions li {
                counter-increment: step-counter;
                margin-bottom: 15px;
                padding-left: 40px;
                position: relative;
                line-height: 1.6;
            }
            
            .print-instructions li::before {
                content: counter(step-counter);
                position: absolute;
                left: 0;
                top: 0;
                background: #667eea;
                color: white;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 0.9rem;
            }
            
            .print-detail-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .print-detail-item {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }
            
            .print-flavors {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .print-flavor-tag {
                background: #f8f9fa;
                padding: 8px 15px;
                border-radius: 20px;
                border: 1px solid #667eea;
                font-weight: 500;
            }
            
            .print-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #eee;
            }
            
            .print-signature {
                text-align: left;
            }
            
            .print-date {
                font-size: 0.9rem;
                color: #666;
                margin-top: 5px;
            }
            
            .qr-placeholder {
                width: 80px;
                height: 80px;
                border: 2px dashed #667eea;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            
            .qr-text {
                font-size: 0.7rem;
                color: #667eea;
                line-height: 1.2;
            }
            
            @media print {
                .print-recipe-card {
                    border: none;
                    box-shadow: none;
                }
                
                .print-header {
                    background: #667eea !important;
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }
            }
        `;
    }

    saveRecipe() {
        if (!this.currentRecipe) return;
        
        const savedRecipes = JSON.parse(localStorage.getItem('savedDrinkRecipes') || '[]');
        const recipeToSave = {
            ...this.currentRecipe,
            savedDate: new Date().toISOString(),
            id: Date.now()
        };
        
        savedRecipes.push(recipeToSave);
        localStorage.setItem('savedDrinkRecipes', JSON.stringify(savedRecipes));
        
        // Show success animation
        this.showSaveSuccess();
    }

    shareRecipe() {
        if (!this.currentRecipe) return;
        
        const shareText = `Check out this amazing ${this.currentRecipe.type === 'alcoholic' ? 'cocktail' : 'mocktail'} recipe: "${this.currentRecipe.name}"!\n\n${this.currentRecipe.description}\n\nFlavor Profile: ${this.currentRecipe.flavorProfile.join(', ')}\n\nCreated with AI Drink Mixer 🍹✨`;
        
        if (navigator.share) {
            navigator.share({
                title: `${this.currentRecipe.name} - Drink Recipe`,
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showShareSuccess();
            });
        }
    }

    showSaveSuccess() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">💾</span>
                <span class="notification-text">Recipe saved successfully!</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showShareSuccess() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">📤</span>
                <span class="notification-text">Recipe copied to clipboard!</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // History and Favorites System
    initializeStorage() {
        // Initialize localStorage if not exists
        if (!localStorage.getItem('drinkHistory')) {
            localStorage.setItem('drinkHistory', JSON.stringify([]));
        }
        if (!localStorage.getItem('favoriteDrinks')) {
            localStorage.setItem('favoriteDrinks', JSON.stringify([]));
        }
    }

    updateCounts() {
        const history = this.getHistory();
        const favorites = this.getFavorites();
        
        document.getElementById('history-count').textContent = history.length;
        document.getElementById('favorites-count').textContent = favorites.length;
    }

    addToHistory(recipe) {
        const history = this.getHistory();
        const historyItem = {
            ...recipe,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            ingredients: [...this.selectedIngredients]
        };
        
        // Add to beginning of array (most recent first)
        history.unshift(historyItem);
        
        // Keep only last 50 recipes
        if (history.length > 50) {
            history.splice(50);
        }
        
        localStorage.setItem('drinkHistory', JSON.stringify(history));
        this.updateCounts();
    }

    getHistory() {
        return JSON.parse(localStorage.getItem('drinkHistory') || '[]');
    }

    getFavorites() {
        return JSON.parse(localStorage.getItem('favoriteDrinks') || '[]');
    }

    toggleCurrentFavorite() {
        if (!this.currentRecipe) return;
        
        const favorites = this.getFavorites();
        const existingIndex = favorites.findIndex(fav => 
            fav.name === this.currentRecipe.name && 
            JSON.stringify(fav.ingredients) === JSON.stringify([...this.selectedIngredients])
        );
        
        if (existingIndex > -1) {
            // Remove from favorites
            favorites.splice(existingIndex, 1);
            this.showNotification('💔 Removed from favorites', 'remove');
        } else {
            // Add to favorites
            const favoriteItem = {
                ...this.currentRecipe,
                id: Date.now(),
                favoritedAt: new Date().toISOString(),
                ingredients: [...this.selectedIngredients]
            };
            favorites.push(favoriteItem);
            this.showNotification('❤️ Added to favorites!', 'add');
        }
        
        localStorage.setItem('favoriteDrinks', JSON.stringify(favorites));
        this.updateCounts();
        this.updateCurrentFavoriteButton();
    }

    updateCurrentFavoriteButton() {
        if (!this.currentRecipe) return;
        
        const favorites = this.getFavorites();
        const isFavorite = favorites.some(fav => 
            fav.name === this.currentRecipe.name && 
            JSON.stringify(fav.ingredients) === JSON.stringify([...this.selectedIngredients])
        );
        
        const btn = document.getElementById('current-favorite-btn');
        const icon = btn.querySelector('.btn-icon');
        const text = btn.querySelector('.btn-text');
        
        if (isFavorite) {
            icon.textContent = '💖';
            text.textContent = 'Remove from Favorites';
            btn.classList.add('favorited');
        } else {
            icon.textContent = '❤️';
            text.textContent = 'Add to Favorites';
            btn.classList.remove('favorited');
        }
    }

    toggleFavorites() {
        const panel = document.getElementById('favorites-panel');
        panel.classList.add('show');
        this.loadFavorites();
    }

    closeFavorites() {
        const panel = document.getElementById('favorites-panel');
        panel.classList.remove('show');
    }

    toggleHistory() {
        const panel = document.getElementById('history-panel');
        panel.classList.add('show');
        this.loadHistory();
    }

    closeHistory() {
        const panel = document.getElementById('history-panel');
        panel.classList.remove('show');
    }

    loadFavorites() {
        const favorites = this.getFavorites();
        const container = document.getElementById('favorites-list');
        
        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💔</div>
                    <h3>No favorites yet!</h3>
                    <p>Create some amazing drinks and add them to your favorites</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = favorites.map(recipe => this.createRecipeCard(recipe, 'favorite')).join('');
    }

    loadHistory() {
        const history = this.getHistory();
        const container = document.getElementById('history-list');
        
        if (history.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📖</div>
                    <h3>No history yet!</h3>
                    <p>Start creating drinks to build your recipe history</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = history.map(recipe => this.createRecipeCard(recipe, 'history')).join('');
    }

    createRecipeCard(recipe, type) {
        const date = new Date(recipe.createdAt || recipe.favoritedAt).toLocaleDateString();
        const time = new Date(recipe.createdAt || recipe.favoritedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        return `
            <div class="recipe-card" onclick="drinkMixer.openRecipeModal('${recipe.id}', '${type}')">
                <div class="recipe-card-header">
                    <h3 class="recipe-card-name">${recipe.name}</h3>
                    <div class="recipe-card-type ${recipe.type}">
                        ${recipe.type === 'alcoholic' ? '🍸' : '🥤'}
                    </div>
                </div>
                <div class="recipe-card-description">${recipe.description}</div>
                <div class="recipe-card-details">
                    <div class="recipe-card-color">
                        <div class="color-dot color-${recipe.color}"></div>
                        <span>${recipe.color}</span>
                    </div>
                    <div class="recipe-card-mood">
                        <span>${this.getMoodEmoji(recipe.mood[0])}</span>
                        <span>${recipe.mood[0]}</span>
                    </div>
                </div>
                <div class="recipe-card-flavors">
                    ${recipe.flavorProfile.slice(0, 3).map(flavor => `
                        <span class="flavor-mini-tag">${this.getFlavorIcon(flavor)} ${flavor}</span>
                    `).join('')}
                </div>
                <div class="recipe-card-footer">
                    <div class="recipe-card-date">
                        <span class="date">${date}</span>
                        <span class="time">${time}</span>
                    </div>
                    <div class="recipe-card-actions">
                        <button class="mini-btn favorite-mini-btn" onclick="event.stopPropagation(); drinkMixer.toggleRecipeFavorite('${recipe.id}', '${type}')">
                            ${this.isRecipeFavorited(recipe) ? '💖' : '❤️'}
                        </button>
                        <button class="mini-btn recreate-mini-btn" onclick="event.stopPropagation(); drinkMixer.recreateRecipeFromCard('${recipe.id}', '${type}')">
                            🔄
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    isRecipeFavorited(recipe) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.name === recipe.name);
    }

    openRecipeModal(recipeId, type) {
        const recipes = type === 'favorite' ? this.getFavorites() : this.getHistory();
        const recipe = recipes.find(r => r.id.toString() === recipeId);
        
        if (!recipe) return;
        
        this.selectedModalRecipe = recipe;
        const modal = document.getElementById('recipe-modal');
        const nameEl = document.getElementById('modal-recipe-name');
        const contentEl = document.getElementById('modal-recipe-content');
        
        nameEl.textContent = recipe.name;
        contentEl.innerHTML = this.createModalContent(recipe);
        
        // Update favorite button
        const favoriteBtn = document.getElementById('modal-favorite-btn');
        const isFavorite = this.isRecipeFavorited(recipe);
        favoriteBtn.innerHTML = `<span class="btn-icon">${isFavorite ? '💖' : '❤️'}</span> ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}`;
        
        modal.classList.add('show');
    }

    createModalContent(recipe) {
        return `
            <div class="modal-recipe-display">
                <div class="modal-recipe-header">
                    <div class="modal-recipe-info">
                        <div class="modal-recipe-description">${recipe.description}</div>
                        <div class="modal-recipe-badges">
                            <span class="modal-badge type-badge">${recipe.type === 'alcoholic' ? '🍸 Cocktail' : '🥤 Mocktail'}</span>
                            <span class="modal-badge mood-badge">${this.getMoodEmoji(recipe.mood[0])} ${recipe.mood[0]}</span>
                            <span class="modal-badge color-badge">🎨 ${recipe.color}</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-recipe-sections">
                    <div class="modal-section">
                        <h3>📋 Instructions</h3>
                        <ol class="modal-instructions">
                            ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                            <li><strong>Garnish with ${recipe.garnish} and serve immediately</strong></li>
                        </ol>
                    </div>
                    
                    <div class="modal-section">
                        <h3>👅 Flavor Profile</h3>
                        <div class="modal-flavors">
                            ${recipe.flavorProfile.map(flavor => `
                                <span class="modal-flavor-tag">${this.getFlavorIcon(flavor)} ${flavor}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>🥃 Details</h3>
                        <div class="modal-details-grid">
                            <div class="modal-detail-item">
                                <strong>Glass Type:</strong> ${recipe.glassType}
                            </div>
                            <div class="modal-detail-item">
                                <strong>Color:</strong> ${recipe.colorDescription}
                            </div>
                            <div class="modal-detail-item">
                                <strong>Ingredients:</strong> ${recipe.ingredients ? recipe.ingredients.join(', ') : 'Custom blend'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    closeModal() {
        const modal = document.getElementById('recipe-modal');
        modal.classList.remove('show');
        this.selectedModalRecipe = null;
    }

    recreateRecipe() {
        if (!this.selectedModalRecipe) return;
        
        // Close modal and panels
        this.closeModal();
        this.closeFavorites();
        this.closeHistory();
        
        // Set ingredients and selections
        if (this.selectedModalRecipe.ingredients) {
            this.selectedIngredients.clear();
            this.selectedModalRecipe.ingredients.forEach(ing => this.selectedIngredients.add(ing));
            this.updateSelectedIngredientsDisplay();
        }
        
        // Set mood
        this.selectedMood = this.selectedModalRecipe.mood[0];
        document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
        const moodOption = document.querySelector(`[data-mood="${this.selectedMood}"]`);
        if (moodOption) moodOption.classList.add('selected');
        
        // Set type
        this.selectedType = this.selectedModalRecipe.type === 'alcoholic' ? 'cocktail' : 'mocktail';
        document.querySelectorAll('.drink-type-option').forEach(opt => opt.classList.remove('selected'));
        const typeOption = document.querySelector(`[data-type="${this.selectedType}"]`);
        if (typeOption) typeOption.classList.add('selected');
        
        // Display the recipe
        this.displayRecipe(this.selectedModalRecipe);
        
        this.showNotification('🔄 Recipe recreated!', 'success');
    }

    recreateRecipeFromCard(recipeId, type) {
        const recipes = type === 'favorite' ? this.getFavorites() : this.getHistory();
        const recipe = recipes.find(r => r.id.toString() === recipeId);
        
        if (!recipe) return;
        
        this.selectedModalRecipe = recipe;
        this.recreateRecipe();
    }

    toggleRecipeFavorite(recipeId, type) {
        const recipes = type === 'favorite' ? this.getFavorites() : this.getHistory();
        const recipe = recipes.find(r => r.id.toString() === recipeId);
        
        if (!recipe) return;
        
        const favorites = this.getFavorites();
        const existingIndex = favorites.findIndex(fav => fav.name === recipe.name);
        
        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
            this.showNotification('💔 Removed from favorites', 'remove');
        } else {
            const favoriteItem = { ...recipe, favoritedAt: new Date().toISOString() };
            favorites.push(favoriteItem);
            this.showNotification('❤️ Added to favorites!', 'add');
        }
        
        localStorage.setItem('favoriteDrinks', JSON.stringify(favorites));
        this.updateCounts();
        
        // Refresh the current panel
        if (type === 'favorite') {
            this.loadFavorites();
        } else {
            this.loadHistory();
        }
    }

    toggleModalFavorite() {
        if (!this.selectedModalRecipe) return;
        
        const favorites = this.getFavorites();
        const existingIndex = favorites.findIndex(fav => fav.name === this.selectedModalRecipe.name);
        
        if (existingIndex > -1) {
            favorites.splice(existingIndex, 1);
            this.showNotification('💔 Removed from favorites', 'remove');
        } else {
            const favoriteItem = { ...this.selectedModalRecipe, favoritedAt: new Date().toISOString() };
            favorites.push(favoriteItem);
            this.showNotification('❤️ Added to favorites!', 'add');
        }
        
        localStorage.setItem('favoriteDrinks', JSON.stringify(favorites));
        this.updateCounts();
        
        // Update button
        const favoriteBtn = document.getElementById('modal-favorite-btn');
        const isFavorite = existingIndex === -1;
        favoriteBtn.innerHTML = `<span class="btn-icon">${isFavorite ? '💖' : '❤️'}</span> ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}`;
    }

    printModalRecipe() {
        if (!this.selectedModalRecipe) return;
        this.printRecipeData(this.selectedModalRecipe);
    }

    printRecipeData(recipe) {
        const printContent = this.generatePrintableRecipe(recipe);
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${recipe.name} - Recipe Card</title>
                <style>${this.getPrintStyles()}</style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    }

    clearFavorites() {
        if (confirm('Are you sure you want to clear all favorites? This cannot be undone.')) {
            localStorage.setItem('favoriteDrinks', JSON.stringify([]));
            this.updateCounts();
            this.loadFavorites();
            this.showNotification('🗑️ All favorites cleared', 'remove');
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear your recipe history? This cannot be undone.')) {
            localStorage.setItem('drinkHistory', JSON.stringify([]));
            this.updateCounts();
            this.loadHistory();
            this.showNotification('🗑️ History cleared', 'remove');
        }
    }

    exportFavorites() {
        const favorites = this.getFavorites();
        if (favorites.length === 0) {
            this.showNotification('📭 No favorites to export', 'info');
            return;
        }
        
        const exportData = {
            exportDate: new Date().toISOString(),
            appName: 'AI Drink Mixer',
            version: '1.0',
            favorites: favorites
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `drink-mixer-favorites-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('📤 Favorites exported!', 'success');
    }

    toggleHistoryFilter() {
        // Simple filter implementation - could be expanded
        const container = document.getElementById('history-list');
        const currentContent = container.innerHTML;
        
        if (currentContent.includes('Cocktail')) {
            // Show only mocktails
            const history = this.getHistory().filter(recipe => recipe.type === 'non-alcoholic');
            container.innerHTML = history.map(recipe => this.createRecipeCard(recipe, 'history')).join('');
            this.showNotification('🔍 Showing mocktails only', 'info');
        } else {
            // Show all
            this.loadHistory();
            this.showNotification('🔍 Showing all recipes', 'info');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `success-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-text">${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    applyColorSwatchBackground(color, intensity) {
        const outputSection = document.querySelector('.output-section');
        
        if (!outputSection) {
            console.error('Output section not found');
            return;
        }
        
        // Remove any existing color classes
        outputSection.className = outputSection.className.replace(/color-\w+/g, '');
        outputSection.className = outputSection.className.replace(/\b(light|medium|dark|vibrant)\b/g, '');
        
        // Add new color classes
        if (color) {
            outputSection.classList.add(`color-${color}`);
        }
        if (intensity) {
            outputSection.classList.add(intensity);
        }
        outputSection.classList.add('color-swatch-background');
    }

    generateColorSwatch(color, intensity, description) {
        return `
            <div class="color-swatch-panel">
                <div class="swatch-header">
                    <h4>🎨 Drink Color Match</h4>
                </div>
                <div class="swatch-display">
                    <div class="main-swatch color-${color} ${intensity || ''}">
                        <div class="swatch-overlay"></div>
                        <div class="swatch-info">
                            <div class="swatch-name">${color.charAt(0).toUpperCase() + color.slice(1)}</div>
                            <div class="swatch-intensity">${intensity || 'medium'} intensity</div>
                        </div>
                    </div>
                    <div class="swatch-description">
                        <p>${description}</p>
                    </div>
                </div>
                <div class="color-palette">
                    ${this.generateColorPalette(color)}
                </div>
            </div>
        `;
    }

    generateColorPalette(baseColor) {
        const colorFamilies = {
            ruby: ['crimson', 'cherry', 'red'],
            rose: ['blush', 'pink', 'coral'],
            mint: ['emerald', 'green', 'lime'],
            sunshine: ['golden', 'yellow', 'amber'],
            sunset: ['orange', 'tangerine', 'copper'],
            golden: ['amber', 'honey', 'sunshine'],
            amber: ['copper', 'caramel', 'golden'],
            copper: ['brown', 'chocolate', 'amber'],
            crystal: ['clear', 'ice', 'pearl'],
            clear: ['crystal', 'ice', 'pearl'],
            emerald: ['mint', 'forest', 'green'],
            ocean: ['blue', 'tropical', 'sapphire'],
            tropical: ['ocean', 'paradise', 'blue'],
            blush: ['rose', 'coral', 'pink'],
            caramel: ['amber', 'honey', 'copper'],
            ice: ['crystal', 'clear', 'pearl'],
            tangerine: ['sunset', 'orange', 'coral']
        };

        const family = colorFamilies[baseColor] || ['golden', 'amber', 'honey'];
        
        return family.map(color => `
            <div class="palette-swatch color-${color}" title="${color.charAt(0).toUpperCase() + color.slice(1)}">
                <div class="palette-swatch-inner"></div>
            </div>
        `).join('');
    }

    getMoodEmoji(mood) {
        const moodEmojis = {
            relaxed: '😌',
            party: '🎉',
            romantic: '💘',
            sad: '😞',
            stress: '😵',
            energetic: '⚡'
        };
        return moodEmojis[mood] || '😊';
    }

    getStepIcon(instruction, index) {
        const stepIcons = {
            0: '🥄', // First step - usually mixing
            1: '🧊', // Second step - usually ice/shaking
            2: '🍸', // Third step - usually pouring
            3: '🌿', // Fourth step - usually garnish
            4: '🎉'  // Final step - serve
        };
        
        if (instruction.toLowerCase().includes('shake')) return '🥃';
        if (instruction.toLowerCase().includes('stir')) return '🥄';
        if (instruction.toLowerCase().includes('ice')) return '🧊';
        if (instruction.toLowerCase().includes('strain')) return '🍸';
        if (instruction.toLowerCase().includes('garnish')) return '🌿';
        if (instruction.toLowerCase().includes('serve')) return '🎉';
        
        return stepIcons[index] || '✨';
    }

    getFlavorIcon(flavor) {
        const flavorIcons = {
            citrusy: '🍋',
            fruity: '🍓',
            herbal: '🌿',
            spicy: '🌶️',
            smooth: '🌊',
            bold: '⚡',
            sweet: '🍯',
            elegant: '💎',
            comforting: '🤗',
            rich: '🍫',
            calming: '🕯️',
            soothing: '☁️',
            zesty: '⚡',
            invigorating: '💨',
            mellow: '🌙',
            energizing: '☀️',
            balanced: '⚖️'
        };
        return flavorIcons[flavor.toLowerCase()] || '✨';
    }

    showError() {
        const button = document.getElementById('generate-btn');
        button.classList.remove('loading');
        button.textContent = '✨ Generate My Perfect Drink';

        document.getElementById('recipe-container').innerHTML = `
            <div style="text-align: center; padding: 50px; color: #e74c3c;">
                <div style="font-size: 3rem; margin-bottom: 20px;">😅</div>
                <h3>Oops! Something went wrong</h3>
                <p>Our AI mixologist encountered an issue. Please try again!</p>
                <div style="margin-top: 20px;">
                    <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        🔄 Refresh Page
                    </button>
                </div>
            </div>
        `;
        document.getElementById('recipe-container').classList.add('show');
    }
}

// Initialize the app when DOM is loaded
let drinkMixer;
document.addEventListener('DOMContentLoaded', () => {
    drinkMixer = new DrinkMixer();
});