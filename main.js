// Western RPG Character Creation Logic
const charList = ['STR', 'CON', 'DEX', 'POW', 'APP', 'EDU', 'INT', 'SIZ'];
let character = { 
    name: '',
    archetype: null, 
    occupation: null, 
    characteristics: {}, 
    skills: {}, 
    talents: [], 
    age: null, 
    luck: 0, 
    heritageText: '',
    backstory: {}
};
let coreCharacteristic = null;
let coreRollValue = 0;
const totalCharPoints = 460;
let specialtySkillCounter = 0;
let skillPoints = {
    arch: { total: 100, spent: 0 },
    occ: { total: 0, spent: 0 },
    pers: { total: 0, spent: 0 }
};

// --- Initialization --- //
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() { 
    populateSelect('archetype-select', Object.keys(ARCHETYPES)); 
}

function populateSelect(id, options) { 
    const select = document.getElementById(id); 
    if (!select) return;
    select.innerHTML = `<option value="">Select...</option>`; 
    options.forEach(opt => { 
        const option = document.createElement('option'); 
        option.value = opt; 
        option.textContent = opt; 
        select.appendChild(option); 
    }); 
}

// --- Step Navigation --- //
function nextStep(step) { 
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden')); 
    const nextSection = document.getElementById(`step${step}`);
    if (nextSection) nextSection.classList.remove('hidden');

    if (step === 6) calculateAndDisplaySkillPoints(); 
    if (step === 7) { 
        populateAllTalentsAndHindrances(); 
        const arch = ARCHETYPES[document.getElementById('archetype-select').value]; 
        document.getElementById('arch-talent').textContent = arch.talent; 
    } 
}

function prevStep(toStep) { 
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden')); 
    const prevSection = document.getElementById(`step${toStep}`);
    if (prevSection) prevSection.classList.remove('hidden');
}


// --- Step 1: Archetype --- //
function displayArchetypeInfo() { 
    const select = document.getElementById('archetype-select'); 
    const infoDiv = document.getElementById('archetype-info'); 
    const archetypeKey = select.value; 
    if (!archetypeKey) { 
        infoDiv.classList.add('hidden'); 
        return; 
    } 
    const archetype = ARCHETYPES[archetypeKey]; 
    infoDiv.innerHTML = `<h4>Core Characteristic(s):</h4><p>${archetype.core.join(', ')}</p><h4>Archetype Talent: ${archetype.talent}</h4><p>${archetype.talentDesc}</p><h4>Bonus Archetype Skills:</h4><ul>${archetype.bonusSkills.map(skill => `<li>${skill}</li>`).join('')}</ul><h4>Allowed Occupations:</h4><p>${archetype.occupations.join(', ')}</p>`; 
    infoDiv.classList.remove('hidden'); 
}

function selectArchetype() { 
    const value = document.getElementById('archetype-select').value; 
    if (!value) return alert("Please select an Archetype."); 
    character.archetype = ARCHETYPES[value]; 
    character.archetype.name = value;
    populateSelect('occupation-select', character.archetype.occupations); 
    updateCoreCharSelect(); 
    document.getElementById('occupation-info').classList.add('hidden'); 
    document.getElementById('occupation-select').value = ''; 
    nextStep(2); 
}

// --- Step 2: Occupation --- //
function displayOccupationInfo() { 
    const select = document.getElementById('occupation-select'); 
    const infoDiv = document.getElementById('occupation-info'); 
    const occupationKey = select.value; 
    if (!occupationKey) { 
        infoDiv.classList.add('hidden'); 
        return; 
    } 
    const occupation = OCCUPATIONS[occupationKey]; 
    infoDiv.innerHTML = `<h4>Skill Point Calculation:</h4><p>${occupation.skillPointsText}</p><h4>Credit Rating Range:</h4><p>${occupation.crRange[0]} - ${occupation.crRange[1]}</p><h4>Occupation Skills:</h4><ul>${occupation.skills.map(skill => `<li>${skill}</li>`).join('')}</ul>`; 
    infoDiv.classList.remove('hidden'); 
}

