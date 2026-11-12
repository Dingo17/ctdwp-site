/* =========================================================
   MATCH STATS — completed games only
   Keyed by the match id (the end of its match centre link,
   e.g. #match-intl-13-0-0 → "intl-13-0-0").

   Player of the Match: TEAM Full Name
   Team Stats: one line each, home side first
   Then each team's code and one line per player, in team-list order:
     No | ROLE | Name | Rating | MINS AR ARM PASS T MT TB LB K KMG TA ERR PEN TRIES C FG PG
   ROLE: FB W C 5/8 HB PR HK SR L      Rating: number or N/A
   (AR all runs, ARM run metres, T tackles, MT missed tackles, TB tackle busts,
    LB line breaks, K kicks, KMG kick metres, TA try assists, ERR errors,
    PEN penalties, C conversions, FG field goals, PG penalty goals)
   ========================================================= */
window.MATCH_STATS = {

"intl-13-0-0": `
Player of the Match: AUS Fletcher Sharpe
Team Stats:
Tries 2 - 2
Goals 3 - 2
Field Goals 0 - 0
Possession 45% - 55%
Completions 4/12 - 5/13
Errors 8 - 9
Penalties Conceded 0 - 1
Tackles 68 - 46
Missed Tackles 4 - 3
Line Breaks 19 - 14

AUS:
1  | FB  | Reece Walsh             | 39  | 80 6 49 6 5 1 0 1 0 0 0 1 0 0 0 0 0
2  | W   | Xavier Savage           | 36  | 80 6 49 2 0 1 0 3 0 0 0 0 0 0 0 0 0
3  | FB  | Tom Trbojevic           | 56  | 80 6 42 4 3 0 0 2 0 0 0 0 0 1 0 0 0
4  | FB  | Latrell Mitchell        | 32  | 80 7 42 5 0 1 0 2 0 0 0 0 0 0 0 0 0
5  | C   | Jack Bostock            | 35  | 80 3 51 2 4 1 0 1 0 0 0 1 0 0 0 0 0
6  | 5/8 | Fletcher Sharpe         | 64  | 80 14 155 10 3 0 0 3 1 35 1 2 0 0 0 0 0
7  | HB  | Nathan Cleary           | 46  | 80 9 61 8 5 0 0 2 0 0 0 1 0 0 2 0 1
8  | L   | Patrick Carrigan        | 32  | 67 4 49 2 6 0 0 2 0 0 0 1 0 0 0 0 0
9  | HK  | Harry Grant             | 50  | 80 14 60 22 13 0 0 0 0 0 0 0 0 0 0 0 0
10 | L   | Cameron Murray          | 50  | 67 9 43 8 9 0 0 1 0 0 0 0 0 0 0 0 0
11 | SR  | Dylan Lucas             | 54  | 80 7 61 6 7 0 0 2 0 0 0 1 0 1 0 0 0
12 | SR  | Hudson Young            | 35  | 80 4 24 3 8 0 0 0 0 0 0 1 0 0 0 0 0
13 | L   | Isaah Yeo               | 26  | 73 5 22 5 7 0 0 0 0 0 0 1 0 0 0 0 0
14 | SR  | Liam Martin             | 19  | 20 2 5 1 2 0 0 0 0 0 1 0 0 0 0 0 0
15 | PR  | Reuben Cotter           | 11  | 13 1 2 1 1 0 0 0 0 0 0 0 0 0 0 0 0
16 | 5/8 | Ethan Strange           | 4   | 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
17 | PR  | Lindsay Collins         | 4   | 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0

TON:
1  | W   | Lehi Hopoate            | 20  | 80 3 17 3 5 0 0 0 0 0 0 0 0 0 0 0 0
2  | W   | Dallin Watene-Zelezniak | 54  | 80 5 44 4 4 1 0 3 0 0 0 1 0 1 0 0 0
3  | C   | Tolutau Koula           | 41  | 80 6 30 6 5 0 0 1 0 0 1 2 0 1 0 0 0
4  | C   | Robert Toia             | 18  | 80 2 55 1 1 0 0 2 0 0 0 1 0 0 0 0 0
5  | W   | Jojo Fifita             | 23  | 80 1 8 0 4 0 0 0 0 0 0 0 0 0 0 0 0
6  | C   | Kotoni Staggs           | 39  | 80 11 72 13 4 0 0 1 1 30 0 1 0 0 0 0 0
7  | HB  | Isaiya Katoa            | 32  | 80 7 28 7 4 0 0 0 1 35 0 1 0 0 2 0 0
8  | PR  | Addin Fonua-Blake       | 33  | 61 8 51 5 4 0 0 1 0 0 0 0 0 0 0 0 0
9  | HK  | Soni Luke               | 39  | 80 13 51 39 4 0 0 0 0 0 0 0 1 0 0 0 0
10 | L   | Jason Taumalolo         | 30  | 61 9 78 2 1 1 0 2 0 0 0 0 0 0 0 0 0
11 | SR  | Haumole Olakau'atu      | 31  | 80 10 58 8 7 1 0 1 0 0 1 1 0 0 0 0 0
12 | SR  | Eliesa Katoa            | 47  | 80 8 60 4 5 0 0 3 0 0 0 1 0 0 0 0 0
13 | PR  | Keaon Koloamatangi      | 24  | 66 8 23 8 2 0 0 0 0 0 0 0 0 0 0 0 0
14 | PR  | Stefano Utoikamanu      | 10  | 34 2 8 1 1 0 0 0 0 0 0 0 0 0 0 0 0
15 | SR  | Kulikefu Finefeuiaki    | 5   | 20 3 8 3 2 0 0 0 0 0 0 1 0 0 0 0 0
16 | C   | Paul Alamoti            | N/A | 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
17 | SR  | Leka Halasima           | N/A | 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
`

};
