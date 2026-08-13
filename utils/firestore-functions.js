import { collection, collectionGroup, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, limit, where, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import { generateFirebaseId, ensureUniqueKeys } from './utils-functions';

// === AI Usage (movie-chat widget) ===

// Today as YYYY-MM-DD in user's local timezone — daily reset key
const todayStr = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
};

// Increments a user's AI message usage. Auto-resets dailyCount if date changed.
// Creates the doc on first use. Returns the new usage state.
export const updateAiUsage = async (user) => {
    if (!user?.uid) return null;
    const today = todayStr();
    const docRef = doc(db, 'ai-usage', user.uid);

    try {
        return await runTransaction(db, async (tx) => {
            const snap = await tx.get(docRef);
            const isNew = !snap.exists();
            const prev = isNew ? {} : snap.data();

            const dailyCount = prev.lastResetDate === today ? (prev.dailyCount || 0) + 1 : 1;
            const totalCount = (prev.totalCount || 0) + 1;

            const payload = {
                userId: user.uid,
                displayName: user.displayName || 'Unknown',
                email: user.email || 'Unknown',
                photoURL: user.photoURL || null,
                dailyCount,
                totalCount,
                lastResetDate: today,
                lastMessageAt: serverTimestamp(),
                ...(isNew ? { createdAt: serverTimestamp() } : {}),
            };

            tx.set(docRef, payload, { merge: true });
            return { dailyCount, totalCount, lastResetDate: today };
        });
    } catch (error) {
        console.error('Error updating AI usage:', error);
        return null;
    }
};

// Reads one user's AI usage. Applies the daily reset virtually (no write).
export const getAiUsageByUser = async (userId) => {
    if (!userId) return null;
    try {
        const snap = await getDoc(doc(db, 'ai-usage', userId));
        if (!snap.exists()) return null;
        const data = snap.data();
        const today = todayStr();
        const dailyCount = data.lastResetDate === today ? (data.dailyCount || 0) : 0;
        return { ...data, dailyCount };
    } catch (error) {
        console.error('Error fetching AI usage:', error);
        return null;
    }
};

