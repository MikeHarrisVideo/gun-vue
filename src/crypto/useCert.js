import { SEA } from "../composables";

export async function issueCert({
	pair,
	tag = "word",
	dot = "",
	users = "*",
	personal = false
}) {
	let policy = { "*": `${tag}` };
	if (dot) {
		policy["."] = dot;
	}
	if (personal) {
		policy["+"] = "*";
	}

	try {
		let cert = await SEA.certify(users, policy, pair, null);
		return cert;
	} catch (e) {
		console.log("cert error: ", e);
		return "";
	}
}

export async function generateCerts({ pair, list = [] }) {
	const all = {};
	for (let opt of list) {
		all[opt.tag] = await issueCert({ ...opt, pair });
	}
	return all;
}
