/* =========================================================
   SEASON RESULTS
   Paste each season exactly as listed: a heading line ending in ":"
   ("Round 1:", "Q/E Finals:", "Semi Finals:", "Preliminary Finals:", "Grand Final:")
   then one game per line:  Home 24 - 18 Away   (optionally " - Stadium, City")
   Regular-season games with no stadium use the home team's ground,
   unless "venues" below says otherwise for that season.
   venues: { CODE: ["Ground A", "Ground B"] }  -> that team's home games
           rotate through the list in order (one ground = every home game).
   byePoints: 0               -> points for a bye that season (default 2)
   rounds: { "Round 10": { venue:"...", days:["Friday", ...] } }
                              -> one venue for every game that round, and/or
                                 the day of each game in listed order.
                                 notes: { 4: "Game 1000" } -> a tag on the 4th game.
   gameVenues: `Rd4 SYD V PAR - BB Print Stadium, Mackay`  (one per line)
                              -> stadium for a single game, by round + team codes.
   ========================================================= */
window.SEASON_DATA = {

1: {
  venues: {
    SYD: ["Sydney Cricket Ground, Sydney"],
    SOU: ["CommBank Stadium, Sydney", "Accor Stadium, Sydney"]
  },
  results: `
Round 1:
Broncos 25 - 12 Tigers
Raiders 24 - 40 Roosters
Bulldogs 30 - 38 Dragons
Sharks 10 - 42 Rabbitohs
Titans 8 - 66 Panthers
Sea Eagles 40 - 30 Eels
Storm 0 - 31 Cowboys
Warriors 6 - 56 Knights

Round 2:
Tigers 22 - 32 Raiders
Bulldogs 26 - 12 Broncos
Sharks 18 - 20 Roosters
Titans 18 - 24 Dragons
Sea Eagles 29 - 28 Rabbitohs
Storm 18 - 32 Panthers
Warriors 13 - 14 Eels
Knights 24 - 12 Cowboys

Round 3:
Bulldogs 6 - 16 Tigers
Sharks 24 - 16 Raiders
Titans 42 - 12 Broncos
Sea Eagles 18 - 22 Roosters
Storm 44 - 6 Dragons
Warriors 20 - 22 Rabbitohs
Knights 22 - 24 Panthers
Cowboys 36 - 38 Eels

Round 4:
Tigers 8 - 34 Sharks
Titans 40 - 36 Bulldogs
Sea Eagles 20 - 10 Raiders
Storm 54 - 0 Broncos
Warriors 10 - 26 Roosters
Knights 24 - 6 Dragons
Cowboys 16 - 38 Rabbitohs
Eels 28 - 26 Panthers

Round 5:
Titans 22 - 34 Tigers
Sea Eagles 6 - 36 Sharks
Storm 30 - 16 Bulldogs
Warriors 22 - 24 Raiders
Knights 28 - 10 Broncos
Cowboys 10 - 18 Roosters
Eels 18 - 16 Dragons
Panthers 22 - 32 Rabbitohs

Round 6:
Tigers 12 - 22 Sea Eagles
Storm 72 - 6 Titans
Warriors 8 - 9 Sharks
Knights 40 - 4 Bulldogs
Cowboys 6 - 52 Raiders
Eels 18 - 19 Broncos
Panthers 18 - 24 Roosters
Rabbitohs 68 - 6 Dragons

Round 7:
Storm 50 - 48 Tigers
Warriors 14 - 16 Sea Eagles
Knights 54 - 0 Titans
Cowboys 24 - 26 Sharks
Eels 20 - 34 Bulldogs
Panthers 44 - 16 Raiders
Rabbitohs 84 - 6 Broncos
Dragons 12 - 38 Roosters

Round 8:
Tigers 10 - 24 Warriors
Knights 28 - 24 Storm
Cowboys 24 - 46 Sea Eagles
Eels 46 - 0 Titans
Panthers 23 - 22 Sharks
Rabbitohs 40 - 28 Bulldogs
Dragons 20 - 78 Raiders
Roosters 14 - 15 Broncos

Round 9:
Knights 12 - 38 Tigers
Cowboys 30 - 34 Warriors
Eels 32 - 36 Storm
Panthers 28 - 16 Sea Eagles
Rabbitohs 38 - 6 Titans
Dragons 20 - 22 Sharks
Roosters 14 - 4 Bulldogs
Broncos 24 - 4 Raiders

Round 10:
Tigers 36 - 24 Cowboys
Eels 28 - 22 Knights
Panthers 46 - 24 Warriors
Rabbitohs 6 - 0 Storm
Dragons 28 - 34 Sea Eagles
Roosters 48 - 20 Titans
Broncos 12 - 28 Sharks
Raiders 30 - 16 Bulldogs

Round 11:
Eels 30 - 32 Tigers
Panthers 12 - 18 Cowboys
Rabbitohs 22 - 26 Knights
Dragons 19 - 18 Warriors
Roosters 28 - 29 Storm
Broncos 12 - 54 Sea Eagles
Raiders 80 - 10 Titans
Bulldogs 12 - 66 Sharks

Round 12:
Tigers 12 - 52 Panthers
Rabbitohs 24 - 22 Eels
Dragons 6 - 38 Cowboys
Roosters 34 - 20 Knights
Broncos 24 - 30 Warriors
Raiders 22 - 52 Storm
Bulldogs 24 - 30 Sea Eagles
Sharks 28 - 34 Titans

Round 13:
Rabbitohs 16 - 22 Tigers
Dragons 0 - 24 Panthers
Roosters 58 - 30 Eels
Broncos 24 - 25 Cowboys
Raiders 42 - 6 Knights
Bulldogs 12 - 30 Warriors
Sharks 20 - 32 Storm
Titans 12 - 66 Sea Eagles

Round 14:
Tigers 34 - 28 Dragons
Roosters 26 - 22 Rabbitohs
Broncos 26 - 34 Panthers
Raiders 16 - 18 Eels
Bulldogs 6 - 70 Cowboys
Sharks 19 - 18 Knights
Titans 12 - 13 Warriors
Sea Eagles 10 - 30 Storm

Round 15:
Roosters 38 - 22 Tigers
Broncos 34 - 28 Dragons
Raiders 0 - 104 Rabbitohs
Bulldogs 26 - 22 Panthers
Sharks 6 - 20 Eels
Titans 18 - 30 Cowboys
Sea Eagles 22 - 24 Knights
Storm 90 - 2 Warriors

Q/E Finals:
Roosters 20 - 30 Panthers - Sydney Cricket Ground, Sydney
Sea Eagles 36 - 26 Eels - 4 Pines Park, Sydney
Knights 8 - 18 Sharks - McDonald Jones Stadium, Newcastle
Rabbitohs 12 - 34 Storm - CommBank Stadium, Sydney

Semi Finals:
Roosters 40 - 28 Sea Eagles - Sydney Cricket Ground, Sydney
Rabbitohs 16 - 12 Sharks - Accor Stadium, Sydney

Preliminary Finals:
Panthers 14 - 22 Rabbitohs - Helloworld Stadium, Penrith
Roosters 16 - 30 Storm - Sydney Cricket Ground, Sydney

Grand Final:
Rabbitohs 12 - 22 Storm - Accor Stadium, Sydney
`
},

2: {
  venues: {
    NQL: ["Accor Stadium, Sydney"],
    SYD: ["Sydney Cricket Ground, Sydney"],
    SOU: ["Accor Stadium, Sydney"]
  },
  results: `
Round 1:
Rabbitohs 16 - 28 Storm
Cowboys 32 - 22 Sea Eagles
Panthers 16 - 12 Eels
Knights 16 - 10 Warriors
Raiders 19 - 6 Dragons
Roosters 10 - 16 Sharks
Bulldogs 32 - 12 Tigers
Titans 12 - 48 Broncos

Round 2:
Raiders 16 - 35 Eels
Roosters 44 - 16 Warriors
Panthers 34 - 35 Rabbitohs
Knights 0 - 12 Sea Eagles
Broncos 24 - 10 Tigers
Storm 40 - 30 Cowboys
Titans 6 - 45 Sharks
Bulldogs 26 - 22 Dragons

Round 3:
Raiders 22 - 40 Rabbitohs
Titans 6 - 34 Warriors
Panthers 18 - 32 Storm
Tigers 24 - 36 Sharks
Roosters 30 - 23 Sea Eagles
Knights 28 - 30 Cowboys
Bulldogs 10 - 54 Eels
Broncos 24 - 28 Dragons

Round 4:
Raiders 12 - 50 Panthers
Tigers 27 - 26 Warriors
Broncos 30 - 28 Eels
Bulldogs 22 - 12 Rabbitohs
Roosters 32 - 24 Cowboys
Storm 28 - 24 Knights
Sharks 12 - 10 Dragons
Titans 0 - 84 Sea Eagles

Round 5:
Raiders 12 - 44 Storm
Roosters 43 - 6 Knights
Broncos 30 - 34 Rabbitohs
Bulldogs 28 - 36 Panthers
Tigers 4 - 32 Sea Eagles
Sharks 22 - 34 Eels
Dragons 12 - 18 Warriors
Titans 30 - 41 Cowboys

Round 6:
Broncos 24 - 52 Panthers
Dragons 0 - 58 Sea Eagles
Storm 30 - 20 Roosters
Bulldogs 12 - 27 Raiders
Tigers 6 - 46 Cowboys
Sharks 10 - 36 Rabbitohs
Titans 6 - 66 Knights
Warriors 4 - 66 Eels

Round 7:
Sharks 29 - 24 Panthers
Bulldogs 6 - 28 Storm
Eels 12 - 16 Sea Eagles
Dragons 16 - 48 Cowboys
Tigers 22 - 4 Knights
Broncos 20 - 36 Raiders
Warriors 36 - 22 Rabbitohs
Titans 29 - 28 Roosters

Round 8:
Eels 32 - 6 Cowboys
Warriors 16 - 28 Panthers
Sea Eagles 28 - 30 Rabbitohs
Sharks 24 - 25 Raiders
Broncos 13 - 12 Bulldogs
Storm 18 - 14 Titans
Dragons 2 - 18 Knights
Tigers 22 - 28 Roosters

Round 9:
Broncos 14 - 24 Storm
Tigers 28 - 24 Titans
Sea Eagles 16 - 14 Panthers
Warriors 30 - 26 Raiders
Sharks 26 - 12 Bulldogs
Rabbitohs 31 - 30 Cowboys
Dragons 12 - 20 Roosters
Eels 10 - 12 Knights

Round 10:
Sea Eagles 50 - 14 Raiders
Cowboys 31 - 30 Panthers
Eels 18 - 46 Roosters
Dragons 4 - 0 Titans
Rabbitohs 36 - 18 Knights
Storm 28 - 16 Tigers
Warriors 18 - 8 Bulldogs
Sharks 6 - 34 Broncos

Round 11:
Panthers 40 - 12 Knights
Eels 54 - 6 Titans
Rabbitohs 26 - 20 Roosters
Dragons 6 - 8 Tigers
Cowboys 48 - 34 Raiders
Sharks 16 - 44 Storm
Sea Eagles 54 - 24 Bulldogs
Warriors 28 - 6 Broncos

Round 12:
Panthers 20 - 21 Roosters
Rabbitohs 86 - 6 Titans
Sea Eagles 34 - 28 Broncos
Knights 16 - 30 Raiders
Cowboys 30 - 31 Bulldogs
Storm 30 - 8 Dragons
Warriors 22 - 23 Sharks
Eels 42 - 18 Tigers

Round 13:
Raiders 31 - 24 Roosters
Knights 18 - 6 Bulldogs
Cowboys 18 - 16 Broncos
Warriors 18 - 22 Storm
Eels 30 - 26 Dragons
Sea Eagles 34 - 6 Sharks
Panthers 36 - 18 Titans
Rabbitohs 24 - 18 Tigers

Round 14:
Storm 36 - 28 Eels
Sea Eagles 18 - 0 Warriors
Panthers 46 - 6 Tigers
Knights 16 - 18 Broncos
Cowboys 22 - 26 Sharks
Rabbitohs 48 - 12 Dragons
Raiders 34 - 12 Titans
Roosters 18 - 17 Bulldogs

Round 15:
Rabbitohs 36 - 12 Eels
Panthers 44 - 18 Dragons
Sea Eagles 23 - 16 Storm
Bulldogs 16 - 0 Titans
Cowboys 24 - 18 Warriors
Roosters 18 - 28 Broncos
Raiders 42 - 12 Tigers
Knights 32 - 36 Sharks

Q/E Finals:
Sea Eagles 26 - 20 Rabbitohs - 4 Pines Park, Sydney
Roosters 36 - 6 Eels - Sydney Cricket Ground, Sydney
Storm 26 - 24 Panthers - AAMI Park, Melbourne
Cowboys 19 - 18 Sharks - Accor Stadium, Sydney

Semi Finals:
Panthers 26 - 24 Roosters - Helloworld Stadium, Penrith
Rabbitohs 30 - 8 Cowboys - Accor Stadium, Sydney

Preliminary Finals:
Storm 24 - 42 Rabbitohs - AAMI Park, Melbourne
Panthers 48 - 30 Sea Eagles - Helloworld Stadium, Penrith

Grand Final:
Rabbitohs 19 - 18 Panthers - Accor Stadium, Sydney
`
},

3: {
  venues: {
    SYD: ["Allianz Stadium, Sydney"]
  },
  results: `
Round 1:
Rabbitohs 22 - 24 Panthers
Dragons 4 - 20 Sea Eagles
Eels 34 - 31 Broncos
Sharks 18 - 22 Warriors
Storm 18 - 37 Bulldogs
Roosters 12 - 14 Knights
Raiders 18 - 16 Tigers
Titans 10 - 48 Cowboys

Round 2:
Storm 34 - 6 Broncos
Cowboys 32 - 6 Tigers
Eels 12 - 26 Rabbitohs
Roosters 22 - 6 Warriors
Raiders 19 - 18 Bulldogs
Panthers 44 - 12 Dragons
Titans 30 - 18 Knights
Sharks 6 - 40 Sea Eagles

Round 3:
Storm 16 - 24 Rabbitohs
Tigers 0 - 44 Knights
Eels 12 - 24 Panthers
Cowboys 24 - 10 Bulldogs
Roosters 16 - 40 Sea Eagles
Raiders 13 - 12 Broncos
Titans 18 - 48 Warriors
Sharks 20 - 16 Dragons

Round 4:
Raiders 12 - 38 Rabbitohs
Panthers 18 - 26 Sharks
Storm 42 - 32 Eels
Roosters 26 - 20 Dragons
Titans 20 - 22 Sea Eagles
Cowboys 24 - 25 Broncos
Tigers 8 - 32 Warriors
Knights 22 - 24 Bulldogs

Round 5 (Indigenous Round):
Raiders 30 - 22 Eels
Titans 20 - 14 Dragons
Storm 18 - 20 Panthers
Knights 32 - 12 Broncos
Tigers 18 - 40 Sea Eagles
Roosters 14 - 24 Sharks
Bulldogs 28 - 12 Warriors
Cowboys 10 - 42 Rabbitohs

Round 6:
Raiders 0 - 22 Storm
Tigers 24 - 16 Dragons
Panthers 22 - 35 Roosters
Bulldogs 16 - 30 Sea Eagles
Knights 36 - 10 Rabbitohs
Cowboys 6 - 18 Eels
Titans 40 - 18 Sharks
Warriors 50 - 12 Broncos

Round 7:
Cowboys 6 - 36 Storm
Tigers 22 - 18 Sharks
Broncos 0 - 46 Sea Eagles
Warriors 18 - 16 Rabbitohs
Titans 26 - 24 Roosters
Raiders 16 - 32 Panthers
Bulldogs 34 - 18 Dragons
Knights 24 - 54 Eels

Round 8:
Knights 0 - 68 Storm
Panthers 6 - 28 Titans
Sea Eagles 16 - 18 Rabbitohs
Broncos 6 - 14 Dragons
Tigers 38 - 30 Roosters
Cowboys 12 - 34 Raiders
Warriors 6 - 56 Eels
Bulldogs 32 - 12 Sharks

Round 9:
Sea Eagles 36 - 18 Eels
Tigers 6 - 14 Titans
Broncos 19 - 25 Sharks
Knights 44 - 4 Raiders
Bulldogs 22 - 30 Roosters
Rabbitohs 46 - 12 Dragons
Warriors 30 - 40 Storm
Cowboys 18 - 19 Panthers

Round 10:
Sea Eagles 10 - 30 Storm
Dragons 16 - 42 Eels
Broncos 12 - 22 Roosters
Bulldogs 28 - 30 Titans
Knights 22 - 16 Cowboys
Rabbitohs 28 - 10 Sharks
Warriors 18 - 19 Raiders
Panthers 36 - 12 Tigers

Round 11:
Broncos 40 - 16 Titans
Sea Eagles 40 - 4 Raiders
Rabbitohs 10 - 17 Roosters
Warriors 18 - 25 Cowboys
Dragons 6 - 40 Storm
Eels 24 - 25 Sharks
Bulldogs 12 - 18 Tigers
Knights 28 - 32 Panthers

Round 12:
Sea Eagles 46 - 6 Cowboys
Warriors 30 - 6 Knights
Eels 12 - 26 Roosters
Panthers 12 - 24 Bulldogs
Rabbitohs 56 - 18 Titans
Sharks 0 - 32 Storm
Dragons 30 - 31 Raiders
Broncos 28 - 26 Tigers

Round 13:
Rabbitohs 32 - 10 Tigers
Eels 10 - 6 Titans
Storm 25 - 16 Roosters
Broncos 6 - 42 Bulldogs
Dragons 18 - 46 Cowboys
Sharks 12 - 25 Raiders
Sea Eagles 28 - 18 Knights
Warriors 12 - 22 Panthers

Round 14:
Roosters 16 - 8 Raiders
Rabbitohs 18 - 12 Bulldogs
Panthers 18 - 16 Broncos
Dragons 4 - 18 Knights
Sharks 18 - 0 Cowboys
Storm 18 - 0 Titans
Sea Eagles 18 - 14 Warriors
Eels 20 - 0 Tigers

Round 15:
Rabbitohs 13 - 12 Broncos
Dragons 8 - 30 Warriors
Roosters 16 - 18 Cowboys
Raiders 24 - 32 Titans
Storm 24 - 19 Tigers
Sea Eagles 14 - 20 Panthers
Eels 22 - 16 Bulldogs
Sharks 24 - 8 Knights

Q/E Finals:
Storm 14 - 24 Panthers - AAMI Park, Melbourne
Eels 16 - 19 Raiders - CommBank Stadium, Sydney
Roosters 40 - 18 Titans - Allianz Stadium, Sydney
Sea Eagles 30 - 28 Rabbitohs - 4 Pines Park, Sydney

Semi Finals:
Roosters 24 - 26 Rabbitohs - Allianz Stadium, Sydney
Storm 22 - 12 Raiders - AAMI Park, Melbourne

Preliminary Finals:
Storm 18 - 26 Sea Eagles - AAMI Park, Melbourne
Panthers 18 - 10 Rabbitohs - Helloworld Stadium, Penrith

Grand Final:
Sea Eagles 22 - 18 Panthers - Accor Stadium, Sydney
`
},

4: {
  results: `
Round 1:
Roosters 10 - 12 Panthers
Raiders 22 - 24 Cowboys
Sea Eagles 16 - 12 Eels
Broncos 26 - 25 Warriors
Storm 24 - 25 Knights
Titans 6 - 30 Sharks
Rabbitohs 36 - 42 Bulldogs
Dragons 26 - 22 Tigers

Round 2 (Indigenous Round):
Storm 20 - 16 Eels
Titans 31 - 18 Warriors
Sea Eagles 10 - 34 Roosters
Tigers 30 - 0 Bulldogs
Rabbitohs 6 - 24 Knights
Panthers 32 - 30 Raiders
Broncos 18 - 43 Cowboys
Dragons 24 - 12 Sharks

Round 3:
Storm 30 - 10 Roosters
Tigers 70 - 16 Knights
Sea Eagles 18 - 6 Panthers
Dragons 16 - 28 Warriors
Broncos 18 - 20 Raiders
Rabbitohs 6 - 8 Eels
Titans 10 - 60 Cowboys
Bulldogs 14 - 12 Sharks

Round 4:
Storm 24 - 26 Sea Eagles
Dragons 10 - 30 Cowboys
Rabbitohs 24 - 25 Roosters
Bulldogs 20 - 36 Warriors
Sharks 28 - 10 Knights
Panthers 12 - 13 Broncos
Tigers 36 - 34 Eels
Titans 12 - 21 Raiders

Round 5:
Rabbitohs 6 - 30 Sea Eagles
Bulldogs 10 - 28 Cowboys
Storm 19 - 18 Panthers
Knights 20 - 12 Warriors
Dragons 36 - 10 Raiders
Sharks 23 - 22 Eels
Tigers 6 - 50 Roosters
Titans 18 - 19 Broncos

Round 6:
Sharks 24 - 22 Roosters
Panthers 66 - 4 Titans
Rabbitohs 4 - 20 Storm
Tigers 12 - 16 Sea Eagles
Dragons 9 - 11 Broncos
Knights 20 - 12 Cowboys
Bulldogs 12 - 31 Raiders
Warriors 22 - 16 Eels

Round 7:
Sharks 12 - 10 Sea Eagles
Dragons 36 - 0 Titans
Rabbitohs 20 - 58 Panthers
Knights 20 - 16 Raiders
Tigers 25 - 24 Storm
Eels 4 - 34 Cowboys
Warriors 24 - 16 Roosters
Bulldogs 6 - 18 Broncos

Round 8:
Knights 16 - 24 Broncos
Panthers 36 - 37 Dragons
Sharks 6 - 30 Storm
Warriors 32 - 6 Sea Eagles
Cowboys 31 - 12 Roosters
Eels 6 - 14 Raiders
Bulldogs 42 - 0 Titans
Tigers 24 - 28 Rabbitohs

Round 9 (Anzac Round):
Cowboys 54 - 6 Sea Eagles
Eels 12 - 18 Broncos
Sharks 24 - 25 Rabbitohs
Roosters 12 - 28 Raiders
Knights 30 - 0 Titans
Tigers 24 - 28 Panthers
Bulldogs 34 - 18 Dragons
Warriors 6 - 42 Storm

Round 10:
Eels 54 - 0 Titans
Sharks 24 - 10 Tigers
Roosters 0 - 0 Broncos
Raiders 24 - 12 Sea Eagles
Panthers 19 - 24 Bulldogs
Cowboys 7 - 6 Storm
Warriors 12 - 24 Rabbitohs
Knights 26 - 24 Dragons

Round 11:
Roosters 44 - 32 Titans
Knights 30 - 24 Bulldogs
Sea Eagles 24 - 18 Broncos
Raiders 12 - 13 Storm
Eels 42 - 24 Dragons
Cowboys 18 - 30 Rabbitohs
Warriors 8 - 36 Tigers
Sharks 28 - 24 Panthers

Round 12:
Panthers 26 - 28 Knights
Warriors 6 - 35 Sharks
Broncos 18 - 46 Storm
Cowboys 22 - 18 Tigers
Sea Eagles 18 - 22 Titans
Raiders 10 - 24 Rabbitohs
Eels 18 - 12 Bulldogs
Roosters 22 - 18 Dragons

Round 13:
Storm 52 - 16 Titans
Warriors 34 - 35 Panthers
Broncos 18 - 22 Rabbitohs
Sea Eagles 38 - 6 Dragons
Roosters 6 - 10 Bulldogs
Cowboys 18 - 24 Sharks
Raiders 24 - 16 Tigers
Eels 14 - 12 Knights

Round 14:
Roosters 18 - 6 Knights
Cowboys 24 - 28 Warriors
Panthers 6 - 52 Eels
Broncos 26 - 22 Tigers
Sea Eagles 32 - 4 Bulldogs
Titans 6 - 54 Rabbitohs
Storm 90 - 0 Dragons
Raiders 10 - 16 Sharks

Round 15:
Roosters 12 - 18 Eels
Sea Eagles 44 - 6 Knights
Broncos 16 - 12 Sharks
Raiders 22 - 26 Warriors
Rabbitohs 30 - 20 Dragons
Cowboys 46 - 36 Panthers
Titans 6 - 30 Tigers
Storm 60 - 12 Bulldogs

Q/E Finals:
Storm 18 - 25 Broncos
Sea Eagles 20 - 26 Eels
Knights 4 - 42 Rabbitohs
Cowboys 28 - 12 Sharks

Semi Finals:
Storm 19 - 12 Eels
Rabbitohs 12 - 32 Sharks

Preliminary Finals:
Broncos 24 - 0 Sharks
Storm 30 - 31 Cowboys

Grand Final:
Cowboys 30 - 6 Broncos
`
},

5: {
  byePoints: 0,
  gameVenues: `
Rd1 CBY V NEW - CommBank Stadium, Sydney
Rd2 DOL V SGI - Sunshine Coast Stadium, Sunshine Coast
Rd3 CBY V WST - CommBank Stadium, Sydney
Rd4 SYD V PAR - BB Print Stadium, Mackay
Rd4 WAR V GLD - Industree Group Stadium, Gosford
Rd5 WST V PEN - CommBank Stadium, Sydney
Rd5 SOU V NEW - Allianz Stadium, Sydney
Rd6 CAN V NEW - McDonalds Park, Wagga Wagga
Rd7 SGI V PAR - St George Venues Jubilee Stadium, Kogarah
Rd8 WAR V NEW - Forsyth Barr Stadium, Dunedin
Rd8 GLD V MAN - MKM Stadium, Hull
Rd8 DOL V PAR - Kayo Stadium, Redcliffe
Rd9 WST V SYD - Campbelltown Sports Stadium, Sydney
Rd11 CRO V NQL - Adelaide Oval, Adelaide
Rd11 WST V BRI - CommBank Stadium, Sydney
Rd11 SOU V WAR - C.ex Coffs International Stadium, Coffs Harbour
Rd12 PEN V DOL - Carrington Park, Bathurst
Rd13 NQL V NEW - 1300SMILES Stadium, Townsville
Rd13 DOL V WST - Sunshine Coast Stadium, Sunshine Coast
Rd13 CBY V MEL - Belmore Sports Ground, Sydney
Rd14 PAR V CRO - TIO Stadium, Darwin
Rd15 SOU V MAN - Industree Group Stadium, Gosford
Rd15 WST V NQL - Campbelltown Sports Stadium, Sydney
Rd15 SYD V SGI - Industree Group Stadium, Gosford
Rd16 SYD V DOL - Sydney Cricket Ground, Sydney
Rd16 CBY V CRO - CommBank Stadium, Sydney
Rd16 MAN V CAN - Glen Willow Oval, Mudgee
Rd17 DOL V WAR - Kayo Stadium, Redcliffe
`,
  rounds: {
    "Round 10": { venue: "Suncorp Stadium, Brisbane",
                  days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] }
  },
  results: `
Round 1:
Dolphins 18 - 30 Broncos
Sea Eagles 18 - 30 Warriors
Cowboys 30 - 31 Roosters
Storm 6 - 32 Raiders
Titans 16 - 28 Rabbitohs
Eels 34 - 30 Tigers
Sharks 18 - 12 Panthers
Bulldogs 12 - 24 Knights
Bye: Dragons

Round 2:
Eels 19 - 0 Rabbitohs
Dolphins 12 - 30 Dragons
Broncos 30 - 20 Sea Eagles
Warriors 12 - 23 Cowboys
Roosters 10 - 46 Storm
Raiders 24 - 16 Titans
Panthers 14 - 18 Bulldogs
Tigers 22 - 18 Sharks
Bye: Knights

Round 3 (Anzac Round):
Dragons 10 - 24 Sea Eagles
Knights 30 - 28 Panthers
Cowboys 12 - 13 Broncos
Titans 14 - 30 Roosters
Rabbitohs 24 - 25 Sharks
Raiders 6 - 10 Eels
Bulldogs 18 - 4 Tigers
Warriors 6 - 54 Storm
Bye: Dolphins

Round 4:
Roosters 26 - 22 Eels
Warriors 0 - 44 Titans
Storm 34 - 14 Broncos
Sea Eagles 18 - 26 Dolphins
Bulldogs 24 - 14 Rabbitohs
Sharks 58 - 0 Raiders
Knights 30 - 20 Tigers
Cowboys 25 - 12 Dragons
Bye: Panthers

Round 5:
Roosters 12 - 10 Sharks
Raiders 18 - 46 Bulldogs
Eels 19 - 18 Warriors
Dragons 16 - 32 Storm
Dolphins 24 - 6 Cowboys
Broncos 26 - 0 Titans
Tigers 24 - 26 Panthers
Rabbitohs 20 - 14 Knights
Bye: Sea Eagles

Round 6:
Broncos 22 - 16 Eels
Sea Eagles 22 - 18 Cowboys
Panthers 34 - 18 Rabbitohs
Sharks 12 - 30 Warriors
Bulldogs 22 - 18 Roosters
Storm 30 - 32 Dolphins
Titans 38 - 36 Dragons
Raiders 22 - 31 Knights
Bye: Tigers

Round 7:
Sea Eagles 6 - 27 Storm
Knights 6 - 19 Roosters
Sharks 0 - 20 Broncos
Warriors 6 - 46 Bulldogs
Dragons 12 - 42 Eels
Dolphins 22 - 28 Titans
Rabbitohs 22 - 16 Tigers
Panthers 19 - 18 Raiders
Bye: Cowboys

Round 8:
Roosters 52 - 0 Panthers
Warriors 12 - 44 Knights
Cowboys 6 - 30 Storm
Tigers 2 - 14 Raiders
Titans 50 - 6 Sea Eagles
Dragons 0 - 30 Sharks
Dolphins 8 - 12 Eels
Broncos 22 - 24 Bulldogs
Bye: Rabbitohs

Round 9:
Rabbitohs 26 - 14 Raiders
Panthers 58 - 0 Warriors
Eels 0 - 16 Sea Eagles
Dragons 10 - 26 Bulldogs
Cowboys 18 - 14 Titans
Broncos 36 - 12 Knights
Tigers 20 - 26 Roosters
Sharks 27 - 20 Dolphins
Bye: Storm

Round 10 (Magic Round):
Knights 16 - 18 Dragons
Panthers 2 - 24 Broncos
Storm 25 - 24 Titans
Sea Eagles 42 - 12 Sharks
Roosters 10 - 24 Rabbitohs
Dolphins 24 - 18 Bulldogs
Eels 12 - 30 Cowboys
Warriors 22 - 4 Tigers
Bye: Raiders

Round 11:
Storm 12 - 14 Eels
Bulldogs 36 - 12 Sea Eagles
Sharks 34 - 12 Cowboys
Knights 10 - 6 Dolphins
Raiders 12 - 42 Roosters
Tigers 6 - 64 Broncos
Rabbitohs 34 - 30 Warriors
Panthers 20 - 18 Dragons
Bye: Titans

Round 12 (Indigenous Round):
Knights 36 - 12 Sea Eagles
Storm 54 - 18 Sharks
Rabbitohs 12 - 44 Broncos
Panthers 26 - 22 Dolphins
Raiders 66 - 0 Warriors
Titans 20 - 48 Eels
Tigers 14 - 18 Dragons
Cowboys 6 - 12 Bulldogs
Bye: Roosters

Round 13:
Panthers 16 - 10 Sea Eagles
Sharks 20 - 16 Titans
Cowboys 24 - 20 Knights
Warriors 18 - 54 Roosters
Dolphins 40 - 8 Tigers
Broncos 54 - 22 Raiders
Dragons 12 - 24 Rabbitohs
Bulldogs 16 - 18 Storm
Bye: Eels

Round 14:
Panthers 8 - 6 Cowboys
Raiders 18 - 20 Dragons
Roosters 16 - 20 Broncos
Titans 14 - 18 Bulldogs
Eels 24 - 12 Sharks
Dolphins 44 - 30 Rabbitohs
Sea Eagles 16 - 14 Tigers
Storm 42 - 6 Knights
Bye: Warriors

Round 15:
Storm 74 - 0 Panthers
Raiders 10 - 24 Dolphins
Rabbitohs 24 - 25 Sea Eagles
Tigers 22 - 36 Cowboys
Bulldogs 30 - 31 Eels
Knights 30 - 24 Titans
Roosters 4 - 34 Dragons
Broncos 72 - 6 Warriors
Bye: Sharks

Round 16:
Cowboys 6 - 18 Rabbitohs
Titans 36 - 30 Panthers
Roosters 22 - 28 Dolphins
Bulldogs 18 - 4 Sharks
Sea Eagles 28 - 12 Raiders
Tigers 10 - 54 Storm
Warriors 25 - 24 Dragons
Eels 10 - 24 Knights
Bye: Broncos

Round 17:
Sea Eagles 31 - 24 Roosters
Titans 14 - 6 Tigers
Rabbitohs 0 - 30 Storm
Dolphins 10 - 24 Warriors
Raiders 14 - 28 Cowboys
Eels 6 - 24 Panthers
Sharks 36 - 24 Knights
Broncos 32 - 12 Dragons
Bye: Bulldogs

Q/E Finals:
Broncos 14 - 32 Eels
Roosters 14 - 16 Dolphins
Storm 22 - 16 Bulldogs
Knights 6 - 58 Panthers

Semi Finals:
Broncos 17 - 24 Dolphins
Bulldogs 28 - 12 Panthers

Preliminary Finals:
Storm 40 - 12 Dolphins
Eels 22 - 18 Bulldogs

Grand Final:
Storm 30 - 24 Eels
`
},

