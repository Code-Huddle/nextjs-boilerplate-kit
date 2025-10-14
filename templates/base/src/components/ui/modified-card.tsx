// src/components/ui/modified-card.tsx

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ModifiedCardProps = {
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  badges?: string[];
  loading?: boolean;
  disabled?: boolean;
  secondaryButton?: {
    text: string;
    onClick: () => void;
    className?: string;
  };
  imageAspectRatio?: 'square' | 'video' | 'wide';
  variant?: 'default' | 'bordered' | 'minimal';
  className?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
  buttonClassName?: string;
  badgeClassName?: string;
};

// 1. Define an external default array so you don't set it inline.
const DEFAULT_BADGES: string[] = [];

export function ModifiedCard({
  imageSrc,
  title,
  description,
  buttonText,
  onButtonClick,
  badges = DEFAULT_BADGES, // Use the external constant
  loading = false,
  disabled = false,
  secondaryButton,
  imageAspectRatio = 'video',
  variant = 'default',
  className = '',
  imageWrapperClassName = '',
  imageClassName = '',
  headerClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  footerClassName = '',
  buttonClassName = '',
  badgeClassName = '',
}: ModifiedCardProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[2/1]',
  };

  const variantClasses = {
    default: 'bg-card border shadow-sm',
    bordered: 'border-2 border-primary',
    minimal: 'bg-transparent border-none shadow-none',
  };

  return (
    <Card
      className={cn(
        'w-64 overflow-hidden transition-all duration-200',
        variantClasses[variant],
        disabled && 'opacity-60 pointer-events-none',
        className,
      )}
    >
      {imageSrc && (
        <div
          className={cn(
            'relative',
            aspectRatioClasses[imageAspectRatio],
            imageWrapperClassName,
          )}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className={cn(
              'object-cover transition-transform duration-300',
              loading && 'animate-pulse',
              imageClassName,
            )}
            priority
          />
        </div>
      )}

      <CardHeader className={cn('space-y-2 p-4', headerClassName)}>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {badges.map(badge => (
              // 2. Use `badge` (assuming it's unique) as the key,
              //   rather than index to avoid `react/no-array-index-key`.
              <Badge
                key={badge}
                variant="secondary"
                className={cn('text-xs', badgeClassName)}
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        <CardTitle className={cn(
          'text-lg font-semibold line-clamp-1',
          titleClassName,
        )}
        >
          {title}
        </CardTitle>

        <CardDescription className={cn(
          'text-sm line-clamp-2',
          descriptionClassName,
        )}
        >
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className={cn(
        'p-4 pt-0 gap-2 flex-col',
        secondaryButton && 'flex-row',
        footerClassName,
      )}
      >
        <Button
          onClick={onButtonClick}
          className={cn(
            'w-full text-sm',
            loading && 'animate-pulse',
            buttonClassName,
          )}
          size="sm"
          disabled={disabled || loading}
        >
          {buttonText}
        </Button>

        {secondaryButton && (
          <Button
            onClick={secondaryButton.onClick}
            variant="outline"
            className={cn(
              'w-full text-sm',
              loading && 'animate-pulse',
              secondaryButton.className,
            )}
            size="sm"
            disabled={disabled || loading}
          >
            {secondaryButton.text}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export type { ModifiedCardProps };
