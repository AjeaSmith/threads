"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function UserCard({
	id,
	name,
	username,
	imgUrl,
	personType,
}: {
	id: string;
	name: string;
	username: string;
	imgUrl: string;
	personType: string;
}) {
	const router = useRouter();
	return (
		<article className="user-card">
			<div className="user-card_avatar">
				<Image
					className="rounded-full"
					src={imgUrl}
					alt="logo"
					width={48}
					height={48}
				/>

				<div className="flex-1 text-ellipsis">
					<h4 className="text-light-1 text-base-semibold">{name}</h4>
					<p className="text-small-medium text-gray-1">@{username}</p>
				</div>

				<Button
					className="user-card_btn"
					onClick={() => router.push(`/profile/${id}`)}
				>
					View
				</Button>
			</div>
		</article>
	);
}
