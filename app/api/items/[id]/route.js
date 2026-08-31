import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

const databaseName = process.env.MONGODB_DB || "nextjs_assignment";

function getObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const objectId = getObjectId(id);
    if (!objectId) return Response.json({ success: false, error: "Invalid item ID" }, { status: 400 });

    const body = await request.json();
    const name = body.name?.trim();
    const description = body.description?.trim();
    if (!name || !description) {
      return Response.json({ success: false, error: "Name and description are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const result = await client.db(databaseName).collection("items").updateOne(
      { _id: objectId, status: { $ne: "DELETED" } },
      { $set: { name, description, updatedAt: new Date() } },
    );

    if (!result.matchedCount) return Response.json({ success: false, error: "Active item not found" }, { status: 404 });
    return Response.json({ success: true, message: "Item updated" });
  } catch (error) {
    console.error("PUT /api/items/:id failed", error);
    return Response.json({ success: false, error: "Unable to update item" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const objectId = getObjectId(id);
    if (!objectId) return Response.json({ success: false, error: "Invalid item ID" }, { status: 400 });

    const client = await clientPromise;
    const result = await client.db(databaseName).collection("items").updateOne(
      { _id: objectId, status: { $ne: "DELETED" } },
      { $set: { status: "DELETED", deletedAt: new Date(), updatedAt: new Date() } },
    );

    if (!result.matchedCount) return Response.json({ success: false, error: "Active item not found" }, { status: 404 });
    return Response.json({ success: true, message: "Item soft deleted", status: "DELETED" });
  } catch (error) {
    console.error("DELETE /api/items/:id failed", error);
    return Response.json({ success: false, error: "Unable to delete item" }, { status: 500 });
  }
}