function selectOccupation() { 
    const value = document.getElementById('occupation-select').value; 
    if (!value) return alert("Please select an Occupation."); 
    character.occupation = OCCUPATIONS[value]; 
    character.occupation.name = value;
    nextStep(3); 
}

// --- Step 3: Characteristics --- //
function updateCoreCharSelect() { 
    populateSelect('core-char-select', character.archetype.core); 
    updateCharacteristicInputs(); 
}

function rollCore() { 
    const value = document.getElementById('core-char-select').value; 
    if (!value) return alert("Please select a core characteristic first."); 
    updateCharacteristicInputs(); 
    coreCharacteristic = value; 
    const d6 = Math.floor(Math.random() * 6) + 1; 
    coreRollValue = 65 + d6 * 5; 
    document.getElementById('core-roll-display').textContent = coreRollValue; 
    const input = document.getElementById(value); 
    input.value = coreRollValue; 
    input.min = coreRollValue; 
    updateRemainingPoints(); 
}

function updateCharacteristicInputs() { 
    const div = document.getElementById('char-alloc'); 
    div.innerHTML = ''; 
    charList.forEach(char => { 
        const group = document.createElement('div'); 
        group.className = 'char-input-group'; 
        group.innerHTML = `<label for="${char}">${char}:</label><input type="number" id="${char}" value="15" min="15" max="130" oninput="updateRemainingPoints()">`; 
        div.appendChild(group); 
    }); 
    document.getElementById('core-roll-display').textContent = 'Not rolled yet'; 
    coreCharacteristic = null; 
    coreRollValue = 0; 
    updateRemainingPoints(); 
}

function updateRemainingPoints() { 
    let spent = 0; 
    document.querySelectorAll('#char-alloc input[type="number"]').forEach(i => spent += +i.value || 0); 
    const remaining = totalCharPoints + coreRollValue - spent;
    const remainingEl = document.getElementById('remaining-points');
    remainingEl.textContent = remaining;
    remainingEl.style.color = remaining < 0 ? 'var(--error-red)' : 'inherit';
}

function completeChars() { 
    if (!coreCharacteristic || !coreRollValue) return alert("Please roll for a core characteristic first."); 
    const inputs = [...document.querySelectorAll('#char-alloc input[type="number"]')]; 
    let spent = 0, errors = []; 
    inputs.forEach(input => { 
        const val = +input.value; 
        if (isNaN(val) || val < +input.min || val > 130) errors.push(`${input.id} must be between ${input.min} and 130.`); 
        spent += val; 
    }); 
    if (spent !== totalCharPoints + coreRollValue) errors.push(`Total points spent must be exactly ${totalCharPoints + coreRollValue}.`); 
    if (errors.length) return alert(errors.join('\n')); 
    inputs.forEach(input => character.characteristics[input.id] = +input.value); 
    character.characteristics['Language Own'] = character.characteristics.EDU; // Set Language Own base
    nextStep(4); 
}

// --- Step 4: Age --- //
function toggleDeduct() { 
    const value = document.getElementById('age-select').value; 
    ['age-deduct', 'age-18-21-deduct'].forEach(id => document.getElementById(id).classList.add('hidden')); 
    if (value === '18-21') { 
        document.getElementById('age-18-21-deduct').classList.remove('hidden'); 
    } else if (['40-49', '50-59', '60-69'].includes(value)) { 
        const deductDiv = document.getElementById('age-deduct');
        deductDiv.classList.remove('hidden'); 
        const deduct = {'40-49':10,'50-59':15,'60-69':20}[value]; 
        document.getElementById('required-deduct').textContent = deduct; 
        validateAgeDeduct();
    } 
}