6: {
  byePoints: 0,
  rounds: {
    "Round 9": { venue: "Suncorp Stadium, Brisbane",
                 days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] }
  },
  gameVenues: `
Rd1 CBY V CRO - Belmore Sports Ground, Sydney
Rd3 SYD V PEN - Sydney Cricket Ground, Sydney
Rd4 WST V PAR - Industree Group Stadium, Gosford
Rd4 CRO V PEN - C.ex Coffs International Stadium, Coffs Harbour
Rd6 CBY V BRI - Belmore Sports Ground, Sydney
Rd6 MEL V WST - Melbourne Cricket Ground, Melbourne
Rd7 SOU V SYD - Allianz Stadium, Sydney
Rd7 WST V CBY - CommBank Stadium, Sydney
Rd8 SGI V PAR - McDonalds Park, Wagga Wagga
Rd8 BRI V WST - The Gabba, Brisbane
Rd10 WAR V SOU - Hnry Stadium, Wellington
Rd10 PEN V WST - Carrington Park, Bathurst
Rd11 SOU V MEL - Industree Group Stadium, Gosford
Rd11 DOL V WAR - Kayo Stadium, Redcliffe
Rd11 CBY V SGI - CommBank Stadium, Sydney
Rd12 DOL V MEL - Sunshine Coast Stadium, Sunshine Coast
Rd13 BRI V SOU - The Gabba, Brisbane
Rd13 WST V SGI - Campbelltown Sports Stadium, Sydney
Rd13 PAR V NEW - TIO Stadium, Darwin
Rd13 CBY V DOL - Belmore Sports Ground, Sydney
Rd13 CRO V SYD - Optus Stadium, Perth
Rd14 CAN V CBY - Glen Willow Oval, Mudgee
Rd14 NQL V GLD - Suncorp Stadium, Brisbane
Rd14 SGI V PEN - St George Venues Jubilee Stadium, Kogarah
Rd15 DOL V WST - Kayo Stadium, Redcliffe
Rd15 SGI V GLD - St George Venues Jubilee Stadium, Kogarah
Rd15 MEL V NEW - Melbourne Cricket Ground, Melbourne
Rd16 WST V CAN - BB Print Stadium, Mackay
Rd17 CBY V SYD - Belmore Sports Ground, Sydney
`,
  results: `
Round 1:
Storm 30 - 28 Eels
Tigers 20 - 6 Knights
Broncos 16 - 24 Roosters
Bulldogs 6 - 38 Sharks
Panthers 32 - 38 Sea Eagles
Titans 18 - 26 Raiders
Cowboys 10 - 46 Dolphins
Dragons 18 - 30 Rabbitohs
Bye: Warriors

Round 2 (Anzac Round):
Storm 28 - 26 Warriors
Roosters 18 - 22 Tigers
Eels 18 - 12 Bulldogs
Dragons 48 - 10 Dolphins
Panthers 24 - 16 Knights
Broncos 12 - 66 Sharks
Raiders 28 - 36 Cowboys
Titans 24 - 18 Sea Eagles
Bye: Rabbitohs

Round 3:
Dolphins 20 - 30 Rabbitohs
Sharks 12 - 34 Tigers
Eels 18 - 38 Broncos
Warriors 12 - 13 Bulldogs
Raiders 12 - 46 Dragons
Roosters 36 - 6 Panthers
Sea Eagles 16 - 10 Cowboys
Knights 18 - 16 Titans
Bye: Storm

Round 4:
Bulldogs 0 - 28 Storm
Titans 6 - 48 Roosters
Tigers 24 - 60 Eels
Broncos 34 - 36 Warriors
Cowboys 18 - 12 Knights
Sea Eagles 34 - 24 Dragons
Rabbitohs 12 - 28 Raiders
Sharks 36 - 10 Panthers
Bye: Dolphins

Round 5 (Heroes in League Round):
Broncos 18 - 19 Storm
Titans 28 - 18 Sharks
Panthers 26 - 16 Eels
Roosters 16 - 6 Cowboys
Dolphins 24 - 40 Raiders
Rabbitohs 20 - 14 Sea Eagles
Warriors 12 - 22 Tigers
Dragons 66 - 24 Knights
Bye: Bulldogs

Round 6:
Bulldogs 40 - 12 Broncos
Cowboys 16 - 30 Sharks
Sea Eagles 25 - 24 Dolphins
Storm 20 - 16 Tigers
Eels 6 - 32 Titans
Knights 24 - 22 Rabbitohs
Warriors 20 - 18 Panthers
Roosters 12 - 13 Dragons
Bye: Raiders

Round 7:
Panthers 12 - 18 Storm
Sharks 48 - 46 Dragons
Rabbitohs 8 - 24 Roosters
Sea Eagles 38 - 12 Raiders
Tigers 46 - 24 Bulldogs
Eels 22 - 42 Cowboys
Warriors 11 - 10 Titans
Knights 22 - 0 Dolphins
Bye: Broncos

Round 8:
Sharks 24 - 20 Rabbitohs
Cowboys 36 - 44 Warriors
Bulldogs 18 - 31 Panthers
Dragons 23 - 22 Eels
Titans 6 - 34 Storm
Broncos 28 - 6 Tigers
Raiders 70 - 6 Knights
Dolphins 12 - 37 Roosters
Bye: Sea Eagles

Round 9 (Magic Round):
Roosters 24 - 22 Raiders
Panthers 18 - 28 Broncos
Knights 0 - 39 Sea Eagles
Rabbitohs 40 - 10 Eels
Storm 54 - 24 Cowboys
Bulldogs 28 - 16 Titans
Dolphins 6 - 46 Sharks
Warriors 14 - 32 Dragons
Bye: Tigers

Round 10:
Eels 30 - 24 Dolphins
Storm 68 - 6 Dragons
Titans 32 - 34 Broncos
Warriors 30 - 22 Rabbitohs
Raiders 25 - 6 Sharks
Cowboys 12 - 6 Bulldogs
Panthers 30 - 24 Tigers
Roosters 14 - 12 Sea Eagles
Bye: Knights

Round 11:
Rabbitohs 6 - 62 Storm
Tigers 0 - 33 Titans
Broncos 36 - 12 Cowboys
Dolphins 40 - 30 Warriors
Raiders 12 - 13 Eels
Knights 12 - 32 Roosters
Bulldogs 22 - 28 Dragons
Sea Eagles 22 - 18 Sharks
Bye: Panthers

Round 12:
Dolphins 12 - 58 Storm
Titans 23 - 12 Panthers
Sea Eagles 22 - 4 Eels
Dragons 37 - 12 Broncos
Cowboys 16 - 20 Tigers
Rabbitohs 10 - 12 Bulldogs
Warriors 18 - 49 Raiders
Sharks 48 - 6 Knights
Bye: Roosters

Round 13 (Indigenous Round):
Broncos 25 - 24 Rabbitohs
Tigers 16 - 24 Dragons
Eels 34 - 20 Knights
Bulldogs 26 - 30 Dolphins
Panthers 28 - 12 Cowboys
Sharks 19 - 18 Roosters
Warriors 6 - 46 Sea Eagles
Storm 66 - 0 Raiders
Bye: Titans

Round 14:
Roosters 20 - 20 Eels
Tigers 8 - 40 Rabbitohs
Sea Eagles 10 - 22 Storm
Raiders 18 - 19 Bulldogs
Cowboys 28 - 38 Titans
Dolphins 26 - 34 Broncos
Dragons 18 - 22 Panthers
Knights 46 - 42 Warriors
Bye: Sharks

Round 15:
Rabbitohs 42 - 16 Panthers
Dolphins 22 - 18 Tigers
Raiders 23 - 22 Broncos
Sea Eagles 20 - 24 Bulldogs
Roosters 34 - 24 Warriors
Eels 23 - 16 Sharks
Dragons 54 - 0 Titans
Storm 30 - 16 Knights
Bye: Cowboys

Round 16:
Storm 40 - 12 Roosters
Tigers 6 - 44 Raiders
Broncos 28 - 29 Sea Eagles
Panthers 12 - 54 Dolphins
Dragons 70 - 12 Cowboys
Rabbitohs 22 - 23 Titans
Sharks 30 - 35 Warriors
Knights 34 - 28 Bulldogs
Bye: Eels

Round 17:
Sharks 12 - 76 Storm
Tigers 26 - 18 Sea Eagles
Bulldogs 30 - 16 Roosters
Knights 30 - 42 Broncos
Raiders 36 - 18 Panthers
Titans 14 - 12 Dolphins
Eels 46 - 18 Warriors
Cowboys 16 - 17 Rabbitohs
Bye: Dragons

Q/E Finals:
Storm 22 - 10 Sea Eagles
Sharks 12 - 10 Titans
Dragons 12 - 26 Roosters
Raiders 16 - 20 Broncos

Semi Finals:
Sea Eagles 24 - 16 Sharks - Allianz Stadium, Sydney
Dragons 39 - 45 Broncos - Accor Stadium, Sydney

Preliminary Finals:
Roosters 16 - 17 Sea Eagles
Storm 12 - 16 Broncos

Grand Final:
Sea Eagles 29 - 12 Broncos
`
},

