'use client';

import Topbar from '@/components/topbar';
import styles from './page.module.css';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <Topbar name="Terms of Service" />
            <div className={styles.content}>
                <p className={styles.lastUpdated}>Last updated: August 25, 2025</p>

                <section className={styles.section}>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using AKMovies.in ("the Website"), you accept and agree to be bound by the terms and provision of this agreement.</p>
                </section>

                <section className={styles.section}>
                    <h2>2. Service Description</h2>
                    <p>AKMovies.in is a streaming platform that provides access to movies, TV series content. Our service aggregates and displays content from various third-party sources and APIs.</p>
                </section>

                <section className={styles.section}>
                    <h2>3. Third-Party Content and APIs</h2>
                    <p><strong>Important Disclaimer:</strong> AKMovies.in does not host, store, or distribute any video content directly on our servers. All content displayed on our platform is sourced from third-party APIs and streaming services.</p>

                    <h3>3.1 APIs and Data Sources</h3>
                    <ul>
                        <li><strong>Legal APIs:</strong> We use The Movie Database API to fetch movie and TV show information, including titles, descriptions, posters, and metadata. They may collect analytics data about API usage.</li>
                        <li><strong>Third-Party Streaming Services:</strong> Video playback is handled by third party player APIs, we have no control over the actual video content hosted by these external services.</li>
                    </ul>

                    <h3>3.2 Content Ownership</h3>
                    <p>All content displayed on AKMovies.in belongs to their respective copyright holders. We do not claim ownership of any movies, TV shows or related media content.</p>
                </section>

                <section className={styles.section}>
                    <h2>4. Legal Compliance</h2>
                    <p>AKMovies.in operates in compliance with applicable laws and regulations. We do not:</p>
                    <ul>
                        <li>Host or store any copyrighted content on our servers</li>
                        <li>Distribute or reproduce copyrighted material</li>
                        <li>Engage in any illegal streaming activities</li>
                        <li>Store user-uploaded content</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>5. User Responsibilities</h2>
                    <p>Users of AKMovies.in are responsible for:</p>
                    <ul>
                        <li>Ensuring they have the legal right to access content in their region</li>
                        <li>Complying with local copyright laws and regulations</li>
                        <li>Not using our service for any illegal purposes</li>
                        <li>Respecting intellectual property rights</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>6. Intellectual Property</h2>
                    <p>The AKMovies.in website design, logo, and original content are protected by copyright. However, all movie, TV show  content displayed belongs to their respective owners.</p>
                </section>

                <section className={styles.section}>
                    <h2>7. Disclaimer of Warranties</h2>
                    <p>AKMovies.in is provided "as is" without any warranties. We do not guarantee:</p>
                    <ul>
                        <li>The availability of any specific content</li>
                        <li>The quality or accuracy of third-party content</li>
                        <li>Uninterrupted service</li>
                        <li>Compatibility with all devices or browsers</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>8. Limitation of Liability</h2>
                    <p>AKMovies.in shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our service.</p>
                </section>

                <section className={styles.section}>
                    <h2>9. Third-Party Links and Services</h2>
                    <p>Our platform contains links to third-party websites and services. We are not responsible for the content, privacy policies, or practices of these external sites.</p>
                </section>

                <section className={styles.section}>
                    <h2>10. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.</p>
                </section>

                <section className={styles.section}>
                    <h2>11. Contact Information</h2>
                    <p>For questions about these terms, please contact us at:</p>
                    <p>Email: legal@akmovies.in</p>
                </section>

                <section className={styles.section}>
                    <h2>12. Governing Law</h2>
                    <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.</p>
                </section>
            </div>
        </div>
    );
}
