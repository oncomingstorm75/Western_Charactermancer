// Western RPG Character Creation Logic
const charList = ['STR', 'CON', 'DEX', 'POW', 'APP', 'EDU', 'INT', 'SIZ'];
let character = {
    archetype: null,
    occupation: null,
    characteristics: {},
    skills: {},
    talents: [],
    age: null,
    luck: 0,
    name: '',
    description: '',
    ideology: '',
    significantPeople: '',
    meaningfulItems: '',
    traits: '',
    madness: '',
    hairEye: '',
    marks: '',
    heritageText: ''
};
let coreCharacteristic = null;
let coreRollValue = 0;
const totalCharPoints = 460;
let specialtySkillCounter = 0;
let skillPoints = { arch: 100, occ: 0, pers: 0 };
let occChoice = null; // To store occupation skill point choice

// This function should be called at the beginning
function init() {
    populateSelect('archetype-select', Object.keys(ARCHETYPES));
    // Set default age and trigger its logic
    toggleDeduct();
}

function populateSelect(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = `<option value="">Select...</option>`;
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

function nextStep(step) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step${step}`).classList.remove('hidden');
    if (step === 6) calculateAndDisplaySkillPoints();
    if (step === 7) {
        populateAllTalentsAndHindrances();
        const arch = ARCHETYPES[document.getElementById('archetype-select').value];
        document.getElementById('arch-talent').textContent = arch.talent;
    }
}

function prevStep(toStep) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step${toStep}`).classList.remove('hidden');
}

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

function selectArchetype() {
    const value = document.getElementById('archetype-select').value;
    if (!value) return alert("Please select an Archetype.");
    character.archetype = ARCHETYPES[value];
    populateSelect('occupation-select', character.archetype.occupations);
    updateCoreCharSelect();
    document.getElementById('occupation-info').classList.add('hidden');
    document.getElementById('occupation-select').value = '';
    nextStep(2);
}

function selectOccupation() {
    const value = document.getElementById('occupation-select').value;
    if (!value) return alert("Please select an Occupation.");
    character.occupation = OCCUPATIONS[value];
    nextStep(3);
}

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
    document.getElementById('remaining-points').textContent = totalCharPoints + coreRollValue - spent;
}

function completeChars() {
    if (!coreCharacteristic || !coreRollValue) return alert("Please roll for a core characteristic first.");
    const inputs = [...document.querySelectorAll('#char-alloc input[type="number"]')];
    let spent = 0,
        errors = [];
    inputs.forEach(input => {
        const val = +input.value;
        if (isNaN(val) || val < +input.min || val > 130) errors.push(`${input.id} must be ${input.min}-130.`);
        spent += val;
    });
    if (spent !== totalCharPoints + coreRollValue) errors.push(`Total must be ${totalCharPoints + coreRollValue}.`);
    if (errors.length) return alert(errors.join('\n'));
    inputs.forEach(input => character.characteristics[input.id] = +input.value);
    nextStep(4);
}