7: {
  byePoints: 0,
  venues: {
    NQL: ["1300SMILES Stadium, Townsville"]
  },
  rounds: {
    "Round 9":  { venue: "Suncorp Stadium, Brisbane",
                  days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] },
    "Round 10": { days: ["Thursday","Friday","Friday","Saturday","Sunday","Sunday","Monday","Monday"],
                  notes: { 4: "Game 1000" } }
  },
  gameVenues: `
Rd2 WST V PAR - Accor Stadium, Sydney
Rd2 CAN V DOL - Glen Willow Oval, Mudgee
Rd4 PEN V NQL - Carrington Park, Bathurst
Rd5 SYD V BRI - Sydney Cricket Ground, Sydney
Rd6 SGI V MAN - McDonalds Park, Wagga Wagga
Rd6 SYD V CBY - Sydney Cricket Ground, Sydney
Rd7 MEL V MAN - Suncorp Stadium, Brisbane
Rd7 CBY V PAR - Belmore Sports Ground, Sydney
Rd7 DOL V SYD - Kayo Stadium, Redcliffe
Rd7 CRO V NEW - C.ex Coffs International Stadium, Coffs Harbour
Rd7 SOU V CAN - Apex Oval, Dubbo
Rd8 WAR V NEW - Forsyth Barr Stadium, Dunedin
Rd11 BRI V SOU - Barlow Park, Cairns
Rd11 MEL V SYD - Adelaide Oval, Adelaide
Rd11 WST V WAR - Campbelltown Sports Stadium, Sydney
Rd11 CBY V NEW - Belmore Sports Ground, Sydney
Rd12 WAR V NQL - FMG Stadium Waikato, Hamilton
Rd14 WST V CBY - Skully Park, Tamworth
Rd14 PAR V NEW - TIO Stadium, Darwin
Rd14 DOL V GLD - 1300SMILES Stadium, Townsville
Rd14 BRI V NQL - 1300SMILES Stadium, Townsville
Rd16 SYD V WST - Industree Group Stadium, Gosford
Rd16 CBY V CAN - Belmore Sports Ground, Sydney
Rd16 DOL V NQL - Salter Oval, Bundaberg
`,
  results: `
Round 1:
Sea Eagles 8 - 14 Broncos
Warriors 24 - 26 Bulldogs
Rabbitohs 20 - 24 Panthers
Titans 22 - 24 Storm
Dolphins 13 - 12 Sharks
Cowboys 14 - 12 Eels
Raiders 19 - 18 Roosters
Tigers 12 - 40 Dragons
Bye: Knights

Round 2:
Knights 10 - 37 Panthers
Sharks 16 - 32 Bulldogs
Storm 28 - 34 Rabbitohs
Tigers 22 - 16 Eels
Raiders 14 - 12 Dolphins
Cowboys 48 - 12 Roosters
Broncos 21 - 0 Warriors
Titans 20 - 16 Dragons
Bye: Sea Eagles

Round 3:
Eels 18 - 24 Sharks
Knights 12 - 13 Titans
Panthers 40 - 48 Tigers
Dolphins 30 - 31 Sea Eagles
Storm 30 - 26 Cowboys
Bulldogs 22 - 24 Broncos
Dragons 19 - 18 Raiders
Roosters 34 - 24 Warriors
Bye: Rabbitohs

Round 4:
Broncos 18 - 22 Dolphins
Warriors 12 - 36 Eels
Sea Eagles 53 - 12 Roosters
Panthers 14 - 18 Cowboys
Sharks 30 - 14 Dragons
Raiders 28 - 24 Storm
Tigers 37 - 36 Knights
Rabbitohs 24 - 14 Titans
Bye: Bulldogs

Round 5:
Sea Eagles 44 - 24 Eels
Bulldogs 25 - 31 Dolphins
Roosters 12 - 28 Broncos
Rabbitohs 24 - 18 Tigers
Storm 4 - 30 Sharks
Raiders 46 - 18 Panthers
Dragons 24 - 18 Warriors
Cowboys 24 - 31 Knights
Bye: Titans

Round 6 (Anzac Round):
Storm 40 - 28 Warriors
Dragons 18 - 44 Sea Eagles
Cowboys 22 - 40 Rabbitohs
Eels 10 - 26 Broncos
Roosters 30 - 31 Bulldogs
Panthers 22 - 23 Sharks
Knights 16 - 12 Raiders
Titans 19 - 20 Tigers
Bye: Dolphins

Round 7:
Storm 24 - 20 Sea Eagles
Bulldogs 30 - 6 Eels
Dolphins 12 - 17 Roosters
Titans 6 - 38 Cowboys
Sharks 32 - 12 Knights
Broncos 30 - 54 Dragons
Rabbitohs 32 - 34 Raiders
Warriors 34 - 13 Panthers
Bye: Tigers

Round 8:
Tigers 6 - 34 Cowboys
Eels 6 - 36 Dolphins
Broncos 14 - 15 Storm
Sea Eagles 12 - 10 Panthers
Raiders 12 - 36 Titans
Sharks 18 - 22 Rabbitohs
Warriors 18 - 20 Knights
Dragons 32 - 24 Bulldogs
Bye: Roosters

Round 9 (Magic Round):
Tigers 44 - 12 Raiders
Panthers 24 - 28 Broncos
Rabbitohs 18 - 34 Warriors
Dragons 0 - 16 Dolphins
Roosters 22 - 30 Eels
Knights 40 - 10 Sea Eagles
Bulldogs 22 - 20 Storm
Titans 26 - 16 Sharks
Bye: Cowboys

Round 10:
Cowboys 36 - 14 Raiders
Sharks 42 - 6 Tigers
Roosters 74 - 0 Dragons
Rabbitohs 32 - 12 Sea Eagles
Panthers 34 - 6 Bulldogs
Broncos 61 - 18 Knights
Warriors 31 - 18 Titans
Dolphins 12 - 10 Storm
Bye: Eels

Round 11:
Cowboys 20 - 16 Sharks
Eels 29 - 25 Dragons
Broncos 16 - 42 Rabbitohs
Dolphins 24 - 14 Panthers
Sea Eagles 16 - 18 Titans
Storm 22 - 32 Roosters
Tigers 22 - 29 Warriors
Bulldogs 30 - 24 Knights
Bye: Raiders

Round 12:
Eels 20 - 18 Storm
Raiders 16 - 17 Sharks
Panthers 0 - 66 Roosters
Titans 13 - 14 Broncos
Warriors 14 - 6 Cowboys
Rabbitohs 23 - 24 Bulldogs
Knights 0 - 34 Dolphins
Sea Eagles 52 - 6 Tigers
Bye: Dragons

Round 13:
Dolphins 12 - 19 Rabbitohs
Bulldogs 30 - 6 Titans
Panthers 10 - 16 Eels
Warriors 38 - 12 Raiders
Cowboys 25 - 24 Sea Eagles
Dragons 0 - 82 Storm
Broncos 16 - 18 Tigers
Roosters 12 - 14 Knights
Bye: Sharks

Round 14:
Dragons 12 - 44 Panthers
Tigers 13 - 12 Bulldogs
Rabbitohs 18 - 16 Roosters
Eels 12 - 13 Knights
Dolphins 12 - 42 Titans
Broncos 13 - 12 Cowboys
Sharks 30 - 44 Warriors
Raiders 18 - 20 Sea Eagles
Bye: Storm

Round 15 (Indigenous Round):
Titans 0 - 34 Roosters
Raiders 25 - 24 Broncos
Eels 18 - 28 Rabbitohs
Tigers 22 - 36 Dolphins
Sharks 10 - 20 Sea Eagles
Storm 65 - 0 Panthers
Bulldogs 36 - 30 Cowboys
Knights 32 - 6 Dragons
Bye: Warriors

Round 16:
Sharks 30 - 24 Broncos
Titans 72 - 0 Eels
Dragons 18 - 34 Rabbitohs
Roosters 36 - 18 Tigers
Knights 36 - 28 Storm
Sea Eagles 16 - 32 Warriors
Bulldogs 27 - 24 Raiders
Dolphins 25 - 18 Cowboys
Bye: Panthers

Round 17:
Roosters 12 - 13 Sharks
Knights 18 - 12 Rabbitohs
Storm 12 - 24 Tigers
Sea Eagles 52 - 12 Bulldogs
Panthers 38 - 22 Titans
Cowboys 21 - 22 Dragons
Warriors 22 - 24 Dolphins
Eels 24 - 18 Raiders
Bye: Broncos

Q/E Finals:
Rabbitohs 26 - 25 Sea Eagles
Broncos 24 - 16 Knights
Dolphins 8 - 6 Bulldogs
Sharks 34 - 30 Cowboys

Semi Finals:
Bulldogs 36 - 24 Broncos
Sea Eagles 20 - 24 Sharks

Preliminary Finals:
Rabbitohs 32 - 12 Bulldogs
Dolphins 13 - 12 Sharks

Grand Final:
Rabbitohs 29 - 22 Dolphins
`
},

