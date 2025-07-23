import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

const Page = async ({
  params,
}: {
  params: { questionId: string; quesName: string };
}) => {
  const question = await databases.getDocument(
    db,
    questionCollection,
    params.questionId
  );

  return <EditQues question={question} />;
};

export default Page;
