'use client';

import Header from '../components/Header';

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='min-h-screen flex flex-col'>
			<Header />
			<main className='flex-grow container-custom py-4'>{children}</main>
		</div>
	);
}
