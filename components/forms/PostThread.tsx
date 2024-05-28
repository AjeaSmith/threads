"use client";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";

type Props = {
	userId: string;
};

export default function PostThread({ userId }: Props) {
	const pathname = usePathname();
	const router = useRouter();
	const { organization } = useOrganization();

	const form = useForm({
		resolver: zodResolver(ThreadValidation),
		defaultValues: {
			thread: "",
			accountId: userId,
		},
	});

	const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
		// TODO: Create thread

		await createThread({
			text: values.thread,
			author: userId,
			communityId: organization ? organization.id : null,
			path: pathname,
		});

		router.push("/");
	};

	return (
		<div className="text-light-3">
			<Form {...form}>
				<form
					className="mt-10 flex flex-col justify-start gap-10"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="thread"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormLabel className="text-base-semibold text-light-2">
									Content
								</FormLabel>
								<FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
									<Textarea rows={15} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="bg-primary-500">
						Post Thread
					</Button>
				</form>
			</Form>
		</div>
	);
}
