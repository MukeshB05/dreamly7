import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTVShowDetails, getWatchProviders, getBackdropUrl, getImageUrl } from '@/lib/tmdb';
import { formatDate } from '@/lib/utils';
import { CastRow, CircularRating, MediaActions, MoreLikeThis, StreamingSection } from '@/components/ui';

interface TVShowPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: TVShowPageProps): Promise<Metadata> {
  try {
    const show = await getTVShowDetails(parseInt(params.id, 10));
    return {
      title: show.name,
      description: show.overview,
      openGraph: {
        title: show.name,
        description: show.overview,
        images: show.poster_path
          ? [`https://image.tmdb.org/t/p/w500${show.poster_path}`]
          : [],
      },
    };
  } catch {
    return { title: 'TV Show Not Found' };
  }
}



export default async function TVShowPage({ params }: TVShowPageProps) {
  let show;
  let watchProviders = null;

  try {
    const tvId = parseInt(params.id, 10);
    const [showData, providersData] = await Promise.all([
      getTVShowDetails(tvId),
      getWatchProviders('tv', tvId).catch(() => null),
    ]);
    show = showData;
    const results = providersData?.results || {};
    watchProviders = results.IN || results.US || Object.values(results)[0] || null;
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
        <Image
          src={getBackdropUrl(show.backdrop_path)}
          alt={show.name}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

        {/* Mobile: Content inside hero */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:hidden">
          <div className="flex items-end gap-4">
            {/* Mobile Poster */}
            <div className="flex-shrink-0 w-24 sm:w-32">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <Image
                  src={getImageUrl(show.poster_path, 'w342')}
                  alt={show.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="128px"
                />
                {/* Rating on Poster */}
                <div className="absolute top-2 right-2">
                  <CircularRating rating={show.vote_average} size="sm" />
                </div>
              </div>
            </div>
            {/* Mobile Title Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-primary/90 rounded-full text-[10px] font-semibold text-white uppercase">
                  TV Series
                </span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-white/70">
                  {show.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white line-clamp-2">
                {show.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                <span>{formatDate(show.first_air_date)}</span>
                <span>•</span>
                <span>{show.number_of_seasons}S • {show.number_of_episodes}E</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Floating info overlay */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 p-8 lg:p-12 xl:p-16">
          <div className="max-w-7xl mx-auto flex gap-8 items-end">
            {/* Desktop Poster Card */}
            <div className="flex-shrink-0 w-48 lg:w-56 xl:w-64">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
                <Image
                  src={getImageUrl(show.poster_path, 'w500')}
                  alt={show.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="256px"
                />
                {/* Rating on Poster */}
                <div className="absolute top-3 right-3">
                  <CircularRating rating={show.vote_average} size="md" />
                </div>
              </div>
            </div>

            {/* Desktop Title & Quick Info */}
            <div className="flex-1 space-y-4 pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white uppercase tracking-wide">
                  TV Series
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/80">
                  {show.status}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight">
                {show.name}
              </h1>

              {show.tagline && (
                <p className="text-base lg:text-lg text-white/60 italic font-light">
                  &ldquo;{show.tagline}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
                <span>{formatDate(show.first_air_date)}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{show.number_of_episodes} Episode{show.number_of_episodes !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16">
          {/* Content Grid */}
          <div className="pt-6 md:pt-8">
            {/* Details Section */}
            <div className="space-y-6 md:space-y-8">
              {/* Mobile Tagline */}
              {show.tagline && (
                <p className="md:hidden text-sm text-white/60 italic">
                  &ldquo;{show.tagline}&rdquo;
                </p>
              )}

              <StreamingSection
                mediaId={show.id}
                mediaType="tv"
                title={show.name}
                overview={show.overview}
                voteAverage={show.vote_average}
                genres={show.genres}
                posterPath={show.poster_path}
                backdropPath={show.backdrop_path}
                seasons={show.seasons}
                watchProviders={watchProviders}
              />

              {/* Networks */}
              {show.networks && show.networks.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-xs sm:text-sm font-medium text-white/50 uppercase tracking-wider">Networks</h3>
                  <div className="flex flex-wrap gap-2">
                    {show.networks.map((network) => (
                      <Link
                        key={network.id}
                        href={`/network/${network.id}`}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs sm:text-sm text-white/70 hover:text-white transition-all border border-white/5 hover:border-white/10"
                      >
                        {network.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Created By */}
              {show.created_by && show.created_by.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-xs sm:text-sm font-medium text-white/50 uppercase tracking-wider">Created By</h3>
                  <div className="flex flex-wrap gap-2">
                    {show.created_by.map((creator) => (
                      <span
                        key={creator.id}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 rounded-xl text-xs sm:text-sm text-white/80 border border-white/5"
                      >
                        {creator.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cast Section */}
          {show.credits?.cast && show.credits.cast.length > 0 && (
            <div className="mt-10 sm:mt-12 lg:mt-16">
              <CastRow cast={show.credits.cast} />
            </div>
          )}

          {/* More Like This - Infinite Scroll */}
          {((show.recommendations?.results && show.recommendations.results.length > 0) ||
            (show.similar?.results && show.similar.results.length > 0)) && (
            <MoreLikeThis
              mediaId={show.id}
              mediaType="tv"
              initialItems={[
                ...(show.recommendations?.results || []),
                ...(show.similar?.results || []),
              ]
                .filter((item, index, self) =>
                  index === self.findIndex((t) => t.id === item.id)
                )
                .slice(0, 12)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
