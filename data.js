// Western RPG Character Data
const ARCHETYPES = {
    "Adventurer": { 
        core: ["DEX", "APP"], 
        occupations: ["Big Game Hunter", "Bounty Hunter", "Confidence Trickster", "Dilettante", "Entertainer", "Gambler", "Gentleman/lady", "Gunfighter", "Hobo", "Journalist", "Outlaw", "Scout", "Soldier"], 
        bonusSkills: ["Climb", "Drive Coach/Wagon", "First Aid", "Fighting (any)", "Firearms (any)", "Gambling", "Jump", "Language Other (any)", "Mechanical Repair", "Ride", "Stealth", "Survival", "Rope Use", "Swim"], 
        talent: 'Always Onward!', 
        talentDesc: 'Each round you can choose to get a 20% bonus to any roll of your choice. Furthermore, when travelling, you can move an additional D3 hexes per session.' 
    },
    "Beefcake": { 
        core: ["STR"], 
        occupations: ["Bounty Hunter", "Cowboy/girl", "Entertainer", "Farmer", "Gunfighter", "Hired Muscle", "Lawman", "Outlaw", "Pugilist", "Sailor", "Scout", "Soldier", "Tribe Member"], 
        bonusSkills: ["Climb", "Fighting (Brawling)", "Intimidate", "Listen", "Mechanical Repair", "Psychology", "Swim", "Throw"], 
        talent: 'Hard Hitter', 
        talentDesc: 'For the purposes of combat maneuvers and bonus damage, you count as having +1 to your Build. Furthermore, for each Build level more you have compared to an opponent, you gain advantage to combat maneuver against them.' 
    },
    "Cold Blooded": { 
        core: ["INT"], 
        occupations: ["Bounty Hunter", "Confidence Trickster", "Doctor", "Gambler", "Gunfighter", "Hired Muscle", "Journalist", "Lawman", "Lawyer", "Merchant", "Outlaw", "Politician", "Pugilist", "Scientist", "Soldier", "Spy", "Zealot"], 
        bonusSkills: ["Art/Craft (Acting)", "Disguise", "Fighting (any)", "Firearms (any)", "First Aid", "Gambling", "History", "Intimidate", "Law", "Listen", "Mechanical Repair", "Psychology", "Stealth", "Survival", "Track", "Trap"], 
        talent: 'All According to Plan', 
        talentDesc: 'Once per encounter, you can count any success as a critical success.' 
    },
    "Explorer": { 
        core: ["DEX", "POW"], 
        occupations: ["Author", "Big Game Hunter", "Coachman/woman", "Dilettante", "Gentleman/lady", "Hobo", "Merchant", "Miner", "Sailor", "Student/Teacher", "Scout", "Tribe Member"], 
        bonusSkills: ["Animal Handling", "Anthropology", "Archaeology", "Climb", "Drive Coach/Wagon", "Fighting (Brawling)", "First Aid", "Jump", "Language Other (any)", "Natural World", "Navigate", "Ride", "Rope Use", "Stealth", "Survival", "Track"], 
        talent: 'Born Traveler', 
        talentDesc: 'The difficulty level for Climb, Natural World, Navigate, Survival and Swim rolls is always reduced by 1 level. Furthermore, when you travel any HP lost due to hazards or the weather is halved.' 
    },
    "Hard Boiled": { 
        core: ["CON"], 
        occupations: ["Bounty Hunter", "Coachman/woman", "Cowboy/girl", "Farmer", "Gunfighter", "Hired Muscle", "Lawman", "Outlaw", "Pugilist", "Sailor", "Scout", "Soldier", "Zealot"], 
        bonusSkills: ["Fighting (Brawling)", "Firearms (any)", "Drive Coach/Wagon", "Fast Talk", "Intimidate", "Law", "Listen", "Locksmith", "Sleight of Hand", "Spot Hidden", "Rope Use", "Stealth", "Throw"], 
        talent: 'That all you got?', 
        talentDesc: 'You have to lose 75% of your HP in a round to gain a major wound and when you gain a major wound, you do not suffer from disadvantage.' 
    },
    "Hunter": { 
        core: ["INT", "CON"], 
        occupations: ["Big Game Hunter", "Bounty Hunter", "Cowboy/girl", "Dilettante", "Lawman", "Miner", "Outlaw", "Scout", "Tribe Member", "Zealot"], 
        bonusSkills: ["Animal Handling", "Fighting (any)", "Firearms (any)", "First Aid", "Listen", "Natural World", "Navigate", "Spot Hidden", "Ride", "Rope Use", "Stealth", "Survival", "Swim", "Track", "Trap"], 
        talent: 'No Escape', 
        talentDesc: 'Track and Trap rolls are always reduced by 1 level of difficulty and you gain +1 to your Move Rate. When rolling to maintain stamina during chases, you increase the success level by 1.' 
    },
    "Mystic": { 
        core: ["POW"], 
        occupations: ["Artist", "Confidence Trickster", "Craftsperson", "Doctor", "Entertainer", "Gentleman/lady", "Hobo", "Student/Teacher", "Scientist", "Tribe Member", "Zealot"], 
        bonusSkills: ["Art/Craft (any)", "Disguise", "History", "Language Other (any)", "Listen", "Natural World", "Occult", "Psychology", "Science", "Sleight of Hand", "Spot Hidden", "Stealth", "Track"], 
        talent: 'Powers', 
        talentDesc: 'Can use Magic (Medium, Telekinesis, Shamanic Magic, Witchcraft).' 
    },
    "Rogue": { 
        core: ["DEX", "APP"], 
        occupations: ["Artist", "Bartender", "Confidence Trickster", "Dilettante", "Entertainer", "Gambler", "Gentleman/lady", "Gunfighter", "Hobo", "Lawyer", "Outlaw", "Pugilist", "Spy"], 
        bonusSkills: ["Appraise", "Art/Craft (any)", "Charm", "Disguise", "Fast Talk", "Gambling", "Law", "Locksmith", "Psychology", "Read Lips", "Rope Use", "Sleight of Hand", "Spot Hidden", "Stealth", "Trap"], 
        talent: 'Scoundrel to The Bone', 
        talentDesc: 'Disguise, Fast Talk, Law, Sleight of Hand and Stealth rolls are always reduced by 1 level of difficulty.' 
    },
    "Scholar": { 
        core: ["EDU"], 
        occupations: ["Author", "Butler", "Dilettante", "Doctor", "Gentleman/lady", "Journalist", "Lawyer", "Librarian", "Merchant", "Politician", "Student/Teacher", "Scientist"], 
        bonusSkills: ["Accounting", "Appraise", "Anthropology", "Archaeology", "History", "Language Other (any)", "Law", "Library Use", "Medicine", "Natural World", "Occult", "Psychology", "Science"], 
        talent: 'Um, Actually', 
        talentDesc: 'INT and EDU rolls are always reduced by 1 level of difficulty. Furthermore, when you assist someone and you succeed on an INT or EDU roll, grant an additional +30% success chance.' 
    },
    "Steadfast": { 
        core: ["CON"], 
        occupations: ["Butler", "Cowboy/girl", "Craftsperson", "Doctor", "Farmer", "Gentleman/lady", "Gunfighter", "Hired Muscle", "Lawman", "Politician", "Pugilist", "Soldier", "Tribe Member"], 
        bonusSkills: ["Accounting", "Drive Coach/Wagon", "Fighting (any)", "Firearms (Handguns)", "First Aid", "History", "Intimidate", "Law", "Natural World", "Navigate", "Persuade", "Psychology", "Ride", "Spot Hidden", "Survival"], 
        talent: 'Bulwark of Justice', 
        talentDesc: 'If an ally suffered a major wound or is dying, gain advantage to all rolls. Once per encounter, if an ally within Move Rate is being targeted, you may choose to become the target instead.' 
    }
};

