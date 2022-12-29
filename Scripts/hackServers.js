/** @param {NS} ns */

export async function main(ns) {

	const target = ns.scan(); //scan all targets that can be found from home. Won't go deeper than 1 level.
	const playerPortsAccess = 5; //Amount of ports that can be hacked by user by using the software for it.

	for (let i = 0; i < target.length; ++i) {

		if (ns.getServerRequiredHackingLevel(target[i]) <= ns.getHackingLevel() && ns.getServerNumPortsRequired(target[i]) <= playerPortsAccess) {
			// if ports to hack is eq/higher than 1, run brutessh.
			if (ns.getServerNumPortsRequired(target[i]) >= 1 && ns.getServerNumPortsRequired(target[i]) <= playerPortsAccess) {
				ns.tprint("Opening SSH Port on machine: " + target[i] + ".");
				ns.brutessh(target[i]);
				ns.tprint("Opening SSH Port on machine: " + target[i] + " done.");
				ns.nuke(target[i]);
				if (!ns.hasRootAccess(target[i])) {
					ns.nuke(target[i]);
				}
				await ns.sleep(1000);
			}
			// if ports to hack is eq/higher than 2, run ftpcrack.
			if (ns.getServerNumPortsRequired(target[i]) >= 2 && ns.getServerNumPortsRequired(target[i]) <= playerPortsAccess) {
				ns.tprint("Opening FTP Port on machine: " + target[i]);
				ns.ftpcrack(target[i]);
				ns.tprint("Opened FTP port on machine: " + target[i] + ".");
				if (!ns.hasRootAccess(target[i])) {
					ns.nuke(target[i]);
				}
				await ns.sleep(1000);
			}
			// if server has root access, calculate how much threads the script can use, rm the old script, deploy new script and run it with max threads.
			if (ns.hasRootAccess(target[i])) {
				let maxThreads = (parseInt(ns.getServerMaxRam(target[i]) / ns.getScriptRam("moneyScript.script")));
				ns.kill("moneyScript.script", target[i]);
				ns.rm("moneyScript.script", target[i]);
				ns.scp("moneyScript.script", target[i], "home");
				ns.exec("moneyScript.script", target[i], maxThreads);
			}
		}
	}
}