import { collection, query, orderBy, getDocs, limit, collectionGroup } from 'firebase/firestore';
import { ADMIN_EMAILS, isUserAdmin } from '../modules/watch/utils/admin';
import { db } from './firebase';

export const validateAdminAccess = (user, isAuthenticated) => {
  // Check if user is authenticated
  if (!isAuthenticated) {
    return { isAdmin: false, reason: 'Not authenticated' };
  }

  // Check if user exists
  if (!user) {
    return { isAdmin: false, reason: 'User not found' };
  }

  // Check if user has email
  if (!user.email) {
    return { isAdmin: false, reason: 'No email associated with account' };
  }

  // Check if email is verified (optional but recommended)
  if (user.emailVerified === false) {
    return { isAdmin: false, reason: 'Email not verified' };
  }

  // Check if user is in admin list
  if (!ADMIN_EMAILS.includes(user.email)) {
    return { isAdmin: false, reason: 'Not authorized' };
  }

  return { isAdmin: true, reason: 'Authorized' };
};

// Get admin info for display
export const getAdminInfo = (user) => {
  if (!isUserAdmin(user)) return null;

  return {
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL,
    isVerified: user.emailVerified
  };
};

export const getUserHistoryForAdmin = async (userId) => {
  try {
    const historyRef = collection(db, 'users', userId, 'history');
    const q = query(historyRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    const history = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        id: doc.id,
        title: data.title || 'Unknown',
        mediaType: data.mediaType || 'unknown',
        timestamp: data.timestamp,
        season: data.season,
        episode: data.episode
      });
    });

    return history;
  } catch (error) {
    console.error('Error fetching user history:', error);
    return [];
  }
};



export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    const usersMap = new Map();

    for (const docSnap of usersSnapshot.docs) {
      const userData = docSnap.data();
      const userId = docSnap.id;

      usersMap.set(userId, {
        id: userId,
        displayName: userData.displayName || 'Unknown User',
        photoURL: userData.photoURL || null,
        email: userData.email || 'No email provided',
        createdAt: userData.createdAt || null,
        lastActivity: null,
      });
    }

    // 🔥 Get all history to identify "phantom" users and find everyone's latest activity
    const historyGroupRef = collectionGroup(db, 'history');
    const historySnapshot = await getDocs(historyGroupRef);

    historySnapshot.forEach((docSnap) => {
      const parentRef = docSnap.ref.parent.parent;
      if (!parentRef) return;

      const userId = parentRef.id;
      const timestamp = docSnap.data().timestamp;

      // If user document didn't exist, create a phantom entry
      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          id: userId,
          displayName: 'Unknown User (No Info)',
          photoURL: null,
          email: 'No email provided',
          createdAt: null,
          lastActivity: timestamp,
        });
      } else {
        // Update last activity if newer
        const user = usersMap.get(userId);
        if (timestamp) {
          if (!user.lastActivity) {
            user.lastActivity = timestamp;
          } else if (timestamp.toMillis && user.lastActivity.toMillis) {
            if (timestamp.toMillis() > user.lastActivity.toMillis()) {
              user.lastActivity = timestamp;
            }
          }
        }
      }
    });

    const users = Array.from(usersMap.values());

    // 🔥 Sort by latest activity
    users.sort((a, b) => {
      const aTime = a.lastActivity?.toMillis?.() || 0;
      const bTime = b.lastActivity?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return users;

  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

