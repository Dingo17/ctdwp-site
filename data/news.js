/* =========================================================
   NEWS — newest first. The first article is the big story at the top
   of the home and news pages, the next two sit beside it.

   { id, tag, date (YYYY-MM-DD), title, summary,
     image   : a picture for the card/top of the article (optional)
     poster  : true = show the whole image in the article, not cropped
     art     : { logos:[team codes], bg:"#colour" or "img/..." } — a logo
               card used when there's no image
     body    : [ paragraphs ] }

   In the body:  "## Heading"  makes a subheading,
                 **bold**,  [link text](#match-draw-13-21-0) for links.
   ========================================================= */
window.NEWS_DATA = [

{ id:"dingobet-launch", tag:"Dingobet", date:"2026-11-11",
  title:"Dingobet opens: back your team with Dingo Dollars",
  summary:"Odds on every game of the round, season futures, Same Game Multis and a leaderboard of computer punters. Just for fun, with no real money.",
  art:{ logos:["AUS","TON"], bg:"#050505" },
  body:[
  "Dingobet, one of the competition's major partners, now has its own home on the site. Head to the [Dingobet](#dingobet) tab to bet virtual Dingo Dollars on every game of the current round. It's just for fun: there's no real money involved.",
  "## How it works",
  "Everyone starts with D$1,000 and can claim a free D$100 every day. The odds are generated automatically from the competition's results, with every game simulated 20,000 times. They're priced the way Sportsbet prices the NRL: an even game is $1.90 a side, and the line and total points are set at $1.90 each way.",
  "## What you can bet on",
  "Every game in the round has head to head, line, total points, winning margin, tri-bet, team points and more, and you can combine picks into multis and Same Game Multis. Futures cover the Season 14 Premiership (premiers, minor premiers, top 8, top 4, wooden spoon, season wins and Grand Final quinellas), the Season 14 Origin series and the International Series tournaments.",
  "## Beat the computer punters",
  "The leaderboard pits you against five computer punters, each sticking to one strategy: Mug Punter Mick, Roughie Rhonda, Home Ground Harry, Line Lucy and Over Ollie. Bets settle themselves as soon as results are added, and there are badges to unlock along the way.",
  "The [Season Simulator](#dingobet-sim) runs 10,000 simulated Season 14s to show where every club is projected to finish. The Dingobet odds on the [Draw](#drawhome) page now link straight to each game's markets."
  ]},

{ id:"s14-round-1-fixtures", tag:"Draw", date:"2026-11-11",
  title:"Grand Final rematch opens Season 14 as the Premiership heads to Tokyo, Manchester and Las Vegas",
  summary:"Round 1 is locked in: nine games, four of them overseas, and the Bears are back.",
  image:"img/news/s14-r1-fixtures.webp", poster:true, imagePos:"center 8%",
  body:[
  "Season 14 starts where Season 13 finished. Back-to-back premiers Canberra host Newcastle at GIO Stadium on Thursday night at 8:00pm, a rematch of the Grand Final the Raiders won 16-10.",
  "Four of the nine Round 1 games are played overseas, and the Perth Bears are back in the Premiership for the first time since Season 10. That makes a full 18-team competition, with nine games each round and no bye.",
  "## The international games",
  "**Storm v Bulldogs** – Saturday 7:30pm, MUFG Stadium, Tokyo.",
  "**Roosters v Broncos** – Saturday 11:00pm, Old Trafford, Manchester. It's a late one for the east coast. Both of the Raiders' departing premiership stars will be on the field: Xavier Savage for the Roosters and Jahrome Hughes for the Broncos.",
  "**Cowboys v Sea Eagles** – Sunday 1:15pm, Allegiant Stadium, Las Vegas.",
  "**Eels v Sharks** – Sunday 3:30pm, Allegiant Stadium, Las Vegas. This is the second half of the Vegas double-header. Tom Hazelton and Sam Tuivaiti swapped clubs in the Player Pool and will face their old teammates straight away.",
  "## At home",
  "**Raiders v Knights** – Thursday 8:00pm, GIO Stadium, Canberra. It's the Grand Final rematch. Peter Hola, picked up from Newcastle in the Player Pool, could line up against his old club in his first game for the premiers.",
  "**Dolphins v Dragons** – Friday 8:00pm, Suncorp Stadium, Brisbane. The minor premiers beat the Dragons 72-0 in Round 11 last season, the biggest win of Season 13. Tevita Naufahu has gone from the Dolphins to the Dragons since then.",
  "**Warriors v Wests Tigers** – Saturday 5:30pm, Eden Park, Auckland.",
  "**Panthers v Titans** – Saturday 7:35pm, HelloWorld Stadium, Penrith. Lachlan Ilias starts his Panthers career against the Titans, the club he just left.",
  "**Bears v Rabbitohs** – Sunday 4:05pm, Optus Stadium, Perth. The Bears' first game back.",
  "## What's next",
  "Only Round 1 has been released so far. The full Season 14 draw will be added to the [Draw](#drawhome) page once every round is confirmed. In the meantime, the International Series is under way."
  ]},

{ id:"intl-series-13-round-1", tag:"International", date:"2026-11-10",
  title:"International Series Round 1: Kangaroos host Tonga as the rankings go live",
  summary:"Season 13's internationals kick off this weekend, and for the first time every result moves the IRL rankings.",
  art:{ logos:["AUS","TON"], bg:"#0b0b0b" },
  body:[
  "The Season 13 International Series starts this weekend with the Four Nations and the Pacific Championship. For the first time, every result feeds straight into the [IRL rankings](#rankings-13).",
  "## Four Nations",
  "**Kangaroos v Tonga** – Friday 8:10pm, Suncorp Stadium, Brisbane. Australia are $1.45 and Tonga $3.00. This one carries real ranking stakes: second-ranked Australia (87.91) lead third-ranked Tonga (87.05) by less than a point, so **any Tonga win would lift them above the Kangaroos into second**. A Kangaroos win is worth about 0.9 rating points, or about 1.4 if they win by more than 12.",
  "**Kiwis v England** – Saturday 6:10pm, Go Media Stadium, Auckland. New Zealand are $1.35 and England $3.50. The reigning world champions are almost 10 points clear of England. Because of that gap, a Kiwis win barely moves the rankings, but an England win would be worth close to 2 points, or nearly 3 by more than 12.",
  "## Pacific Championship",
  "**Samoa v Cook Islands** – Sunday 2:00pm, HFC Bank Stadium, Suva. Samoa are heavy favourites at $1.03, with the Cook Islands at $24.00. The ratings gap is so big that Samoa gain **nothing** for winning. A Cook Islands upset would be worth 2 to 3 points.",
  "**Fiji v PNG** – Sunday 4:05pm, HFC Bank Stadium, Suva. Fiji are $1.70 and PNG $2.10. Sixth plays seventh, and only 0.01 points separate them, so the winner holds sixth.",
  "## Team lists are in",
  "Team lists for all four games are now in each [match centre](#match-intl-13-0-0), alongside the odds, the ranking points at stake, form and the head-to-head record. You can find the full schedule on the [International Series draw](#intl-13)."
  ]},

{ id:"player-pool-13", tag:"Player Pool", date:"2026-11-08",
  title:"Player Pool: premiers lose Hughes and Savage as 30 players change clubs",
  summary:"The Season 13 Player Pool is done. Here's who moved, who stayed and which clubs were hit hardest.",
  art:{ logos:["BRI","CAN","SYD"], bg:"#111" },
  body:[
  "The Season 13 Player Pool is complete. Over two rounds, 17 clubs made 34 picks: 30 players moved clubs and 4 were retained. All moves take effect from Season 14.",
  "## Premiers pay the price",
  "Canberra were hit hardest. The Broncos used the first pick of the pool on Jahrome Hughes, fresh from winning the Clive Churchill Medal in the Grand Final. The Roosters then took Xavier Savage, the Season 12 top try scorer. The Raiders replaced them with Peter Hola from the Knights and Izack Tago from the Panthers.",
  "## Straight swaps",
  "The Sharks and Eels effectively traded players, with Sam Tuivaiti going to Cronulla and Tom Hazelton to Parramatta. They meet in Las Vegas in Round 1.",
  "## The four who stayed",
  "Four clubs used a pick to keep one of their own: Euan Aitken (Rabbitohs), Jacob Saifiti (Titans), Tony Sukkar (Storm) and Leka Halasima (Warriors).",
  "## Every pick",
  "The [Player Pool](#pool-13) page has every pick, a ledger of who each club gained and lost, the most-raided clubs and a summary for each club."
  ]},

{ id:"season-13-review", tag:"Season Review", date:"2026-11-05",
  title:"Season 13 in review: Dolphins' first minor premiership, and Fletcher Sharpe's huge year",
  summary:"A first minor premiership, a 72-0 thrashing, a Sharks finals run and a shared Dally M.",
  art:{ logos:["DOL","NEW"], bg:"#0b0b0b" },
  body:[
  "Season 13 had a new minor premier and a long finals run from eighth. Here's a look back at the regular season.",
  "## Dolphins on top",
  "The Dolphins won their first minor premiership, finishing 13-3 with 542 points scored and 302 conceded, a differential of +240. Their biggest day was a 72-0 win over the Dragons in Round 11, the largest margin of the season. Jamayne Isaako topped the season's point-scoring with 198.",
  "The Knights were two points behind in second (12-4). The Raiders, Warriors and Rabbitohs all finished 10-6, separated only by points differential.",
  "## The race for eighth",
  "The Panthers, Sea Eagles and Sharks were all level on 22 points in sixth to eighth. The Cowboys missed out by one point after a draw left them 8-1-7.",
  "Cronulla made the most of eighth spot. They won 24-6 away at the Rabbitohs and 40-32 against the Warriors at Eden Park before the Knights ended their run 30-4 in the preliminary final.",
  "## At the bottom",
  "The Eels took the wooden spoon with three wins and a draw from 16 games. The Dragons conceded 566 points, the most of any team.",
  "## Sharpe's season",
  "Knight Fletcher Sharpe shared the Dally M Medal with Rabbitoh Nathan Cleary, both on 28 points. Sharpe was also the top try scorer with 24 and won the Wally Lewis Medal in the Blues' Origin series win. Sea Eagle Ativalu Lisati was named Rookie of the Season.",
  "You can see the full [Season 13 ladder](#ladder-13) and every honour on the [Records](#records) page."
  ]},

{ id:"grand-final-13", tag:"Grand Final", date:"2026-11-02",
  title:"Raiders go back-to-back: Canberra beat Knights 16-10 to defend the title",
  summary:"Canberra reversed their qualifying final loss to Newcastle at Accor Stadium, and Jahrome Hughes made Clive Churchill history.",
  image:"img/gf-bg.webp", art:{ logos:["CAN"] },
  body:[
  "The Canberra Raiders are premiers again. They beat the Newcastle Knights 16-10 in the [Season 13 Grand Final](#match-draw-13-21-0) at Accor Stadium to become only the second club to win back-to-back titles, after the Rabbitohs in Seasons 7 and 8.",
  "## The long way round",
  "The Raiders finished third and had to go the long way. Newcastle beat them 18-14 in a qualifying final, sending Canberra to a home semi, where they beat the Sea Eagles 32-22. They then won 20-18 against the minor premiers in Brisbane and returned to Accor Stadium to reverse the result against the Knights.",
  "## Hughes makes history",
  "Jahrome Hughes won the Clive Churchill Medal, his third after wins with the Storm in Seasons 1 and 5. No other player has won it more than twice. It was also his last game for the Raiders, after the Broncos picked him first in the Player Pool.",
  "## Knights fall one short",
  "Newcastle reached their first Grand Final after a 30-4 preliminary final win over the Sharks, but couldn't finish the job. They get an early chance at revenge, with the two clubs meeting again in Round 1 of Season 14 in Canberra.",
  "Canberra now have two premierships, level with the Sea Eagles and one behind the Storm and Rabbitohs, who have three each."
  ]},

{ id:"origin-13", tag:"State of Origin", date:"2026-07-15",
  title:"Blues make it five straight with a 25-22 decider win",
  summary:"New South Wales won the third game to take the Season 13 series 2-1.",
  art:{ logos:["NSW","QLD"], bg:"#0b0b0b" },
  body:[
  "New South Wales have won their fifth straight State of Origin series. A 25-22 win in [Game 3](#match-origin-13-0-2) settled the Season 13 series 2-1.",
  "The Blues won Game 1 26-18 at home. Queensland levelled the series with a 24-12 win at the Melbourne Cricket Ground, which set up the decider. With Queensland at home, NSW won it by three points.",
  "Fletcher Sharpe was named the Wally Lewis Medallist as player of the series.",
  "NSW have now won 10 of the 12 Origin series played, with Queensland's only series wins coming in Seasons 7 and 8. You can see every result on the [State of Origin](#origin-13) page."
  ]},

{ id:"wcc-13", tag:"World Club Challenge", date:"2026-03-01",
  title:"Wigan beat the Raiders for Super League's first World Club Challenge win",
  summary:"Wigan beat the Premiership champions 20-14 at The Brick Community Stadium.",
  art:{ logos:["WIG","CAN"], bg:"#0b0b0b" },
  body:[
  "Wigan have won the World Club Challenge. They beat the Canberra Raiders [20-14](#match-wcc-13-0-0) at The Brick Community Stadium.",
  "It's the first win for a Super League club in the competition. Premiership sides had won the four previous editions: Storm, Sea Eagles, Rabbitohs and Roosters. Wigan themselves lost 28-18 to the Roosters at home in Season 10.",
  "The Raiders' season went much better from there, finishing with their second straight premiership."
  ]},

{ id:"allstars-13", tag:"All Stars", date:"2026-02-15",
  title:"Māori All Stars square the ledger with a 32-24 win in Sydney",
  summary:"The Māori side beat the Indigenous All Stars at Accor Stadium, leaving the rivalry level at 2-2.",
  art:{ logos:["MAO","IND"], bg:"#ececec", light:true },
  body:[
  "The Māori All Stars beat the Indigenous All Stars [32-24](#match-allstars-13-0-0) at Accor Stadium in Sydney.",
  "That levels the series at two wins each. The Indigenous side won in Seasons 7 and 12, and the Māori in Seasons 11 and 13.",
  "Every result is on the [All Stars](#allstars-13) page."
  ]}

];
