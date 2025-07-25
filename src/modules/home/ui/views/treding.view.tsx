import TrendingVideosSection from '../sections/trending-videos-section';

export const TrendingView = () => {
    return (
        <div className="mx-auto mb-10 px-5 pt-2.5 flex flex-col gap-y-6">
            <div>
                <h1 className="text-2xl font-bold">Trending</h1>
                <p className="text-xs text-muted-foreground">
                    Most Popular videos at this moment
                </p>
            </div>
            <TrendingVideosSection />
        </div>
    );
};