function validateAgeDeduct() { 
    const value = document.getElementById('age-select').value; 
    let total = 0; 
    if (value === '18-21') { 
        const deductStr = +document.getElementById('deduct-str-18-21').value || 0; 
        const deductSiz = +document.getElementById('deduct-siz-18-21').value || 0; 
        const deductEdu = +document.getElementById('deduct-edu-18-21').value || 0; 
        total = deductStr + deductSiz + deductEdu; 
        document.getElementById('total-deduct-18-21').textContent = total; 
    } else { 
        const deductStr = +document.getElementById('deduct-str').value || 0; 
        const deductCon = +document.getElementById('deduct-con').value || 0; 
        const deductDex = +document.getElementById('deduct-dex').value || 0; 
        total = deductStr + deductCon + deductDex; 
        document.getElementById('total-deduct').textContent = total; 
    } 
}

function applyAge() { 
    const value = document.getElementById('age-select').value; 
    character.age = document.querySelector(`#age-select option[value="${value}"]`).textContent.split(':')[0];
    const deductMap = {'18-21': 5, '40-49': 10, '50-59': 15, '60-69': 20}; 
    let deduct = deductMap[value] || 0; 
    if (value === '18-21') { 
        const strD = +document.getElementById('deduct-str-18-21').value || 0; 
        const sizD = +document.getElementById('deduct-siz-18-21').value || 0; 
        const eduD = +document.getElementById('deduct-edu-18-21').value || 0; 
        if (strD + sizD + eduD !== deduct) return alert(`Please distribute exactly 5 points.`); 
        character.characteristics.STR -= strD; 
        character.characteristics.SIZ -= sizD; 
        character.characteristics.EDU -= eduD; 
    } else if (deduct) { 
        const strD = +document.getElementById('deduct-str').value || 0; 
        const conD = +document.getElementById('deduct-con').value || 0; 
        const dexD = +document.getElementById('deduct-dex').value || 0; 
        if (strD + conD + dexD !== deduct) return alert(`Please distribute exactly ${deduct} points.`); 
        character.characteristics.STR -= strD; 
        character.characteristics.CON -= conD; 
        character.characteristics.DEX -= dexD; 
    } 
    const eduMods = {'22-39':10, '40-49':20, '50-59':30, '60-69':40}; 
    const appMods = {'40-49':-10, '50-59':-15, '60-69':-20}; 
    character.characteristics.EDU += eduMods[value] || 0; 
    character.characteristics.APP += appMods[value] || 0; 
    Object.keys(character.characteristics).forEach(key => { // Ensure no characteristic is below 1
        if (character.characteristics[key] < 1) character.characteristics[key] = 1;
    });
    nextStep(5); 
}

// --- Step 5: Secondary Attributes --- //
function rollLuck() { 
    const d6a = Math.floor(Math.random() * 6) + 1; 
    const d6b = Math.floor(Math.random() * 6) + 1; 
    character.luck = 30 + (d6a + d6b) * 5; 
    if (document.getElementById('age-select').value === '18-21') character.luck = 90; 
    document.getElementById('luck-display').textContent = character.luck + (document.getElementById('age-select').value === '18-21' ? ' (Capped at 90)' : ''); 
}

function calcSecondaries() { 
    if (!character.luck) return alert('Roll Luck first.'); 
    const {DEX, STR, SIZ, CON, POW} = character.characteristics; 
    let move = (DEX < SIZ && STR < SIZ) ? 7 : (DEX > SIZ && STR > SIZ) ? 9 : 8; 
    
    // Age adjustments for MOVE
    const ageVal = document.getElementById('age-select').value;
    if (['40-49', '50-59', '60-69'].includes(ageVal)) move -= 1;

    character.characteristics.Move = move; 
    character.characteristics.HP = Math.floor((CON + SIZ) / 10); 
    character.characteristics.Sanity = POW; 
    character.characteristics.MP = Math.floor(POW / 5); 
    
    const strSiz = STR + SIZ; 
    if (strSiz <= 64) { character.characteristics.Build = -2; } 
    else if (strSiz <= 84) { character.characteristics.Build = -1; } 
    else if (strSiz <= 124) { character.characteristics.Build = 0; } 
    else if (strSiz <= 164) { character.characteristics.Build = 1; } 
    else if (strSiz <= 204) { character.characteristics.Build = 2; } 
    else if (strSiz <= 284) { character.characteristics.Build = 3; } 
    else if (strSiz <= 364) { character.characteristics.Build = 4; } 
    else { character.characteristics.Build = 5; } 

    character.skills.Dodge = Math.floor(DEX / 2); 
    
    document.getElementById('secondary-display').innerHTML = `<p><strong>Move:</strong> ${character.characteristics.Move}</p><p><strong>Hit Points:</strong> ${character.characteristics.HP}</p><p><strong>Magic Points:</strong> ${character.characteristics.MP}</p><p><strong>Sanity:</strong> ${character.characteristics.Sanity}</p><p><strong>Build:</strong> ${character.characteristics.Build}</p><p><strong>Dodge Base:</strong> ${character.skills.Dodge}%</p>`;
    document.querySelector('#step5 button[onclick="nextStep(6)"]').disabled = false;
}