8: {
  byePoints: 0,
  rounds: {
    "Round 10": { venue: "Optus Stadium, Perth",
                  days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] }
  },
  gameVenues: `
Rd1 WAR V WST - Hnry Stadium, Wellington
Rd1 SYD V MAN - Sydney Cricket Ground, Sydney
Rd1 CBY V SGI - Belmore Sports Ground, Sydney
Rd2 CBY V SOU - Adelaide Oval, Adelaide
Rd2 WST V MEL - Campbelltown Sports Stadium, Sydney
Rd2 SYD V GLD - Sydney Cricket Ground, Sydney
Rd4 CBY V CRO - Belmore Sports Ground, Sydney
Rd4 DOL V WAR - Kayo Stadium, Redcliffe
Rd5 PAR V PEN - Accor Stadium, Sydney
Rd5 CBY V DOL - Belmore Sports Ground, Sydney
Rd7 MEL V PAR - Marvel Stadium, Melbourne
Rd7 WST V PEN - Industree Group Stadium, Gosford
Rd7 WAR V BRI - Eden Park, Auckland
Rd8 CAN V WST - Glen Willow Oval, Mudgee
Rd8 MEL V DOL - Marvel Stadium, Melbourne
Rd9 SGI V DOL - St George Venues Jubilee Stadium, Kogarah
Rd9 CRO V WST - C.ex Coffs International Stadium, Coffs Harbour
Rd9 CBY V SYD - Belmore Sports Ground, Sydney
Rd11 WAR V PEN - Forsyth Barr Stadium, Dunedin
Rd12 WST V SGI - CommBank Stadium, Sydney
Rd12 SYD V NQL - Sydney Cricket Ground, Sydney
Rd13 DOL V GLD - Salter Oval, Bundaberg
Rd13 WST V SOU - Industree Group Stadium, Gosford
Rd14 BRI V NEW - The Gabba, Brisbane
Rd14 PEN V SYD - Carrington Park, Bathurst
Rd15 SGI V GLD - Apex Oval, Dubbo
Rd15 PAR V WST - TIO Stadium, Darwin
Rd16 CBY V BRI - Belmore Sports Ground, Sydney
Rd16 DOL V CAN - Kayo Stadium, Redcliffe
`,
  results: `
Round 1:
Rabbitohs 36 - 12 Dolphins
Warriors 18 - 22 Tigers
Broncos 8 - 6 Eels
Panthers 18 - 12 Knights
Cowboys 10 - 30 Sharks
Roosters 36 - 22 Sea Eagles
Bulldogs 25 - 26 Dragons
Storm 24 - 4 Raiders
Bye: Titans

Round 2:
Panthers 38 - 8 Dolphins
Warriors 14 - 30 Cowboys
Bulldogs 0 - 42 Rabbitohs
Tigers 10 - 40 Storm
Dragons 4 - 60 Sea Eagles
Raiders 10 - 10 Eels
Knights 26 - 8 Sharks
Roosters 38 - 6 Titans
Bye: Broncos

Round 3:
Sharks 22 - 20 Panthers
Tigers 40 - 12 Bulldogs
Eels 26 - 27 Roosters
Sea Eagles 72 - 0 Raiders
Dolphins 6 - 13 Cowboys
Titans 30 - 32 Broncos
Rabbitohs 6 - 10 Warriors
Storm 12 - 19 Dragons
Bye: Knights

Round 4:
Sea Eagles 6 - 30 Panthers
Broncos 16 - 17 Tigers
Cowboys 22 - 26 Eels
Bulldogs 12 - 13 Sharks
Titans 24 - 18 Rabbitohs
Dragons 12 - 20 Roosters
Knights 25 - 24 Storm
Dolphins 18 - 36 Warriors
Bye: Raiders

Round 5 (Indigenous Round):
Broncos 16 - 28 Rabbitohs
Roosters 12 - 24 Tigers
Eels 18 - 19 Panthers
Raiders 50 - 30 Dragons
Cowboys 20 - 19 Titans
Bulldogs 30 - 16 Dolphins
Knights 26 - 20 Sea Eagles
Sharks 18 - 22 Storm
Bye: Warriors

Round 6:
Dolphins 4 - 54 Broncos
Cowboys 52 - 0 Tigers
Sea Eagles 32 - 30 Storm
Eels 28 - 10 Bulldogs
Warriors 30 - 36 Titans
Sharks 26 - 24 Roosters
Panthers 24 - 22 Dragons
Raiders 18 - 29 Knights
Bye: Rabbitohs

Round 7:
Storm 36 - 16 Eels
Tigers 8 - 24 Panthers
Rabbitohs 60 - 6 Cowboys
Dragons 18 - 40 Knights
Warriors 28 - 29 Broncos
Dolphins 24 - 28 Roosters
Titans 8 - 25 Bulldogs
Sharks 34 - 20 Raiders
Bye: Sea Eagles

Round 8:
Broncos 58 - 18 Cowboys
Bulldogs 18 - 25 Warriors
Roosters 12 - 14 Rabbitohs
Raiders 46 - 20 Tigers
Titans 18 - 24 Panthers
Storm 42 - 12 Dolphins
Knights 12 - 38 Eels
Sea Eagles 32 - 12 Sharks
Bye: Dragons

Round 9:
Broncos 12 - 18 Storm
Raiders 32 - 18 Warriors
Panthers 28 - 26 Cowboys
Dragons 40 - 12 Dolphins
Sharks 24 - 48 Tigers
Bulldogs 6 - 68 Roosters
Knights 14 - 18 Rabbitohs
Titans 24 - 26 Sea Eagles
Bye: Eels

Round 10 (Magic Round):
Raiders 44 - 4 Bulldogs
Broncos 18 - 34 Sea Eagles
Warriors 21 - 20 Dragons
Cowboys 23 - 6 Knights
Rabbitohs 24 - 6 Sharks
Tigers 24 - 20 Dolphins
Storm 24 - 6 Roosters
Eels 20 - 12 Titans
Bye: Panthers

Round 11:
Dolphins 50 - 24 Knights
Sea Eagles 26 - 6 Tigers
Rabbitohs 38 - 12 Storm
Cowboys 18 - 31 Bulldogs
Warriors 4 - 10 Panthers
Roosters 22 - 32 Broncos
Titans 18 - 22 Raiders
Dragons 24 - 22 Eels
Bye: Sharks

Round 12 (Anzac Round):
Storm 21 - 20 Warriors
Knights 38 - 24 Titans
Sea Eagles 58 - 6 Dolphins
Eels 30 - 34 Sharks
Rabbitohs 43 - 12 Raiders
Panthers 22 - 16 Broncos
Tigers 0 - 86 Dragons
Roosters 22 - 16 Cowboys
Bye: Bulldogs

Round 13:
Sharks 24 - 46 Broncos
Raiders 22 - 18 Panthers
Knights 16 - 26 Roosters
Dolphins 0 - 42 Titans
Tigers 14 - 48 Rabbitohs
Dragons 28 - 12 Cowboys
Bulldogs 2 - 48 Sea Eagles
Eels 6 - 12 Warriors
Bye: Storm

Round 14:
Cowboys 18 - 19 Raiders
Warriors 12 - 19 Sea Eagles
Broncos 28 - 22 Knights
Dolphins 12 - 32 Eels
Titans 36 - 24 Sharks
Panthers 8 - 16 Roosters
Rabbitohs 22 - 12 Dragons
Storm 48 - 6 Bulldogs
Bye: Tigers

Round 15:
Sharks 28 - 24 Dolphins
Warriors 23 - 22 Knights
Sea Eagles 16 - 34 Rabbitohs
Panthers 24 - 16 Bulldogs
Storm 38 - 24 Cowboys
Raiders 18 - 24 Broncos
Dragons 6 - 44 Titans
Eels 36 - 38 Tigers
Bye: Roosters

Round 16:
Sea Eagles 36 - 0 Eels
Titans 30 - 32 Storm
Rabbitohs 34 - 6 Panthers
Bulldogs 4 - 34 Broncos
Dolphins 2 - 56 Raiders
Dragons 18 - 19 Sharks
Roosters 18 - 22 Warriors
Tigers 6 - 37 Knights
Bye: Cowboys

Round 17:
Eels 18 - 22 Rabbitohs
Roosters 16 - 34 Raiders
Cowboys 36 - 24 Sea Eagles
Tigers 25 - 12 Titans
Knights 48 - 6 Bulldogs
Broncos 42 - 12 Dragons
Sharks 40 - 22 Warriors
Panthers 10 - 16 Storm
Bye: Dolphins

Q/E Finals:
Rabbitohs 26 - 24 Broncos
Storm 12 - 60 Sea Eagles
Panthers 12 - 10 Sharks
Raiders 20 - 18 Roosters

Semi Finals:
Broncos 14 - 8 Panthers
Storm 24 - 20 Raiders

Preliminary Finals:
Sea Eagles 30 - 36 Broncos - Allianz Stadium, Sydney
Rabbitohs 34 - 6 Storm

Grand Final:
Rabbitohs 20 - 14 Broncos
`
},

