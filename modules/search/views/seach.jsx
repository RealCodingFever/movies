'use client';

import Topbar from '@/components/topbar';
import { useSearch } from '../provider/search.provider';
import SearchForm from './components/search-form';
import SearchResult from './components/search-result';
import NotFoundAnything from './components/not-found-anything';

export default function SearchPage() {
    const { query } = useSearch();

    return (
        <div className="min-h-screen bg-black">
            <Topbar name="Search Movies & TV Shows" />
            <div className="pb-8">
                <div className="main-container">
                    <SearchForm />
                    {query ? <SearchResult /> : <NotFoundAnything />}
                </div>
            </div>
        </div>
    );
}