// --- Step 6: Skills --- //
function calculateAndDisplaySkillPoints() {
    const { EDU, INT, DEX, POW, STR, APP } = character.characteristics;
    const occChoiceContainer = document.getElementById('occ-skill-choice-container');
    
    // Reset points
    skillPoints.occ.total = 0;

    // Occupation points
    const skillPointsText = character.occupation.skillPointsText.toLowerCase();
    const choices = skillPointsText.match(/\((.*?)\)/);
    if (choices && choices[1]) {
        const options = choices[1].split(' or ').map(s => s.replace(' x 2', '').toUpperCase().trim());
        let choiceHTML = `<h4>Occupation Skill Point Choice</h4><p>Your occupation allows a choice for calculating skill points:</p>`;
        options.forEach((opt, i) => {
            choiceHTML += `<label><input type="radio" name="occ-skill-choice" value="${opt}" ${i === 0 ? 'checked' : ''}> ${opt} x 2</label><br>`;
        });
        occChoiceContainer.innerHTML = choiceHTML;
        occChoiceContainer.classList.remove('hidden');

        const radios = document.querySelectorAll('input[name="occ-skill-choice"]');
        radios.forEach(radio => radio.addEventListener('change', updateSkillPointTotals));
    } else {
        occChoiceContainer.innerHTML = '';
        occChoiceContainer.classList.add('hidden');
    }

    // Personal points
    skillPoints.pers.total = INT * 2;
    
    updateSkillPointTotals();
    populateSkillGrid();
}

function updateSkillPointTotals() {
    const selectedChoice = document.querySelector('input[name="occ-skill-choice"]:checked');
    const choiceValue = selectedChoice ? selectedChoice.value : null;
    skillPoints.occ.total = character.occupation.skillPointsFormula(character.characteristics, choiceValue);

    document.getElementById('occ-total').textContent = skillPoints.occ.total;
    document.getElementById('pers-total').textContent = skillPoints.pers.total;

    updateSkillPoints();
}

function populateSkillGrid() {
    const container = document.getElementById('skill-alloc');
    container.innerHTML = '';

    Object.keys(SKILL_CATEGORIES).forEach(category => {
        const catDiv = document.createElement('div');
        catDiv.className = 'skill-category';
        catDiv.innerHTML = `<h3>${category}</h3>`;
        const gridDiv = document.createElement('div');
        gridDiv.className = 'skill-grid';
        
        SKILL_CATEGORIES[category].forEach(skillName => {
            const skillData = ALL_SKILLS[skillName];
            if (!skillData) return;

            const baseValue = skillName === 'Language Own' ? character.characteristics.EDU : skillData.base;
            let initialValue = baseValue;
            if (skillName === 'Dodge') initialValue = character.skills.Dodge;
            
            let skillHTML = `
                <div class="skill-item" id="skill-item-${skillName.replace(/\s|\(|\)/g, '')}">
                    <div class="skill-item-title">
                        ${skillName}
                        ${skillData.isSpecialty ? `<input type="text" class="specialty-input" placeholder="Specify" id="spec-${specialtySkillCounter}">` : ''}
                    </div>
                    <div class="skill-input-container">
                        Base: <span id="base-${skillName.replace(/\s|\(|\)/g, '')}">${initialValue}</span>% + 
                        <input type="number" class="skill-input" min="0" value="0" data-skill-name="${skillName}" data-base-value="${initialValue}" ${skillName === 'Dodge' ? 'disabled' : ''} oninput="updateSkillPoints()"> = 
                        <strong id="total-${skillName.replace(/\s|\(|\)/g, '')}">${initialValue}</strong>%
                    </div>
                    <div class="skill-labels"></div>
                </div>`;

            gridDiv.innerHTML += skillHTML;
            if (skillData.isSpecialty) specialtySkillCounter++;
        });

        catDiv.appendChild(gridDiv);
        container.appendChild(catDiv);
    });

    // Tag skills
    character.archetype.bonusSkills.forEach(s => tagSkill(s, 'archetype-label', 'Archetype'));
    character.occupation.skills.forEach(s => tagSkill(s, 'occupation-label', 'Occupation'));
}

