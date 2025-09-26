// Western RPG Character Creation Logic
const charList = ['STR', 'CON', 'DEX', 'POW', 'APP', 'EDU', 'INT', 'SIZ'];
let character = { 
    archetype: null, 
    occupation: null, 
    characteristics: {}, 
    skills: {}, 
    talents: [], 
    hindrances: [], 
    age: null, 
    luck: 0, 
    heritageText: '' 
};
let coreCharacteristic = null;
let coreRollValue = 0;
const totalCharPoints = 460;
let specialtySkillCounter = 0;

function init() { 
    populateSelect('archetype-select', Object.keys(ARCHETYPES)); 
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
        populateHindSelect(); 
        populateTalSelect(); 
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
    let spent = 0, errors = []; 
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
        const deduct = {'40-49':10,'50-59':15,'60-69':20}[value]; 
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
    character.age = value; 
    const deductMap = {'18-21': 5, '40-49': 10, '50-59': 15, '60-69': 20}; 
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
    const eduMods = {'22-39':10, '40-49':20, '50-59':30, '60-69':40}; 
    const appMods = {'40-49':-10, '50-59':-15, '60-69':-20}; 
    character.characteristics.EDU += eduMods[value] || 0; 
    character.characteristics.APP += appMods[value] || 0; 
    nextStep(5); 
}

function rollLuck() { 
    const d6a = Math.floor(Math.random() * 6) + 1; 
    const d6b = Math.floor(Math.random() * 6) + 1; 
    character.luck = 30 + (d6a + d6b) * 5; 
    if (character.age === '18-21') character.luck = 90; 
    document.getElementById('luck-display').textContent = character.luck + (character.age === '18-21' ? ' (Capped at 90)' : ''); 
}

function calcSecondaries() { 
    if (!character.luck) return alert('Roll Luck first.'); 
    const {DEX, STR, SIZ, CON, POW} = character.characteristics; 
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
    document.getElementById('secondary-display').innerHTML = `<p><strong>Move:</strong> ${character.characteristics.Move}</p><p><strong>Hit Points:</strong> ${character.characteristics.HP}</p><p><strong>Magic Points:</strong> ${character.characteristics.MP}</p><p><strong>Sanity:</strong> ${character.characteristics.Sanity}</p><p><strong>Build:</strong> ${character.characteristics.Build}</p><p><strong>Dodge Base:</strong> ${character.skills.Dodge}%</p>`; 
    nextStep(6); 
}

// Skills system
function getSkillPoints() { 
    const { skillPointsFormula } = character.occupation; 
    let choice = null; 
    const choiceRadio = document.querySelector('input[name="occ-skill-choice"]:checked'); 
    if (choiceRadio) { 
        choice = choiceRadio.value; 
    } 
    const occPoints = skillPointsFormula(character.characteristics, choice); 
    return { occPoints, persPoints: character.characteristics.INT * 2, archPoints: 100 }; 
}

function isOccupationSkill(skillName) { 
    const occSkills = character.occupation.skills; 
    for (const occSkill of occSkills) { 
        if (occSkill === skillName) return true; 
        if (occSkill.endsWith('(any)')) { 
            const base = occSkill.replace(' (any)', ''); 
            if (skillName.startsWith(base)) return true; 
        } 
        if (occSkill.includes(' or ')) { 
            const options = occSkill.split(' or ').map(s => s.trim()); 
            if (options.includes(skillName) || options.some(opt => skillName.startsWith(opt.replace('(any)','')))) return true; 
        } 
        if (occSkill.includes('interpersonal')) { 
            if (['Charm', 'Fast Talk', 'Intimidate', 'Persuade'].includes(skillName)) return true; 
        }
        if (occSkill === 'Firearms (Rifle and Shotgun)') {
            if (skillName === 'Firearms (Rifles)' || skillName === 'Firearms (Shotguns)') return true;
        }
        if (occSkill === 'Firearms (Rifle/Shotgun or Handgun)') {
            if (['Firearms (Rifles)', 'Firearms (Shotguns)', 'Firearms (Handguns)'].includes(skillName)) return true;
        }
        if (occSkill === 'Drive (Wagon)' && skillName === 'Drive Coach/Wagon') return true;
    } 
    return false; 
}

