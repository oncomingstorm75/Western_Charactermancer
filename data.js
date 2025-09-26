// Western RPG Character Data
const ARCHETYPES = {
    "Adventurer": { 
        core: ["DEX", "APP"], 
        occupations: ["Archaeologist", "Big Game Hunter", "Bounty Hunter", "Confidence Trickster", "Dilettante", "Entertainer", "Expressman/woman", "Gambler", "Gentleman/lady", "Gunfighter", "Hobo", "Journalist", "Outlaw", "Scout/Mountain Person", "Soldier/Warrior"], 
        bonusSkills: ["Climb", "Drive Coach/Wagon", "First Aid", "Fighting (any)", "Firearms (any)", "Gambling", "Jump", "Language Other (any)", "Mechanical Repair", "Ride", "Stealth", "Survival", "Rope Use", "Swim"], 
        talent: 'Always Onward!', 
        talentDesc: 'Each round you can choose to get a 20% bonus to any roll of your choice. Furthermore, when travelling, you can move an additional D3 hexes per session.' 
    },
    "Beefcake": { 
        core: ["STR"], 
        occupations: ["Bounty Hunter", "Cowboy/girl", "Entertainer", "Farmer", "Gunfighter", "Hired Muscle", "Lawman", "Outlaw", "Person of God", "Pugilist", "Sailor", "Scout/Mountain Person", "Soldier/warrior", "Tribe Member"], 
        bonusSkills: ["Climb", "Fighting (Brawling)", "Intimidate", "Listen", "Mechanical Repair", "Psychology", "Swim", "Throw"], 
        talent: 'Hard Hitter', 
        talentDesc: 'For the purposes of combat maneuvers and bonus damage, you count as having +1 to your Build. Furthermore, for each Build level more you have compared to an opponent, you gain advantage to combat maneuver against them.' 
    },
    "Bon Vivant": { 
        core: ["SIZ"], 
        occupations: ["Artist", "Author", "Big Game Hunter", "Butler", "Confidence Trickster", "Dilettante", "Entertainer", "Gambler", "Gentleman/lady", "Hobo", "Hooker", "Itinerant Worker", "Librarian", "Merchant", "Politician", "Rancher"], 
        bonusSkills: ["Appraise", "Art/Craft (any)", "Charm", "Fast Talk", "Language Other (any)", "Listen", "Spot Hidden", "Psychology", "Gambling"], 
        talent: 'Living Life!', 
        talentDesc: 'You double the HP regained from whiskey and the sanity regained from other pleasures.' 
    },
    "Cold Blooded": { 
        core: ["INT"], 
        occupations: ["Bounty Hunter", "Confidence Trickster", "Doctor", "Gambler", "Gunfighter", "Hired Muscle", "Hooker", "Journalist", "Lawman", "Lawyer/Judge", "Merchant", "Outlaw", "Politician", "Pugilist", "Scientist/Engineer", "Soldier", "Spy", "Zealot"], 
        bonusSkills: ["Art/Craft (Acting)", "Disguise", "Fighting (any)", "Firearms (any)", "First Aid", "Gambling", "History", "Intimidate", "Law", "Listen", "Mechanical Repair", "Psychology", "Stealth", "Survival", "Track", "Trap"], 
        talent: 'All According to Plan', 
        talentDesc: 'Once per encounter, you can count any success as a critical success.' 
    },
    "Egghead": { 
        core: ["INT", "EDU"], 
        occupations: ["Author", "Craftsperson", "Doctor", "Gambler", "Itinerant Worker", "Journalist", "Lawyer/Judge", "Librarian", "Minor", "Student/Teacher", "Scientist/Engineer"], 
        bonusSkills: ["Anthropology", "Appraise", "Electrical Repair", "First Aid", "Gambling", "Language Other (any)", "Library Use", "Mechanical Repair", "Operate Heavy Machinery", "Science", "Trap"], 
        talent: 'Eureka!', 
        talentDesc: 'You can create Gadgets and the difficulty level for any relevant skill is reduced by 1.' 
    },
    "Explorer": { 
        core: ["DEX", "POW"], 
        occupations: ["Author", "Big Game Hunter", "Coachman/woman", "Dilettante", "Expressman/woman", "Gentleman/lady", "Hobo", "Itinerant Worker", "Person of God", "Merchant", "Miner", "Sailor", "Student/Teacher", "Scout", "Tribe Member"], 
        bonusSkills: ["Animal Handling", "Anthropology", "Archaeology", "Climb", "Drive Coach/Wagon", "Fighting (Brawling)", "First Aid", "Jump", "Language Other (any)", "Natural World", "Navigate", "Ride", "Rope Use", "Stealth", "Survival", "Track"], 
        talent: 'Born Traveler', 
        talentDesc: 'The difficulty level for Climb, Natural World, Navigate, Survival and Swim rolls is always reduced by 1 level. Furthermore, when you travel any HP lost due to hazards or the weather is halved.' 
    },
    "Femme Fatale": { 
        core: ["APP", "INT"], 
        occupations: ["Artist", "Bartender", "Bounty Hunter", "Confidence Trickster", "Dilettante", "Entertainer", "Gambler", "Gentleman/lady", "Hooker", "Journalist", "Librarian", "Outlaw", "Politician", "Spy"], 
        bonusSkills: ["Art/Craft (Acting)", "Appraise", "Charm", "Disguise", "Drive Coach/Wagon", "Fast Talk", "Fighting (Brawling)", "Firearms (Handguns)", "Gambling", "Listen", "Psychology", "Read Lips", "Rope Use", "Sleight of Hand", "Stealth", "Trap"], 
        talent: 'Irresistible', 
        talentDesc: 'Charm and Persuade rolls are always reduced by 1 level of difficulty. Furthermore, anyone who fails an opposed roll (Charm vs Charm or POW) suffers disadvantage when targeting you.' 
    },
    "Hard Boiled": { 
        core: ["CON"], 
        occupations: ["Bounty Hunter", "Coachman/woman", "Cowboy/girl", "Farmer", "Gunfighter", "Hired Muscle", "Lawman", "Outlaw", "Person of God", "Pugilist", "Sailor", "Scout", "Soldier", "Zealot"], 
        bonusSkills: ["Fighting (Brawling)", "Firearms (any)", "Drive Coach/Wagon", "Fast Talk", "Intimidate", "Law", "Listen", "Locksmith", "Sleight of Hand", "Spot Hidden", "Rope Use", "Stealth", "Throw"], 
        talent: 'That all you got?', 
        talentDesc: 'You have to lose 75% of your HP in a round to gain a major wound and when you gain a major wound, you do not suffer from disadvantage.' 
    },
    "Hunter": { 
        core: ["INT", "CON"], 
        occupations: ["Big Game Hunter", "Bounty Hunter", "Cowboy/girl", "Dilettante", "Expressman/woman", "Lawman", "Miner", "Outlaw", "Scout", "Tribe Member", "Zealot"], 
        bonusSkills: ["Animal Handling", "Fighting (any)", "Firearms (any)", "First Aid", "Listen", "Natural World", "Navigate", "Spot Hidden", "Ride", "Rope Use", "Stealth", "Survival", "Swim", "Track", "Trap"], 
        talent: 'No Escape', 
        talentDesc: 'Track and Trap rolls are always reduced by 1 level of difficulty and you gain +1 to your Move Rate. When rolling to maintain stamina during chases, you increase the success level by 1.' 
    },
    "Mystic": { 
        core: ["POW"], 
        occupations: ["Artist", "Confidence Trickster", "Craftsperson", "Doctor", "Entertainer", "Gentleman/lady", "Hobo", "Person of God", "Student/Teacher", "Scientist/Engineer", "Tribe Member", "Zealot"], 
        bonusSkills: ["Art/Craft (any)", "Disguise", "History", "Language Other (any)", "Listen", "Natural World", "Occult", "Psychology", "Science", "Sleight of Hand", "Spot Hidden", "Stealth", "Track"], 
        talent: 'Powers', 
        talentDesc: 'Can use Magic (Medium, Telekinesis, Shamanic Magic, Witchcraft).' 
    },
    "Outsider": { 
        core: ["INT", "CON"], 
        occupations: ["Artist", "Craftsperson", "Dilettante", "Entertainer", "Farmer", "Expressman/woman", "Hobo", "Itinerant Worker", "Miner", "Person of God", "Sailor", "Scout", "Tribe Member", "Zealot"], 
        bonusSkills: ["Art/Craft (any)", "Animal Handling", "Fighting (any)", "First Aid", "Intimidate", "Language Other (any)", "Listen", "Medicine", "Navigate", "Stealth", "Survival (any)", "Track"], 
        talent: 'Unorthodox Methods', 
        talentDesc: 'Once per encounter can reverse the roll of a D100 and when an ally fails a roll, the outsider can use the same characteristic or skill against the obstacle/hazard with advantage.' 
    },
    "Rogue": { 
        core: ["DEX", "APP"], 
        occupations: ["Artist", "Bartender", "Confidence Trickster", "Dilettante", "Entertainer", "Gambler", "Gentleman/lady", "Gunfighter", "Hobo", "Hooker", "Lawyer", "Outlaw", "Pugilist", "Spy"], 
        bonusSkills: ["Appraise", "Art/Craft (any)", "Charm", "Disguise", "Fast Talk", "Gambling", "Law", "Locksmith", "Psychology", "Read Lips", "Rope Use", "Sleight of Hand", "Spot Hidden", "Stealth", "Trap"], 
        talent: 'Scoundrel to The Bone', 
        talentDesc: 'Disguise, Fast Talk, Law, Sleight of Hand and Stealth rolls are always reduced by 1 level of difficulty.' 
    },
    "Scholar": { 
        core: ["EDU"], 
        occupations: ["Author", "Butler", "Dilettante", "Doctor", "Gentleman/lady", "Journalist", "Lawyer/Judge", "Librarian",