const OCCUPATIONS = {
    'Artist': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.POW * 2), skillPointsText: "EDU x 2 + (DEX x 2 or POW x 2)", crRange: [6, 60], skills: ['Art/Craft (any)', 'History', 'Library Use', 'Psychology', 'Spot Hidden', 'Sleight of Hand'] },
    'Author': { skillPointsFormula: (chars) => chars.EDU * 4, skillPointsText: "EDU x 4", crRange: [9, 30], skills: ['Art/Craft (Literature)', 'History', 'Library Use', 'Natural World or Occult', 'Language Other', 'Language Own', 'Psychology'] },
    'Bartender': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.APP * 2, skillPointsText: "EDU x 2 + APP x 2", crRange: [8, 25], skills: ['Accounting', 'two interpersonal skills (Charm, Fast Talk, Intimidate, or Persuade)', 'Fighting (Brawling)', 'Listen', 'Psychology', 'Spot Hidden'] },
    'Big Game Hunter': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.STR * 2), skillPointsText: "EDU x 2 + (DEX x 2 or STR x 2)", crRange: [20, 50], skills: ['Firearms', 'Listen or Spot Hidden', 'Natural World', 'Navigate', 'Other Language or Survival (any)', 'Stealth', 'Track', 'Trap'] },
    'Bounty Hunter': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.STR * 2), skillPointsText: "EDU x 2 + (DEX x 2 or STR x 2)", crRange: [9, 30], skills: ['Drive Coach/Wagon', 'Fighting or Firearms (any)', 'one interpersonal skill (Fast Talk, Charm, Intimidate, or Persuade)', 'Law', 'Psychology', 'Rope Use', 'Track', 'Trap', 'Stealth'] },
    'Butler': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.APP * 2, skillPointsText: "EDU x 2 + APP x 2", crRange: [20, 50], skills: ['Accounting', 'Appraise', 'Listen', 'Psychology', 'Spot Hidden', 'one interpersonal skill (Charm or Persuade)'] },
    'Coachman/woman': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.STR * 2), skillPointsText: "EDU x 2 + (DEX x 2 or STR x 2)", crRange: [9, 30], skills: ['Animal Handling', 'Drive Coach/Wagon', 'Listen', 'Mechanical Repair', 'Navigate', 'Spot Hidden'] },
    'Confidence Trickster': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.APP * 2, skillPointsText: "EDU x 2 + APP x 2", crRange: [9, 70], skills: ['Appraise', 'Art/Craft (Acting)', 'Disguise', 'Fast Talk', 'Gambling', 'Psychology', 'Sleight of Hand'] },
    'Cowboy/girl': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.STR * 2), skillPointsText: "EDU x 2 + (DEX x 2 or STR x 2)", crRange: [9, 20], skills: ['Firearms (Handgun or Shotgun)', 'First Aid', 'Jump', 'Natural World', 'Ride', 'Rope Use', 'Track'] },
    'Craftsperson': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.STR * 2), skillPointsText: "EDU x 2 + (DEX x 2 or STR x 2)", crRange: [10, 40], skills: ['Accounting', 'Appraise', 'Art/Craft (any)', 'Mechanical Repair', 'Persuade'] },
    'Dilettante': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.APP * 2, skillPointsText: "EDU x 2 + APP x 2", crRange: [50, 99], skills: ['Art/Craft (any)', 'Firearms', 'Language Other', 'Listen', 'Psychology', 'Ride', 'one interpersonal skill'] },
    'Doctor': { skillPointsFormula: (chars) => chars.EDU * 4, skillPointsText: "EDU x 4", crRange: [30, 80], skills: ['Accounting', 'First Aid', 'Medicine', 'Language Other', 'Psychology', 'Science'] },
    'Entertainer': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.APP * 2, skillPointsText: "EDU x 2 + APP x 2", crRange: [9, 70], skills: ['Art/Craft (Acting or Music)', 'Charm', 'Disguise', 'Fast Talk', 'Listen', 'Psychology', 'Sleight of Hand'] },
    'Farmer': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'CON' ? chars.CON * 2 : chars.STR * 2), skillPointsText: "EDU x 2 + (CON x 2 or STR x 2)", crRange: [9, 30], skills: ['Animal Handling', 'Art/Craft (Farming)', 'First Aid', 'Mechanical Repair', 'Natural World', 'Track'] },
    'Gambler': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'POW' ? chars.POW * 2 : chars.DEX * 2), skillPointsText: "EDU x 2 + (POW x 2 or DEX x 2)", crRange: [10, 60], skills: ['Accounting', 'Gambling', 'Listen', 'Psychology', 'Sleight of Hand', 'Spot Hidden', 'one interpersonal skill (Charm, Fast Talk, or Persuade)'] },
    'Gentleman/lady': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.APP * 2, skillPointsText: "EDU x 2 + APP x 2", crRange: [40, 99], skills: ['Art/Craft (any)', 'Firearms', 'History', 'Language Other', 'Law', 'Library Use', 'Ride', 'Persuade'] },
    'Gunfighter': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.DEX * 2, skillPointsText: "EDU x 2 + DEX x 2", crRange: [9, 70], skills: ['Dodge', 'Fighting (Brawl)', 'Firearms (any)', 'Ride', 'Stealth', 'Spot Hidden', 'Track', 'one interpersonal skill (Charm, Fast Talk, Intimidate, or Persuade)'] },
    'Hired Muscle': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'STR' ? chars.STR * 2 : chars.DEX * 2), skillPointsText: "EDU x 2 + (STR x 2 or DEX x 2)", crRange: [9, 30], skills: ['Dodge', 'Fighting (Brawl)', 'Firearms (any)', 'Intimidate', 'Spot Hidden', 'Stealth'] },
    'Hobo': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.CON * 2, skillPointsText: "EDU x 2 + CON x 2", crRange: [0, 5], skills: ['Climb', 'Fast Talk', 'Jump', 'Listen', 'Navigate', 'Sleight of Hand', 'Stealth', 'Survival'] },
    'Journalist': { skillPointsFormula: (chars) => chars.EDU * 4, skillPointsText: "EDU x 4", crRange: [9, 30], skills: ['Art/Craft (Photography)', 'Fast Talk', 'History', 'Language Own', 'Library Use', 'Persuade', 'Psychology'] },
    'Lawman': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.STR * 2), skillPointsText: "EDU x 2 + (DEX x 2 or STR x 2)", crRange: [20, 70], skills: ['Dodge', 'Fighting (Brawl)', 'Firearms (any)', 'Law', 'one interpersonal skill (Intimidate or Persuade)', 'Psychology', 'Ride', 'Spot Hidden', 'Track'] },
    'Lawyer': { skillPointsFormula: (chars) => chars.EDU * 4, skillPointsText: "EDU x 4", crRange: [30, 80], skills: ['Accounting', 'Fast Talk', 'Intimidate', 'Language Other', 'Law', 'Library Use', 'Persuade', 'Psychology'] },
    'Librarian': { skillPointsFormula: (chars) => chars.EDU * 4, skillPointsText: "EDU x 4", crRange: [9, 35], skills: ['Accounting', 'History', 'Language Other', 'Library Use', 'Spot Hidden'] },
    'Merchant': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.APP * 2, skillPointsText: "EDU x 2 + APP x 2", crRange: [20, 70], skills: ['Accounting', 'Appraise', 'Fast Talk', 'Law', 'Navigate', 'Persuade', 'Spot Hidden'] },
    'Miner': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'STR' ? chars.STR * 2 : chars.CON * 2), skillPointsText: "EDU x 2 + (STR x 2 or CON x 2)", crRange: [9, 30], skills: ['Climb', 'Demolitions', 'Electrical Repair', 'Mechanical Repair', 'Operate Heavy Machinery', 'Science (Geology)', 'Spot Hidden'] },
    'Outlaw': { skillPointsFormula: (chars, choice) => { let statVal = 0; if (choice === 'APP') statVal = chars.APP * 2; else if (choice === 'DEX') statVal = chars.DEX * 2; else statVal = chars.INT * 2; return chars.EDU * 2 + statVal; }, skillPointsText: "EDU x 2 + (APP x 2 or DEX x 2 or INT x 2)", crRange: [6, 70], skills: ['Dodge', 'Fighting (any)', 'Firearms (any)', 'Ride', 'Stealth', 'one interpersonal skill (Charm, Fast Talk, Intimidate, or Persuade)', 'Locksmith or Mechanical Repair', 'Psychology or Sleight of Hand', 'Spot Hidden'] },
    'Politician': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.APP * 2, skillPointsText: "EDU x 2 + APP x 2", crRange: [40, 90], skills: ['Charm', 'Fast Talk', 'History', 'Intimidate', 'Law', 'Listen', 'Persuade', 'Psychology'] },
    'Pugilist': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'STR' ? chars.STR * 2 : chars.DEX * 2), skillPointsText: "EDU x 2 + (STR x 2 or DEX x 2)", crRange: [9, 40], skills: ['Dodge', 'Fighting (Brawling)', 'Intimidate', 'Spot Hidden'] },
    'Sailor': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'STR' ? chars.STR * 2 : chars.DEX * 2), skillPointsText: "EDU x 2 + (STR x 2 or DEX x 2)", crRange: [9, 30], skills: ['Climb', 'Fighting (Brawling)', 'First Aid', 'Mechanical Repair', 'Natural World', 'Navigate', 'Swim'] },
    'Scientist': { skillPointsFormula: (chars) => chars.EDU * 4, skillPointsText: "EDU x 4", crRange: [10, 50], skills: ['Electrical Repair', 'Language Other', 'Library Use', 'Mechanical Repair', 'Science (any)', 'Spot Hidden'] },
    'Scout': { skillPointsFormula: (chars, choice) => { let statVal = 0; if (choice === 'DEX') statVal = chars.DEX * 2; else if (choice === 'STR') statVal = chars.STR * 2; else statVal = chars.CON * 2; return chars.EDU * 2 + statVal; }, skillPointsText: "EDU x 2 + (DEX x 2 or STR x 2 or CON x 2)", crRange: [0, 20], skills: ['Fighting (any)', 'Firearms (any)', 'First Aid', 'Natural World', 'Navigate', 'Ride', 'Rope Use', 'Stealth', 'Track', 'Trap'] },
    'Soldier': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.STR * 2), skillPointsText: "EDU x 2 + (DEX x 2 or STR x 2)", crRange: [9, 30], skills: ['Dodge', 'Fighting (any)', 'Firearms (any)', 'First Aid', 'Stealth', 'Survival', 'one interpersonal skill'] },
    'Spy': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'DEX' ? chars.DEX * 2 : chars.APP * 2), skillPointsText: "EDU x 2 + (DEX x 2 or APP x 2)", crRange: [20, 70], skills: ['Disguise', 'Fast Talk', 'Fighting (Brawling)', 'Firearms', 'Listen', 'Psychology', 'Sleight of Hand', 'Spot Hidden', 'Stealth'] },
    'Student/Teacher': { skillPointsFormula: (chars) => chars.EDU * 4, skillPointsText: "EDU x 4", crRange: [5, 40], skills: ['History', 'Language Other', 'Library Use', 'Persuade', 'Psychology', 'Science (any)'] },
    'Tribe Member': { skillPointsFormula: (chars, choice) => chars.EDU * 2 + (choice === 'CON' ? chars.CON * 2 : chars.POW * 2), skillPointsText: "EDU x 2 + (CON x 2 or POW x 2)", crRange: [0, 15], skills: ['Climb', 'Fighting (Indigenous Weapons)', 'Listen', 'Natural World', 'Occult', 'Spot Hidden', 'Stealth', 'Survival', 'Swim', 'Track'] },
    'Zealot': { skillPointsFormula: (chars) => chars.EDU * 2 + chars.POW * 2, skillPointsText: "EDU x 2 + POW x 2", crRange: [0, 30], skills: ['History', 'Intimidate', 'Law', 'Library Use', 'Occult', 'Persuade', 'Psychology'] }
};

