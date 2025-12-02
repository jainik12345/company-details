import pool from "../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT partners, booking FROM about_counting WHERE id = 1"
    );

    return Response.json({ status: "success", data: result.rows[0] });
  } catch (error) {
    return Response.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { partners, booking } = body;

    await pool.query(
      "UPDATE about_counting SET partners = $1, booking = $2, updated_at = NOW() WHERE id = 1",
      [partners, booking]
    );

    return Response.json({
      status: "success",
      message: "Updated successfully",
    });
  } catch (error) {
    return Response.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}
