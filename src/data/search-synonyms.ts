// Words that mean the same thing for shoppers. Each row is one group: searching for any word in a
// group also finds products that use the others. Plain words are enough (plurals are handled for you).
// Keep it small and tied to what the catalogue sells; a real search engine would manage this list.

export const SEARCH_SYNONYMS: string[][] = [
  ["tee", "tshirt", "shirt"],
  ["hoodie", "hoody", "sweatshirt", "pullover", "sweater", "fleece"],
  ["jacket", "coat", "windbreaker", "shell"],
  ["sneaker", "trainer", "shoe", "footwear", "runner", "loafer"],
  ["cap", "hat", "beanie", "fedora"],
  ["bag", "backpack", "tote", "carryall", "sling"],
  ["mug", "cup", "tumbler", "flask", "bottle"],
  ["phone", "smartphone", "mobile", "cellphone", "android"],
  ["charger", "charging", "dock", "adapter"],
  ["speaker", "audio", "soundbox"],
  ["keyboard", "typing"],
  ["blender", "mixer", "smoothie"],
  ["fryer", "airfryer"],
  ["kettle", "boiler"],
  ["kid", "child", "children", "baby", "toddler", "infant"],
  ["lotion", "moisturiser", "moisturizer", "cream", "skincare"],
  ["serum", "face"],
  ["pasta", "spaghetti", "noodle"],
  ["rice", "grain"],
  ["snack", "treat"],
  ["dog", "puppy", "pet"],
  ["sticker", "decal"],
];