const ALL_SKILLS = {
    'Accounting': {base: 5}, 'Animal Handling': {base: 5}, 'Anthropology': {base: 1}, 'Appraise': {base: 5}, 'Archaeology': {base: 1}, 
    'Art/Craft (Acting)': {base: 5}, 'Art/Craft (Fine Art)': {base: 1}, 'Art/Craft (Forgery)': {base: 1}, 'Art/Craft (Music)': {base: 5}, 
    'Art/Craft (Painting)': {base: 1}, 'Art/Craft (Photography)': {base: 5}, 'Art/Craft (Tinkering)': {base: 5}, 'Charm': {base: 15}, 
    'Climb': {base: 20}, 'Credit Rating': {base: 0}, 'Demolitions': {base: 1}, 'Disguise': {base: 5}, 'Dodge': {base: 0}, 
    'Drive Coach/Wagon': {base: 20}, 'Electrical Repair': {base: 10}, 'Fast Talk': {base: 5}, 'Fighting (Brawling)': {base: 25}, 
    'Fighting (Swords)': {base: 15}, 'Fighting (Indigenous Weapons)': {base: 20}, 'Firearms (Handguns)': {base: 20}, 
    'Firearms (Rifles)': {base: 25}, 'Firearms (Shotguns)': {base: 25}, 'Firearms (Missile Weapons)': {base: 15}, 
    'First Aid': {base: 30}, 'Gambling': {base: 10}, 'History': {base: 5}, 'Intimidate': {base: 15}, 'Jump': {base: 20}, 
    'Language Own': {base: 0}, 'Language Other': {base: 0, isSpecialty: true}, 'Law': {base: 5}, 'Library Use': {base: 20}, 
    'Listen': {base: 20}, 'Locksmith': {base: 1}, 'Mechanical Repair': {base: 10}, 'Medicine': {base: 1}, 'Medium': {base: 0}, 
    'Natural World': {base: 10}, 'Navigate': {base: 10}, 'Occult': {base: 5}, 'Operate Heavy Machinery': {base: 1}, 
    'Persuade': {base: 10}, 'Psychology': {base: 10}, 'Read Lips': {base: 1}, 'Ride': {base: 20}, 'Rope Use': {base: 5}, 
    'Science': {base: 1, isSpecialty: true}, 'Shamanic Magic': {base: 0}, 'Sleight of Hand': {base: 10}, 'Spot Hidden': {base: 25}, 
    'Stealth': {base: 20}, 'Survival': {base: 10}, 'Swim': {base: 20}, 'Telekinesis': {base: 0}, 'Throw': {base: 20}, 
    'Track': {base: 10}, 'Trap': {base: 10}, 'Witchcraft': {base: 0}
};

