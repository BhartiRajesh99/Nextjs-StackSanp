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
    //grab the data
    const { votedById, voteStatus, type, typeId } = await request.json();
    //list document
    const response = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);
    if (response.documents.length > 0) {
      await databases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );

      //decrease reputation
      const QuestionOrAnswer = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );
      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authorId
      );
      await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
        reputation:
          Number(authorPrefs.reputation) === 0
            ? 0
            : Number(authorPrefs.reputation) - 1,
      });
    }

    //previous vote doesn't exist or vote status changes
    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databases.createDocument(
        db,
        voteCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteStatus,
          votedById,
        }
      );

      //increase or decrease the reputation of question answer author accordingly
      const QuestionOrAnswer = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );
      const authorPrefs = await users.getPrefs<UserPrefs>(
        QuestionOrAnswer.authorId
      );
      // if vote was present
      if (response.documents[0]) {
        await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
          reputation:
            // prev vote was 'upvoted' and new value is 'downvoted' so we have to decrease the reputation
            response.documents[0].voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) === 0
                ? 0
                : Number(authorPrefs.reputation) - 1
              : Number(authorPrefs.reputation) + 1,
        });
      } else {
        await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
          reputation:
            //prev vote was 'upvoted' and new value is 'downvoted' so we have to decrease the reputation
            voteStatus === "upvoted"
              ? Number(authorPrefs.reputation) + 1
              : Number(authorPrefs.reputation) === 0
              ? 0
              : Number(authorPrefs.reputation) - 1,
        });
      }

      const [upvotes, downvotes] = await Promise.all([
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "upvoted"),
          Query.equal("votedById", votedById),
          Query.limit(1), // for optimization as we only need total
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "downvoted"),
          Query.equal("votedById", votedById),
          Query.limit(1), // for optimization as we only need total
        ]),
      ]);

      return NextResponse.json(
        {
          data: {
            document: doc,
            upvotes: upvotes.total,
            downvotes: downvotes.total,
          },
          message: response.documents[0] ? "Vote Status Updated" : "Voted",
        },
        {
          status: 201,
        }
      );
    }

    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: null,
          upvotes: upvotes.total,
          downvotes: downvotes.total,
        },
        message: "vote handled",
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
