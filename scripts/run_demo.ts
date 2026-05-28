import { evidenceGaps, reviewPosture, summary, vendorLane } from "../src/services/thirdPartyRiskEvidenceLedgerService.js";

console.log("third-party-risk-evidence-ledger demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`vendor lanes: ${vendorLane().length}`);
console.log(`evidence gaps: ${evidenceGaps().length}`);
console.log(`review packets: ${reviewPosture().length}`);