function isArchetypeSkill(skillName) { 
    const skills = character.archetype.bonusSkills; 
    if (skills.includes(skillName)) return true; 
    const anyChecks = {'Fighting (': 'Fighting (any)','Firearms (': 'Firearms (any)','Art/Craft': 'Art/Craft (any)','Language Other': 'Language Other (any)'}; 
    for (const prefix in anyChecks) { 
        if (skillName.startsWith(prefix) && skills.includes(anyChecks[prefix])) { 
            return true; 
        } 
    } 
    return false; 
}

function addSpecialtySkill(baseSkillName, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const skillData = ALL_SKILLS[baseSkillName];
    if (!skillData) return;
    specialtySkillCounter++;
    const newId = `${baseSkillName.replace(/[^a-zA-Z0-9]/g, '-')}-${specialtySkillCounter}`;
    const isOcc = isOccupationSkill(baseSkillName + ' (any)');
    const isArch = isArchetypeSkill(baseSkillName + ' (any)');
    const item = document.createElement('div');
    item.className = `skill-item specialty-item`;
    item.dataset.skillTemplate = baseSkillName;
    item.innerHTML = `<div class="skill-item-title">${baseSkillName} (<input type="text" class="specialty-input" placeholder="Specify..." oninput="recalculateSkillPoints()">)</div><div class="skill-input-container"><span>Base: ${skillData.base}%</span><input type="number" class="skill-input" value="${skillData.base}" min="${skillData.base}" data-base="${skillData.base}" data-skill-name="${newId}" oninput="recalculateSkillPoints()"></div><div class="skill-labels">${isOcc ? '<span class="skill-label occupation-label">Occupational</span>' : ''}${isArch ? '<span class="skill-label archetype-label">Archetype Bonus</span>' : ''}</div>`;
    container.appendChild(item);
}

function updateSkillPointTotals() {
    const { occPoints, persPoints } = getSkillPoints();
    document.getElementById('occ-total').textContent = occPoints;
    document.getElementById('pers-total').textContent = persPoints;
    recalculateSkillPoints();
}

