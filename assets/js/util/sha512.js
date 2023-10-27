export default async function sha512(str) {
    const encoder = new TextEncoder('utf-8');
    const encodedString = encoder.encode(str);

    const bytes = await crypto.subtle.digest('SHA-512', encodedString);

    const byteArray = Array.from(new Uint8Array(bytes));
    
    const hashedString = byteArray
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    return {
        hashedString,
        byteArray
    };
}
