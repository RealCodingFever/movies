import VerticalResults from '@/components/vertical-results';
import { useSearch } from '../../provider/search.provider';

export default function SearchResult() {
    const { results, loading, hasMore, handleLoadMore, query, typeLabel } = useSearch();

    // If there is no query, we generally don't show results unless we want to show some initial state?
    // In original code: {query && (...)}
    if (!query) return null;

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10 max-md:flex-col max-md:items-start max-md:gap-2">
                <h2 className="text-2xl font-semibold text-white m-0 max-md:text-xl">
                    {typeLabel} results for "{query}"
                </h2>
                {results.length > 0 && (
                    <span className="text-gray-400 text-sm font-medium">
                        {results.length} results found
                    </span>
                )}
            </div>

            <VerticalResults
                items={results}
                loading={loading && results.length === 0}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                emptyMessage={`No results found for "${query}". Try searching with different keywords or check your spelling.`}
                gridCols={6}
                showLoadMore={results.length > 0}
            />
        </div>
    );
}
