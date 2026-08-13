import { useSearch } from '../../provider/search.provider';

export default function SearchForm() {
    const { query, setQuery, loading, searchType, setSearchType } = useSearch();

    return (
        <div className="text-center mb-12">
            <form className="max-w-[600px] mx-auto max-md:px-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-3 items-stretch">
                    {/* Content-type toggle — matches the navbar popup */}
                    <div className="flex items-center justify-center gap-2 self-center bg-white/5 border border-white/10 rounded-full p-1">
                        {[
                            { id: 'all', label: 'Movies & TV' },
                            { id: 'anime', label: 'Anime' },
                        ].map((opt) => (
                            <button
                                type="button"
                                key={opt.id}
                                onClick={() => setSearchType(opt.id)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${searchType === opt.id
                                    ? 'bg-[#e94560] text-white shadow-[0_0_15px_rgba(233,69,96,0.35)]'
                                    : 'text-gray-300 hover:text-white'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center bg-white/10 border-b border-white/20 rounded-xl px-4 py-2 transition-all duration-300 focus-within:bg-white/15 focus-within:border-[#e94560] focus-within:ring-2 focus-within:ring-[#e94560]/10 focus-within:scale-[1.02] max-md:w-full w-full">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={searchType === 'anime' ? 'Search anime...' : 'Search for movies, TV shows...'}
                            className="flex-1 bg-transparent border-none text-white text-sm transition-all duration-300 focus:outline-none placeholder:text-gray-400 max-md:text-base"
                            autoFocus
                        />
                        {loading && (
                            <div className="w-5 h-5 border-2 border-[#e94560]/30 border-t-[#e94560] rounded-full animate-spin ml-3"></div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