// All AI users sorted by most recent message (admin view).
export const getAllAiUsers = async () => {
    try {
        const q = query(collection(db, 'ai-usage'), orderBy('lastMessageAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error('Error fetching AI usage list:', error);
        return [];
    }
};

// === User History ===

export const getUserHistory = async (userId) => {
    if (!userId) return [];
    try {
        const q = query(collection(db, 'users', userId, 'history'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map(doc => ({
            id: doc.data().id,
            firebaseId: doc.id,
            ...doc.data()
        }));
        return ensureUniqueKeys(history, 'continue_');
    } catch (error) {
        console.error('Error fetching user history:', error);
        return [];
    }
};

export const addToHistory = async (userId, item) => {
    if (!userId || !item) return;
    try {
        const docId = generateFirebaseId(item.mediaType, item.id);
        await setDoc(doc(db, 'users', userId, 'history', docId), {
            episode: item.episode || 1,
            id: item.id,
            mediaType: item.mediaType,
            posterPath: item.posterPath,
            season: item.season || 1,
            title: item.title,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error adding to history:', error);
    }
};

export const updateHistoryProgress = async (userId, itemId, progress) => {
    if (!userId || !itemId) return;
    try {
        const q = query(collection(db, 'users', userId, 'history'), where('id', '==', itemId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            await updateDoc(doc(db, 'users', userId, 'history', snapshot.docs[0].id), {
                progress,
                timestamp: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error updating history progress:', error);
    }
};

export const removeFromHistory = async (userId, itemId, mediaType) => {
    if (!userId || !itemId || !mediaType) return;
    try {
        const docId = generateFirebaseId(mediaType, itemId);
        await deleteDoc(doc(db, 'users', userId, 'history', docId));
    } catch (error) {
        console.error('Error removing from history:', error);
    }
};

export const clearHistory = async (userId) => {
    if (!userId) return;
    try {
        const snapshot = await getDocs(collection(db, 'users', userId, 'history'));
        await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
    } catch (error) {
        console.error('Error clearing history:', error);
    }
};

export const getHistoryCount = async (userId) => {
    if (!userId) return 0;
    try {
        const snapshot = await getDocs(collection(db, 'users', userId, 'history'));
        return snapshot.size;
    } catch (error) {
        console.error('Error getting history count:', error);
        return 0;
    }
};

// === Continue Watching ===

export const getContinueWatchingItem = async (userId, contentId, mediaType) => {
    if (!userId || !contentId || !mediaType) return null;
    try {
        const docId = generateFirebaseId(mediaType, contentId);
        const docSnap = await getDoc(doc(db, 'users', userId, 'history', docId));
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error('Error getting continue watching item:', error);
        return null;
    }
};

export const updateContinueWatchingProgress = async (userId, contentId, mediaType, season, episode) => {
    if (!userId || !contentId || !mediaType) return;
    try {
        const docId = generateFirebaseId(mediaType, contentId);
        const docRef = doc(db, 'users', userId, 'history', docId);
        const docSnap = await getDoc(docRef);

        const data = {
            season: season || 1,
            episode: episode || 1,
            timestamp: serverTimestamp()
        };

        if (docSnap.exists()) {
            await updateDoc(docRef, data);
        } else {
            await setDoc(docRef, { ...data, id: contentId, mediaType });
        }
    } catch (error) {
        console.error('Error updating continue watching progress:', error);
    }
};

// === Admin & Recommendations ===

export const getRecommendations = async () => {
    try {
        const q = query(collection(db, 'recommendations'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : data.timestamp
            };
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
};

export const addRecommendation = async (data) => {
    try {
        const docId = generateFirebaseId(data.mediaType, data.id);
        await setDoc(doc(db, 'recommendations', docId), { ...data, timestamp: serverTimestamp() });
    } catch (error) {
        console.error('Error adding recommendation:', error);
    }
};

export const deleteRecommendation = async (id, mediaType) => {
    try {
        const docId = generateFirebaseId(mediaType, id);
        await deleteDoc(doc(db, 'recommendations', docId));
    } catch (error) {
        console.error('Error deleting recommendation:', error);
    }
};

// === User Management ===

export const createUserDocument = async (user) => {
    if (!user?.uid) return;
    try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            await setDoc(userRef, {
                displayName: user.displayName || 'Unknown',
                photoURL: user.photoURL || null,
                email: user.email || 'Unknown',
                lastLoginAt: serverTimestamp(),
                createdAt: serverTimestamp()
            });
        } else {
            const updates = { lastLoginAt: serverTimestamp() };
            if (user.displayName) updates.displayName = user.displayName;
            if (user.photoURL) updates.photoURL = user.photoURL;
            if (user.email) updates.email = user.email;

            await updateDoc(userRef, updates);
        }
    } catch (error) {
        console.error('Error creating user document:', error);
    }
};

export const getAllUsers = async () => {
    try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            displayName: doc.data().displayName || 'Unknown',
            photoURL: doc.data().photoURL || null,
            email: doc.data().email || 'Unknown',
            createdAt: doc.data().createdAt
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const getUserHistoryForAdmin = async (userId) => {
    try {
        const q = query(collection(db, 'users', userId, 'history'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title || 'Unknown',
            mediaType: doc.data().mediaType || 'unknown',
            timestamp: doc.data().timestamp,
            season: doc.data().season,
            episode: doc.data().episode
        }));
    } catch (error) {
        console.error('Error fetching user history:', error);
        return [];
    }
};

export const getGlobalRecentActivity = async (limitCount = 50) => {
    try {
        const q = query(collectionGroup(db, 'history'), orderBy('timestamp', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);

        const activities = [];
        for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();
            const userDocRef = docSnapshot.ref.parent.parent;
            let userInfo = { email: 'Unknown User', displayName: 'Unknown' };

            if (userDocRef) {
                try {
                    const userSnap = await getDoc(userDocRef);
                    if (userSnap.exists()) {
                        const u = userSnap.data();
                        userInfo = { email: u.email || 'Unknown', displayName: u.displayName || 'Unknown', photoURL: u.photoURL || null };
                    }
                } catch (e) { console.warn('Error fetching user for activity:', e); }
            }
            activities.push({ id: docSnapshot.id, ...data, user: userInfo });
        }
        return activities;
    } catch (error) {
        console.error('Error fetching global history:', error);
        throw error;
    }
};

export const getRecentLogins = async (limitCount = 20) => {
    try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching recent logins:', error);
        return [];
    }
};

// === Bookmarks ===

export const getUserBookmarks = async (userId) => {
    if (!userId) return [];
    try {
        const q = query(collection(db, 'users', userId, 'bookmarks'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.data().id,
            firebaseId: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching user bookmarks:', error);
        return [];
    }
};

export const addBookmark = async (userId, item) => {
    if (!userId || !item) return false;
    try {
        const docId = generateFirebaseId(item.mediaType, item.id);
        const docRef = doc(db, 'users', userId, 'bookmarks', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return false;
        }

        await setDoc(docRef, {
            id: item.id,
            title: item.title || item.name || 'Unknown',
            overview: item.overview || '',
            posterPath: item.posterPath || item.poster_path || null,
            backdropPath: item.backdropPath || item.backdrop_path || null,
            mediaType: item.mediaType || 'unknown',
            releaseDate: item.releaseDate || item.release_date || item.first_air_date || null,
            voteAverage: item.voteAverage || item.vote_average || 0,
            timestamp: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error adding bookmark:', error);
        return false;
    }
};

export const removeBookmark = async (userId, itemId, mediaType) => {
    if (!userId || !itemId || !mediaType) return false;
    try {
        const docId = generateFirebaseId(mediaType, itemId);
        await deleteDoc(doc(db, 'users', userId, 'bookmarks', docId));
        return true;
    } catch (error) {
        console.error('Error removing bookmark:', error);
        return false;
    }
};

export const isBookmarked = async (userId, itemId, mediaType) => {
    if (!userId || !itemId || !mediaType) return false;
    try {
        const docId = generateFirebaseId(mediaType, itemId);
        const docSnap = await getDoc(doc(db, 'users', userId, 'bookmarks', docId));
        return docSnap.exists();
    } catch (error) {
        console.error('Error checking bookmark status:', error);
        return false;
    }
};