9: {
  byePoints: 0,
  venues: {
    PER: ["Optus Stadium, Perth"]
  },
  rounds: {
    "Round 1":  { days: ["Sunday","Sunday","Sunday","Thursday","Friday","Friday","Saturday","Saturday","Sunday"] },
    "Round 7":  { days: ["Thursday","Friday","Saturday","Sunday"] },
    "Round 8":  { days: ["Friday","Friday","Saturday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] },
    "Round 9":  { venue: "Suncorp Stadium, Brisbane",
                  days: ["Thursday","Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] },
    "Round 13": { days: ["Thursday","Friday","Saturday","Saturday","Sunday"] },
    "Round 14": { days: ["Friday","Friday","Saturday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] }
  },
  gameVenues: `
Rd1 SOU V BRI - EverBank Stadium, Jacksonville
Rd1 PEN V MEL - EverBank Stadium, Jacksonville
Rd1 MAN V SYD - EverBank Stadium, Jacksonville
Rd2 CBY V PER - Belmore Sports Ground, Sydney
Rd2 BRI V DOL - Queensland Country Bank Stadium, Townsville
Rd3 DOL V NEW - Kayo Stadium, Redcliffe
Rd3 WAR V CBY - Forsyth Barr Stadium, Dunedin
Rd4 MEL V NQL - Adelaide Oval, Adelaide
Rd4 WST V DOL - Industree Group Stadium, Gosford
Rd5 SGI V WST - St George Venues Jubilee Stadium, Kogarah
Rd6 WST V WAR - Campbelltown Sports Stadium, Sydney
Rd6 PER V MAN - North Sydney Oval, Sydney
Rd6 NEW V CRO - Santos National Football Stadium, Port Moresby
Rd6 PAR V NQL - Santos National Football Stadium, Port Moresby
Rd6 DOL V SGI - Kayo Stadium, Redcliffe
Rd8 PEN V SGI - Carrington Park, Bathurst
Rd11 SGI V GLD - Salter Oval, Bundaberg
Rd11 PAR V DOL - TIO Stadium, Darwin
Rd12 CBY V SGI - Belmore Sports Ground, Sydney
Rd14 CAN V CBY - Glen Willow Oval, Mudgee
Rd15 MEL V NEW - Marvel Stadium, Melbourne
Rd15 CRO V WST - C.ex Coffs International Stadium, Coffs Harbour
Rd16 PER V DOL - HBF Park, Perth
Rd17 DOL V MEL - Kayo Stadium, Redcliffe
`,
  results: `
Round 1:
Rabbitohs 26 - 28 Broncos
Panthers 25 - 24 Storm
Sea Eagles 16 - 36 Roosters
Eels 19 - 18 Raiders
Cowboys 40 - 12 Tigers
Bears 35 - 6 Dragons
Warriors 36 - 18 Sharks
Dolphins 24 - 34 Titans
Knights 54 - 18 Bulldogs

Round 2:
Roosters 44 - 6 Sharks
Dragons 32 - 30 Raiders
Storm 46 - 16 Eels
Bulldogs 20 - 12 Bears
Broncos 10 - 17 Dolphins
Cowboys 6 - 10 Titans
Tigers 12 - 30 Panthers
Sea Eagles 21 - 14 Rabbitohs
Knights 18 - 32 Warriors

Round 3:
Roosters 16 - 10 Dragons
Titans 23 - 10 Bears
Broncos 18 - 40 Storm
Sharks 18 - 19 Cowboys
Dolphins 40 - 26 Knights
Rabbitohs 70 - 6 Eels
Warriors 30 - 10 Bulldogs
Panthers 36 - 6 Sea Eagles
Raiders 12 - 32 Tigers

Round 4:
Storm 26 - 0 Cowboys
Tigers 18 - 20 Dolphins
Rabbitohs 20 - 18 Roosters
Warriors 16 - 46 Sea Eagles
Bears 34 - 13 Eels
Sharks 0 - 46 Bulldogs
Titans 0 - 11 Broncos
Panthers 20 - 12 Raiders
Dragons 22 - 0 Knights

Round 5:
Roosters 10 - 32 Bears
Bulldogs 18 - 18 Storm
Cowboys 12 - 18 Broncos
Knights 12 - 13 Rabbitohs
Eels 28 - 30 Titans
Dolphins 6 - 43 Panthers
Sea Eagles 34 - 4 Sharks
Raiders 34 - 6 Warriors
Dragons 39 - 24 Tigers

Round 6 (Indigenous Round):
Storm 48 - 18 Roosters
Tigers 14 - 18 Warriors
Broncos 40 - 30 Panthers
Bears 24 - 16 Sea Eagles
Raiders 14 - 15 Rabbitohs
Bulldogs 20 - 42 Titans
Knights 8 - 0 Sharks
Eels 50 - 6 Cowboys
Dolphins 26 - 22 Dragons

Round 7:
Panthers 26 - 18 Bulldogs
Roosters 66 - 6 Dolphins
Bears 32 - 18 Broncos
Warriors 28 - 24 Cowboys

Round 8:
Titans 12 - 20 Roosters
Sea Eagles 32 - 18 Storm
Warriors 56 - 6 Dolphins
Rabbitohs 25 - 24 Tigers
Cowboys 20 - 22 Bulldogs
Broncos 36 - 24 Eels
Panthers 23 - 16 Dragons
Sharks 20 - 20 Raiders
Bears 22 - 48 Knights

Round 9 (Magic Round):
Bulldogs 6 - 48 Broncos
Dolphins 27 - 18 Sharks
Rabbitohs 16 - 30 Panthers
Dragons 32 - 18 Warriors
Titans 12 - 18 Knights
Eels 32 - 28 Roosters
Tigers 24 - 25 Bears
Cowboys 12 - 52 Sea Eagles
Raiders 12 - 36 Storm

Round 10:
Knights 12 - 28 Panthers
Roosters 22 - 18 Warriors
Broncos 26 - 18 Tigers
Bulldogs 16 - 48 Rabbitohs
Storm 36 - 10 Titans
Sharks 12 - 30 Eels
Sea Eagles 36 - 16 Dragons
Bears 62 - 0 Cowboys
Raiders 37 - 6 Dolphins

Round 11 (Anzac Round):
Storm 14 - 15 Warriors
Panthers 40 - 36 Cowboys
Rabbitohs 62 - 4 Bears
Dragons 42 - 24 Titans
Sea Eagles 32 - 30 Knights
Roosters 18 - 16 Raiders
Eels 18 - 28 Dolphins
Sharks 16 - 22 Broncos
Tigers 8 - 62 Bulldogs

Round 12:
Dolphins 30 - 6 Sea Eagles
Warriors 30 - 26 Eels
Bears 22 - 24 Storm
Titans 26 - 28 Sharks
Cowboys 12 - 44 Rabbitohs
Broncos 10 - 16 Raiders
Knights 46 - 14 Tigers
Panthers 6 - 24 Roosters
Bulldogs 30 - 4 Dragons

Round 13:
Knights 22 - 24 Raiders
Tigers 24 - 12 Sea Eagles
Titans 40 - 48 Rabbitohs
Eels 12 - 16 Dragons
Storm 24 - 18 Sharks

Round 14:
Roosters 38 - 6 Knights
Dolphins 18 - 13 Cowboys
Sharks 0 - 64 Rabbitohs
Dragons 6 - 34 Storm
Sea Eagles 16 - 24 Broncos
Eels 50 - 12 Tigers
Raiders 13 - 14 Bulldogs
Titans 24 - 38 Panthers
Warriors 40 - 22 Bears

Round 15:
Storm 34 - 30 Knights
Rabbitohs 12 - 14 Dolphins
Bulldogs 24 - 30 Eels
Panthers 22 - 35 Warriors
Bears 24 - 36 Raiders
Broncos 76 - 6 Dragons
Sharks 31 - 30 Tigers
Sea Eagles 29 - 28 Titans
Cowboys 28 - 36 Roosters

Round 16:
Bears 14 - 6 Dolphins
Panthers 40 - 10 Sharks
Bulldogs 12 - 14 Roosters
Titans 28 - 4 Raiders
Dragons 6 - 88 Rabbitohs
Knights 20 - 12 Cowboys
Broncos 0 - 16 Warriors
Eels 15 - 14 Sea Eagles
Tigers 6 - 36 Storm

Round 17:
Bears 12 - 26 Panthers
Dragons 24 - 26 Sharks
Roosters 18 - 19 Broncos
Tigers 34 - 36 Titans
Rabbitohs 28 - 24 Warriors
Knights 20 - 16 Eels
Bulldogs 24 - 48 Sea Eagles
Raiders 44 - 20 Cowboys
Dolphins 0 - 40 Storm

Round 18:
Eels 19 - 18 Panthers
Sea Eagles 52 - 12 Raiders
Broncos 30 - 6 Knights
Warriors 18 - 10 Titans
Cowboys 33 - 32 Dragons
Roosters 34 - 18 Tigers
Dolphins 20 - 12 Bulldogs
Sharks 30 - 28 Bears
Storm 18 - 24 Rabbitohs

Q/E Finals:
Rabbitohs 44 - 18 Roosters
Warriors 15 - 14 Sea Eagles
Broncos 18 - 4 Dolphins
Panthers 12 - 24 Storm

Semi Finals:
Roosters 14 - 0 Broncos
Panthers 26 - 18 Warriors - Accor Stadium, Sydney

Preliminary Finals:
Storm 24 - 25 Roosters
Rabbitohs 16 - 17 Panthers

Grand Final:
Panthers 16 - 26 Roosters
`
},

10: {
  byePoints: 0,
  venues: {
    PER: ["Optus Stadium, Perth"]
  },
  rounds: {
    "Round 1":  { days: ["Sunday","Sunday","Thursday","Friday","Friday","Saturday","Saturday","Saturday","Sunday"] },
    "Round 7":  { days: ["Thursday","Friday","Saturday","Sunday"] },
    "Round 8":  { days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday","Monday"] },
    "Round 9":  { venue: "Suncorp Stadium, Brisbane",
                  days: ["Thursday","Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] },
    "Round 13": { days: ["Thursday","Friday","Saturday","Saturday","Sunday"] },
    "Round 14": { days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday","Monday"] }
  },
  gameVenues: `
Rd1 SYD V PEN - Allegiant Stadium, Las Vegas
Rd1 PAR V WAR - Allegiant Stadium, Las Vegas
Rd1 CBY V NQL - Belmore Sports Ground, Sydney
Rd2 WST V BRI - Campbelltown Sports Stadium, Sydney
Rd4 BRI V MAN - Industree Group Stadium, Gosford
Rd4 CBY V WST - Salter Oval, Bundaberg
Rd5 WAR V CAN - Hnry Stadium, Wellington
Rd6 WST V MEL - Campbelltown Sports Stadium, Sydney
Rd6 PEN V WAR - Carrington Park, Bathurst
Rd6 NEW V CRO - C.ex Coffs International Stadium, Coffs Harbour
Rd6 GLD V CBY - Glen Willow Oval, Mudgee
Rd6 SYD V SOU - Sydney Cricket Ground, Sydney
Rd6 SGI V PER - St George Venues Jubilee Stadium, Kogarah
Rd8 PER V GLD - Adelaide Oval, Adelaide
Rd8 SOU V CAN - Adelaide Oval, Adelaide
Rd8 CBY V DOL - Belmore Sports Ground, Sydney
Rd8 SYD V NQL - Sydney Cricket Ground, Sydney
Rd11 CAN V SYD - Industree Group Stadium, Gosford
Rd11 WST V NQL - CommBank Stadium, Sydney
Rd12 SYD V GLD - Sydney Cricket Ground, Sydney
Rd12 PAR V WST - TIO Stadium, Darwin
Rd13 PER V PEN - HBF Park, Perth
Rd13 WAR V WST - Forsyth Barr Stadium, Dunedin
Rd14 CBY V BRI - Belmore Sports Ground, Sydney
Rd14 DOL V PER - Kayo Stadium, Redcliffe
Rd15 WST V PEN - Industree Group Stadium, Gosford
`,
  results: `
Round 1:
Roosters 12 - 34 Panthers
Eels 10 - 26 Warriors
Storm 40 - 6 Broncos
Titans 19 - 18 Dragons
Rabbitohs 28 - 18 Bears
Sea Eagles 38 - 6 Knights
Bulldogs 12 - 13 Cowboys
Sharks 32 - 6 Raiders
Tigers 12 - 10 Dolphins

Round 2:
Rabbitohs 12 - 32 Storm
Titans 50 - 24 Knights
Panthers 29 - 22 Raiders
Bulldogs 38 - 0 Warriors
Eels 23 - 8 Sharks
Tigers 13 - 12 Broncos
Dolphins 24 - 38 Dragons
Sea Eagles 26 - 18 Roosters
Cowboys 41 - 6 Bears

Round 3:
Raiders 16 - 28 Storm
Knights 60 - 6 Bulldogs
Panthers 24 - 25 Titans
Broncos 32 - 28 Warriors
Dragons 26 - 6 Sea Eagles
Cowboys 38 - 34 Rabbitohs
Roosters 28 - 22 Tigers
Dolphins 30 - 31 Sharks
Bears 28 - 30 Eels

Round 4 (Indigenous Round):
Rabbitohs 26 - 14 Panthers
Raiders 24 - 32 Titans
Broncos 6 - 44 Sea Eagles
Dragons 23 - 22 Eels
Sharks 18 - 16 Cowboys
Roosters 64 - 6 Dolphins
Bulldogs 2 - 26 Tigers
Warriors 29 - 24 Knights
Storm 34 - 22 Bears

Round 5:
Sharks 14 - 16 Roosters
Titans 54 - 6 Tigers
Eels 24 - 20 Cowboys
Warriors 16 - 28 Raiders
Sea Eagles 34 - 30 Panthers
Bears 24 - 38 Broncos
Storm 18 - 10 Dolphins
Bulldogs 14 - 12 Rabbitohs
Knights 22 - 52 Dragons

Round 6:
Broncos 30 - 12 Raiders
Tigers 26 - 42 Storm
Dolphins 12 - 41 Eels
Panthers 26 - 20 Warriors
Knights 36 - 28 Sharks
Cowboys 0 - 31 Sea Eagles
Titans 38 - 24 Bulldogs
Roosters 14 - 28 Rabbitohs
Dragons 34 - 26 Bears

Round 7:
Sharks 44 - 14 Storm
Dolphins 24 - 10 Broncos
Rabbitohs 32 - 16 Titans
Raiders 8 - 38 Knights

Round 8:
Storm 38 - 18 Dragons
Eels 28 - 40 Broncos
Sea Eagles 30 - 26 Warriors
Bears 17 - 16 Titans
Rabbitohs 16 - 22 Raiders
Bulldogs 16 - 39 Dolphins
Roosters 12 - 44 Cowboys
Knights 28 - 18 Tigers
Panthers 30 - 24 Sharks

Round 9 (Magic Round):
Broncos 6 - 34 Roosters
Dolphins 34 - 42 Raiders
Sea Eagles 6 - 8 Rabbitohs
Warriors 24 - 29 Sharks
Storm 26 - 18 Knights
Cowboys 12 - 12 Panthers
Dragons 22 - 20 Bulldogs
Titans 21 - 20 Eels
Bears 12 - 42 Tigers

Round 10:
Sharks 6 - 24 Broncos
Cowboys 28 - 29 Knights
Roosters 36 - 18 Dragons
Warriors 22 - 24 Rabbitohs
Titans 24 - 26 Sea Eagles
Eels 16 - 42 Storm
Tigers 22 - 24 Raiders
Panthers 58 - 0 Dolphins
Bears 12 - 42 Bulldogs

Round 11 (Anzac Round):
Storm 46 - 16 Warriors
Knights 27 - 48 Dolphins
Sea Eagles 18 - 12 Eels
Bulldogs 38 - 30 Panthers
Raiders 13 - 18 Roosters
Sharks 21 - 12 Bears
Rabbitohs 16 - 30 Dragons
Broncos 38 - 12 Titans
Tigers 30 - 0 Cowboys

Round 12:
Dolphins 15 - 14 Sea Eagles
Knights 24 - 18 Bears
Panthers 14 - 8 Broncos
Roosters 22 - 35 Titans
Eels 14 - 12 Tigers
Rabbitohs 22 - 26 Sharks
Dragons 50 - 12 Raiders
Warriors 28 - 24 Cowboys
Storm 46 - 12 Bulldogs

Round 13:
Eels 22 - 18 Roosters
Bears 12 - 54 Panthers
Warriors 30 - 4 Tigers
Cowboys 24 - 30 Dragons
Sea Eagles 22 - 32 Bulldogs

Round 14:
Titans 4 - 46 Storm
Eels 0 - 20 Rabbitohs
Bulldogs 56 - 12 Broncos
Raiders 36 - 40 Cowboys
Panthers 6 - 14 Knights
Roosters 12 - 28 Warriors
Sharks 40 - 4 Sea Eagles
Tigers 4 - 54 Dragons
Dolphins 31 - 18 Bears

Round 15:
Broncos 24 - 28 Rabbitohs
Knights 29 - 23 Eels
Sea Eagles 18 - 14 Storm
Bulldogs 42 - 12 Raiders
Bears 22 - 18 Roosters
Cowboys 39 - 12 Dolphins
Tigers 6 - 38 Panthers
Titans 76 - 6 Warriors
Dragons 4 - 14 Sharks

Round 16:
Storm 26 - 30 Cowboys
Raiders 10 - 16 Sea Eagles
Panthers 36 - 16 Eels
Knights 24 - 18 Roosters
Warriors 22 - 4 Bears
Dragons 28 - 20 Broncos
Bulldogs 28 - 0 Sharks
Dolphins 25 - 18 Titans
Tigers 23 - 22 Rabbitohs

Round 17:
Bears 16 - 34 Sea Eagles
Warriors 20 - 22 Dragons
Panthers 6 - 14 Storm
Cowboys 12 - 32 Titans
Roosters 4 - 42 Bulldogs
Rabbitohs 34 - 18 Dolphins
Broncos 6 - 24 Knights
Raiders 10 - 11 Eels
Sharks 40 - 16 Tigers

Round 18:
Storm 36 - 24 Roosters
Titans 36 - 26 Sharks
Broncos 16 - 22 Cowboys
Dolphins 18 - 22 Warriors
Eels 12 - 36 Bulldogs
Dragons 34 - 30 Panthers
Sea Eagles 46 - 4 Tigers
Knights 24 - 18 Rabbitohs
Raiders 50 - 10 Bears

Q/E Finals:
Dragons 12 - 23 Sea Eagles
Storm 42 - 14 Titans
Knights 16 - 22 Panthers
Bulldogs 14 - 6 Sharks

Semi Finals:
Titans 6 - 32 Panthers
Dragons 20 - 6 Bulldogs - Allianz Stadium, Sydney

Preliminary Finals:
Sea Eagles 12 - 20 Panthers - Allianz Stadium, Sydney
Storm 46 - 24 Dragons

Grand Final:
Storm 12 - 13 Panthers
`
},

11: {
  byePoints: 2,
  venues: {
    PEN: ["CommBank Stadium, Sydney"]
  },
  rounds: {
    "Round 1": { days: ["Sunday","Sunday","Thursday","Friday","Friday","Saturday","Saturday","Sunday"] },
    "Round 7": { days: ["Thursday","Thursday","Thursday","Friday","Saturday","Saturday","Sunday","Sunday"] },
    "Round 9": { venue: "Suncorp Stadium, Brisbane",
                 days: ["Thursday","Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday"] }
  },
  gameVenues: `
Rd1 CRO V NQL - Allegiant Stadium, Las Vegas
Rd1 CAN V SGI - Allegiant Stadium, Las Vegas
Rd2 PEN V DOL - Carrington Park, Bathurst
Rd5 NEW V MAN - Optus Stadium, Perth
Rd5 SOU V NQL - Optus Stadium, Perth
Rd5 BRI V SGI - Adelaide Oval, Adelaide
Rd5 MEL V CAN - Santos National Football Stadium, Port Moresby
Rd5 DOL V GLD - Santos National Football Stadium, Port Moresby
Rd6 WAR V SOU - Hnry Stadium, Wellington
Rd7 SGI V WST - Allianz Stadium, Sydney
Rd7 CBY V GLD - Belmore Sports Ground, Sydney
Rd8 CAN V NEW - Glen Willow Oval, Mudgee
Rd8 WST V DOL - Campbelltown Sports Stadium, Sydney
Rd10 DOL V MEL - Salter Oval, Bundaberg
Rd11 SOU V WST - C.ex Coffs International Stadium, Coffs Harbour
Rd11 SYD V SGI - Industree Group Stadium, Gosford
Rd11 PAR V CRO - TIO Stadium, Darwin
Rd12 WST V CAN - Campbelltown Sports Stadium, Sydney
Rd12 SGI V CBY - St George Venues Jubilee Stadium, Kogarah
Rd13 NQL V CBY - Barlow Park, Cairns
Rd13 MEL V SOU - HBF Park, Perth
Rd13 WAR V PEN - FMG Stadium Waikato, Hamilton
Rd13 WST V MAN - Allianz Stadium, Sydney
Rd14 DOL V WAR - Kayo Stadium, Redcliffe
Rd15 CBY V WAR - Belmore Sports Ground, Sydney
Rd16 SGI V DOL - St George Venues Jubilee Stadium, Kogarah
`,
  results: `
Round 1:
Sharks 19 - 18 Cowboys
Raiders 40 - 18 Dragons
Panthers 12 - 27 Storm
Warriors 18 - 10 Titans
Broncos 20 - 18 Rabbitohs
Bulldogs 20 - 4 Sea Eagles
Knights 34 - 24 Dolphins
Roosters 16 - 12 Eels
Bye: Tigers

Round 2 (Multicultural Round):
Titans 12 - 18 Broncos
Panthers 6 - 24 Dolphins
Eels 16 - 4 Sea Eagles
Sharks 18 - 20 Tigers
Dragons 6 - 57 Storm
Cowboys 32 - 12 Knights
Roosters 14 - 24 Rabbitohs
Raiders 12 - 26 Warriors
Bye: Bulldogs

Round 3:
Dolphins 0 - 38 Bulldogs
Broncos 30 - 44 Sharks
Dragons 26 - 34 Panthers
Rabbitohs 30 - 24 Raiders
Knights 6 - 52 Warriors
Sea Eagles 26 - 12 Cowboys
Storm 18 - 16 Eels
Tigers 34 - 12 Roosters
Bye: Titans

Round 4:
Sharks 16 - 40 Dragons
Bulldogs 28 - 24 Raiders
Panthers 66 - 0 Knights
Cowboys 28 - 30 Broncos
Warriors 20 - 30 Tigers
Dolphins 31 - 10 Roosters
Sea Eagles 30 - 32 Storm
Eels 48 - 24 Titans
Bye: Rabbitohs

Round 5 (Travel Round):
Bulldogs 34 - 30 Sharks
Tigers 12 - 16 Eels
Roosters 12 - 18 Panthers
Knights 12 - 30 Sea Eagles
Rabbitohs 16 - 24 Cowboys
Broncos 16 - 17 Dragons
Storm 16 - 22 Raiders
Dolphins 22 - 18 Titans
Bye: Warriors

Round 6:
Roosters 6 - 8 Bulldogs
Warriors 10 - 23 Rabbitohs
Eels 32 - 18 Broncos
Cowboys 10 - 38 Tigers
Knights 26 - 18 Storm
Titans 24 - 40 Dragons
Raiders 20 - 12 Panthers
Sharks 30 - 24 Dolphins
Bye: Sea Eagles

Round 7 (Anzac Round):
Warriors 12 - 8 Cowboys
Dragons 30 - 31 Tigers
Storm 34 - 22 Roosters
Panthers 12 - 24 Sharks
Dolphins 6 - 28 Broncos
Sea Eagles 18 - 24 Raiders
Bulldogs 14 - 24 Titans
Rabbitohs 28 - 40 Eels
Bye: Knights

Round 8:
Broncos 30 - 24 Bulldogs
Storm 32 - 28 Sharks
Titans 16 - 26 Panthers
Raiders 18 - 24 Knights
Eels 10 - 40 Warriors
Rabbitohs 38 - 6 Dragons
Tigers 28 - 24 Dolphins
Roosters 6 - 29 Sea Eagles
Bye: Cowboys

Round 9 (Magic Round):
Knights 12 - 30 Roosters
Dolphins 6 - 25 Rabbitohs
Sea Eagles 14 - 15 Sharks
Tigers 50 - 18 Bulldogs
Cowboys 18 - 8 Eels
Dragons 0 - 36 Warriors
Broncos 19 - 22 Panthers
Titans 14 - 12 Storm
Bye: Raiders

Round 10:
Sea Eagles 18 - 24 Dragons
Dolphins 18 - 38 Storm
Panthers 25 - 24 Bulldogs
Tigers 40 - 10 Titans
Cowboys 24 - 12 Raiders
Sharks 24 - 4 Rabbitohs
Warriors 16 - 20 Roosters
Knights 38 - 18 Eels
Bye: Broncos

Round 11:
Titans 24 - 28 Cowboys
Raiders 22 - 23 Dolphins
Panthers 4 - 12 Sea Eagles
Rabbitohs 12 - 19 Tigers
Roosters 18 - 19 Dragons
Eels 42 - 43 Sharks
Warriors 22 - 18 Broncos
Bulldogs 56 - 18 Knights
Bye: Storm

Round 12 (Indigenous Round):
Storm 26 - 6 Cowboys
Sea Eagles 50 - 24 Warriors
Broncos 40 - 30 Roosters
Tigers 24 - 44 Raiders
Sharks 6 - 38 Titans
Dragons 0 - 14 Bulldogs
Rabbitohs 16 - 32 Knights
Eels 6 - 7 Panthers
Bye: Dolphins

Round 13:
Roosters 12 - 40 Sharks
Cowboys 32 - 34 Bulldogs
Storm 16 - 18 Rabbitohs
Warriors 18 - 24 Panthers
Knights 20 - 18 Broncos
Raiders 44 - 6 Titans
Tigers 16 - 24 Sea Eagles
Dolphins 24 - 13 Eels
Bye: Dragons

Round 14:
Titans 36 - 16 Sea Eagles
Sharks 28 - 16 Knights
Broncos 18 - 19 Storm
Roosters 16 - 22 Raiders
Dolphins 28 - 4 Warriors
Panthers 30 - 12 Tigers
Dragons 30 - 36 Cowboys
Bulldogs 20 - 21 Rabbitohs
Bye: Eels

Round 15 (Women in League Round):
Sharks 12 - 30 Raiders
Storm 48 - 6 Tigers
Rabbitohs 18 - 22 Panthers
Knights 6 - 25 Titans
Eels 28 - 24 Dragons
Cowboys 37 - 24 Dolphins
Bulldogs 38 - 6 Warriors
Sea Eagles 8 - 48 Broncos
Bye: Roosters

Round 16:
Tigers 12 - 36 Knights
Panthers 20 - 34 Cowboys
Storm 28 - 30 Warriors
Dragons 78 - 36 Dolphins
Eels 18 - 12 Bulldogs
Raiders 15 - 14 Broncos
Titans 20 - 12 Roosters
Rabbitohs 32 - 12 Sea Eagles
Bye: Sharks

Round 17:
Broncos 58 - 6 Tigers
Sea Eagles 36 - 12 Dolphins
Cowboys 26 - 24 Roosters
Raiders 12 - 36 Eels
Titans 18 - 25 Rabbitohs
Dragons 34 - 38 Knights
Warriors 38 - 4 Sharks
Bulldogs 16 - 36 Storm
Bye: Panthers

Q/E Finals:
Panthers 17 - 16 Bulldogs - CommBank Stadium, Sydney
Storm 28 - 10 Warriors
Rabbitohs 28 - 22 Cowboys
Raiders 22 - 16 Sharks

Semi Finals:
Bulldogs 42 - 4 Rabbitohs
Warriors 18 - 20 Raiders

Preliminary Finals:
Storm 44 - 10 Bulldogs
Panthers 26 - 18 Raiders - Accor Stadium, Sydney

Grand Final:
Storm 24 - 20 Panthers
`
},

12: {
  byePoints: 2,
  venues: {
    PEN: ["CommBank Stadium, Sydney"]
  },
  rounds: {
    "Round 1":  { days: ["Sunday","Sunday","Thursday","Friday","Friday","Saturday","Saturday","Sunday"] },
    "Round 6":  { days: ["Thursday","Thursday","Thursday","Friday","Saturday","Saturday","Sunday","Sunday"] },
    "Round 7":  { days: ["Thursday","Friday","Saturday","Sunday"] },
    "Round 8":  { days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] },
    "Round 9":  { venue: "Suncorp Stadium, Brisbane",
                  days: ["Thursday","Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday"] },
    "Round 13": { days: ["Friday","Saturday","Saturday","Sunday"] },
    "Round 14": { days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] },
    "Finals Week 2": { days: ["Saturday","Sunday"] },
    "Finals Week 3": { days: ["Saturday","Sunday"] }
  },
  gameVenues: `
Rd1 WST V BRI - Allegiant Stadium, Las Vegas
Rd1 NEW V CBY - Allegiant Stadium, Las Vegas
Rd5 WST V SYD - Campbelltown Sports Stadium, Sydney
Rd6 SGI V CBY - Allianz Stadium, Sydney
Rd6 WAR V CRO - Apollo Projects Stadium, Christchurch
Rd6 SOU V DOL - Industree Group Stadium, Gosford
Rd7 PAR V DOL - TIO Stadium, Darwin
Rd8 CAN V WST - Glen Willow Oval, Mudgee
Rd10 SGI V SYD - St George Venues Jubilee Stadium, Kogarah
Rd11 PEN V WAR - Industree Group Stadium, Gosford
Rd11 DOL V NEW - HBF Park, Perth
Rd12 SOU V PAR - Allianz Stadium, Sydney
Rd12 WST V PEN - Allianz Stadium, Sydney
Rd13 SGI V PEN - St George Venues Jubilee Stadium, Kogarah
Rd14 PEN V CRO - Carrington Park, Bathurst
Rd15 WST V SGI - Campbelltown Sports Stadium, Sydney
Rd15 CRO V NQL - Optus Stadium, Perth
Rd15 MEL V SOU - Optus Stadium, Perth
Rd15 DOL V CAN - Kayo Stadium, Redcliffe
Rd17 CBY V GLD - Belmore Sports Ground, Sydney
Rd18 DOL V WST - Kayo Stadium, Redcliffe
`,
  results: `
Round 1:
Tigers 26 - 18 Broncos
Knights 24 - 26 Bulldogs
Storm 42 - 0 Panthers
Warriors 6 - 52 Raiders
Roosters 12 - 22 Dolphins
Sea Eagles 18 - 34 Titans
Cowboys 30 - 8 Rabbitohs
Eels 22 - 18 Dragons
Bye: Sharks

Round 2:
Dolphins 30 - 12 Sea Eagles
Knights 12 - 18 Sharks
Rabbitohs 12 - 36 Panthers
Broncos 30 - 18 Warriors
Raiders 16 - 29 Dragons
Titans 19 - 18 Cowboys
Eels 6 - 14 Bulldogs
Tigers 10 - 28 Storm
Bye: Roosters

Round 3 (Multicultural Round):
Panthers 24 - 16 Knights
Bulldogs 22 - 18 Warriors
Roosters 20 - 10 Broncos
Titans 36 - 30 Rabbitohs
Sharks 20 - 12 Tigers
Cowboys 12 - 13 Eels
Dolphins 16 - 37 Storm
Sea Eagles 26 - 28 Raiders
Bye: Dragons

Round 4:
Broncos 28 - 22 Cowboys
Warriors 18 - 28 Knights
Roosters 0 - 26 Rabbitohs
Raiders 38 - 18 Panthers
Dolphins 20 - 18 Titans
Eels 18 - 19 Tigers
Sea Eagles 12 - 30 Storm
Dragons 22 - 36 Sharks
Bye: Bulldogs

Round 5:
Knights 4 - 34 Broncos
Warriors 34 - 26 Dolphins
Storm 22 - 6 Sharks
Raiders 24 - 36 Eels
Titans 34 - 24 Dragons
Panthers 48 - 18 Sea Eagles
Tigers 18 - 30 Roosters
Bulldogs 32 - 22 Rabbitohs
Bye: Cowboys

Round 6 (Anzac Round):
Dragons 30 - 36 Bulldogs
Warriors 24 - 8 Sharks
Storm 10 - 60 Roosters
Broncos 16 - 40 Sea Eagles
Cowboys 16 - 18 Raiders
Rabbitohs 22 - 26 Dolphins
Tigers 54 - 12 Knights
Panthers 24 - 24 Eels
Bye: Titans

Round 7:
Titans 12 - 30 Raiders
Eels 30 - 38 Dolphins
Bulldogs 30 - 22 Cowboys
Knights 34 - 6 Roosters
Bye: Broncos, Sharks, Sea Eagles, Storm, Warriors, Panthers, Rabbitohs, Dragons, Tigers

Round 8:
Roosters 12 - 38 Titans
Sea Eagles 22 - 16 Rabbitohs
Knights 28 - 0 Dragons
Eels 36 - 24 Warriors
Cowboys 25 - 24 Storm
Raiders 36 - 14 Tigers
Panthers 6 - 26 Broncos
Sharks 24 - 22 Bulldogs
Bye: Dolphins

Round 9 (Magic Round):
Eels 30 - 28 Knights
Dolphins 16 - 42 Panthers
Rabbitohs 28 - 13 Warriors
Dragons 0 - 44 Storm
Roosters 6 - 42 Cowboys
Titans 34 - 22 Tigers
Broncos 20 - 32 Bulldogs
Sharks 16 - 38 Raiders
Bye: Sea Eagles

Round 10:
Dragons 24 - 6 Roosters
Warriors 4 - 42 Sea Eagles
Bulldogs 10 - 12 Dolphins
Rabbitohs 38 - 12 Knights
Broncos 18 - 24 Raiders
Storm 24 - 40 Eels
Sharks 16 - 12 Titans
Tigers 26 - 24 Cowboys
Bye: Panthers

Round 11:
Raiders 12 - 32 Rabbitohs
Roosters 22 - 12 Sharks
Storm 34 - 30 Broncos
Panthers 24 - 14 Warriors
Eels 18 - 26 Titans
Dolphins 18 - 40 Knights
Dragons 30 - 24 Cowboys
Bulldogs 12 - 13 Sea Eagles
Bye: Tigers

Round 12 (Indigenous Round):
Sharks 58 - 30 Dolphins
Knights 24 - 18 Titans
Roosters 12 - 28 Bulldogs
Sea Eagles 6 - 44 Dragons
Raiders 24 - 30 Storm
Rabbitohs 16 - 34 Eels
Cowboys 68 - 18 Warriors
Tigers 12 - 42 Panthers
Bye: Broncos

Round 13:
Rabbitohs 22 - 31 Broncos
Warriors 30 - 0 Tigers
Dragons 36 - 10 Panthers
Sea Eagles 26 - 12 Sharks
Bye: Raiders, Bulldogs, Dolphins, Titans, Storm, Knights, Cowboys, Eels, Roosters

Round 14:
Dragons 12 - 38 Warriors
Dolphins 18 - 28 Broncos
Panthers 36 - 18 Sharks
Titans 10 - 30 Storm
Cowboys 18 - 19 Knights
Bulldogs 23 - 22 Tigers
Sea Eagles 30 - 12 Eels
Raiders 40 - 31 Roosters
Bye: Rabbitohs

Round 15 (Women in League Round):
Broncos 48 - 16 Titans
Knights 26 - 16 Sea Eagles
Bulldogs 14 - 16 Panthers
Tigers 42 - 22 Dragons
Sharks 20 - 36 Cowboys
Storm 24 - 16 Rabbitohs
Dolphins 32 - 22 Raiders
Eels 22 - 25 Roosters
Bye: Warriors

Round 16:
Tigers 22 - 18 Rabbitohs
Titans 42 - 34 Panthers
Cowboys 28 - 18 Dolphins
Raiders 24 - 12 Bulldogs
Sharks 12 - 46 Eels
Roosters 36 - 34 Sea Eagles
Broncos 48 - 28 Dragons
Warriors 20 - 24 Storm
Bye: Knights

Round 17:
Panthers 16 - 38 Cowboys
Sea Eagles 10 - 30 Tigers
Broncos 48 - 4 Eels
Bulldogs 29 - 28 Titans
Storm 56 - 12 Knights
Rabbitohs 22 - 28 Sharks
Warriors 0 - 44 Roosters
Dragons 24 - 20 Dolphins
Bye: Raiders

Round 18:
Storm 22 - 24 Bulldogs
Dolphins 19 - 18 Tigers
Panthers 28 - 30 Roosters
Titans 90 - 6 Warriors
Cowboys 16 - 38 Sea Eagles
Sharks 26 - 24 Broncos
Rabbitohs 32 - 30 Dragons
Knights 20 - 24 Raiders
Bye: Eels

Q/E Finals:
Storm 12 - 29 Broncos
Raiders 22 - 18 Bulldogs
Titans 36 - 12 Roosters
Eels 14 - 12 Panthers

Semi Finals:
Storm 42 - 6 Titans
Bulldogs 26 - 27 Eels

Preliminary Finals:
Raiders 30 - 24 Storm
Broncos 12 - 8 Eels

Grand Final:
Raiders 40 - 12 Broncos
`
},

13: {
  byePoints: 2,
  venues: {
    PEN: ["CommBank Stadium, Sydney"]
  },
  rounds: {
    "Round 1":  { days: ["Sunday","Sunday","Thursday","Friday","Friday","Saturday","Saturday","Sunday"] },
    "Round 6":  { days: ["Thursday","Thursday","Thursday","Friday","Saturday","Saturday","Sunday","Sunday"] },
    "Round 7":  { days: ["Thursday","Friday","Saturday","Sunday"] },
    "Round 8":  { days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] },
    "Round 9":  { venue: "Suncorp Stadium, Brisbane",
                  days: ["Thursday","Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday"] },
    "Round 13": { days: ["Thursday","Friday","Saturday","Sunday"] },
    "Round 14": { days: ["Friday","Friday","Saturday","Saturday","Saturday","Sunday","Sunday","Sunday"] },
    "Finals Week 2": { days: ["Saturday","Sunday"] },
    "Finals Week 3": { days: ["Saturday","Sunday"] }
  },
  gameVenues: `
Rd1 GLD V DOL - Allegiant Stadium, Las Vegas
Rd1 SOU V MEL - Allegiant Stadium, Las Vegas
Rd2 PEN V DOL - Carrington Park, Bathurst
Rd2 WST V SOU - Campbelltown Sports Stadium, Sydney
Rd3 SOU V MAN - Allianz Stadium, Sydney
Rd4 SGI V NQL - St George Venues Jubilee Stadium, Kogarah
Rd4 DOL V WST - Kayo Stadium, Redcliffe
Rd5 WST V WAR - Campbelltown Sports Stadium, Sydney
Rd5 SGI V CRO - St George Venues Jubilee Stadium, Kogarah
Rd6 CBY V SGI - Allianz Stadium, Sydney
Rd6 WAR V PEN - Hnry Stadium, Wellington
Rd8 PAR V CAN - Optus Stadium, Perth
Rd8 MEL V CRO - Optus Stadium, Perth
Rd11 NEW V SOU - HBF Park, Perth
Rd11 DOL V SGI - TIO Stadium, Darwin
Rd12 SGI V WAR - St George Venues Jubilee Stadium, Kogarah
Rd12 SOU V PEN - Allianz Stadium, Sydney
Rd13 WST V CAN - Campbelltown Sports Stadium, Sydney
Rd14 PEN V NEW - Glen Willow Oval, Mudgee
Rd14 WST V SGI - CommBank Stadium, Sydney
Rd15 WST V MAN - CommBank Stadium, Sydney
Rd15 SOU V PAR - Allianz Stadium, Sydney
Rd15 WAR V MEL - Apollo Projects Stadium, Christchurch
Rd18 DOL V WAR - Kayo Stadium, Redcliffe
`,
  results: `
Round 1:
Titans 29 - 12 Dolphins
Rabbitohs 14 - 12 Storm
Raiders 34 - 24 Broncos
Warriors 32 - 0 Bulldogs
Roosters 28 - 29 Panthers
Sharks 30 - 6 Eels
Sea Eagles 20 - 21 Knights
Tigers 32 - 28 Cowboys
Bye: Dragons

Round 2:
Dragons 12 - 48 Raiders
Warriors 40 - 30 Knights
Storm 24 - 30 Broncos
Titans 6 - 44 Bulldogs
Sharks 24 - 18 Roosters
Panthers 52 - 12 Dolphins
Sea Eagles 38 - 16 Cowboys
Tigers 18 - 16 Rabbitohs
Bye: Eels

Round 3 (Multicultural Round):
Bulldogs 6 - 40 Panthers
Cowboys 12 - 62 Warriors
Rabbitohs 24 - 12 Sea Eagles
Knights 42 - 16 Titans
Broncos 22 - 6 Tigers
Roosters 6 - 19 Eels
Dolphins 28 - 26 Sharks
Storm 31 - 6 Dragons
Bye: Raiders

Round 4:
Sea Eagles 25 - 24 Roosters
Sharks 44 - 12 Titans
Rabbitohs 24 - 18 Broncos
Eels 16 - 18 Warriors
Dragons 18 - 50 Cowboys
Storm 28 - 14 Bulldogs
Raiders 14 - 12 Knights
Dolphins 54 - 18 Tigers
Bye: Panthers

Round 5:
Broncos 35 - 6 Eels
Tigers 44 - 6 Warriors
Roosters 24 - 25 Rabbitohs
Bulldogs 24 - 48 Knights
Dragons 34 - 12 Sharks
Cowboys 22 - 40 Dolphins
Titans 16 - 30 Storm
Panthers 34 - 6 Raiders
Bye: Sea Eagles

Round 6 (Anzac Round):
Bulldogs 24 - 26 Dragons
Warriors 10 - 22 Panthers
Storm 18 - 20 Roosters
Sharks 16 - 26 Sea Eagles
Raiders 0 - 42 Dolphins
Cowboys 24 - 16 Rabbitohs
Knights 31 - 16 Broncos
Eels 18 - 37 Tigers
Bye: Titans

Round 7:
Dragons 6 - 52 Sea Eagles
Cowboys 42 - 18 Panthers
Rabbitohs 28 - 8 Titans
Broncos 14 - 18 Warriors
Bye: Raiders, Bulldogs, Sharks, Dolphins, Storm, Knights, Eels, Roosters, Tigers

Round 8:
Roosters 19 - 16 Dragons
Dolphins 32 - 26 Broncos
Eels 34 - 16 Raiders
Storm 6 - 18 Sharks
Sea Eagles 42 - 22 Titans
Knights 30 - 32 Cowboys
Rabbitohs 12 - 16 Bulldogs
Panthers 38 - 12 Tigers
Bye: Warriors

Round 9 (Magic Round):
Sharks 6 - 46 Raiders
Dolphins 20 - 18 Rabbitohs
Warriors 20 - 18 Sea Eagles
Bulldogs 16 - 30 Cowboys
Panthers 16 - 34 Storm
Titans 19 - 18 Tigers
Roosters 14 - 0 Broncos
Dragons 28 - 30 Eels
Bye: Knights

Round 10:
Raiders 24 - 10 Bulldogs
Dragons 38 - 46 Knights
Broncos 10 - 14 Cowboys
Panthers 18 - 20 Titans
Storm 8 - 28 Dolphins
Sharks 22 - 19 Warriors
Eels 42 - 46 Sea Eagles
Tigers 30 - 31 Roosters
Bye: Rabbitohs

Round 11:
Bulldogs 32 - 28 Broncos
Raiders 16 - 18 Roosters
Eels 10 - 30 Storm
Knights 26 - 0 Rabbitohs
Tigers 12 - 32 Sharks
Dolphins 72 - 0 Dragons
Warriors 34 - 8 Titans
Sea Eagles 18 - 32 Panthers
Bye: Cowboys

Round 12 (Indigenous Round):
Cowboys 10 - 36 Sharks
Sea Eagles 12 - 32 Raiders
Roosters 40 - 6 Bulldogs
Dragons 30 - 34 Warriors
Titans 22 - 14 Broncos
Rabbitohs 25 - 13 Panthers
Storm 19 - 12 Tigers
Knights 44 - 18 Eels
Bye: Dolphins

Round 13:
Dolphins 24 - 22 Roosters
Bulldogs 20 - 12 Eels
Tigers 13 - 30 Raiders
Knights 46 - 18 Sharks
Bye: Broncos, Titans, Sea Eagles, Storm, Warriors, Cowboys, Panthers, Rabbitohs, Dragons

Round 14:
Eels 6 - 28 Dolphins
Raiders 18 - 20 Storm
Panthers 24 - 26 Knights
Sharks 28 - 20 Bulldogs
Tigers 28 - 46 Dragons
Warriors 16 - 38 Rabbitohs
Broncos 12 - 40 Sea Eagles
Cowboys 22 - 12 Titans
Bye: Roosters

Round 15 (Women in League Round):
Knights 25 - 24 Dolphins
Panthers 42 - 4 Dragons
Broncos 43 - 12 Sharks
Titans 40 - 24 Raiders
Tigers 52 - 12 Sea Eagles
Rabbitohs 18 - 16 Eels
Roosters 28 - 38 Cowboys
Warriors 50 - 16 Storm
Bye: Bulldogs

Round 16:
Dolphins 56 - 18 Bulldogs
Raiders 32 - 14 Warriors
Sea Eagles 42 - 12 Storm
Eels 10 - 10 Cowboys
Rabbitohs 20 - 18 Sharks
Titans 12 - 14 Dragons
Roosters 6 - 56 Knights
Broncos 42 - 6 Panthers
Bye: Tigers

Round 17:
Dragons 28 - 36 Rabbitohs
Warriors 32 - 0 Roosters
Bulldogs 18 - 34 Tigers
Sea Eagles 20 - 22 Dolphins
Cowboys 16 - 44 Raiders
Eels 22 - 24 Titans
Storm 16 - 17 Knights
Sharks 25 - 24 Panthers
Bye: Broncos

Round 18:
Broncos 30 - 18 Dragons
Titans 12 - 28 Roosters
Cowboys 24 - 34 Storm
Raiders 40 - 0 Rabbitohs
Panthers 38 - 30 Eels
Bulldogs 14 - 16 Sea Eagles
Dolphins 48 - 12 Warriors
Knights 6 - 12 Tigers
Bye: Sharks

Finals Week 1:
Rabbitohs 6 - 24 Sharks - Allianz Stadium, Sydney
Dolphins 32 - 16 Warriors
Panthers 16 - 18 Sea Eagles - CommBank Stadium, Sydney
Knights 18 - 14 Raiders

Semi Finals:
Raiders 32 - 22 Sea Eagles
Warriors 32 - 40 Sharks - Eden Park, Auckland

Preliminary Finals:
Dolphins 18 - 20 Raiders
Knights 30 - 4 Sharks

Grand Final:
Knights 10 - 16 Raiders
`
}

};
