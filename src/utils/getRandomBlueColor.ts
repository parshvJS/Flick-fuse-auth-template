export function getRandomBlueShade() {
    // Array of blue shades from dark to light
    const blueShades = [
      '#00008B', // DarkBlue
      '#0000CD', // MediumBlue
      '#0000FF', // Blue
      '#4169E1', // RoyalBlue
      '#4682B4', // SteelBlue
      '#1E90FF', // DodgerBlue
      '#6495ED', // CornflowerBlue
      '#00BFFF', // DeepSkyBlue
      '#87CEEB', // SkyBlue
      '#ADD8E6', // LightBlue
      '#B0E0E6', // PowderBlue
    ];
  
    // Pick a random blue shade
    const randomIndex = Math.floor(Math.random() * blueShades.length);
    const randomBlueShade = blueShades[randomIndex];
    console.log(randomBlueShade,"color");
    
    return randomBlueShade;
  }