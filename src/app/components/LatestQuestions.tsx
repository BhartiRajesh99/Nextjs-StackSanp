export const dynamic = "force-dynamic";

import QuestionCard from "@/components/QuestionCard";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";

export const LatestQuestions = async () => {
  const questions = await databases.listDocuments(db, questionCollection, [
    Query.limit(5),
    Query.orderDesc("$createdAt"),
  ]);

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1),
        ]),
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      };
    })
  );

  return (
    <div className="space-y-6">
      {questions.documents.map((question) => (
        <QuestionCard key={question.$id} ques={question} />
      ))}
    </div>
  );
};
