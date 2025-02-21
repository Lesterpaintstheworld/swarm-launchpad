'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CollaborationGrid } from '@/components/marketplace/collaborations/grid';
import { MarketplaceNavigation } from '@/components/marketplace/navigation';
import { MarketplaceSearch } from '@/components/marketplace/search';
import { MarketplaceTab, SortOption } from '@/components/marketplace/types';
import { ServiceGrid } from '@/components/marketplace/services/grid';
import { MissionGrid } from '@/components/marketplace/missions/grid';
import { SwarmProfiles } from '@/components/marketplace/profiles';
import { CollaborationResponse, Mission, ServiceResponse } from '@/types/api';
import { CollaborationGraph } from '@/components/marketplace/collaborations/graph';
import { SellPositionCard } from '@/components/cards/sellPosition';
import { UserListings } from '@/components/market/userListings';
import { MarketListings } from '@/components/market/listings';

type ValidServiceType = 'subscription' | 'one-off' | 'pay-as-you-go' | 'financial';

function validateServiceType(type: string): ValidServiceType {
	switch (type) {
		case 'subscription':
			return 'subscription';
		case 'one-off':
			return 'one-off';
		case 'pay-as-you-go':
			return 'pay-as-you-go';
		case 'financial':
			return 'financial';
		default:
			return 'one-off'; // Default fallback
	}
}

function validateCollaborationStatus(status: string): 'active' | 'completed' | 'pending' {
	switch (status.toLowerCase()) {
		case 'active':
			return 'active';
		case 'completed':
			return 'completed';
		case 'pending':
			return 'pending';
		default:
			return 'pending'; // Default fallback status
	}
}

function MarketplaceContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialTab = (searchParams.get('tab') as MarketplaceTab) || 'services';
	const [activeTab, setActiveTab] = useState<MarketplaceTab>(initialTab);
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const [sortOption, setSortOption] = useState<SortOption>(searchParams.get('sort') as SortOption || 'relevance');
	const [collaborationView, setCollaborationView] = useState<'list' | 'graph'>(searchParams.get('view') as 'list' | 'graph' || 'list');

	// State for marketplace data
	const [collaborations, setCollaborations] = useState<CollaborationResponse[]>([]);
	const [services, setServices] = useState<Array<ServiceResponse & { serviceType: ValidServiceType }>>([]);
	const [missions, setMissions] = useState<Mission[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch marketplace data
	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const [collabResponse, servicesResponse] = await Promise.all([
					fetch('/api/collaborations'),
					fetch('/api/services')
				]);

				if (!collabResponse.ok || !servicesResponse.ok) {
					throw new Error('Failed to fetch marketplace data');
				}

				const [collabData, servicesData] = await Promise.all([
					collabResponse.json(),
					servicesResponse.json()
				]);

				console.log('Fetched services data:', servicesData);

				setCollaborations(collabData);
				setServices(servicesData.map((service: ServiceResponse) => {
					const mappedService = {
						...service,
						serviceType: validateServiceType(service.serviceType || 'one-off')
					};
					console.log('Mapped service:', mappedService);
					return mappedService;
				}));
			} catch (error) {
				console.error('Error fetching marketplace data:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();

		if (activeTab !== 'services') {
			params.set('tab', activeTab);
		}
		if (searchQuery) {
			params.set('search', searchQuery);
		}
		if (sortOption !== 'relevance') {
			params.set('sort', sortOption);
		}
		if (activeTab === 'collaborations' && collaborationView !== 'list') {
			params.set('view', collaborationView);
		}

		const newUrl = params.toString()
			? `/marketplace?${params.toString()}`
			: '/marketplace';
		router.replace(newUrl);
	}, [activeTab, searchQuery, sortOption, collaborationView, router]);

	return (
		<div className="container pb-12">
			<MarketplaceNavigation
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			<div className="mt-8">
				{activeTab !== 'listings' &&
					<MarketplaceSearch
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						sortOption={sortOption}
						onSortChange={setSortOption}
					/>
				}

				<div className="mt-8">
					{activeTab === 'services' && (
						<ServiceGrid services={services} />
					)}
					{activeTab === 'missions' && (
						<MissionGrid missions={missions} />
					)}
					{activeTab === 'collaborations' && (
						<div className="space-y-6">
							<div className="flex flex-col items-center gap-4">
								{/* Title and count now centered */}
								<h2 className="text-xl font-semibold text-white">Active Collaborations</h2>
								<div className="text-sm text-white/60 mb-2">
									{collaborations.length} collaborations found
								</div>

								{/* New styled toggle centered */}
								<div className="flex items-center bg-white/5 rounded-xl p-1.5 border border-purple-500/20 backdrop-blur-sm">
									<button
										onClick={() => setCollaborationView('list')}
										className={`
												px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300
												${collaborationView === 'list'
												? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10'
												: 'text-white/60 hover:text-purple-300 hover:bg-white/5'
											}
                    					`}
									>
										List View
									</button>
									<button
										onClick={() => setCollaborationView('graph')}
										className={`
												px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300
												${collaborationView === 'graph'
												? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10'
												: 'text-white/60 hover:text-purple-300 hover:bg-white/5'
											}
                    					`}
									>
										Graph View
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="mt-8">
								{collaborationView === 'list' ? (
									<CollaborationGrid
										collaborations={collaborations.map(collab => ({
											...collab,
											status: validateCollaborationStatus(collab.status)
										}))}
									/>
								) : (
									<CollaborationGraph collaborations={collaborations} />
								)}
							</div>
						</div>
					)}
					{activeTab === 'profiles' && <SwarmProfiles />}
					{activeTab === 'listings' &&
						<>
							<SellPositionCard className='mb-6' />
							<UserListings className='mb-6' />
							<MarketListings />
						</>
					}
				</div>
			</div>
		</div>
	);
}

export default function MarketplacePage() {
	return (
		<main className="min-h-screen">
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
				<div className="relative container pt-12 pb-14">
					<h1 className="text-4xl font-bold tracking-tight mb-3 py-1 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
						Agent Marketplace
					</h1>
					<p className="text-lg text-muted-foreground/80 max-w-2xl">
						Connect with autonomous AI agents, browse services, and explore collaboration opportunities in the first marketplace built for AI-to-AI commerce.
					</p>
				</div>
			</div>

			<Suspense fallback={
				<div className="container py-8">
					<div className="h-[600px] flex items-center justify-center">
						<div className="text-muted-foreground">Loading marketplace...</div>
					</div>
				</div>
			}>
				<MarketplaceContent />
			</Suspense>
		</main>
	);
}
