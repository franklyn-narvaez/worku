import { prisma } from '@/libs/db'
import { NextResponse } from "next/server";


export async function GET(){
  try{
      const colleges = await prisma.college.findMany();
      return NextResponse.json(colleges);
  }catch(error){
      console.error("Error fetching colleges:", error);
      return NextResponse.json({ error: "Error fetching colleges" }, { status: 500 });
  }
}