function calculateAndDisplaySkillPoints() { 
    const skillAllocDiv = document.getElementById('skill-alloc'); 
    const selectedOccupationName = document.getElementById('occupation-select').value; 
    const minCR = character.occupation.crRange[0]; 
    let headerHTML = `<p class="subtitle" style="font-weight:bold; color: var(--glow-yellow);">Reminder: Your occupation (${selectedOccupationName}) requires a minimum Credit Rating of ${minCR}.</p>`; 
    
    const formulaText = character.occupation.skillPointsText;
    const choiceRegex = /\(([^)]+)\)/;
    const choiceMatch = formulaText.match(choiceRegex);
    if (choiceMatch && choiceMatch[1].includes(' or ')) {
        headerHTML += '<div id="occ-skill-choice-container"><h4>Choose Stat for Occupation Points:</h4>';
        const options = choiceMatch[1].split(' or ').map(s => s.trim().split(' ')[0]);
        options.forEach((opt, index) => {
            const checked = index === 0 ? 'checked' : '';
            headerHTML += `<label style="display: inline-block; margin-right: 15px;"><input type="radio" name="occ-skill-choice" value="${opt}" ${checked} onchange="updateSkillPointTotals()"> ${opt}</label>`;
        });
        headerHTML += '</div>';
    }
    
    skillAllocDiv.innerHTML = headerHTML; 
    
    // Set base values
    ALL_SKILLS.Dodge.base = Math.floor(character.characteristics.DEX / 2); 
    ALL_SKILLS['Language Own'].base = character.characteristics.EDU; 
    
    for (const category in SKILL_CATEGORIES) { 
        const categoryDiv = document.createElement('div'); 
        categoryDiv.className = 'skill-category'; 
        categoryDiv.innerHTML = `<h3>${category}</h3>`; 
        const gridDiv = document.createElement('div'); 
        gridDiv.className = 'skill-grid'; 
        
        SKILL_CATEGORIES[category].forEach(skillName => { 
            const skillData = ALL_SKILLS[skillName]; 
            if (!skillData) return; 
            
            if (skillData.isSpecialty) {
                const specialtyContainerId = `${skillName.replace(/[^a-zA-Z0-9]/g, '-')}-specialties`;
                const specialtyDiv = document.createElement('div');
                specialtyDiv.innerHTML = `<button onclick="addSpecialtySkill('${skillName}', '${specialtyContainerId}')">+ Add ${skillName} Specialty</button><div id="${specialtyContainerId}" class="skill-grid" style="grid-template-columns: 1fr; margin-top: 5px;"></div>`;
                gridDiv.appendChild(specialtyDiv);
            } else {
                const base = skillData.base; 
                const isOcc = isOccupationSkill(skillName); 
                const isArch = isArchetypeSkill(skillName); 
                const item = document.createElement('div'); 
                item.className = `skill-item`; 
                item.innerHTML = `<div class="skill-item-title">${skillName}</div><div class="skill-input-container"><span>Base: ${base}%</span><input type="number" class="skill-input" value="${base}" min="${base}" data-base="${base}" data-skill-name="${skillName}" oninput="recalculateSkillPoints()"></div><div class="skill-labels">${isOcc ? '<span class="skill-label occupation-label">Occupational</span>' : ''}${isArch ? '<span class="skill-label archetype-label">Archetype Bonus</span>' : ''}</div>`; 
                gridDiv.appendChild(item);
            }
        }); 
        categoryDiv.appendChild(gridDiv); 
        skillAllocDiv.appendChild(categoryDiv); 
    } 
    updateSkillPointTotals(); 
}

function recalculateSkillPoints() { 
    const { occPoints, persPoints, archPoints } = getSkillPoints(); 
    let archSpent = 0, occSpent = 0, persSpent = 0; 
    
    document.querySelectorAll('.skill-input').forEach(input => { 
        let skillName = input.dataset.skillName; 
        const parentItem = input.closest('.skill-item');
        let isArch, isOcc;
        
        if (parentItem.classList.contains('specialty-item')) {
            const templateName = parentItem.dataset.skillTemplate;
            isArch = isArchetypeSkill(templateName + ' (any)');
            isOcc = isOccupationSkill(templateName + ' (any)');
        } else {
            isArch = isArchetypeSkill(skillName);
            isOcc = isOccupationSkill(skillName);
        }
        
        const base = parseInt(input.dataset.base, 10); 
        const value = parseInt(input.value, 10); 
        
        if (isNaN(value) || value < base) return; 
        let pointsAdded = value - base; 
        
        if (isArch) { 
            const fromArch = Math.min(pointsAdded, archPoints - archSpent); 
            archSpent += fromArch; 
            pointsAdded -= fromArch; 
        } 
        if (isOcc || skillName === 'Credit Rating') { 
            const fromOcc = Math.min(pointsAdded, occPoints - occSpent); 
            occSpent += fromOcc; 
            pointsAdded -= fromOcc; 
        } 
        persSpent += pointsAdded; 
    }); 
    
    const archRemSpan = document.getElementById('arch-rem'); 
    archRemSpan.textContent = archPoints - archSpent; 
    archRemSpan.classList.toggle('overspent', archSpent > archPoints); 
    
    const occRemSpan = document.getElementById('occ-rem'); 
    occRemSpan.textContent = occPoints - occSpent; 
    occRemSpan.classList.toggle('overspent', occSpent > occPoints); 
    
    const persRemSpan = document.getElementById('pers-rem'); 
    persRemSpan.textContent = persPoints - persSpent; 
    persRemSpan.classList.toggle('overspent', persSpent > persPoints); 
    
    document.getElementById('complete-skills-btn').disabled = (archSpent > archPoints || occSpent > occPoints || persSpent > persPoints); 
}