const SKILL_CATEGORIES = {
    "Fighting": ["Fighting (Brawling)", "Fighting (Swords)", "Fighting (Indigenous Weapons)"],
    "Firearms": ["Firearms (Handguns)", "Firearms (Rifles)", "Firearms (Shotguns)", "Firearms (Missile Weapons)", "Throw"],
    "Social": ["Charm", "Disguise", "Fast Talk", "Intimidate", "Persuade", "Psychology", "Read Lips"],
    "Knowledge": ["Accounting", "Anthropology", "Archaeology", "History", "Language Own", "Language Other", "Law", "Library Use", "Medicine", "Occult", "Science"],
    "Physical": ["Climb", "Jump", "Ride", "Stealth", "Swim"],
    "Survival & Perception": ["Animal Handling", "First Aid", "Listen", "Natural World", "Navigate", "Sleight of Hand", "Spot Hidden", "Survival", "Track"],
    "Technical & Craft": ["Appraise", "Art/Craft (Acting)", "Art/Craft (Fine Art)", "Art/Craft (Forgery)", "Art/Craft (Music)", "Art/Craft (Painting)", "Art/Craft (Photography)", "Art/Craft (Tinkering)", "Demolitions", "Electrical Repair", "Locksmith", "Mechanical Repair", "Operate Heavy Machinery"],
    "Psychic": ["Medium", "Telekinesis", "Shamanic Magic", "Witchcraft"],
    "Additional": ["Gambling", "Rope Use", "Trap", "Drive Coach/Wagon"],
    "Core": ["Credit Rating", "Dodge"]
};

