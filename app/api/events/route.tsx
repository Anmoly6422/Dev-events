import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const file = formData.get("image") as File | null;

        if (!file) {
            return NextResponse.json(
                { message: "Image file is required" },
                { status: 400 }
            );
        }

        const rawEvent = Object.fromEntries(formData.entries());

        const tags = JSON.parse((rawEvent.tags as string) || "[]");
        const agenda = JSON.parse((rawEvent.agenda as string) || "[]");

        // remove non-db fields
        delete rawEvent.image;
        delete rawEvent.tags;
        delete rawEvent.agenda;

        // convert file → buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // upload to cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { resource_type: "image", folder: "DevEvent" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        const event = await Event.create({
            ...rawEvent,
            image: uploadResult.secure_url,
            tags,
            agenda,
        });

        return NextResponse.json(
            {
                message: "Event created successfully",
                event,
            },
            { status: 201 }
        );
    } catch (e: any) {
        console.error("EVENT ERROR:", e);

        return NextResponse.json(
            {
                message: "Event Creation Failed",
                error: e.message,
            },
            { status: 500 }
        );
    }
}