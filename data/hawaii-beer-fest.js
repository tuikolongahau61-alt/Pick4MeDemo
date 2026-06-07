/* Hawaii Beer Fest 2026 — experience config for the Brilla engine.
   Everything that makes this event unique lives here. The engine is generic. */
Brilla.register({
  id: "hawaii-beer-fest",

  theme: { bg:"#140d29", bg2:"#1d1340", a1:"#ff6b5c", a2:"#ff9f1c", a3:"#ffd23f",
           accent:"#ff9f1c", inkOn:"#2a1300", hi:"#ffd23f" },

  brand: { name:"Hawaii Beer Fest", byline:"tasting guide · by Brilla", pill:"21+ · Jun 27" },

  nouns: { vendor:"booth", vendorPlural:"Vendors", product:"beer", productPlural:"Pours",
           catalogTitle:"Vendor Directory", stop:"Stop", stopPlural:"Stops",
           planTitle:"My Festival Plan", planNoun:"My Plan",
           searchPlaceholder:"Search breweries, beers, or styles…" },

  features: { vendors:true, map:true },

  categories: {
    local:    { label:"Local Hawaii",      color:"#1ec8b6" },
    mainland: { label:"Mainland craft",    color:"#8c7bff" },
    import:   { label:"Import",            color:"#ffd23f" },
    variety:  { label:"Seltzer & variety", color:"#ff6b5c" },
    cider:    { label:"Cider",             color:"#5ed17a" }
  },

  home: {
    kicker:"7th Annual · Bishop Museum Great Lawn",
    title:["Too many beers.","Find your pour."],
    sub:"100+ craft beers, ciders & seltzers in one night. We'll point you to the three you shouldn't miss.",
    facts:[ {icon:"calendar",label:"Sat, Jun 27, 2026"}, {icon:"pin",label:"Honolulu, HI"}, {icon:"clock",label:"5–9 PM"} ],
    stats:[ {value:"100+",label:"Beers, ciders & seltzers"}, {value:"40+",label:"Breweries pouring"}, {value:"9",label:"Food trucks"} ],
    decide:{ heading:"Not sure where to start?",
      body:"Answer 5 quick questions and we'll build your tasting plan — so you spend the night drinking, not deciding.",
      primary:"Help Me Decide", secondary:"Browse Vendors", timehint:"About 30 seconds · 5 quick taps · no sign-up" },
    how:[
      {title:"Tell us your taste", body:"Five taps about what you like and how adventurous you're feeling."},
      {title:"Get your Top 3 Stops", body:"Specific beers at specific booths — with why each one fits you."},
      {title:"Build your festival plan", body:"Save your picks and follow the map. Done deciding, start tasting."}
    ],
    lineupTitle:"This year's lineup",
    lineupBlurb:"Local Hawaii brewers, mainland craft legends, world-class imports, ciders & seltzers — all in one lawn.",
    directoryFoot:"Booths & pours are illustrative for this concept demo.",
    disclaimer:"Independent concept demo created by Brilla to explore how festival-goers could decide what to try. Not an official Hawaii Beer Fest app. Breweries, beers & details are illustrative and subject to change. Please drink responsibly — 21+.",
    footTagline:"The recommendation is the product."
  },

  results:{ eyebrow:"Your festival game plan" },

  scoring:{ primaryStyleKey:"style", openValue:"open", styleBonus:4, jitterKey:"adventure", jitterValues:["surprise"] },

  summary:{ prefix:"Based on your taste — ", suffix:" — here's where we'd start.", fallback:"Here's where we'd start.",
    parts:[
      {key:"style", map:{ipa:"you're into IPAs", lager:"you're into lagers", sour:"you're into sours", stout:"you're into stouts", cider:"you're into cider", seltzer:"you like easy sippers"}},
      {key:"mood",  map:{crisp:"feeling crisp & refreshing", hoppy:"feeling hoppy & bold", fruity:"feeling fruity & tart", roasty:"feeling rich & roasty", light:"feeling light & easy"}},
      {key:"goal",  map:{local:"chasing local favorites", unique:"after unique flavors", award:"hunting award-winners", easy:"keeping it easy", strong:"going strong"}}
    ] },

  quiz:[
    { key:"experience", eyebrow:"Your taste", q:"How well do you know craft beer?", desc:"No wrong answer — it just helps us calibrate.",
      options:[
        {value:"new",   emoji:"🌱", label:"New to it",       desc:"Keep it smooth and easy", w:{easy:3,light:2,smooth:2,refreshing:1,popular:1,strong:-3,sour:-2,hoppy:-1,complex:-1}},
        {value:"casual",emoji:"🍺", label:"Casual drinker",  desc:"I know what I like",      w:{easy:2,refreshing:2,popular:1,light:1,smooth:1}},
        {value:"into",  emoji:"🍻", label:"Pretty into it",  desc:"Bring on the good stuff", w:{hoppy:1,local:1,unique:1,bold:1,ipa:1}},
        {value:"nerd",  emoji:"🤓", label:"Beer nerd",       desc:"Show me the rare & wild", w:{unique:2,complex:2,bold:1,adventurous:1,award_winning:1,strong:1}}
      ]},
    { key:"style", eyebrow:"Go-to pour", q:"What do you usually drink?", desc:"Pick the one that feels most like you.",
      options:[
        {value:"ipa",    emoji:"🌿", label:"IPA",                      desc:"Hoppy & aromatic",      w:{ipa:4,hoppy:2,citrus:1}},
        {value:"lager",  emoji:"🍺", label:"Lager / Pilsner",          desc:"Crisp & clean",         w:{lager:4,crisp:2,light:1,pilsner:1}},
        {value:"sour",   emoji:"🍋", label:"Sour",                     desc:"Tart & funky",          w:{sour:4,tart:2,fruity:1}},
        {value:"stout",  emoji:"☕", label:"Stout / Porter",           desc:"Dark & roasty",         w:{stout:4,porter:2,roasty:2,malty:1}},
        {value:"cider",  emoji:"🍏", label:"Cider",                    desc:"Fruity & gluten-free",  w:{cider:4,fruity:2,sweet:1,refreshing:1,gluten_free:1}},
        {value:"seltzer",emoji:"🥤", label:"Seltzer / something easy", desc:"Light & sippable",      w:{seltzer:3,light:2,easy:2,refreshing:2,fruity:1}},
        {value:"open",   emoji:"🤷", label:"I don't know",             desc:"Surprise me",           w:{popular:2,easy:1,local:1}}
      ]},
    { key:"mood", eyebrow:"Right now", q:"What sounds best right now?", desc:"Go with your gut.",
      options:[
        {value:"crisp", emoji:"💧", label:"Crisp & refreshing", w:{crisp:3,refreshing:3,light:2,lager:1,pilsner:1,seltzer:1}, mood:"crisp & refreshing", matchTags:["crisp","refreshing","light"]},
        {value:"hoppy", emoji:"🌶️", label:"Hoppy & bold",       w:{hoppy:3,bold:2,ipa:2,citrus:1}, mood:"hoppy & bold", matchTags:["hoppy","bold","ipa"]},
        {value:"fruity",emoji:"🍓", label:"Fruity & tart",      w:{fruity:3,tart:2,tropical:1,sour:1,refreshing:1}, mood:"fruity & tart", matchTags:["fruity","tart","tropical","sour"]},
        {value:"roasty",emoji:"🍫", label:"Rich & roasty",      w:{roasty:3,malty:2,stout:2,porter:1,bold:1,chocolate:1,coffee:1}, mood:"rich & roasty", matchTags:["roasty","malty","stout","porter"]},
        {value:"light", emoji:"🌤️", label:"Light & easy",       w:{light:3,easy:3,sessionable:2,smooth:1}, mood:"light & easy", matchTags:["light","easy","sessionable","smooth"]}
      ]},
    { key:"adventure", eyebrow:"Your style", q:"How adventurous are you feeling?", desc:"We'll dial the picks up or down.",
      options:[
        {value:"safe",    emoji:"🛟", label:"Play it safe",            desc:"Crowd-pleasers, please", w:{classic:2,popular:2,easy:1,familiar:1,unique:-2,adventurous:-2,sour:-2,strong:-2,complex:-1}},
        {value:"mid",     emoji:"⚖️", label:"Somewhere in the middle", desc:"A little of both",       w:{balanced:1,popular:1}},
        {value:"surprise",emoji:"🎲", label:"Surprise me",            desc:"Push my limits",         w:{unique:3,adventurous:3,bold:1,complex:1}}
      ]},
    { key:"goal", eyebrow:"Tonight's mission", q:"What are you hoping to discover today?", desc:"This shapes your Top 3.",
      options:[
        {value:"local", emoji:"🌺", label:"Local Hawaii favorites", w:{local:4,signature:1}},
        {value:"unique",emoji:"✨", label:"Unique flavors",         w:{unique:3,adventurous:2,complex:1}},
        {value:"award", emoji:"🏆", label:"Award-winning beers",    w:{award_winning:4,signature:2,classic:1}},
        {value:"easy",  emoji:"😎", label:"Easy drinking",          w:{easy:3,light:2,sessionable:2,refreshing:1,smooth:1}},
        {value:"strong",emoji:"🔥", label:"Something strong",       w:{strong:4,bold:2,complex:1}}
      ]}
  ],

  reasonRules:[
    {answerKey:"style", answerIn:["ipa"],   tag:"ipa",   text:"You said IPAs are your go-to — this one's a standout."},
    {answerKey:"style", answerIn:["lager"], tag:"lager", text:"A crisp lager, right in line with what you usually drink."},
    {answerKey:"style", answerIn:["sour"],  tag:"sour",  text:"Tart and funky, just like the sours you love."},
    {answerKey:"style", answerIn:["stout"], tag:"stout", text:"Dark and roasty — your kind of pour."},
    {answerKey:"style", answerIn:["cider"], tag:"cider", text:"A fruit-forward cider, exactly your lane."},
    {answerKey:"style", answerIn:["seltzer"],tag:"seltzer",text:"Light and easy, the kind of sipper you reached for."},
    {type:"option-tags", answerKey:"mood",  text:"Matches your “{label}” mood right now."},
    {answerKey:"goal", answerIn:["local"],  tag:"local",         text:"A local Hawaii favorite — brewed right here in the islands."},
    {answerKey:"goal", answerIn:["award"],  tag:"award_winning", text:"Award-winning and worth seeking out."},
    {answerKey:"goal", answerIn:["strong"], tag:"strong",        text:"Big, bold and strong — exactly what you asked for."},
    {answerKey:"adventure", answerIn:["surprise"], tag:"unique", text:"A little off the beaten path — fun to discover."},
    {answerKey:"goal", answerIn:["unique"], tag:"unique",        text:"A little off the beaten path — fun to discover."},
    {answerKey:"goal", answerIn:["easy"],   tag:"easy",          text:"Smooth and easy-drinking — a reliable crowd-pleaser."},
    {answerKey:"experience", answerIn:["new","casual"], tag:"easy", text:"Smooth and easy-drinking — a reliable crowd-pleaser."}
  ],
  fallbackReason:"A strong match for the taste you described.",

  map:{ title:"Festival Map",
    note:"Bishop Museum Great Lawn. Tap a numbered booth to see what's pouring. Your saved stops glow gold.",
    bg1:"#16332a", bg2:"#0f241d",
    zones:[
      {shape:"rect", x:95,  y:14,  w:110, h:30, label:"MAIN STAGE", fill:"#2a1c12", stroke:"#ff9f1c", labelColor:"#ffd23f"},
      {shape:"rect", x:12,  y:300, w:58,  h:86, label:"FOOD",       fill:"#241a33", stroke:"#8c7bff", labelColor:"#cdbcff"},
      {shape:"rect", x:110, y:372, w:80,  h:22, label:"ENTRANCE",   fill:"#12241d", stroke:"#1ec8b6", labelColor:"#7fe9dc"},
      {shape:"circle", x:245, y:335, r:13, label:"H₂O",             fill:"#10243a", stroke:"#2bb4ff", labelColor:"#9ad6ff"}
    ] },

  vendors:[
    {id:"kona", name:"Kona Brewing Co.", cat:"local", origin:"Big Island", loc:1, x:22, y:17,
     blurb:"Hawaii's iconic island brewery — sunshine in a glass since 1994.",
     products:[
       {name:"Big Wave Golden Ale", style:"Golden Ale", abv:4.4, tags:["light","easy","smooth","refreshing","tropical","local","popular","classic"]},
       {name:"Longboard Island Lager", style:"Helles Lager", abv:4.6, tags:["lager","crisp","light","refreshing","easy","local","classic","popular"]},
       {name:"Hanalei Island IPA", style:"Fruited IPA", abv:4.5, tags:["ipa","fruity","tropical","citrus","refreshing","local","easy"]}
     ]},
    {id:"maui", name:"Maui Brewing Co.", cat:"local", origin:"Maui", loc:2, x:43, y:14,
     blurb:"Bold island flavors brewed on the Valley Isle.",
     products:[
       {name:"Bikini Blonde Lager", style:"Helles Lager", abv:5.1, tags:["lager","crisp","smooth","light","easy","local","classic"]},
       {name:"Coconut Hiwa Porter", style:"Toasted-Coconut Porter", abv:6.0, tags:["stout","porter","roasty","malty","bold","local","unique","signature"]},
       {name:"Big Swell IPA", style:"IPA", abv:6.8, tags:["ipa","hoppy","citrus","bold","local"]}
     ]},
    {id:"aloha", name:"Aloha Beer Co.", cat:"local", origin:"Oahu · Kakaako", loc:3, x:64, y:18,
     blurb:"Honolulu's hometown brewery and beer garden.",
     products:[
       {name:"Aloha Lager", style:"Pale Lager", abv:5.0, tags:["lager","crisp","easy","light","local","classic"]},
       {name:"Cocoweizen", style:"Chocolate Hefeweizen", abv:5.5, tags:["wheat","sweet","smooth","chocolate","unique","local","signature"]},
       {name:"Hop Lei IPA", style:"IPA", abv:6.5, tags:["ipa","hoppy","tropical","citrus","local"]}
     ]},
    {id:"lanikai", name:"Lanikai Brewing Co.", cat:"local", origin:"Oahu · Kailua", loc:4, x:81, y:27,
     blurb:"Adventure-driven, ocean-inspired Kailua craft.",
     products:[
       {name:"Pillbox Porter", style:"Porter", abv:5.5, tags:["stout","porter","roasty","malty","smooth","bold","local"]},
       {name:"Moku Imperial IPA", style:"Double IPA", abv:8.5, tags:["ipa","hoppy","strong","bold","local","adventurous","unique"]}
     ]},
    {id:"beerlab", name:"Beer Lab HI", cat:"local", origin:"Oahu · Honolulu", loc:5, x:19, y:33,
     blurb:"Cult-favorite hazy IPAs and wild fruited sours.",
     products:[
       {name:"Hugfish Hazy IPA", style:"Hazy IPA", abv:6.8, tags:["ipa","hazy","fruity","tropical","hoppy","smooth","local","unique","popular","signature"]},
       {name:"Smoothie Sour: Lilikoi", style:"Fruited Sour", abv:5.5, tags:["sour","tart","fruity","tropical","sweet","refreshing","local","unique","adventurous"]}
     ]},
    {id:"ola", name:"Ola Brewing", cat:"local", origin:"Big Island · Kona", loc:6, x:40, y:33,
     blurb:"Big Island craft, made farm-to-bottle.",
     products:[
       {name:"Hawaiian Lager", style:"Lager", abv:5.0, tags:["lager","crisp","easy","light","local","classic"]},
       {name:"Pakalolo Pale Ale", style:"Pale Ale", abv:5.5, tags:["pale","hoppy","citrus","balanced","local"]}
     ]},
    {id:"kohola", name:"Kohola Brewery", cat:"local", origin:"Maui · Lahaina", loc:7, x:61, y:33,
     blurb:"Small-batch, surf-inspired ales from West Maui.",
     products:[
       {name:"Red Sand Amber Ale", style:"Amber Ale", abv:5.5, tags:["amber","malty","smooth","balanced","local","signature"]},
       {name:"Talk Story Tropical IPA", style:"IPA", abv:6.5, tags:["ipa","tropical","fruity","hoppy","local"]}
     ]},
    {id:"kolea", name:"Kolea Brewing", cat:"local", origin:"Oahu", loc:8, x:79, y:43,
     blurb:"Fresh Oahu newcomer with crushable everyday brews.",
     products:[
       {name:"Kolea Pilsner", style:"Pilsner", abv:4.8, tags:["lager","pilsner","crisp","light","refreshing","easy","local"]},
       {name:"Sunset Hazy IPA", style:"Hazy IPA", abv:6.5, tags:["ipa","hazy","juicy","tropical","fruity","local"]}
     ]},
    {id:"nectar", name:"Nectar Hard Seltzer", cat:"variety", origin:"Hawaii-made", loc:9, x:29, y:49,
     blurb:"Hawaii's own hard seltzer — real island fruit, light & clean.",
     products:[
       {name:"Pineapple Hard Seltzer", style:"Hard Seltzer", abv:5.0, tags:["seltzer","light","crisp","fruity","tropical","refreshing","easy","local","gluten_free"]},
       {name:"Lilikoi Hard Seltzer", style:"Hard Seltzer", abv:5.0, tags:["seltzer","fruity","tart","tropical","refreshing","light","local","gluten_free"]}
     ]},
    {id:"ballast", name:"Ballast Point", cat:"mainland", origin:"San Diego, CA", loc:10, x:52, y:50,
     blurb:"San Diego icons — home of the legendary Sculpin.",
     products:[
       {name:"Sculpin IPA", style:"IPA", abv:7.0, tags:["ipa","hoppy","citrus","bold","award_winning","classic","popular","signature"]},
       {name:"Grapefruit Sculpin", style:"Fruited IPA", abv:7.0, tags:["ipa","fruity","citrus","hoppy","refreshing","award_winning"]},
       {name:"Victory at Sea", style:"Imperial Porter", abv:10.0, tags:["stout","porter","roasty","coffee","strong","bold","award_winning","unique"]}
     ]},
    {id:"deschutes", name:"Deschutes Brewery", cat:"mainland", origin:"Bend, OR", loc:11, x:72, y:55,
     blurb:"Pacific Northwest pioneers since 1988.",
     products:[
       {name:"Fresh Squeezed IPA", style:"IPA", abv:6.4, tags:["ipa","citrus","juicy","hoppy","popular","classic"]},
       {name:"Black Butte Porter", style:"Porter", abv:5.5, tags:["stout","porter","roasty","chocolate","smooth","classic","award_winning"]}
     ]},
    {id:"dogfish", name:"Dogfish Head", cat:"mainland", origin:"Milton, DE", loc:12, x:24, y:60,
     blurb:"Off-centered ales for off-centered people.",
     products:[
       {name:"60 Minute IPA", style:"IPA", abv:6.0, tags:["ipa","hoppy","balanced","classic","popular","award_winning"]},
       {name:"SeaQuench Ale", style:"Session Sour", abv:4.9, tags:["sour","tart","lime","refreshing","crisp","sessionable","light","unique"]}
     ]},
    {id:"bells", name:"Bell's Brewery", cat:"mainland", origin:"Comstock, MI", loc:13, x:45, y:62,
     blurb:"Midwest legends — makers of the iconic Two Hearted.",
     products:[
       {name:"Two Hearted Ale", style:"American IPA", abv:7.0, tags:["ipa","hoppy","citrus","balanced","award_winning","classic","popular","signature"]},
       {name:"Oberon Ale", style:"American Wheat", abv:5.8, tags:["wheat","citrus","smooth","easy","refreshing","light"]}
     ]},
    {id:"boulevard", name:"Boulevard Brewing", cat:"mainland", origin:"Kansas City, MO", loc:14, x:65, y:68,
     blurb:"Belgian-inspired craft from the heartland.",
     products:[
       {name:"Tank 7 Farmhouse Ale", style:"Saison", abv:8.5, tags:["belgian","saison","fruity","spicy","strong","bold","award_winning","unique","adventurous"]},
       {name:"Unfiltered Wheat", style:"Wheat Ale", abv:4.4, tags:["wheat","light","citrus","easy","refreshing","sessionable"]}
     ]},
    {id:"goldenroad", name:"Golden Road Brewing", cat:"mainland", origin:"Los Angeles, CA", loc:15, x:84, y:62,
     blurb:"Bright, fruit-forward, easy-going LA beers.",
     products:[
       {name:"Mango Cart", style:"Fruited Wheat", abv:4.0, tags:["wheat","fruity","tropical","light","easy","refreshing","popular","sweet"]},
       {name:"Wolf Pup Session IPA", style:"Session IPA", abv:4.5, tags:["ipa","light","citrus","sessionable","easy"]}
     ]},
    {id:"trappist", name:"Belgian Trappist Cellar", cat:"import", origin:"Belgium", loc:16, x:30, y:74,
     blurb:"World-class abbey ales — Chimay & Rochefort.",
     products:[
       {name:"Chimay Blue (Grande Réserve)", style:"Belgian Strong Dark", abv:9.0, tags:["belgian","dark","malty","strong","bold","complex","award_winning","classic","unique"]},
       {name:"Rochefort 10", style:"Belgian Quad", abv:11.3, tags:["belgian","dark","strong","bold","complex","rich","award_winning","unique","adventurous"]}
     ]},
    {id:"paradise", name:"Paradise Beverages", cat:"cider", origin:"Variety booth", loc:17, x:52, y:78,
     blurb:"Tropical ciders, familiar lagers & canned cocktails.",
     products:[
       {name:"Tropical Guava Cider", style:"Hard Cider", abv:5.0, tags:["cider","fruity","sweet","tropical","refreshing","gluten_free","easy"]},
       {name:"Estrella Jalisco", style:"Mexican Lager", abv:4.5, tags:["lager","crisp","light","easy","familiar","classic","refreshing"]},
       {name:"Cutwater Tequila Margarita", style:"Canned Cocktail", abv:12.5, tags:["cocktail","fruity","lime","strong","sweet","unique"]}
     ]},
    {id:"variety", name:"Hard Variety Bar", cat:"variety", origin:"White Claw · Truly · Twisted Tea", loc:18, x:72, y:80,
     blurb:"The familiar crowd-pleasers — grab-and-go seltzers & teas.",
     products:[
       {name:"White Claw Mango", style:"Hard Seltzer", abv:5.0, tags:["seltzer","light","fruity","tropical","refreshing","easy","familiar","gluten_free","popular"]},
       {name:"Twisted Tea Original", style:"Hard Iced Tea", abv:5.0, tags:["tea","sweet","easy","familiar","refreshing"]},
       {name:"Truly Wild Berry", style:"Hard Seltzer", abv:5.0, tags:["seltzer","fruity","light","easy","familiar","refreshing","gluten_free"]}
     ]}
  ]
});
