export function getRandomSentence() {
  const funnySentences = [
    "Oops! You thought you had admin powers? Think again! 😜",
    "Nice try, but no admin cape for you! 🦸‍♂️❌",
    "You must be lost! Admins only beyond this point. 🛑",
    "Did you just try to sneak into the admin panel? Naughty! 😏",
    "Sorry, only admins can pass. Maybe next time! 🚧",
    "Admin access denied! But hey, you look cool trying! 😎",
    "Accessing the admin panel is a no-no for you! 👮‍♂️",
    "Whoa there! Only superheroes with admin rights allowed! 🦸‍♀️",
    "Oops! Looks like your admin license expired! 🛑",
    "Not today, friend! Admin access is off-limits! 😬",
    "Are you an admin? No? Then... move along! 🚫",
    "This door is locked, and only admins have the key! 🔑",
    "Stop right there! Only admins beyond this point! 🚧",
    "Nice try, but only admins get the golden ticket! 🎫",
    "It’s a no from the admin squad! 🚫🙅‍♂️",
    "Access denied! Maybe try being an admin in your next life? 🤔"
  ];
  const randomIndex = Math.floor(Math.random() * funnySentences.length);
  return funnySentences[randomIndex];
}