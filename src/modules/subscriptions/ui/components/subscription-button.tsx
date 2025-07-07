import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

interface SubscriptionButtonProps {
    onClick: ButtonProps['onClick'];
    disabled: boolean;
    isSubscribed: boolean;
    className?: string;
    size?: ButtonProps['size'];
}

const SubscriptionButton = ({
    onClick,
    disabled,
    isSubscribed,
    className,
    size,
}: SubscriptionButtonProps) => {
    return (
        <Button
            variant={isSubscribed ? 'secondary' : 'default'}
            size={size}
            onClick={onClick}
            disabled={disabled}
            className={cn('rounded-full', className)}
        >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </Button>
    );
};

export default SubscriptionButton;