function toggleDeduct() {
    const value = document.getElementById('age-select').value;
    ['age-deduct', 'age-18-21-deduct'].forEach(id => document.getElementById(id).classList.add('hidden'));
    if (value === '18-21') {
        document.getElementById('age-18-21-deduct').classList.remove('hidden');
    } else if (['40-49', '50-59', '60-69'].includes(value)) {
        document.getElementById('age-deduct').classList.remove('hidden');
        const deduct = { '40-49': 10, '50-59': 15, '60-69': 20 }[value];
        document.getElementById('required-deduct').textContent = deduct;
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
    character.age = document.getElementById('age-select').options[document.getElementById('age-select').selectedIndex].text.split(':')[0];
    const deductMap = { '18-21': 5, '40-49': 10, '50-59': 15, '60-69': 20 };
    let deduct = deductMap[value] || 0;
    if (value === '18-21') {
        const strD = +document.getElementById('deduct-str-18-21').value || 0;
        const sizD = +document.getElementById('deduct-siz-18-21').value || 0;
        const eduD = +document.getElementById('deduct-edu-18-21').value || 0;
        if (strD + sizD + eduD !== deduct) return alert(`Distribute exactly 5 points.`);
        character.characteristics.STR -= strD;
        character.characteristics.SIZ -= sizD;
        character.characteristics.EDU -= eduD;
    } else if (deduct) {
        const strD = +document.getElementById('deduct-str').value || 0;
        const conD = +document.getElementById('deduct-con').value || 0;
        const dexD = +document.getElementById('deduct-dex').value || 0;
        if (strD + conD + dexD !== deduct) return alert(`Distribute exactly ${deduct} points.`);
        character.characteristics.STR -= strD;
        character.characteristics.CON -= conD;
        character.characteristics.DEX -= dexD;
    }
    const eduMods = { '22-39': 10, '40-49': 20, '50-59': 30, '60-69': 40 };
    const appMods = { '40-49': -10, '50-59': -15, '60-69': -20 };
    character.characteristics.EDU += eduMods[value] || 0;
    character.characteristics.APP += appMods[value] || 0;
    nextStep(5);
}

function rollLuck() {
    const d6a = Math.floor(Math.random() * 6) + 1;
    const d6b = Math.floor(Math.random() * 6) + 1;
    const ageVal = document.getElementById('age-select').value;
    character.luck = 30 + (d6a + d6b) * 5;
    if (ageVal === '18-21') character.luck = 90;
    document.getElementById('luck-display').textContent = character.luck + (ageVal === '18-21' ? ' (Capped at 90)' : '');
}

function calcSecondaries() {
    if (!character.luck) return alert('Roll Luck first.');
    const { DEX, STR, SIZ, CON, POW } = character.characteristics;
    let move = 7;
    if (DEX < SIZ && STR < SIZ) { move = 7; } 
    else if (DEX > SIZ && STR > SIZ) { move = 9; } 
    else { move = 8; }
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
    document.getElementById('secondary-display').innerHTML = `<p><strong>Move:</strong> ${character.characteristics.Move}</p><p><strong>Hit Points:</strong> ${character.characteristics.HP}</p><p><strong>Magic Points:</strong> ${character.characteristics.MP}</p><p><strong>Sanity:</strong> ${character.characteristics.Sanity}</p><p><strong>Build:</strong> ${character.characteristics.Build}</p><p><strong>Dodge Base:</strong> ${character.skills.Dodge}`;
    nextStep(6);
}

function calculateAndDisplaySkillPoints() {
    // Determine Occupation Skill Points
    const occChoiceContainer = document.getElementById('occ-skill-choice-container');
    occChoiceContainer.innerHTML = '';
    const formulaText = character.occupation.skillPointsText.toLowerCase();
    const choices = (formulaText.match(/\(([^)]+)\)/) || ["", ""])[1].split(' or ').map(s => s.trim().split(' ')[0].toUpperCase());

    if (choices.length > 1 && choices[0]) {
        let optionsHTML = choices.map(c => `<option value="${c}">${c}</option>`).join('');
        occChoiceContainer.innerHTML = `<h4>Occupation Skill Point Choice:</h4><p>Choose a characteristic to determine your Occupation Skill points.</p><select id="occ-choice-select" onchange="updateOccSkillPoints()">${optionsHTML}</select>`;
        occChoice = choices[0]; // Default to first choice
    } else {
        occChoice = null; // No choice needed
    }
    updateOccSkillPoints(); // Calculate points with default/no choice

    // Display Skills
    displayAllSkills();
}

function updateOccSkillPoints() {
    const select = document.getElementById('occ-choice-select');
    if (select) {
        occChoice = select.value;
    }
    skillPoints.occ = character.occupation.skillPointsFormula(character.characteristics, occChoice);
    skillPoints.pers = character.characteristics.INT * 2;
    document.getElementById('occ-total').textContent = skillPoints.occ;
    document.getElementById('pers-total').textContent = skillPoints.pers;
    updateSkillPoints();
}

