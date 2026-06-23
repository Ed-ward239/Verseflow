// Static snapshot of Billboard Hot 100 hits. Billboard has no free public API,
// so we bundle a list and resolve each entry to a real track via Spotify search.
// Refresh anytime by editing this array (title + primary artist is enough).
const BILLBOARD_HOT_100 = [
  { title: "Flowers", artist: "Miley Cyrus" },
  { title: "Kill Bill", artist: "SZA" },
  { title: "Anti-Hero", artist: "Taylor Swift" },
  { title: "Last Night", artist: "Morgan Wallen" },
  { title: "Calm Down", artist: "Rema" },
  { title: "Creepin'", artist: "Metro Boomin" },
  { title: "Unholy", artist: "Sam Smith" },
  { title: "As It Was", artist: "Harry Styles" },
  { title: "Cruel Summer", artist: "Taylor Swift" },
  { title: "Vampire", artist: "Olivia Rodrigo" },
  { title: "Paint The Town Red", artist: "Doja Cat" },
  { title: "Snooze", artist: "SZA" },
  { title: "Fast Car", artist: "Luke Combs" },
  { title: "Lovin On Me", artist: "Jack Harlow" },
  { title: "Greedy", artist: "Tate McRae" },
  { title: "Dance The Night", artist: "Dua Lipa" },
  { title: "What Was I Made For", artist: "Billie Eilish" },
  { title: "Rich Flex", artist: "Drake" },
  { title: "Watermelon Sugar", artist: "Harry Styles" },
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Levitating", artist: "Dua Lipa" },
  { title: "Heat Waves", artist: "Glass Animals" },
  { title: "Stay", artist: "The Kid LAROI" },
  { title: "good 4 u", artist: "Olivia Rodrigo" },
  { title: "Bad Habit", artist: "Steve Lacy" },
  { title: "About Damn Time", artist: "Lizzo" },
  { title: "First Class", artist: "Jack Harlow" },
  { title: "Sunflower", artist: "Post Malone" },
  { title: "Industry Baby", artist: "Lil Nas X" },
  { title: "Peaches", artist: "Justin Bieber" },
  { title: "Save Your Tears", artist: "The Weeknd" },
  { title: "Shivers", artist: "Ed Sheeran" },
  { title: "Easy On Me", artist: "Adele" },
  { title: "Ghost", artist: "Justin Bieber" },
  { title: "Super Shy", artist: "NewJeans" },
  { title: "Seven", artist: "Jung Kook" },
  { title: "Texas Hold 'Em", artist: "Beyonce" },
  { title: "Lose Control", artist: "Teddy Swims" },
  { title: "Espresso", artist: "Sabrina Carpenter" },
  { title: "Houdini", artist: "Dua Lipa" },
];

export function randomBillboardSong() {
  const i = Math.floor(Math.random() * BILLBOARD_HOT_100.length);
  return BILLBOARD_HOT_100[i];
}

export default BILLBOARD_HOT_100;
