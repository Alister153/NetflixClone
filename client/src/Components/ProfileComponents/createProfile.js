import { useEffect, useRef, useState } from "react";
import { userData } from "../userData";
import { usePalette } from "react-palette";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../firebase";
import { baseUrl } from "../../url";

var imgTimeout = 0;
const CreateProfile = () => {
  const navigate = useNavigate();
  const [showsImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [ProfileName, setProfileName] = useState("");
  const [ProfileActive, setProfileActive] = useState(false);
  const profileImg = useRef();
  const { vibrant } = usePalette(selectedImage).data;

  const createProfile = () => {
    const data = {
      name: ProfileName,
      picture: selectedImage,
      userId: auth.currentUser.uid,
    };

    axios.post(`/api/profile/create-profile`, data).then((res) => {
      navigate("/");
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

  return (
    <>
      <header className="logo">
        <div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png?20190206123158"></img>
        </div>
      </header>
      <div className="create-profile-wrapper">
        <div className="profile-image--wrapper">
          <figure
            style={{ marginBottom: "10px" }}
            onClick={() => {
              setShowImages(!showsImages);
            }}
          >
            {selectedImage && (
              <img
                ref={profileImg}
                style={{ boxShadow: `0px 0px 20px ${vibrant}` }}
              ></img>
            )}
          </figure>
          <p style={{ fontSize: "20px", height: "20px" }}>{ProfileName}</p>
          {showsImages && (
            <div className="all-images">
              <div className="all-images--wrapper">
                {Object.keys(userData).map((k) => {
                  return (
                    <div
                      onClick={() => {
                        setSelectedImage(userData[k].img);
                        setShowImages(false);
                      }}
                    >
                      <img src={userData[k].img}></img>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div></div>
        </div>
        <div className="input-fields--wrapper">
          <label className={ProfileActive && "active"}>
            <p>Profile</p>
            <input
              type="text"
              value={ProfileName}
              onChange={(e) => {
                if (ProfileActive) setProfileName(e.target.value);
              }}
              onClick={(e) => {
                if (ProfileName.length === 0) setProfileActive(!ProfileActive);
              }}
            ></input>
          </label>
          <div className="btn-wrapper">
            <button
              className="cancel"
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </button>
            <button className="save" onClick={createProfile}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProfile;