function displayAllSkills() {
    const container = document.getElementById('skill-alloc');
    container.innerHTML = '';
    const archSkills = character.archetype.bonusSkills.map(s => s.toLowerCase().includes('any') ? s.split(' ')[0].toLowerCase() : s.toLowerCase());
    const occSkills = character.occupation.skills.map(s => s.toLowerCase().includes('any') ? s.split(' ')[0].toLowerCase() : s.toLowerCase());

    Object.keys(SKILL_CATEGORIES).forEach(cat => {
        const catDiv = document.createElement('div');
        catDiv.className = 'skill-category';
        catDiv.innerHTML = `<h3>${cat}</h3>`;
        const grid = document.createElement('div');
        grid.className = 'skill-grid';

        SKILL_CATEGORIES[cat].forEach(skillName => {
            const skillData = ALL_SKILLS[skillName];
            if (!skillData) return;

            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            let baseValue = skillData.base;
            if (skillName === 'Dodge') baseValue = character.skills.Dodge || Math.floor(character.characteristics.DEX / 2);
            if (skillName === 'Language Own') baseValue = character.characteristics.EDU;
            
            let specialtyInput = '';
            if (skillName.includes('(any)') || skillData.isSpecialty) {
                specialtyInput = `<input type="text" class="specialty-input" placeholder="Specify" data-skill-name="${skillName}">`;
            }

            const isArch = archSkills.some(s => skillName.toLowerCase().startsWith(s));
            const isOcc = occSkills.some(s => skillName.toLowerCase().startsWith(s));
            
            let labels = '';
            if (isArch) labels += '<span class="skill-label archetype-label">Archetype</span>';
            if (isOcc) labels += '<span class="skill-label occupation-label">Occupation</span>';

            skillItem.innerHTML = `
                <div class="skill-item-title">${skillName} ${specialtyInput}</div>
                <div class="skill-input-container">
                    <span>Base: ${baseValue}</span>
                    <input type="number" class="skill-input" value="${baseValue}" min="${baseValue}" max="99" 
                           oninput="updateSkillPoints()" data-base-value="${baseValue}" data-skill-name="${skillName}"
                           data-is-arch="${isArch}" data-is-occ="${isOcc}">
                </div>
                <div class="skill-labels">${labels}</div>
            `;
            grid.appendChild(skillItem);
        });
        catDiv.appendChild(grid);
        container.appendChild(catDiv);
    });
    updateSkillPoints();
}

function updateSkillPoints() {
    let spentOnArch = 0;
    let spentOnOcc = 0;
    let spentOnPersonal = 0;

    document.querySelectorAll('.skill-input').forEach(input => {
        const pointsAdded = (+input.value || 0) - (+input.dataset.baseValue || 0);
        if (pointsAdded <= 0) return;

        if (input.dataset.isArch === 'true') {
            spentOnArch += pointsAdded;
        } else if (input.dataset.isOcc === 'true') {
            spentOnOcc += pointsAdded;
        } else {
            spentOnPersonal += pointsAdded;
        }
    });

    let archSpent = Math.min(spentOnArch, skillPoints.arch);
    let archRem = skillPoints.arch - archSpent;
    let archOverflow = spentOnArch - archSpent;

    let totalOccDemand = spentOnOcc + archOverflow;
    let occSpent = Math.min(totalOccDemand, skillPoints.occ);
    let occRem = skillPoints.occ - occSpent;
    let occOverflow = totalOccDemand - occSpent;

    let totalPersDemand = spentOnPersonal + occOverflow;
    let persRem = skillPoints.pers - totalPersDemand;

    document.getElementById('arch-rem').textContent = archRem;
    document.getElementById('occ-rem').textContent = occRem;
    const persRemEl = document.getElementById('pers-rem');
    persRemEl.textContent = persRem;
    persRemEl.classList.toggle('overspent', persRem < 0);
    document.getElementById('complete-skills-btn').disabled = persRem < 0;
}