function tagSkill(skillName, className, labelText) {
    // This handles cases like "Fighting (any)" or "one interpersonal skill"
    const genericMatch = (pattern, name) => new RegExp(pattern.replace('(any)', '\\(.*\\)'), 'i').test(name);

    if (skillName.includes('(any)')) {
        const baseSkill = skillName.split(' ')[0];
        Object.keys(ALL_SKILLS).forEach(s => {
            if (s.startsWith(baseSkill)) {
                addLabelToSkill(s, className, labelText);
            }
        });
    } else if (skillName.includes('interpersonal')) {
        ['Charm', 'Fast Talk', 'Intimidate', 'Persuade'].forEach(s => addLabelToSkill(s, className, labelText));
    } else {
        addLabelToSkill(skillName, className, labelText);
    }
}

function addLabelToSkill(skillName, className, labelText) {
    const skillDiv = document.querySelector(`#skill-item-${skillName.replace(/\s|\(|\)/g, '')} .skill-labels`);
    if (skillDiv) {
        skillDiv.innerHTML += `<span class="skill-label ${className}">${labelText}</span>`;
    }
}

function updateSkillPoints() {
    let spentArch = 0, spentOcc = 0, spentPers = 0;
    
    document.querySelectorAll('.skill-input').forEach(input => {
        const spent = Number(input.value) || 0;
        const skillName = input.dataset.skillName;
        const base = Number(input.dataset.baseValue);
        const totalEl = document.getElementById(`total-${skillName.replace(/\s|\(|\)/g, '')}`);
        if (totalEl) totalEl.textContent = base + spent;

        const labels = input.closest('.skill-item').querySelector('.skill-labels');
        const isArch = labels.querySelector('.archetype-label');
        const isOcc = labels.querySelector('.occupation-label');

        if (isArch) {
            spentArch += spent;
        } else if (isOcc) {
            spentOcc += spent;
        } else {
            spentPers += spent;
        }
    });

    // Handle overflow from Arch to Occ, then to Pers
    if (spentArch > skillPoints.arch.total) {
        spentOcc += spentArch - skillPoints.arch.total;
        spentArch = skillPoints.arch.total;
    }
    if (spentOcc > skillPoints.occ.total) {
        spentPers += spentOcc - skillPoints.occ.total;
        spentOcc = skillPoints.occ.total;
    }

    skillPoints.arch.spent = spentArch;
    skillPoints.occ.spent = spentOcc;
    skillPoints.pers.spent = spentPers;

    // Update UI
    const updateUI = (pool, elId) => {
        const remEl = document.getElementById(elId);
        const remaining = pool.total - pool.spent;
        remEl.textContent = remaining;
        remEl.classList.toggle('overspent', remaining < 0);
    };

    updateUI(skillPoints.arch, 'arch-rem');
    updateUI(skillPoints.occ, 'occ-rem');
    updateUI(skillPoints.pers, 'pers-rem');
    
    document.getElementById('complete-skills-btn').disabled = (skillPoints.pers.spent > skillPoints.pers.total);
}

