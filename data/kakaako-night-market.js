/* Kaka‘ako Night Market — a SECOND experience that reuses the same Brilla
   engine. Different domain (food + drinks), theme, nouns, and uses price
   instead of ABV — proving "build once, load data". */
Brilla.register({
  id: "kakaako-night-market",

  theme: { bg:"#0c1424", bg2:"#141a3a", a1:"#ff3d8b", a2:"#b14bff", a3:"#2bd4ff",
           accent:"#b14bff", inkOn:"#160622", hi:"#2bd4ff" },

  brand: { name:"Kaka‘ako Night Market", byline:"food guide · by Brilla", pill:"Sat · 4–10PM" },

  nouns: { vendor:"stall", vendorPlural:"Stalls", product:"dish", productPlural:"Dishes",
           catalogTitle:"Stall Directory", stop:"Stop", stopPlural:"Stops",
           planTitle:"My Market Run", planNoun:"My Run",
           searchPlaceholder:"Search stalls, dishes, or cuisines…" },

  features: { vendors:true, map:true },

  categories: {
    street_food: { label:"Street food", color:"#ff3d8b" },
    noodles:     { label:"Noodles",     color:"#b14bff" },
    drinks:      { label:"Drinks",      color:"#2bd4ff" },
    sweets:      { label:"Sweets",      color:"#ffb03a" }
  },

  home: {
    kicker:"Pop-up · Kaka‘ako Saturdays",
    title:["Too many stalls.","Find your bites."],
    sub:"Dozens of local food stalls and drinks. We'll plan your perfect three stops in about 30 seconds.",
    facts:[ {icon:"calendar",label:"Every Saturday"}, {icon:"clock",label:"4–10 PM"}, {icon:"pin",label:"Kaka‘ako, Oahu"} ],
    stats:[ {value:"30+",label:"Food & drink stalls"}, {value:"5",label:"Cuisines"}, {value:"Free",label:"Entry"} ],
    decide:{ heading:"Hungry but undecided?",
      body:"Answer a few quick questions and we'll map out what to eat (and drink) tonight — no more wandering.",
      primary:"Plan My Bites", secondary:"Browse Stalls", timehint:"About 30 seconds · 5 quick taps · no sign-up" },
    how:[
      {title:"Tell us your craving", body:"A few taps on what you're hungry for and how you're feeling."},
      {title:"Get your Top 3 Stops", body:"Specific dishes at specific stalls — with why each one fits you."},
      {title:"Build your market run", body:"Save your picks and follow the map. Less wandering, more eating."}
    ],
    lineupTitle:"Tonight's stalls",
    lineupBlurb:"Local grinds, Filipino favorites, crispy bites, noodles, sweets and refreshers — all in one lot.",
    directoryFoot:"Stalls & dishes are illustrative for this concept demo.",
    disclaimer:"Independent concept demo created by Brilla to show how the same engine powers any food or drink event. Not an official event app. Stalls & dishes are illustrative.",
    footTagline:"The recommendation is the product."
  },

  results:{ eyebrow:"Your market run" },

  scoring:{ primaryStyleKey:"craving", openValue:"", styleBonus:4 },

  summary:{ prefix:"Based on what you told us — ", suffix:" — start here.", fallback:"Start here.",
    parts:[
      {key:"craving", map:{savory:"craving savory", noodles:"in the mood for noodles", fried:"after something fried", sweet:"got a sweet tooth", drink:"here for the drinks"}},
      {key:"mood",    map:{bold_spicy:"feeling bold & spicy", fresh_light:"feeling fresh & light", rich_comfort:"wanting rich & comforting", sweet_indulgent:"feeling sweet & indulgent"}},
      {key:"goal",    map:{local:"chasing local favorites", newthing:"trying something new", value:"after the best value", crowd:"want crowd-pleasers", treat:"ready to treat yourself"}}
    ] },

  quiz:[
    { key:"hunger", eyebrow:"First up", q:"How hungry are you?", desc:"Sets the size of your plan.",
      options:[
        {value:"snack", emoji:"🍢", label:"Just snacking",      desc:"A bite or two",      w:{light:2,shareable:1,fried:1}},
        {value:"hungry",emoji:"🍽️", label:"Pretty hungry",      desc:"Ready for a meal",   w:{savory:2,rich:1}},
        {value:"allin", emoji:"🤤", label:"Bring it all",       desc:"Go big tonight",     w:{rich:2,bold:1,savory:1,indulgent:1}},
        {value:"drink", emoji:"🧋", label:"Mostly here to drink",desc:"Sips over bites",    w:{drink:3,refreshing:1}}
      ]},
    { key:"craving", eyebrow:"The craving", q:"What are you craving?", desc:"Pick what sounds best right now.",
      options:[
        {value:"savory", emoji:"🍖", label:"Savory & meaty",  desc:"Grilled, hearty",   w:{savory:4,meaty:2,bold:1}},
        {value:"noodles",emoji:"🍜", label:"Noodles & rice",  desc:"Comforting bowls",  w:{noodles:4,comforting:2,savory:1}},
        {value:"fried",  emoji:"🍟", label:"Something fried",  desc:"Crispy & golden",   w:{fried:4,crispy:2,savory:1}},
        {value:"sweet",  emoji:"🍩", label:"A sweet treat",   desc:"Dessert mode",      w:{sweet:4,dessert:2,indulgent:1}},
        {value:"drink",  emoji:"🥤", label:"A good drink",     desc:"Refresh me",        w:{drink:4,refreshing:2}}
      ]},
    { key:"mood", eyebrow:"Flavor mood", q:"What flavor are you feeling?", desc:"Go with your gut.",
      options:[
        {value:"bold_spicy",      emoji:"🌶️", label:"Bold & spicy",      w:{bold:3,spicy:2}, mood:"bold & spicy", matchTags:["bold","spicy"]},
        {value:"fresh_light",     emoji:"🥗", label:"Fresh & light",     w:{fresh:2,light:3,refreshing:2}, mood:"fresh & light", matchTags:["fresh","light","refreshing"]},
        {value:"rich_comfort",    emoji:"🍲", label:"Rich & comforting", w:{rich:3,comforting:3,savory:1}, mood:"rich & comforting", matchTags:["rich","comforting"]},
        {value:"sweet_indulgent", emoji:"🍫", label:"Sweet & indulgent", w:{sweet:3,indulgent:2,dessert:2}, mood:"sweet & indulgent", matchTags:["sweet","indulgent","dessert"]}
      ]},
    { key:"spice", eyebrow:"Heat check", q:"How's your spice tolerance?", desc:"We'll factor it in.",
      options:[
        {value:"mild", emoji:"🧊", label:"Keep it mild",  w:{mild:2,spicy:-2}},
        {value:"kick", emoji:"🌶️", label:"A little kick", w:{spicy:1}},
        {value:"heat", emoji:"🔥", label:"Bring the heat", w:{spicy:3,bold:1}}
      ]},
    { key:"goal", eyebrow:"Tonight's move", q:"What's the move tonight?", desc:"This shapes your Top 3.",
      options:[
        {value:"local",   emoji:"🌺", label:"Local favorites",  w:{local:4,signature:1}},
        {value:"newthing",emoji:"✨", label:"Try something new", w:{unique:3,fresh:1}},
        {value:"value",   emoji:"💸", label:"Best value",        w:{value:3,popular:1}},
        {value:"crowd",   emoji:"⭐", label:"Crowd-pleasers",    w:{popular:3,classic:1}},
        {value:"treat",   emoji:"🎁", label:"Treat yourself",    w:{indulgent:3,rich:1,dessert:1}}
      ]}
  ],

  reasonRules:[
    {answerKey:"craving", answerIn:["savory"], tag:"savory", text:"You're craving savory — this one delivers."},
    {answerKey:"craving", answerIn:["noodles"],tag:"noodles",text:"Noodles it is — a comforting bowl for you."},
    {answerKey:"craving", answerIn:["fried"],  tag:"fried",  text:"Crispy and fried, exactly what you wanted."},
    {answerKey:"craving", answerIn:["sweet"],  tag:"sweet",  text:"A sweet treat, right on the money."},
    {answerKey:"craving", answerIn:["drink"],  tag:"drink",  text:"A refreshing drink to keep you going."},
    {type:"option-tags", answerKey:"mood", text:"Matches your “{label}” mood."},
    {answerKey:"goal",  answerIn:["local"], tag:"local",     text:"A local Hawaii favorite — made right here."},
    {answerKey:"goal",  answerIn:["value"], tag:"value",     text:"Great value — a lot of flavor for the price."},
    {answerKey:"goal",  answerIn:["treat"], tag:"indulgent", text:"Go on — treat yourself."},
    {answerKey:"spice", answerIn:["heat"],  tag:"spicy",     text:"Brings the heat, just how you like it."},
    {answerKey:"hunger",answerIn:["drink"], tag:"drink",     text:"Perfect if you're mostly here to sip."}
  ],
  fallbackReason:"A great match for what you're after.",

  map:{ title:"Market Map",
    note:"Kaka‘ako lot. Tap a numbered stall to see what's cooking. Your saved stops glow.",
    bg1:"#1a1233", bg2:"#0c0a1e",
    zones:[
      {shape:"rect", x:100, y:14,  w:100, h:28, label:"LIVE MUSIC", fill:"#2a1230", stroke:"#ff3d8b", labelColor:"#ff9ecb"},
      {shape:"rect", x:108, y:300, w:84,  h:40, label:"SEATING",    fill:"#14233a", stroke:"#2bd4ff", labelColor:"#9fe9ff"},
      {shape:"rect", x:110, y:372, w:80,  h:22, label:"ENTRANCE",   fill:"#1a0f2e", stroke:"#b14bff", labelColor:"#d6b8ff"},
      {shape:"circle", x:255, y:330, r:13, label:"WC",              fill:"#101a30", stroke:"#2bd4ff", labelColor:"#9fe9ff"}
    ] },

  vendors:[
    {id:"sausage", name:"Sausage Fest", cat:"street_food", origin:"Grilled dogs", loc:1, x:24, y:20,
     blurb:"Char-grilled sausages and loaded dogs.",
     products:[
       {name:"Portuguese Sausage Dog", style:"Loaded dog", price:"$9", tags:["savory","meaty","pork","bold","local","popular","classic"]},
       {name:"Spicy Italian Sausage", style:"Grilled sausage", price:"$10", tags:["savory","meaty","spicy","bold"]}
     ]},
    {id:"pizza", name:"Anastacia's Pizza", cat:"street_food", origin:"Wood-fired", loc:2, x:50, y:17,
     blurb:"Blistered wood-fired pizza by the slice.",
     products:[
       {name:"Margherita Slice", style:"Wood-fired pizza", price:"$7", tags:["savory","comforting","rich","classic","vegetarian","popular"]},
       {name:"Pepperoni Slice", style:"Wood-fired pizza", price:"$8", tags:["savory","meaty","rich","comforting","classic","popular"]}
     ]},
    {id:"rolls", name:"The Corner Rolls", cat:"street_food", origin:"Filipino", loc:3, x:74, y:22,
     blurb:"Hand-rolled lumpia, crispy to order.",
     products:[
       {name:"Pork Lumpia (6 pc)", style:"Filipino spring rolls", price:"$8", tags:["savory","fried","crispy","pork","filipino","local","value","popular","signature"]},
       {name:"Veggie Spring Rolls", style:"Spring rolls", price:"$7", tags:["fried","crispy","vegetarian","light","fresh","value"]}
     ]},
    {id:"fries", name:"Chubby Fries & Wings", cat:"street_food", origin:"Fried faves", loc:4, x:30, y:38,
     blurb:"Crispy wings and loaded island fries.",
     products:[
       {name:"Garlic Parm Wings", style:"Fried wings", price:"$12", tags:["savory","fried","crispy","chicken","bold","rich","popular"]},
       {name:"Furikake Fries", style:"Loaded fries", price:"$8", tags:["fried","crispy","savory","local","vegetarian","shareable","value","popular"]}
     ]},
    {id:"saimin", name:"Saimin & Noodle Bar", cat:"noodles", origin:"Local-style", loc:5, x:70, y:40,
     blurb:"Steamy island noodle bowls.",
     products:[
       {name:"Local Saimin", style:"Noodle soup", price:"$10", tags:["noodles","savory","comforting","local","classic","light","value","popular"]},
       {name:"Garlic Shoyu Ramen", style:"Ramen", price:"$13", tags:["noodles","savory","rich","comforting","bold"]}
     ]},
    {id:"rimlikah", name:"Rim Likah", cat:"drinks", origin:"Teas & refreshers", loc:6, x:22, y:58,
     blurb:"Thai teas, boba and island coolers.",
     products:[
       {name:"Thai Iced Tea", style:"Boba tea", price:"$6", tags:["drink","sweet","refreshing","boba","popular","classic","indulgent"]},
       {name:"Lilikoi Cooler", style:"Fruit refresher", price:"$6", tags:["drink","refreshing","fruity","tart","light","fresh","local"]}
     ]},
    {id:"cookies", name:"These Stuffed Cookies", cat:"sweets", origin:"Dessert", loc:7, x:78, y:58,
     blurb:"Thick, gooey, stuffed cookies.",
     products:[
       {name:"Stuffed Choc-Chip Cookie", style:"Stuffed cookie", price:"$6", tags:["sweet","dessert","indulgent","rich","comforting","popular","signature","treat"]},
       {name:"Ube Crinkle Cookie", style:"Filled cookie", price:"$6", tags:["sweet","dessert","local","unique","indulgent"]}
     ]},
    {id:"celines", name:"Celine's Best", cat:"sweets", origin:"Local sweets", loc:8, x:50, y:50,
     blurb:"Hot malasadas and shave-ice classics.",
     products:[
       {name:"Hot Malasadas (3 pc)", style:"Fried doughnuts", price:"$7", tags:["sweet","dessert","fried","local","classic","popular","value","indulgent"]},
       {name:"Halo-Halo", style:"Shave ice dessert", price:"$9", tags:["sweet","dessert","refreshing","filipino","local","unique","light","fresh"]}
     ]}
  ]
});