function completeSkills() { 
    const minCR = character.occupation.crRange[0]; 
    const crInput = document.querySelector('.skill-input[data-skill-name="Credit Rating"]'); 
    if(parseInt(crInput.value, 10) < minCR) { 
        return alert(`You must allocate at least ${minCR} points to Credit Rating for a ${document.getElementById('occupation-select').value}.`); 
    } 
    
    character.skills = {}; 
    document.querySelectorAll('.skill-item').forEach(item => { 
        const skillInput = item.querySelector('.skill-input'); 
        let skillName = skillInput.dataset.skillName; 
        
        if (item.classList.contains('specialty-item')) {
            const specialtyInput = item.querySelector('.specialty-input');
            const specialty = specialtyInput.value.trim() || 'Unnamed';
            const templateName = item.dataset.skillTemplate;
            skillName = `${templateName} (${specialty})`;
        }
        
        character.skills[skillName] = +skillInput.value || 0; 
    }); 
    nextStep(7); 
}

function populateHindSelect() {
    const div = document.getElementById('hindrance-checkboxes');
    div.innerHTML = Object.entries(HINDRANCES).map(([key, data]) =>
        `<div class="hindrance-item"><div class="hindrance-header" onclick="toggleDescription(this)"><input type="checkbox" value="${key}" onclick="event.stopPropagation(); updateSelectedHindrances()"><span class="hindrance-name">${key}</span></div><div class="hindrance-description hidden">${data.desc}</div></div>`
    ).join('');
}

function populateTalSelect() {
    const div = document.getElementById('talent-checkboxes');
    div.innerHTML = Object.entries(TALENTS).map(([key, data]) =>
        `<div class="talent-item"><div class="talent-header" onclick="toggleDescription(this)"><input type="checkbox" value="${key}" onclick="event.stopPropagation(); updateSelectedTalents()"><span class="talent-name">${key}</span></div><div class="talent-description hidden">${data.desc}</div></div>`
    ).join('');
}

function toggleDescription(headerEl) {
    const parentItem = headerEl.parentElement;
    const description = parentItem.querySelector('.hindrance-description, .talent-description');
    if (description) {
        description.classList.toggle('hidden');
    }
}

function updateSelectedHindrances() {
    const checked = [...document.querySelectorAll('#hindrance-checkboxes input:checked')];
    character.hindrances = checked.map(cb => ({
        name: cb.value,
        value: HINDRANCES[cb.value].value,
        desc: HINDRANCES[cb.value].desc
    }));
    document.getElementById('selected-hinds').textContent = character.hindrances.map(h => h.name.split(' (')[0]).join(', ') || 'None';
    document.getElementById('talent-points').textContent = character.hindrances.reduce((sum, h) => sum + h.value, 0);
}

function updateSelectedTalents() {
    const checked = [...document.querySelectorAll('#talent-checkboxes input:checked')];
    character.talents = checked.map(cb => ({
        name: cb.value,
        value: TALENTS[cb.value].value,
        desc: TALENTS[cb.value].desc
    }));
    document.getElementById('selected-tals').textContent = character.talents.map(t => t.name.split(' (')[0]).join(', ') || 'None';
}

function rollNaturalTalent() {
    const allTalents = Object.entries(TALENTS);
    let rolledTalent = null;
    while (!rolledTalent) {
        const [name, data] = allTalents[Math.floor(Math.random() * allTalents.length)];
        if (data.value >= 1 && data.value <= 3) {
            rolledTalent = { name, value: data.value, desc: data.desc };
        }
    }
    character.naturalTalent = rolledTalent;
    document.getElementById('natural-talent').textContent = `${rolledTalent.name} (Value: ${rolledTalent.value})`;
}