function completeSkills() {
    if (skillPoints.pers.spent > skillPoints.pers.total) {
        return alert('You have spent too many personal skill points. Please adjust your skills.');
    }

    character.skills = {}; // Reset skills
    document.querySelectorAll('.skill-input').forEach(input => {
        const skillName = input.dataset.skillName;
        const total = Number(document.getElementById(`total-${skillName.replace(/\s|\(|\)/g, '')}`).textContent);
        
        if (total > ALL_SKILLS[skillName].base || (skillName === 'Dodge' && total > 0)) {
            let finalName = skillName;
            const specialtyInput = input.closest('.skill-item').querySelector('.specialty-input');
            if (specialtyInput && specialtyInput.value) {
                finalName = `${skillName.split('(')[0].trim()} (${specialtyInput.value})`;
            }
            character.skills[finalName] = total;
        }
    });
    // Ensure Dodge is always present
    if (!character.skills['Dodge']) {
        character.skills['Dodge'] = Math.floor(character.characteristics.DEX / 2);
    }
    nextStep(7);
}


// --- Step 7: Talents & Hindrances --- //
function populateAllTalentsAndHindrances() {
    const container = document.getElementById('talent-checkboxes');
    container.innerHTML = '';
    
    const createItem = (name, data, type) => {
        const pointText = type === 'hindrance' ? `+${data.value} pts` : `Cost: ${data.value} pts`;
        const color = type === 'hindrance' ? 'color: #ff8a80;' : 'color: #b9f6ca;';
        return `
            <div class="${type}-item">
                <label class="${type}-header">
                    <input type="checkbox" value="${data.value}" data-name="${name}" data-type="${type}" onchange="updateTalentPoints()">
                    <span class="${type}-name" style="${color}">${name} [${pointText}]</span>
                </label>
                <div class="${type}-description">${data.desc}</div>
            </div>
        `;
    };
    
    let allItemsHTML = '';
    Object.keys(HINDRANCES).forEach(key => allItemsHTML += createItem(key, HINDRANCES[key], 'hindrance'));
    Object.keys(TALENTS).forEach(key => allItemsHTML += createItem(key, TALENTS[key], 'talent'));
    container.innerHTML = allItemsHTML;
    
    updateTalentPoints();
}

let naturalTalentPoints = 0;
function rollNaturalTalent() {
    const roll = Math.floor(Math.random() * 100) + 1;
    const display = document.getElementById('natural-talent');
    const btn = document.querySelector('#step7 button[onclick="rollNaturalTalent()"]');

    if (roll <= character.luck) {
        naturalTalentPoints = Math.floor(Math.random() * 4) + 2; // Gain 2-5 points
        display.textContent = `Success! (Rolled ${roll} vs Luck ${character.luck}). You gain ${naturalTalentPoints} free talent points!`;
        display.style.color = 'var(--glow-yellow)';
    } else {
        naturalTalentPoints = 0;
        display.textContent = `Failure. (Rolled ${roll} vs Luck ${character.luck}). No bonus points.`;
        display.style.color = 'inherit';
    }
    btn.disabled = true;
    updateTalentPoints();
}

function updateTalentPoints() {
    let points = naturalTalentPoints;
    let selectedItems = [];
    
    document.querySelectorAll('#talent-checkboxes input:checked').forEach(cb => {
        const value = Number(cb.value);
        const name = cb.dataset.name;
        const type = cb.dataset.type;
        
        if (type === 'hindrance') {
            points += value;
            selectedItems.push(`<span style="color: #ff8a80;">${name}</span>`);
        } else {
            points -= value;
            selectedItems.push(`<span style="color: #b9f6ca;">${name}</span>`);
        }
    });
    
    const pointsDisplay = document.getElementById('talent-points');
    pointsDisplay.textContent = points;
    pointsDisplay.classList.toggle('overspent', points < 0);
    
    document.getElementById('selected-items').innerHTML = selectedItems.length > 0 ? selectedItems.join(', ') : 'None';
    document.querySelector('#step7 button[onclick="completeHT()"]').disabled = points < 0;
}

