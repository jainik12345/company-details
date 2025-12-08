// app/api/company/[id]/route.js
import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(request, { params }) {
  console.log("=== API HIT /api/company/[id] ===");

  const resolvedParams = await params;
  console.log("Resolved params:", resolvedParams);

  const rawId = resolvedParams?.id;
  console.log("params.id:", rawId, typeof rawId);

  if (!rawId) {
    console.log("❌ NO ID FOUND");
    return NextResponse.json(
      { status: "error", error: "No ID in URL" },
      { status: 400 }
    );
  }

  const id = parseInt(rawId, 10);
  if (isNaN(id) || id <= 0) {
    console.log("❌ INVALID ID:", rawId);
    return NextResponse.json(
      { status: "error", error: `Invalid ID: ${rawId}` },
      { status: 400 }
    );
  }

  try {
    console.log("🔍 Querying DB for id:", id);

    const result = await pool.query(
      "SELECT id, name, location, email, number, linkedin_link, company_website_link, created_at, updated_at FROM company_details WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );

    console.log("✅ Rows found:", result.rows.length);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { status: "error", error: "Company not found or deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ DB Error:", err);
    return NextResponse.json(
      { status: "error", error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  const id = parseInt(rawId || "0", 10);

  if (isNaN(id) || id <= 0) {
    return NextResponse.json(
      { status: "error", error: `Invalid ID: ${rawId || "missing"}` },
      { status: 400 }
    );
  }

  const body = await request.json();
  try {
    const result = await pool.query(
      `UPDATE company_details SET
        name=$1, location=$2, email=$3, number=$4, linkedin_link=$5,
        company_website_link=$6, updated_at=NOW()
       WHERE id=$7 AND deleted_at IS NULL RETURNING id`,
      [
        body.name?.trim() || null,
        body.location || null,
        body.email || null,
        body.number || null,
        body.linkedin_link || null,
        body.company_website_link || null,
        id,
      ]
    );

    return result.rows.length > 0
      ? NextResponse.json({ status: "success" })
      : NextResponse.json(
          { status: "error", error: "Company not found" },
          { status: 404 }
        );
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { status: "error", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  const id = parseInt(rawId || "0", 10);

  if (isNaN(id) || id <= 0) {
    return NextResponse.json(
      { status: "error", error: `Invalid ID: ${rawId || "missing"}` },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      "UPDATE company_details SET deleted_at=NOW() WHERE id=$1 AND deleted_at IS NULL RETURNING id",
      [id]
    );

    return result.rows.length > 0
      ? NextResponse.json({ status: "success" })
      : NextResponse.json(
          { status: "error", error: "Company not found" },
          { status: 404 }
        );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { status: "error", error: err.message },
      { status: 500 }
    );
  }
}
