const axios = require('axios');
const { DateTime } = require('luxon'); // npm install luxon

exports.getSuggestion = async (req, res) => {
  const { pilot, date, time } = req.body;

  const start = date;
  const end = date;

  const lat = 13.3478;
  const lon = 74.7923;

  try {
    // Parse local flight time
    const flightDateTime = DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', {
      zone: 'Asia/Kolkata',
    });
    console.log("Flight DateTime:", flightDateTime.toString());

    // Convert to UTC and round down to the nearest hour
    const targetHourUTC = flightDateTime
      .toUTC()
      .startOf('hour')
      .toFormat("yyyy-MM-dd'T'HH:00");

    console.log("Target Hour in UTC:", targetHourUTC);

    // Call Open-Meteo
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m,precipitation_probability,cloudcover&timezone=UTC&start_date=${start}&end_date=${end}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    const index = data.hourly.time.findIndex((t) => t === targetHourUTC);
    console.log("Data received from API:", data);
    console.log("Target Hour in Data:", targetHourUTC);
    console.log("Index found:", index);

    if (index === -1) {
      return res.json({
        message: `Hi ${pilot}, we couldn't find weather data for your scheduled time (${date} at ${time}). Try a different time.`,
      });
    }

   
    const wind_kmh = data.hourly.wind_speed_10m[index];
    const wind = (wind_kmh / 3.6).toFixed(2);
    const rain = data.hourly.precipitation_probability[index];
    const clouds = data.hourly.cloudcover[index];
    const temp = data.hourly.temperature_2m[index];

    console.log("Weather Data:", { wind, rain, clouds, temp });

    let message = `Hi ${pilot}, here’s your flight weather report for ${date} at ${time}:\n\n`;
    message += `🌬 Wind Speed: ${wind} m/s\n☁ Cloud Cover: ${clouds}%\n☔ Rain Probability: ${rain}%\n🌡 Temperature: ${temp}°C\n\n`;

    let issues = [];

    // Weather-related issues
    if (wind > 6.1) issues.push("⚠️ Wind is high — flight may be unstable.");
    if (rain > 30) issues.push("☔ Rain chance is high — not recommended.");
    if (clouds > 70) issues.push("☁️ Dense clouds may affect navigation.");
    if (temp < 10 || temp > 35) issues.push("🌡️ Temperature may impact battery performance.");

    // New: Light condition check
    const flightHour = flightDateTime.hour;
    if (flightHour < 6 || flightHour > 18) {
      issues.push("🌙 It's dark around this time — avoid flying due to low visibility.");
    }

    if (issues.length > 0) {
      message += issues.join("\n");
    } else {
      message += "✅ Weather looks good — safe to fly!";
    }

    return res.json({ message });

  } catch (err) {
    console.error("Error fetching weather:", err);
    return res.status(500).json({ message: "Something went wrong while fetching weather data." });
  }
};
