import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "nextjs_assignment");
    const collection = db.collection("tests");
    const count = await collection.countDocuments();
    return Response.json({
      success: true,
      message: "MongoDB connection successful",
      database: db.databaseName,
      documents: count
    });
  } catch (error) {
    return Response.json({ success: false, message: "MongoDB connection failed", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "nextjs_assignment");
    const result = await db.collection("tests").insertOne({ message: body.message || "Test record", createdAt: new Date() });
    return Response.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
