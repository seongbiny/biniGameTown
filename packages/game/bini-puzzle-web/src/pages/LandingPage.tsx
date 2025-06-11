import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";

export default function LandingPage() {
  return (
    <PageContainer>
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          backgroundImage: "url(/images/bubble.png",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col items-center">
          <div
            className="text-center mb-10"
            style={{
              fontSize: "40px",
              lineHeight: "93%",
              letterSpacing: "12%",
              color: "#ffffff",
              textShadow: "none",
            }}
          >
            THE
            <br />
            BINI PUZZLE
            <br />
            GAME
          </div>

          <div className="space-y-3">
            <Link
              to="/signin"
              className="flex items-center justify-center font-bold"
              style={{
                width: "335px",
                height: "52px",
                backgroundColor: "#FF7E89",
                border: "2px solid black",
                borderRadius: "12px",
                fontSize: "24px",
                color: "black",
                textDecoration: "none",
              }}
            >
              Start Now
            </Link>

            <Link
              to="/signup"
              className="flex items-center justify-center font-bold"
              style={{
                width: "335px",
                height: "52px",
                backgroundColor: "#E4DBDD",
                border: "2px solid black",
                borderRadius: "12px",
                fontSize: "24px",
                color: "black",
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </div>

          <div
            className="text-center mt-16"
            style={{
              fontSize: "20px",
              color: "black",
              marginTop: "64px",
            }}
          >
            Already have an account?
          </div>
          <Link
            to="/signin"
            style={{
              fontSize: "24px",
              color: "black",
              textDecoration: "underline",
              marginTop: "8px",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
