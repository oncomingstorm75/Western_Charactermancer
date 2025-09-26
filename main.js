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
    document.getElementById('secondary-display').innerHTML = `<p><strong>Move:</strong> ${character.characteristics.Move}</p><p><strong>Hit Points:</strong> ${character.characteristics.HP}</p><p><strong>Magic Points:</strong> ${character.characteristics.MP}</p><p><strong>Sanity:</strong> ${character.characteristics.Sanity}</p><p><strong>Build:</strong> ${character.characteristics.Build}</p><p><strong>Dodge Base:</strong> ${character.skills.Dodge}