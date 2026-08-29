'use client';

import Image from 'next/image';
import { WatchProviderCountry } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';

interface WatchProvidersSectionProps {
  providers: WatchProviderCountry | null;
}

export function WatchProvidersSection({ providers }: WatchProvidersSectionProps) {
  if (!providers) return null;

  const flatrate = providers.flatrate || [];
  const rent = providers.rent || [];
  const buy = providers.buy || [];

  const hasAnyProvider = flatrate.length > 0 || rent.length > 0 || buy.length > 0;
  if (!hasAnyProvider) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-4 sm:h-5 bg-primary rounded-full" />
          Where to Watch
        </h2>
        {providers.link && (
          <a
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
          >
            Powered by JustWatch
          </a>
        )}
      </div>

      <div className="space-y-4 bg-zinc-900/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
        {/* Stream / Subscription */}
        {flatrate.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Stream</h3>
            <div className="flex flex-wrap gap-2.5">
              {flatrate.map((provider) => (
                <div
                  key={`flatrate-${provider.provider_id}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                    <Image
                      src={getImageUrl(provider.logo_path, 'w92')}
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white/90">
                    {provider.provider_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {rent.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Rent</h3>
            <div className="flex flex-wrap gap-2.5">
              {rent.map((provider) => (
                <div
                  key={`rent-${provider.provider_id}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                    <Image
                      src={getImageUrl(provider.logo_path, 'w92')}
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white/90">
                    {provider.provider_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buy */}
        {buy.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Buy</h3>
            <div className="flex flex-wrap gap-2.5">
              {buy.map((provider) => (
                <div
                  key={`buy-${provider.provider_id}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                    <Image
                      src={getImageUrl(provider.logo_path, 'w92')}
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white/90">
                    {provider.provider_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
