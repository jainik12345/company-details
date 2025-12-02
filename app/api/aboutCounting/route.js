// import sql from "../../../lib/db";

// export async function GET() {
//   try {
//     const rows = await sql`
//       SELECT * FROM about_counting
//       WHERE deleted_at = 0
//       LIMIT 1
//     `;

//     return Response.json(
//       { status: "success", data: rows.length ? rows[0] : null },
//       { status: 200 }
//     );
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const { partners, booking } = await req.json();

//     if (!partners || !booking) {
//       return Response.json(
//         { error: "partners and booking fields are required" },
//         { status: 400 }
//       );
//     }

//     const exists = await sql`
//       SELECT id FROM about_counting
//       WHERE deleted_at = 0
//       LIMIT 1
//     `;

//     if (exists.length > 0) {
//       return Response.json({ error: "Record already exists" }, { status: 400 });
//     }

//     const result = await sql`
//       INSERT INTO about_counting (partners, booking, created_at, updated_at, deleted_at)
//       VALUES (${partners}, ${booking}, NOW(), NOW(), 0)
//       RETURNING id
//     `;

//     return Response.json(
//       { status: "success", insertedId: result[0].id },
//       { status: 201 }
//     );
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     const { partners, booking } = await req.json();

//     const rows = await sql`
//       SELECT id FROM about_counting
//       WHERE deleted_at = 0
//       LIMIT 1
//     `;

//     if (!rows.length) {
//       return Response.json(
//         { error: "No record found to update" },
//         { status: 404 }
//       );
//     }

//     await sql`
//       UPDATE about_counting
//       SET partners = ${partners}, booking = ${booking}, updated_at = NOW()
//       WHERE id = ${rows[0].id}
//     `;

//     return Response.json(
//       { status: "success", message: "Updated successfully" },
//       { status: 200 }
//     );
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

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
