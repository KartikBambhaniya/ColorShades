// JavaScript logic
const hueSlider = document.getElementById("hue-slider");
const selectedHue = document.getElementById("selected-hue");
const selectedColorPreview = document.getElementById("selected-color-preview");
const selectedColorCode = document.getElementById("selected-color-code");
const colorShadesContainer = document.getElementById("color-shades");

hueSlider.addEventListener("input", updateColorShades);

function updateColorShades() {
  const hueValue = hueSlider.value;
  updateSelectedHueIndicator(hueValue); // Update the selected hue indicator

  const selectedColor = calculateColor(hueValue); // Update the selected color preview and code
  updateSelectedColor(selectedColor);

  generateColorShades(hueValue); // Generate and display color shades
}

function calculateColor(hue) {
  const hueDegrees = hue * 3.6; // Convert hue value to degrees
  const rgb = hslToRgb(hueDegrees, 100, 50); // Calculate RGB values based on the hue
  const hex = rgbToHex(rgb[0], rgb[1], rgb[2]); // Convert RGB to hex
  return hex;
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function generateColorShades(hue) {
  colorShadesContainer.innerHTML = ""; // Clear previous shades

  const numShades = 25; // Number of shades to generate

  for (let i = 0; i < numShades; i++) {
    const lightness = (i + 1) * 4; // Calculate lightness for each shade
    const shadeColor = calculateColorShade(hue, lightness); // Calculate the color for the shade
    const shadeDiv = document.createElement("div"); // Create a div for the shade
    shadeDiv.className =
      "shade d-flex flex-column justify-content-center align-items-center w-100";
    shadeDiv.style.backgroundColor = shadeColor;
    shadeDiv.style.color = getContrastColor(shadeColor);

    const hexCodeSpan = document.createElement("span"); // Create a span for the hex code
    hexCodeSpan.textContent = shadeColor;
    shadeDiv.appendChild(hexCodeSpan); // Append the hex code span to the shade div

    // Add a click event to copy the hex code to the clipboard
    shadeDiv.addEventListener("click", () => {
      copyToClipboard(shadeColor, hexCodeSpan);
    });

    colorShadesContainer.appendChild(shadeDiv); // Append the shade div to the container
  }
}

function calculateColorShade(hue, lightness) {
  const hueDegrees = hue * 3.6; // Convert hue value to degrees
  const rgb = hslToRgb(hueDegrees, 100, lightness); // Calculate RGB values based on the hue
  const hex = rgbToHex(rgb[0], rgb[1], rgb[2]); // Convert RGB to hex
  return hex;
}

function getContrastColor(hexColor) {
  const rgb = hexToRgb(hexColor); // Convert hex color to RGB
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255; // Calculate luminance
  return luminance > 0.5 ? "#000" : "#fff"; // Use white or black text based on luminance
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16); // Remove the hash and parse the hex values
  const r = (bigint >> 16) & 255; // Extract RGB components
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function updateSelectedHueIndicator(hue) {
  const indicatorPosition = (hue / 100) * hueSlider.clientWidth; // Calculate the position of the selected hue indicator
  selectedHue.style.left = `${indicatorPosition}px`;
}

function updateSelectedColor(hexColor) {
  selectedColorPreview.style.backgroundColor = hexColor; // Update the selected color preview
  selectedColorCode.textContent = hexColor; // Update the selected color code
}

// Copy Hex code
function copyToClipboard(text, element) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  // Create a popover to show the message
  $(element).popover({
    content: 'Hex Copied !!',
    placement: 'top',
    trigger: 'manual'
  });

  $(element).popover('show');

  // Hide the popover after a short delay
  setTimeout(() => {
    $(element).popover('hide');
  }, 2000);
}
