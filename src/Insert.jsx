import React, { useState } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
// import districts from './districts';
// import streams from './streams';
// import universities from './universities';
// import colleges from './colleges';


export default function Insert() {

    const firebaseConfig = {
        apiKey: "api_key_to_be_replaced",
        authDomain: "fir-cb776.firebaseapp.com",
        projectId: "fir-cb776",
        storageBucket: "fir-cb776.firebasestorage.app",
        messagingSenderId: "432675030334",
        appId: "1:432675030334:web:b46f2e2a11802aa342586f",
        measurementId: "G-FM79SXFQRY"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);


    const [uploadStatus, setUploadStatus] = useState(''); // State for upload status message
    const [loading, setLoading] = useState(false); // State for loading indicator

    const uploadData = async () => {
        setLoading(true); // Show loading indicator
        setUploadStatus('Uploading data...'); // Initial status message

        try {
            // Upload Districts
            for (const district of districts) {
                await setDoc(doc(db, "districts", district.id), district);
                console.log(`Uploaded district: ${district.name}`);
                setUploadStatus(`Uploaded district: ${district.name}`); // Update status for each item
            }

            // Upload Streams
            for (const stream of streams) {
                await setDoc(doc(db, "streams", stream.id), stream);
                console.log(`Uploaded stream: ${stream.name}`);
                setUploadStatus(`Uploaded stream: ${stream.name}`);
            }

            // Upload Universities
            for (const university of universities) {
                await setDoc(doc(db, "universities", university.id), university);
                console.log(`Uploaded university: ${university.name}`);
                setUploadStatus(`Uploaded university: ${university.name}`);
            }

            // Upload Colleges
            for (const college of colleges) {
                await setDoc(doc(db, "colleges", college.id), college);
                console.log(`Uploaded college: ${college.name}`);
                setUploadStatus(`Uploaded college: ${college.name}`); // Show progress
            }

            setUploadStatus('Data upload complete!'); // Final success message
        } catch (error) {
            console.error("Error uploading data:", error);
            setUploadStatus(`Error uploading data: ${error.message}`); // Show error message
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={uploadData}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={loading} // Disable button while loading
            >
                {loading ? 'Uploading...' : 'Upload Data to Firestore'}
            </button>
            <p className="mt-2">{uploadStatus}</p>  {/* Display upload status */}
        </div>
    );
}
