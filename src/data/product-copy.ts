// Product write-ups, keyed by product handle.
//
// Kept apart from products.ts on purpose: this is content, not structure. When a real back end is
// connected, `description` and `highlights` simply come from the database and this file can be
// deleted. Nothing else reads it. products.ts merges it into each product at start-up.

export type ProductCopy = {
  description: string;
  highlights: string[];
};

export const productCopy: Record<string, ProductCopy> = {
  // ---- Shirts
  "acme-circles-tshirt": { description: "A classic crew-neck tee printed with an overlapping circles design. The soft cotton feels easy against the skin and holds its shape wash after wash.", highlights: ["Soft cotton jersey", "Printed circles design", "Regular everyday fit"] },
  "acme-tshirt": { description: "A plain black tee with a small General Store logo on the chest. It pairs with almost anything and keeps its colour well after washing.", highlights: ["Subtle chest logo", "Soft, breathable cotton", "Easy to layer"] },
  "acme-prism-tshirt": { description: "A black tee with a bright prism graphic across the front. A bold choice for casual days, and comfortable enough to wear all day.", highlights: ["Colourful prism print", "Lightweight cotton", "Crew neckline"] },
  "acme-shirts-4": { description: "A loose, relaxed tee with a dropped shoulder and a roomy cut. It stays comfortable in warm weather and looks good tucked or untucked.", highlights: ["Relaxed, roomy fit", "Dropped shoulders", "Breathable cotton blend"] },
  "acme-shirts-5": { description: "A simple tee with a neat chest pocket for a little extra detail. Soft, hard-wearing fabric makes it a dependable everyday basic.", highlights: ["Stitched chest pocket", "Soft hard-wearing fabric", "Everyday basic"] },
  "acme-shirts-6": { description: "A thicker, heavyweight tee that drapes well and keeps its structure. Built to last through regular wear and frequent washing.", highlights: ["Thick heavyweight cotton", "Holds its shape", "Reinforced collar"] },
  // ---- Bags
  "acme-drawstring-bag": { description: "A light drawstring bag that packs flat when it is empty. Handy for the gym, a day trip or carrying shoes in your luggage.", highlights: ["Lightweight and foldable", "Strong drawstring cord", "Roomy main compartment"] },
  "acme-bags-2": { description: "A compact trail pack sized for day walks and city errands. Padded straps keep it comfortable when the bag is full.", highlights: ["Padded shoulder straps", "Front zip pocket", "Water-resistant fabric"] },
  "acme-bags-3": { description: "A sturdy canvas carryall with long handles and a wide opening. It takes groceries, books or a change of clothes without fuss.", highlights: ["Heavy canvas body", "Long carry handles", "Wide open top"] },
  "acme-bags-4": { description: "A small crossbody bag for the things you need close at hand. The adjustable strap lets you wear it across the chest or on the hip.", highlights: ["Adjustable strap", "Zip main pocket", "Fits phone and wallet"] },
  "acme-bags-5": { description: "A roomy weekender for short trips and overnight stays. It holds a couple of outfits and shoes, and still fits under most seats.", highlights: ["Large main compartment", "Detachable shoulder strap", "Reinforced base"] },
  "acme-bags-6": { description: "A slim sling bag that keeps your essentials within reach on the move. Wear it on one shoulder and swing it round to the front when you need it.", highlights: ["Single-strap design", "Quick-access pocket", "Slim, low profile"] },
  // ---- Drinkware
  "acme-cup": { description: "A ceramic mug with a clean, minimal shape. It holds a generous serving of coffee or tea and feels pleasant to hold.", highlights: ["Glazed ceramic", "Comfortable handle", "Dishwasher friendly"] },
  "acme-drinkware-2": { description: "A hand-finished stoneware mug with a thick wall that keeps drinks warm for longer. The matte glaze gives it a calm, earthy look.", highlights: ["Thick stoneware wall", "Matte glaze finish", "Large, easy-grip handle"] },
  "acme-drinkware-3": { description: "A clear glass bottle you can carry or keep on your desk. The wide neck makes it easy to fill, add ice and clean.", highlights: ["Clear glass body", "Wide neck for easy filling", "Leak-resistant cap"] },
  "acme-drinkware-4": { description: "A double-walled flask that keeps hot drinks hot and cold drinks cold for hours. It fits most car cup holders and bag side pockets.", highlights: ["Double-wall insulation", "Screw-top lid", "Fits standard cup holders"] },
  "acme-drinkware-5": { description: "A small espresso cup with a thick base to hold the heat. The right size for a shot of coffee or a few sips of something strong.", highlights: ["Compact espresso size", "Heat-holding thick base", "Stackable shape"] },
  "acme-drinkware-6": { description: "A tall glass for iced coffee, cold brew and long drinks. The straight sides show off the layers and make it easy to stir.", highlights: ["Tall, straight sides", "Clear glass", "Easy to clean"] },
  // ---- Hoodies
  "acme-hoodie": { description: "A heavyweight hoodie with a soft fleece lining and a modern fit. Warm enough for cool evenings without feeling bulky.", highlights: ["Soft fleece lining", "Adjustable drawstring hood", "Front kangaroo pocket"] },
  "acme-hoodies-2": { description: "A full-length zip hoodie that is easy to put on and take off. Wear it open over a tee or zipped up when the temperature drops.", highlights: ["Full-length front zip", "Two side pockets", "Ribbed cuffs and hem"] },
  "acme-hoodies-3": { description: "A clean-lined hoodie cut for a neat, studio-ready look. The smooth cotton blend stays soft and resists bobbling.", highlights: ["Smooth cotton blend", "Tidy tailored cut", "Lined hood"] },
  "acme-hoodies-4": { description: "A thick heavyweight hoodie for properly cold days. The dense fabric holds heat well and keeps its shape over time.", highlights: ["Dense heavyweight fabric", "Double-layer hood", "Reinforced seams"] },
  "acme-hoodies-5": { description: "A cosy fleece pullover for slow weekends and long evenings in. The brushed inside feels warm from the moment you put it on.", highlights: ["Brushed fleece interior", "Roomy, relaxed cut", "Warm kangaroo pocket"] },
  "acme-hoodies-6": { description: "A hood-free crew sweatshirt that works for layering or wearing alone. Light enough for spring, warm enough for a cool morning.", highlights: ["Crew neck, no hood", "Mid-weight cotton", "Ribbed collar and cuffs"] },
  // ---- Kids
  "acme-baby-onesie": { description: "A soft organic cotton onesie for the little ones. The fabric is gentle on delicate skin, and snap buttons make changing quick.", highlights: ["Organic cotton", "Snap-button closure", "Gentle on sensitive skin"] },
  "acme-kids-2": { description: "A matching top and trousers set for play, nursery and weekends. Stretchy, easy-care fabric moves with them all day.", highlights: ["Matching two-piece set", "Stretchy cotton blend", "Machine washable"] },
  "acme-kids-3": { description: "A soft little tee in a gentle cotton knit for babies and toddlers. Envelope shoulders help it slip on and off without a struggle.", highlights: ["Soft cotton knit", "Envelope shoulders", "Tag-free neck"] },
  "acme-kids-4": { description: "A mini hoodie that mirrors the grown-up version. Warm, hard-wearing and easy to throw on for the school run or the park.", highlights: ["Fleece-lined hood", "Front pocket", "Ribbed cuffs"] },
  "acme-kids-5": { description: "Stretchy organic leggings that stay comfortable while little legs run, climb and crawl. The soft waistband will not dig in.", highlights: ["Organic stretch cotton", "Soft elastic waistband", "Holds colour after washing"] },
  "acme-kids-6": { description: "A cotton romper with an easy-on fit for warm days. Short sleeves and legs keep babies cool and comfortable.", highlights: ["Breathable cotton", "Short sleeves and legs", "Easy snap fastening"] },
  // ---- Headwear
  "acme-cowboy-hat": { description: "A classic black cowboy hat with General Store branding. The firm brim gives good shade, and the shape holds up to everyday wear.", highlights: ["Firm shaped brim", "Inner sweatband", "Black classic finish"] },
  "acme-headwear-2": { description: "A stretchy ribbed beanie that sits close and keeps your ears warm. Soft yarn means it will not itch.", highlights: ["Stretch ribbed knit", "Soft, non-itch yarn", "One size fits most"] },
  "acme-headwear-3": { description: "A wide-brim sun hat that shades your face and neck. Light and breathable, and easy to fold into a bag.", highlights: ["Wide protective brim", "Lightweight and breathable", "Packs down flat"] },
  "acme-headwear-4": { description: "A soft corduroy cap with a curved peak and an adjustable back. A little texture makes a plain outfit feel finished.", highlights: ["Textured corduroy", "Curved peak", "Adjustable strap"] },
  "acme-headwear-5": { description: "A classic fedora with a pinched crown and a neat ribbon band. Smart enough to dress up and relaxed enough for the weekend.", highlights: ["Pinched crown", "Ribbon hat band", "Structured brim"] },
  "acme-headwear-6": { description: "A lightweight trail cap that dries quickly after rain or sweat. The curved brim keeps the sun out of your eyes.", highlights: ["Quick-dry fabric", "Curved brim", "Adjustable fit"] },
  // ---- Stickers
  "acme-sticker": { description: "A set of vinyl stickers for laptops, bottles and notebooks. The weatherproof finish will not fade or peel in everyday use.", highlights: ["Weatherproof vinyl", "Fade-resistant ink", "Peels off cleanly"] },
  "acme-stickers-2": { description: "A studio set of stickers in a mix of shapes and sizes. Good for personalising desks, folders and cases.", highlights: ["Mixed sizes and shapes", "Matte finish", "Easy peel backing"] },
  "acme-stickers-3": { description: "A travel set made for suitcases, flasks and passport covers. Tough vinyl handles scuffs and splashes on the road.", highlights: ["Scuff-resistant vinyl", "Waterproof", "Ideal for luggage"] },
  "acme-stickers-4": { description: "A colourful pack with a bright range of designs. Stick them on anything smooth and give it a lift.", highlights: ["Bright, bold colours", "Glossy finish", "Pack of assorted designs"] },
  "acme-stickers-5": { description: "An outdoor set made for bikes, helmets and water bottles. The UV-resistant coating keeps the colours strong in the sun.", highlights: ["UV-resistant coating", "Waterproof vinyl", "Strong adhesive"] },
  "acme-stickers-6": { description: "A single mini sheet of small stickers, perfect for planners and journals. Slim enough to keep in a pocket or a pencil case.", highlights: ["Small, detailed designs", "Fits planners and journals", "Pocket-sized sheet"] },
  // ---- Electronics
  "acme-keyboard": { description: "A mechanical keyboard with a clean layout and satisfying key feel. Built for long typing sessions and a tidy desk.", highlights: ["Mechanical key switches", "Clean compact layout", "Durable keycaps"] },
  "acme-electronics-2": { description: "A wireless mouse with a comfortable grip and a smooth, quiet click. Connects in seconds and runs for weeks on a battery.", highlights: ["Wireless connection", "Quiet click buttons", "Long battery life"] },
  "acme-electronics-3": { description: "A slim desk lamp with a warm, even light that is kind to the eyes. The adjustable arm points light exactly where you need it.", highlights: ["Adjustable arm", "Warm, even light", "Slim desk-friendly base"] },
  "acme-electronics-4": { description: "A tidy charging dock that keeps your phone upright and ready. Drop it in at night and pick it up charged in the morning.", highlights: ["Upright charging stand", "Non-slip base", "Cable included"] },
  "acme-electronics-5": { description: "A compact speaker with clear sound far bigger than its size. Small enough for a shelf, a backpack or a bathroom.", highlights: ["Clear, balanced sound", "Pocket-friendly size", "Wireless playback"] },
  "acme-electronics-6": { description: "A travel charger sized for bags and carry-ons. It charges your phone quickly from any standard socket.", highlights: ["Fast-charging output", "Compact travel size", "Built-in safety protection"] },
  // ---- Footwear
  "acme-runner-sneakers": { description: "Lightweight everyday sneakers with a cushioned sole and a clean, modern shape. Comfortable from the first wear, whether for errands or walks.", highlights: ["Cushioned sole", "Breathable mesh upper", "Lightweight build"] },
  "acme-footwear-2": { description: "Classic canvas low tops that go with jeans, shorts and everything between. The flat rubber sole grips well on dry streets.", highlights: ["Durable canvas upper", "Flat rubber outsole", "Lace-up fit"] },
  "acme-footwear-3": { description: "Trail runners with a grippy sole for dirt paths and wet pavement. The snug heel helps your foot stay put on uneven ground.", highlights: ["Deep-grip outsole", "Snug heel hold", "Quick-drying upper"] },
  "acme-footwear-4": { description: "Easy slip-on shoes for quick mornings and relaxed days. Elastic side panels make them simple to pull on and take off.", highlights: ["Slip-on, no laces", "Stretch side panels", "Cushioned insole"] },
  "acme-footwear-5": { description: "Court-style sneakers with a clean white upper and a firm, supportive sole. A neat all-rounder for work, school and weekends.", highlights: ["Clean court styling", "Supportive sole", "Easy-wipe upper"] },
  "acme-footwear-6": { description: "Leather loafers with a polished finish, ready for work or dinner out. The soft lining makes them comfortable to wear all day.", highlights: ["Genuine leather upper", "Soft cushioned lining", "Slip-on design"] },
  // ---- Jackets
  "acme-field-jacket": { description: "A field jacket made for light layering in changing weather. Roomy pockets and a straight cut give it a practical, outdoorsy look.", highlights: ["Multiple utility pockets", "Sturdy cotton blend", "Front button and zip closure"] },
  "acme-jackets-2": { description: "A lightweight rain shell that blocks wind and showers. It folds into its own pocket, so it is easy to carry just in case.", highlights: ["Water-resistant shell", "Packs into its pocket", "Adjustable hood"] },
  "acme-jackets-3": { description: "A quilted jacket that adds warmth without weight. The diamond stitching traps heat and looks smart over a shirt.", highlights: ["Quilted insulation", "Lightweight warmth", "Zip front pockets"] },
  "acme-jackets-4": { description: "A longer utility coat with deep pockets and a roomy fit. Good protection for commutes and cold days outside.", highlights: ["Longer length", "Deep front pockets", "Roomy fit for layering"] },
  "acme-jackets-5": { description: "A thin liner jacket to wear alone in mild weather or under a heavier coat. Soft and packable, with a neat, trim profile.", highlights: ["Thin and packable", "Soft inner lining", "Trim fit"] },
  "acme-jackets-6": { description: "A coach jacket with a snap front and a smooth, wind-blocking shell. A clean, sporty look that works with nearly everything.", highlights: ["Snap-button front", "Wind-blocking shell", "Ribbed collar and cuffs"] },
  // ---- Pets
  "acme-pet-bandana": { description: "A soft bandana that slips over your pet's collar. Adds a bit of style to walks and photos, and washes easily.", highlights: ["Soft cotton fabric", "Slips over collar", "Machine washable"] },
  "acme-pets-2": { description: "A durable everyday collar with a quick-release buckle. The adjustable length fits growing pups and grown dogs alike.", highlights: ["Quick-release buckle", "Adjustable length", "Metal ring for tags"] },
  "acme-pets-3": { description: "A matching leash and collar set for daily walks. The padded handle is comfortable to hold, even with a lively dog.", highlights: ["Padded leash handle", "Matching collar included", "Strong stitched webbing"] },
  "acme-pets-4": { description: "A sturdy pet bowl with a wide base that resists tipping. Easy to rinse, and sized for both food and water.", highlights: ["Non-tip wide base", "Easy to clean", "Generous capacity"] },
  "acme-pets-5": { description: "A cosy mat where your pet can curl up. The padded surface softens hard floors, and the underside grips so it stays put.", highlights: ["Soft padded surface", "Non-slip underside", "Washable cover"] },
  "acme-pets-6": { description: "A treat pouch that clips to your belt or bag for training walks. Reach in with one hand and keep rewards close.", highlights: ["Clip-on design", "One-hand opening", "Wipe-clean lining"] },
  // ---- Appliances
  "acme-compact-blender": { description: "A compact blender for smoothies, sauces and soups. Powerful enough for everyday use, and small enough to leave on the counter.", highlights: ["Powerful motor", "Compact counter footprint", "Detachable, washable jug"] },
  "acme-appliances-2": { description: "A digital air fryer that cooks with little or no oil. Pick a preset or set your own time and temperature from the clear display.", highlights: ["Digital touch controls", "Cooks with little oil", "Non-stick removable basket"] },
  "acme-appliances-3": { description: "An electric kettle that boils quickly and switches itself off. A good everyday kettle for tea, coffee and instant meals.", highlights: ["Fast boil", "Auto shut-off", "Cordless 360° base"] },
  "acme-appliances-4": { description: "A two-slice toaster with adjustable browning settings. Gives even toast, and the crumb tray slides out for cleaning.", highlights: ["Adjustable browning", "Extra-wide slots", "Removable crumb tray"] },
  "acme-appliances-5": { description: "A rice cooker that makes fluffy rice and keeps it warm until you are ready. Simple to use: add rice and water, then press a button.", highlights: ["One-button cooking", "Keep-warm function", "Non-stick inner pot"] },
  "acme-appliances-6": { description: "A stand mixer for dough, batters and whipped cream. The sturdy base keeps it steady, and the speed dial gives you control.", highlights: ["Multiple speed settings", "Stable non-slip base", "Includes mixing attachments"] },
  // ---- Phones
  "acme-smartphone": { description: "A dependable smartphone for calls, messages, photos and everything online. A bright display and all-day battery make it easy to rely on.", highlights: ["Bright, clear display", "All-day battery", "Dual SIM support"] },
  "acme-phones-2": { description: "An Android phone with smooth performance for everyday apps and games. Plenty of storage for photos and a battery that lasts.", highlights: ["Smooth everyday performance", "Generous storage", "Fast charging"] },
  "acme-phones-3": { description: "A budget phone that covers the basics well. Great for first-time users, backup phones and anyone who wants good value.", highlights: ["Simple and easy to use", "Reliable battery", "Great value"] },
  "acme-phones-4": { description: "A phone built around its camera, for sharp photos in daylight and low light. Easy modes help you capture good shots without fuss.", highlights: ["High-resolution camera", "Low-light mode", "Large storage"] },
  "acme-phones-5": { description: "A 5G-ready phone for fast downloads and smooth video calls. Quick, responsive performance with a battery to match.", highlights: ["5G connectivity", "Fast processor", "Large battery"] },
  "acme-phones-6": { description: "A top-tier phone with a premium display and the fastest performance in our range. Ideal for heavy multitasking, gaming and photography.", highlights: ["Premium bright display", "Top-tier performance", "Pro-grade camera"] },
  // ---- Beauty
  "acme-daily-face-cream": { description: "A light face cream that moisturises without feeling greasy. Easy to use morning and night as part of a simple routine.", highlights: ["Lightweight texture", "Fast-absorbing", "Suitable for daily use"] },
  "acme-beauty-2": { description: "A creamy body lotion that leaves skin soft and smooth. The gentle scent fades gently through the day.", highlights: ["Rich, creamy formula", "Non-sticky finish", "Light fragrance"] },
  "acme-beauty-3": { description: "A lightweight serum designed to sit under your moisturiser. A little goes a long way, so one bottle lasts.", highlights: ["Lightweight formula", "Layers under moisturiser", "Dropper bottle"] },
  "acme-beauty-4": { description: "A set of lip balms to keep lips soft and comfortable. Small enough to carry in a pocket, bag or desk drawer.", highlights: ["Pack of lip balms", "Smooth, easy glide", "Pocket-sized"] },
  "acme-beauty-5": { description: "A gentle body wash that lathers well and rinses clean. A fresh clean scent makes it a pleasant part of any shower.", highlights: ["Rich, easy lather", "Rinses clean", "Fresh scent"] },
  "acme-beauty-6": { description: "A nourishing hair oil that adds shine and helps tame frizz. Use a few drops on damp or dry hair for a smooth finish.", highlights: ["Adds shine", "Helps smooth frizz", "Non-greasy feel"] },
  // ---- Groceries
  "acme-pantry-rice-pack": { description: "A bag of long-grain rice that cooks up light and separate. A staple for everyday family meals.", highlights: ["Long-grain rice", "Cooks light and fluffy", "Resealable bag"] },
  "acme-groceries-2": { description: "A bundle of dried pasta in a few handy shapes. Cooks in minutes and goes well with almost any sauce.", highlights: ["Assorted pasta shapes", "Quick to cook", "Long shelf life"] },
  "acme-groceries-3": { description: "A bottle of cooking oil for frying, roasting and everyday meals. A neutral taste lets the flavour of your food come through.", highlights: ["Neutral flavour", "Suitable for frying", "Easy-pour bottle"] },
  "acme-groceries-4": { description: "A box of breakfast cereal for quick, easy mornings. Crunchy and ready to eat with milk or yoghurt.", highlights: ["Crunchy texture", "Ready to eat", "Family-size box"] },
  "acme-groceries-5": { description: "Canned tomatoes for sauces, stews and soups. A handy pantry item that is ready whenever you need it.", highlights: ["Ready-to-use tomatoes", "Long shelf life", "Great for sauces"] },
  "acme-groceries-6": { description: "A snack pack with a mix of treats for lunchboxes and on-the-go moments. Individually sized portions make sharing easy.", highlights: ["Mixed snack selection", "Individual portions", "Lunchbox-friendly"] },
};
