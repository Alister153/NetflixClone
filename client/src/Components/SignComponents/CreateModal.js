import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateModal = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const emailIn = useRef();
  const emailValue = useRef();

  const [emailInput2, setEmailInput2] = useState(false);
  const [email2, setEmail2] = useState("");
  const emailIn2 = useRef();
  const emailValue2 = useRef();

  sessionStorage.setItem("page", "create");

  const open_closeAnswer = (e) => {
    const parent = e.target.closest(".questions");
    const grandparent = parent.closest("[data-parent]");
    const answer = parent.querySelector(".answer");
    const prev = grandparent.querySelector("[data-answer");
    answer.dataset.answer = true;
    if (prev) delete prev.dataset.answer;
  };

  const getStarted = (e) => {
    const { value } = e.target
      .closest(".email-form")
      .querySelector("input[type=text]");
    sessionStorage.setItem("email", value);

    navigate("/get-started");
  };

  return (
    <>
      <section className="create--wrapper">
        <div className="header">
          <div className="title-1">
            <h1 style={{ color: "white" }}>
              Unlimited movies, TV shows, and more.
            </h1>
            <p style={{ color: "white" }}>Watch anywhere. Cancel anytime</p>
          </div>
          <div className="title-2">
            <p style={{ color: "white", fontSize: "20px" }}>
              Ready to watch? Enter your email to create or restart your
              membership
            </p>
            <div className={`email-form`} ref={emailIn}>
              <label
                className="email"
                onClick={(e) => {
                  e.stopPropagation();
                  if (email.length === 0) {
                    emailIn.current.classList.toggle("active");
                    setEmailInput(!emailInput);
                  }
                }}
              >
                <p>Email address</p>
                <input
                  type="text"
                  ref={emailValue}
                  value={email}
                  onChange={(e) => {
                    if (emailInput) setEmail(e.target.value);
                  }}
                ></input>
              </label>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (email.length === 0) {
                    setEmailInput(!emailInput);
                    emailIn.current.classList.add("active");
                    emailValue.current.focus();
                  } else {
                    getStarted(e);
                  }
                }}
              >
                Get Started &gt;
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="benefits benefits--1">
        <div className="text--wrapper">
          <h1>Enjoy on your TV.</h1>
          <p>
            Watch on Smart TVs, Playstations, Xbox, Chromecast, Apple Tv and
            more.
          </p>
        </div>
        <div className="image--wrapper">
          <div>
            <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"></img>
            <video
              autoPlay
              loop
              src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-0819.m4v"
            ></video>
          </div>
        </div>
      </section>
      <section className="benefits benefits--2">
        <div className="image--wrapper">
          <div className="container">
            <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"></img>
            <div>
              <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/boxshot.png"></img>
              <span className="download--info">
                <p>Stranger Things</p>
                <p style={{ color: "#004ea4" }}>Downloading..</p>
              </span>
              <span className="downloading">
                <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/download-icon.gif"></img>
              </span>
            </div>
          </div>
        </div>
        <div className="text--wrapper">
          <h1>Download your shows to watch offline.</h1>
          <p>Save your favorites easily and always have something to watch.</p>
        </div>
      </section>
      <section className="benefits benefits--3">
        <div className="text--wrapper">
          <h1>Watch everywhere.</h1>
          <p>
            Stream unlimited movies and TV shows on your phone, tablet, laptop,
            and TV without paying more.
          </p>
        </div>
        <div className="image--wrapper">
          <div>
            <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"></img>
            <video
              loop
              autoPlay
              src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-devices.m4v"
            ></video>
          </div>
        </div>
      </section>
      <section className="benefits benefits--4">
        <div className="image--wrapper">
          <div>
            <img src="https://occ-0-5515-1490.1.nflxso.net/dnm/api/v6/19OhWN2dO19C9txTON9tvTFtefw/AAAABfpnX3dbgjZ-Je8Ax3xn0kXehZm_5L6-xe6YSTq_ucht9TI5jwDMqusWZKNYT8DfGudD0_wWVVTFLiN2_kaQJumz2iivUWbIbAtF.png?r=11f"></img>
          </div>
        </div>
        <div className="text--wrapper">
          <h1>Create profiles for kids.</h1>
          <p>
            Send kids on adventures with their favorite characters in a space
            made just for them—free with your membership.
          </p>
        </div>
      </section>
      <section className="questions--wrapper benefits">
        <div className="main-questions" data-parent>
          <div className="title">
            <h1>Frequently Asked Questions</h1>
          </div>
          <div className="questions">
            <div className="question" onClick={open_closeAnswer}>
              <div>What is Netflix</div>
              <div className="cross">+</div>
            </div>
            <div className="answer">
              <p>
                Netflix is a streaming service that offers a wide variety of
                award-winning TV shows, movies, anime, documentaries, and more
                on thousands of internet-connected devices. <br /> You can watch
                as much as you want, whenever you want without a single
                commercial - all for one low monthly price. There's always
                something new to discover and new TV shows and movies are added
                every week!
              </p>
            </div>
          </div>
          <div className="questions">
            <div className="question" onClick={open_closeAnswer}>
              <div>How much does Netflix cost?</div>
              <div className="cross">+</div>
            </div>
            <div className="answer">
              <p>
                Watch Netflix on your smartphone, tablet, Smart TV, laptop, or
                streaming device, all for one fixed monthly fee. Plans range
                from EUR9.39 to EUR13.99 a month. No extra costs, no contracts.
              </p>
            </div>
          </div>
          <div className="questions">
            <div className="question" onClick={open_closeAnswer}>
              <div>Where can I watch?</div>
              <div className="cross">+</div>
            </div>
            <div className="answer">
              <p>
                Watch anywhere, anytime. Sign in with your Netflix account to
                watch instantly on the web at netflix.com from your personal
                computer or on any internet-connected device that offers the
                Netflix app, including smart TVs, smartphones, tablets,
                streaming media players and game consoles. <br /> You can also
                download your favorite shows with the iOS, Android, or Windows
                10 app. Use downloads to watch while you're on the go and
                without an internet connection. Take Netflix with you anywhere.
              </p>
            </div>
          </div>
          <div className="questions">
            <div className="question" onClick={open_closeAnswer}>
              <div>How do I cancel?</div>
              <div className="cross">+</div>
            </div>
            <div className="answer">
              <p>
                Netflix is flexible. There are no pesky contracts and no
                commitments. You can easily cancel your account online in two
                clicks. There are no cancellation fees – start or stop your
                account anytime.
              </p>
            </div>
          </div>
          <div className="questions">
            <div className="question" onClick={open_closeAnswer}>
              <div>What can I watch on Netflix?</div>
              <div className="cross">+</div>
            </div>
            <div className="answer">
              <p>
                Netflix has an extensive library of feature films,
                documentaries, TV shows, anime, award-winning Netflix originals,
                and more. Watch as much as you want, anytime you want.
              </p>
            </div>
          </div>
          <div className="questions">
            <div className="question" onClick={open_closeAnswer}>
              <div>Is Netflix good for kids?</div>
              <div className="cross">+</div>
            </div>
            <div className="answer">
              <p>
                The Netflix Kids experience is included in your membership to
                give parents control while kids enjoy family-friendly TV shows
                and movies in their own space. <br />
                Kids profiles come with PIN-protected parental controls that let
                you restrict the maturity rating of content kids can watch and
                block specific titles you don’t want kids to see.
              </p>
            </div>
          </div>
          <div className="questions">
            <div className="question" onClick={open_closeAnswer}>
              <div>Why am I seeing this language?</div>
              <div className="cross">+</div>
            </div>
            <div className="answer">
              <p>Your browser preferences determine the language shown here.</p>
            </div>
          </div>
        </div>
        <div className="title-2">
          <p style={{ color: "white", fontSize: "20px" }}>
            Ready to watch? Enter your email to create or restart your
            membership
          </p>
          <div className={`email-form`} ref={emailIn2}>
            <label
              className="email"
              onClick={(e) => {
                e.stopPropagation();
                if (email2.length === 0)
                  emailIn2.current.classList.toggle("active");
                setEmailInput2(!emailInput2);
              }}
            >
              <p>Email address</p>
              <input
                type="text"
                ref={emailValue2}
                value={email2}
                onChange={(e) => {
                  if (emailInput2) setEmail2(e.target.value);
                }}
              ></input>
            </label>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (email2.length === 0) {
                  emailIn2.current.classList.add("active");
                  emailValue2.current.focus();
                } else {
                  getStarted(e);
                }
              }}
            >
              Get Started &gt;
            </button>
          </div>
        </div>
      </section>
      <section className="footer--wrapper benefits">
        <div className="footer">
          <p>Questions? Don't contact me.</p>
          <p>Netflix Clone</p>
        </div>
      </section>
    </>
  );
};

export default CreateModal;