function completeHT() {
    const points = Number(document.getElementById('talent-points').textContent);
    if (points < 0) return alert('You have spent more talent points than you have available.');
    
    character.talents = [];
    // Add archetype talent first
    character.talents.push({
        name: `${character.archetype.talent} [Archetype]`,
        desc: character.archetype.talentDesc
    });

    document.querySelectorAll('#talent-checkboxes input:checked').forEach(cb => {
        const name = cb.dataset.name;
        const type = cb.dataset.type;
        if (type === 'hindrance') {
            character.talents.push({
                name: `${name} [Hindrance: +${HINDRANCES[name].value} pts]`,
                desc: HINDRANCES[name].desc
            });
        } else {
            character.talents.push({
                name: `${name} [Cost: ${TALENTS[name].value} pts]`,
                desc: TALENTS[name].desc
            });
        }
    });
    
    nextStep(8);
}

// --- Step 8: Backstory --- //
function completeBackstory() {
    character.name = document.getElementById('name').value;
    character.backstory.gender = document.getElementById('gender').value;
    character.backstory.description = document.getElementById('description').value;
    const heritageSelect = document.getElementById('heritage');
    character.heritageText = heritageSelect.options[heritageSelect.selectedIndex].text.substring(3);
    character.backstory.ideology = document.getElementById('ideology').value;
    character.backstory.significantPeople = document.getElementById('significant-people').value;
    character.backstory.meaningful = document.getElementById('meaningful').value;
    character.backstory.traits = document.getElementById('traits').value;
    character.backstory.madness = document.getElementById('madness').value;
    character.backstory.hairEye = document.getElementById('hair-eye').value;
    character.backstory.marks = document.getElementById('marks').value;

    if (!character.name) return alert('Please enter a character name.');

    nextStep(9);
}

