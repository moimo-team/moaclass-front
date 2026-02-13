import { Outlet } from 'react-router-dom';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';

function MainLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-1 flex flex-col w-full px-4 md:px-32">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}

export default MainLayout;