function completeSkills() {
    if (parseInt(document.getElementById('pers-rem').textContent) < 0) {
        return alert("You have overspent your personal skill points.");
    }

    character.skills = {};
    document.querySelectorAll('.skill-input').forEach(input => {
        const skillName = input.dataset.skillName;
        const value = +input.value;
        const base = +input.dataset.baseValue;

        if (value > base) {
            let finalSkillName = skillName;
            const specialtyInput = document.querySelector(`.specialty-input[data-skill-name="${skillName}"]`);
            if (specialtyInput && specialtyInput.value) {
                finalSkillName = `${skillName.replace(' (any)', '')} (${specialtyInput.value})`;
            }
            character.skills[finalSkillName] = value;
        }
    });
    // Ensure core skills are present even if not modified
    character.skills['Dodge'] = character.skills['Dodge'] || Math.floor(character.characteristics.DEX / 2);
    character.skills['Language Own'] = character.skills['Language Own'] || character.characteristics.EDU;

    nextStep(7);
}


function populateAllTalentsAndHindrances() {
    const container = document.getElementById('talent-checkboxes');
    container.innerHTML = '';
    const combined = [];

    for (const key in HINDRANCES) {
        combined.push({ name: key, data: HINDRANCES[key], type: 'hindrance' });
    }
    for (const key in TALENTS) {
        combined.push({ name: key, data: TALENTS[key], type: 'talent' });
    }

    combined.sort((a,b) => a.name.localeCompare(b.name)).forEach(item => {
        const isHindrance = item.type === 'hindrance';
        const pointsText = isHindrance ? `[+${item.data.value} pts]` : `[Cost: ${item.data.value} pts]`;
        const color = isHindrance ? 'color: #e57373;' : 'color: #81c784;';

        const element = document.createElement('div');
        element.className = 'talent-item';
        element.innerHTML = `
            <label class="talent-header">
                <input type="checkbox" onchange="updateTalentPoints()" value="${item.data.value}" data-type="${item.type}" data-name="${item.name}">
                <span class="talent-name" style="${color}">${item.name} ${pointsText}</span>
            </label>
            <div class="talent-description">${item.data.desc}</div>
        `;
        container.appendChild(element);
    });
}

function updateTalentPoints() {
    let points = 0;
    const selectedItems = [];
    document.querySelectorAll('#talent-checkboxes input:checked').forEach(cb => {
        const val = parseInt(cb.value);
        if (cb.dataset.type === 'hindrance') {
            points += val;
        } else {
            points -= val;
        }
        selectedItems.push(cb.dataset.name);
    });

    document.getElementById('talent-points').textContent = points;
    document.getElementById('selected-items').textContent = selectedItems.length ? selectedItems.join(', ') : 'None';
    document.getElementById('talent-points').classList.toggle('overspent', points < 0);
}


function rollNaturalTalent() {
    const talentKeys = Object.keys(TALENTS);
    const randomTalent = talentKeys[Math.floor(Math.random() * talentKeys.length)];
    document.getElementById('natural-talent').textContent = `${randomTalent}: ${TALENTS[randomTalent].desc}`;
    character.naturalTalent = { name: `(Natural) ${randomTalent}`, desc: TALENTS[randomTalent].desc };
    alert(`Your Natural Talent is: ${randomTalent}`);
}


function completeHT() {
    if (parseInt(document.getElementById('talent-points').textContent) < 0) {
        return alert("You have spent more talent points than you have.");
    }
    character.talents = [];

    // Add Archetype Talent
    character.talents.push({
        name: `(Archetype) ${character.archetype.talent}`,
        desc: character.archetype.talentDesc
    });
    
    // Add Natural Talent if rolled
    if (character.naturalTalent) {
        character.talents.push(character.naturalTalent);
    }
    
    // Add selected Talents and Hindrances
    document.querySelectorAll('#talent-checkboxes input:checked').forEach(cb => {
        const name = cb.dataset.name;
        if (cb.dataset.type === 'hindrance') {
            character.talents.push({
                name: `[Hindrance] ${name}`,
                desc: HINDRANCES[name].desc
            });
        } else {
            character.talents.push({
                name: name,
                desc: TALENTS[name].desc
            });
        }
    });

    nextStep(8);
}


