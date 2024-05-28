import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect("/onboarding");

	const results = await fetchThreads(
		searchParams.page ? +searchParams.page : 1,
		30
	);

	return (
		<main>
			<h1 className="head-text text-left">Home</h1>
			<section className="mt-9 flex flex-col gap-10">
				{results.threads.length === 0 ? (
					<p className="no-result">No Threads found</p>
				) : (
					<>
						{results.threads.map((thread) => (
							<ThreadCard
								key={thread._id}
								id={thread._id}
								currentUserId={user.id}
								parentId={thread.parentId}
								content={thread.text}
								author={thread.author}
								community={thread.community}
								createdAt={thread.createdAt}
								comments={thread.children}
							/>
						))}
					</>
				)}
			</section>
		</main>
	);
}
