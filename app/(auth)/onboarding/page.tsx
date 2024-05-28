import AccountProfile from "@/components/forms/AccountProfile";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
	const user = await currentUser();

	if (!user) redirect("/sign-in");

	// this will come from DB
	const userInfo = {};

	// data for account profile to use
	const userData = {
		id: user!.id,
		objectId: user!.id,
		username: user!.username || "",
		name: user!.firstName || "",
		bio: "",
		image: user!.imageUrl,
	};
	return (
		<main className="mx-auto px-10 py-20 flex flex-col max-w-3xl justify-start">
			<h1 className="head-text">Onboarding</h1>
			<p className="mt-3 text-base-regular text-light-2">
				Complete your profile now to use Threads
			</p>
			<section className="mt-9 bg-dark-2 p-10">
				<AccountProfile user={userData} btnTitle="Continue" />
			</section>
		</main>
	);
}
