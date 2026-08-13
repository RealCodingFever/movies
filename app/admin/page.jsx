'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/topbar';
import {
    getAllUsers,
    getUserHistoryForAdmin,
    validateAdminAccess
} from '@/utils/admin-page-function';
import { getAllAiUsers } from '@/utils/firestore-functions';
import { FaHistory, FaChevronDown, FaChevronUp, FaRobot } from 'react-icons/fa';
import styles from './page.module.css';

const TABS = [
    { id: 'history', label: 'Watch History', icon: FaHistory },
    { id: 'ai', label: 'AI Usage', icon: FaRobot },
];

export default function AdminPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('history');

    const [allUsers, setAllUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const [aiUsers, setAiUsers] = useState([]);
    const [loadingAi, setLoadingAi] = useState(false);

    const [expandedUserId, setExpandedUserId] = useState(null);
    const [userHistories, setUserHistories] = useState({});
    const [loadingHistoryId, setLoadingHistoryId] = useState(null);

    const adminValidation = validateAdminAccess(user, isAuthenticated);
    const isAdmin = adminValidation.isAdmin;

    useEffect(() => {
        if (isAuthenticated !== undefined) {
            if (isAuthenticated && !isAdmin) {
                toast.error(`Access denied: ${adminValidation.reason}`);
                router.push('/');
            } else {
                setLoading(false);
            }
        }
    }, [isAuthenticated, isAdmin, router, adminValidation.reason]);

    useEffect(() => {
        if (!isAdmin) return;
        if (activeTab === 'history' && allUsers.length === 0) fetchUsers();
        if (activeTab === 'ai' && aiUsers.length === 0) fetchAiUsers();
    }, [isAdmin, activeTab]);

    const fetchUsers = async () => {
        setLoadingData(true);
        try {
            setAllUsers(await getAllUsers());
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to sync data');
        } finally {
            setLoadingData(false);
        }
    };

    const fetchAiUsers = async () => {
        setLoadingAi(true);
        try {
            setAiUsers(await getAllAiUsers());
        } catch (error) {
            console.error('Error fetching AI usage:', error);
            toast.error('Failed to load AI usage');
        } finally {
            setLoadingAi(false);
        }
    };

    const toggleUserExpansion = async (userId) => {
        if (expandedUserId === userId) {
            setExpandedUserId(null);
            return;
        }
        setExpandedUserId(userId);

        if (!userHistories[userId]) {
            setLoadingHistoryId(userId);
            try {
                const history = await getUserHistoryForAdmin(userId);
                setUserHistories((prev) => ({ ...prev, [userId]: history }));
            } catch (error) {
                console.error('Failed to fetch user history', error);
                toast.error('Could not load user history');
            } finally {
                setLoadingHistoryId(null);
            }
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }).format(date);
        } catch {
            return 'Invalid Date';
        }
    };

    if (loading) return <div className={styles.loadingContainer}><div className={styles.spinner}></div></div>;
    if (!isAdmin) return null;

    const subtitle = activeTab === 'history'
        ? `User Management (${allUsers.length} Users)`
        : `AI Usage (${aiUsers.length} users ever)`;

    return (
        <div className={styles.container}>
            <Topbar name="Admin Dashboard" />

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Dashboard</h1>
                        <p className={styles.subtitle}>{subtitle}</p>
                    </div>
                </div>

                <div className={styles.tabs}>
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
                        >
                            <Icon /> {label}
                        </button>
                    ))}
                </div>

                <div className={styles.contentArea}>
                    {activeTab === 'history' && (
                        <HistoryPanel
                            loading={loadingData}
                            allUsers={allUsers}
                            expandedUserId={expandedUserId}
                            userHistories={userHistories}
                            loadingHistoryId={loadingHistoryId}
                            onToggle={toggleUserExpansion}
                            formatDate={formatDate}
                        />
                    )}

                    {activeTab === 'ai' && (
                        <AiUsagePanel
                            loading={loadingAi}
                            users={aiUsers}
                            formatDate={formatDate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// ───── Watch history tab (unchanged behavior, extracted into a subcomponent) ─────
function HistoryPanel({ loading, allUsers, expandedUserId, userHistories, loadingHistoryId, onToggle, formatDate }) {
    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Loading Users...</p>
            </div>
        );
    }

    if (allUsers.length === 0) {
        return <div className={styles.emptyState}>No users found in database.</div>;
    }

    return (
        <div className={styles.usersListContainer}>
            {allUsers.map((u) => (
                <div key={u.id} className={`${styles.userCard} ${expandedUserId === u.id ? styles.expanded : ''}`}>
                    <div className={styles.userHeader} onClick={() => onToggle(u.id)}>
                        <div className={styles.userInfoLeft}>
                            <div className={styles.userAvatarLarge}>
                                {u.photoURL ? (
                                    <img src={u.photoURL} alt={u.displayName} width={45} height={45} className={styles.avatarImgLarge} />
                                ) : <div className={styles.avatarFallbackLarge}>{u.email && u.email !== 'No email provided' ? u.email[0].toUpperCase() : '?'}</div>}
                            </div>
                            <div>
                                <h3 className={styles.userName}>{u.displayName || 'Unknown'}</h3>
                                <p className={styles.userEmail}>{u.email}</p>
                            </div>
                        </div>

                        <div className={styles.userMetaRight}>
                            <div className={styles.joinedDate}>
                                <span className={styles.label}>Joined:</span> {formatDate(u.createdAt)}
                            </div>
                            {expandedUserId === u.id ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </div>

                    {expandedUserId === u.id && (
                        <div className={styles.historySection}>
                            <div className={styles.historyTitle}>
                                <FaHistory /> Watch History
                            </div>

                            {loadingHistoryId === u.id ? (
                                <div className={styles.miniLoader}><div className={styles.spinnerSmall}></div> Loading history...</div>
                            ) : (
                                <UserHistoryGrid history={userHistories[u.id] || []} />
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ───── AI Usage tab — already sorted by lastMessageAt desc server-side ─────
function AiUsagePanel({ loading, users, formatDate }) {
    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Loading AI Usage...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return <div className={styles.emptyState}>No AI usage recorded yet.</div>;
    }

    // Today in local TZ — compare against stored lastResetDate to get accurate "today" count
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    return (
        <div className={styles.aiUsageGrid}>
            {users.map((u) => {
                const todayCount = u.lastResetDate === today ? (u.dailyCount || 0) : 0;
                return (
                    <div key={u.id} className={styles.aiUsageCard}>
                        <div className={styles.aiUserBlock}>
                            <div className={styles.userAvatarLarge}>
                                {u.photoURL ? (
                                    <img src={u.photoURL} alt={u.displayName} className={styles.avatarImgLarge} />
                                ) : (
                                    <div className={styles.avatarFallbackLarge}>
                                        {u.email ? u.email[0].toUpperCase() : '?'}
                                    </div>
                                )}
                            </div>
                            <div className={styles.aiUserText}>
                                <h3 className={styles.userName}>{u.displayName || 'Unknown'}</h3>
                                <p className={styles.userEmail}>{u.email}</p>
                            </div>
                        </div>

                        <div className={styles.aiStatsRow}>
                            <div className={styles.aiStat}>
                                <span className={styles.aiStatValue}>{todayCount}</span>
                                <span className={styles.aiStatLabel}>Today</span>
                            </div>
                            <div className={styles.aiStat}>
                                <span className={styles.aiStatValue}>{u.totalCount || 0}</span>
                                <span className={styles.aiStatLabel}>Total</span>
                            </div>
                            <div className={styles.aiStat}>
                                <span className={styles.aiStatValueSmall}>{formatDate(u.lastMessageAt)}</span>
                                <span className={styles.aiStatLabel}>Last used</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function UserHistoryGrid({ history }) {
    const [visibleCount, setVisibleCount] = useState(4);

    if (!history || history.length === 0) {
        return <p className={styles.noHistory}>No watch history recorded.</p>;
    }

    const visibleHistory = history.slice(0, visibleCount);
    const hasMore = history.length > visibleCount;
    const remaining = history.length - visibleCount;
    const nextBatch = Math.min(10, remaining);

    const getWatchLink = (item) => {
        const cleanId = item.id.replace(/^(movie|tv)_/, '');
        return `/watch/${item.mediaType}/${cleanId}`;
    };

    return (
        <div className={styles.historyContainer}>
            <div className={styles.historyGrid}>
                {visibleHistory.map((h, i) => (
                    <a
                        key={i}
                        href={getWatchLink(h)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.miniHistoryCard}
                    >
                        <div className={styles.miniCardHeader}>
                            <span className={`${styles.miniType} ${styles[h.mediaType]}`}>{h.mediaType}</span>
                            <span className={styles.miniDate}>{formatDateSimple(h.timestamp)}</span>
                        </div>
                        <div className={styles.miniContent}>
                            <div className={styles.miniTitle} title={h.title}>{h.title}</div>
                            {h.season && (
                                <div className={styles.miniEp}>
                                    <span style={{ color: '#e50914' }}>S{h.season}</span> E{h.episode}
                                </div>
                            )}
                        </div>
                    </a>
                ))}
            </div>

            {hasMore && (
                <button
                    className={styles.showMoreBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        setVisibleCount((prev) => prev + 10);
                    }}
                >
                    + {nextBatch} More
                </button>
            )}
        </div>
    );
}

const formatDateSimple = (timestamp) => {
    if (!timestamp) return '';
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    } catch {
        return '';
    }
};
