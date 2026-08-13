'use client';

import Topbar from '@/components/topbar';
import styles from './page.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <Topbar name="Privacy Policy" />
            <div className={styles.content}>
                <p className={styles.lastUpdated}>Last updated: August 25, 2025</p>

                <section className={styles.section}>
                    <h2>1. Introduction</h2>
                    <p>AKMovies.in ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our streaming platform.</p>
                </section>

                <section className={styles.section}>
                    <h2>2. Information We Collect</h2>
                    <h3>2.1 Information You Provide</h3>
                    <ul>
                        <li><strong>Account Information:</strong> If you create an account, we collect your email address and username.</li>
                        <li><strong>User Preferences:</strong> Your watch history, bookmarks, and content preferences.</li>
                        <li><strong>Communications:</strong> Any messages you send to us through contact forms or email.</li>
                    </ul>

                    <h3>2.2 Automatically Collected Information</h3>
                    <ul>
                        <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and content viewed.</li>
                        <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
                        <li><strong>IP Address:</strong> Your IP address for security and analytics purposes.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>3. How We Use Your Information</h2>
                    <p>We use the collected information to:</p>
                    <ul>
                        <li>Provide and maintain our streaming service</li>
                        <li>Personalize your experience and recommendations</li>
                        <li>Improve our platform and user experience</li>
                        <li>Send important updates and notifications</li>
                        <li>Ensure security and prevent fraud</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>4. Third-Party Services and APIs</h2>
                    <p><strong>Important:</strong> AKMovies.in integrates with several third-party services and APIs. We want to be transparent about how these services may affect your privacy.</p>

                    <h3>4.1 Content APIs</h3>
                    <ul>
                        <li><strong>Legal APIs:</strong> We use The Movie Database API to fetch movie and TV show information. They may collect analytics data about API usage.</li>
                    </ul>

                    <h3>4.2 Streaming Services</h3>
                    <ul>
                        <li><strong>Player APIs:</strong> Video playback is handled by third party player APIs. We do not store any data on our server.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>5. Data Storage and Security</h2>
                    <h3>5.1 Local Storage</h3>
                    <p>We use your browser's local storage to save:</p>
                    <ul>
                        <li>Watch progress and history</li>
                        <li>User preferences and settings</li>
                        <li>Authentication tokens</li>
                    </ul>

                    <h3>5.2 Cloud Storage</h3>
                    <p>We use Firebase Firestore to store:</p>
                    <ul>
                        <li>User account information</li>
                        <li>Watch history and bookmarks</li>
                        <li>User preferences and recommendations</li>
                    </ul>

                    <h3>5.3 Security Measures</h3>
                    <p>We implement appropriate security measures to protect your information, including:</p>
                    <ul>
                        <li>Encryption of sensitive data</li>
                        <li>Secure authentication protocols</li>
                        <li>Regular security audits</li>
                        <li>Access controls and monitoring</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>6. Data Sharing and Disclosure</h2>
                    <p>We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:</p>
                    <ul>
                        <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform.</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety.</li>
                        <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets.</li>
                        <li><strong>User Consent:</strong> When you explicitly give us permission to share your information.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>7. Your Rights and Choices</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li><strong>Access:</strong> Request a copy of your personal information.</li>
                        <li><strong>Correction:</strong> Update or correct inaccurate information.</li>
                        <li><strong>Deletion:</strong> Request deletion of your account and data.</li>
                        <li><strong>Portability:</strong> Export your data in a portable format.</li>
                        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>8. Cookies and Tracking Technologies</h2>
                    <p>We use cookies and similar technologies to:</p>
                    <ul>
                        <li>Remember your preferences and settings</li>
                        <li>Analyze website traffic and usage patterns</li>
                        <li>Provide personalized content and recommendations</li>
                        <li>Ensure security and prevent fraud</li>
                    </ul>
                    <p>You can control cookie settings through your browser preferences.</p>
                </section>

                <section className={styles.section}>
                    <h2>9. Children's Privacy</h2>
                    <p>AKMovies.in is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
                </section>

                <section className={styles.section}>
                    <h2>10. International Data Transfers</h2>
                    <p>Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.</p>
                </section>

                <section className={styles.section}>
                    <h2>11. Data Retention</h2>
                    <p>We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and data at any time.</p>
                </section>

                <section className={styles.section}>
                    <h2>12. Changes to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
                </section>

                <section className={styles.section}>
                    <h2>13. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
                    <p>Email: privacy@akmovies.in</p>
                    <p>We will respond to your inquiry within 48 hours.</p>
                </section>

                <section className={styles.section}>
                    <h2>14. Governing Law</h2>
                    <p>This Privacy Policy is governed by and construed in accordance with the laws of India. Any disputes arising from this policy will be subject to the exclusive jurisdiction of the courts in India.</p>
                </section>
            </div>
        </div>
    );
}
