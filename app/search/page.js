import React, { Suspense } from 'react';
import SearchPage from '@/modules/search/views/seach';
import { SearchProvider } from '@/modules/search/provider/search.provider';

export default function Page() {
    return (
        <Suspense fallback={null}>
            <SearchProvider>
                <SearchPage />
            </SearchProvider>
        </Suspense>
    );
}