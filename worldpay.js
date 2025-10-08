function populateChallengeIframe() {
    const childFrame = document.getElementById('challengeIframe').contentWindow;
    const orderCode = document.getElementById('orderCode').value;
    // sandbox
    const payload =
        {
            "jti": generateUUID(),
            "iat": generateEpochTimestamp(),
            "iss": "65310a27241d9f5ee4eabc28",
            "OrgUnitId": "65310a272ea8fe5867da56b0",
            "ReturnUrl": "http://localhost:8080/adapters/wp/webhooks/return-url",
            "Payload": {
                "ACSUrl": "https://1merchantacsstag.cardinalcommerce.com/MerchantACSWeb/creq.jsp",
                "Payload": "eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiI1YjE1ZGFjMS1kNDljLTQ3MzQtODFmNi0zYjk4OTQyNDE5MTIiLCJhY3NUcmFuc0lEIjoiY2Y5ZjViODAtYzc5Ny00YzEzLWE4ZmItMzVkNjFiMTdhYjdjIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAyIn0"
            },
            "ObjectifyPayload": true
        };
    const jwt = generateJwt(payload);
    const data = {jwt: jwt, md: orderCode};
    childFrame.postMessage(data, '*');
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateEpochTimestamp() {
    var currentTime = new Date().getTime();
    return Math.floor(currentTime / 1000);
}

function base64url(source) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    return encodedSource;
}

function generateJwt(payload) {
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    };

    const encodedHeader = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
    const encodedPayload = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));

    const signature = encodedHeader + "." + encodedPayload;

    const secret = "716b7b91-2042-435f-852c-4fffa94e294b"; // sandbox

    const hash = CryptoJS.HmacSHA256(signature, secret);
    const signatureBase64url = base64url(hash);

    console.log("encodedHeader:", encodedHeader);
    console.log("encodedPayload:", encodedPayload);
    console.log("JWT Signature:", signatureBase64url);
    return encodedHeader + "." + encodedPayload + "." + signatureBase64url;
}
