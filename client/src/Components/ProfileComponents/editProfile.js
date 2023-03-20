import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { ProfilesData } from "../../App";
import { auth } from "../../firebase";
import { userData } from "../userData";
import { baseUrl } from "../../url";

var imgTimeout = 0;
const EditProfile = () => {
  const navigate = useNavigate();
  const { Allprofiles } = useContext(ProfilesData);
  const [edit, setEdit] = useState(false);
  const [editProfile, setEditProfile] = useState();
  const [showsImages, setShowImages] = useState(false);
  const [editProfileName, setEditProfileName] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const profileImg = useRef();

  const deleteProf = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: editProfileName,
    };
    axios
      .post(
        `${baseUrl}/api/profile/delete-profile`,
        data
      )
      .then((res) => {
        setEdit();
        NotificationManager.success(res.data);
      });
  };

  const saveProf = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: editProfile.name,
      newName: editProfileName,
      picture: selectedImage,
    };

    axios
      .post(
        `${baseUrl}/api/profile/update-profile`,
        data
      )
      .then((res) => {
        setEdit();
        NotificationManager.success(res.data);
      });
  };

  const animateImage = () => {
    const img = profileImg.current;
    if (imgTimeout) clearTimeout(imgTimeout);
    img.style.boxShadow = `none`;
    img.classList.remove("on");
    img.classList.add("off");
    imgTimeout = setTimeout(() => {
      img.classList.remove("off");
      img.classList.add("on");
      img.src = selectedImage;
    }, 200);
  };

  useEffect(() => {
    if (selectedImage) animateImage();
  }, [selectedImage]);

  useEffect(() => {
    if (edit) {
      setSelectedImage(editProfile.data.picture);
      setEditProfileName(editProfile.name);
    }
  }, [edit]);

  return (
    <>
      <header className="logo px-10 flex items-center">
        <div className="">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png?20190206123158"></img>
        </div>
      </header>
      {!edit ? (
        <main className="Profiles--wrapper">
          {Allprofiles && (
            <>
              <div className="header">
                <h1>Who's watching?</h1>
              </div>
              <div className="profiles">
                <div className="profiles--wrapper">
                  {Allprofiles.map((p) => {
                    return (
                      <div
                        className="img-wrapper"
                        onClick={() => {
                          setEdit(true);
                          setEditProfile(p);
                        }}
                      >
                        <figure className="relative">
                          <img loading="lazy" src={p.data.picture}></img>
                          <div className="edit-icon absolute flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              class="svg-icon svg-icon-edit"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M22.2071 7.79285L15.2071 0.792847L13.7929 2.20706L20.7929 9.20706L22.2071 7.79285ZM13.2071 3.79285C12.8166 3.40232 12.1834 3.40232 11.7929 3.79285L2.29289 13.2928C2.10536 13.4804 2 13.7347 2 14V20C2 20.5522 2.44772 21 3 21H9C9.26522 21 9.51957 20.8946 9.70711 20.7071L19.2071 11.2071C19.5976 10.8165 19.5976 10.1834 19.2071 9.79285L13.2071 3.79285ZM17.0858 10.5L8.58579 19H4V14.4142L12.5 5.91417L17.0858 10.5Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </figure>
                        <span>
                          <p className="user">{p.name}</p>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                className="done"
                onClick={() => {
                  navigate("/");
                }}
              >
                Done
              </button>
            </>
          )}
        </main>
      ) : (
        <main className="Profiles--wrapper">
          <div className="edit-profile--wrapper">
            <div className="header border-b border-neutral-500">
              <h1 className="text-5xl w-full">Edit Profile</h1>
            </div>
            <div className="w-full profile py-2 border-b border-neutral-500">
              <div className="profile-image--wrapper">
                <figure
                  className="relative"
                  onClick={() => {
                    setShowImages(!showsImages);
                  }}
                >
                  <img src={selectedImage} ref={profileImg}></img>
                  <div className="edit-icon absolute flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="svg-icon svg-icon-edit"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M22.2071 7.79285L15.2071 0.792847L13.7929 2.20706L20.7929 9.20706L22.2071 7.79285ZM13.2071 3.79285C12.8166 3.40232 12.1834 3.40232 11.7929 3.79285L2.29289 13.2928C2.10536 13.4804 2 13.7347 2 14V20C2 20.5522 2.44772 21 3 21H9C9.26522 21 9.51957 20.8946 9.70711 20.7071L19.2071 11.2071C19.5976 10.8165 19.5976 10.1834 19.2071 9.79285L13.2071 3.79285ZM17.0858 10.5L8.58579 19H4V14.4142L12.5 5.91417L17.0858 10.5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </figure>
                {showsImages && (
                  <div className="all-images">
                    <div className="all-images--wrapper">
                      {Object.keys(userData).map((k) => {
                        return (
                          <div
                            className=""
                            onClick={() => {
                              setSelectedImage(userData[k].img);
                              setShowImages(false);
                            }}
                          >
                            <img
                              src={userData[k].img}
                              className="w-full h-full cursor-pointer"
                            ></img>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-0 mt-4 lg:ml-3 lg:mt-0">
                <div className="">
                  <input
                    className="bg-neutral-700 text-white py-1 px-4 mb-2"
                    value={editProfileName}
                    onChange={(e) => {
                      setEditProfileName(e.target.value);
                    }}
                  />
                  <div className="w-32">
                    <h2 className="text-2xl mb-1">Language:</h2>
                    <div
                      className="language-options bg-neutral-800 border-2 px-2 py-1 rounded-none relative cursor-pointer"
                      onClick={(e) => {
                        e.currentTarget.classList.toggle("active");
                      }}
                    >
                      <p>English</p>
                      <span
                        className="absolute top-full left-0 w-full
                      px-3 py-2 bg-black z-10"
                      >
                        <p className="hover:underline ">Deutsch</p>
                        <p className="hover:underline text-yellow-200">
                          Minionese
                        </p>
                        <p className="hover:underline ">Japanese</p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-around flex-col lg:flex-row">
              <button
                className="save"
                onClick={(e) => {
                  if (editProfileName.length > 0) saveProf();
                }}
              >
                Save
              </button>
              <button
                className="cancel"
                onClick={() => {
                  setEdit();
                }}
              >
                Cancel
              </button>
              <button className="delete" onClick={deleteProf}>
                Delete Profile
              </button>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default EditProfile;