// --- Step 9: Finalize & Generate JSON --- //
function generateAndDownloadJSON() {
    const json = {};

    // --- 1. Basic Info and Sheet Configuration ---
    // Uses the detailed configuration from your version
    Object.assign(json, {
        "character_name": character.name || "",
        "occupation": character.occupation.name || "",
        "archetype": character.archetype.name || "",
        "gender": character.backstory.gender || "",
        "age": parseInt((character.age || "22-39").split('-')[0], 10),
        "setting_header": "pulp",
        "toggle_pulp_archetype": "on",
        "toggle_pulp_talents": "on",
        "toggle_pulp_skills": "on",
        "sheet_initialized": "yes"
    });

    // --- 2. Characteristics ---
    const charMap = { STR: 'strength', CON: 'constitution', DEX: 'dexterity', POW: 'power', APP: 'appearance', EDU: 'education', INT: 'intelligence', SIZ: 'size' };
    Object.keys(charMap).forEach(key => json[charMap[key]] = character.characteristics[key]);
    json.luck = character.luck || 50;
    
    // --- 3. Backstory Fields (with corrected data paths and "_value" suffix) ---
    json.personal_description_value = character.backstory.description || "";
    json.ideology_beliefs_value = character.backstory.ideology || "";
    json.significant_people_value = character.backstory.significantPeople || "";
    json.phobias_manias_value = character.backstory.madness || "";
    json.meaningful_locations_value = character.backstory.meaningful || "";
    json.traits_value = character.backstory.traits || "";
    json.hair_eye_color_value = character.backstory.hairEye || "";
    json.distinguishing_marks_value = character.backstory.marks || "";
    json.heritage_value = character.heritageText || "";

    // --- 4. Skill Processing ---
    // Using your more accurate mapping
    const coreSkillMap = {
        'Accounting': 'accounting', 'Animal Handling': 'animal_handling', 'Anthropology': 'anthropology', 'Appraise': 'appraise',
        'Archaeology': 'archaeology', 'Fighting (Brawling)': 'brawl', 'Charm': 'charm', 'Climb': 'climb', 'Credit Rating': 'credit_rating',
        'Demolitions': 'demolitions', 'Disguise': 'disguise', 'Electrical Repair': 'electrical_repair', 'Fast Talk': 'fast_talk',
        'First Aid': 'first_aid', 'Firearms (Handguns)': 'handgun', 'History': 'history', 'Intimidate': 'intimidate',
        'Jump': 'jump', 'Law': 'law', 'Library Use': 'library_use', 'Listen': 'listen', 'Locksmith': 'locksmith',
        'Mechanical Repair': 'mechanical_repair', 'Medicine': 'medicine', 'Natural World': 'natural_world', 'Navigate': 'navigate',
        'Occult': 'occult', 'Operate Heavy Machinery': 'operate_heavy_machinery', 'Persuade': 'persuade', 'Psychology': 'psychology',
        'Read Lips': 'read_lips', 'Ride': 'ride', 'Sleight of Hand': 'sleight_of_hand', 'Spot Hidden': 'spot_hidden',
        'Stealth': 'stealth', 'Swim': 'swim', 'Throw': 'throw', 'Track': 'track'
    };

    // Prepare lists for repeating sections
    const repeating = {
        fighting: [], firearms: [], artcraft: [], languages: [], sciences: [], psychic: [], survival: [], additionalskills: []
    };

    for (const skillName in character.skills) {
        const skillValue = character.skills[skillName];
        if (coreSkillMap[skillName]) {
            json[coreSkillMap[skillName]] = skillValue;
        } else if (skillName.startsWith('Fighting (')) {
            repeating.fighting.push({ name: skillName, value: skillValue });
        } else if (skillName.startsWith('Firearms (')) {
            repeating.firearms.push({ name: skillName, value: skillValue });
        } else if (skillName.startsWith('Art/Craft (')) {
            repeating.artcraft.push({ name: skillName.match(/\((.*)\)/)[1], value: skillValue });
        } else if (skillName.startsWith('Language Other (')) {
            repeating.languages.push({ name: skillName.match(/\((.*)\)/)[1], value: skillValue });
        } else if (skillName.startsWith('Science (')) {
            repeating.sciences.push({ name: skillName, value: skillValue });
        } else if (['Medium', 'Telekinesis', 'Shamanic Magic', 'Witchcraft'].includes(skillName)) {
            repeating.psychic.push({ name: skillName, value: skillValue });
        } else if (skillName.startsWith('Survival (')) {
             repeating.survival.push({ name: skillName, value: skillValue });
        } else if (skillName !== 'Dodge'){ // Dodge is calculated by the sheet
            repeating.additionalskills.push({ name: skillName, value: skillValue });
        }
    }
    
    // --- 5. Correctly Format Repeating Sections ---
    // This loop structure is what Roll20 needs
    for (const section in repeating) {
        repeating[section].forEach((item, i) => {
            const rowId = `row_${i}`;
            const nameKey = section === 'artcraft' || section === 'languages' ? 'name' : 'skill_name'; // Sheet uses different names
            json[`repeating_${section}_${rowId}_${nameKey}`] = item.name;
            json[`repeating_${section}_${rowId}_value`] = item.value;
        });
    }

    // --- 6. Handle Talents & Hindrances (from the single, combined array) ---
    character.talents.forEach((talent, i) => {
        const rowId = `row_${i}`;
        json[`repeating_talents_${rowId}_talent_name`] = talent.name;
        json[`repeating_talents_${rowId}_talent_description`] = talent.desc;
    });

    // --- 7. Final JSON Output ---
    const finalJsonPayload = { "attribs": json }; // The API script expects this wrapper
    const jsonString = JSON.stringify(finalJsonPayload, null, 2);

    const finalSection = document.getElementById('step9');
    // Clear previous results before adding new ones
    const oldOutput = document.getElementById('json-output-container');
    if(oldOutput) oldOutput.remove();

    const outputContainer = document.createElement('div');
    outputContainer.id = 'json-output-container';
    outputContainer.innerHTML = `
        <p>JSON generated! Copy the text below or use the download link.</p>
        <textarea id="json-output" rows="10" readonly>${jsonString}</textarea>
    `;

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/\s/g, '_')}_import.json`;
    a.textContent = 'Download JSON File';
    a.style.display = 'block';
    a.style.marginTop = '10px';
    
    outputContainer.appendChild(a);
    finalSection.appendChild(outputContainer);

    document.getElementById('json-output').select();
}
