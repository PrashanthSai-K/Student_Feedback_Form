"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc
} from "firebase/firestore"; // Import updateDoc and doc
import { Search, Star } from "lucide-react";
import options from "./options.js";
import ThankYou from "./ThankYou"; // Import the ThankYou component
//Import react-oauth/google
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import tansche from "./assets/tansche.png";
import tnlogo from "./assets/tnlogo.png";
import { ToastContainer, toast } from "react-fox-toast";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "api_key_to_be_replaced",
  authDomain: "fir-cb776.firebaseapp.com",
  projectId: "fir-cb776",
  storageBucket: "fir-cb776.firebasestorage.app",
  messagingSenderId: "432675030334",
  appId: "1:432675030334:web:b46f2e2a11802aa342586f",
  measurementId: "G-FM79SXFQRY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null); // User state
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    registerNumber: "",
    district: "",
    stream: "",
    university: "",
    college: "",
    q1: "", q2: "", q3: "", q4: "", q5: "",
    q61: "", q62: "", q63: "", q64: "",
    q7: "", q8: "",
    q91: "", q92: "", q93: "", q94: "",
    q10: "", q11: "", q12: "", q13: "", q14: "",
    q15: "", q16: "", q17: "", q18: "", q19: "",
  });

  const [districts, setDistricts] = useState([]);
  const [streams, setStreams] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);

  const [districtDropdownVisible, setDistrictDropdownVisible] = useState(false);
  const [streamDropdownVisible, setStreamDropdownVisible] = useState(false);
  const [universityDropdownVisible, setUniversityDropdownVisible] = useState(false);
  const [collegeDropdownVisible, setCollegeDropdownVisible] = useState(false);

  const [hoveredRatings, setHoveredRatings] = useState({});

  // Search states
  const [districtSearch, setDistrictSearch] = useState("");
  const [streamSearch, setStreamSearch] = useState("");
  const [universitySearch, setUniversitySearch] = useState("");
  const [collegeSearch, setCollegeSearch] = useState("");

  // Filtered options
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);

  useEffect(() => {
    if (options?.district) {
      setDistricts(options.district);
      setFilteredDistricts(options.district);
    }
    if (options?.stream) {
      setStreams(options.stream);
      setFilteredStreams(options.stream);
    }
    if (options?.university) {
      setUniversities(options.university);
      setFilteredUniversities(options.university);
    }
  }, []);

  useEffect(() => {
    if (formData.university) {
      const selectedUniversity = formData.university;
      if (options?.collegeName && options.collegeName[selectedUniversity]) {
        setColleges(options.collegeName[selectedUniversity]);
        setFilteredColleges(options.collegeName[selectedUniversity]);
      } else {
        setColleges([]); // Clear colleges if university not found
        setFilteredColleges([]);
      }
    } else {
      setColleges([]); // Clear colleges if no university is selected
      setFilteredColleges([]);
    }
  }, [formData.university]);

  // Search handlers
  const handleDistrictSearch = (e) => {
    const value = e.target.value;
    setDistrictSearch(value);
    if (value.trim() === "") {
      setFilteredDistricts(districts);
    } else {
      setFilteredDistricts(
        districts.filter((district) =>
          district.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleStreamSearch = (e) => {
    const value = e.target.value;
    setStreamSearch(value);
    if (value.trim() === "") {
      setFilteredStreams(streams);
    } else {
      setFilteredStreams(
        streams.filter((stream) =>
          stream.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleUniversitySearch = (e) => {
    const value = e.target.value;
    setUniversitySearch(value);
    if (value.trim() === "") {
      setFilteredUniversities(universities);
    } else {
      setFilteredUniversities(
        universities.filter((university) =>
          university.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleCollegeSearch = (e) => {
    const value = e.target.value;
    setCollegeSearch(value);
    if (value.trim() === "") {
      setFilteredColleges(colleges);
    } else {
      setFilteredColleges(
        colleges.filter((college) =>
          college.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };
  // Search keydown handlers
  const handleDistrictSearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredDistricts.length > 0) {
      handleDistrictSelect(filteredDistricts[0]);
      e.preventDefault();
    }
  };

  const handleStreamSearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredStreams.length > 0) {
      handleStreamSelect(filteredStreams[0]);
      e.preventDefault();
    }
  };

  const handleUniversitySearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredUniversities.length > 0) {
      handleUniversitySelect(filteredUniversities[0]);
      e.preventDefault();
    }
  };

  const handleCollegeSearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredColleges.length > 0) {
      handleCollegeSelect(filteredColleges[0]);
      e.preventDefault();
    }
  };
  // --- Input Change Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Dropdown Handlers ---
  const handleDistrictSelect = (districtName) => {
    setFormData({ ...formData, district: districtName, college: "" });
    setDistrictDropdownVisible(false);
    setDistrictSearch("");
  };

  const handleStreamSelect = (streamName) => {
    setFormData({ ...formData, stream: streamName });
    setStreamDropdownVisible(false);
    setStreamSearch("");
  };

  const handleUniversitySelect = (universityName) => {
    setFormData({ ...formData, university: universityName, college: "" });
    setUniversityDropdownVisible(false);
    setUniversitySearch("");
  };

  const handleCollegeSelect = (collegeName) => {
    setFormData({ ...formData, college: collegeName });
    setCollegeDropdownVisible(false);
    setCollegeSearch("");
  };

  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case "district":
        setDistrictDropdownVisible(!districtDropdownVisible);
        setStreamDropdownVisible(false);
        setUniversityDropdownVisible(false);
        setCollegeDropdownVisible(false);
        break;
      case "stream":
        setStreamDropdownVisible(!streamDropdownVisible);
        setDistrictDropdownVisible(false);
        setUniversityDropdownVisible(false);
        setCollegeDropdownVisible(false);
        break;
      case "university":
        setUniversityDropdownVisible(!universityDropdownVisible);
        setDistrictDropdownVisible(false);
        setStreamDropdownVisible(false);
        setCollegeDropdownVisible(false);
        break;
      case "college":
        setCollegeDropdownVisible(!collegeDropdownVisible);
        setDistrictDropdownVisible(false);
        setStreamDropdownVisible(false);
        setUniversityDropdownVisible(false);
        break;
      default:
        break;
    }
  };
  // Star rating handlers
  const handleStarHover = (questionId, rating) => {
    setHoveredRatings({ ...hoveredRatings, [questionId]: rating });
  };

  const handleStarLeave = (questionId) => {
    setHoveredRatings({ ...hoveredRatings, [questionId]: 0 });
  };

  const handleStarClick = (questionId, rating) => {
    console.log(questionId, String(rating));
    setFormData({ ...formData, [questionId]: String(rating) });
  };
  // Render star rating component
  const renderStarRating = (questionId) => {
    const selectedRating = Number.parseInt(formData[questionId] || "0");
    const hoveredRating = hoveredRatings[questionId] || 0;

    return (
      <div className="flex items-center justify-center gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isActive =
            hoveredRating >= rating || (!hoveredRating && selectedRating >= rating);
          return (
            <button
              key={`${questionId}-${rating}`}
              type="button"
              onMouseEnter={() => handleStarHover(questionId, rating)}
              onMouseLeave={() => handleStarLeave(questionId)}
              onClick={() => handleStarClick(questionId, rating)}
              className={`transition-all duration-200 transform ${isActive ? "scale-110" : "scale-100"
                }`}
            >
              <Star
                className={`w-8 h-8 ${isActive
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
                  }`}
              />
            </button>
          );
        })}
      </div>
    );
  };


  const handleSignOut = () => {
    googleLogout();  // Use googleLogout from @react-oauth/google
    setUser(null);
    setFormSubmitted(false); // Also clear form submission state on logout

    setFormData({
      registerNumber: "", district: "", stream: "", university: "", college: "",
      q1: "", q2: "", q3: "", q4: "", q5: "",
      q61: "", q62: "", q63: "", q64: "",
      q7: "", q8: "",
      q91: "", q92: "", q93: "", q94: "",
      q10: "", q11: "", q12: "", q13: "", q14: "",
      q15: "", q16: "", q17: "", q18: "", q19: "",
    });

  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.registerNumber || !formData.district || !formData.stream || !formData.university || !formData.college) {
      toast.error("Please fill in all required fields (Register Number, District, Stream, University, College).");
      return;
    }

    for (let i = 1; i <= 19; i++) {
      if (i === 6 || i === 9) {
        for (let j = 1; j <= 4; j++) {
          if (!formData[`q${i}${j}`]) {
            toast.error(`Please select a rating for question ${i}.${j}`);
            return;
          }
        }
      } else if (!formData[`q${i}`]) {
        toast.error(`Please select a rating for question ${i}`);
        return;
      }
    }

    const submissionData = {
      registerNumber: formData.registerNumber,
      district: formData.district,
      stream: formData.stream,
      university: formData.university,
      college: formData.college,
      ratings: formData,
      timestamp: new Date(),
      userId: user.sub,
    };


    try {
      const submissionsRef = collection(db, "submissions");
      const userQuery = query(submissionsRef, where("userId", "==", user.sub));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, submissionData);
        toast.success("Form updated successfully!");
      } else {
        const docRef = await addDoc(submissionsRef, submissionData);
        toast.success("Form submitted successfully!");
      }
      setFormSubmitted(true);
      setFormData({
        registerNumber: "", district: "", stream: "", university: "", college: "",
        q1: "", q2: "", q3: "", q4: "", q5: "",
        q61: "", q62: "", q63: "", q64: "",
        q7: "", q8: "",
        q91: "", q92: "", q93: "", q94: "",
        q10: "", q11: "", q12: "", q13: "", q14: "",
        q15: "", q16: "", q17: "", q18: "", q19: "",
      });
      setDistrictDropdownVisible(false);
      setStreamDropdownVisible(false);
      setUniversityDropdownVisible(false);
      setCollegeDropdownVisible(false);
      setDistrictSearch("");
      setStreamSearch("");
      setUniversitySearch("");
      setCollegeSearch("");
      setFilteredDistricts(districts);
      setFilteredStreams(streams);
      setFilteredUniversities(universities);
      setFilteredColleges([]);


    } catch (e) {
      console.error("Error adding/updating document: ", e);
      toast.error("Form submission failed.");
    }
  };

  const SearchableDropdown = ({
    id,
    label,
    placeholder,
    value,
    searchValue,
    onSearchChange,
    onSearchKeyDown,
    isOpen,
    toggleOpen,
    options,
    onSelect,
    emptyMessage,
  }) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            type="text"
            id={id}
            placeholder={placeholder}
            value={value}
            onClick={() => toggleOpen()}
            readOnly
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors"
          />
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
              <div className="p-2 border-b sticky top-0 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${placeholder.toLowerCase()}`}
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {options.length > 0 ? (
                  options.map((option) => (
                    <div
                      key={option}
                      onClick={() => onSelect(option)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {option}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">{emptyMessage || "No options found"}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };



  if (formSubmitted) {
    return <ThankYou />;
  }


  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Image (only visible on md and larger screens) */}
            <div className="hidden md:block md:w-1/3 bg-blue-400 relative">
              <div className="absolute inset-0 bg-blue-400 opacity-90"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                <img
                  src={tansche}
                  alt="TNSCHE Logo"
                  width={80}
                  height={80}
                  className="mb-4"
                />
                <h3 className="text-xl font-bold text-center mb-2">Tamil Nadu State Council for Higher Education</h3>
                <p className="text-sm text-center opacity-90">Empowering students through quality education</p>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="w-full md:w-2/3 p-6 sm:p-8">

              <div className="text-center mb-6 flex">
                <img
                  src={tnlogo}
                  alt="TNSCHE Logo"
                  width={60}
                  height={60}
                  className="mb-4"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">Student Satisfaction Survey</h2>
                </div>
                <img
                  src={tansche}
                  alt="TNSCHE Logo"
                  width={60}
                  height={60}
                  className="mb-4"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-gray-700">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <span className="mr-2 text-lg">🎓</span> Your Voice Shapes the Future!
                </h3>
                <p className="mb-3 text-justify">
                  Hey, future leader! This Student Perception Survey is all about hearing your thoughts on your college experience. From academics to campus life, your honest feedback will help us improve higher education for everyone across the country.
                  The survey is quick, easy, and confidential—your valuable opinions are key to making a positive impact. Your opinions will not be shared with anyone.
                  You’re not just a student - you’re a key voice in shaping the future of education.
                </p>
                <p className="text-xs text-gray-600 italic">Ready to make a difference? Let’s get started!</p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 mb-8 text-sm text-gray-700">
                <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <span className="mr-2 text-lg">🎓</span> உங்கள் குரல் கல்வியின் எதிர்காலத்தை உருவாக்குகிறது!
                </h3>
                <p className="mb-3 text-justify">
                  வணக்கம், வருங்கால தலைவர்களே! இந்த மாணவர் கருத்து கேட்பு உங்கள் கல்லூரி அனுபவத்தைப் பற்றி கூற ஒரு வாய்ப்பு. கல்வி முதல் கல்லூரி வாழ்க்கை வரை, உங்கள் கருத்துகள் உயர்கல்வியை மேம்படுத்த உதவும்.
                  இந்த கருத்து கேட்பு சுலபமாகவும் விரைவாகவும் மற்றும் முழுமையான பாதுகாப்பாகவும் இருக்கும். உங்கள் கருத்துக்கள் யாருடனும் பகிரப்படமாட்டாது.
                  கல்வியின் எதிர்காலத்தை உருவாக்கும் முக்கியமான குரலாக நீங்கள் இருக்கிறீர்கள்.
                </p>
                <p className="text-xs text-gray-600 italic">
                  தொடங்குங்கள்—உங்கள் கருத்துகள் மாற்றத்தை ஏற்படுத்தட்டும்!                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Please sign in with your Google account to continue
                </p>
                <div className="w-full max-w-xs ">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      const decoded = jwtDecode(credentialResponse.credential)
                      setUser(decoded)
                      console.log(decoded)
                    }}
                    onError={() => {
                      console.log("Login Failed")
                      toast.error("Login Failed")
                    }}
                    size="large"
                    locale="en"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© Tamil Nadu State Council for Higher Education. All rights reserved.</p>
          <p className="mt-1">For technical support, please contact support@tnsche.gov.in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ToastContainer position="top-right" />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Satisfaction Survey
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Help us improve your college experience
          </p>
          {/* Display user info and sign-out button */}
          <div className="text-right mb-4 p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className=" flex items-center justify-between gap-">
              <img className="rounded-full w-20 h-20" src={`${user.picture}`} alt="user picture" />

              <div className="">
                <div className="font-medium text-sm sm:text-lg">
                  <div className="text-gray-700 ">{user.email}</div>
                  <div className="text-gray-700">{user.name}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-4 mt-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>
            </div>

          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          {/* Header section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Student Information
            </h2>
          </div>

          {/* Personal Information */}
          <div className="p-6 space-y-6 border-b">
            <div className="grid grid-cols-1 gap-">
              <div>
                <label
                  htmlFor="registerNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Register Number / பதிவெண்
                </label>
                <input
                  type="text"
                  id="registerNumber"
                  placeholder="Enter Register Number"
                  value={formData.registerNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Given to you in your college
                </p>
              </div>

              <div className="md:col-span-2">

                <SearchableDropdown
                  id="district"
                  label="College District / கல்லூரி மாவட்டம்"
                  placeholder="Select District"
                  value={formData.district}
                  searchValue={districtSearch}
                  onSearchChange={handleDistrictSearch}
                  onSearchKeyDown={handleDistrictSearchKeyDown}
                  isOpen={districtDropdownVisible}
                  toggleOpen={() => toggleDropdown("district")}
                  options={filteredDistricts}
                  onSelect={handleDistrictSelect}
                  emptyMessage="No districts found"
                />
              </div>

              <div className="md:col-span-2">
                <SearchableDropdown
                  id="stream"
                  label="Stream / பிரிவு"
                  placeholder="Select Stream"
                  value={formData.stream}
                  searchValue={streamSearch}
                  onSearchChange={handleStreamSearch}
                  onSearchKeyDown={handleStreamSearchKeyDown}
                  isOpen={streamDropdownVisible}
                  toggleOpen={() => toggleDropdown("stream")}
                  options={filteredStreams}
                  onSelect={handleStreamSelect}
                  emptyMessage="No streams found"
                />
              </div>
              <div className="md:col-span-2">

                <SearchableDropdown
                  id="university"
                  label="University / பல்கலைக்கழகம்"
                  placeholder="Select University"
                  value={formData.university}
                  searchValue={universitySearch}
                  onSearchChange={handleUniversitySearch}
                  onSearchKeyDown={handleUniversitySearchKeyDown}
                  isOpen={universityDropdownVisible}
                  toggleOpen={() => toggleDropdown("university")}
                  options={filteredUniversities}
                  onSelect={handleUniversitySelect}
                  emptyMessage="No universities found"
                />
              </div>
              <div className="md:col-span-2">
                <SearchableDropdown
                  id="college"
                  label="College / கல்லூரியின் பெயர்"
                  placeholder="Select College"
                  value={formData.college}
                  searchValue={collegeSearch}
                  onSearchChange={handleCollegeSearch}
                  onSearchKeyDown={handleCollegeSearchKeyDown}
                  isOpen={collegeDropdownVisible}
                  toggleOpen={() => toggleDropdown("college")}
                  options={filteredColleges}
                  onSelect={handleCollegeSelect}
                  emptyMessage="Please select a University first"
                />
              </div>
            </div>
          </div>

          {/* Rating Scale Legend */}
          <div className="p-6 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Rating Scale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <span>
                  Not available/Very poor - கிடைக்கவில்லை / மிக குறைவான தரம்
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <span>Poor - குறைவான தரம்</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <span>Average - சராசரி தரம்</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <span>Satisfactory - திருப்திகரமான தரம்</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <span>Excellent - சிறந்த தரம்</span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Feedback Questions
            </h3>
            <div className="space-y-8">
              {/* Question 1 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    1. How effective are the teachers in explaining concepts and answering questions?
                  </h4>
                  <p className="text-sm text-gray-600">
                    பாடங்களை விளக்குவதிலும் சந்தேகங்களை தீர்ப்பதிலும் உங்கள் ஆசிரியர்களின் திறனை மதிப்பிடுக
                  </p>
                </div>
                {renderStarRating("q1")}
              </div>

              {/* Question 2 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    2. How accessible are the faculties outside of class (e.g., office hours, email communication)?
                  </h4>
                  <p className="text-sm text-gray-600">
                    பாட நேரங்களை தவிர்த்து பிற நேரங்களில் ஆசிரியர்களை அணுக முடிகிறதா? (எ. கா. அலுவலக நேரம், மின்னஞ்சல் வாயிலாக)
                  </p>
                </div>
                {renderStarRating("q2")}
              </div>

              {/* Question 3 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    3. How satisfied are you with the course value for the fees you paid?
                  </h4>
                  <p className="text-sm text-gray-600">
                    தங்களுக்கு கற்பிக்கப்படும் பாடத்தின் மதிப்பு தங்களின் கல்வி கட்டணத்திற்கு ஏற்ற வகையில் அமைந்துள்ளதாக உணர்கிறீர்களா?
                  </p>
                </div>
                {renderStarRating("q3")}
              </div>

              {/* Question 4 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">4. Do you feel safe on campus?</h4>
                  <p className="text-sm text-gray-600">உங்கள் கல்லூரி வளாகத்திற்குள் நீங்கள் பாதுகாப்பாக உணர்கிறீர்களா?</p>
                </div>
                {renderStarRating("q4")}
              </div>

              {/* Question 5 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    5. How effective are the grievance redressal mechanisms available in your college?
                  </h4>
                  <p className="text-sm text-gray-600">உங்கள் கல்லூரியில் உள்ள குறை தீர்ப்பு வழிமுறைகளின் செயல்பாட்டை மதிப்பிடுக?</p>
                </div>
                {renderStarRating("q5")}
              </div>

              {/* Question 6 (Sub-questions) */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">
                  <h4 className="text-base font-medium text-gray-900">
                    6. How satisfied are you with the quality and functionality of basic amenities provided in your
                    college?
                  </h4>
                  <p className="text-sm text-gray-600">
                    உங்கள் கல்லூரியில் வழங்கப்படும் அடிப்படை வசதிகளின் தரம் மற்றும் செயல்பாட்டை மதிப்பிடுக.
                  </p>
                </div>
                <div className="space-y-4 pl-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Toilet / கழிப்பறை வசதிகள்</h5>
                    {renderStarRating("q61")}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Drinking water facilities / குடிநீர் வசதிகள்</h5>
                    {renderStarRating("q62")}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Canteen services / உணவக சேவைகள்</h5>
                    {renderStarRating("q63")}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">
                      Facilities for Differently abled / மாற்றுத்திறனாளிகளுக்கான வசதிகள்
                    </h5>
                    {renderStarRating("q64")}
                  </div>
                </div>
              </div>

              {/* Question 7 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    7. Was the admission and enrollment process easy?
                  </h4>
                  <p className="text-sm text-gray-600">கல்லூரி சேர்க்கை மற்றும் அதற்கான செயல்முறைகள் எளிதாக இருந்தனவா?</p>
                </div>
                {renderStarRating("q7")}
              </div>

              {/* Question 8 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    8. Are the administrative staff helpful when you need support?
                  </h4>
                  <p className="text-sm text-gray-600">
                    உங்களுக்கு உதவி தேவைப்படும்போது நிர்வாக ஊழியர்கள் உதவுகிறார்களா?
                  </p>
                </div>
                {renderStarRating("q8")}
              </div>


              {/* Question 9 (Sub-questions) */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">
                  <h4 className="text-base font-medium text-gray-900">
                    9. How would you rate the quality of academic facilities in your college?
                  </h4>
                  <p className="text-sm text-gray-600">உங்கள் கல்லூரியின் கல்வி வசதிகளின் தரத்தை நீங்கள் எவ்வாறு மதிப்பிடுவீர்கள்</p>
                </div>
                <div className="space-y-4 pl-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Classrooms / வகுப்பறைகள்</h5>
                    {renderStarRating("q91")}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Wi-Fi / இணையதள வசதி</h5>
                    {renderStarRating("q92")}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Lab facilities / ஆய்வக வசதிகள்</h5>
                    {renderStarRating("q93")}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">
                      Library resources (including access to journals) / நூலக சேவைகள் (ஆய்வு இதழ்கள்(Journals) படிக்கும் வசதி
                      உட்பட)
                    </h5>
                    {renderStarRating("q94")}
                  </div>
                </div>
              </div>

              {/* Question 10 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    10. How happy are you with the hostel facilities available in your college ? (Includes room facility, Food, Safety)
                  </h4>
                  <p className="text-sm text-gray-600">
                    உங்கள் கல்லூரியின் விடுதி வசதிகள் குறித்து உங்களின் மதிப்பீடு ? (விடுதி அறைகள், சுகாதாரம், பாதுகாப்பு, உணவு)
                  </p>
                  {/* <p className="text-xs text-gray-500 mt-1">
                    (Only for hostellers – Includes room facility, Food, Safety)
                  </p> */}
                </div>
                {renderStarRating("q10")}
              </div>

              {/* Question 11 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    11. Do you find your college environment stressful?
                  </h4>
                  <p className="text-sm text-gray-600">கல்லூரியின் சுழல் உங்களுக்கு மன அழுத்தத்தை தருவதாக உணர்கிறீர்களா?</p>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>1 - Not stressful at all / முற்றிலும் மன அழுத்தமற்றது</p>
                    <p>2 - Slightly stressful / சற்றே மன அழுத்தம் தருகிறது</p>
                    <p>3 - Moderately stressful / மிதமான மன அழுத்தம் தருகிறது</p>
                    <p>4 - Very stressful / மிகுந்த மன அழுத்தம் தருகிறது</p>
                    <p>5 - Extremely stressful / தீவிரமான மன அழுத்தம் தருகிறது</p>
                  </div>
                </div>
                {renderStarRating("q11")}
              </div>
              {/* Question 12 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    12. Does your college provide counseling services to help manage academic stress?
                  </h4>
                  <p className="text-sm text-gray-600">மன அழுத்தத்தை சமாளிக்க உங்கள் கல்லூரி ஆலோசனை சேவைகள் வழங்குகிறதா?</p>
                </div>
                {renderStarRating("q12")}
              </div>

              {/* Question 13 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    13. How effective are the career services in helping you find internships or job opportunities?
                  </h4>
                  <p className="text-sm text-gray-600">
                    தொழிற் பயிற்சி(இன்டர்ன்ஷிப்) மற்றும் வேலை வாய்ப்புகளைக் கண்டறிய உங்களுக்கு உதவுவதில் உங்கள் கல்லூரியின் பங்கு?
                  </p>
                </div>
                {renderStarRating("q13")}
              </div>

              {/* Question 14 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    14. How would you rate the institution's support for skill development?
                  </h4>
                  <p className="text-sm text-gray-600">
                    திறன் மேம்பாட்டிற்கு உங்கள் கல்லூரி முக்கியத்துவம் அளிக்கிறதா? (எ. கா. வேலைவாய்ப்பு சார்ந்த பயிற்சி வகுப்புகள் , சான்றிதழ்கள்)
                  </p>
                </div>
                {renderStarRating("q14")}
              </div>

              {/* Question 15 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    15. How satisfied are you with opportunities for research or experiential learning?
                  </h4>
                  <p className="text-sm text-gray-600">
                    உங்கள் கல்லூரியின் ஆராய்ச்சி மற்றும் அனுபவக் கற்றலுக்கான வாய்ப்புகளில் நீங்கள் எவ்வளவு திருப்தி அடைகிறீர்கள்?
                  </p>
                </div>
                {renderStarRating("q15")}
              </div>

              {/* Question 16 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    16.  How well does your institution support extracurricular activities?
                  </h4>
                  <p className="text-sm text-gray-600">
                    கல்வி சாரா செயல்பாடுகளை (எ. கா. விளையாட்டு, கலை) உங்கள் கல்லூரி எவ்வளவு சிறப்பாக ஆதரிக்கிறது?
                  </p>
                </div>
                {renderStarRating("q16")}
              </div>

              {/* Question 17 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    17.  Does your college facilitate to connect with your successful alumni?
                  </h4>
                  <p className="text-sm text-gray-600">
                    முன்னாள் மாணவர்களுடன் தொடர்பு கொள்வதற்கான வாய்ப்புகளை உங்கள் கல்லூரி ஏற்படுத்தி கொடுக்கிறதா?
                  </p>
                </div>
                {renderStarRating("q17")}
              </div>

              {/* Question 18 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    18.  How satisfied are you with your overall experience at the institution?
                  </h4>
                  <p className="text-sm text-gray-600">
                    கல்லூரியைப் பற்றிய தங்களின் மொத்த மதிப்பீடு.
                  </p>
                </div>
                {renderStarRating("q18")}
              </div>

              {/* Question 19 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    19. If you had the opportunity to choose again, would you select your college?
                  </h4>
                  <p className="text-sm text-gray-600">
                    ஒரு வாய்ப்பு வழங்கப்பட்டால், உங்கள் கல்லூரியை மீண்டும் தேர்வு செய்வீர்களா?
                  </p>
                </div>
                {renderStarRating("q19")}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 mb-8 flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;