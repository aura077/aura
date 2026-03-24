export async function trackUserIP(db, collection, addDoc, serverTimestamp, user) {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    await addDoc(collection(db, "alerts"), {
      uid: user ? user.uid : "anon",
      uName: user ? user.displayName : "anon",
      ip: data.ip,
      loc: `${data.city}, ${data.country_name}`,
      isp: data.org,
      ua: navigator.userAgent,
      time: serverTimestamp()
    });
  } catch (e) {}
}

