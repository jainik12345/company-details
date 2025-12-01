import db from "../config/db.js";

export const getAboutCounting = (req, res) => {
  db.query(
    "SELECT * FROM about_counting WHERE deleted_at = 0 LIMIT 1",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const data = results.length > 0 ? results[0] : null;
      res.status(200).json({ status: "success", data });
    }
  );
};

export const insertAboutCounting = (req, res) => {
  const { partners, booking } = req.body;

  if (partners === undefined || booking === undefined) {
    return res
      .status(400)
      .json({ error: "partners and booking fields are required" });
  }

  db.query(
    "SELECT * FROM about_counting WHERE deleted_at = 0 LIMIT 1",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ error: "Record already exists" });
      }

      db.query(
        `INSERT INTO about_counting 
        (partners, booking, created_at, updated_at, deleted_at)
        VALUES (?, ?, NOW(), NOW(), 0)`,
        [partners, booking],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          res.status(201).json({
            status: "success",
            message: "Inserted successfully",
            insertedId: result.insertId,
          });
        }
      );
    }
  );
};

export const updateAboutCounting = (req, res) => {
  const { partners, booking } = req.body;

  db.query(
    "SELECT * FROM about_counting WHERE deleted_at = 0 LIMIT 1",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(404).json({ error: "No record found to update" });
      }

      const id = results[0].id;

      db.query(
        `UPDATE about_counting
        SET partners = ?, booking = ?, updated_at = NOW()
        WHERE id = ?`,
        [partners, booking, id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.status(200).json({
            status: "success",
            message: "Updated successfully",
          });
        }
      );
    }
  );
};
