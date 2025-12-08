import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(req) {
  try {
    const result = await pool.query(
      "SELECT id, name, location, email, number, linkedin_link, company_website_link, created_at, updated_at FROM company_details WHERE deleted_at IS NULL ORDER BY id DESC"
    );
    return NextResponse.json({ status: "success", data: result.rows });
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      location,
      email,
      number,
      linkedin_link,
      company_website_link,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { status: "error", error: "Missing 'name' field" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO company_details (name, location, email, number, linkedin_link, company_website_link)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, location, email, number, linkedin_link, company_website_link, created_at, updated_at`,
      [
        name.trim(),
        location || null,
        email || null,
        number || null,
        linkedin_link || null,
        company_website_link || null,
      ]
    );

    return NextResponse.json(
      { status: "success", data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}