function completeBackstory() {
    character.name = document.getElementById('name').value;
    character.gender = document.getElementById('gender').value;
    character.description = document.getElementById('description').value;
    character.heritageText = document.getElementById('heritage').options[document.getElementById('heritage').selectedIndex].text;
    character.ideology = document.getElementById('ideology').value;
    character.significantPeople = document.getElementById('significant-people').value;
    character.meaningfulItems = document.getElementById('meaningful').value;
    character.traits = document.getElementById('traits').value;
    character.madness = document.getElementById('madness').value;
    character.hairEye = document.getElementById('hair-eye').value;
    character.marks = document.getElementById('marks').value;
    nextStep(9);
}

function generateRowId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateAndDownloadJSON() {
    const data = {
        character_name: character.name,
        // Characteristics
        ...character.characteristics,
        luck: character.luck,
        // Secondary Attributes
        hp: character.characteristics.HP,
        hp_max: character.characteristics.HP,
        mp: character.characteristics.MP,
        mp_max: character.characteristics.MP,
        sanity: character.characteristics.Sanity,
        move: character.characteristics.Move,
        build: character.characteristics.Build,
        // Backstory
        occupation: document.getElementById('occupation-select').value,
        age: character.age,
        gender: character.gender,
        heritage: character.heritageText,
        hair_and_eye_color: character.hairEye,
        distinguishing_marks: character.marks,
        personal_description: character.description,
        ideology_and_beliefs: character.ideology,
        significant_people: character.significantPeople,
        meaningful_locations_and_possessions: character.meaningfulItems,
        traits: character.traits,
        bout_of_madness: character.madness,
    };

    // Skills
    const skillMap = {
        'Dodge': 'dodge', 'Language Own': 'language_own_skill',
        'Credit Rating': 'credit_rating',
    };
    for (const skillName in character.skills) {
        if (skillMap[skillName]) {
            data[skillMap[skillName]] = character.skills[skillName];
        }
    }

    // Process categorized skills into fixed slots
    const processSkills = (category, prefix, maxSlots) => {
        const skillsInCategory = Object.keys(character.skills)
            .filter(s => SKILL_CATEGORIES[category].includes(s.split(' (')[0]));

        for (let i = 1; i <= maxSlots; i++) {
            const skillName = skillsInCategory[i - 1];
            if (skillName) {
                data[`${prefix}_${i}_name`] = skillName;
                data[`${prefix}_${i}`] = character.skills[skillName];
            } else {
                data[`${prefix}_${i}_disabled`] = "on";
            }
        }
    };
    
    // Define categories and their corresponding sheet prefixes/slots
    processSkills('Firearms', 'firearms_skill', 5);
    processSkills('Fighting', 'fighting_skill', 5);
    
    // Put remaining skills into "additional_skills"
    const handledSkills = new Set([
        ...SKILL_CATEGORIES.Firearms, ...SKILL_CATEGORIES.Fighting,
        'Dodge', 'Language Own', 'Credit Rating'
    ]);
    const additionalSkills = Object.keys(character.skills)
        .filter(s => !handledSkills.includes(s.split(' (')[0]));

    for (let i = 1; i <= 10; i++) { // Assuming 10 slots for additional skills
        const skillName = additionalSkills[i - 1];
        if (skillName) {
            data[`additional_skill_${i}_name`] = skillName;
            data[`additional_skill_${i}`] = character.skills[skillName];
        } else {
            data[`additional_skill_${i}_disabled`] = "on";
        }
    }


    // Talents and Hindrances
    character.talents.forEach(item => {
        const rowId = generateRowId();
        data[`repeating_talents_${rowId}_name`] = item.name;
        data[`repeating_talents_${rowId}_description`] = item.desc;
    });

    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/ /g, '_') || 'character'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Also, display in a textarea for copying
    const finalSection = document.getElementById('step9');
    let outputArea = document.getElementById('json-output');
    if (!outputArea) {
        outputArea = document.createElement('textarea');
        outputArea.id = 'json-output';
        outputArea.style.width = '100%';
        outputArea.style.height = '300px';
        outputArea.readOnly = true;
        finalSection.appendChild(document.createElement('br'));
        finalSection.appendChild(outputArea);
    }
    outputArea.value = jsonString;
}


// Initialize on page load
window.onload = init;
