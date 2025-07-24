import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    const { votedById, voteStatus, type, typeId } = await request.json();

    // Check for existing vote by the same user
    const existingVotes = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);
    const existingVote = existingVotes.documents[0];

    // Get document (question or answer) and its author
    const content = await databases.getDocument(
      db,
      type === "question" ? questionCollection : answerCollection,
      typeId
    );
    const authorPrefs = await users.getPrefs<UserPrefs>(content.authorId);
    let updatedReputation = Number(authorPrefs.reputation);

    let actionMessage = "vote handled";

    // CASE 1: Vote exists and same as incoming → unvote (remove it)
    if (existingVote && existingVote.voteStatus === voteStatus) {
      await databases.deleteDocument(db, voteCollection, existingVote.$id);

      updatedReputation += voteStatus === "upvoted" ? -1 : 1;
      actionMessage = "Vote removed";
    }
    // CASE 2: Vote exists but changed → update it (flip)
    else if (existingVote) {
      await databases.updateDocument(db, voteCollection, existingVote.$id, {
        voteStatus,
      });

      updatedReputation += voteStatus === "upvoted" ? 2 : -2;
      actionMessage = "Vote updated";
    }
    // CASE 3: No vote exists → new vote
    else {
      await databases.createDocument(db, voteCollection, ID.unique(), {
        type,
        typeId,
        voteStatus,
        votedById,
      });

      updatedReputation += voteStatus === "upvoted" ? 1 : -1;
      actionMessage = "Voted";
    }

    // Update author's reputation
    await users.updatePrefs<UserPrefs>(content.authorId, {
      reputation: updatedReputation,
    });

    // Get net vote count (can be optimized further, but okay for now)
    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          voteResult: upvotes.total - downvotes.total,
        },
        message: actionMessage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Error in voting" },
      { status: error?.status || error?.code || 500 }
    );
  }
}
