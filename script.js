import { db, auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- Cloudinary деректері (Сенің деректерің) ---
const CLOUD_NAME = "din5wpn5g";
const UPLOAD_PRESET = "aura_preset";

const loginBtn = document.getElementById('loginBtn');
const userInfo = document.getElementById('userInfo');
const uploadSection = document.getElementById('uploadSection');
const feed = document.getElementById('feed');

// 1. Google арқылы кіру функциясы
loginBtn.onclick = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Кіру қатесі:", error);
        alert("Кіру кезінде қате шықты!");
    }
};

// 2. Пайдаланушының күйін бақылау
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginBtn.style.display = "none";
        userInfo.innerHTML = `<img src="${user.photoURL}" width="30" style="border-radius:50%"> ${user.displayName}`;
        uploadSection.style.display = "block";
        loadPosts(); // Посттарды жүктеу
    }
});

// 3. Cloudinary-ге файл жүктеу және Firebase-ке жазу
document.getElementById('shareBtn').onclick = async () => {
    const text = document.getElementById('postText').value;
    const file = document.getElementById('fileInput').files[0];
    const btn = document.getElementById('shareBtn');
    
    if (!text && !file) return alert("Бірдеңе жаз немесе файл таңда!");

    btn.disabled = true;
    btn.innerText = "Жүктелуде...";

    let mediaUrl = "";

    // Егер файл (видео/сурет) болса, Cloudinary-ге жібереміз
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            mediaUrl = data.secure_url;
        } catch (err) {
            console.error("Cloudinary қатесі:", err);
        }
    }

    // Деректерді Firebase Firestore-ға сақтау
    try {
        await addDoc(collection(db, "posts"), {
            text: text,
            mediaUrl: mediaUrl,
            authorName: auth.currentUser.displayName,
            authorPhoto: auth.currentUser.photoURL,
            authorId: auth.currentUser.uid,
            timestamp: serverTimestamp()
        });
        document.getElementById('postText').value = "";
        document.getElementById('fileInput').value = "";
        alert("Жарияланды!");
    } catch (e) {
        console.error("Firebase қатесі:", e);
    } finally {
        btn.disabled = false;
        btn.innerText = "Жариялау";
    }
};

// 4. Посттарды лентаға шығару (Real-time)
function loadPosts() {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        feed.innerHTML = "";
        snapshot.forEach((doc) => {
            const post = doc.data();
            const postEl = document.createElement('div');
            postEl.style.borderBottom = "1px solid #333";
            postEl.style.padding = "15px";
            postEl.style.textAlign = "left";
            
            let mediaHtml = "";
            if (post.mediaUrl) {
                if (post.mediaUrl.includes(".mp4") || post.mediaUrl.includes(".mov")) {
                    mediaHtml = `<video src="${post.mediaUrl}" controls style="width:100%; border-radius:10px; margin-top:10px;"></video>`;
                } else {
                    mediaHtml = `<img src="${post.mediaUrl}" style="width:100%; border-radius:10px; margin-top:10px;">`;
                }
            }

            postEl.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${post.authorPhoto}" width="30" style="border-radius:50%">
                    <b>${post.authorName}</b>
                </div>
                <p>${post.text}</p>
                ${mediaHtml}
            `;
            feed.appendChild(postEl);
        });
    });
}

