/** @param {NS} ns */
export async function main(ns) {
	let target = ns.getPurchasedServers();
	let amountRam = 512; //Amount of RAM To buy in GB's.

	for (let i = 0; i < target.length; ++i) {
		ns.upgradePurchasedServer(target[i], amountRam);
		ns.tprint("Ram of server: " + target[i] + " upgraded.");
	}
}