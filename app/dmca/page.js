'use client';

import Topbar from '@/components/topbar';
import styles from './page.module.css';

export default function DMCAPage() {
    return (
        <div className={styles.container}>
            <Topbar name="DMCA Policy" />
            <div className={styles.content}>
                <p className={styles.lastUpdated}>Last updated: August 25, 2025</p>

                <section className={styles.section}>
                    <h2>1. DMCA Policy Overview</h2>
                    <p>AKMovies.in respects the intellectual property rights of others and expects its users to do the same. This DMCA (Digital Millennium Copyright Act) Policy outlines our procedures for handling copyright infringement claims.</p>
                </section>

                <section className={styles.section}>
                    <h2>2. Important Disclaimer</h2>
                    <p><strong>AKMovies.in does not host, store, or distribute any video content directly on our servers.</strong> Our platform aggregates and displays content information from third-party APIs and streaming services. We do not control the actual video content that users may access through external streaming services.</p>
                </section>

                <section className={styles.section}>
                    <h2>3. Third-Party Content Sources</h2>
                    <p>Our platform displays content information from the following sources:</p>
                    <ul>
                        <li><strong>Legal APIs:</strong> Movie and TV show metadata, posters, and descriptions</li>
                        <li><strong>External Streaming Services:</strong> Video playback through third party player APIs, we have no control over the actual video content hosted by these external services.</li>
                    </ul>
                    <p>We do not have control over the actual video content hosted by these external services.</p>
                </section>

                <section className={styles.section}>
                    <h2>4. Copyright Infringement Claims</h2>
                    <p>If you believe that your copyrighted work has been used in a way that constitutes copyright infringement, please provide us with the following information:</p>

                    <h3>4.1 Required Information</h3>
                    <ul>
                        <li><strong>Identification:</strong> A description of the copyrighted work that you claim has been infringed</li>
                        <li><strong>Location:</strong> A description of where the material is located on our website (URL)</li>
                        <li><strong>Contact Information:</strong> Your name, address, telephone number, and email address</li>
                        <li><strong>Statement of Good Faith:</strong> A statement that you have a good faith belief that the use is not authorized by the copyright owner</li>
                        <li><strong>Accuracy Statement:</strong> A statement that the information is accurate and that you are authorized to act on behalf of the copyright owner</li>
                        <li><strong>Signature:</strong> Your physical or electronic signature</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>5. Submitting a DMCA Notice</h2>
                    <p>Please send your DMCA notice to our designated copyright agent:</p>
                    <div className={styles.contactBox}>
                        <p><strong>Email:</strong> dmca@akmovies.in</p>
                        <p><strong>Subject Line:</strong> DMCA Copyright Infringement Notice</p>
                    </div>
                    <p>We will respond to all valid DMCA notices within 48 hours.</p>
                </section>

                <section className={styles.section}>
                    <h2>6. Counter-Notification</h2>
                    <p>If you believe that your content was removed in error, you may file a counter-notification containing:</p>
                    <ul>
                        <li>Your contact information</li>
                        <li>Identification of the removed content and its location</li>
                        <li>A statement under penalty of perjury that you have a good faith belief the content was removed by mistake</li>
                        <li>Your consent to local federal court jurisdiction</li>
                        <li>Your physical or electronic signature</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>7. Repeat Infringers</h2>
                    <p>AKMovies.in maintains a policy of terminating accounts of users who are repeat infringers of copyright or other intellectual property rights. We reserve the right to terminate access to our service for users who repeatedly violate copyright laws.</p>
                </section>

                <section className={styles.section}>
                    <h2>8. Content Removal Process</h2>
                    <p>Upon receiving a valid DMCA notice, we will:</p>
                    <ol>
                        <li>Review the notice for completeness and validity</li>
                        <li>Remove or disable access to the allegedly infringing content</li>
                        <li>Notify the user who posted the content</li>
                        <li>Provide the user with information about filing a counter-notification</li>
                    </ol>
                </section>

                <section className={styles.section}>
                    <h2>9. Limitations of Our Control</h2>
                    <p>It is important to understand that:</p>
                    <ul>
                        <li>We cannot remove content from third-party streaming services</li>
                        <li>We can only remove content that is directly hosted on our platform</li>
                        <li>Video content is streamed through external services over which we have no control</li>
                        <li>We act as an information aggregator, not a content host</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>10. False Claims</h2>
                    <p>Please note that filing a false DMCA claim may result in legal consequences. Under the DMCA, you may be liable for damages, including costs and attorneys' fees, if you knowingly misrepresent that material is infringing.</p>
                </section>

                <section className={styles.section}>
                    <h2>11. Legal Advice</h2>
                    <p>This DMCA Policy is provided for informational purposes only and does not constitute legal advice. If you have questions about copyright law or need legal assistance, please consult with a qualified attorney.</p>
                </section>

                <section className={styles.section}>
                    <h2>12. Contact Information</h2>
                    <p>For DMCA-related inquiries, please contact:</p>
                    <div className={styles.contactBox}>
                        <p><strong>Copyright Agent:</strong> AKMovies Legal Team</p>
                        <p><strong>Email:</strong> dmca@akmovies.in</p>
                        <p><strong>Response Time:</strong> Within 48 hours</p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>13. Policy Updates</h2>
                    <p>We may update this DMCA Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Continued use of our service after such changes constitutes acceptance of the updated policy.</p>
                </section>

                <section className={styles.section}>
                    <h2>14. Governing Law</h2>
                    <p>This DMCA Policy is governed by and construed in accordance with the laws of India and applicable international copyright laws, including the Digital Millennium Copyright Act.</p>
                </section>
            </div>
        </div>
    );
}
