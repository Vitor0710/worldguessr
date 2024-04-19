export default async function findCountry({lat, lon}) {
  let data = null;
  try {
  const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
  data = await resp.json();
  } catch (e) {
    data = { address: { country: "Unknown" }}; // default to unknown
  }
  return data.address?.country ?? "Unknown";
}
  //https://nominatim.openstreetmap.org/reverse?lat=<value>&lon=<value>