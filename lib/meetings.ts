import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { Meeting } from "@/components/component/summary/summary";

const LOCAL_STORAGE_KEY = "intellex_meetings_data";

export async function getStoredMeetings(): Promise<Meeting[]> {
  try {
    if (typeof window !== "undefined") {
      // Try to load from Firestore first
      try {
        const meetingsRef = collection(db, "meetings");
        const q = query(meetingsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const remoteMeetings: Meeting[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              user1: {
                name: data.user1?.name || "",
                photoURL: data.user1?.photoURL || "",
                description: data.user1?.description || "",
              },
              user2: {
                name: data.user2?.name || "",
                photoURL: data.user2?.photoURL || "",
                description: data.user2?.description || "",
              },
              summary: data.summary || "",
            };
          });

          // Sync cache with local storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteMeetings));
          return remoteMeetings;
        }
      } catch (firestoreError) {
        console.warn("Firestore fetch failed, checking localStorage fallback:", firestoreError);
      }

      // Fallback to localStorage
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error("Failed to parse cached meetings", e);
        }
      }
    }
  } catch (err) {
    console.error("Error in getStoredMeetings:", err);
  }

  return [];
}

export async function saveMeeting(meeting: Omit<Meeting, "id">): Promise<Meeting> {
  const newMeeting: Meeting = {
    ...meeting,
    id: `local-${Date.now()}`,
  };

  try {
    // Try saving to Firestore
    try {
      const docRef = await addDoc(collection(db, "meetings"), {
        ...meeting,
        createdAt: serverTimestamp(),
      });
      newMeeting.id = docRef.id;
    } catch (fsErr) {
      console.warn("Could not write meeting to Firestore, saved locally:", fsErr);
    }

    // Save in localStorage
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      let list: Meeting[] = [];
      if (existing) {
        try {
          list = JSON.parse(existing);
        } catch {
          list = [];
        }
      }
      list.unshift(newMeeting);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    }
  } catch (error) {
    console.error("Failed to save meeting:", error);
  }

  return newMeeting;
}

export async function removeMeeting(id?: string, index?: number): Promise<void> {
  if (typeof window !== "undefined") {
    // Remove from Firestore if id is not a local id
    if (id && !id.startsWith("local-")) {
      try {
        await deleteDoc(doc(db, "meetings", id));
      } catch (err) {
        console.warn("Failed to delete meeting doc from Firestore:", err);
      }
    }

    // Remove from localStorage
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existing) {
      try {
        let list: Meeting[] = JSON.parse(existing);
        if (id) {
          list = list.filter((m) => m.id !== id);
        } else if (typeof index === "number") {
          list.splice(index, 1);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.error("Error updating localStorage on remove:", e);
      }
    }
  }
}
