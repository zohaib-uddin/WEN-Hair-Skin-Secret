import { NextResponse } from "next/server";

/**
 * Returns a standardized success API response footprint.
 */
export function successResponse(data: any, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Returns a standardized error API response footprint.
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}
