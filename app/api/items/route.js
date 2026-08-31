import clientPromise from "../../../lib/mongodb";

const databaseName = process.env.MONGODB_DB || "nextjs_assignment";

export async function GET() {
  try {
    const client = await clientPromise;
    const items = await client
      .db(databaseName)
      .collection("items")
      .find({ status: { $ne: "DELETED" } })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({ success: true, data: items });
  } catch (error) {
    console.error("GET /api/items failed", error);
    return Response.json({ success: false, error: "Unable to load items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const description = body.description?.trim();

    if (!name || !description) {
      return Response.json({ success: false, error: "Name and description are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const item = {
      name,
      description,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    const result = await client.db(databaseName).collection("items").insertOne(item);

    return Response.json({ success: true, data: { ...item, _id: result.insertedId } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/items failed", error);
    return Response.json({ success: false, error: "Unable to create item" }, { status: 500 });
  }
}
