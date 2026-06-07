/* =========================================================================
   TEMPLATE — copy this file to data/<your-id>.js, fill it in, then add a
   matching card to data/events.js.  No other files change. That's the platform:
   build the engine once, launch a new experience by writing one data file.

   Open your new event at:  app.html?event=<your-id>
   ========================================================================= */
Brilla.register({
  id: "_template",                       // must match the file name

  /* Colors. a1/a2/a3 form the accent gradient; inkOn is text drawn ON the
     accent (use a dark color for light accents). hi = highlight color. */
  theme: { bg:"#140d29", bg2:"#1d1340", a1:"#ff6b5c", a2:"#ff9f1c", a3:"#ffd23f",
           accent:"#ff9f1c", inkOn:"#2a1300", hi:"#ffd23f" },

  brand: { name:"Your Event", byline:"guide · by Brilla", pill:"Date / 21+" },

  /* Words used throughout the UI — tune to your domain. */
  nouns: { vendor:"vendor", vendorPlural:"Vendors", product:"item", productPlural:"Items",
           catalogTitle:"Directory", stop:"Stop", stopPlural:"Stops",
           planTitle:"My Plan", planNoun:"My Plan", searchPlaceholder:"Search…" },

  /* Turn the Vendors directory and/or Map tabs on or off. */
  features: { vendors:true, map:true },

  /* Each category gets a color (used for monograms, map pins, filters, legend). */
  categories: {
    catA: { label:"Category A", color:"#1ec8b6" },
    catB: { label:"Category B", color:"#8c7bff" }
  },

  home: {
    kicker:"Short context line",
    title:["Too many choices.","Find your pick."],     // line 1, line 2 (gradient)
    sub:"One-sentence value prop for attendees.",
    facts:[ {icon:"calendar",label:"Date"}, {icon:"pin",label:"Location"}, {icon:"clock",label:"Time"} ],
    stats:[ {value:"100+",label:"Things"}, {value:"40+",label:"Vendors"}, {value:"9",label:"Extras"} ],
    decide:{ heading:"Not sure where to start?", body:"Answer a few questions and we'll build your plan.",
             primary:"Help Me Decide", secondary:"Browse Vendors", timehint:"About 30 seconds · no sign-up" },
    how:[ {title:"Tell us your taste", body:"A few quick taps."},
          {title:"Get your Top 3", body:"Specific picks, with reasons."},
          {title:"Build your plan", body:"Save and follow the map."} ],
    disclaimer:"Concept demo. Listings illustrative.",
    footTagline:"The recommendation is the product."
  },

  /* primaryStyleKey = the quiz question whose answer is the user's main
     preference; products tagged with that answer value get a ranking boost.
     jitter (optional) adds randomness for a "surprise me" answer. */
  scoring:{ primaryStyleKey:"style", openValue:"open", styleBonus:4, jitterKey:"adventure", jitterValues:["surprise"] },

  /* Optional one-line recap shown above the results, assembled from answers. */
  summary:{ prefix:"Based on your taste — ", suffix:" — here's where we'd start.",
    parts:[ {key:"style", map:{ a:"you like A", b:"you like B" }} ] },

  /* The quiz. Each option's `w` adds weight to product tags. Negative weights
     push matching products DOWN. `matchTags` + `mood` power the mood reason. */
  quiz:[
    { key:"style", eyebrow:"Go-to", q:"What do you usually pick?", desc:"",
      options:[
        {value:"a", emoji:"🅰️", label:"Option A", desc:"", w:{tagA:4}},
        {value:"b", emoji:"🅱️", label:"Option B", desc:"", w:{tagB:4}},
        {value:"open", emoji:"🤷", label:"Not sure", desc:"", w:{popular:2}}
      ]},
    { key:"adventure", eyebrow:"Your style", q:"How adventurous?", desc:"",
      options:[
        {value:"safe",     emoji:"🛟", label:"Play it safe", w:{popular:2,classic:1,unique:-2}},
        {value:"surprise", emoji:"🎲", label:"Surprise me",  w:{unique:3,adventurous:3}}
      ]}
  ],

  /* Reasons shown on each pick. Rules run top-to-bottom; up to 2 that match
     (answer condition AND the product has `tag`) are shown. */
  reasonRules:[
    {answerKey:"style", answerIn:["a"], tag:"tagA", text:"Right in your wheelhouse."},
    {type:"option-tags", answerKey:"mood", text:"Matches your “{label}” mood."},
    {answerKey:"adventure", answerIn:["surprise"], tag:"unique", text:"A fun one to discover."}
  ],
  fallbackReason:"A strong match for what you told us.",

  /* Optional map. zones are decorative labels; pins come from each vendor's x/y
     (percent of the map box). Omit map + set features.map:false to hide it. */
  map:{ title:"Map", note:"Tap a numbered spot.", bg1:"#16332a", bg2:"#0f241d",
    zones:[ {shape:"rect", x:95, y:14, w:110, h:30, label:"STAGE", stroke:"#ff9f1c", labelColor:"#ffd23f"} ] },

  /* Your vendors and their products. loc = number on the map; x/y = position %. */
  vendors:[
    {id:"v1", name:"Vendor One", cat:"catA", origin:"Somewhere", loc:1, x:30, y:30,
     blurb:"Short description.",
     products:[
       {name:"Product One", style:"Style", abv:5.0, /* or price:"$8" */ tags:["tagA","popular","signature"]},
       {name:"Product Two", style:"Style", abv:6.5, tags:["tagA","unique"]}
     ]}
  ]
});
