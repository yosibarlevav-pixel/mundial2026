const apiKey = "8cd3bb65077527347f791e8fdc4b3b7e";
const url = "https://v3.football.api-sports.io/fixtures?league=1&season=2026";

console.log("Fetching url:", url);
fetch(url, {
  headers: {
    "x-apisports-key": apiKey
  }
})
.then(res => {
  console.log("Status:", res.status);
  return res.json();
})
.then(data => {
  console.log("API Response Keys:", Object.keys(data));
  console.log("Errors:", data.errors);
  console.log("Results count:", data.results);
  if (data.response) {
    console.log("Response length:", data.response.length);
    if (data.response.length > 0) {
      console.log("First 3 items (sample):", JSON.stringify(data.response.slice(0, 3), null, 2));
    }
  }
})
.catch(err => console.error("Error:", err));
