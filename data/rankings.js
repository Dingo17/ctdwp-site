/* =========================================================
   IRL RANKINGS — one line per country: "Pos. Country - Points"
   These are the starting ratings. Every International Series score entered
   from IRL_RANKINGS_FROM_SEASON onwards is applied on top automatically,
   using the World Rugby points-exchange method (as on lassen.co.nz):
     - rating gap = winner/home side's rating minus the other's, capped at +/-10
       (no home advantage since 1 July 2026)
     - win: 1 - gap/10, draw: 0 - gap/10 (points swapped between the sides)
     - winning margin over 12: x1.5 (adjusted from union's 15 for 6-point tries)   - World Cup match: x2
   Flags are drawn by the site (data/flags.js).
   ========================================================= */
window.IRL_RANKINGS_FROM_SEASON = 13;
window.IRL_RANKINGS = `
1. New Zealand - 90.64
2. Australia - 87.91
3. Tonga - 87.05
4. Samoa - 84.37
5. England - 80.99
6. Fiji - 78.49
7. Papua New Guinea - 78.48
8. Italy - 76.89
9. Cook Islands - 73.12
10. Lebanon - 72.16
11. Greece - 71.47
12. Jamaica - 70.76
13. France - 70.74
14. Scotland - 69.56
15. United States - 67.04
16. Ireland - 65.32
17. Ukraine - 59.91
18. Wales - 58.83
19. Argentina - 57.58
20. Serbia - 53.75
21. Canada - 53.29
22. Malta - 53.20
23. Netherlands - 47.25
`;
