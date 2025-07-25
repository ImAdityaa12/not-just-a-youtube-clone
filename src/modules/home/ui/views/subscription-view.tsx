import SubscriptionsVideosSection from '../sections/subscriptions-videos-section';

export const SubscriptionView = () => {
    return (
        <div className="mx-auto mb-10 px-5 pt-2.5 flex flex-col gap-y-6">
            <div>
                <h1 className="text-2xl font-bold">Subscriptions</h1>
                <p className="text-xs text-muted-foreground">
                    Your subscriptions videos
                </p>
            </div>
            <SubscriptionsVideosSection />
        </div>
    );
};
