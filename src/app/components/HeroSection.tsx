// import { HeroParallax } from "@/components/ui/hero-parallax";
// import { databases } from "@/models/server/config";
// import {
//   db,
//   questionAttachmentBucket,
//   questionCollection,
// } from "@/models/name";
// import { Query } from "node-appwrite";
// import slugify from "@/utils/slugify";
// import { storage } from "@/models/client/config";

import React from "react";
import HeroSectionHeader from "./HeroSectionHeader";
import { Footer } from "./Footer";
import { LatestQuestions } from "./LatestQuestions";
import TopContributers from "./TopContributers";

export default async function HeroSection() {
  // for hero parallax
  // const questions = await databases.listDocuments(db, questionCollection, [
  //   Query.orderDesc("$createdAt"),
  //   Query.limit(15),
  // ]);
  // console.log(
  //   storage.getFilePreview(
  //     questionAttachmentBucket,
  //     questions.documents[0].attachmentId
  //   )
  // );

  return (
    <>
      {/* <HeroParallax
        header={<HeroSectionHeader />}
        products={questions.documents.map((q) => ({
          title: q.title,
          link: `/questions/${q.$id}/${slugify(q.title)}`,
          thumbnail: storage.getFilePreview(
            questionAttachmentBucket,
            q.attachmentId
          ),
        }))}
      /> */}
      <HeroSectionHeader />
      <div className="flex flex-col md:flex-row w-full px-10 gap-20 md:gap-8 my-40">
        <div className="flex w-full md:w-[60%] flex-col">
          <h1 className="text-3xl text-center md:text-left mb-2">
            Latest Questions
          </h1>
          <LatestQuestions />
        </div>
        <div className="flex w-full md:w-[40%] flex-col">
          <h1 className="text-3xl text-center md:text-left mb-2">
            Top Contributers
          </h1>
          <TopContributers />
        </div>
      </div>
      <Footer />
    </>
  );
}
