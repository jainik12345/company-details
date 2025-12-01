import db from "../../../../lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM about_counting WHERE deleted_at = 0 LIMIT 1"
    );

    return Response.json(
      { status: "success", data: rows.length ? rows[0] : null },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { partners, booking } = await req.json();

    if (!partners || !booking) {
      return Response.json(
        { error: "partners and booking fields are required" },
        { status: 400 }
      );
    }

    const [exists] = await db.query(
      "SELECT id FROM about_counting WHERE deleted_at = 0 LIMIT 1"
    );

    if (exists.length > 0) {
      return Response.json({ error: "Record already exists" }, { status: 400 });
    }

    const [result] = await db.query(
      `INSERT INTO about_counting (partners, booking, created_at, updated_at, deleted_at)
       VALUES (?, ?, NOW(), NOW(), 0)`,
      [partners, booking]
    );

    return Response.json(
      { status: "success", insertedId: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { partners, booking } = await req.json();

    const [rows] = await db.query(
      "SELECT id FROM about_counting WHERE deleted_at = 0 LIMIT 1"
    );

    if (!rows.length) {
      return Response.json(
        { error: "No record found to update" },
        { status: 404 }
      );
    }

    await db.query(
      `UPDATE about_counting 
       SET partners = ?, booking = ?, updated_at = NOW()
       WHERE id = ?`,
      [partners, booking, rows[0].id]
    );

    return Response.json(
      { status: "success", message: "Updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