const HINDRANCES = {
    'Blind (7)': {value: 7, desc: 'You can\'t see! You suffer -80% to any skill that requires sight. You increase the difficulty level of Spot Hidden rolls by 2.'},
    'Cursed (5)': {value: 5, desc: 'Whether real or imagined, you truly feel cursed. Nothing goes your way. Half your LUCK. When you fumble, the result is always really bad.'},
    'Death Wish (4)': {value: 4, desc: 'Your life ain\'t worth much and you know it. To flee, you must succeed in a Hard POW roll or stay in the fight. You cannot use Luck to avoid certain death.'},
    'Loco (3)': {value: 3, desc: 'You never were all there. When you roll to see how much sanity you lose, roll the result twice and pick the highest one.'},
    'Heroic (3)': {value: 3, desc: 'As a noble soul, you never say no to a person in need. You can\'t let innocents hurt or suffer, you will always intervene or help them, free of charge.'},
    'Bloodthirsty (3)': {value: 3, desc: 'You enjoy seeing the light leave their eyes. You never take prisoners or just wing your opponents. Whenever you want to not kill a person, you must take a Hard POW roll.'},
    'Yellow-Belly (3)': {value: 3, desc: 'Not everyone\'s got cold ice-water in their veins. You increase the difficulty level of POW rolls by 1. Intimidation rolls always count as one level higher of success against you.'},
    'All Thumbs (2)': {value: 2, desc: 'You\'re real clumsy. You suffer disadvantage to all Sleight of Hand, Locksmith, Operate Heavy Machinery and repair rolls. You cannot Quick Reload.'},
    'Ugly (2)': {value: 2, desc: 'That is a face only a mama could love! You increase the difficulty level of APP, Charm and Persuade rolls by 1.'},
    'Mean (2)': {value: 2, desc: 'Who pissed in your coffee?! You do not do things for free. Your reputation will usually suffer. You suffer disadvantage to Charm and Persuade rolls.'},
    'Bad Eyes (2)': {value: 2, desc: 'You just can\'t see that good. When you shoot beyond your Point Blank range, you suffer disadvantage to hit. You increase the difficulty level of Spot Hidden rolls by 1.'},
    'Hesitant (2)': {value: 2, desc: 'You always overthink your move, partner. You suffer disadvantage when determining DEX order at the beginning of combat.'},
    'Can\'t Swim (1)': {value: 1, desc: 'Whenever you hit the water, you sink like a rock. When submerged in water, you immediately start drowning.'},
    'Curious (1)': {value: 1, desc: 'It killed the cat and might just kill you! To resist temptation to peek, go where you shouldn\'t, or ask when you shouldn\'t, you must take a combined INT and POW roll.'},
    'Hard of Hearin\' (1)': {value: 1, desc: 'WHAAAAT?! You increase the difficulty level of Listen rolls by 1.'},
    'Slowpoke (1)': {value: 1, desc: 'Molasses on a cold day move faster than you. You reduce your Move Rate by 1 (on foot).'},
    'Tongue-Tied (1)': {value: 1, desc: 'You always flub your one-liners and insults. You suffer -10% to Charm, Fast Talk, Intimidate, Persuade and Languages.'}
};

