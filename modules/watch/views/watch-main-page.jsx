import React from 'react';
import { WatchProvider } from '../provider/watch.provider';
import TopBannerSection from './components/top-banner-section';
import WatchDetailSection from './components/watch-detail-section';
import WatchContentSection from './components/watch-content-section';
import ServerButtonsSection from './components/server-buttons-section';
import EpisodeListingSection from './components/episode-listing-section';
import SimilarContentSection from './components/similar-content-section';
import ReviewSection from './components/review-section';

const WatchMainPage = ({ id, type }) => {
  return (
    <div className="text-white w-full mb-10">
      <WatchProvider id={id} type={type}>
        <TopBannerSection />

        <div className="relative z-20 flex justify-center mt-10 lg:mt-20 mb-5 lg:mb-10">
          <WatchDetailSection />
        </div>
        <div className="flex justify-center w-full lg:pt-7">
          <img 
            src="/adblock.png" 
            alt="Adblock" 
            className="w-[40%] lg:w-[10%] h-auto object-cover" 
          />
        </div>
        <WatchContentSection />
        <ServerButtonsSection />
        <EpisodeListingSection />
        <ReviewSection />
        <SimilarContentSection />
      </WatchProvider>
    </div>
  );
};

export default WatchMainPage;
