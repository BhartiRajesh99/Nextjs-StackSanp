"use client";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import RTE from "@/components/RTE";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, questionCollection } from "@/models/name";
import { databases, storage } from "@/models/client/config";
import { useAuthStore } from "@/store/Auth";
import { ID, Models, Permission, Role } from "node-appwrite";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Accept an optional question prop
function QuestionForm({ question }: { question?: Models.Document }) {
  const router = useRouter();
  const { user } = useAuthStore();

  // Prefill state from question if present
  const [newAnswer, setNewAnswer] = React.useState(question?.content || "");
  const [tags, setTags] = React.useState<string[]>(question?.tags || []);
  const [tagInput, setTagInput] = React.useState("");
  const [title, setTitle] = React.useState(question?.title || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !user.$id) {
      toast.error("You must be logged in to ask a question.");
      return;
    }
    try {
      const formData = new FormData(e.currentTarget);
      const imageFile = formData.get("image") as File;
      let attachmentId = question?.attachmentId || "";
      if (imageFile && imageFile.size > 0) {
        // Upload file to Appwrite Storage
        const fileRes = await storage.createFile(
          "question-attachments", // your bucket ID, change if needed
          ID.unique(),
          imageFile
        );
        attachmentId = fileRes.$id;
      }
      const authorId = user.$id || "";
      if (!authorId || !title || !tags || !newAnswer) {
        toast.error("All fields are required");
        return;
      }
      if (question && question.$id) {
        // Edit mode: update document
        await databases.updateDocument(db, questionCollection, question.$id, {
          title,
          attachmentId,
          tags,
          authorId,
          content: newAnswer,
        });
        toast.success("Question updated");
      } else {
        // Create mode: create document
        await databases.createDocument(
          db,
          questionCollection,
          ID.unique(),
          {
            title,
            attachmentId,
            tags,
            authorId,
            content: newAnswer,
          },
          [
            Permission.read(Role.user(user.$id)),
            Permission.write(Role.user(user.$id)),
          ]
        );
        setNewAnswer("");
        setTags([]);
        setTagInput("");
        setTitle("");
        toast.success("Question added");
      }
      router.push("/questions");
    } catch (err: any) {
      toast.error("Error saving question");
    }
  };
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="my-20 mx-20 sm:my-30 sm:mx-20 md:mx-30 md:my-30">
          <h2 className="text-4xl mb-10 text-center font-semibold">
            {question ? "Edit Your Question" : "Ask a Question"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="p-6 bg-gray-900 m-4 flex flex-col gap-1 rounded-lg relative">
              <h3 className="text-lg">Title Address</h3>
              <p className="text-sm">
                Be specific and imagine you'r asking question to another person
              </p>
              <Input
                name="title"
                className="bg-black/70"
                placeholder="Type question here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="p-6 bg-gray-900 m-4 flex flex-col gap-1 rounded-lg">
              <h3 className="text-lg">What are the details of your problem?</h3>
              <p className="text-sm">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters
              </p>
              <RTE
                value={newAnswer}
                onChange={(value) => setNewAnswer(() => value || "")}
              />
            </div>

            <div className="p-6 bg-gray-900 m-4 flex flex-col gap-1 rounded-lg">
              <Label htmlFor="picture" className="text-lg">
                Image
              </Label>
              <p className="text-sm">
                Add image to your question to make it more clear and easier to
                understand
              </p>
              <Input
                name="image"
                id="picture"
                type="file"
                className="bg-black/70 h-auto text-white/60 file:text-amber-600 file:border-0 file:rounded file:cursor-pointer"
              />
            </div>

            <div className="p-6 bg-gray-900 m-4 flex flex-col gap-1 rounded-lg">
              <h3 className="text-lg">Tags</h3>
              <p className="text-sm">
                Add tags to describe what your question is about. Start typing
                to see suggestions
              </p>
              <div className="flex justify-center items-center gap-3">
                <Input
                  name="tags"
                  className="bg-black/70"
                  placeholder="(java c objective-c)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                      setTags((prev) => [...prev, tagInput.trim()]);
                      setTagInput("");
                    }
                  }}
                  className="px-7 py-2 hover:bg-amber-700 active:scale-95 cursor-pointer font-semibold rounded-3xl text-white bg-amber-600"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center px-3 py-1 bg-amber-700 text-white rounded-full text-xs gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-white hover:text-black focus:outline-none"
                        onClick={() =>
                          setTags(tags.filter((_, i) => i !== idx))
                        }
                        aria-label={`Remove tag ${tag}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 flex justify-center">
              <ShimmerButton className="active:scale-95">
                <span className="whitespace-pre-wrap px-8 py-1 text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  {question ? "Update" : "Publish"}
                </span>
              </ShimmerButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuestionForm;

// import QuestionForm from "@/components/QuestionForm";
// export default function Page(){
//   return <QuestionForm/>
// }