const TALENTS = {
    'True Grit (7)': {value: 7, desc: 'Backing down just ain\'t in your blood partner! At the beginning of each session, you recover POW in the same way you do Luck. You have advantage to all POW rolls.'},
    'Fast as Lightnin\' (6)': {value: 6, desc: 'Faster than their own shadow. You count all DEX rolls as 1 level of success higher. Unless someone else has this talent, you always go first in combat.'},
    'Meanest of the Bunch (5)': {value: 5, desc: 'You are one of the meanest hombres to walk the West. Whenever you do damage you roll an additional damage die of the same type.'},
    'Reputation (5)': {value: 5, desc: 'You already earned yourself quite the reputation in these parts. You start with the "Depend who\'s Asking" reputation and a nickname of choice.'},
    'Tough as Nails (4)': {value: 4, desc: 'You chew razor-blades for breakfast. You count all CON rolls as 1 level of success higher. You only ever take base damage, ignoring brutal and vicious damage.'},
    'Guts (3)': {value: 3, desc: 'You got some real sand in ya! You increase the success level of POW rolls by 1. Intimidation rolls always count as one level lower of success against you.'},
    'Duelist (3)': {value: 3, desc: 'Maybe not the fastest gun in the West, but you have won your fair share of duels. During a duel, you have advantage to all rolls.'},
    'Level-Headed (3)': {value: 3, desc: 'Speed is overrated compared to keeping your cool. Opponents do not get the Outnumbered bonus against you.'},
    'Sharpshooter (3)': {value: 3, desc: 'You can shoot a gnat\'s ass off from a hundred yards! As long as you do not move, you increase the success level of your ranged hits by 1 when using rifles.'},
    'Silver-Tongued (3)': {value: 3, desc: 'You truly have a gift for words! You have advantage to all Charm, Fast talk, Language and Persuade rolls.'},
    'Thick-Skinned (3)': {value: 3, desc: 'You can handle more than a little pain. Whenever you suffer damage, you subtract D3 from the received damage.'},
    'Eagle Eyes (2)': {value: 2, desc: 'You increase the success level of Spot Hidden rolls by 1. You ignore the penalties to hit from weather effects.'},
    'Deadeye (2)': {value: 2, desc: 'Throats, eyes and hearts are the only thing worth shooting at. You cause brutal damage with ranged weapons.'},
    'Nerves O\' Steel (2)': {value: 2, desc: 'Nothing rattles you. You have advantage to POW rolls. When you lose sanity, you only lose half.'},
    'Quickdraw (2)': {value: 2, desc: 'Not quite fast, but quite quick. You gain +50% DEX roll to determine who goes first in combat (including duels).'},
    'Animal Lover (1)': {value: 1, desc: 'Animals can sense your good nature. You count all Animal Handling rolls as 1 level of success higher.'},
    'Gallows Humor (1)': {value: 1, desc: 'Some people just laugh at the Grim Reaper. If you lose sanity, you can roll Charm or Fast Talk. If you succeed, you only lose half.'},
    'Card Sharp (1)': {value: 1, desc: 'Little bit of talent, little bit of cheating. You have advantage on Gamble and Sleight of Hand rolls.'},
    'Keen (1)': {value: 1, desc: 'You notice the little things. You have advantage to Spot Hidden, Track and Listen.'},
    'Fleet-Footed (1)': {value: 1, desc: 'You gain +1 to your Move Rate (on foot).'},
    'Light Sleeper (1)': {value: 1, desc: 'The slightest twig-crack wakes you. When sleeping, anyone sneaking up on you must succeed a Hard stealth roll.'},
    'Iron Liver (1)': {value: 1, desc: 'If your liver could absorb bullets like it does whiskey, you\'d be immortal. You always count CON rolls against alcohol as 1 level of success higher.'},
    'Evil Eye (1)': {value: 1, desc: 'Your eyes just got that killer\'s edge. You have advantage to Intimidation rolls.'},
    'Ruthless (1)': {value: 1, desc: 'You done worse than most and aren\'t easily impressed. You do not lose sanity for killing, torturing or seeing gruesome sights.'}
};
