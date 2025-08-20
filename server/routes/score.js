const express = require('express');
const router = express.Router();


router.post('/', (req, res) => {
  const b = req.body || {};
  const clean = (v, min, max, d=0) => {
    v = Number.isFinite(Number(v)) ? Number(v) : d;
    return Math.max(min, Math.min(max, v));
  };

  const features = {
    repaymentOnTimePct: clean(b.repaymentOnTimePct, 0, 100, 90),
    utilizationPct: clean(b.utilizationPct, 0, 100, 35),
    dtiPct: clean(b.dtiPct, 0, 100, 30),
    monthsSinceLastDPD: Math.max(0, parseInt(b.monthsSinceLastDPD ?? 24, 10)),
    hardInquiries12m: Math.max(0, parseInt(b.hardInquiries12m ?? 1, 10)),
    avgAccountAgeMonths: Math.max(0, parseInt(b.avgAccountAgeMonths ?? 36, 10)),
    numActiveAccounts: Math.max(0, parseInt(b.numActiveAccounts ?? 3, 10))
  };

  // Points 
  let score = 300; // base

  // Repayment history
  if (features.repaymentOnTimePct >= 99) score += 130;
  else if (features.repaymentOnTimePct >= 95) score += 100;
  else if (features.repaymentOnTimePct >= 90) score += 70;
  else if (features.repaymentOnTimePct >= 80) score += 25;
  else score -= 40;

  // Utilization (lower is better)
  if (features.utilizationPct <= 10) score += 90;
  else if (features.utilizationPct <= 30) score += 65;
  else if (features.utilizationPct <= 50) score += 30;
  else if (features.utilizationPct <= 80) score -= 10;
  else score -= 50;

  // DTI
  if (features.dtiPct <= 20) score += 60;
  else if (features.dtiPct <= 35) score += 35;
  else if (features.dtiPct <= 45) score += 5;
  else if (features.dtiPct <= 60) score -= 25;
  else score -= 60;

  // Recency of delinquency
  if (features.monthsSinceLastDPD >= 24) score += 50;
  else if (features.monthsSinceLastDPD >= 12) score += 25;
  else if (features.monthsSinceLastDPD >= 6) score += 5;
  else if (features.monthsSinceLastDPD >= 3) score -= 25;
  else score -= 50;

  // Inquiries
  if (features.hardInquiries12m === 0) score += 25;
  else if (features.hardInquiries12m <= 2) score += 10;
  else if (features.hardInquiries12m <= 4) score -= 10;
  else score -= 30;

  // Depth
  if (features.avgAccountAgeMonths >= 60) score += 35;
  else if (features.avgAccountAgeMonths >= 36) score += 20;
  else if (features.avgAccountAgeMonths >= 18) score += 5;
  else score -= 15;

  if (features.numActiveAccounts >= 6) score += 25;
  else if (features.numActiveAccounts >= 3) score += 10;
  else if (features.numActiveAccounts >= 1) score += 0;
  else score -= 20;

  score = Math.max(300, Math.min(900, Math.round(score)));

  // Top-3 reason codes (negative impact first)
  const reasons = [];
  if (features.utilizationPct > 50) reasons.push("High revolving utilization");
  if (features.dtiPct > 45) reasons.push("High debt-to-income ratio");
  if (features.monthsSinceLastDPD < 6) reasons.push("Recent delinquency observed");
  if (features.hardInquiries12m > 2) reasons.push("Multiple recent hard inquiries");
  if (features.avgAccountAgeMonths < 18) reasons.push("Short average account age");
  if (features.numActiveAccounts < 1) reasons.push("Very thin credit file");

  if (reasons.length === 0) reasons.push("Strong repayment history and healthy utilization");

  res.json({
    score,
    bucket: score >= 750 ? "Prime" : score >= 700 ? "Near-Prime" : score >= 650 ? "Fair" : "Subprime",
    reasons: reasons.slice(0,3),
    features
  });
});

module.exports = router;
