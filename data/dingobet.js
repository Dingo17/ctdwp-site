/* =========================================================
   PRE-SEASON ADJUSTMENTS (used by Dingobet and the Power Rankings)
   Both rate teams from results only. Use this to nudge a club up or
   down for things the results can't see (signings, a returning team,
   injuries). Format:  CODE: [points, "short reason shown on the site"]
   Points are per game against an average team: +2 = about two points
   better, -5 = about five points worse. The nudge fades out over the
   club's first 8 games as real results come in.
   ========================================================= */
window.DINGOBET_ADJUST = {

14: {
  SOU: [+3,   "A strong squad that underperformed in Season 13"],
  WAR: [+2.5, "Top-four finish in Season 13 should count for something"],
  SYD: [+2.5, "Off-season recruits Xavier Savage and Adam Doueihi"],
  SGI: [+2,   "Good signings over the off-season"],
  CBY: [+1.5, "Good signings over the off-season"],
  GLD: [-3,   "Expected to struggle in Season 14"],
  PER: [-6,   "Back in the Premiership with a weaker squad"]
}

};
