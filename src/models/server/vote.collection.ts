import { Permission } from "node-appwrite";
import { voteCollection, db } from "../name";
import { databases } from "./config";

export default async function createVoteCollection(){
    // creating collection
    await databases.createCollection(db, voteCollection, voteCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("Vote Collection Created")

    //creating Attributes
    await Promise.all([
        databases.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true),
        databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
        databases.createEnumAttribute(db, voteCollection, "voteStatus", ['upvoted', "downvoted"], true),
        databases.createStringAttribute(db, voteCollection, "votedById", 50, true)
    ])
    console.log("vote attribute created");
}