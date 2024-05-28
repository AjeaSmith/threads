"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";

type Params = {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
};
export async function createThread({
	text,
	author,
	communityId,
	path,
}: Params) {
	connectToDB();
	try {
		const createdThread = await Thread.create({
			text,
			author,
			communityId,
		});

		// set threads to user that created it
		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThread._id },
		});

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread ${error.message}`);
	}
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
	connectToDB();

	try {
		// skip amount for pagination
		const skipAmount = (pageNumber - 1) * pageSize;

		// Fetch threads that has no parents (top level threads..., no comments involved)
		const threadQuery = Thread.find({
			parentId: { $in: [null, undefined] },
		})
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(pageSize)
			.populate({ path: "author", model: User })
			.populate({
				path: "children",
				populate: {
					path: "author",
					model: User,
					select: "_id name parentId image",
				},
			});

		const totalThreadCount = await Thread.countDocuments({
			parentId: { $in: [null, undefined] },
		});

		const threads = await threadQuery.exec();

		const isNext = totalThreadCount > skipAmount + threads.length;

		return {
			threads,
			isNext,
		};
	} catch (error: any) {
		throw new Error(`Failed to fetch threads: ${error.message}`);
	}
}

export async function fetchThreadById(id: string) {
	connectToDB();

	try {
		const thread = await Thread.findById(id)
			.populate({
				path: "author",
				model: User,
				select: "_id id name image",
			}) // Populate the author field with _id and username
			.populate({
				path: "children",
				populate: [
					{
						path: "author",
						model: User,
						select: "_id id name parentId image",
					},
					{
						path: "children",
						model: Thread,
						populate: {
							path: "author",
							model: User,
							select: "_id id name parentId image",
						},
					},
				],
			})
			.exec();

		return thread;
	} catch (error: any) {
		throw new Error(`Failed to fetch thread ${id}: ${error.message}`);
	}
}

export async function addCommentToThread(
	threadId: string,
	commentText: string,
	userId: string,
	path: string
) {
	connectToDB();
	try {
		// Find the original thread by ID
		const originalThread = await Thread.findById(threadId);
		if (!originalThread) {
			throw new Error("Thread not found");
		}

		// create new thread with comment text
		const commentThread = new Thread({
			text: commentText,
			author: userId,
			parentId: threadId,
		});

		// save the new thread
		const savedCommentThread = await commentThread.save();

		// update the original thread to include the comment
		originalThread.children.push(savedCommentThread._id);

		// save originalThread
		await originalThread.save();

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(
			`Failed to comment on thread ${threadId}: ${error.message}`
		);
	}
}
