"use client";

import { useState, useEffect } from "react";

function GoogleSignInButton({ onSignIn, onSignOut }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            if (window.google && window.google.accounts) {
                // google.accounts.id.revokeAll();
            }
        };
    }, []);

    const initializeGoogleSignIn = () => {
        if (!window.google) {
            setLoading(false); // Set loading to false even if google object is not available
            return;
        }


        google.accounts.id.initialize({
            client_id:
                "432675030334-ieq9kj4b892j6n5j6topj4j3h4jr6q4t.apps.googleusercontent.com", //  Client ID
            callback: handleCredentialResponse,
            ux_mode: "popup",
        });


        google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            { theme: "outline", size: "large" }
        );
        setLoading(false);

        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: "432675030334-ieq9kj4b892j6n5j6topj4j3h4jr6q4t.apps.googleusercontent.com",
            scope: 'profile email',
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    // Fetch user data using the access token
                    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`)
                        .then(response => response.json())
                        .then(data => {
                            onSignIn({  // Call onSignIn with the user data
                                uid: data.sub,  // Use 'sub' for a unique user ID
                                email: data.email,
                                displayName: data.name,
                                photoURL: data.picture,
                            });
                        })
                        .catch(error => {
                            console.error("Error fetching user data:", error);
                            alert("Error fetching user data. See console for details.");
                        });
                } else {
                    // Handle errors, e.g. no token, user closed popup, etc.
                    console.error("Token request failed:", tokenResponse);
                    if (tokenResponse.error === 'popup_closed_by_user') {
                        //Specific, user-friendly message.
                        alert("Sign-in popup was closed.  Please try again.");
                    } else {
                        alert("Token request failed. See console for details.");
                    }
                    setLoading(false);
                }
            },
        });

        // Check for existing user session on load
        if (google.accounts.oauth2 && google.accounts.oauth2.hasGrantedAllScopes(
            'profile', 'email'
        )) {
            tokenClient.requestAccessToken(); // Request access token to get user info
        }
    };

    const handleCredentialResponse = (response) => {
        if (response.credential) {
            // Decode the JWT token to get user info (basic info, not sensitive)
            const jwtToken = response.credential;
            const base64Url = jwtToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decodedToken = JSON.parse(jsonPayload);

            onSignIn({
                uid: decodedToken.sub,
                email: decodedToken.email,
                displayName: decodedToken.name,
                photoURL: decodedToken.picture,
            }); // Call onSignIn
        } else {
            console.error("Credential response did not contain a credential", response);
            alert("Google Sign-In failed. See console for details.");
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        if (window.google && window.google.accounts) {
            google.accounts.id.disableAutoSelect();
            google.accounts.id.revokeAll();
        }
        onSignOut(); // Call the onSignOut callback
    };


    if (loading) {
        return <div className="text-center">Loading...</div>; // Basic loading indicator
    }

    return (
        <div>
            <div id="google-signin-button"></div>
             <button onClick={signInWithGoogle}>Sign in with Google</button>
            {/*  signOut is handled within the App component, where the user state is */}
        </div>
    );
}

export default GoogleSignInButton;