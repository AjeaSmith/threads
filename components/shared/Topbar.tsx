import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";

import Image from "next/image";
import Link from "next/link";
import { dark } from "@clerk/themes";

const Topbar = () => {
	return (
		<nav className="topbar">
			<Link href="/" className="flex items-center gap-4">
				<Image
					src="/assets/logo.svg"
					alt="logo"
					width={28}
					height={28}
					className="size-[28px]"
				/>
				<p className="text-heading3-bold text-light-1 max-sx:hidden">Threads</p>
			</Link>

			<div className="flex items-center gap-1">
				<div className="block md:hidden">
					<SignedIn>
						<SignOutButton>
							<div className="flex cursor-pointer">
								<Image
									src="/assets/logout.svg"
									alt="logo"
									width={24}
									height={24}
								/>
							</div>
						</SignOutButton>
					</SignedIn>
				</div>
			</div>
			<OrganizationSwitcher
				appearance={{
					baseTheme: dark,
					elements: {
						organizationSwitcherTrigger: "py-2 px-4",
					},
				}}
			/>
		</nav>
	);
};

export default Topbar;
