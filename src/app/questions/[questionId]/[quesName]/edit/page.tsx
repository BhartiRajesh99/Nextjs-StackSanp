import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

interface PageProps {
  params: {
    questionId: string;
    quesName: string;
  };
}

const Page = async ({
  params,
}: PageProps) => {
  const question = await databases.getDocument(
    db,
    questionCollection,
    params.questionId
  );

  return <EditQues question={question} />;
};

export default Page;
