const express = require("express");
const router = express.Router();
const db = require("./database.js");

//distance Calculator function

const distanceCalc = (refLat, refLong, lat, long) => {
  const dLat = lat - refLat;
  const dLong = long - refLong;
  const avgLat = (refLat + lat) / 2;
  let res = Math.sqrt(
    Math.pow(dLat * 111, 2) +
      Math.pow(dLong * 111 * Math.cos((avgLat * Math.PI) / 180), 2)
  );
  return Math.ceil(res * 100) / 100;
};

//delete after stage 1
router.get("/", (req, res) => {
  res.send("test001");
});

//0001
//homepage GET
router.get("/home", async (req, res) => {
  let { refLat, refLong, strt, end } = req.query;
  refLat = parseFloat(refLat);
  refLong = parseFloat(refLong);

  if (isNaN(refLat) || isNaN(refLong)) {
    return res.status(400).send("Invalid latitude or longitude");
  }

  //remove unneccessary var before stage 1
  const q = `
WITH nearby_areas AS (
    SELECT *
    FROM parking_area
    WHERE location_lat BETWEEN ($1 - 50.0/111) AND ($1 + 50.0/111)
      AND location_long BETWEEN ($2 - 50.0/(111 * COS(RADIANS($1))))
                             AND ($2 + 50.0/(111 * COS(RADIANS($1))))
)
SELECT pl.lot_id, pl.public_code, pl.price,  pa.area_id, pa.location_lat, pa.location_long, pa.area_name
FROM parking_lots pl
JOIN nearby_areas pa ON pl.area_id = pa.area_id
WHERE pl.lot_id NOT IN (
    SELECT b.lot_id
    FROM bookings b
    WHERE b.booking_status IN ('confirmed', 'pending')
      AND b.start_time < $4
      AND b.end_time > $3
)`;

  // fetch filtered results from db
  try {
    let queryResult = await db.query(q, [refLat, refLong, strt, end]);

    const result = queryResult.rows.map((row) => ({
      ...row,
      distance: distanceCalc(
        refLat,
        refLong,
        row.location_lat,
        row.location_long
      ),
    }));

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error connecting to DB");
  }
});
//0002
//booking
router.post("/book", async (req, res) => {
  try {
    const { user_id, lot_id, start_time, end_time, booking_status } = req.body;

    // Example using PostgreSQL
    const q = `
      INSERT INTO bookings(user_id, lot_id, start_time, end_time, booking_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    await db.query(q, [user_id, lot_id, start_time, end_time, booking_status]);

    res.json({ messsage: "successfully booked" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to insert booking");
  }
});

//user profile
router.get("/profile", async (req, res) => {
  q = `SELECT pl.public_code, pa.area_name, b.start_time, b.end_time
FROM bookings b
JOIN parking_lots pl ON pl.lot_id = b.lot_id
JOIN parking_area pa ON pl.area_id = pa.area_id
WHERE b.user_id = $1 AND b.end_time > NOW();`;
  try {
    response = await db.query(q, ["U0000003"]);
    res.json(response.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Error connecting to DB`);
  }
});

//owner profile
router.get("/manager", async (req, res) => {
  q3 = `SELECT pa.area_name, pl.public_code, b.start_time, end_time 
FROM 
bookings b
JOIN parking_lots pl ON pl.lot_id = b.lot_id
JOIN parking_area pa ON pa.area_id = pl.area_id
WHERE pa.owner_id = $1
ORDER BY pa.area_id,pl.lot_id;`;
  try {
    response = await db.query(q3, ["owner001"]);
    res.json(response.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Error connecting to DB`);
  }
});
//booking
router.get("/book", async (req, res) => {
  const q4 = `
    INSERT INTO bookings(user_id, lot_id, start_time, end_time, booking_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  try {
    const result = await db.query(q4, [
      "U0000008",
      8,
      "2025-08-21 09:00:00",
      "2025-08-21 11:00:00",
      "confirmed",
    ]);
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to insert booking");
  }
});
module.exports = router;
