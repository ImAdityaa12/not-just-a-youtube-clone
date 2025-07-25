import SubscriptionsSectionSection from '../sections/subscriptions-section';

export const SubscriptionsView = () => {
    return (
        <div className="max-w-screen-md mx-auto mb-10 px-5 pt-2.5 flex flex-col gap-y-6">
            <div>
                <h1 className="text-2xl font-bold">Subscriptions</h1>
                <p className="text-xs text-muted-foreground">
                    Channels you have subscribed to
                </p>
            </div>
            <SubscriptionsSectionSection />
        </div>
    );
};
