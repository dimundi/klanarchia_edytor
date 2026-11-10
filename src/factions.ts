export const factions=['soldaci','mechanisci','hanza','rytualisci'] as const;
export type Faction=typeof factions[number];
export type FactionCost={faction:Faction;cost:number};
export const factionNames:Record<Faction,string>={soldaci:'Soldaci',mechanisci:'Mechaniści',hanza:'Hanza',rytualisci:'Rytualiści'};
export const factionLogos:Record<Faction,string>={soldaci:new URL('./assets/factions/logo-soldaci.svg',import.meta.url).href,mechanisci:new URL('./assets/factions/logo-mechanisci.svg',import.meta.url).href,hanza:new URL('./assets/factions/logo-hanza.svg',import.meta.url).href,rytualisci:new URL('./assets/factions/logo-rytualisci.svg',import.meta.url).href};

export const factionAspectRatios:Record<Faction,number>={"soldaci":1.117466,"mechanisci":0.849827,"hanza":0.743854,"rytualisci":1.162004};
