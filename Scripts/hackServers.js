/** @param {NS} ns */

export async function main(ns) {

	const target = ns.scan(); //scan all targets that can be found from home. Won't go deeper than 1 level.
	const playerPortsAccess = 5; //Amount of ports that can be hacked by user by using the software for it.

	for (const element of target) {

		if (ns.getServerRequiredHackingLevel(element) <= ns.getHackingLevel() && ns.getServerNumPortsRequired(element) <= playerPortsAccess) {
			// if ports to hack is eq/higher than 1, run brutessh.
			if (ns.getServerNumPortsRequired(element) >= 1 && ns.getServerNumPortsRequired(element) <= playerPortsAccess) {
				ns.brutessh(element);
				await ns.sleep(1000);
			}
			// if ports to hack is eq/higher than 2, run ftpcrack.
			if (ns.getServerNumPortsRequired(element) >= 2 && ns.getServerNumPortsRequired(element) <= playerPortsAccess) {
				ns.ftpcrack(element);
				await ns.sleep(1000);
			}

			if (!ns.hasRootAccess(element)) {
				ns.nuke(element);
			}
			// if server has root access, calculate how much threads the script can use, rm the old script, deploy new script and run it with max threads.
			if (ns.hasRootAccess(element)) {
				let maxThreads = (parseInt(ns.getServerMaxRam(element) / ns.getScriptRam("moneyScript.script")));
				ns.kill("moneyScript.script", element);
				ns.rm("moneyScript.script", element);
				ns.scp("moneyScript.script", element, "home");
				ns.exec("moneyScript.script", element, maxThreads);
			}
		}
	}
}