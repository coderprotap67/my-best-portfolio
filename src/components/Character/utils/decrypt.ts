async function generateAESKey(password: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  return crypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

export const decryptFile = async (
  url: string,
  password: string
): Promise<ArrayBuffer> => {
  const response = await fetch(url);
  
  // চেক করুন ফাইলটি সার্ভারে আছে কি না
  if (!response.ok) {
    throw new Error(`ফাইল পাওয়া যায়নি: ${url} (Status: ${response.status})`);
  }

  const encryptedData = await response.arrayBuffer();
  
  // চেক করুন ডেটা যথেষ্ট বড় কি না
  if (encryptedData.byteLength < 16) {
    throw new Error("ফাইলটি এনক্রিপ্টেড নয় অথবা করাপ্টেড।");
  }

  const iv = new Uint8Array(encryptedData.slice(0, 16));
  const data = encryptedData.slice(16);
  const key = await generateAESKey(password);

  try {
    return await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
  } catch (err) {
    console.error("ডিক্রিপশন ফেইল করেছে! পাসওয়ার্ড ভুল হতে পারে।");
    throw err;
  }
};