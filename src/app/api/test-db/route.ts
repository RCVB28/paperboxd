import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      users: userCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed.",
      },
      {
        status: 500,
      },
    );
  }
}