function completeHT() { 
    nextStep(8); 
}

function completeBackstory() { 
    ['name', 'gender', 'description', 'ideology', 'significant-people', 'meaningful', 'traits', 'hair-eye', 'marks'].forEach(key => { 
        character[key.replace(/-/g, '')] = document.getElementById(key).value; 
    }); 
    character.madness = document.getElementById('madness').value; 
    character.heritageText = document.getElementById('heritage').selectedOptions[0].text; 
    nextStep(9); 
}

function generateAndDownloadJSON() {
    const jsonData = generateJsonData();
    const jsonString = JSON.stringify(jsonData, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
        alert("Character JSON copied to clipboard. Now go to your 'Importer' character in Roll20 and paste this into its bio field.");
    }, (err) => {
        alert("Failed to copy. Please copy the data from the downloaded file.");
    });
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const charName = character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'character';
    a.download = `${charName}_sheet.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateJsonData() {
    const { characteristics, skills } = character;
    const ageString = character.age || "22-39";
    const ageNum = parseInt(ageString.split('-')[0], 10);
    
    let data = {
        // Basic character info
        "name": character.name || "",
        "occupation": document.getElementById('occupation-select').value || "",
        "archetype": document.getElementById('archetype-select').value || "",
        "gender": character.gender || "",
        "age": ageNum,
        // Core characteristics
        "strength": characteristics.STR || 50,
        "constitution": characteristics.CON || 50,
        "size": characteristics.SIZ || 50,
        "dexterity": characteristics.DEX || 50,
        "appearance": characteristics.APP || 50,
        "intelligence": characteristics.INT || 50,
        "power": characteristics.POW || 50,
        "education": characteristics.EDU || 50,
        "luck": character.luck || 50,
        
        // Backstory fields
        "personal_description_value": character.description || "",
        "ideology_beliefs_value": character.ideology || "",
        "significant_people_value": character.significantpeople || "",
        "phobias_manias_value": character.madness || "",
        "meaningful_locations_value": character.meaningful || "",
        "traits_value": character.traits || "",
        "hair_eye_color_value": character.haireye || "",
        "distinguishing_marks_value": character.marks || "",
        "heritage_value": character.heritageText || "",
        
        // Initialize repeating sections
        "repeating_talents": [],
        "repeating_additionalskills": [],
        "repeating_artcraft": [],
        "repeating_languages": [],
        "repeating_psychic": [],
        "repeating_firearms": [],
        "repeating_fighting": [],
        "repeating_survival": [],
        
        // Critical sheet configuration
        "setting_header": "pulp",
        "toggle_pulp_archetype": "on",
        "toggle_pulp_talents": "on",
        "toggle_pulp_skills": "on",
        "toggle_pulp_hitpoint_calculation": "on",
        "toggle_pulp_luck_recovery": "on",
        "toggle_pulp_initiative": "on",
        "toggle_arkham_skills": "0",
        "include_reassure": "0",
        "enable_reassure_toggle": "0",
        "toggle_reassure": "on",
        "sheet_initialized": "yes",
        "dice_toggle": "1)]]}}{{roll_difficulty=[[1]",
        "edit_toggle": "0",
        "toggle_all_skills": "1",
        "tab_control": "skills",
        
        "bio": "",
        "gmnotes": ""
    };

    // Hide unwanted skills
    const skillsToDisable = [
        "artillery", "computer_use", "cthulhu_mythos", "diving", 
        "drive_auto", "hypnosis", "psychoanalysis", "rifle_shotgun",
        "clairvoyance", "divination", "psychometry"
    ];
    skillsToDisable.forEach(skill => {
        data[`${skill}_disabled`] = "on";
    });

    // Core skill mappings
    const coreSkillMap = {
        'Accounting': 'accounting',
        'Animal Handling': 'animal_handling', 
        'Anthropology': 'anthropology',
        'Appraise': 'appraise',
        'Archaeology': 'archaeology',
        'Fighting (Brawling)': 'brawl',
        'Charm': 'charm',
        'Climb': 'climb',
        'Credit Rating': 'credit_rating',
        'Demolitions': 'demolitions',
        'Disguise': 'disguise',
        'Electrical Repair': 'electrical_repair',
        'Fast Talk': 'fast_talk',
        'First Aid': 'first_aid',
        'Firearms (Handguns)': 'handgun',
        'History': 'history',
        'Intimidate': 'intimidate',
        'Jump': 'jump',
        'Law': 'law',
        'Library Use': 'library_use',
        'Listen': 'listen',
        'Locksmith': 'locksmith',
        'Mechanical Repair': 'mechanical_repair',
        'Medicine': 'medicine',
        'Natural World': 'natural_world',
        'Navigate': 'navigate',
        'Occult': 'occult',
        'Operate Heavy Machinery': 'operate_heavy_machinery',
        'Persuade': 'persuade',
        'Psychology': 'psychology',
        'Read Lips': 'read_lips',
        'Ride': 'ride',
        'Sleight of Hand': 'sleight_of_hand',
        'Spot Hidden': 'spot_hidden',
        'Stealth': 'stealth',
        'Swim': 'swim',
        'Throw': 'throw',
        'Track': 'track'
    };

    // Skills that go to specific slots first, then overflow to repeating
    const additionalSkillSlots = ['additional_skill_1', 'additional_skill_2', 'additional_skill_3'];
    const additionalSkillNames = ['additional_skill_1_name', 'additional_skill_2_name', 'additional_skill_3_name'];
    
    const additionalSkillsList = ['Gambling', 'Rope Use', 'Trap', 'Drive Coach/Wagon'];
    const psychicSkills = ['Medium', 'Telekinesis', 'Shamanic Magic', 'Witchcraft'];
    
    let fightingSkills = [];
    let firearmsSkills = [];
    let additionalSkillsQueue = [];

    // Process all skills
    for (const skillName in skills) {
        const skillValue = skills[skillName];
        
        if (coreSkillMap[skillName]) {
            data[coreSkillMap[skillName]] = skillValue;
        } else if (skillName.startsWith('Fighting (') && skillName !== 'Fighting (Brawling)') {
            fightingSkills.push({ fighting_skill_name: skillName, value: skillValue });
        } else if (skillName.startsWith('Firearms (') && skillName !== 'Firearms (Handguns)') {
            firearmsSkills.push({ firearms_skill_name: skillName, value: skillValue });
        } else if (additionalSkillsList.includes(skillName)) {
            additionalSkillsQueue.push({ name: skillName, value: skillValue });
        } else if (psychicSkills.includes(skillName)) {
            data.repeating_psychic.push({ name: skillName, value: skillValue });
        } else if (skillName === 'Survival') {
            data.repeating_survival.push({ name: skillName, value: skillValue });
        } else {
            const match = skillName.match(/^(.*?)\s\((.*)\)$/);
            if (match) {
                const base = match[1];
                const specialty = match[2];
                
                if (base === 'Art/Craft') {
                    data.repeating_artcraft.push({ name: specialty, value: skillValue });
                } else if (base === 'Language Other') {
                    data.repeating_languages.push({ name: specialty, value: skillValue });
                } else if (base === 'Science') {
                    additionalSkillsQueue.push({ name: skillName, value: skillValue });
                } else {
                    additionalSkillsQueue.push({ name: skillName, value: skillValue });
                }
            } else {
                additionalSkillsQueue.push({ name: skillName, value: skillValue });
            }
        }
    }

    // Handle additional skills - first 3 go to dedicated slots
    additionalSkillsQueue.forEach((skill, index) => {
        if (index < 3) {
            data[additionalSkillSlots[index]] = skill.value;
            data[additionalSkillNames[index]] = skill.name;
        } else {
            data.repeating_additionalskills.push(skill);
        }
    });

    // Handle fighting skills - first 3 go to dedicated slots
    fightingSkills.forEach((skill, index) => {
        if (index < 3) {
            data[`fighting_skill_${index + 1}_name`] = skill.fighting_skill_name;
            data[`fighting_skill_${index + 1}`] = skill.value;
        } else {
            data.repeating_fighting.push(skill);
        }
    });
    
    // Disable unused fighting skill slots
    for (let i = fightingSkills.length + 1; i <= 3; i++) {
        data[`fighting_skill_${i}_disabled`] = "on";
    }
    
    // Handle firearms skills - first 2 go to dedicated slots
    firearmsSkills.forEach((skill, index) => {
        if (index < 2) {
            data[`firearms_skill_${index + 1}_name`] = skill.firearms_skill_name;
            data[`firearms_skill_${index + 1}`] = skill.value;
        } else {
            data.repeating_firearms.push(skill);
        }
    });

    // Build talents section
    if (character.archetype && character.archetype.talent) {
        data.repeating_talents.push({
            talent_name: `${character.archetype.talent} (Archetype)`,
            talent_description: character.archetype.talentDesc || ''
        });
    }
    
    if (character.naturalTalent) {
        data.repeating_talents.push({
            talent_name: `${character.naturalTalent.name} (Natural)`,
            talent_description: character.naturalTalent.desc || ''
        });
    }
    
    if (character.talents && Array.isArray(character.talents)) {
        character.talents.forEach(talent => {
            data.repeating_talents.push({
                talent_name: talent.name,
                talent_description: talent.desc || ''
            });
        });
    }

    // Build bio content
    let bioContent = `Name: ${character.name || 'Unnamed Character'}\n`;
    bioContent += `Archetype: ${document.getElementById('archetype-select').value || 'Unknown'}\n`;
    bioContent += `Occupation: ${document.getElementById('occupation-select').value || 'Unknown'}\n`;
    bioContent += `Age: ${character.age || 'Unknown'}\n\n`;
    
    if (character.description) {
        bioContent += `Description: ${character.description}\n\n`;
    }
    
    if (character.heritageText) {
        bioContent += `Heritage: ${character.heritageText}\n\n`;
    }
    
    bioContent += `Talents:\n`;
    if (character.archetype && character.archetype.talent) {
        bioContent += `- ${character.archetype.talent} (Archetype): ${character.archetype.talentDesc || ''}\n`;
    }
    if (character.naturalTalent) {
        bioContent += `- ${character.naturalTalent.name} (Natural): ${character.naturalTalent.desc || ''}\n`;
    }
    if (character.talents && Array.isArray(character.talents)) {
        character.talents.forEach(t => {
            bioContent += `- ${t.name}: ${t.desc || ''}\n`;
        });
    }

    // Build GM notes with hindrances
    let gmNotesContent = "Character Creation Notes:\n\n";
    gmNotesContent += `Core Characteristic: ${coreCharacteristic || 'Unknown'} (${coreRollValue || 'Not rolled'})\n`;
    gmNotesContent += `Total Character Points Used: ${totalCharPoints + coreRollValue}\n\n`;
    
    gmNotesContent += "Hindrances:\n";
    if (character.hindrances && Array.isArray(character.hindrances)) {
        character.hindrances.forEach(h => {
            gmNotesContent += `- ${h.name}: ${h.desc || ''}\n`;
        });
        const totalHindrancePoints = character.hindrances.reduce((sum, h) => sum + h.value, 0);
        gmNotesContent += `\nTotal Hindrance Points: ${totalHindrancePoints}\n`;
    } else {
        gmNotesContent += "None selected.\n";
    }
    
    if (character.madness) {
        gmNotesContent += `\nBout of Madness: ${character.madness}\n`;
    }

    data.bio = bioContent;
    data.gmnotes = gmNotesContent;
    
    return data;
}

document.addEventListener('DOMContentLoaded', init);
